/**
 * Cycle summary stitch — merges a beast's transition clips from one war cycle
 * (trait + evolution moments, in order) into ONE opaque MP4 "progress video".
 *
 * Each APNG transition clip is normalized (fps/scale/pad to a square canvas on
 * the console background) and concatenated with ffmpeg. Requires `ffmpeg` on
 * PATH.
 *
 * Stays in the backend: deciding WHICH clips belong to the cycle (Redis cycle
 * memory), the per-NFT cycle-history row, content-video/filmography records,
 * and the `hashbeast:cycle_summary` socket emit.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { fetchAsBuffer } from "../utils/falMedia.js";
import { logger } from "../utils/logger.js";
import {
  getDefaultArtifactStore,
  storeArtifact,
  type ArtifactStore,
  type NftArtifact,
} from "./artifacts.js";

const execFileP = promisify(execFile);

const SUMMARY_FPS = Math.max(8, Number(process.env.NFT_CYCLE_SUMMARY_FPS || 15));
const SUMMARY_SIZE = Math.max(360, Number(process.env.NFT_CYCLE_SUMMARY_SIZE || 720));
const SUMMARY_BG = process.env.NFT_CYCLE_SUMMARY_BG || "0x0d0f1a";

export interface CycleClipInput {
  /** Moment kind, e.g. "trait" | "evolution". */
  kind: string;
  /** APNG transition clip URL (must be fetchable by the worker). */
  url: string;
  dialogue?: string;
}

export interface NftCycleSummaryInput {
  beast: { mint: string; storagePath?: string };
  /** Faction-war/cycle id — used for the storage key. */
  warId: number;
  /** Transition clips in chronological order. */
  clips: CycleClipInput[];
}

export interface NftCycleSummaryResult {
  mint: string;
  warId: number;
  /** The stitched summary MP4, or null when no clip could be processed. */
  summary: NftArtifact | null;
  clipCount: number;
  segmentsUsed: number;
}

/**
 * APNG transition clips → one concatenated MP4 progress video.
 * Per-segment failures are tolerated; returns null only when nothing usable.
 */
export async function generateCycleSummary(
  input: NftCycleSummaryInput,
  opts: { store?: ArtifactStore } = {},
): Promise<NftCycleSummaryResult> {
  const store = opts.store || getDefaultArtifactStore();
  const withVideo = input.clips.filter((c) => c.url);
  const base: NftCycleSummaryResult = {
    mint: input.beast.mint,
    warId: input.warId,
    summary: null,
    clipCount: withVideo.length,
    segmentsUsed: 0,
  };
  if (withVideo.length === 0) return base;

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cyclevid-"));
  try {
    const segs: string[] = [];
    const vf =
      `fps=${SUMMARY_FPS},scale=${SUMMARY_SIZE}:${SUMMARY_SIZE}:force_original_aspect_ratio=decrease,` +
      `pad=${SUMMARY_SIZE}:${SUMMARY_SIZE}:(ow-iw)/2:(oh-ih)/2:color=${SUMMARY_BG},format=yuv420p`;
    for (let i = 0; i < withVideo.length; i++) {
      try {
        const apng = path.join(dir, `c_${i}.png`);
        fs.writeFileSync(apng, await fetchAsBuffer(withVideo[i].url));
        const seg = path.join(dir, `s_${String(i).padStart(3, "0")}.mp4`);
        await execFileP(
          "ffmpeg",
          ["-y", "-i", apng, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", String(SUMMARY_FPS), "-an", seg],
          { maxBuffer: 1 << 26 },
        );
        segs.push(seg);
      } catch (e: any) {
        logger.warning(`cycle-vid: seg ${i} failed: ${e?.message || e}`);
      }
    }
    if (segs.length === 0) return base;

    const listFile = path.join(dir, "list.txt");
    fs.writeFileSync(listFile, segs.map((s) => `file '${s}'`).join("\n"));
    const out = path.join(dir, "summary.mp4");
    await execFileP(
      "ffmpeg",
      ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
      { maxBuffer: 1 << 26 },
    );
    const buf = fs.readFileSync(out);
    const key = `${input.beast.storagePath || `misc/${input.beast.mint}`}/cycles/${input.warId}/summary.mp4`;
    const summary = await storeArtifact(store, {
      kind: "cycle_summary",
      key,
      buffer: buf,
      contentType: "video/mp4",
    });
    logger.success(
      `🏁 cycle ${input.warId} summary stitched for ${input.beast.mint.slice(0, 8)}… (${segs.length}/${withVideo.length} clips)`,
    );
    return { ...base, summary, segmentsUsed: segs.length };
  } catch (e: any) {
    logger.warning(`cycle-vid: build failed: ${e?.message || e}`);
    return base;
  } finally {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}
