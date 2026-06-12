/**
 * Phase F4 acceptance — validate the stable-audio path with AT MOST 2 cues.
 *
 * Deliberately tiny: this is a path validation, not a catalog build. The full
 * catalog generates later through the budget-gated `audio.identity_cue` job.
 *
 * Requires FAL_API_KEY (or FAL_KEY) in env — never printed. Run:
 *   npx tsx scripts/acceptance_audio_identity.ts [cueId cueId]
 * Defaults: leitmotif_usa + ritual_lootbox_near_miss.
 */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  audioCue,
  generateAudioIdentityCue,
} from "../src/world/audioIdentity.js";
import { fetchAsBuffer } from "../src/utils/falMedia.js";

// fal helpers read FAL_API_KEY; accept the FAL_KEY alias used elsewhere.
if (!process.env.FAL_API_KEY && process.env.FAL_KEY) {
  process.env.FAL_API_KEY = process.env.FAL_KEY;
}
process.env.AUDIO_IDENTITY_GENERATION_ENABLED = "true"; // explicit, scoped to this run

const requested = process.argv.slice(2).filter(Boolean);
const cueIds = (requested.length ? requested : ["leitmotif_usa", "ritual_lootbox_near_miss"]).slice(0, 2);

async function main(): Promise<void> {
  if (!process.env.FAL_API_KEY) {
    console.error("FAL_API_KEY/FAL_KEY not set — acceptance generation needs a key in env.");
    process.exit(1);
  }
  const outDir = join(process.cwd(), "logs", "audio-identity");
  mkdirSync(outDir, { recursive: true });
  for (const id of cueIds) {
    const cue = audioCue(id);
    if (!cue) {
      console.error(`unknown cue id: ${id}`);
      process.exit(1);
    }
    console.log(`▶ generating ${cue.id} (${cue.category}, ${cue.seconds}s) via stable-audio…`);
    const res = await generateAudioIdentityCue(cue.id);
    const buf = await fetchAsBuffer(res.url);
    const file = join(outDir, `${cue.id}.wav`);
    writeFileSync(file, buf);
    console.log(`  ✓ ${cue.id} model=${res.model || "stable-audio"} bytes=${buf.length}`);
    console.log(`    fal url : ${res.url}`);
    console.log(`    local   : ${file}`);
  }
  console.log(`\n✓ stable-audio path validated with ${cueIds.length} cue(s) — do NOT mass-generate; the catalog ships via the budget-gated audio.identity_cue job.`);
}

main().catch((e) => {
  console.error(`acceptance failed: ${e?.message || e}`);
  process.exit(1);
});
