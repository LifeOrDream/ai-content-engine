/**
 * MOMENT GRAMMAR — the emotional-range layer (Phase C).
 *
 * Extends the dialogue/state moment types beyond mutated/powered/evolved with
 * the full outcome vocabulary of a season: first wins, streaks, comebacks,
 * near-misses, rival humiliations, revenge, coronations, cliffhangers and
 * lootbox drama. Everything here is PURE and deterministic (unit-testable,
 * no network): the orchestration that voices/renders moments lives in
 * momentContent.ts.
 *
 * Field provenance (verified against the game backend's
 * `user:round_claim_settled` + `lootbox:roll_won/_missed` payloads):
 *   - streak fields    → payload.streak { current, max, total_wins }
 *   - win classification → payload.won, payload.win_type
 *   - rival country    → payload.winning_faction_id vs the beast's faction
 *   - lootbox          → roll_value vs threshold_bps (roll UNDER threshold wins)
 *   - rank deltas      → cycle standings before/after (backend cycle memory)
 */

import { countryBible, type RivalryEdge } from "../world/bible.js";
import { baseTypeMascotPhrase, safeBaseType } from "../world/baseTypes.js";
import { performanceBand, normalizeStage } from "../world/progression.js";
import { beastMemoryPromptBlock, type BeastMemorySnapshot } from "./beastMemory.js";
import type { NftBeastInput } from "./types.js";
import type { BeastProfile } from "./stateAnimations.js";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** The full moment vocabulary. The first three map 1:1 onto mutation kinds. */
export type MomentType =
  | "mutated"
  | "powered"
  | "evolved"
  | "first_win"
  | "win_streak"
  | "clutch_comeback"
  | "near_miss"
  | "humiliated_by_rival"
  | "revenge_win"
  | "mvp_coronation"
  | "chapter_cliffhanger"
  | "lootbox_near_miss"
  | "lootbox_jackpot";

/**
 * Typed inputs for moment derivation + dialogue flavor. All fields optional —
 * the backend passes whatever its settle/lootbox payloads carry.
 */
export interface MomentContext {
  /** Round outcome. */
  won?: boolean;
  winType?: "exact" | "same_faction" | "none";
  /** Streak fields (user:round_claim_settled → streak.*). */
  winStreak?: number;
  maxWinStreak?: number;
  totalWins?: number;
  /** Faction rank this cycle (1 = leading) + rank deltas. */
  rank?: number;
  rankBefore?: number;
  rankAfter?: number;
  /** The opposing country in this moment (e.g. winning_faction_id on a loss). */
  rivalFactionId?: number;
  /** Country the owner last LOST to (backend cycle memory) — fuels revenge. */
  lastLossToFactionId?: number;
  /** Lootbox roll (roll UNDER threshold wins). */
  rollValue?: number;
  thresholdBps?: number;
  /** Cycle/chapter is ending with stakes unresolved. */
  isFinalRound?: boolean;
  /** This beast was crowned the cycle MVP. */
  mvp?: boolean;
  /** Carry-through flavor. */
  multiplier?: number;
  newStage?: number;
  traitIndex?: number;
}

export interface MomentGrammar {
  type: MomentType;
  /** Frontend SFX id (existing ids only — "mutation" | "jackpot"). */
  soundId: string;
  /** The dialogue DIRECTIVE — what the line must feel like at this moment. */
  directive: (ctx: MomentContext, nation: string, rivalNation?: string) => string;
  /** Body-language tokens for strips/keyframes at this moment. */
  bodyLanguage: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lootbox semantics (mirrors the on-chain roll: roll UNDER threshold wins)
// ─────────────────────────────────────────────────────────────────────────────

export function lootboxRollWon(rollValue: number, thresholdBps: number): boolean {
  return rollValue < thresholdBps;
}

/** A miss that landed within 10% (min 250bps) above the threshold. */
export function lootboxRollNearMiss(rollValue: number, thresholdBps: number): boolean {
  if (lootboxRollWon(rollValue, thresholdBps)) return false;
  const margin = Math.max(250, Math.round(thresholdBps * 0.1));
  return rollValue - thresholdBps <= margin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Derivation — deterministic precedence from raw context fields.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derive the most dramatic applicable moment from raw payload fields.
 * Precedence: lootbox outcomes > coronation > revenge > first win > streak >
 * comeback > rival humiliation > near miss > cliffhanger.
 */
export function deriveMoment(ctx: MomentContext): MomentType | null {
  const hasRoll = typeof ctx.rollValue === "number" && typeof ctx.thresholdBps === "number";
  if (hasRoll && lootboxRollWon(ctx.rollValue!, ctx.thresholdBps!)) return "lootbox_jackpot";
  if (hasRoll && lootboxRollNearMiss(ctx.rollValue!, ctx.thresholdBps!)) return "lootbox_near_miss";
  if (ctx.mvp === true) return "mvp_coronation";
  if (
    ctx.won === true &&
    typeof ctx.rivalFactionId === "number" &&
    ctx.rivalFactionId === ctx.lastLossToFactionId
  ) {
    return "revenge_win";
  }
  if (ctx.won === true && ctx.totalWins === 1) return "first_win";
  if (ctx.won === true && (ctx.winStreak ?? 0) >= 3) return "win_streak";
  if (
    ctx.won === true &&
    typeof ctx.rankBefore === "number" &&
    typeof ctx.rankAfter === "number" &&
    ctx.rankBefore - ctx.rankAfter >= 3
  ) {
    return "clutch_comeback";
  }
  if (ctx.won === false && typeof ctx.rivalFactionId === "number" && ctx.winType === "none") {
    return "humiliated_by_rival";
  }
  if (ctx.won === false && ctx.winType === "same_faction") return "near_miss";
  if (ctx.isFinalRound === true) return "chapter_cliffhanger";
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// The grammar table — every moment gets a DISTINCT directive + body language.
// ─────────────────────────────────────────────────────────────────────────────

const GRAMMAR: Record<MomentType, MomentGrammar> = {
  mutated: {
    type: "mutated",
    soundId: "mutation",
    directive: (_ctx, nation) =>
      `it just MUTATED a new trait mid-battle for ${nation} — startled delight, showing off the fresh look`,
    bodyLanguage:
      "double-take at its own body, then a proud spin to show the new trait off",
  },
  powered: {
    type: "powered",
    soundId: "mutation",
    directive: (_ctx, nation) =>
      `it just POWERED UP (a stat surged) for ${nation} — surging confidence, feeling the new strength crackle`,
    bodyLanguage:
      "flexing stance as energy crackles, testing the new power with a sharp jab",
  },
  evolved: {
    type: "evolved",
    soundId: "jackpot",
    directive: (ctx, nation) =>
      `it just EVOLVED to a more powerful form (stage ${ctx.newStage ?? "?"}) for ${nation} — reborn gravitas, a new chapter declared`,
    bodyLanguage:
      "rises taller than before, surveys its own new silhouette, plants a claim-the-ground stance",
  },
  first_win: {
    type: "first_win",
    soundId: "jackpot",
    directive: (_ctx, nation) =>
      `its FIRST EVER win for ${nation} — disbelief flipping into pure rookie joy, almost asking if this is real, then claiming it loudly`,
    bodyLanguage:
      "wide-eyed double-take, then explosive rookie celebration — tripping over its own paws, tail helicoptering",
  },
  win_streak: {
    type: "win_streak",
    soundId: "jackpot",
    directive: (ctx, nation) =>
      `${ctx.winStreak ?? 3} wins IN A ROW for ${nation} — swaggering heat-check momentum, daring anyone to even try`,
    bodyLanguage:
      "cocky strut, slow shoulder roll, counting wins on its claws with a daring grin",
  },
  clutch_comeback: {
    type: "clutch_comeback",
    soundId: "jackpot",
    directive: (ctx, nation) =>
      `${nation} was written off at rank #${ctx.rankBefore ?? "?"} and clawed back to #${ctx.rankAfter ?? "?"} — vindicated underdog roar, spite-fueled triumph`,
    bodyLanguage:
      "staggered breathing flips into a defiant chest-out roar, paw shaking with adrenaline as it points at the standings",
  },
  near_miss: {
    type: "near_miss",
    soundId: "mutation",
    directive: (_ctx, nation) =>
      `SO close — right country, wrong call for ${nation}; agonized almost, gallows humor through gritted teeth`,
    bodyLanguage:
      "freezes mid-celebration, deflates by degrees, drags a claw slowly down its face with a hollow laugh",
  },
  humiliated_by_rival: {
    type: "humiliated_by_rival",
    soundId: "mutation",
    directive: (_ctx, nation, rivalNation) =>
      `${nation} just got beaten by ${rivalNation || "its blood rival"} — stung pride, public embarrassment, a vow muttered through a forced smile`,
    bodyLanguage:
      "flinches as if slapped, ears pinned, slow-burn glare toward the rival's corner, grip whitening on its gear",
  },
  revenge_win: {
    type: "revenge_win",
    soundId: "jackpot",
    directive: (_ctx, nation, rivalNation) =>
      `payback — ${nation} finally beat ${rivalNation || "the rival that humiliated it"}; savor it cold, name the debt repaid`,
    bodyLanguage:
      "slow deliberate walk, a savoring pause, a receipt-tap gesture, then a bow aimed at the rival's corner that is not respectful",
  },
  mvp_coronation: {
    type: "mvp_coronation",
    soundId: "jackpot",
    directive: (_ctx, nation) =>
      `crowned this cycle's MVP for ${nation} — coronation gravity with barely-contained glee, address the nation like a throne speech`,
    bodyLanguage:
      "regal stillness, chin lifted, accepting an invisible crown — one crack of giddy disbelief breaking the royal mask",
  },
  chapter_cliffhanger: {
    type: "chapter_cliffhanger",
    soundId: "mutation",
    directive: (_ctx, nation) =>
      `the chapter ends unresolved for ${nation} — ominous tease, a promise of what comes next, speak to the future not the room`,
    bodyLanguage:
      "turns half-away from camera, a look back over the shoulder, aura flickering, frozen on an unfinished gesture",
  },
  lootbox_near_miss: {
    type: "lootbox_near_miss",
    soundId: "mutation",
    directive: (ctx, nation) =>
      `the lootbox dice rolled ${ctx.rollValue ?? "?"} needing under ${ctx.thresholdBps ?? "?"} — missed by a hair for ${nation}; cosmic-injustice comedy, bargaining with the dice`,
    bodyLanguage:
      "leans its whole body as if steering the roll, freezes, collapses backward in operatic despair — one paw still reaching toward the dice",
  },
  lootbox_jackpot: {
    type: "lootbox_jackpot",
    soundId: "jackpot",
    directive: (ctx, nation) =>
      `the lootbox roll HIT (${ctx.rollValue ?? "?"} under ${ctx.thresholdBps ?? "?"}) for ${nation} — jackpot disbelief into greedy ecstatic celebration, thank the dice gods, taunt the unlucky`,
    bodyLanguage:
      "vibrating anticipation crouch, then a rocket-launch leap and a raining-coins grab dance, kissing the dice",
  },
};

export function momentGrammar(type: MomentType): MomentGrammar {
  return GRAMMAR[type];
}

export const ALL_MOMENT_TYPES = Object.keys(GRAMMAR) as MomentType[];

// ─────────────────────────────────────────────────────────────────────────────
// C3 · Rivalry continuity — when the moment involves the bible rivalry map's
// rival, the dialogue references the rivalry (and threads previousLine).
// ─────────────────────────────────────────────────────────────────────────────

/** The bible rivalry edge between a beast's country and another faction, if any. */
export function rivalEdgeFor(
  factionId: number,
  rivalFactionId: number | undefined | null,
): RivalryEdge | null {
  if (typeof rivalFactionId !== "number") return null;
  const mine = countryBible(factionId);
  const theirs = countryBible(rivalFactionId);
  if (!mine || !theirs || mine.factionId === theirs.factionId) return null;
  return mine.rivals.find((r) => r.rival === theirs.code) || null;
}

/** Prompt block injecting canon rivalry context, or "" when not a bible rival. */
export function rivalryBlock(
  factionId: number,
  rivalFactionId: number | undefined | null,
): string {
  const edge = rivalEdgeFor(factionId, rivalFactionId);
  if (!edge) return "";
  const mine = countryBible(factionId)!;
  const theirs = countryBible(rivalFactionId as number)!;
  return (
    `CANON RIVALRY in play: ${mine.country} vs ${theirs.country} (${edge.kind} rivalry — ${edge.why}) ` +
    `The line MUST reference this rivalry directly — name ${theirs.country} or its style, keep the history alive.`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// C2 · Emotional arc — optional arc directive for state strips, gated to
// higher-stage beasts (elite band and up: stage >= 4). Pups can't act.
// ─────────────────────────────────────────────────────────────────────────────

export const EMOTIONAL_ARC_MIN_STAGE = 4;

export function emotionalArcDirective(
  arc: string | undefined | null,
  stage: number | undefined | null,
): string {
  const text = String(arc || "").trim();
  if (!text) return "";
  if (normalizeStage(stage) < EMOTIONAL_ARC_MIN_STAGE) return "";
  const band = performanceBand(stage);
  return (
    `EMOTIONAL ARC across the frames: ${text}. Frame 1 starts the arc, the middle frames turn it, ` +
    `the final frame lands it — the emotional change must be readable in posture and face alone, ` +
    `with the restraint of a ${band}-tier performer.`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dialogue prompt builder — one moment, one distinct directive.
// ─────────────────────────────────────────────────────────────────────────────

function nationOf(beast: NftBeastInput): string {
  return countryBible(beast.factionId ?? 0)?.country || `Faction ${beast.factionId ?? 0}`;
}

export function buildMomentDialoguePrompt(
  beast: NftBeastInput,
  type: MomentType,
  ctx: MomentContext = {},
  prevLine?: string,
  memory?: BeastMemorySnapshot,
): string {
  const g = momentGrammar(type);
  const nation = nationOf(beast);
  const rivalNation =
    typeof ctx.rivalFactionId === "number"
      ? countryBible(ctx.rivalFactionId)?.country
      : undefined;
  const p = beast.personality || {};
  const state: string[] = [];
  if (ctx.rank) state.push(`${nation} is currently rank #${ctx.rank} in the faction war`);
  if (ctx.winStreak && ctx.winStreak >= 2) state.push(`its owner is on a ${ctx.winStreak}-win streak`);
  if (typeof ctx.totalWins === "number") state.push(`career wins: ${ctx.totalWins}`);
  return [
    `You are the in-game announcer/voice of a ${nation} HashBeast (a stylized ${baseTypeMascotPhrase(safeBaseType(beast.baseType))}) in a comedic country-vs-country crypto mining war.`,
    `Write ONE short spoken line (max 14 words) the beast shouts at this moment: ${g.directive(ctx, nation, rivalNation)}.`,
    `Body language on screen at this moment: ${g.bodyLanguage}. The line must match that physicality.`,
    p.archetype || p.tone
      ? `Its personality: ${[p.archetype, p.tone, p.motivation].filter(Boolean).join(", ")}.`
      : "",
    state.length ? `Game state: ${state.join("; ")}.` : "",
    rivalryBlock(beast.factionId ?? 0, ctx.rivalFactionId),
    beastMemoryPromptBlock(memory),
    prevLine
      ? `Its PREVIOUS line this cycle was: "${prevLine}". Continue that thread / escalate it.`
      : "",
    `Make it punchy, trash-talky, patriotic, country-vs-country energy. May include ONE short native-language word. Output ONLY the line, no quotes, no narration.`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Strip/keyframe action for a moment (uses the moment's body language and the
 * beast's country flavor). Identity gating happens in generateStrip as usual.
 */
export function momentStripAction(type: MomentType, p: BeastProfile, ctx: MomentContext = {}): string {
  const g = momentGrammar(type);
  return `reacting to a big game moment — ${g.directive(ctx, p.factionName)} — performed as: ${g.bodyLanguage}`;
}
