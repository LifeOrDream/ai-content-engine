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
 *     dialogue.
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
import type { NftBeastInput } from "./types.js";
import {
  generateStrip,
  generateStateAnimations,
  assembleLoop,
  resolveBeastProfile,
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

/** The per-event transition "moment" action (wizard/muggle + country flavored). */
export function transitionAction(
  kind: MutationKind,
  p: BeastProfile,
  newStage?: number,
): string {
  if (kind === "visual") {
    return p.isWizard
      ? `a NEW TRAIT magically materializing on its body in a shimmer of arcane ${p.factionName} light, then settling into the fresh look`
      : `a NEW TRAIT emerging on its body — a quick transformation flash, then the new look settles in`;
  }
  if (kind === "power") {
    return p.isWizard
      ? `a POWER SURGE — arcane energy crackling and swirling around it, glowing brighter, a magical power-up flex`
      : `a POWER SURGE — muscles flexing, raw energy crackling around it, a hyped power-up`;
  }
  return `dramatically EVOLVING — a burst of light as its body transforms into a bigger, more powerful stage-${newStage ?? "next"} form`;
}

// ---------------------------------------------------------------------------
// Dialogue
// ---------------------------------------------------------------------------

export interface GameStateCtx {
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
  return [
    `You are the in-game announcer/voice of a ${nation} HashBeast (a stylized dog-warrior mascot) in a comedic country-vs-country crypto mining war.`,
    `Write ONE short spoken line (max 14 words) the beast shouts at this moment: it ${moment}.`,
    p.archetype || p.tone
      ? `Its personality: ${[p.archetype, p.tone, p.motivation].filter(Boolean).join(", ")}.`
      : "",
    state.length ? `Game state: ${state.join("; ")}.` : "",
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

/** Write + voice a gameplay dialogue line. Best-effort: line ships even if voice fails. */
export async function writeAndVoiceLine(
  beast: NftBeastInput,
  kind: MutationKind,
  gs: GameStateCtx = {},
  prevLine?: string,
  opts: { store?: ArtifactStore; voiceId?: string } = {},
): Promise<DialogueResult | null> {
  const store = opts.store || getDefaultArtifactStore();
  let line = "";
  try {
    const raw = await generateText(buildDialoguePrompt(beast, kind, gs, prevLine), {
      temperature: 0.85,
    });
    line = (raw || "").replace(/^["']|["']$/g, "").split("\n")[0].trim().slice(0, 140);
  } catch (e: any) {
    logger.warning(`screenwriter: line gen failed: ${e?.message || e}`);
  }
  if (!line) return null;

  const result: DialogueResult = { line, soundId: SOUND_BY_KIND[kind] };
  try {
    let voiceId = opts.voiceId;
    if (!voiceId) {
      const ensured = await ensureVoiceId(
        beast.factionId ?? 0,
        beast.breedValue ?? 0,
        beast.evolutionStage ?? 0,
        beast.breedName || "",
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
        const key = `${beast.storagePath || `misc/${beast.mint}`}/dialogue/${kind}-${Date.now()}.mp3`;
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
  artifacts: NftArtifact[];
}

/** Build a transition clip (frame-strip APNG, non-boomerang) for the moment. */
export async function buildTransition(
  beast: NftBeastInput,
  kind: MutationKind,
  profile: BeastProfile,
  newStage: number | undefined,
  store: ArtifactStore,
): Promise<NftArtifact | null> {
  const strip = await generateStrip(beast, transitionAction(kind, profile, newStage));
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

  // 2. Transition clip.
  try {
    const transition = await buildTransition(beast, input.kind, profile, input.newStage, store);
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
    { store, voiceId: input.voiceId },
  );
  if (dlg) {
    result.dialogue = dlg;
    if (dlg.audio) artifacts.push(dlg.audio);
  }

  // 4. Power → tell the caller which slot the clip belongs to (1-5).
  if (input.kind === "power") {
    result.powerSlot = ((input.traitIndex ?? 0) % POWER_SLOTS) + 1;
  }

  logger.success(
    `🎮 mutation ${input.kind} content for ${String(beast.mint).slice(0, 8)}… clip=${result.transition ? "y" : "n"} line="${dlg?.line || ""}"`,
  );
  return result;
}
