/**
 * Deterministic animation assembly — turns a generated frame STRIP (N keyframes
 * of one character on flat magenta, from the image model) into a tight,
 * TRANSPARENT, square, looping APNG.
 *
 * Why APNG (not WebP): ffmpeg's libwebp encoder has no frame-disposal control,
 * so on a transparent background every frame blends over the previous one
 * (caps/arms stack up). APNG supports per-frame disposal=BACKGROUND + blend=
 * SOURCE, so each frame cleanly REPLACES the last. The heavy lifting (slice →
 * chroma-key → union-bbox tight crop → square-canvas placement → optimized
 * APNG) is done by scripts/assemble_anim.py (PIL + numpy + scipy) — one
 * assembler, one result, shared with any preview tooling.
 *
 * Requires python3 + Pillow + numpy + scipy on the host (see
 * docs/nft-pipeline.md). Best-effort callers should catch and fall back to the
 * static image; this throws on hard failures.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const execFileP = promisify(execFile);

export interface StripAssemblyOpts {
  /** Number of evenly-spaced keyframes packed into the strip (left→right). */
  frameCount: number;
  /** Chroma background color of the generated strip, e.g. "0xFF00FF" (magenta). */
  chromaHex?: string;
  /** Per-frame on-screen duration in ms (uniform). */
  frameDurationMs?: number;
  /** Append the reversed frames so the loop ping-pongs seamlessly. */
  boomerang?: boolean;
  /** Output SQUARE canvas size (1:1, matches the DP container). */
  target?: number;
}

const DEFAULTS = { chromaHex: "0xFF00FF", frameDurationMs: 160, boomerang: true, target: 512 };

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

function resolveAssembler(): string {
  const override = process.env.HASHBEAST_ANIM_ASSEMBLER;
  if (override && fs.existsSync(override)) return override;
  const roots = [
    process.cwd(),
    path.resolve(moduleDir, "../.."), // tsx/source: src/utils -> repo
    path.resolve(moduleDir, "../../.."), // compiled: dist/src/utils -> repo
  ];
  for (const root of roots) {
    const p = path.resolve(root, "scripts/assemble_anim.py");
    if (fs.existsSync(p)) return p;
  }
  return "";
}

const PYTHON = process.env.HASHBEAST_ANIM_PYTHON || "python3";

/**
 * Strip → tight, transparent, square, looping APNG buffer.
 * (Name kept generic; output is APNG bytes — upload as image/png.)
 */
export async function stripToTransparentApng(strip: Buffer, opts: StripAssemblyOpts): Promise<Buffer> {
  const assembler = resolveAssembler();
  if (!assembler) throw new Error("assemble_anim.py not found (set HASHBEAST_ANIM_ASSEMBLER)");
  const o = { ...DEFAULTS, ...opts };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "anim-"));
  const stripPath = path.join(dir, "strip.png");
  const outPath = path.join(dir, "out.png");
  try {
    fs.writeFileSync(stripPath, strip);
    await execFileP(PYTHON, [
      assembler, stripPath, outPath,
      String(o.frameCount), o.chromaHex, String(o.frameDurationMs),
      o.boomerang ? "1" : "0", String(o.target),
    ], { maxBuffer: 1 << 26 });
    return fs.readFileSync(outPath);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}
