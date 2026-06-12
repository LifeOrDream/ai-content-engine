/**
 * Mutation event content — the per-event "screenwriter + producer".
 *
 * For each gameplay mutation it produces a TRANSITION animation (chroma-strip
 * APNG, non-looping) + a voiced in-character dialogue line, building the
 * country-vs-country live-entertainment feel. Regeneration policy (ported
 * from production):
 *
 *   - visual (trait) → transition + dialogue; canonical-art regen is DEFERRED
 *     to cycle end (opt in with `refreshAssets: true` for immediate DP regen).
 *   - power          → transition + dialogue; the caller stores the clip in
 *     its power slot (1-5, derived from trait index, returned as `powerSlot`).
 *   - evolution      → IMMEDIATE full regen (base body + DP) FIRST so the
 *     transition + fresh state loops use the evolved look, then transition +
 *     dialogue. The evolution transition is the 3-beat CEREMONY
 *     (CHARGE → BURST → REVEAL, src/world/progression.ts) choreographed
 *     across the strip's keyframes — the whole strip passes the Gemini
 *     identity gate, so every beat is gated.
 *
 * Power transitions render the NAMED country × lane technique (B4) and the
 * result carries techniqueUsed { name, isDebut? } so debuts can be recorded.
 *
 * Stays in the backend: Redis per-cycle clip tracking, DDB persistence,
 * metadata JSON refresh, socket emission (`hashbeast:gameplay_animation`,
 * `hashbeast:update_ready`), and the economics gate that decides whether this
 * job is dispatched at all.
 */
import { generateText } from "../service/llm.js";
import { fetchAsBuffer } from "../utils/falMedia.js";
import { logger } from "../utils/logger.js";
import { countryBible } from "../world/bible.js";
import { baseTypeMascotPhrase, safeBaseType } from "../world/baseTypes.js";
import {
  evolutionCeremony,
  normalizeStage,
  techniqueFor,
  type NamedTechnique,
} from "../world/progression.js";
import { rivalryBlock, type MomentContext } from "./moments.js";
import { beastMemoryPromptBlock, type BeastMemorySnapshot } from "./beastMemory.js";
import type { NftBeastInput } from "./types.js";
import {
  generateStrip,
  generateStateAnimations,
  assembleLoop,
  resolveBeastProfile,
  FRAME_COUNT,
  type BeastProfile,
} from "./stateAnimations.js";
import { refreshVisualDp, refreshEvolutionAssets, type RefreshedAssets } from "./assetRefresh.js";
import { ensureVoiceId, synthesizeDialogue } from "./voice.js";
import {
  getDefaultArtifactStore,
  storeArtifact,
  type ArtifactStore,
  type NftArtifact,
} from "./artifacts.js";

export type MutationKind = "visual" | "power" | "evolution";
const POWER_SLOTS = 5;

// Map a gameplay moment to the frontend's existing SFX id.
const SOUND_BY_KIND: Record<MutationKind, string> = {
  visual: "mutation",
  power: "mutation",
  evolution: "jackpot", // big moment
};

/**
 * The evolution CEREMONY action (B2): the single-sentence evolution prompt is
 * replaced by a 3-beat CHARGE → BURST → REVEAL choreography (anticipation /
 * whiteout-morph / signature-pose + aura-settle) from the progression grammar,
 * mapped across the strip's keyframes. The whole choreographed strip passes
 * the Gemini identity gate, so every beat is identity-gated; the BURST beat
 * explicitly keeps the silhouette readable inside the light so the gate holds.
 */
export function evolutionCeremonyAction(
  p: BeastProfile,
  newStage: number | undefined,
  fromStage?: number,
): string {
  const to = normalizeStage(newStage ?? p.evolutionStage + 1);
  const from = normalizeStage(
    typeof fromStage === "number" ? fromStage : Math.min(p.evolutionStage, Math.max(0, to - 1)),
  );
  const beats = evolutionCeremony(p.factionId, from, to);

  // Map the 3 beats onto the strip's frames: ~40% charge, middle burst, ~40% reveal.
  const n = FRAME_COUNT;
  const chargeFrames = Math.max(1, Math.round(n * 0.4));
  const revealFrames = Math.max(1, Math.round(n * 0.4));
  const burstFrames = Math.max(1, n - chargeFrames - revealFrames);
  const range = (start: number, count: number) =>
    count === 1 ? `frame ${start}` : `frames ${start}-${start + count - 1}`;
  const burstStart = chargeFrames + 1;
  const revealStart = burstStart + burstFrames;

  return (
    `dramatically EVOLVING in a 3-beat ceremony choreographed across the ${n} frames — ` +
    `${range(1, chargeFrames)}: ${beats[0].action}; ` +
    `${range(burstStart, burstFrames)}: ${beats[1].action}; ` +
    `${range(revealStart, revealFrames)}: ${beats[2].action}`
  );
}

/** The per-event transition "moment" action (wizard/muggle + country flavored). */
export function transitionAction(
  kind: MutationKind,
  p: BeastProfile,
  newStage?: number,
  extra: { fromStage?: number; traitIndex?: number } = {},
): string {
  if (kind === "visual") {
    return p.isWizard
      ? `a NEW TRAIT magically materializing on its body in a shimmer of arcane ${p.factionName} light, then settling into the fresh look`
      : `a NEW TRAIT emerging on its body — a quick transformation flash, then the new look settles in`;
  }
  if (kind === "power") {
    // B4: power transitions render the NAMED country × lane technique's visual
    // grammar (the name itself never enters the image prompt — text-free rule).
    const technique = transitionTechnique(p, extra.traitIndex);
    return `a POWER SURGE — unleashing its signature ${p.factionName} move: ${technique.visualGrammar}`;
  }
  return evolutionCeremonyAction(p, newStage, extra.fromStage);
}

/** The named technique a power transition renders (deterministic pick). */
export function transitionTechnique(p: BeastProfile, traitIndex?: number): NamedTechnique {
  return techniqueFor(p.factionId, p.isWizard, traitIndex ?? 0);
}

// ---------------------------------------------------------------------------
// Dialogue
// ---------------------------------------------------------------------------

/**
 * Game-state flavor for dialogue. Extends the typed MomentContext (Phase C):
 * streak fields, rank deltas, roll_value vs threshold_bps, and the rival
 * country id all thread into the line when present.
 */
export interface GameStateCtx extends MomentContext {
  rank?: number; // faction rank this cycle (1 = leading)
  multiplier?: number; // beast mining multiplier
  winStreak?: number; // owner recent win streak
  newStage?: number; // evolution target stage
  traitIndex?: number;
}

function factionName(factionId: number): string {
  return countryBible(factionId)?.country || `Faction ${factionId}`;
}

export function buildDialoguePrompt(
  beast: NftBeastInput,
  kind: MutationKind,
  gs: GameStateCtx,
  prevLine?: string,
  memory?: BeastMemorySnapshot,
): string {
  const p = beast.personality || {};
  const nation = factionName(beast.factionId ?? 0);
  const moment =
    kind === "visual"
      ? "just MUTATED a new trait mid-battle"
      : kind === "power"
        ? "just POWERED UP (a stat surged)"
        : `just EVOLVED to a more powerful form (stage ${gs.newStage ?? "?"})`;
  const state: string[] = [];
  if (gs.rank) state.push(`${nation} is currently rank #${gs.rank} in the faction war`);
  if (gs.winStreak && gs.winStreak >= 2) state.push(`its owner is on a ${gs.winStreak}-win streak`);
  if (typeof gs.rankBefore === "number" && typeof gs.rankAfter === "number" && gs.rankBefore !== gs.rankAfter) {
    state.push(`${nation} just moved from rank #${gs.rankBefore} to #${gs.rankAfter}`);
  }
  return [
    `You are the in-game announcer/voice of a ${nation} HashBeast (a stylized ${baseTypeMascotPhrase(safeBaseType(beast.baseType))}) in a comedic country-vs-country crypto mining war.`,
    `Write ONE short spoken line (max 14 words) the beast shouts at this moment: it ${moment}.`,
    p.archetype || p.tone
      ? `Its personality: ${[p.archetype, p.tone, p.motivation].filter(Boolean).join(", ")}.`
      : "",
    state.length ? `Game state: ${state.join("; ")}.` : "",
    rivalryBlock(beast.factionId ?? 0, gs.rivalFactionId),
    beastMemoryPromptBlock(memory),
    prevLine ? `Its PREVIOUS line this cycle was: "${prevLine}". Continue that thread / escalate it.` : "",
    `Make it punchy, trash-talky, patriotic, country-vs-country energy. May include ONE short native-language word. Output ONLY the line, no quotes, no narration.`,
  ]
    .filter(Boolean)
    .join(" ");
}

export interface DialogueResult {
  line: string;
  soundId: string;
  /** Stored audio artifact when voicing succeeded. */
  audio?: NftArtifact;
  /** Newly designed voice profile (persist backend-side), when one was created. */
  voiceProfile?: import("./voice.js").VoiceProfile;
  voiceId?: string;
}

/**
 * Write + voice a dialogue line from a ready-built prompt. Shared by the
 * mutation flow and the moment-content flow (momentContent.ts).
 * Best-effort: line ships even if voice fails.
 */
export async function writeAndVoiceFromPrompt(
  beast: NftBeastInput,
  prompt: string,
  soundId: string,
  opts: { store?: ArtifactStore; voiceId?: string; artifactTag?: string } = {},
): Promise<DialogueResult | null> {
  const store = opts.store || getDefaultArtifactStore();
  let line = "";
  try {
    const raw = await generateText(prompt, { temperature: 0.85 });
    line = (raw || "").replace(/^["']|["']$/g, "").split("\n")[0].trim().slice(0, 140);
  } catch (e: any) {
    logger.warning(`screenwriter: line gen failed: ${e?.message || e}`);
  }
  if (!line) return null;

  const result: DialogueResult = { line, soundId };
  try {
    let voiceId = opts.voiceId;
    if (!voiceId) {
      const ensured = await ensureVoiceId(
        beast.factionId ?? 0,
        beast.breedValue ?? 0,
        beast.evolutionStage ?? 0,
        beast.breedName || "",
        safeBaseType(beast.baseType),
      );
      if (ensured) {
        voiceId = ensured.voiceId;
        if (ensured.newProfile) result.voiceProfile = ensured.newProfile;
      }
    }
    if (voiceId) {
      result.voiceId = voiceId;
      const falUrl = await synthesizeDialogue(voiceId, line, {});
      if (falUrl) {
        // Persist the fal audio through the artifact store so the caller has a
        // durable url (fal-hosted urls expire).
        const buf = await fetchAsBuffer(falUrl);
        const tag = opts.artifactTag || "line";
        const key = `${beast.storagePath || `misc/${beast.mint}`}/dialogue/${tag}-${Date.now()}.mp3`;
        result.audio = await storeArtifact(store, {
          kind: "dialogue_audio",
          key,
          buffer: buf,
          contentType: "audio/mpeg",
        });
      }
    }
  } catch (e: any) {
    logger.warning(`screenwriter: voice failed: ${e?.message || e}`);
  }
  return result;
}

/** Write + voice a gameplay dialogue line. Best-effort: line ships even if voice fails. */
export async function writeAndVoiceLine(
  beast: NftBeastInput,
  kind: MutationKind,
  gs: GameStateCtx = {},
  prevLine?: string,
  opts: { store?: ArtifactStore; voiceId?: string; memory?: BeastMemorySnapshot } = {},
): Promise<DialogueResult | null> {
  return writeAndVoiceFromPrompt(
    beast,
    buildDialoguePrompt(beast, kind, gs, prevLine, opts.memory),
    SOUND_BY_KIND[kind],
    { ...opts, artifactTag: kind },
  );
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export interface NftMutationContentInput {
  beast: NftBeastInput;
  kind: MutationKind;
  /** Mutated trait index (visual: 0-20; power: 0-4 slot source). */
  traitIndex?: number;
  /** New trait display name (visual refresh prompt flavor). */
  newTraitName?: string;
  /** Evolution target stage. */
  newStage?: number;
  /** Previous dialogue line this cycle (continuity); cycle memory is backend-owned. */
  previousLine?: string;
  /** Pre-resolved voice id (skip lazy voice design). */
  voiceId?: string;
  /** Game-state flavor for the dialogue line. */
  gameState?: GameStateCtx;
  /**
   * visual only: refresh the canonical DP immediately instead of deferring to
   * cycle end (production defers; default false).
   */
  refreshAssets?: boolean;
  /** evolution only: also regenerate the 3 state loops from the evolved look (default true). */
  regenerateStateLoops?: boolean;
  /**
   * power only: technique names this beast already performed (backend-owned
   * memory) — drives techniqueUsed.isDebut so Phase D can record debuts.
   */
  knownTechniques?: string[];
  /** evolution only: the stage being evolved FROM (defaults to newStage - 1 / DNA stage). */
  fromStage?: number;
  /**
   * Per-beast story-memory snapshot (Phase D1) — epithets, technique debuts,
   * rivalry ledger, recent lines. Backend-owned; threads continuity into the
   * dialogue line. See beastMemory.ts for the contract.
   */
  memory?: BeastMemorySnapshot;
}

export interface NftMutationContentResult {
  mint: string;
  kind: MutationKind;
  /** Transition clip APNG (non-looping strip assembly), when produced. */
  transition?: NftArtifact;
  dialogue?: DialogueResult;
  /** Evolution (or opted-in visual) canonical art refresh. */
  refreshedAssets?: { fullBody?: NftArtifact; dp?: NftArtifact };
  /** Fresh state loops (evolution flow), when regenerated. */
  stateLoops?: NftArtifact[];
  /** power: which slot (1-5) the caller should store the transition under. */
  powerSlot?: number;
  /**
   * power: the NAMED country × lane technique this clip rendered (B4).
   * isDebut is set only when the caller passed knownTechniques.
   */
  techniqueUsed?: { name: string; isDebut?: boolean };
  artifacts: NftArtifact[];
}

/** Build a transition clip (frame-strip APNG, non-boomerang) for the moment. */
export async function buildTransition(
  beast: NftBeastInput,
  kind: MutationKind,
  profile: BeastProfile,
  newStage: number | undefined,
  store: ArtifactStore,
  extra: { fromStage?: number; traitIndex?: number } = {},
): Promise<NftArtifact | null> {
  const strip = await generateStrip(beast, transitionAction(kind, profile, newStage, extra));
  if (!strip) return null;
  const apng = await assembleLoop(strip.buffer, false);
  return storeArtifact(store, {
    kind: "transition",
    key: `${beast.storagePath || `misc/${beast.mint}`}/gameplay/transition-${kind}-${Date.now()}.png`,
    buffer: apng,
    contentType: "image/png",
    model: strip.model,
    requestId: strip.requestId,
  });
}

/**
 * Produce the full mutation-event content bundle for one beast. Best-effort
 * sub-steps: a failed transition or silent voice never fails the job.
 */
export async function generateMutationContent(
  input: NftMutationContentInput,
  opts: { store?: ArtifactStore } = {},
): Promise<NftMutationContentResult> {
  const store = opts.store || getDefaultArtifactStore();
  const beast: NftBeastInput = { ...input.beast };
  const profile = resolveBeastProfile(beast);
  const artifacts: NftArtifact[] = [];
  const result: NftMutationContentResult = {
    mint: beast.mint,
    kind: input.kind,
    artifacts,
  };

  // 1. Evolution → full regen FIRST so the transition + new loops use the
  //    evolved look. Visual refresh only when explicitly requested.
  let refreshed: RefreshedAssets | null = null;
  try {
    if (input.kind === "evolution") {
      refreshed = await refreshEvolutionAssets(beast, { store });
    } else if (input.kind === "visual" && input.refreshAssets) {
      refreshed = await refreshVisualDp(beast, input.traitIndex ?? 0, input.newTraitName, {
        store,
      });
    }
  } catch (e: any) {
    logger.warning(`mutation: asset refresh failed: ${e?.message || e}`);
  }
  if (refreshed) {
    beast.assetUrls = { ...beast.assetUrls, ...refreshed.assetUrls };
    result.refreshedAssets = { fullBody: refreshed.fullBody, dp: refreshed.dp };
    if (refreshed.fullBody) artifacts.push(refreshed.fullBody);
    if (refreshed.dp) artifacts.push(refreshed.dp);
  }

  // 1b. Evolution → regenerate the 3 state loops from the fresh art.
  if (input.kind === "evolution" && input.regenerateStateLoops !== false) {
    try {
      const loops = await generateStateAnimations({ beast }, { store });
      result.stateLoops = loops.artifacts;
      artifacts.push(...loops.artifacts);
    } catch (e: any) {
      logger.warning(`mutation: state loop regen failed: ${e?.message || e}`);
    }
  }

  // 2. Transition clip (evolution = the 3-beat ceremony; power = the named
  //    country × lane technique's visual grammar).
  try {
    const transition = await buildTransition(beast, input.kind, profile, input.newStage, store, {
      fromStage: input.fromStage,
      traitIndex: input.traitIndex,
    });
    if (transition) {
      result.transition = transition;
      artifacts.push(transition);
    }
  } catch (e: any) {
    logger.warning(`mutation: transition failed: ${e?.message || e}`);
  }

  // 3. Voiced dialogue line (continuity with the previous line this cycle).
  const dlg = await writeAndVoiceLine(
    beast,
    input.kind,
    {
      ...(input.gameState || {}),
      multiplier: input.gameState?.multiplier ?? beast.multiplier,
      newStage: input.newStage,
      traitIndex: input.traitIndex,
    },
    input.previousLine,
    { store, voiceId: input.voiceId, memory: input.memory },
  );
  if (dlg) {
    result.dialogue = dlg;
    if (dlg.audio) artifacts.push(dlg.audio);
  }

  // 4. Power → tell the caller which slot the clip belongs to (1-5) + which
  //    NAMED technique was rendered (Phase D records debuts from this).
  if (input.kind === "power") {
    result.powerSlot = ((input.traitIndex ?? 0) % POWER_SLOTS) + 1;
    const technique = transitionTechnique(profile, input.traitIndex);
    result.techniqueUsed = {
      name: technique.name,
      isDebut: Array.isArray(input.knownTechniques)
        ? !input.knownTechniques.includes(technique.name)
        : undefined,
    };
  }

  logger.success(
    `🎮 mutation ${input.kind} content for ${String(beast.mint).slice(0, 8)}… clip=${result.transition ? "y" : "n"} line="${dlg?.line || ""}"`,
  );
  return result;
}
