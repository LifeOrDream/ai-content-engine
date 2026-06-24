/**
 * Produce a Hashiden chapter episode video from cycle facts (standalone CLI).
 *
 *   FAL_API_KEY=… npx tsx scripts/produce_chapter.ts <facts.json>
 *   npx tsx scripts/produce_chapter.ts <facts.json> --script-only   # stop at scenes.json
 *
 * Archives the facts as the chapter's immutable replay source, then renders a
 * fresh version under trailer/out/chapters/<warId>/<version>/. Use your own
 * FAL_API_KEY in the environment to bill experimental runs to your account.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { produceChapterVideo } from "../src/service/chapterVideo.js";
import {
  archiveChapterSource,
  gitShortSha,
  newVersionDir,
  writeReplayManifest,
} from "../trailer/world/chapterArchive.js";
import type { ChapterCycleFacts } from "../src/content-engine/chapterWriter.js";

async function main() {
  const factsPath = process.argv[2];
  if (!factsPath || factsPath.startsWith("--")) {
    console.log("Usage: npx tsx scripts/produce_chapter.ts <facts.json> [--script-only]");
    process.exit(1);
  }
  const facts = JSON.parse(fs.readFileSync(factsPath, "utf8")) as ChapterCycleFacts;
  if (typeof facts.warId !== "number") throw new Error("facts.json must include a numeric warId");
  const scriptOnly = process.argv.includes("--script-only");

  const gitSha = gitShortSha();
  archiveChapterSource(facts.warId, { facts, gitSha });
  const { version, dir } = newVersionDir(facts.warId, gitSha);
  console.log(`\n🎬 Producing chapter ${facts.warId} → version ${version}${scriptOnly ? " (script only)" : ""}\n`);

  const res = await produceChapterVideo(facts, dir, { scriptOnly });

  writeReplayManifest(dir, {
    warId: facts.warId,
    version,
    gitSha,
    mode: "produce",
    keySource: process.env.CHAPTER_KEY_SOURCE || (process.env.FAL_API_KEY ? "env" : "none"),
    costUsd: res.costUsd,
    videoPath: res.videoPath ? path.relative(dir, res.videoPath) : null,
    createdAt: new Date().toISOString(),
  });

  console.log(`\n✅ chapter ${facts.warId} ${scriptOnly ? "script" : "video"} ready → ${dir}`);
  if (res.videoPath) console.log(`   video: ${res.videoPath}`);
}

main().catch((e) => {
  console.error("\nproduce_chapter failed:", e?.message || e);
  process.exit(1);
});
