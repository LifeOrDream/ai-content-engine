/**
 * REEL PRODUCER — the engine-side `produce_reel` job (Phase 4 cutover target).
 *
 * Exposes the engine's existing trailer renderer as a service job so the backend
 * can dispatch reel production instead of rendering in-process. A reel is a short
 * trailer: we synthesize a Blueprint from the dispatched spec, run the same
 * script→produce passes → scenes.json → generateTrailer as the chapter producer,
 * then upload the final video to S3 and return the URL.
 *
 *   { blueprint } → runScriptPipeline → renderScenesToVideo → S3 → { videoUrl }
 *
 * Parity note: this uses the engine's trailer pipeline (sequence-based Seedance
 * renderer), not a 1:1 port of the backend's per-shot shotRender. Dual-run /
 * compare reel style before flipping CONTENT_VIA_ENGINE for reels.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runScriptPipeline } from "../../trailer/pipeline/run.js";
import { renderScenesToVideo } from "./chapterVideo.js";
import { uploadBufferToS3 } from "../utils/falMedia.js";
import type { Blueprint } from "../../trailer/pipeline/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REELS_OUT = path.resolve(__dirname, "..", "..", "trailer", "out", "reels");

/** The dispatched reel spec — the trailer Blueprint fields the backend supplies. */
export interface ReelInput {
  id: string;
  title?: string;
  genre?: string;
  aspect?: string;
  targetSeconds?: number;
  minSeconds?: number;
  countdown?: string;
  cta?: string;
  logline?: string;
  cast?: string[];
  /** Markdown body: the grounding facts + beats + dialogue intent for the reel. */
  body: string;
}

export interface ProduceReelResult {
  reelId: string;
  /** Public S3/CDN url of the final video (null when the render produced nothing). */
  videoUrl: string | null;
  scenesPath: string;
  socialCopy: { title: string; caption: string };
  costUsd: number | null;
}

function toBlueprint(input: ReelInput): Blueprint {
  const aspect = ["16:9", "9:16", "1:1"].includes((input.aspect || "").trim())
    ? input.aspect!.trim()
    : "9:16";
  return {
    id: input.id,
    title: input.title || input.id,
    genre: input.genre || "story",
    aspect,
    targetSeconds: input.targetSeconds ?? 30,
    minSeconds: input.minSeconds ?? 12,
    countdown: input.countdown || "24:00:00",
    cta: input.cta || "Mine your HashBeast — minebtc.fun",
    logline: input.logline || "",
    cast: input.cast || [],
    body: input.body,
  };
}

function readCostUsd(dir: string): number | null {
  try {
    const m = JSON.parse(fs.readFileSync(path.join(dir, "run-manifest.json"), "utf8"));
    const usd = m?.costEstimate?.estimatedUsd;
    return typeof usd === "number" ? usd : null;
  } catch {
    return null;
  }
}

/** Produce a reel from a dispatched spec and return a public video URL. */
export async function produceReel(input: ReelInput): Promise<ProduceReelResult> {
  if (!input?.id) throw new Error("produceReel: input.id is required");
  const bp = toBlueprint(input);
  const outDir = path.join(REELS_OUT, input.id);
  fs.mkdirSync(outDir, { recursive: true });

  const { scenesPath } = await runScriptPipeline(bp, outDir);
  const localVideo = await renderScenesToVideo(scenesPath, outDir);

  let videoUrl: string | null = null;
  if (localVideo && fs.existsSync(localVideo)) {
    const buf = fs.readFileSync(localVideo);
    videoUrl = await uploadBufferToS3(`reels/${input.id}/${path.basename(localVideo)}`, buf, "video/mp4");
  }

  return {
    reelId: input.id,
    videoUrl,
    scenesPath,
    socialCopy: { title: bp.title, caption: bp.logline },
    costUsd: readCostUsd(outDir),
  };
}
