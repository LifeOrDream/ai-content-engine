/**
 * Shared fal.ai media helpers — image edit, image→video, S3 upload, and a
 * lightweight Gemini frame validator.
 *
 * The mint asset worker (`assetGenerationWorker.service.ts`) has its own
 * private copies of the image/S3 logic; this module is the shared surface the
 * mutation-content pipeline uses so we don't import the whole worker module
 * (BullMQ Worker setup et al.) just to reach a fetch helper. The two can
 * converge later — kept separate now to avoid churning live mint code.
 *
 * Everything is env-configurable so the exact fal model slugs / params can be
 * tuned without a code change:
 *   FAL_API_KEY                  — fal.ai key (required for real generation)
 *   FAL_IMAGE_MODEL              — image edit model (default nano-banana-2/edit)
 *   MUTATION_VIDEO_FAL_MODEL     — image→video model (default Seedance 2.0)
 *   MUTATION_VIDEO_DURATION_SECS — clip length hint (default 8)
 *   GEMINI_KEY / STORY/asset GEMINI model — frame validation
 */
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { GoogleGenAI, createUserContent } from "@google/genai";

import { getHashBeastAssetBucketName } from "./hashbeastAssetBucket.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { logger } from "./logger.js";

/**
 * Ambient fal API key for the current async operation. The fal key pool
 * (falKeyPool.service) runs each generation inside `falKeyStore.run({key}, fn)`
 * so every fal call within it uses that key — enabling N keys × M parallel jobs
 * without threading the key through every function signature.
 */
export const falKeyStore = new AsyncLocalStorage<{ key: string }>();

const FAL_API_KEY = process.env.FAL_API_KEY || "";
const FAL_API_URL = process.env.FAL_API_URL || "https://fal.run";
// All fal models we use are async QUEUE models: submit → poll status → result.
const FAL_QUEUE_URL = process.env.FAL_QUEUE_URL || "https://queue.fal.run";
const FAL_POLL_INTERVAL_MS = Math.max(
  1000,
  Number(process.env.FAL_POLL_INTERVAL_MS || 3000),
);
const FAL_IMAGE_MODEL =
  process.env.FAL_IMAGE_MODEL || "fal-ai/nano-banana-2/edit";

// Seedance image→video. Default to the same Seedance 2.0 endpoint used by the
// trailer pipeline; override via env if fal changes the slug or we A/B a model.
const VIDEO_MODEL =
  process.env.MUTATION_VIDEO_FAL_MODEL ||
  "bytedance/seedance-2.0/image-to-video";
const VIDEO_DURATION_SECS = Math.max(
  4,
  Number(process.env.MUTATION_VIDEO_DURATION_SECS || 8),
);
const VIDEO_TIMEOUT_MS = Math.max(
  10_000,
  Number(process.env.MUTATION_VIDEO_TIMEOUT_MS || 900_000),
);

// ── Voice / audio (all fal-hosted) ──
// MiniMax Voice Design — invents a NEW synthetic voice from a text description
// and returns a reusable custom voice id (no human sample needed).
const VOICE_DESIGN_MODEL =
  process.env.FAL_VOICE_DESIGN_MODEL || "fal-ai/minimax/voice-design";
// MiniMax Speech-02 HD — TTS that renders text with a given voice id.
const TTS_MODEL = process.env.FAL_TTS_MODEL || "fal-ai/minimax/speech-02-hd";
// Text-to-audio for the MUSIC bed + per-shot SFX. Stable Audio handles both
// (prompt + seconds_total, ≤47s); swap to CassetteAI via env for cheaper/faster.
const MUSIC_MODEL = process.env.FAL_MUSIC_MODEL || "fal-ai/stable-audio";
const SFX_MODEL = process.env.FAL_SFX_MODEL || "fal-ai/stable-audio";
// Sync.so lip-sync — marries a generated voice track to a talking-head clip.
const LIPSYNC_MODEL = process.env.FAL_LIPSYNC_MODEL || "fal-ai/sync-lipsync/v2";

const GEMINI_API_KEY = process.env.GEMINI_KEY || "";
const GEMINI_VISION_MODEL =
  process.env.MUTATION_VALIDATE_MODEL || "gemini-2.5-flash";

const BUCKET_NAME = getHashBeastAssetBucketName();
const ASSETS_BASE_URL =
  process.env.HASHBEAST_ASSETS_BASE_URL ||
  "https://assets.minebtc.fun/hashbeast-assets";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

let genai: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!genai) genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  return genai;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  input: string | URL,
  init?: RequestInit,
  opts: { attempts?: number; label?: string } = {},
): Promise<Response> {
  const attempts = Math.max(1, opts.attempts || 4);
  let lastError: unknown;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const res = await fetch(input, init);
      if (res.ok || (res.status < 500 && res.status !== 429)) return res;
      lastError = new Error(`${opts.label || "fetch"} ${res.status}: ${(await res.text()).slice(0, 300)}`);
    } catch (err) {
      lastError = err;
    }
    if (i < attempts) await sleep(1000 * i);
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError || "fetch failed"));
}

export async function fetchAsBuffer(url: string): Promise<Buffer> {
  const res = await fetchWithRetry(url, undefined, { attempts: 5, label: `fetch ${url}` });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Run a fal model via the async QUEUE API: submit → poll status → fetch result.
 * All fal models we use (nano-banana, Seedance, MiniMax, sync-lipsync) are
 * queue models; the synchronous endpoint times out on video/lip-sync. Returns
 * the model's output JSON (the `data` payload). Honors `timeoutMs`.
 */
interface FalRunMeta {
  model: string;
  requestId?: string;
  statusUrl?: string;
  responseUrl?: string;
}

interface FalRunResult {
  data: any;
  meta: FalRunMeta;
}

function requestIdFromSubmit(submit: any): string | undefined {
  const direct = submit?.request_id || submit?.requestId || submit?.id;
  if (direct) return String(direct);
  for (const value of [submit?.status_url, submit?.response_url]) {
    if (!value || typeof value !== "string") continue;
    const match = value.match(/\/requests\/([^/?#]+)/i);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }
  return undefined;
}

function attachFalMeta(data: any, meta: FalRunMeta): any {
  if (data && typeof data === "object") {
    Object.defineProperty(data, "__falMeta", {
      value: meta,
      enumerable: false,
      configurable: true,
    });
  }
  return data;
}

async function falRunDetailed(
  model: string,
  input: Record<string, unknown>,
  timeoutMs = 120_000,
): Promise<FalRunResult> {
  // Use the key bound to the current async context (set by the fal key pool
  // via withFalKey) so parallel jobs run on different keys; fall back to the
  // single env key when no pool context is active.
  const apiKey = falKeyStore.getStore()?.key || FAL_API_KEY;
  if (!apiKey) throw new Error("FAL_API_KEY not configured");
  const headers = {
    Authorization: `Key ${apiKey}`,
    "Content-Type": "application/json",
  };
  // 1. Submit.
  const submitRes = await fetchWithRetry(`${FAL_QUEUE_URL}/${model}`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  }, { attempts: 3, label: `fal submit ${model}` });
  if (!submitRes.ok) {
    throw new Error(`fal submit ${model} ${submitRes.status}: ${await submitRes.text()}`);
  }
  const submit = await submitRes.json();
  const statusUrl: string | undefined = submit?.status_url;
  const responseUrl: string | undefined = submit?.response_url;
  const meta: FalRunMeta = {
    model,
    requestId: requestIdFromSubmit(submit),
    statusUrl,
    responseUrl,
  };
  if (!statusUrl || !responseUrl) {
    // Some models answer synchronously even via queue — accept a direct payload.
    if (submit && (submit.images || submit.video || submit.audio)) return { data: attachFalMeta(submit, meta), meta };
    throw new Error(`fal submit ${model}: no status/response url`);
  }
  // 2. Poll. The response endpoint can briefly report "still in progress"
  // even after status says completed, so result fetching is part of the loop.
  const deadline = Date.now() + timeoutMs;
  let lastStatus: any = null;
  while (Date.now() < deadline) {
    await sleep(FAL_POLL_INTERVAL_MS);
    const sres = await fetchWithRetry(statusUrl, { headers }, { attempts: 3, label: `fal status ${model}` });
    if (!sres.ok) {
      lastStatus = { status_http: sres.status, body: (await sres.text()).slice(0, 300) };
      continue;
    }
    const st = await sres.json();
    lastStatus = st;
    const status = st?.status;
    if (status === "FAILED" || status === "ERROR") {
      throw new Error(`fal ${model} failed: ${JSON.stringify(st).slice(0, 300)}`);
    }
    if (status !== "COMPLETED") continue;

    const rres = await fetchWithRetry(responseUrl, { headers }, { attempts: 3, label: `fal result ${model}` });
    if (rres.ok) {
      const data = await rres.json();
      return { data: attachFalMeta(data, meta), meta };
    }

    const text = await rres.text();
    if (rres.status === 400 && /still in progress/i.test(text)) {
      lastStatus = { ...st, response_http: rres.status, response_body: text.slice(0, 300) };
      continue;
    }
    throw new Error(`fal result ${model} ${rres.status}: ${text}`);
  }
  throw new Error(
    `fal ${model} timed out after ${timeoutMs}ms: ${JSON.stringify(lastStatus).slice(0, 300)}`,
  );
}

async function falRun(
  model: string,
  input: Record<string, unknown>,
  timeoutMs = 120_000,
): Promise<any> {
  return (await falRunDetailed(model, input, timeoutMs)).data;
}

export async function imageUrlToBase64DataUri(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  const ct = res.headers.get("content-type") || "image/png";
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:${ct};base64,${buf.toString("base64")}`;
}

// ---------------------------------------------------------------------------
// Image edit (nano-banana-2) — generate a new image from a reference + prompt
// ---------------------------------------------------------------------------

export interface GeneratedMedia {
  url: string; // fal-hosted source URL
  buffer: Buffer;
  model?: string;
  requestId?: string;
}

export async function generateImageEdit(
  prompt: string,
  referenceImageUrl: string,
  opts: { aspectRatio?: string; resolution?: "1K" | "2K" | "4K"; model?: string } = {},
): Promise<GeneratedMedia> {
  const referenceBase64 = await imageUrlToBase64DataUri(referenceImageUrl);
  return generateImageEditFromDataUris(prompt, [referenceBase64], opts);
}

/**
 * Image edit from local buffers (one or more reference images). Used by the
 * base-body evolution generator, which references previous-level PNGs on disk.
 * Multiple references are supported (nano-banana-2 takes an image array) —
 * pass e.g. [prevLevel, baseBody] when you want to anchor on two inputs.
 */
export async function generateImageEditFromBuffers(
  prompt: string,
  refs: Array<{ buffer: Buffer; mime?: string }>,
  opts: { aspectRatio?: string; resolution?: "1K" | "2K" | "4K"; model?: string } = {},
): Promise<GeneratedMedia> {
  const dataUris = refs.map(
    (r) =>
      `data:${r.mime || "image/png"};base64,${r.buffer.toString("base64")}`,
  );
  return generateImageEditFromDataUris(prompt, dataUris, opts);
}

async function generateImageEditFromDataUris(
  prompt: string,
  imageDataUris: string[],
  opts: { aspectRatio?: string; resolution?: "1K" | "2K" | "4K"; model?: string } = {},
): Promise<GeneratedMedia> {
  const imageModel = opts.model || FAL_IMAGE_MODEL;
  const data = await falRun(
    imageModel,
    {
      prompt,
      num_images: 1,
      aspect_ratio: opts.aspectRatio || "1:1",
      output_format: "png",
      resolution: opts.resolution || "1K",
      safety_tolerance: "6",
      image_urls: imageDataUris,
    },
    Math.max(60_000, Number(process.env.FAL_IMAGE_TIMEOUT_MS || 120_000)),
  );
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error("fal image edit returned no image");
  const meta = data?.__falMeta as FalRunMeta | undefined;
  return {
    url,
    buffer: await fetchAsBuffer(url),
    model: meta?.model || imageModel,
    requestId: meta?.requestId,
  };
}

// ---------------------------------------------------------------------------
// Image → video (Seedance) — start frame + optional end frame
// ---------------------------------------------------------------------------

/**
 * Generate a short clip animating from a start frame (and optionally toward an
 * end frame), driven by `prompt`. Model + param names are env-configurable
 * because different fal video models name the end frame differently
 * (end_image_url / tail_image_url / last_image_url). We send the common
 * `image_url` (start) always, and the configured end-frame key when an end
 * frame is provided.
 */
export async function generateVideoFromFrames(
  prompt: string,
  startFrameUrl: string,
  endFrameUrl?: string,
  opts: {
    durationSecs?: number;
    resolution?: string;
    aspectRatio?: string;
    /** Override the fal endpoint (e.g. "bytedance/seedance-2.0/image-to-video"). Defaults to VIDEO_MODEL. */
    model?: string;
    /** Seedance 2.0: native synchronized audio (SFX/ambient/lip-synced speech). Sent only when set — older endpoints reject unknown fields. */
    generateAudio?: boolean;
  } = {},
): Promise<GeneratedMedia> {
  const endFrameKey =
    process.env.MUTATION_VIDEO_END_FRAME_KEY || "end_image_url";

  const body: Record<string, unknown> = {
    prompt,
    image_url: startFrameUrl,
    // Seedance `duration` is a string enum (v1: "2".."12"; 2.0: "4".."15" | "auto").
    duration: String(opts.durationSecs || VIDEO_DURATION_SECS),
    resolution: opts.resolution || process.env.MUTATION_VIDEO_RESOLUTION || "720p",
    aspect_ratio: opts.aspectRatio || process.env.MUTATION_VIDEO_ASPECT || "9:16",
  };
  if (endFrameUrl) body[endFrameKey] = endFrameUrl;
  if (opts.generateAudio !== undefined) body.generate_audio = opts.generateAudio;

  const data = await falRun(opts.model || VIDEO_MODEL, body, VIDEO_TIMEOUT_MS);
  // fal video models return { video: { url } } (most) or { videos: [{url}] }.
  const url = data?.video?.url || data?.videos?.[0]?.url;
  if (!url) throw new Error("fal video returned no url");
  const meta = data?.__falMeta as FalRunMeta | undefined;
  return {
    url,
    buffer: await fetchAsBuffer(url),
    model: meta?.model || opts.model || VIDEO_MODEL,
    requestId: meta?.requestId,
  };
}

// ---------------------------------------------------------------------------
// Voice design + TTS + lip-sync (MiniMax + Sync.so, all on fal)
// ---------------------------------------------------------------------------

/**
 * Design a brand-new synthetic voice from a text description (MiniMax Voice
 * Design). Returns a reusable `voiceId` (the TTS anchor) plus a preview URL.
 * The voice id must be USED at least once within ~7 days or it is dropped — so
 * callers should design-then-immediately-synthesize.
 */
export async function designVoice(
  description: string,
  previewText: string,
): Promise<{ voiceId: string; previewUrl: string }> {
  const data = await falRun(VOICE_DESIGN_MODEL, {
    prompt: description,
    preview_text: previewText.slice(0, 200) || "Let's go!",
  });
  const voiceId =
    data?.custom_voice_id || data?.voice_id || data?.voice?.id || "";
  if (!voiceId) throw new Error("voice design returned no voice id");
  const previewUrl = data?.audio?.url || data?.preview_audio?.url || "";
  return { voiceId, previewUrl };
}

/**
 * Render `text` as speech using a previously-designed voice id (MiniMax
 * Speech-02 HD). `emotion`/`speed` tune delivery without changing identity.
 * Returns the fal-hosted audio URL + buffer.
 */
export async function generateSpeech(
  voiceId: string,
  text: string,
  opts: { emotion?: string; speed?: number; language?: string } = {},
): Promise<GeneratedMedia> {
  const body: Record<string, unknown> = {
    text,
    voice_setting: {
      voice_id: voiceId,
      speed: opts.speed ?? 1.0,
      vol: 1.0,
      pitch: 0,
      ...(opts.emotion ? { emotion: opts.emotion } : {}),
    },
    audio_setting: {
      format: "mp3",
      sample_rate: 32000,
    },
    ...(opts.language ? { language_boost: opts.language } : {}),
  };
  const data = await falRun(TTS_MODEL, body, 90_000);
  const url = data?.audio?.url || data?.audio_url || data?.url;
  if (!url) throw new Error("fal TTS returned no audio url");
  const meta = data?.__falMeta as FalRunMeta | undefined;
  return { url, buffer: await fetchAsBuffer(url), model: meta?.model || TTS_MODEL, requestId: meta?.requestId };
}

/**
 * Lip-sync a talking-head video to an audio track (Sync.so). Inputs can be
 * fal-hosted URLs (no S3 round-trip needed). Returns the final clip (audio
 * baked in) as URL + buffer.
 */
export async function lipSyncVideo(
  videoUrl: string,
  audioUrl: string,
): Promise<GeneratedMedia> {
  const data = await falRun(
    LIPSYNC_MODEL,
    {
      video_url: videoUrl,
      audio_url: audioUrl,
      sync_mode: process.env.FAL_LIPSYNC_SYNC_MODE || "cut_off",
    },
    VIDEO_TIMEOUT_MS,
  );
  const url = data?.video?.url || data?.videos?.[0]?.url || data?.url;
  if (!url) throw new Error("fal lipsync returned no url");
  const meta = data?.__falMeta as FalRunMeta | undefined;
  return { url, buffer: await fetchAsBuffer(url), model: meta?.model || LIPSYNC_MODEL, requestId: meta?.requestId };
}

/**
 * Text-to-audio (Stable Audio by default). Powers the MUSIC bed + per-shot SFX.
 * `seconds` is clamped to the model's range. Returns the clip as URL + buffer.
 */
async function generateAudioClip(model: string, prompt: string, seconds: number): Promise<GeneratedMedia> {
  const secs = Math.min(47, Math.max(1, Math.round(seconds)));
  const data = await falRun(model, { prompt, seconds_total: secs }, 120_000);
  const url =
    data?.audio_file?.url || data?.audio?.url || data?.audio_url || data?.url || data?.audio_file;
  if (!url || typeof url !== "string") throw new Error(`audio gen (${model}) returned no url`);
  const meta = data?.__falMeta as FalRunMeta | undefined;
  return { url, buffer: await fetchAsBuffer(url), model: meta?.model || model, requestId: meta?.requestId };
}

/** Generate a music bed from a mood prompt (looped under the video at assembly). */
export async function generateMusic(prompt: string, seconds = 32): Promise<GeneratedMedia> {
  return generateAudioClip(MUSIC_MODEL, prompt, seconds);
}

/** Generate a short SFX clip from a description (per-shot ambient/impact). */
export async function generateSfx(prompt: string, seconds = 5): Promise<GeneratedMedia> {
  return generateAudioClip(SFX_MODEL, prompt, seconds);
}

// ---------------------------------------------------------------------------
// S3 upload
// ---------------------------------------------------------------------------

/**
 * Upload a buffer under hashbeast-assets/<relativeKey> and return the public
 * CDN URL. `relativeKey` should NOT include the bucket prefix.
 */
export async function uploadBufferToS3(
  relativeKey: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const key = `hashbeast-assets/${relativeKey}`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${ASSETS_BASE_URL}/${relativeKey}`;
}

// ---------------------------------------------------------------------------
// Gemini frame validation — lightweight YES/NO same-character check
// ---------------------------------------------------------------------------

/**
 * Validate that a generated frame still depicts the same character as the
 * reference. Best-effort: returns true on any error or inconclusive response
 * (we don't want to hard-block content on a flaky validator).
 */
export async function validateSameCharacter(
  referenceImageUrl: string,
  candidateImageUrl: string,
): Promise<{ ok: boolean; reason: string }> {
  const client = getGenAI();
  if (!client) return { ok: true, reason: "validator disabled (no GEMINI_KEY)" };
  try {
    const [ref, cand] = await Promise.all([
      imageUrlToBase64DataUri(referenceImageUrl),
      imageUrlToBase64DataUri(candidateImageUrl),
    ]);
    const toInline = (dataUri: string) => {
      const [meta, b64] = dataUri.split(",");
      const mime = meta.slice(5).split(";")[0] || "image/png";
      return { inlineData: { mimeType: mime, data: b64 } };
    };
    const response = await client.models.generateContent({
      model: GEMINI_VISION_MODEL,
      contents: createUserContent([
        `IMAGE 1 is a hashbeast character. IMAGE 2 should be the SAME character after a small cosmetic change (a trait was tweaked). Is IMAGE 2 clearly the same character in the same pixel-art style, not a broken/garbled image? Respond ONLY YES or NO.`,
        toInline(ref),
        toInline(cand),
      ]),
    });
    const out = (response.text || "").trim().toUpperCase();
    if (out.includes("YES")) return { ok: true, reason: "same character" };
    if (out.includes("NO")) return { ok: false, reason: "character mismatch" };
    return { ok: true, reason: "inconclusive — accepting" };
  } catch (err: any) {
    logger.warning(`validateSameCharacter error: ${err?.message || err}`);
    return { ok: true, reason: `validator error — accepting` };
  }
}

export const FAL_MEDIA_CONFIG = {
  FAL_IMAGE_MODEL,
  VIDEO_MODEL,
  VIDEO_DURATION_SECS,
  VOICE_DESIGN_MODEL,
  TTS_MODEL,
  LIPSYNC_MODEL,
  BUCKET_NAME,
  ASSETS_BASE_URL,
  hasFalKey: Boolean(FAL_API_KEY),
};
