/**
 * Cheap real-world validation of the Seedance 2.0 multi-scene primitive:
 * ONE 10s 480p two-scene generation from a grounded keyframe, proving
 * (a) the in-prompt cut lands and (b) the end-frame control + identity hold.
 *
 *   npx tsx scripts/validate_scene_sequence.ts
 *
 * Costs ~$0.70 (10s @ 480p). Output lands under trailer/out/validate-scenes/
 * (gitignored): master.mp4 + probe frames (t≈1/4/6/9s) for eyeballing the cut.
 * Requires FAL_API_KEY + assets-bucket AWS creds in .env (frame upload).
 */
import "dotenv/config";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateSceneSequence, uploadBufferToS3 } from "../src/utils/falMedia.js";

const execFileP = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "trailer", "out", "validate-scenes");

// Grounded keyframes from the shipped moonshot production refs.
const START_REF = path.join(ROOT, "trailer", "reference", "moonshot", "minted", "hashbeast3_southkorea_white_jindo.png");
const END_REF = path.join(ROOT, "trailer", "reference", "moonshot", "chars", "southkorea.png");

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of [START_REF, END_REF]) {
    if (!fs.existsSync(f)) throw new Error(`missing reference: ${f}`);
  }
  console.log("uploading reference frames…");
  const startUrl = await uploadBufferToS3(
    `scene-sequences/validate/start-${Date.now()}.png`, fs.readFileSync(START_REF), "image/png");
  const endUrl = await uploadBufferToS3(
    `scene-sequences/validate/end-${Date.now()}.png`, fs.readFileSync(END_REF), "image/png");

  console.log("ONE Seedance 2.0 call: 10s, 480p, two scenes (in-prompt cut), end-frame anchored…");
  const t0 = Date.now();
  const result = await generateSceneSequence(
    [
      {
        direction:
          "the jindo dog character holds perfectly still in a foggy pre-dawn launch-pad clearing, red strobes pulsing through the fog, a slow cinematic push-in toward its calm face",
        refStartImage: startUrl,
        durationHint: 5,
      },
      {
        direction:
          "the SAME jindo dog character now stands in a bright open-pit dBTC mine, warm orange glow underlighting it, it raises one paw in a confident salute and holds the pose",
        refEndImage: endUrl,
        durationHint: 5,
      },
    ],
    {
      totalDuration: 10,
      aspectRatio: "16:9",
      resolution: "480p",
      generateAudio: false,
      seed: 42,
      globalDirection:
        "GLOBAL: one stylized pixel-art jindo dog game character — identity, face, markings and style IDENTICAL across both scenes. No text, captions, logos or UI anywhere.",
    },
  );
  const secs = ((Date.now() - t0) / 1000).toFixed(0);

  const master = path.join(OUT, "master.mp4");
  fs.writeFileSync(master, result.master.buffer);
  console.log(`✓ ${result.segments.length} segment(s), requested ${result.totalSeconds}s, wall ${secs}s`);
  console.log(`  model=${result.segments[0]?.model} requestId=${result.segments[0]?.requestId}`);
  console.log(`  master → ${master}`);
  fs.writeFileSync(path.join(OUT, "prompt.txt"), result.segments.map((s) => s.prompt).join("\n\n---\n\n"));

  // Probe frames around the cut + the end-frame pull for eyeball QA.
  for (const t of [1, 4, 6, 9]) {
    const frame = path.join(OUT, `frame_t${t}.png`);
    await execFileP("ffmpeg", ["-y", "-ss", String(t), "-i", master, "-frames:v", "1", frame], { maxBuffer: 1 << 26 });
  }
  console.log("  probe frames → frame_t{1,4,6,9}.png (cut should land between t4 and t6)");
}

main().catch((e) => {
  console.error("validation failed:", e?.message || e);
  process.exit(1);
});
