/**
 * Progression + moment grammar acceptance tests (Phases B+C).
 *
 * Cheap and deterministic: pure prompt-builder assertions, NO network, NO
 * generation spend. Run via `npm run test:grammar` (part of check:oss).
 *
 * Proves:
 *  (i)   stage-2 vs stage-5 evolution ceremonies differ materially
 *        (different canonical names, aura tokens, beat text),
 *  (ii)  two countries produce different aura language,
 *  (iii) first-win vs streak-win vs revenge-win produce different dialogue
 *        directives + body-language tokens for the SAME beast,
 *  plus: named-technique determinism/coverage, stage-aware state performance,
 *        emotional-arc gating, rivalry continuity, moment derivation
 *        precedence, and a banned-lexicon sweep over every static grammar
 *        string.
 */
import {
  PROGRESSION_STAGES,
  STAGE_TRANSITIONS,
  TECHNIQUES,
  allTechniqueNames,
  auraTokens,
  countryAuraFlavor,
  evolutionCeremony,
  performanceBand,
  stagePerformance,
  stageTransition,
  techniqueFor,
} from "../src/world/progression.js";
import {
  ALL_MOMENT_TYPES,
  buildMomentDialoguePrompt,
  deriveMoment,
  emotionalArcDirective,
  lootboxRollNearMiss,
  lootboxRollWon,
  momentGrammar,
  rivalEdgeFor,
  rivalryBlock,
} from "../src/nft-pipeline/moments.js";
import {
  evolutionCeremonyAction,
  transitionAction,
  transitionTechnique,
  buildDialoguePrompt,
} from "../src/nft-pipeline/mutationContent.js";
import { stateActionFor, type BeastProfile } from "../src/nft-pipeline/stateAnimations.js";
import { dialogueSmells } from "../src/content-engine/dialogueQuality.js";
import type { NftBeastInput } from "../src/nft-pipeline/types.js";
import {
  BASE_TYPE_IDS,
  BASE_TYPES,
  baseTypeCountrySkin,
  baseTypeMascotPhrase,
  baseTypeMotionDirective,
  baseTypeRenderBlock,
  getBreedForBaseType,
  normalizeBaseType,
  safeBaseType,
} from "../src/world/baseTypes.js";
import { buildHashBeastPrompt } from "../src/prompts/index.js";
import { comparisonPrompt } from "../src/nft-pipeline/identity.js";
import { buildVoiceDesignPrompt, voiceKeyFor } from "../src/nft-pipeline/voice.js";
import { RARITY_TIERS, rarityTier, rarityTierForStage } from "../src/world/bible.js";
import {
  ALL_AUDIO_CUE_IDS,
  AUDIO_IDENTITY_CUES,
  COUNTRY_LEITMOTIFS,
  EVOLUTION_STINGS,
  LEGACY_SOUND_IDS,
  audioCue,
  countryLeitmotif,
  evolutionSting,
  fanfareCueIdFor,
  legacyPlayableSoundId,
} from "../src/world/audioIdentity.js";
import {
  buildClaimRollCeremony,
  buildEvolutionRitual,
  buildLootboxRevealRitual,
  lootboxRitualKind,
} from "../src/nft-pipeline/ritual.js";

let failures = 0;
let passes = 0;

function check(name: string, cond: boolean, detail = ""): void {
  if (cond) {
    passes += 1;
    console.log(`  ✓ ${name}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function profileFor(stage: number, factionId = 0, isWizard = false): BeastProfile {
  const names: Record<number, [string, string]> = {
    0: ["USA", "usa"],
    1: ["China", "china"],
    2: ["Russia", "russia"],
  };
  const [factionName, factionCode] = names[factionId] || ["USA", "usa"];
  return {
    isWizard,
    occupation: "",
    factionId,
    factionName,
    factionCode,
    evolutionStage: stage,
    baseType: "canine",
  };
}

const beast: NftBeastInput = {
  mint: "TestMint1111111111111111111111111111111111",
  factionId: 0,
  personality: { archetype: "cocky brawler", tone: "loud", motivation: "glory" },
};

// ─── Structure sanity ────────────────────────────────────────────────────────
console.log("\nB1 · stages + transitions");
check("8 canonical stages", PROGRESSION_STAGES.length === 8);
check(
  "stage names canon",
  PROGRESSION_STAGES.map((s) => s.name).join(",") ===
    "Pup,Initiate,Operative,Veteran,Elite,Commander,Legend,Ascended",
);
check("7 transitions", STAGE_TRANSITIONS.length === 7);
check(
  "every transition has a unique canonical name",
  new Set(STAGE_TRANSITIONS.map((t) => t.name)).size === 7,
);
check(
  "aura tokens escalate (every stage distinct)",
  new Set(PROGRESSION_STAGES.map((s) => auraTokens(s.stage))).size === 8,
);

// ─── (i) stage-2 vs stage-5 evolution ceremonies differ materially ──────────
console.log("\nB2 · evolution ceremony (stage-2 vs stage-5)");
const evoTo2 = evolutionCeremonyAction(profileFor(1), 2, 1); // 1 → 2
const evoTo5 = evolutionCeremonyAction(profileFor(4), 5, 4); // 4 → 5
check("ceremony prompts differ", evoTo2 !== evoTo5);
check(
  "different aura tokens (stage 2 sheath vs stage 5 banner)",
  evoTo2.includes("close-fitting aura sheath") && evoTo5.includes("room-filling banner of aura"),
);
check(
  "different transition canon (Tool Bond silhouette vs Banner Rising silhouette)",
  evoTo2.includes(stageTransition(2).silhouetteChange) &&
    evoTo5.includes(stageTransition(5).silhouetteChange) &&
    stageTransition(2).name !== stageTransition(5).name,
);
for (const [label, txt] of [
  ["stage-2", evoTo2],
  ["stage-5", evoTo5],
] as const) {
  check(
    `${label} ceremony has all 3 beats (CHARGE/BURST/REVEAL)`,
    txt.includes("CHARGE") && txt.includes("BURST") && txt.includes("REVEAL"),
  );
}
check(
  "ceremony names never enter image prompts (text-free rule)",
  !evoTo2.includes(stageTransition(2).name) && !evoTo5.includes(stageTransition(5).name),
);
check(
  "transitionAction(evolution) routes through the ceremony",
  transitionAction("evolution", profileFor(1), 2, { fromStage: 1 }) === evoTo2,
);

// ─── (ii) two countries → different aura language ────────────────────────────
console.log("\nB1 · country aura modulation");
const usaAura = countryAuraFlavor(0);
const russiaAura = countryAuraFlavor(2);
check("USA vs Russia aura language differs", usaAura !== russiaAura);
check("USA aura speaks ticker-ribbon gold", /ticker/i.test(usaAura));
check("Russia aura speaks frost pressure", /frost/i.test(russiaAura));
check("China aura speaks jade rings", /jade/i.test(countryAuraFlavor(1)));
const usaCeremony = evolutionCeremony(0, 1, 2).map((b) => b.action).join(" ");
const ruCeremony = evolutionCeremony(2, 1, 2).map((b) => b.action).join(" ");
check("same transition, different countries → different ceremonies", usaCeremony !== ruCeremony);

// ─── B3 · stage-aware performance ────────────────────────────────────────────
console.log("\nB3 · stage-aware state performance");
check("bands: 0→pup, 3→soldier, 5→elite, 7→ascendant",
  performanceBand(0) === "pup" && performanceBand(3) === "soldier" &&
  performanceBand(5) === "elite" && performanceBand(7) === "ascendant");
const pupMine = stateActionFor("mining", profileFor(0));
const godMine = stateActionFor("mining", profileFor(7));
check("pup vs ascended mining differ", pupMine !== godMine);
check("pup mining is clumsy + oversized tool", /oversized tool/.test(pupMine) && /clumsy/i.test(pupMine));
check("ascended mining is minimal godlike gesture", /godlike gestures/.test(godMine));
const pupWin = stateActionFor("win", profileFor(0));
const godWin = stateActionFor("win", profileFor(7));
check("pup over-celebrates; ascended barely acknowledges",
  /OVER-celebration/.test(pupWin) && /barely acknowledges victory/.test(godWin));
const pupLose = stateActionFor("lose", profileFor(1));
const eliteLose = stateActionFor("lose", profileFor(5));
check("loss scales puppy-despair → wounded-commander pride",
  /puppy despair/.test(pupLose) && /wounded-commander pride/.test(eliteLose));
check("stage performance covers all 4 bands × 3 states distinctly",
  new Set(
    (["pup", "soldier", "elite", "ascendant"] as const).flatMap((b) =>
      (["mining", "win", "lose"] as const).map((s) =>
        stagePerformance(b === "pup" ? 0 : b === "soldier" ? 2 : b === "elite" ? 4 : 7, s),
      ),
    ),
  ).size === 12);

// ─── B4 · named techniques ───────────────────────────────────────────────────
console.log("\nB4 · named techniques (country × lane)");
check("all 12 countries have wizard + muggle move tables",
  Object.keys(TECHNIQUES).length === 12 &&
  Object.values(TECHNIQUES).every((c) => c.wizard.length >= 2 && c.muggle.length >= 2));
check("technique names globally unique", new Set(allTechniqueNames()).size === allTechniqueNames().length);
const usaWiz = techniqueFor(0, true, 0);
const usaMug = techniqueFor(0, false, 0);
const chinaWiz = techniqueFor(1, true, 0);
check("wizard vs muggle lanes differ", usaWiz.name !== usaMug.name);
check("USA vs China techniques differ", usaWiz.name !== chinaWiz.name);
check("deterministic pick", techniqueFor(0, true, 3).name === techniqueFor(0, true, 3).name);
const powerAction = transitionAction("power", profileFor(3, 0, true), undefined, { traitIndex: 0 });
check("power transition renders the technique's visual grammar", powerAction.includes(usaWiz.visualGrammar));
check("technique NAME never enters the image prompt", !powerAction.includes(usaWiz.name));
check("transitionTechnique exposes the picked move for results",
  transitionTechnique(profileFor(3, 0, true), 0).name === usaWiz.name);

// ─── C1 · moment derivation ──────────────────────────────────────────────────
console.log("\nC1 · moment grammar + derivation");
check("vocabulary covers the required moments",
  ([
    "first_win", "win_streak", "clutch_comeback", "near_miss", "humiliated_by_rival",
    "revenge_win", "mvp_coronation", "chapter_cliffhanger", "lootbox_near_miss", "lootbox_jackpot",
  ] as const).every((m) => ALL_MOMENT_TYPES.includes(m)));
check("derive: first win", deriveMoment({ won: true, totalWins: 1 }) === "first_win");
check("derive: streak (n>=3)", deriveMoment({ won: true, totalWins: 9, winStreak: 5 }) === "win_streak");
check("derive: streak of 2 is NOT a streak moment", deriveMoment({ won: true, totalWins: 9, winStreak: 2 }) === null);
check("derive: clutch comeback (rank delta)",
  deriveMoment({ won: true, totalWins: 4, rankBefore: 8, rankAfter: 3 }) === "clutch_comeback");
check("derive: revenge beats first-win precedence",
  deriveMoment({ won: true, totalWins: 1, rivalFactionId: 1, lastLossToFactionId: 1 }) === "revenge_win");
check("derive: humiliated by rival", deriveMoment({ won: false, winType: "none", rivalFactionId: 1 }) === "humiliated_by_rival");
check("derive: near miss (same country, wrong call)", deriveMoment({ won: false, winType: "same_faction" }) === "near_miss");
check("derive: cliffhanger", deriveMoment({ isFinalRound: true }) === "chapter_cliffhanger");
check("derive: lootbox jackpot (roll under threshold)",
  lootboxRollWon(900, 1000) && deriveMoment({ rollValue: 900, thresholdBps: 1000 }) === "lootbox_jackpot");
check("derive: lootbox near miss (just over threshold)",
  lootboxRollNearMiss(1100, 1000) && deriveMoment({ rollValue: 1100, thresholdBps: 1000 }) === "lootbox_near_miss");
check("derive: distant lootbox miss is no moment", deriveMoment({ rollValue: 9000, thresholdBps: 1000 }) === null);

// ─── (iii) first-win vs streak-win vs revenge-win, same beast ────────────────
console.log("\nC1 · directive + body-language distinctness (same beast)");
const pFirst = buildMomentDialoguePrompt(beast, "first_win", { won: true, totalWins: 1 });
const pStreak = buildMomentDialoguePrompt(beast, "win_streak", { won: true, winStreak: 5 });
const pRevenge = buildMomentDialoguePrompt(beast, "revenge_win", {
  won: true,
  rivalFactionId: 1,
  lastLossToFactionId: 1,
});
check("dialogue prompts pairwise distinct",
  pFirst !== pStreak && pStreak !== pRevenge && pFirst !== pRevenge);
const bFirst = momentGrammar("first_win").bodyLanguage;
const bStreak = momentGrammar("win_streak").bodyLanguage;
const bRevenge = momentGrammar("revenge_win").bodyLanguage;
check("body-language tokens pairwise distinct",
  bFirst !== bStreak && bStreak !== bRevenge && bFirst !== bRevenge);
check("body language is embedded in the dialogue prompt",
  pFirst.includes(bFirst) && pStreak.includes(bStreak) && pRevenge.includes(bRevenge));
check("streak count threads into the directive", pStreak.includes("5 wins IN A ROW"));
check("all 13 moment directives are pairwise distinct",
  new Set(ALL_MOMENT_TYPES.map((m) => momentGrammar(m).directive({ winStreak: 4, newStage: 3 }, "USA", "China"))).size ===
    ALL_MOMENT_TYPES.length);
check("all 13 body-language tokens are pairwise distinct",
  new Set(ALL_MOMENT_TYPES.map((m) => momentGrammar(m).bodyLanguage)).size === ALL_MOMENT_TYPES.length);

// ─── C3 · rivalry continuity ─────────────────────────────────────────────────
console.log("\nC3 · rivalry dialogue");
check("USA↔China is a bible rivalry edge", rivalEdgeFor(0, 1) !== null);
check("USA↔France is not", rivalEdgeFor(0, 9) === null);
check("rivalry block names the rival country", rivalryBlock(0, 1).includes("China"));
check("revenge prompt references the canon rivalry", pRevenge.includes("CANON RIVALRY"));
const pRevengePrev = buildMomentDialoguePrompt(
  beast, "revenge_win", { won: true, rivalFactionId: 1, lastLossToFactionId: 1 }, "You got lucky, Long Wei!");
check("previousLine threading survives", pRevengePrev.includes("You got lucky, Long Wei!"));
const mutPrompt = buildDialoguePrompt(beast, "power", { rivalFactionId: 1 });
check("mutation dialogue also picks up the rivalry", mutPrompt.includes("CANON RIVALRY"));

// ─── C2 · emotional arc gating ───────────────────────────────────────────────
console.log("\nC2 · emotional arc");
const arc = "starts dejected, spots the dBTC vein, ends determined";
check("arc suppressed for low-stage beasts", emotionalArcDirective(arc, 2) === "");
check("arc active for stage 5", emotionalArcDirective(arc, 5).includes(arc));
check("arc lands frame-by-frame", emotionalArcDirective(arc, 7).includes("final frame lands it"));

// ─── Phase E · base-type layer ───────────────────────────────────────────────
console.log("\nE · base types");
check("4 base types registered", BASE_TYPE_IDS.length === 4);
check("canine render block is empty (genesis prompts untouched)", baseTypeRenderBlock("canine", 0) === "");
check("canine motion directive is empty", baseTypeMotionDirective("canine") === "");
const traitsE = [2, 3, 4, 3, 2, 4, 1];
check(
  "canine mint prompt byte-identical with/without explicit baseType",
  buildHashBeastPrompt(0, 2, 1, traitsE, 1) === buildHashBeastPrompt(0, 2, 1, traitsE, 1, "canine"),
);
const brPrimate = buildHashBeastPrompt(10, 2, 1, traitsE, 0, "primate");
const jpPrimate = buildHashBeastPrompt(4, 2, 1, traitsE, 0, "primate");
check("primate prompt declares the base type", /NOT a dog/.test(brPrimate));
check(
  "Brazil primate != Japan primate (country skin modulates the base type)",
  baseTypeCountrySkin("primate", 10) !== baseTypeCountrySkin("primate", 4) && brPrimate !== jpPrimate,
);
check(
  "feline prompt carries cat-ninja movement grammar",
  /pounce/i.test(buildHashBeastPrompt(4, 2, 1, traitsE, 0, "feline")),
);
check(
  "amphibian prompt remaps fur traits to skin",
  /skin tone and pattern/i.test(buildHashBeastPrompt(10, 2, 1, traitsE, 1, "amphibian")),
);
check(
  "every base type has 12 country skins (or legacy canine grammar)",
  BASE_TYPE_IDS.every((id) => id === "canine" || Object.keys(BASE_TYPES[id].countrySkins).length === 12),
);
check(
  "starter breed packs: 4 breeds per non-canine base type",
  BASE_TYPE_IDS.every((id) => id === "canine" || BASE_TYPES[id].breeds?.length === 4),
);
check(
  "canine breed routing unchanged (USA breed 1 = Husky)",
  getBreedForBaseType("canine", 0, 1).name === "Husky",
);
check(
  "primate breed pack indexes by DNA breed bits",
  getBreedForBaseType("primate", 0, 3).name === "Gorilla",
);
check("normalizeBaseType defaults empty → canine", normalizeBaseType("") === "canine");
let threw = false;
try {
  normalizeBaseType("dragon");
} catch {
  threw = true;
}
check("normalizeBaseType throws on unknown base type", threw);
check("safeBaseType never throws (junk → canine)", safeBaseType("dragon") === "canine");
check(
  "identity gate full_body prompt is base-type aware",
  /reads as a cat/.test(comparisonPrompt("full_body", "feline")) &&
    /answer NO/.test(comparisonPrompt("dp", "primate")),
);
check("canine voice keys keep the legacy format", voiceKeyFor(0, 1, 2) === "0:1:0");
check("non-canine voice keys get their own keyspace", voiceKeyFor(0, 1, 2, "feline") === "feline:0:1:0");
check(
  "voice design prompt swaps the mascot phrase + timbre",
  buildVoiceDesignPrompt(0, "Tree Frog", 0, "amphibian").includes(baseTypeMascotPhrase("amphibian")) &&
    /croak|ribbit/i.test(buildVoiceDesignPrompt(0, "Tree Frog", 0, "amphibian")),
);
check(
  "announcer dialogue prompt follows the beast's base type",
  buildDialoguePrompt(
    { ...beast, baseType: "feline" },
    "power",
    {},
  ).includes("cat-ninja mascot"),
);
check(
  "no flag-print language in any base-type skin",
  BASE_TYPE_IDS.every((id) =>
    Object.values(BASE_TYPES[id].countrySkins).every((s) => !/flag[- ]print|flag fabric|flag cape/i.test(s)),
  ),
);

// ─── Phase F · rarity light language (bible module) ──────────────────────────
console.log("\nF · rarity light language");
check("5 canonical rarity tiers", RARITY_TIERS.length === 5);
check(
  "tier color language pairwise distinct",
  new Set(RARITY_TIERS.map((t) => t.colorLanguage)).size === 5,
);
check(
  "tier particle language pairwise distinct",
  new Set(RARITY_TIERS.map((t) => t.particleLanguage)).size === 5,
);
check(
  "tier crack-light + reveal-flare pairwise distinct",
  new Set(RARITY_TIERS.map((t) => `${t.crackLight}|${t.revealFlare}`)).size === 5,
);
check(
  "stage → tier mapping is monotonic across the 8-stage ladder",
  [0, 1, 2, 3, 4, 5, 6, 7].every(
    (s, i, arr) => i === 0 || rarityTierForStage(arr[i - 1]).rank <= rarityTierForStage(s).rank,
  ),
);
check("stage 7 is mythic; stage 0 is common",
  rarityTierForStage(7).id === "mythic" && rarityTierForStage(0).id === "common");
check("every tier maps to a fanfare cue that exists",
  RARITY_TIERS.every((t) => audioCue(fanfareCueIdFor(t)) !== null));

// ─── Phase F · audio identity spec ───────────────────────────────────────────
console.log("\nF · audio identity");
check("12 country leitmotifs", COUNTRY_LEITMOTIFS.length === 12);
check("leitmotif prompts pairwise distinct",
  new Set(COUNTRY_LEITMOTIFS.map((m) => m.prompt)).size === 12);
check("4 evolution stings (one per stage band)", EVOLUTION_STINGS.length === 4);
check("evolution sting escalates with the band (pup ≠ ascendant)",
  evolutionSting(0).id === "evolution_sting_pup" &&
  evolutionSting(7).id === "evolution_sting_ascendant" &&
  evolutionSting(0).prompt !== evolutionSting(7).prompt);
check("cue ids globally unique",
  new Set(ALL_AUDIO_CUE_IDS).size === ALL_AUDIO_CUE_IDS.length);
check("catalog covers themes + ritual sfx",
  ["chapter_settled_theme", "losing_streak_motif", "ritual_lootbox_anticipation",
    "ritual_lootbox_near_miss", "ritual_claim_anticipation"].every((id) => audioCue(id) !== null));
check("every cue falls back to an EXISTING FE sound id",
  AUDIO_IDENTITY_CUES.every((c) => (LEGACY_SOUND_IDS as readonly string[]).includes(c.fallbackSoundId)));
check("every cue fits stable-audio's 47s ceiling", AUDIO_IDENTITY_CUES.every((c) => c.seconds >= 1 && c.seconds <= 47));
check("every cue prompt enforces instrumental/no-lyrics",
  AUDIO_IDENTITY_CUES.every((c) => /no vocals, no lyrics/i.test(c.prompt)));
check("legacy ids pass through the playable resolver",
  legacyPlayableSoundId("jackpot") === "jackpot" && legacyPlayableSoundId("mutation") === "mutation");
check("cue ids resolve to their fallback via the existing mapping",
  legacyPlayableSoundId("leitmotif_usa") === "jackpot" &&
  legacyPlayableSoundId("ritual_lootbox_near_miss") === "mutation");
check("USA vs Brazil leitmotifs differ", countryLeitmotif(0).prompt !== countryLeitmotif(10).prompt);

// ─── Phase F · staged rituals (lootbox win / near-miss / evolution DISTINCT) ─
console.log("\nF · staged rituals");
const winRitual = buildLootboxRevealRitual({ rollValue: 900, thresholdBps: 1000, factionId: 0, revealStage: 7 });
const nearMissRitual = buildLootboxRevealRitual({ rollValue: 1100, thresholdBps: 1000, factionId: 0 });
const missRitual = buildLootboxRevealRitual({ rollValue: 9000, thresholdBps: 1000, factionId: 0 });
const evoRitual = buildEvolutionRitual({ factionId: 0, fromStage: 4, toStage: 5 });
const claimHit = buildClaimRollCeremony({ result: "visual", factionId: 0 });
const claimSettle = buildClaimRollCeremony({ result: "none", factionId: 0 });

check("outcome classifier mirrors the on-chain roll",
  lootboxRitualKind(900, 1000) === "lootbox_win" &&
  lootboxRitualKind(1100, 1000) === "lootbox_near_miss" &&
  lootboxRitualKind(9000, 1000) === "lootbox_miss");
check("win ritual stages all four acts in order",
  winRitual.acts.map((a) => a.act).join(",") === "anticipation_shake,crack,rarity_flare,reveal");
check("near-miss ritual stages shake → lock strain → dim resolve",
  nearMissRitual.acts.map((a) => a.act).join(",") === "anticipation_shake,lock_strain,dim_resolve");
check("evolution ritual stages charge → burst → reveal",
  evoRitual.acts.map((a) => a.act).join(",") === "charge,burst,reveal");
check("the three rituals are pairwise DISTINCT staged definitions",
  new Set([winRitual, nearMissRitual, evoRitual].map((r) => `${r.ritualId}|${r.acts.map((a) => a.act).join(",")}`)).size === 3);
check("light language differs across the three rituals",
  new Set([winRitual, nearMissRitual, evoRitual].map((r) => r.acts.map((a) => a.lightLanguage).join("|"))).size === 3);
check("sound cue sets differ across the three rituals",
  new Set([winRitual, nearMissRitual, evoRitual].map((r) => r.acts.map((a) => a.soundCueId).join("|"))).size === 3);
check("win ritual carries the bible's mythic light language",
  winRitual.rarity === "mythic" &&
  winRitual.acts.some((a) => a.lightLanguage.includes(rarityTier("mythic").colorLanguage)) &&
  winRitual.acts.some((a) => a.lightLanguage === rarityTier("mythic").crackLight));
check("epic vs common win rituals differ only by tier language",
  buildLootboxRevealRitual({ rollValue: 1, thresholdBps: 1000, rarity: "epic" }).acts[2].lightLanguage !==
  buildLootboxRevealRitual({ rollValue: 1, thresholdBps: 1000, rarity: "common" }).acts[2].lightLanguage);
check("near-miss dramatizes roll_value vs threshold_bps (margin on stage)",
  nearMissRitual.acts[1].staging.includes("1100") &&
  nearMissRitual.acts[1].staging.includes("1000") &&
  nearMissRitual.acts[1].staging.includes("just 100 over"));
check("near-miss carries the canonical line",
  nearMissRitual.acts[1].caption === "The lock almost turned.");
check("a distant miss gets the quiet two-beat (no lock-strain tease)",
  missRitual.acts.length === 2 && !missRitual.acts.some((a) => a.act === "lock_strain"));
check("every ritual act resolves to a real audio cue + legacy fallback",
  [winRitual, nearMissRitual, missRitual, evoRitual, claimHit, claimSettle].every((r) =>
    r.acts.every((a) =>
      (audioCue(a.soundCueId) !== null || (LEGACY_SOUND_IDS as readonly string[]).includes(a.soundCueId)) &&
      (LEGACY_SOUND_IDS as readonly string[]).includes(a.fallbackSoundId))));
check("win reveal lands on the country leitmotif",
  winRitual.acts[3].soundCueId === "leitmotif_usa");
check("evolution burst rides the stage-band sting",
  evoRitual.acts[1].soundCueId === evolutionSting(5).id);
check("claim-roll ceremony is a 2-act anticipation → resolve",
  claimHit.acts.map((a) => a.act).join(",") === "charge_roll,roll_hit" &&
  claimSettle.acts.map((a) => a.act).join(",") === "charge_roll,roll_settle");
check("claim-roll hit vs settle resolve differently",
  claimHit.acts[1].soundCueId !== claimSettle.acts[1].soundCueId &&
  claimHit.acts[1].lightLanguage !== claimSettle.acts[1].lightLanguage);
check("claim-roll evolution hit hands off to the evolution sting",
  buildClaimRollCeremony({ result: "evolution", factionId: 0, newStage: 7 }).acts[1].soundCueId ===
    "evolution_sting_ascendant");
check("ritual durations are FE-pacable (every act 0.5-3s, total under 8s)",
  [winRitual, nearMissRitual, missRitual, evoRitual, claimHit, claimSettle].every((r) =>
    r.acts.every((a) => a.durationMs >= 500 && a.durationMs <= 3000) && r.totalDurationMs <= 8000));

// ─── Banned-lexicon sweep over every static grammar string ───────────────────
console.log("\nLint · banned lexicon sweep");
const corpus: Array<[string, string]> = [
  ...PROGRESSION_STAGES.map((s): [string, string] => [`stage ${s.name}`, `${s.epithet} ${auraTokens(s.stage)}`]),
  ...STAGE_TRANSITIONS.map((t): [string, string] => [`transition ${t.name}`, `${t.name} ${t.silhouetteChange}`]),
  ...Object.entries(TECHNIQUES).flatMap(([code, lanes]): Array<[string, string]> =>
    [...lanes.wizard, ...lanes.muggle].map((t): [string, string] => [`${code} ${t.name}`, `${t.name} ${t.visualGrammar}`])),
  ...ALL_MOMENT_TYPES.map((m): [string, string] => [
    `moment ${m}`,
    `${momentGrammar(m).directive({ winStreak: 4, rankBefore: 8, rankAfter: 2, rollValue: 990, thresholdBps: 1000, newStage: 4 }, "USA", "China")} ${momentGrammar(m).bodyLanguage}`,
  ]),
  ["ceremony stage-2", evoTo2],
  ["ceremony stage-5", evoTo5],
  ["state pup mining", pupMine],
  ["state ascended win", godWin],
  // Phase F: rarity light language, audio cue prompts, and ritual staging
  // strings stay lexicon-clean too.
  ...RARITY_TIERS.map((t): [string, string] => [
    `rarity ${t.id}`,
    `${t.name} ${t.colorLanguage} ${t.particleLanguage} ${t.crackLight} ${t.revealFlare}`,
  ]),
  ...AUDIO_IDENTITY_CUES.map((c): [string, string] => [`audio ${c.id}`, `${c.title} ${c.prompt}`]),
  ...[winRitual, nearMissRitual, missRitual, evoRitual, claimHit, claimSettle].flatMap(
    (r): Array<[string, string]> =>
      r.acts.map((a): [string, string] => [
        `ritual ${r.ritualId} ${a.act}`,
        `${a.title} ${a.staging} ${a.lightLanguage} ${a.caption || ""}`,
      ]),
  ),
  // Phase E: every base-type grammar string stays lexicon-clean too.
  ...BASE_TYPE_IDS.flatMap((id): Array<[string, string]> => [
    [
      `basetype ${id} grammar`,
      `${BASE_TYPES[id].silhouetteLanguage} ${BASE_TYPES[id].movementGrammar} ${BASE_TYPES[id].voiceTimbreModifier}`,
    ],
    ...Object.entries(BASE_TYPES[id].countrySkins).map(
      ([fid, skin]): [string, string] => [`basetype ${id} skin ${fid}`, skin],
    ),
    ...(BASE_TYPES[id].breeds || []).map(
      (b): [string, string] => [`basetype ${id} breed ${b.name}`, `${b.description} ${b.bodyPrompt}`],
    ),
  ]),
];
let lexiconClean = true;
for (const [label, text] of corpus) {
  const smells = dialogueSmells(text);
  if (smells.length > 0) {
    lexiconClean = false;
    console.error(`    banned lexicon in ${label}: ${smells.join("; ")}`);
  }
}
check(`no banned lexicon across ${corpus.length} grammar strings`, lexiconClean);

// ─── Verdict ─────────────────────────────────────────────────────────────────
console.log(`\n${passes} passed, ${failures} failed`);
if (failures > 0) process.exit(1);
