/**
 * Audio for the trailer: dialogue is synthesized per-character (each character's
 * DESIGNED voice from cast.ts), concatenated into one shot track. SFX (per shot)
 * and the music bed (per video) are pluggable SOURCES — the layering/mixing is
 * fully wired (see ffmpeg.ts); you provide the source via a local library or URL
 * (AI music/sfx generation is a future toggle). Best-effort throughout.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileP, tmpDir, rmDir } from "./ffmpeg.js";
import { generateSpeech, generateSfx, generateMusic, fetchAsBuffer } from "../../src/utils/falMedia.js";
import { resolveCharacter, ensureCharacterVoice } from "./cast.js";
import type { DialogueLine } from "../pipeline/types.js";

const SFX_GEN = process.env.TRAILER_SFX_GEN !== "false";
const MUSIC_GEN = process.env.TRAILER_MUSIC_GEN !== "false";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SFX_DIR = path.resolve(__dirname, "..", "assets", "sfx");
const GAP_SEC = Number(process.env.TRAILER_LINE_GAP_SEC || 0.25);

/** Synthesize a shot's dialogue lines (in each speaker's voice) → one audio buffer + duration. */
export async function synthesizeShotDialogue(
  lines: DialogueLine[],
): Promise<{ buffer: Buffer; durationSec: number } | null> {
  if (!lines || lines.length === 0) return null;
  const parts: Buffer[] = [];
  for (const ln of lines) {
    if (!ln.line?.trim()) continue;
    const def = resolveCharacter(ln.speaker);
    if (!def) continue; // unknown speaker → skip (logged by caller)
    try {
      const voiceId = await ensureCharacterVoice(def);
      const audio = await generateSpeech(voiceId, ln.line, {
        emotion: mapEmotion(ln.delivery, def.defaultEmotion),
        language: def.language,
      });
      parts.push(audio.buffer);
    } catch { /* skip a failed line */ }
  }
  if (parts.length === 0) return null;
  const buffer = await concatAudioWithGaps(parts, GAP_SEC);
  const durationSec = await audioDuration(buffer);
  return { buffer, durationSec };
}

/** MiniMax accepts a small emotion set; map a free-text delivery note onto it. */
function mapEmotion(delivery: string | undefined, fallback: string): string {
  const d = (delivery || "").toLowerCase();
  if (/fear|scared|panic|nervous|anxious/.test(d)) return "fearful";
  if (/angr|furious|rage|threat/.test(d)) return "angry";
  if (/sad|mourn|melanchol|vulnerable|ache/.test(d)) return "sad";
  if (/smug|cocky|confident|sly|seduc|purr|grin/.test(d)) return "happy";
  if (/whisper|quiet|intimate|conspiratorial/.test(d)) return "neutral";
  if (/shout|bombast|grand|loud|triumph/.test(d)) return "happy";
  return /fear|sad|angry|happy/.test(fallback) ? fallback : "neutral";
}

async function concatAudioWithGaps(parts: Buffer[], gap: number): Promise<Buffer> {
  if (parts.length === 1 && gap <= 0) return parts[0];
  const dir = tmpDir("aud");
  try {
    const files: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const f = path.join(dir, `p${i}.mp3`);
      fs.writeFileSync(f, parts[i]);
      files.push(f);
      if (gap > 0 && i < parts.length - 1) {
        const s = path.join(dir, `g${i}.mp3`);
        await execFileP("ffmpeg", ["-y", "-f", "lavfi", "-i", `anullsrc=channel_layout=stereo:sample_rate=44100`, "-t", String(gap), s], { maxBuffer: 1 << 26 });
        files.push(s);
      }
    }
    const list = path.join(dir, "list.txt");
    fs.writeFileSync(list, files.map((f) => `file '${f}'`).join("\n"));
    const o = path.join(dir, "out.mp3");
    await execFileP("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", list, "-c:a", "libmp3lame", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

async function audioDuration(buf: Buffer): Promise<number> {
  const dir = tmpDir("adur");
  try {
    const f = path.join(dir, "a.mp3");
    fs.writeFileSync(f, buf);
    const { stdout } = await execFileP("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nokey=1:noprint_wrappers=1", f]);
    const d = parseFloat(String(stdout).trim());
    return isFinite(d) ? d : 0;
  } catch { return 0; } finally { rmDir(dir); }
}

/**
 * Resolve a per-shot SFX clip: local library (trailer/assets/sfx/*.mp3) by
 * keyword first, else AI-GENERATE it from the description (Stable Audio). Returns
 * null if no source + generation disabled/failed.
 */
export async function resolveSfx(sfxDescription?: string, seconds = 5): Promise<Buffer | null> {
  if (!sfxDescription?.trim()) return null;
  // 1. local library keyword match
  if (fs.existsSync(SFX_DIR)) {
    try {
      const files = fs.readdirSync(SFX_DIR).filter((f) => /\.(mp3|wav|m4a)$/i.test(f));
      const words = sfxDescription.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
      const hit = files.find((f) => words.some((w) => f.toLowerCase().includes(w)));
      if (hit) return fs.readFileSync(path.join(SFX_DIR, hit));
    } catch { /* fall through to gen */ }
  }
  // 2. AI-generate
  if (SFX_GEN) {
    try { return (await generateSfx(sfxDescription.slice(0, 200), seconds)).buffer; } catch { /* none */ }
  }
  return null;
}

/**
 * Resolve the per-video music bed: TRAILER_MUSIC_URL → local trailer/assets/music.mp3
 * → AI-GENERATE from a mood prompt (Stable Audio). Resolve ONCE per video (the
 * caller caches + reuses across scenes + final assembly).
 */
export async function resolveMusicBed(moodPrompt?: string, seconds = 32): Promise<Buffer | null> {
  const url = process.env.TRAILER_MUSIC_URL;
  if (url) { try { return await fetchAsBuffer(url); } catch { /* fall through */ } }
  const local = path.resolve(__dirname, "..", "assets", "music.mp3");
  if (fs.existsSync(local)) return fs.readFileSync(local);
  if (MUSIC_GEN && moodPrompt?.trim()) {
    try { return (await generateMusic(moodPrompt.slice(0, 300), seconds)).buffer; } catch { /* none */ }
  }
  return null;
}
