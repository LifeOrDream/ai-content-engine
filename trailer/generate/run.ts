/**
 * Trailer video generator CLI (standalone testbed — run with tsx).
 *
 *   # full auto: render every SEQUENCE (one Seedance timeline generation each,
 *   # native audio), then assemble final.mp4
 *   npx tsx trailer/generate/run.ts 01
 *
 *   # sequence-by-sequence with approval (push each to Telegram, wait for y/regen/stop)
 *   npx tsx trailer/generate/run.ts 01 --approve --tg
 *
 *   npx tsx trailer/generate/run.ts 01 --from 3         # resume from sequence 3
 *   npx tsx trailer/generate/run.ts 01 --only 5 --regen # re-render just sequence 5
 *   npx tsx trailer/generate/run.ts 01 --no-assemble    # render sequences, skip final stitch
 *
 * Needs trailer/out/<id>/scenes.json (produced by the script pipeline:
 *   npx tsx trailer/pipeline/run.ts 01). Sequence flow per sequence:
 *   start frame (ref sheets + env chains, cached to out/<id>/frames/) →
 *   Seedance timeline generation → timed captions → normalize. Render IN ORDER
 *   (env:seqN.startFrame chains need earlier frames). Old per-shot scenes.json
 *   files fall back to the legacy renderer automatically.
 *
 * Quality knobs: TRAILER_VIDEO_RES (1080p|720p|480p — draft cheap, final 1080p),
 *   TRAILER_IMAGE_RES (2K|1K), TRAILER_VIDEO_MAX_SEC (12 on Seedance v1; raise on
 *   a 2.0 endpoint via MUTATION_VIDEO_FAL_MODEL), TRAILER_MUSIC_URL (optional bed
 *   under native audio), TRAILER_SAVE_PROMPTS=true (dump per-seq prompts),
 *   TRAILER_APPROVE_PER_SCENE.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateTrailer } from "./generate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "out");

function has(flag: string): boolean { return process.argv.includes(flag); }
function val(flag: string): string | undefined { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : undefined; }

function resolveScenes(idArg: string): { scenesPath: string; outDir: string } {
  // accept an explicit scenes.json path, or a blueprint id (prefix match under out/)
  if (idArg.endsWith(".json") && fs.existsSync(idArg)) {
    return { scenesPath: idArg, outDir: path.dirname(idArg) };
  }
  const dirs = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((d) => fs.existsSync(path.join(OUT, d, "scenes.json"))) : [];
  const hit = dirs.find((d) => d === idArg) || dirs.find((d) => d.startsWith(idArg)) || dirs.find((d) => d.includes(idArg));
  if (!hit) throw new Error(`No scenes.json for "${idArg}". Run the script pipeline first (npx tsx trailer/pipeline/run.ts ${idArg}). Have: ${dirs.join(", ") || "none"}`);
  return { scenesPath: path.join(OUT, hit, "scenes.json"), outDir: path.join(OUT, hit) };
}

async function main() {
  const idArg = process.argv[2];
  if (!idArg || idArg.startsWith("--")) {
    console.log("Usage: npx tsx trailer/generate/run.ts <blueprintId|scenes.json> [--approve] [--tg] [--from N] [--only N] [--regen] [--no-assemble]");
    return;
  }
  const { scenesPath, outDir } = resolveScenes(idArg);
  await generateTrailer(scenesPath, outDir, {
    approvePerScene: has("--approve") || process.env.TRAILER_APPROVE_PER_SCENE === "true",
    telegramScenes: has("--tg") || process.env.TRAILER_TG_SCENES === "true",
    fromScene: Number(val("--from") || 1),
    onlyScene: val("--only") ? Number(val("--only")) : undefined,
    regen: has("--regen"),
    assemble: !has("--no-assemble"),
  });
}

main().catch((e) => { console.error("\ntrailer generation failed:", e?.message || e); process.exit(1); });
