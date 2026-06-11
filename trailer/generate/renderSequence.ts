/**
 * Render ONE SEQUENCE — one Seedance generation (the new pipeline unit):
 *
 *   resolve references (@castId:state sheets + env:seqN.startFrame chains)
 *   → generate the START frame (cached to out/<id>/frames/ — the consistency anchor)
 *   → [generate the END frame when the plan earned one: bridge/handoff]
 *   → upload frames → ONE Seedance timeline generation (native cuts + audio)
 *   → burn per-shot timed captions (facts live in overlays, never in-frame)
 *   → normalize to 1080p.
 *
 * Frames are cached on disk so a re-run / --regen of the video reuses approved
 * frames, and later sequences can chain them as environment references.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { generateImageEditFromBuffers, generateVideoFromFrames, uploadBufferToS3 } from "../../src/utils/falMedia.js";
import { resolveCharacter, ensureStateRefs } from "./cast.js";
import { burnTimedCaptions, normalizeAndCaption, probeDuration, RENDER_ASPECT, W as PLATE_W, H as PLATE_H } from "./ffmpeg.js";
import type { Sequence, FramePlan } from "../pipeline/types.js";
import { loadReferenceAssetBuffers, resolveReferenceAsset } from "../world/assetRegistry.js";
import { resolveCountryCharacterProfile } from "../world/countryCastRegistry.js";

const IMG_RES = (process.env.TRAILER_IMAGE_RES as "1K" | "2K") || "2K";
const VIDEO_RES = process.env.TRAILER_VIDEO_RES || "1080p";
/**
 * Seedance 2.0 image-to-video on fal (verified schema): start frame (image_url)
 * + optional end frame (end_image_url), duration "4".."15", generate_audio
 * (native SFX/ambient/lip-synced speech), 480p/720p/1080p, 16:9.
 * Draft cheap with TRAILER_VIDEO_RES=480p, final at 1080p.
 */
const SEQ_VIDEO_MODEL = process.env.TRAILER_VIDEO_FAL_MODEL || "bytedance/seedance-2.0/image-to-video";
const NATIVE_AUDIO = process.env.TRAILER_NATIVE_AUDIO !== "false";
const VIDEO_MIN_SEC = 4; // Seedance 2.0 duration enum floor
const VIDEO_MAX_SEC = Math.max(VIDEO_MIN_SEC, Number(process.env.TRAILER_VIDEO_MAX_SEC || 15));
const SAVE_PROMPTS = process.env.TRAILER_SAVE_PROMPTS === "true";
const DEBUG = process.env.TRAILER_DEBUG !== "false";

export interface RenderSequenceOptions {
  /** Force re-generating frames + video even when cached files exist. */
  regen?: boolean;
  promptDumpDir?: string;
}
export interface RenderSequenceResult {
  buffer: Buffer;
  seconds: number;
  startFramePath: string;
  endFramePath?: string;
  falRequests: Array<{
    stageId: string;
    kind: "image" | "video";
    model?: string;
    requestId?: string;
    outputUrl?: string;
    sequence: number;
    durationSecs?: number;
    resolution?: string;
  }>;
}

const step = (seq: Sequence, label: string) => {
  if (DEBUG) process.stdout.write(`\n      seq ${seq.n}: ${label}… `);
};

export const sequenceFramePath = (framesDir: string, n: number, kind: "start" | "end"): string =>
  path.join(framesDir, `seq_${String(n).padStart(2, "0")}_${kind}.png`);

function dumpPrompt(dir: string | undefined, name: string, content: string): void {
  if (!SAVE_PROMPTS || !dir) return;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), content);
}

function buildDialoguePromptBlock(seq: Sequence): string {
  const lines: string[] = [];
  for (const shot of seq.shots || []) {
    for (const line of shot.dialogue || []) {
      if (!line?.line?.trim()) continue;
      const start = Number(shot.startSec) || 0;
      const end = Number(shot.endSec) || Number(seq.durationSec) || 0;
      const delivery = line.delivery?.trim() ? ` Delivery: ${line.delivery.trim()}` : "";
      lines.push(
        `${start.toFixed(2)}-${end.toFixed(2)}s ${line.speaker}: "${line.line.trim()}"${delivery}`,
      );
    }
  }
  if (lines.length === 0) {
    return "DIALOGUE / NATIVE AUDIO: No spoken dialogue. Use only the described music, room tone, and SFX. Do not invent speech.";
  }
  return [
    "DIALOGUE / NATIVE AUDIO — SPEAK EXACTLY THESE LINES, NO EXTRA WORDS:",
    ...lines,
    "Voice must match the VOICE note above. Lip/mouth motion should align with these exact words when the speaker is visible.",
  ].join("\n");
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePngRgba(width: number, height: number, rgba: Buffer): Buffer {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    raw[row] = 0; // PNG filter: none
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function drawRect(rgba: Buffer, width: number, height: number, x: number, y: number, w: number, h: number, color: [number, number, number, number]): void {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(width, Math.ceil(x + w));
  const y1 = Math.min(height, Math.ceil(y + h));
  for (let yy = y0; yy < y1; yy += 1) {
    for (let xx = x0; xx < x1; xx += 1) {
      const i = (yy * width + xx) * 4;
      rgba[i] = color[0];
      rgba[i + 1] = color[1];
      rgba[i + 2] = color[2];
      rgba[i + 3] = color[3];
    }
  }
}

const SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgecd",
  "7": "abc",
  "8": "abcdefg",
  "9": "abfgcd",
};

function drawDigit(rgba: Buffer, x: number, y: number, digit: string): void {
  const segs = SEGMENTS[digit];
  if (!segs) return;
  const dw = 96;
  const dh = 172;
  const t = 18;
  const red: [number, number, number, number] = [255, 46, 46, 255];
  const glow: [number, number, number, number] = [95, 0, 12, 255];
  const rects: Record<string, [number, number, number, number]> = {
    a: [t, 0, dw - 2 * t, t],
    b: [dw - t, t, t, dh / 2 - t],
    c: [dw - t, dh / 2, t, dh / 2 - t],
    d: [t, dh - t, dw - 2 * t, t],
    e: [0, dh / 2, t, dh / 2 - t],
    f: [0, t, t, dh / 2 - t],
    g: [t, dh / 2 - t / 2, dw - 2 * t, t],
  };
  for (const key of segs) {
    const [rx, ry, rw, rh] = rects[key];
    drawRect(rgba, PLATE_W, PLATE_H, x + rx - 5, y + ry - 5, rw + 10, rh + 10, glow);
  }
  for (const key of segs) {
    const [rx, ry, rw, rh] = rects[key];
    drawRect(rgba, PLATE_W, PLATE_H, x + rx, y + ry, rw, rh, red);
  }
}

function renderCountdownPlate(countdown?: string): Buffer {
  const rgba = Buffer.alloc(PLATE_W * PLATE_H * 4);
  for (let i = 0; i < rgba.length; i += 4) rgba[i + 3] = 255;

  if (countdown) {
    const chars = countdown.split("");
    const digitW = 96;
    const colonW = 28;
    const gap = 18;
    const totalW = chars.reduce((sum, ch) => sum + (ch === ":" ? colonW : digitW), 0) + gap * (chars.length - 1);
    let x = Math.round((PLATE_W - totalW) / 2);
    const y = Math.round(PLATE_H / 2 - 168);
    for (const ch of chars) {
      if (ch === ":") {
        drawRect(rgba, PLATE_W, PLATE_H, x + 6, y + 54, 18, 18, [255, 46, 46, 255]);
        drawRect(rgba, PLATE_W, PLATE_H, x + 6, y + 106, 18, 18, [255, 46, 46, 255]);
        x += colonW + gap;
      } else {
        drawDigit(rgba, x, y, ch);
        x += digitW + gap;
      }
    }
    drawRect(rgba, PLATE_W, PLATE_H, PLATE_W / 2 - 4, PLATE_H / 2 + 55, 8, 190, [176, 0, 32, 255]);
    drawRect(rgba, PLATE_W, PLATE_H, PLATE_W / 2 - 36, PLATE_H / 2 + 248, 72, 10, [255, 46, 46, 255]);
  }

  return encodePngRgba(PLATE_W, PLATE_H, rgba);
}

/** Nano Banana edit requires image_urls. Empty-ref plates are deterministic local anchors. */
async function generateZeroRefPlate(plan: FramePlan, file: string): Promise<Buffer> {
  const countdown = (plan.prompt || "").match(/\b\d{1,2}:\d{2}:\d{2}\b/)?.[0];
  const buffer = renderCountdownPlate(countdown);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
  return buffer;
}

/** Resolve a frame plan's ordered refs into image buffers (≤8 — fal's practical cap). */
async function resolveFrameRefs(seq: Sequence, refs: string[] | undefined, framesDir: string): Promise<Buffer[]> {
  const out: Buffer[] = [];
  const list = refs && refs.length > 0
    ? refs
    : (seq.characters || []).map((c) => `${c.refTag}:${c.state || "default"}`); // fallback: derive from cast
  for (const ref of list) {
    if (resolveReferenceAsset(ref)) {
      out.push(...loadReferenceAssetBuffers(ref));
      continue;
    }
    const env = /^env:seq(\d+)\.(startFrame|endFrame)$/i.exec(ref);
    if (env) {
      const f = sequenceFramePath(framesDir, Number(env[1]), env[2].toLowerCase() === "endframe" ? "end" : "start");
      if (!fs.existsSync(f)) throw new Error(`env ref ${ref} not on disk yet — render sequences in order (missing ${path.basename(f)})`);
      out.push(fs.readFileSync(f));
      continue;
    }
    const m = /^@([a-z0-9_]+)(?::([a-z0-9 _-]+))?$/i.exec(ref.trim());
    if (!m) continue; // lint already warned; skip unknown formats
    const def = resolveCharacter(m[1]);
    if (!def) {
      const profile = resolveCountryCharacterProfile(m[1]);
      if (profile) {
        out.push(...loadReferenceAssetBuffers(profile.boardRef));
      }
      continue; // unknown character (ensemble without a sheet) — skip, the prompt carries the description
    }
    out.push(...(await ensureStateRefs(def, m[2])));
  }
  return out.slice(0, 8);
}

/** Generate (or load cached) one planned frame; returns its buffer + fal-reachable URL. */
async function ensureFrame(
  seq: Sequence,
  plan: FramePlan,
  kind: "start" | "end",
  look: string | undefined,
  framesDir: string,
  scratch: string,
  opts: RenderSequenceOptions,
): Promise<{
  buffer: Buffer;
  url: string;
  file: string;
  request?: {
    stageId: string;
    kind: "image";
    model?: string;
    requestId?: string;
    outputUrl?: string;
    sequence: number;
    resolution?: string;
  };
}> {
  fs.mkdirSync(framesDir, { recursive: true });
  const file = sequenceFramePath(framesDir, seq.n, kind);
  let buffer: Buffer;
  if (fs.existsSync(file) && !opts.regen) {
    buffer = fs.readFileSync(file);
  } else {
    step(seq, `refs for ${kind} frame`);
    const refs = await resolveFrameRefs(seq, plan.refs, framesDir);
    const prompt = [
      look ? `LOOK (shared across the whole video): ${look}` : "",
      plan.prompt,
      "This is a STILL image — a frozen instant; no motion blur, no motion.",
      "No readable text, captions, logos, tickers, watermarks, speech bubbles, or UI anywhere in the image.",
    ].filter(Boolean).join("\n");
    dumpPrompt(opts.promptDumpDir, `seq_${String(seq.n).padStart(2, "0")}_${kind}_frame_prompt.txt`, prompt);
    if (refs.length === 0) {
      step(seq, `generating local ${kind} plate`);
      buffer = await generateZeroRefPlate(plan, file);
    } else {
      step(seq, `generating ${kind} frame`);
      const img = await generateImageEditFromBuffers(
        prompt,
        refs.map((buffer) => ({ buffer, mime: "image/png" as const })),
        { aspectRatio: plan.aspect || RENDER_ASPECT, resolution: IMG_RES },
      );
      buffer = img.buffer;
      fs.writeFileSync(file, buffer);
      const url = await uploadBufferToS3(`${scratch}/seq${seq.n}_${kind}.png`, buffer, "image/png");
      return {
        buffer,
        url,
        file,
        request: {
          stageId: `frame:seq-${seq.n}:${kind}`,
          kind: "image",
          model: img.model,
          requestId: img.requestId,
          outputUrl: img.url,
          sequence: seq.n,
          resolution: IMG_RES,
        },
      };
    }
  }
  step(seq, `uploading ${kind} frame`);
  const url = await uploadBufferToS3(`${scratch}/seq${seq.n}_${kind}.png`, buffer, "image/png");
  return { buffer, url, file };
}

/** Render one full sequence into a finished, caption-burned, normalized clip. */
export async function renderSequence(
  seq: Sequence,
  look: string | undefined,
  outDir: string,
  scratch: string,
  opts: RenderSequenceOptions = {},
): Promise<RenderSequenceResult> {
  const framesDir = path.join(outDir, "frames");

  // 1. frames (start = required anchor; end only when the plan earned one)
  const startPlan: FramePlan = seq.startFrame || {
    prompt: `The opening still of this sequence: ${seq.location}, ${seq.timeOfDay}. ${(seq.characters || []).map((c) => c.name).join(", ")} in frame, posed for the first shot.`,
    refs: [],
  };
  const start = await ensureFrame(seq, startPlan, "start", look, framesDir, scratch, opts);
  const end = seq.endFrame ? await ensureFrame(seq, seq.endFrame, "end", look, framesDir, scratch, opts) : undefined;
  const falRequests = [start.request, end?.request].filter(Boolean) as RenderSequenceResult["falRequests"];

  // 2. the timeline generation (one Seedance 2.0 call; native cuts + audio)
  const wantSec = Math.max(VIDEO_MIN_SEC, Math.round(Number(seq.durationSec) || 10));
  const durationSecs = Math.min(wantSec, VIDEO_MAX_SEC);
  if (wantSec > VIDEO_MAX_SEC) {
    console.log(`\n      ⚠ seq ${seq.n}: durationSec ${wantSec}s > model cap ${VIDEO_MAX_SEC}s — clamped`);
  }
  const videoPrompt = [
    seq.timelinePrompt,
    buildDialoguePromptBlock(seq),
    seq.negativePrompt ? `NEGATIVE PROMPT: ${seq.negativePrompt}` : "",
  ].filter(Boolean).join("\n\n");
  dumpPrompt(opts.promptDumpDir, `seq_${String(seq.n).padStart(2, "0")}_timeline_prompt.txt`, videoPrompt);
  step(seq, `Seedance 2.0 generation (${durationSecs}s, ${VIDEO_RES}, audio=${NATIVE_AUDIO})`);
  const vid = await generateVideoFromFrames(videoPrompt, start.url, end?.url, {
    durationSecs,
    resolution: VIDEO_RES,
    aspectRatio: RENDER_ASPECT,
    model: SEQ_VIDEO_MODEL,
    generateAudio: NATIVE_AUDIO,
  });
  falRequests.push({
    stageId: `video:seq-${seq.n}`,
    kind: "video",
    model: vid.model || SEQ_VIDEO_MODEL,
    requestId: vid.requestId,
    outputUrl: vid.url,
    sequence: seq.n,
    durationSecs,
    resolution: VIDEO_RES,
  });

  // 3. timed captions (per-shot overlays) + normalize
  step(seq, "captions + normalize");
  const captions = (seq.shots || [])
    .filter((s) => s.caption && s.caption.trim())
    .map((s) => ({ text: s.caption!.trim(), start: Number(s.startSec) || 0, end: Number(s.endSec) || durationSecs }));
  let buffer = await burnTimedCaptions(vid.buffer, captions);
  buffer = await normalizeAndCaption(buffer); // 1080p/30fps normalize (no extra caption)
  const seconds = await probeDuration(buffer);
  return { buffer, seconds, startFramePath: start.file, endFramePath: end?.file, falRequests };
}
