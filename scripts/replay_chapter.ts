/**
 * Replay a previously-produced Hashiden chapter (standalone CLI) — re-run a past
 * chapter with the CURRENT code so you can compare the new video/script against
 * the old one. Replays land BESIDE the original (never overwrite it).
 *
 *   # full: re-run script + render from the archived facts
 *   FAL_API_KEY=… npx tsx scripts/replay_chapter.ts <warId>
 *   npx tsx scripts/replay_chapter.ts <warId> --mode full
 *
 *   # render-only: freeze a prior version's scenes.json and re-render ONLY the
 *   # video (clean A/B of trailer/generate changes; script held identical)
 *   FAL_API_KEY=… npx tsx scripts/replay_chapter.ts <warId> --mode render-only
 *   npx tsx scripts/replay_chapter.ts <warId> --mode render-only --from <version>
 *
 * Use your own FAL_API_KEY in the environment to bill the replay to your account.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { produceChapterVideo, renderScenesToVideo } from "../src/service/chapterVideo.js";
import {
  gitShortSha,
  latestVersion,
  loadChapterSource,
  newVersionDir,
  readRunCostUsd,
  versionDir,
  writeReplayManifest,
  type ReplayMode,
} from "../trailer/world/chapterArchive.js";

function val(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const warId = Number(process.argv[2]);
  if (!Number.isFinite(warId)) {
    console.log("Usage: npx tsx scripts/replay_chapter.ts <warId> [--mode full|render-only] [--from <version>]");
    process.exit(1);
  }
  const mode = (val("--mode") || "full") as ReplayMode;
  if (mode !== "full" && mode !== "render-only") throw new Error(`--mode must be full|render-only (got "${mode}")`);

  const gitSha = gitShortSha();
  const { version, dir } = newVersionDir(warId, gitSha);
  const keySource = process.env.CHAPTER_KEY_SOURCE || (process.env.FAL_API_KEY ? "env" : "none");
  console.log(`\n🎬 Replaying chapter ${warId} · mode ${mode} → version ${version}\n`);

  let videoPath: string | null = null;
  let fromVersion: string | null = null;

  if (mode === "render-only") {
    fromVersion = val("--from") || latestVersion(warId);
    if (!fromVersion) throw new Error(`No prior version to render from for chapter ${warId}. Run a full produce/replay first.`);
    const srcScenes = path.join(versionDir(warId, fromVersion), "scenes.json");
    if (!fs.existsSync(srcScenes)) throw new Error(`Version ${fromVersion} has no scenes.json to freeze.`);
    // Freeze the prior screenplay verbatim, then re-render ONLY the video.
    fs.copyFileSync(srcScenes, path.join(dir, "scenes.json"));
    console.log(`   frozen scenes.json from version ${fromVersion} (script held identical)\n`);
    videoPath = await renderScenesToVideo(path.join(dir, "scenes.json"), dir);
  } else {
    const { facts } = loadChapterSource(warId);
    const res = await produceChapterVideo(facts, dir, {});
    videoPath = res.videoPath;
  }

  writeReplayManifest(dir, {
    warId,
    version,
    gitSha,
    mode,
    fromVersion,
    keySource,
    costUsd: readRunCostUsd(dir),
    videoPath: videoPath ? path.relative(dir, videoPath) : null,
    createdAt: new Date().toISOString(),
  });

  console.log(`\n✅ replay ${warId} (${mode}) ready → ${dir}`);
  if (videoPath) console.log(`   video: ${videoPath}`);
  console.log(`   compare against earlier versions under trailer/out/chapters/${warId}/`);
}

main().catch((e) => {
  console.error("\nreplay_chapter failed:", e?.message || e);
  process.exit(1);
});
