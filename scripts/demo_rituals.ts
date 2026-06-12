/**
 * Phase F fixture demo — NO network, NO spend.
 *
 * Prints the three staged ritual definitions (lootbox WIN, lootbox NEAR-MISS,
 * EVOLUTION) side by side and exits non-zero if they ever collapse into the
 * same shape. This is the acceptance fixture proving the casino moments
 * resolve to DISTINCT staged rituals (acts + rarity light language + sound
 * ids), not a toast.
 *
 * Run: npm run demo:rituals   (part of check:oss)
 */
import {
  buildClaimRollCeremony,
  buildEvolutionRitual,
  buildLootboxRevealRitual,
  type StagedRitual,
} from "../src/nft-pipeline/ritual.js";
import { audioCue } from "../src/world/audioIdentity.js";

function show(label: string, r: StagedRitual): void {
  console.log(`\n━━ ${label} — ${r.ritualId} (${r.totalDurationMs}ms) ━━`);
  for (const a of r.acts) {
    console.log(`  [${a.act}] ${a.title} · ${a.durationMs}ms`);
    console.log(`    staging : ${a.staging}`);
    console.log(`    light   : ${a.lightLanguage}`);
    console.log(
      `    sound   : ${a.soundCueId} (${audioCue(a.soundCueId)?.category || "legacy"}) → fallback "${a.fallbackSoundId}"`,
    );
    if (a.caption) console.log(`    caption : ${a.caption}`);
  }
}

// The same on-chain shape the backend sees: roll UNDER threshold wins.
const win = buildLootboxRevealRitual({
  rollValue: 412,
  thresholdBps: 1000,
  factionId: 10, // Brazil reveal
  revealStage: 6, // epic-tier beast
});
const nearMiss = buildLootboxRevealRitual({
  rollValue: 1063,
  thresholdBps: 1000, // missed by 63 bps — the lock almost turned
  factionId: 2,
});
const evolution = buildEvolutionRitual({ factionId: 4, fromStage: 4, toStage: 5 });
const claim = buildClaimRollCeremony({ result: "power", factionId: 7 });

show("LOOTBOX WIN", win);
show("LOOTBOX NEAR-MISS", nearMiss);
show("EVOLUTION", evolution);
show("CLAIM-ROLL CEREMONY", claim);

const signatures = [win, nearMiss, evolution].map(
  (r) =>
    `${r.acts.map((a) => a.act).join(",")}|${r.acts.map((a) => a.lightLanguage).join("|")}|${r.acts
      .map((a) => a.soundCueId)
      .join(",")}`,
);
const distinct = new Set(signatures).size === 3;
const staged = [win, nearMiss, evolution, claim].every((r) => r.acts.length >= 2);

console.log(
  `\n${distinct && staged ? "✓" : "✗"} lootbox-win, lootbox-near-miss and evolution resolve to DISTINCT staged rituals (acts + light language + sound ids)`,
);
if (!distinct || !staged) process.exit(1);
