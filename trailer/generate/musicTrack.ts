/**
 * Track-first music for anthem / vibe-edit genres: the TRACK leads, the cuts
 * follow. This is the inversion the bed-music pipeline can't do — a music
 * video needs the song first, a beat grid second, and the edit cut TO it.
 *
 * Three stages, all best-effort with graceful fallbacks:
 *   1. LYRICS — anthem chant lines already live in the script's ON-SCREEN
 *      channel (shots[].caption); they become the song's lyric sheet.
 *   2. TRACK — a full-length vocal track via a fal text-to-music model
 *      (env TRAILER_TRACK_MODEL, default fal-ai/ace-step which takes
 *      tags+lyrics). Unknown models get a generic {prompt, seconds_total}
 *      payload; total failure falls back to the instrumental bed generator.
 *   3. BEAT GRID — scripts/beat_grid.py (librosa) for real beat tracking;
 *      falls back to a uniform grid at TRAILER_TRACK_BPM (default 120) so a
 *      missing librosa never blocks a render.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileP, tmpDir, rmDir, probeDuration } from "./ffmpeg.js";
import { fetchAsBuffer, generateMusic } from "../../src/utils/falMedia.js";
import type { Screenplay } from "../pipeline/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BEAT_GRID_PY = path.resolve(__dirname, "..", "..", "scripts", "beat_grid.py");
const PYTHON = process.env.HASHBEAST_ANIM_PYTHON || "python3";
const TRACK_MODEL = process.env.TRAILER_TRACK_MODEL || "fal-ai/ace-step";
const FAL_KEY = process.env.FAL_API_KEY || "";
const FALLBACK_BPM = Math.max(60, Number(process.env.TRAILER_TRACK_BPM || 120));

export interface MusicTrack {
  buffer: Buffer;
  seconds: number;
  bpm: number;
  /** Beat onsets in seconds from track start. */
  beats: number[];
  source: "generated" | "file" | "bed-fallback";
}

/** Pull the lyric sheet out of the script: ON-SCREEN chant lines, in order. */
export function extractLyrics(screenplay: Screenplay): string[] {
  const lines: string[] = [];
  for (const seq of screenplay.sequences || []) {
    for (const shot of seq.shots || []) {
      const c = shot.caption?.trim();
      if (c) lines.push(c);
    }
  }
  return lines;
}

function styleTags(screenplay: Screenplay): string {
  return (
    process.env.TRAILER_TRACK_TAGS ||
    `hype anthem, electronic trap, heavy 808 bass, chant vocals, stadium energy, war drums, crypto degen swagger, 120 bpm, theme for "${screenplay.title}"`
  );
}

/** Run a fal queue model with a raw payload (track models differ in schema). */
async function falQueueRun(model: string, payload: Record<string, unknown>, timeoutMs = 300_000): Promise<any> {
  const headers = { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" };
  const submit = await fetch(`https://queue.fal.run/${model}`, { method: "POST", headers, body: JSON.stringify(payload) });
  if (!submit.ok) throw new Error(`fal ${model} submit ${submit.status}: ${(await submit.text()).slice(0, 200)}`);
  const job = (await submit.json()) as { status_url?: string; response_url?: string };
  if (!job.status_url || !job.response_url) throw new Error(`fal ${model}: no queue urls`);
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    if (Date.now() > deadline) throw new Error(`fal ${model} timed out`);
    const st = await fetch(job.status_url, { headers });
    const status = ((await st.json()) as { status?: string }).status;
    if (status === "COMPLETED") break;
    if (status === "FAILED" || status === "CANCELLED" || status === "ERROR") throw new Error(`fal ${model} ${status}`);
    await new Promise((r) => setTimeout(r, 2500));
  }
  const res = await fetch(job.response_url, { headers });
  if (!res.ok) throw new Error(`fal ${model} result ${res.status}`);
  return res.json();
}

function audioUrlFrom(data: any): string | null {
  const url =
    data?.audio?.url || data?.audio_file?.url || data?.audio_url ||
    (typeof data?.audio === "string" ? data.audio : null) ||
    (typeof data?.url === "string" ? data.url : null);
  return typeof url === "string" ? url : null;
}

/** Generate (or load) the full-length track for a track-first screenplay. */
export async function resolveTrack(screenplay: Screenplay, targetSeconds: number): Promise<MusicTrack | null> {
  // explicit source wins (a licensed/owned anthem file)
  const url = process.env.TRAILER_TRACK_URL;
  if (url) {
    try {
      const buffer = await fetchAsBuffer(url);
      return await withBeats(buffer, "file");
    } catch { /* fall through */ }
  }

  const lyrics = extractLyrics(screenplay);
  const seconds = Math.min(180, Math.max(15, Math.round(targetSeconds + 4)));

  if (FAL_KEY) {
    try {
      // ace-step style payload (tags + lyric sheet); generic models ignore extras.
      const payload = /ace-step/.test(TRACK_MODEL)
        ? {
            tags: styleTags(screenplay),
            lyrics: lyrics.length ? `[chant]\n${lyrics.join("\n")}` : "[inst]",
            duration: seconds,
          }
        : { prompt: `${styleTags(screenplay)}. ${lyrics.slice(0, 4).join(" / ")}`, seconds_total: Math.min(47, seconds) };
      const data = await falQueueRun(TRACK_MODEL, payload);
      const audioUrl = audioUrlFrom(data);
      if (audioUrl) return await withBeats(await fetchAsBuffer(audioUrl), "generated");
      console.log(`   track: ${TRACK_MODEL} returned no audio url — falling back to bed`);
    } catch (e: any) {
      console.log(`   track: ${TRACK_MODEL} failed (${String(e?.message || e).slice(0, 120)}) — falling back to bed`);
    }
  }

  // instrumental bed fallback (stable-audio, ≤47s) — still beat-grid it.
  try {
    const bed = await generateMusic(styleTags(screenplay), Math.min(47, seconds));
    return await withBeats(bed.buffer, "bed-fallback");
  } catch {
    return null;
  }
}

async function withBeats(buffer: Buffer, source: MusicTrack["source"]): Promise<MusicTrack> {
  const seconds = (await probeDuration(buffer, "mp3")) || (await probeDuration(buffer));
  const grid = await beatGrid(buffer, seconds);
  return { buffer, seconds, bpm: grid.bpm, beats: grid.beats, source };
}

/** Beat onsets via librosa; uniform-grid fallback when unavailable. */
export async function beatGrid(buffer: Buffer, seconds: number): Promise<{ bpm: number; beats: number[] }> {
  if (fs.existsSync(BEAT_GRID_PY)) {
    const dir = tmpDir("beats");
    try {
      const f = path.join(dir, "track.mp3");
      fs.writeFileSync(f, buffer);
      const { stdout } = await execFileP(PYTHON, [BEAT_GRID_PY, f], { maxBuffer: 1 << 24 });
      const parsed = JSON.parse(String(stdout || "{}"));
      if (Array.isArray(parsed.beats) && parsed.beats.length >= 4) {
        return { bpm: Number(parsed.bpm) || FALLBACK_BPM, beats: parsed.beats.map(Number) };
      }
    } catch { /* fall back below */ } finally { rmDir(dir); }
  }
  const interval = 60 / FALLBACK_BPM;
  const beats: number[] = [];
  for (let t = 0; t <= Math.max(1, seconds); t += interval) beats.push(Number(t.toFixed(3)));
  return { bpm: FALLBACK_BPM, beats };
}
