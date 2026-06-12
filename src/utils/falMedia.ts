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
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { logger } from "./logger.js";

const execFileP = promisify(execFile);

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
    /** Seconds (Seedance 2.0 enum "4".."15") or "auto" — the model picks the natural runtime from the prompt. */
    durationSecs?: number | "auto";
    resolution?: string;
    aspectRatio?: string;
    /** Override the fal endpoint (e.g. "bytedance/seedance-2.0/image-to-video"). Defaults to VIDEO_MODEL. */
    model?: string;
    /** Seedance 2.0: native synchronized audio (SFX/ambient/lip-synced speech), no extra cost. Sent only when set — older endpoints reject unknown fields. */
    generateAudio?: boolean;
    /** Deterministic-ish sampling seed (re-rolls with identical inputs reproduce the take). */
    seed?: number;
  } = {},
): Promise<GeneratedMedia> {
  const endFrameKey =
    process.env.MUTATION_VIDEO_END_FRAME_KEY || "end_image_url";

  const body: Record<string, unknown> = {
    prompt,
    image_url: startFrameUrl,
    // Seedance `duration` is a string enum (v1: "2".."12"; 2.0: "4".."15" | "auto").
    duration:
      opts.durationSecs === "auto" ? "auto" : String(opts.durationSecs || VIDEO_DURATION_SECS),
    resolution: opts.resolution || process.env.MUTATION_VIDEO_RESOLUTION || "720p",
    aspect_ratio: opts.aspectRatio || process.env.MUTATION_VIDEO_ASPECT || "9:16",
  };
  if (endFrameUrl) body[endFrameKey] = endFrameUrl;
  if (opts.generateAudio !== undefined) body.generate_audio = opts.generateAudio;
  if (opts.seed !== undefined && Number.isFinite(opts.seed)) body.seed = Math.trunc(opts.seed);

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
// Multi-scene sequence (Seedance 2.0) — ONE generation with in-prompt cuts,
// auto-chained beyond the 15s cap. See docs/video-scenes.md.
// ---------------------------------------------------------------------------

/** Seedance 2.0 per-generation duration bounds (the `duration` string enum). */
export const SEEDANCE_MIN_SECS = 4;
export const SEEDANCE_MAX_SECS = 15;

export interface SceneDirection {
  /** Motion/action/camera direction for this scene (what happens + how it moves). */
  direction: string;
  /**
   * Optional fal-reachable start-frame URL. On the FIRST scene it becomes the
   * call's `image_url`. On a later scene it forces a CHAIN SPLIT — that scene
   * starts a new Seedance call anchored on this exact frame (hard identity /
   * style reset, e.g. cutting to product footage).
   */
  refStartImage?: string;
  /**
   * Optional fal-reachable end-frame URL (`end_image_url`). Only honored when
   * this scene ENDS a call (the last scene of a chunk) — Seedance takes one
   * end frame per generation. Use it to pull the generation toward an exact
   * final pose (e.g. the evolved canonical art on a REVEAL beat).
   */
  refEndImage?: string;
  /** Seconds this scene should run. Unhinted scenes split the remaining window evenly. */
  durationHint?: number;
}

export interface SceneSequenceOptions {
  /**
   * Total seconds, or "auto" (single-call sequences only — Seedance picks the
   * natural runtime). Omitted → the sum of durationHints (default 4s/scene),
   * chained across calls when it exceeds 15s.
   */
  totalDuration?: number | "auto";
  aspectRatio?: string;
  resolution?: string;
  /**
   * Seedance native synced audio (SFX/ambient/lip-sync — no extra cost).
   * Default FALSE: trailer-class output is scored at assembly. Pass TRUE for
   * rituals/ceremonies where synced impact SFX carry the moment.
   */
  generateAudio?: boolean;
  seed?: number;
  model?: string;
  /** Look/style/identity block prepended once per call (the "GLOBAL" line). */
  globalDirection?: string;
}

export interface SceneSequenceSegment extends GeneratedMedia {
  /** The duration requested for this fal call ("auto" only on single-call sequences). */
  durationSecs: number | "auto";
  /** Indexes into the input `scenes` array this segment rendered. */
  sceneIndexes: number[];
  /** The exact prompt sent (in-prompt cut grammar), for run manifests. */
  prompt: string;
}

export interface SceneSequenceResult {
  /** One entry per Seedance call, in order. */
  segments: SceneSequenceSegment[];
  /** The stitched master (same media as segments[0] when one call sufficed). */
  master: GeneratedMedia;
  /** Total runtime requested ("auto" when Seedance chose). */
  totalSeconds: number | "auto";
}

interface SceneChunk {
  scenes: Array<{ scene: SceneDirection; index: number; secs: number }>;
  secs: number;
}

/** Extract the final frame of a clip as PNG (the chain handoff anchor). */
export async function extractFinalFrame(videoBuffer: Buffer): Promise<Buffer> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seedchain-"));
  try {
    const v = path.join(dir, "v.mp4");
    const f = path.join(dir, "last.png");
    fs.writeFileSync(v, videoBuffer);
    // -sseof seeks from EOF; -update 1 keeps overwriting so the LAST decoded
    // frame wins even if more than one frame lands in the window.
    await execFileP(
      "ffmpeg",
      ["-y", "-sseof", "-0.35", "-i", v, "-update", "1", "-frames:v", "1", f],
      { maxBuffer: 1 << 26 },
    );
    return fs.readFileSync(f);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}

/** Concat segment clips into one master (re-encode — keeps mixed params safe). */
async function concatSegments(buffers: Buffer[]): Promise<Buffer> {
  if (buffers.length === 1) return buffers[0];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seedstitch-"));
  try {
    const files: string[] = [];
    for (let i = 0; i < buffers.length; i += 1) {
      const f = path.join(dir, `seg_${String(i).padStart(2, "0")}.mp4`);
      fs.writeFileSync(f, buffers[i]);
      files.push(f);
    }
    const list = path.join(dir, "list.txt");
    fs.writeFileSync(list, files.map((f) => `file '${f}'`).join("\n"));
    const out = path.join(dir, "master.mp4");
    await execFileP(
      "ffmpeg",
      [
        "-y", "-f", "concat", "-safe", "0", "-i", list,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
        "-movflags", "+faststart", out,
      ],
      { maxBuffer: 1 << 27 },
    );
    return fs.readFileSync(out);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}

/** Resolve per-scene seconds: hints win; the unhinted share the leftover evenly. */
function resolveSceneSecs(scenes: SceneDirection[], totalSecs?: number): number[] {
  const hinted = scenes.map((s) =>
    s.durationHint && s.durationHint > 0 ? s.durationHint : 0,
  );
  const hintSum = hinted.reduce((a, b) => a + b, 0);
  const unhinted = hinted.filter((h) => h === 0).length;
  const fallbackEach =
    totalSecs && totalSecs > hintSum && unhinted > 0
      ? (totalSecs - hintSum) / unhinted
      : 4; // sensible per-scene default when nothing constrains it
  return hinted.map((h) => (h > 0 ? h : Math.max(1, fallbackEach)));
}

/** Greedy chunker: split at explicit refStartImage anchors and at the 15s cap. */
function chunkScenes(scenes: SceneDirection[], secs: number[]): SceneChunk[] {
  const chunks: SceneChunk[] = [];
  let current: SceneChunk = { scenes: [], secs: 0 };
  const flush = () => {
    if (current.scenes.length > 0) chunks.push(current);
    current = { scenes: [], secs: 0 };
  };
  scenes.forEach((scene, index) => {
    const sceneSecs = secs[index];
    const hardSplit = index > 0 && Boolean(scene.refStartImage);
    const overflow =
      current.scenes.length > 0 && current.secs + sceneSecs > SEEDANCE_MAX_SECS;
    if (hardSplit || overflow) flush();
    current.scenes.push({ scene, index, secs: sceneSecs });
    current.secs += sceneSecs;
  });
  flush();
  return chunks;
}

/** Build one chunk's timeline prompt with the in-prompt scene-cut grammar. */
function buildChunkPrompt(chunk: SceneChunk, globalDirection?: string): string {
  const lines: string[] = [];
  if (globalDirection) lines.push(globalDirection.trim());
  let t = 0;
  chunk.scenes.forEach(({ scene, secs }, i) => {
    const window = `${t.toFixed(1)}-${(t + secs).toFixed(1)}s`;
    lines.push(
      i === 0
        ? `${window}: ${scene.direction.trim()}`
        : `${window} — cut to — ${scene.direction.trim()}`,
    );
    t += secs;
  });
  return lines.join("\n");
}

/**
 * Render an ORDERED list of scenes as Seedance 2.0 multi-scene video.
 *
 * - Sequences that fit one generation (≤15s) become ONE fal call: the scenes
 *   are compiled into a timestamped timeline prompt joined by the in-prompt
 *   scene-cut grammar ("… — cut to — …"), with the first scene's
 *   `refStartImage` as `image_url` and the last scene's `refEndImage` as
 *   `end_image_url`. One call = one set of native cuts, synced audio optional.
 * - Longer sequences AUTO-CHAIN: scenes are packed into ≤15s chunks and call
 *   N+1's `image_url` is the ffmpeg-extracted FINAL frame of call N's output
 *   (uploaded so fal can fetch it) — identity continuity across the chain. A
 *   scene with an explicit `refStartImage` always starts its own chunk (hard
 *   cut / style change).
 * - Returns every segment plus a stitched master.
 *
 * Requires `ffmpeg` on PATH when chaining/stitching (single-call sequences
 * never shell out). The first scene must carry `refStartImage` — Seedance i2v
 * is start-frame anchored.
 */
export async function generateSceneSequence(
  scenes: SceneDirection[],
  opts: SceneSequenceOptions = {},
): Promise<SceneSequenceResult> {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new Error("generateSceneSequence: no scenes");
  }
  if (!scenes[0].refStartImage) {
    throw new Error("generateSceneSequence: scenes[0].refStartImage is required (i2v start anchor)");
  }

  const auto = opts.totalDuration === "auto";
  const totalSecs = auto
    ? undefined
    : typeof opts.totalDuration === "number" && opts.totalDuration > 0
      ? opts.totalDuration
      : undefined;
  const secs = resolveSceneSecs(scenes, totalSecs);
  const chunks = chunkScenes(scenes, secs);
  if (auto && chunks.length > 1) {
    throw new Error(
      "generateSceneSequence: totalDuration 'auto' only supports single-call sequences (≤15s, no mid-sequence refStartImage)",
    );
  }

  const segments: SceneSequenceSegment[] = [];
  let chainFrameUrl: string | undefined;
  for (let c = 0; c < chunks.length; c += 1) {
    const chunk = chunks[c];
    const prompt = buildChunkPrompt(chunk, opts.globalDirection);
    const startUrl = chunk.scenes[0].scene.refStartImage || chainFrameUrl;
    if (!startUrl) throw new Error(`generateSceneSequence: chunk ${c + 1} has no start frame`);
    const endUrl = chunk.scenes[chunk.scenes.length - 1].scene.refEndImage;
    const durationSecs: number | "auto" = auto
      ? "auto"
      : Math.min(SEEDANCE_MAX_SECS, Math.max(SEEDANCE_MIN_SECS, Math.round(chunk.secs)));
    const media = await generateVideoFromFrames(prompt, startUrl, endUrl, {
      durationSecs,
      resolution: opts.resolution,
      aspectRatio: opts.aspectRatio,
      model: opts.model,
      generateAudio: opts.generateAudio ?? false,
      seed: opts.seed,
    });
    segments.push({
      ...media,
      durationSecs,
      sceneIndexes: chunk.scenes.map((s) => s.index),
      prompt,
    });
    // Chain handoff: the NEXT chunk (unless it re-anchors itself) starts on
    // this output's literal final frame.
    const next = chunks[c + 1];
    if (next && !next.scenes[0].scene.refStartImage) {
      const frame = await extractFinalFrame(media.buffer);
      chainFrameUrl = await uploadBufferToS3(
        `scene-sequences/${Date.now()}-chain-${c + 1}.png`,
        frame,
        "image/png",
      );
    }
  }

  const masterBuffer = await concatSegments(segments.map((s) => s.buffer));
  const master: GeneratedMedia =
    segments.length === 1
      ? { url: segments[0].url, buffer: masterBuffer, model: segments[0].model, requestId: segments[0].requestId }
      : { url: segments[0].url, buffer: masterBuffer, model: segments[0].model };
  return {
    segments,
    master,
    totalSeconds: auto ? "auto" : segments.reduce((t, s) => t + (s.durationSecs as number), 0),
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
  // Stable Audio's queue can sit IN_PROGRESS well past 2 minutes when cold —
  // keep the default but let ops widen it without a code change.
  const timeoutMs = Math.max(30_000, Number(process.env.FAL_AUDIO_TIMEOUT_MS || 120_000));
  const data = await falRun(model, { prompt, seconds_total: secs }, timeoutMs);
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
 *
 * `characterNoun` makes the gate base-type aware ("dog", "primate (monkey/
 * ape)", "frog-like amphibian", "cat") — callers resolve it from the beast's
 * baseType (src/world/baseTypes.ts). Omitted → legacy generic wording.
 */
export async function validateSameCharacter(
  referenceImageUrl: string,
  candidateImageUrl: string,
  opts: { characterNoun?: string } = {},
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
    const subject = opts.characterNoun
      ? `IMAGE 1 is a hashbeast character (an anthropomorphic ${opts.characterNoun}).`
      : `IMAGE 1 is a hashbeast character.`;
    const response = await client.models.generateContent({
      model: GEMINI_VISION_MODEL,
      contents: createUserContent([
        `${subject} IMAGE 2 should be the SAME character after a small cosmetic change (a trait was tweaked). Is IMAGE 2 clearly the same character — the same kind of creature — in the same pixel-art style, not a broken/garbled image? Respond ONLY YES or NO.`,
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
