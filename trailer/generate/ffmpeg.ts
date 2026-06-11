/**
 * ffmpeg helpers for the trailer renderer (16:9, 1920×1080). All best-effort,
 * all shell-outs to the ffmpeg already on the boxes. Self-contained so the
 * generation module has one place for video/audio plumbing.
 */
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const execFileP = promisify(execFile);
export const W = 1920, H = 1080, FPS = 30;
const FONT = process.env.CONTENT_FONT || "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
const FILTERS = (() => {
  try {
    return String(execFileSync("ffmpeg", ["-hide_banner", "-filters"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return "";
  }
})();
const HAS_DRAWTEXT = FILTERS.includes("drawtext");
const HAS_ASS = /\bass\b/.test(FILTERS);

export function tmpDir(tag: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), `trailer-${tag}-`));
}
export function rmDir(dir: string): void {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

/** Duration (seconds) of a media buffer, 0 on failure. */
export async function probeDuration(buf: Buffer, ext = "mp4"): Promise<number> {
  const dir = tmpDir("probe");
  try {
    const f = path.join(dir, `m.${ext}`);
    fs.writeFileSync(f, buf);
    const { stdout } = await execFileP("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nokey=1:noprint_wrappers=1", f]);
    const d = parseFloat(String(stdout).trim());
    return isFinite(d) && d > 0 ? d : 0;
  } catch { return 0; } finally { rmDir(dir); }
}

/** Escape text for the drawtext filter. */
function esc(t: string): string {
  return String(t).replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "’").replace(/%/g, "\\%");
}

/** A solid/gradient PLATE clip (for no-character shots) with a slow push-in + silent audio. */
export async function plateClip(seconds: number, tint: [number, number, number], outBuf = true): Promise<Buffer> {
  const dir = tmpDir("plate");
  try {
    const out = path.join(dir, "plate.mp4");
    const [r, g, b] = tint;
    const hex = `0x${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
    await execFileP("ffmpeg", [
      "-y", "-f", "lavfi", "-i", `color=c=${hex}:s=${W}x${H}:d=${seconds}:r=${FPS}`,
      "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-vf", `vignette,zoompan=z='min(1.0+0.0008*on,1.08)':d=${Math.round(seconds * FPS)}:s=${W}x${H}:fps=${FPS}`,
      "-t", String(seconds), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", out,
    ], { maxBuffer: 1 << 27 });
    return fs.readFileSync(out);
  } finally { rmDir(dir); }
}

/** Animate a still image buffer into a clip (slow push-in) + silent audio. */
export async function stillToClip(image: Buffer, seconds: number): Promise<Buffer> {
  const dir = tmpDir("still");
  try {
    const img = path.join(dir, "k.png"), out = path.join(dir, "c.mp4");
    fs.writeFileSync(img, image);
    await execFileP("ffmpeg", [
      "-y", "-loop", "1", "-i", img,
      "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-t", String(seconds),
      "-filter_complex", `[0:v]scale=${Math.round(W * 1.12)}:${Math.round(H * 1.12)},zoompan=z='min(1.0+0.0006*on,1.06)':d=${Math.round(seconds * FPS)}:s=${W}x${H}:fps=${FPS},setsar=1[v]`,
      "-map", "[v]", "-map", "1:a", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", out,
    ], { maxBuffer: 1 << 27 });
    return fs.readFileSync(out);
  } finally { rmDir(dir); }
}

/** Mux a voice track onto a silent clip (audio from t=0, clip length preserved). */
export async function muxAudio(videoBuf: Buffer, audioBuf: Buffer): Promise<Buffer> {
  const dir = tmpDir("mux");
  try {
    const v = path.join(dir, "v.mp4"), a = path.join(dir, "a.mp3"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, videoBuf); fs.writeFileSync(a, audioBuf);
    await execFileP("ffmpeg", ["-y", "-i", v, "-i", a,
      "-filter_complex", "[1:a]apad[aud]", "-map", "0:v:0", "-map", "[aud]",
      "-c:v", "copy", "-c:a", "aac", "-shortest", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/** Mix an SFX track UNDER the existing audio of a clip (best-effort). */
export async function overlaySfx(videoBuf: Buffer, sfxBuf: Buffer, vol = 0.5): Promise<Buffer> {
  const dir = tmpDir("sfx");
  try {
    const v = path.join(dir, "v.mp4"), s = path.join(dir, "s.mp3"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, videoBuf); fs.writeFileSync(s, sfxBuf);
    await execFileP("ffmpeg", ["-y", "-i", v, "-i", s,
      "-filter_complex", `[1:a]volume=${vol}[sfx];[0:a][sfx]amix=inputs=2:duration=first:dropout_transition=0[a]`,
      "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/** Normalize a clip to exactly 1920×1080/30fps and burn an on-screen caption (bottom safe-zone). */
export async function normalizeAndCaption(videoBuf: Buffer, caption?: string): Promise<Buffer> {
  const dir = tmpDir("norm");
  try {
    const v = path.join(dir, "v.mp4"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, videoBuf);
    let vf = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,fps=${FPS}`;
    if (caption && caption.trim() && HAS_DRAWTEXT) {
      const box = `drawtext=fontfile=${FONT}:text='${esc(caption.trim())}':fontcolor=white:fontsize=46:borderw=3:bordercolor=black@0.9:x=(w-text_w)/2:y=h-200:box=1:boxcolor=black@0.45:boxborderw=18`;
      vf += `,${box}`;
    }
    const hasAudio = await probeAudio(v);
    const args = hasAudio
      ? ["-y", "-i", v, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-ar", "44100", o]
      : ["-y", "-i", v, "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
         "-vf", vf, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", o];
    await execFileP("ffmpeg", args, { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/**
 * Burn TIMED captions (per-shot overlays inside one sequence clip) — each
 * caption appears only during its [start, end) window via drawtext enable=.
 */
export async function burnTimedCaptions(
  videoBuf: Buffer,
  captions: Array<{ text: string; start: number; end: number }>,
): Promise<Buffer> {
  const usable = captions.filter((c) => c.text?.trim() && c.end > c.start);
  if (usable.length === 0 || !HAS_DRAWTEXT) return videoBuf;
  const dir = tmpDir("tcap");
  try {
    const v = path.join(dir, "v.mp4"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, videoBuf);
    const vf = usable
      .map(
        (c) =>
          `drawtext=fontfile=${FONT}:text='${esc(c.text.trim())}':fontcolor=white:fontsize=46:borderw=3:bordercolor=black@0.9:x=(w-text_w)/2:y=h-200:box=1:boxcolor=black@0.45:boxborderw=18:enable='between(t,${c.start.toFixed(2)},${c.end.toFixed(2)})'`,
      )
      .join(",");
    await execFileP("ffmpeg", ["-y", "-i", v, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "copy", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

async function probeAudio(file: string): Promise<boolean> {
  try {
    const { stdout } = await execFileP("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", file]);
    return stdout.trim().length > 0;
  } catch { return false; }
}

/** Concatenate scene clips (already normalized) into one master. */
export async function concat(clips: Buffer[]): Promise<Buffer> {
  const dir = tmpDir("concat");
  try {
    const files: string[] = [];
    for (let i = 0; i < clips.length; i++) {
      const f = path.join(dir, `s${String(i).padStart(3, "0")}.mp4`);
      // re-encode each to a uniform codec so concat is clean
      const raw = path.join(dir, `r${i}.mp4`);
      fs.writeFileSync(raw, clips[i]);
      await execFileP("ffmpeg", ["-y", "-i", raw, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", String(FPS), "-c:a", "aac", "-ar", "44100", f], { maxBuffer: 1 << 27 });
      files.push(f);
    }
    const list = path.join(dir, "list.txt");
    fs.writeFileSync(list, files.map((f) => `file '${f}'`).join("\n"));
    const o = path.join(dir, "master.mp4");
    await execFileP("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", list, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-movflags", "+faststart", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/** Mix a music bed UNDER the whole master (looped + ducked). */
export async function mixMusicBed(masterBuf: Buffer, musicBuf: Buffer, vol = 0.16): Promise<Buffer> {
  const dir = tmpDir("music");
  try {
    const v = path.join(dir, "v.mp4"), m = path.join(dir, "m.mp3"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, masterBuf); fs.writeFileSync(m, musicBuf);
    await execFileP("ffmpeg", ["-y", "-i", v, "-stream_loop", "-1", "-i", m,
      "-filter_complex", `[1:a]volume=${vol}[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=2[a]`,
      "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-shortest", "-movflags", "+faststart", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/**
 * Loudness-normalize the master to streaming target (-14 LUFS, -1.5 dBTP) so
 * our videos don't sit quiet next to everything else in the feed. Video copies
 * through untouched.
 */
export async function loudnormalize(masterBuf: Buffer): Promise<Buffer> {
  const dir = tmpDir("loud");
  try {
    const v = path.join(dir, "v.mp4"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, masterBuf);
    await execFileP("ffmpeg", ["-y", "-i", v,
      "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
      "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/** Burn an ASS subtitle track (karaoke captions) onto the master via libass. */
export async function burnAss(masterBuf: Buffer, assText: string): Promise<Buffer> {
  if (!HAS_ASS) throw new Error("ffmpeg build has no `ass` filter (libass) — cannot burn karaoke captions");
  const dir = tmpDir("ass");
  try {
    const v = path.join(dir, "v.mp4"), a = path.join(dir, "subs.ass"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, masterBuf);
    fs.writeFileSync(a, assText, "utf8");
    // The ass filter takes a filename — escape filter-syntax specials. Inside
    // single quotes ffmpeg copies bytes literally and a quote TERMINATES the
    // section, so an embedded quote must close/escape/reopen: ' → '\''.
    const assPath = a.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, `'\\''`);
    await execFileP("ffmpeg", ["-y", "-i", v, "-vf", `ass='${assPath}'`,
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/**
 * Burn engagement-bait OVERLAYS (the "wait for it…" / "send this to…" text
 * track) at the TOP safe-zone — its own band, never colliding with karaoke
 * (bottom) or fact captions (lower third).
 */
export async function burnOverlayTexts(
  masterBuf: Buffer,
  overlays: Array<{ text: string; atSec: number; untilSec: number }>,
): Promise<Buffer> {
  const usable = overlays.filter((o) => o.text?.trim() && Number(o.untilSec) > Number(o.atSec));
  if (usable.length === 0 || !HAS_DRAWTEXT) return masterBuf;
  const dir = tmpDir("ovl");
  try {
    const v = path.join(dir, "v.mp4"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, masterBuf);
    const vf = usable
      .map(
        (c) =>
          `drawtext=fontfile=${FONT}:text='${esc(c.text.trim())}':fontcolor=white:fontsize=54:borderw=4:bordercolor=black@0.95:x=(w-text_w)/2:y=h*0.14:enable='between(t,${Number(c.atSec).toFixed(2)},${Number(c.untilSec).toFixed(2)})'`,
      )
      .join(",");
    await execFileP("ffmpeg", ["-y", "-i", v, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/** Video-only export (silent master — for posting with platform trending audio). */
export async function stripAudio(masterBuf: Buffer): Promise<Buffer> {
  const dir = tmpDir("mute");
  try {
    const v = path.join(dir, "v.mp4"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, masterBuf);
    await execFileP("ffmpeg", ["-y", "-i", v, "-an", "-c:v", "copy", "-movflags", "+faststart", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}

/** Burn a big countdown number onto a clip (top-center, above the CTA end-card). */
export async function burnCountdown(clipBuf: Buffer, countdown: string): Promise<Buffer> {
  if (!countdown || !HAS_DRAWTEXT) return clipBuf;
  const dir = tmpDir("cd");
  try {
    const v = path.join(dir, "v.mp4"), o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, clipBuf);
    const vf = `drawtext=fontfile=${FONT}:text='${esc(countdown)}':fontcolor=0xF7931A:fontsize=120:borderw=5:bordercolor=black:x=(w-text_w)/2:y=h*0.12`;
    await execFileP("ffmpeg", ["-y", "-i", v, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "copy", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { rmDir(dir); }
}
