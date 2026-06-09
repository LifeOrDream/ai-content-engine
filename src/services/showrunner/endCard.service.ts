/**
 * End-card - a short CTA closing clip appended to FEATURE videos (not reels):
 * the brand + "Mine your HashBeast / minebtc.fun / Subscribe + Follow", driving
 * viewers to the game + subscribe/follow. Rendered via scripts/render_card.py
 * (PIL) -> ffmpeg still-to-clip at the format's dims (so it concats into the master
 * and shows up in every cropped output, CTA centered). Best-effort: null on
 * failure so the video still ships without it.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { fetchAsBuffer } from "../../utils/falMedia.js";
import { logger } from "../../utils/logger.js";

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PYTHON = process.env.HASHBEAST_ANIM_PYTHON || "python3";
// When set, a FINALIZED end-card clip is reused for every video (normalized to
// the format dims) instead of generating one - set this to the approved S3 URL.
const FIXED_URL = process.env.CONTENT_ENDCARD_URL || "";
const FONT = process.env.CONTENT_FONT || "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
const SECONDS = Math.max(2, Number(process.env.CONTENT_ENDCARD_SECONDS || 3.5));
const CTA1 = process.env.CONTENT_ENDCARD_CTA1 || "MINE YOUR HASHBEAST";
const CTA2 = process.env.CONTENT_ENDCARD_CTA2 || "minebtc.fun";
const CTA3 = process.env.CONTENT_ENDCARD_CTA3 || "SUBSCRIBE + FOLLOW";

export interface EndCardOptions {
  cta1?: string;
  cta2?: string;
  cta3?: string;
  seconds?: number;
}

function resolveFrom(roots: string[], rel: string): string {
  for (const r of roots) { const p = path.resolve(r, rel); if (fs.existsSync(p)) return p; }
  return "";
}
const ROOTS = [process.cwd(), path.resolve(__dirname, "../../.."), path.resolve(__dirname, "../../../..")];
const SCRIPT = process.env.CONTENT_CARD_SCRIPT || resolveFrom(ROOTS, "scripts/render_card.py");
const BADGE = process.env.VIDEO_BRAND_BADGE_PATH || resolveFrom(ROOTS, "src/assets/brand/brand_badge.png");

const GLYPHS: Record<string, string[]> = {
  "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  "C": ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  "G": ["01111", "10000", "10000", "10011", "10001", "10001", "01110"],
  "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  "J": ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  "K": ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  "Q": ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  "W": ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  "X": ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  "Z": ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["10010", "10010", "10010", "11111", "00010", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  ":": ["00000", "00100", "00100", "00000", "00100", "00100", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
};

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

function encodePng(width: number, height: number, rgba: Buffer): Buffer {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function drawRect(
  rgba: Buffer,
  width: number,
  height: number,
  x: number,
  y: number,
  w: number,
  h: number,
  color: [number, number, number, number],
): void {
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

function textWidth(text: string, scale: number): number {
  return [...text.toUpperCase()].reduce((sum, ch) => sum + (ch === " " ? 3 : 6) * scale, 0) - scale;
}

function drawPixelText(
  rgba: Buffer,
  width: number,
  height: number,
  text: string,
  y: number,
  scale: number,
  color: [number, number, number, number],
): void {
  let x = Math.round((width - textWidth(text, scale)) / 2);
  for (const ch of text.toUpperCase()) {
    if (ch === " ") { x += 3 * scale; continue; }
    const glyph = GLYPHS[ch] || GLYPHS["-"];
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === "1") {
          drawRect(rgba, width, height, x + col * scale, y + row * scale, scale, scale, color);
        }
      }
    }
    x += 6 * scale;
  }
}

function fallbackEndCardPng(width: number, height: number, options: EndCardOptions): Buffer {
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const t = y / Math.max(1, height - 1);
    const r = Math.round(5 + 12 * t);
    const g = Math.round(7 + 10 * t);
    const b = Math.round(16 + 30 * t);
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      rgba[i] = r;
      rgba[i + 1] = g;
      rgba[i + 2] = b;
      rgba[i + 3] = 255;
    }
  }
  const gold: [number, number, number, number] = [247, 188, 42, 255];
  const cyan: [number, number, number, number] = [30, 214, 255, 255];
  const white: [number, number, number, number] = [245, 248, 255, 255];
  const red: [number, number, number, number] = [255, 46, 46, 255];
  const fitScale = (text: string, maxScale: number, maxWidth: number) =>
    Math.max(4, Math.min(maxScale, Math.floor(maxWidth / Math.max(1, textWidth(text, 1)))));
  const brand = "MINEBTC";
  const line1 = options.cta1 || CTA1;
  const line2 = options.cta2 || CTA2;
  const line3 = options.cta3 || CTA3;
  drawPixelText(rgba, width, height, brand, Math.round(height * 0.18), fitScale(brand, Math.round(height * 0.026), width * 0.72), gold);
  drawPixelText(rgba, width, height, line1, Math.round(height * 0.40), fitScale(line1, Math.round(height * 0.016), width * 0.86), white);
  drawPixelText(rgba, width, height, line2, Math.round(height * 0.51), fitScale(line2, Math.round(height * 0.034), width * 0.82), red);
  drawPixelText(rgba, width, height, line3, Math.round(height * 0.76), fitScale(line3, Math.round(height * 0.022), width * 0.76), cyan);
  return encodePng(width, height, rgba);
}

/** Build the CTA end-card as an mp4 clip buffer at width x height (optional hero bg). */
export async function buildEndCardClip(
  width: number,
  height: number,
  hero?: Buffer | null,
  options: EndCardOptions = {},
): Promise<Buffer | null> {
  // Preferred: reuse the FINALIZED clip (one approved asset everywhere), scaled
  // to the format dims. Falls through to generation if it can't be fetched.
  if (FIXED_URL) {
    const fdir = fs.mkdtempSync(path.join(os.tmpdir(), "endcard-fixed-"));
    try {
      const inPath = path.join(fdir, "in.mp4"), outPath = path.join(fdir, "out.mp4");
      fs.writeFileSync(inPath, await fetchAsBuffer(FIXED_URL));
      await execFileP("ffmpeg", [
        "-y", "-i", inPath,
        "-vf", `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30`,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-ar", "44100", "-shortest", "-movflags", "+faststart", outPath,
      ], { maxBuffer: 1 << 27 });
      const buf = fs.readFileSync(outPath);
      if (buf.length > 0) return buf;
    } catch (e: any) {
      logger.warning(`end-card: fixed clip fetch failed (${e?.message || e}) - generating`);
    } finally {
      try { fs.rmSync(fdir, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  }
  if (!SCRIPT) { logger.warning("end-card: render_card.py not found - skipping"); return null; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "endcard-"));
  try {
    const cardPath = path.join(dir, "card.png");
    const clipPath = path.join(dir, "endcard.mp4");
    const args = [SCRIPT, "--mode", "endcard", "--out", cardPath,
      "--width", String(width), "--height", String(height), "--font", FONT,
      "--cta1", options.cta1 || CTA1,
      "--cta2", options.cta2 || CTA2,
      "--cta3", options.cta3 || CTA3];
    if (BADGE) args.push("--badge", BADGE);
    if (hero && hero.length > 0) {
      const heroPath = path.join(dir, "hero.png");
      fs.writeFileSync(heroPath, hero);
      args.push("--hero", heroPath);
    }
    await execFileP(PYTHON, args, { maxBuffer: 1 << 26 });

    // still image -> SECONDS clip with a silent stereo track (matches shot clips for concat).
    const seconds = Math.max(2, Number(options.seconds || SECONDS));
    await execFileP("ffmpeg", [
      "-y", "-loop", "1", "-i", cardPath,
      "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-t", String(seconds),
      "-vf", `scale=${width}:${height},setsar=1,fps=30`,
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", "-movflags", "+faststart", clipPath,
    ], { maxBuffer: 1 << 27 });

    const buf = fs.readFileSync(clipPath);
    return buf.length > 0 ? buf : null;
  } catch (e: any) {
    logger.warning(`end-card build failed (${e?.message || e}) - using built-in fallback`);
    try {
      const cardPath = path.join(dir, "fallback-card.png");
      const clipPath = path.join(dir, "fallback-endcard.mp4");
      fs.writeFileSync(cardPath, fallbackEndCardPng(width, height, options));
      const seconds = Math.max(2, Number(options.seconds || SECONDS));
      await execFileP("ffmpeg", [
        "-y", "-loop", "1", "-i", cardPath,
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-t", String(seconds),
        "-vf", `scale=${width}:${height},setsar=1,fps=30`,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", "-movflags", "+faststart", clipPath,
      ], { maxBuffer: 1 << 27 });
      const buf = fs.readFileSync(clipPath);
      return buf.length > 0 ? buf : null;
    } catch (fallbackError: any) {
      logger.warning(`end-card fallback failed (${fallbackError?.message || fallbackError})`);
      return null;
    }
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}
