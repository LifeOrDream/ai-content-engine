/**
 * Canonize a finished trailer/video AFTER it is actually posted.
 *
 * Draft generation writes trailer/out/<id>/canon-draft.json, but does not mutate
 * story memory. This command is the explicit publish gate:
 *
 *   npx tsx trailer/pipeline/canonize.ts 01 --platform x --url https://x.com/... --video-no 1
 *
 * The resulting memory packet is injected into future trailer script runs.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonizePostedVideo, storyMemoryPath } from "../world/storyMemory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRAILER_ROOT = path.resolve(__dirname, "..");
const OUT = path.join(TRAILER_ROOT, "out");

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function resolveOutDir(idArg: string): string {
  const dirs = fs.existsSync(OUT)
    ? fs.readdirSync(OUT).filter((f) => !f.startsWith("_") && fs.statSync(path.join(OUT, f)).isDirectory())
    : [];
  const hit =
    dirs.find((d) => d === idArg) ||
    dirs.find((d) => d.startsWith(idArg)) ||
    dirs.find((d) => d.includes(idArg));
  if (!hit) throw new Error(`No trailer/out directory matching "${idArg}". Available: ${dirs.join(", ") || "(none)"}`);
  return path.join(OUT, hit);
}

function main(): void {
  const idArg = process.argv[2];
  if (!idArg || idArg.startsWith("--")) {
    console.log("Usage: npx tsx trailer/pipeline/canonize.ts <blueprintId> --platform x --url <post-url> [--video-no N] [--posted-at ISO]");
    return;
  }
  const outDir = resolveOutDir(idArg);
  const scenesPath = path.join(outDir, "scenes.json");
  if (!fs.existsSync(scenesPath)) throw new Error(`Missing scenes.json in ${outDir}`);
  const memory = canonizePostedVideo({
    scenesPath,
    outDir,
    platform: arg("--platform"),
    url: arg("--url"),
    videoNo: arg("--video-no") ? Number(arg("--video-no")) : undefined,
    postedAt: arg("--posted-at"),
  });
  const latest = memory.videos[memory.videos.length - 1];
  console.log(`canonized video #${latest.videoNo}: ${latest.title}`);
  console.log(`memory: ${storyMemoryPath()}`);
  console.log(`arcs touched: ${latest.arcsTouched.join(", ") || "(none)"}`);
}

try {
  main();
} catch (e: any) {
  console.error(`canonize failed: ${e?.message || e}`);
  process.exit(1);
}

