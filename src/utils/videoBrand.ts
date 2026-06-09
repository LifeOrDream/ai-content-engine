/**
 * Video branding - burns the minebtc.fun badge (token coin + wordmark) into the
 * top-center of every rendered clip so reposts/downloads carry attribution and
 * drive viewers back to the site.
 *
 * Design notes:
 *  - The badge is a PRE-BAKED transparent PNG (src/assets/brand/brand_badge.png),
 *    rendered once where fonts exist. The runtime pass is a plain ffmpeg overlay,
 *    so the prod boxes need ffmpeg only (no font/libfreetype dependency).
 *  - Applied at SCENE generation. The cycle recap is stitched from already-branded
 *    scenes, so it inherits the badge - we deliberately do NOT brand the recap
 *    again (it would double-stamp at the same spot).
 *  - Best-effort: any failure returns the original buffer unchanged. Branding must
 *    never break the content pipeline.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { logger } from "./logger.js";

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Native badge dimensions - used to lock the aspect ratio when scaling.
const BADGE_W = 820;
const BADGE_H = 170;

function clamp(raw: string | undefined, def: number, min: number, max: number): number {
  const n = Number(raw);
  if (!isFinite(n)) return def;
  return Math.min(max, Math.max(min, n));
}

const ENABLED = (process.env.VIDEO_BRAND_ENABLED ?? "true").toLowerCase() !== "false";
// Badge width as a fraction of the video width (default 40%).
const WIDTH_PCT = clamp(process.env.VIDEO_BRAND_WIDTH_PCT, 0.4, 0.1, 0.9);
// Top margin as a fraction of the video height (default 5%) - keeps it inside the
// title-safe zone and clear of the TikTok/Reels caption + action-rail UI.
const TOP_PCT = clamp(process.env.VIDEO_BRAND_TOP_PCT, 0.05, 0, 0.4);

function resolveBadgePath(): string {
  const override = process.env.VIDEO_BRAND_BADGE_PATH;
  if (override && fs.existsSync(override)) return override;
  const roots = [
    process.cwd(),
    path.resolve(__dirname, "../.."), // tsx/source: src/utils -> repo
    path.resolve(__dirname, "../../.."), // compiled: dist/src/utils -> repo
  ];
  for (const root of roots) {
    const p = path.resolve(root, "src/assets/brand/brand_badge.png");
    if (fs.existsSync(p)) return p;
  }
  return "";
}

const BADGE_PATH = resolveBadgePath();

/**
 * Overlay the minebtc.fun badge onto the top-center of an mp4 buffer.
 * Returns a new branded buffer, or the original buffer if branding is disabled
 * or fails for any reason.
 */
export async function brandVideo(input: Buffer): Promise<Buffer> {
  if (!ENABLED) return input;
  if (!BADGE_PATH) {
    logger.warning("video-brand: badge asset not found - skipping branding");
    return input;
  }

  const work = fs.mkdtempSync(path.join(os.tmpdir(), "vbrand-"));
  const inPath = path.join(work, "in.mp4");
  const outPath = path.join(work, "out.mp4");
  try {
    fs.writeFileSync(inPath, input);

    // Scale the badge to WIDTH_PCT of the main video width (aspect-locked), then
    // overlay it centered horizontally at TOP_PCT down from the top.
    const filter =
      `[1:v][0:v]scale2ref=w='main_w*${WIDTH_PCT}':h='main_w*${WIDTH_PCT}*${BADGE_H}/${BADGE_W}'[bdg][vid];` +
      `[vid][bdg]overlay=x='(W-w)/2':y='H*${TOP_PCT}':format=auto[outv]`;

    await execFileP(
      "ffmpeg",
      [
        "-y",
        "-i", inPath,
        "-i", BADGE_PATH,
        "-filter_complex", filter,
        "-map", "[outv]",
        "-map", "0:a?", // carry audio through untouched if present
        "-c:a", "copy",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-crf", "18",
        "-movflags", "+faststart",
        outPath,
      ],
      { maxBuffer: 1 << 26 },
    );

    const out = fs.readFileSync(outPath);
    return out.length > 0 ? out : input;
  } catch (e: any) {
    logger.warning(`video-brand: overlay failed (${e?.message || e}) - using unbranded clip`);
    return input;
  } finally {
    try { fs.rmSync(work, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}
