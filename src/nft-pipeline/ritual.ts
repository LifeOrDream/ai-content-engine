/**
 * CASINO RITUAL CONTENT (Phase F1/F2) — staged reveal rituals, not toasts.
 *
 * Three rituals, each a DISTINCT staged definition (acts + rarity light
 * language + sound ids) the frontend choreographs instead of flashing a
 * notification:
 *
 *   1. LOOTBOX REVEAL (`ritual.lootbox_reveal`):
 *      win       → anticipation-shake → crack → rarity flare → beast reveal
 *      near-miss → anticipation-shake → LOCK STRAIN ("the lock almost
 *                  turned" — dramatizes roll_value vs threshold_bps) → dim
 *                  resolve. A distant miss skips the strain beat entirely.
 *   2. CLAIM-ROLL CEREMONY (`ritual.claim_roll`): the claim-time mutation
 *      roll staged like the gacha pull it mechanically is — a short
 *      anticipation sting, then a resolve beat (hit or settle).
 *   3. EVOLUTION RITUAL (pure helper; the evolution media itself already
 *      ships via nft.mutation_content): wraps the canonical 3-beat ceremony
 *      (CHARGE → BURST → REVEAL) as ritual acts with the stage-band sting.
 *
 * Rarity color/particle language comes from THE BIBLE (src/world/bible.ts
 * RARITY_TIERS) so the same tier reads identically on every surface. Sound
 * cue ids come from the audio identity spec (src/world/audioIdentity.ts);
 * every act also carries the legacy fallback id ("mutation" | "jackpot") so
 * the FE's existing soundId mapping keeps working until cues are generated.
 *
 * Ritual definitions are DETERMINISTIC and free — no model calls. The paid
 * steps are both OPT-IN: the voiced dialogue line (existing moment grammar +
 * voice path) and, for lootbox reveals, a CINEMATIC clip — the staged acts
 * rendered as ONE Seedance 2.0 multi-scene generation (acts as in-prompt
 * cuts, native synced SFX, the won beast's canonical art as the reveal end
 * frame). Identity on the cinematic is anchored by construction (the
 * canonical art IS the end frame); any other beast imagery still rides
 * nft.moment_content, which keeps the Gemini identity gate on every
 * free-standing character render. Backend dispatch is flag-gated and
 * budget-gated exactly like nft.mutation_content.
 */
import {
  countryBible,
  rarityTier,
  rarityTierForStage,
  type RarityTier,
  type RarityTierId,
} from "../world/bible.js";
import {
  auraTokens,
  countryAuraFlavor,
  evolutionCeremony,
  normalizeStage,
  stageTransition,
} from "../world/progression.js";
import {
  countryLeitmotif,
  evolutionSting,
  fanfareCueIdFor,
  legacyPlayableSoundId,
  type LegacySoundId,
} from "../world/audioIdentity.js";
import {
  buildMomentDialoguePrompt,
  lootboxRollNearMiss,
  lootboxRollWon,
  momentGrammar,
  type MomentContext,
  type MomentType,
} from "./moments.js";
import {
  writeAndVoiceFromPrompt,
  buildDialoguePrompt,
  type DialogueResult,
  type MutationKind,
} from "./mutationContent.js";
import type { BeastMemorySnapshot } from "./beastMemory.js";
import type { NftBeastInput } from "./types.js";
import {
  getDefaultArtifactStore,
  storeArtifact,
  type ArtifactStore,
  type NftArtifact,
} from "./artifacts.js";
import {
  generateImageEdit,
  generateSceneSequence,
  SEEDANCE_MAX_SECS,
  SEEDANCE_MIN_SECS,
  type SceneDirection,
} from "../utils/falMedia.js";
import { logger } from "../utils/logger.js";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type RitualKind =
  | "lootbox_win"
  | "lootbox_near_miss"
  | "lootbox_miss"
  | "claim_roll_hit"
  | "claim_roll_settle"
  | "evolution";

export interface RitualAct {
  /** Stable act id the FE keys animations off. */
  act: string;
  /** Staging label (UI copy allowed; NEVER rendered inside generated images). */
  title: string;
  /** Pacing hint for the FE choreography. */
  durationMs: number;
  /** What the screen does during this act (visual direction). */
  staging: string;
  /** Color/particle light language (rarity tiers come from the bible). */
  lightLanguage: string;
  /** Audio identity cue id for this act. */
  soundCueId: string;
  /** Existing FE SFX id to play until the cue asset ships. */
  fallbackSoundId: LegacySoundId;
  /** Optional one-line caption the FE may show under the stage. */
  caption?: string;
}

export interface StagedRitual {
  /** e.g. "lootbox_win@epic", "lootbox_near_miss", "evolution@stage5". */
  ritualId: string;
  kind: RitualKind;
  rarity?: RarityTierId;
  factionId?: number;
  acts: RitualAct[];
  totalDurationMs: number;
}

function finish(
  ritualId: string,
  kind: RitualKind,
  acts: RitualAct[],
  extra: { rarity?: RarityTierId; factionId?: number } = {},
): StagedRitual {
  return {
    ritualId,
    kind,
    rarity: extra.rarity,
    factionId: extra.factionId,
    acts,
    totalDurationMs: acts.reduce((s, a) => s + a.durationMs, 0),
  };
}

const cueWithFallback = (cueId: string) => ({
  soundCueId: cueId,
  fallbackSoundId: legacyPlayableSoundId(cueId),
});

// ─────────────────────────────────────────────────────────────────────────────
// F1 · Lootbox reveal ritual
// ─────────────────────────────────────────────────────────────────────────────

export interface LootboxRitualInput {
  /** On-chain roll (roll UNDER threshold wins) — drives win/near-miss/miss. */
  rollValue: number;
  thresholdBps: number;
  /** Country whose queue the box belongs to (colors the reveal). */
  factionId?: number;
  /** Explicit rarity tier; else derived from the revealed beast's stage. */
  rarity?: RarityTierId;
  /** Evolution stage of the revealed beast (rarity derivation, wins only). */
  revealStage?: number;
}

/** Outcome classifier shared with the moment grammar (same thresholds). */
export function lootboxRitualKind(rollValue: number, thresholdBps: number): RitualKind {
  if (lootboxRollWon(rollValue, thresholdBps)) return "lootbox_win";
  if (lootboxRollNearMiss(rollValue, thresholdBps)) return "lootbox_near_miss";
  return "lootbox_miss";
}

function anticipationAct(country: string, durationMs: number): RitualAct {
  return {
    act: "anticipation_shake",
    title: "The box stirs",
    durationMs,
    staging:
      `the sealed lootbox crate trembles on its dais, rattling harder beat by beat while the ${country} crowd noise drops to a held breath`,
    lightLanguage:
      "neutral worn-steel surfaces; the room dims so only the seams of the box hold light",
    ...cueWithFallback("ritual_lootbox_anticipation"),
  };
}

export function buildLootboxRevealRitual(input: LootboxRitualInput): StagedRitual {
  const kind = lootboxRitualKind(input.rollValue, input.thresholdBps);
  const factionId = input.factionId ?? 0;
  const country = countryBible(factionId)?.country || `Faction ${factionId}`;
  const glow = countryBible(factionId)?.colors.glow || "#FFD700";

  // ── WIN: shake → crack → rarity flare → reveal ──
  if (kind === "lootbox_win") {
    const tier: RarityTier = input.rarity
      ? rarityTier(input.rarity)
      : rarityTierForStage(input.revealStage);
    const acts: RitualAct[] = [
      anticipationAct(country, 1800),
      {
        act: "crack",
        title: "The seal gives",
        durationMs: 1200,
        staging:
          "fracture lines race across the crate; the lid lifts a finger-width and holds there, light pressing out through every crack",
        lightLanguage: tier.crackLight,
        ...cueWithFallback("ritual_lootbox_crack"),
      },
      {
        act: "rarity_flare",
        title: tier.name,
        durationMs: 1400,
        staging:
          `the tier announces itself before the contents do — the light floods the stage in the tier's color and the particles take over the frame`,
        lightLanguage: `${tier.colorLanguage}; ${tier.particleLanguage}`,
        ...cueWithFallback(fanfareCueIdFor(tier)),
        caption: `${tier.name} seam`,
      },
      {
        act: "reveal",
        title: "The beast steps out",
        durationMs: 2200,
        staging:
          `the flare resolves into the won HashBeast's silhouette, then the full character, landing its signature pose as the ${country} colors catch it`,
        lightLanguage: `${tier.revealFlare}; settling into the country glow ${glow}`,
        ...cueWithFallback(countryLeitmotif(factionId).id),
      },
    ];
    return finish(`lootbox_win@${tier.id}`, kind, acts, {
      rarity: tier.id,
      factionId,
    });
  }

  // ── NEAR-MISS: shake → lock strain ("the lock almost turned") → dim resolve ──
  if (kind === "lootbox_near_miss") {
    const over = input.rollValue - input.thresholdBps;
    const acts: RitualAct[] = [
      anticipationAct(country, 1800),
      {
        act: "lock_strain",
        title: "The lock almost turned",
        durationMs: 1600,
        staging:
          `the lock's tumblers catch one by one — the dial needed under ${input.thresholdBps} and the roll landed ${input.rollValue}, just ${over} over; the lid strains a hair open, light flickering at the seam, the whole room leaning with it`,
        lightLanguage:
          "a thin desperate flicker of gold at the seam, sputtering brighter then catching — never blooming",
        ...cueWithFallback("ritual_lootbox_near_miss"),
        caption: "The lock almost turned.",
      },
      {
        act: "dim_resolve",
        title: "It holds — this time",
        durationMs: 1400,
        staging:
          "the mechanism re-seats with a hollow clunk; the lid settles, the seam-light drains back into the box and the crate sits there, still full",
        lightLanguage:
          "light retreating into the seams until only a faint patient pulse remains inside the box",
        ...cueWithFallback("losing_streak_motif"),
        caption: `Rolled ${input.rollValue} — needed under ${input.thresholdBps}.`,
      },
    ];
    return finish("lootbox_near_miss", kind, acts, { factionId });
  }

  // ── DISTANT MISS: a shorter, dignified two-beat (no false hope theater). ──
  const acts: RitualAct[] = [
    { ...anticipationAct(country, 1200), durationMs: 1200 },
    {
      act: "dim_resolve",
      title: "Not this round",
      durationMs: 1200,
      staging:
        "the box shrugs once and goes quiet; the seam-light dims without drama and the dais lights come back up",
      lightLanguage: "seam glow fading evenly to rest — calm, no flicker, no tease",
      ...cueWithFallback("ritual_claim_resolve_miss"),
      caption: `Rolled ${input.rollValue} — needed under ${input.thresholdBps}.`,
    },
  ];
  return finish("lootbox_miss", kind, acts, { factionId });
}

// ─────────────────────────────────────────────────────────────────────────────
// F2 · Claim-roll ceremony — the claim-time mutation roll, staged.
// ─────────────────────────────────────────────────────────────────────────────

export interface ClaimRollInput {
  /** What the roll produced: a mutation kind, or "none" for a quiet settle. */
  result: MutationKind | "none";
  factionId?: number;
  /** Evolution rolls: the stage being evolved INTO (colors the resolve). */
  newStage?: number;
}

export function buildClaimRollCeremony(input: ClaimRollInput): StagedRitual {
  const factionId = input.factionId ?? 0;
  const country = countryBible(factionId)?.country || `Faction ${factionId}`;
  const flavor = countryAuraFlavor(factionId);
  const hit = input.result !== "none";

  const anticipation: RitualAct = {
    act: "charge_roll",
    title: "The genes roll",
    durationMs: 1100,
    staging:
      `the claim crest spins up like a dice cup — the beast's DNA helix ticks through trait glyphs while the ${country} aura gathers tight around it`,
    lightLanguage:
      "a tightening ring of country-colored light pulsing faster, particles drawn inward like a held breath",
    ...cueWithFallback("ritual_claim_anticipation"),
  };

  if (hit) {
    const resolveLight =
      input.result === "evolution"
        ? `${flavor}; ${auraTokens(input.newStage)}`
        : `${flavor}; a sharp bloom of fresh trait-light tracing the changed gene`;
    const resolve: RitualAct = {
      act: "roll_hit",
      title:
        input.result === "evolution"
          ? "Evolution unlocked"
          : input.result === "power"
            ? "Power surge"
            : "New trait",
      durationMs: 1900,
      staging:
        input.result === "evolution"
          ? "the helix locks on a burning glyph and the whole frame inhales — the ceremony hands off to the full evolution ritual"
          : "the helix slams onto the winning glyph; the changed gene ignites along the beast's body and the crowd ticker spikes",
      lightLanguage: resolveLight,
      ...cueWithFallback(
        input.result === "evolution"
          ? evolutionSting(input.newStage).id
          : "ritual_claim_resolve_win",
      ),
    };
    return finish(`claim_roll_hit@${input.result}`, "claim_roll_hit", [anticipation, resolve], {
      factionId,
    });
  }

  const settle: RitualAct = {
    act: "roll_settle",
    title: "The genes hold",
    durationMs: 1000,
    staging:
      "the helix slows and settles on no glyph; the aura relaxes back into its idle hum — charge kept, nothing lost",
    lightLanguage:
      "the gathered ring releasing outward as a soft neutral shimmer, idle aura resuming",
    ...cueWithFallback("ritual_claim_resolve_miss"),
  };
  return finish("claim_roll_settle", "claim_roll_settle", [anticipation, settle], {
    factionId,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Evolution ritual — the canonical 3-beat ceremony in ritual clothing.
// ─────────────────────────────────────────────────────────────────────────────

export interface EvolutionRitualInput {
  factionId: number;
  fromStage: number;
  toStage: number;
}

export function buildEvolutionRitual(input: EvolutionRitualInput): StagedRitual {
  const to = normalizeStage(input.toStage);
  const from = normalizeStage(input.fromStage);
  const beats = evolutionCeremony(input.factionId, from, to);
  const transition = stageTransition(to);
  const sting = evolutionSting(to);
  const flavor = countryAuraFlavor(input.factionId);
  const acts: RitualAct[] = [
    {
      act: "charge",
      title: transition.name,
      durationMs: 2000,
      staging: beats[0].action,
      lightLanguage: `${flavor}; ${auraTokens(from)} swelling past its limits`,
      ...cueWithFallback("ritual_claim_anticipation"),
    },
    {
      act: "burst",
      title: "Whiteout",
      durationMs: 1500,
      staging: beats[1].action,
      lightLanguage:
        "a blinding whiteout that keeps the silhouette readable inside the light",
      ...cueWithFallback(sting.id),
    },
    {
      act: "reveal",
      title: "The new form",
      durationMs: 2500,
      staging: beats[2].action,
      lightLanguage: `${auraTokens(to)}; settling into a steady hum`,
      ...cueWithFallback(countryLeitmotif(input.factionId).id),
    },
  ];
  return finish(`evolution@stage${to}`, "evolution", acts, {
    factionId: input.factionId,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Orchestration — the `ritual.lootbox_reveal` / `ritual.claim_roll` job kinds.
// Definitions are free; the voiced line is the only opt-in paid step.
// ─────────────────────────────────────────────────────────────────────────────

export interface RitualLootboxRevealInput extends LootboxRitualInput {
  /** Beast to voice the reaction line (optional — definition-only without it). */
  beast?: NftBeastInput;
  /** Opt-in: also write + voice the moment dialogue line (paid: LLM + TTS). */
  includeDialogue?: boolean;
  /**
   * Opt-in: render the staged acts as ONE Seedance 2.0 multi-scene clip — the
   * acts become in-prompt cuts in a single generation with native synced SFX;
   * on wins the revealed beast's canonical art is the literal end frame.
   * Paid: 1 video call (+1 keyframe image when `cinematicStartFrameUrl` is
   * omitted). Budget-gate dispatch backend-side like every other video.
   */
  includeCinematic?: boolean;
  /** Pre-staged start keyframe URL (the sealed crate on its dais). Generated from the beast's canonical art when omitted. */
  cinematicStartFrameUrl?: string;
  previousLine?: string;
  voiceId?: string;
  memory?: BeastMemorySnapshot;
}

export interface RitualClaimRollInput extends ClaimRollInput {
  beast?: NftBeastInput;
  includeDialogue?: boolean;
  previousLine?: string;
  voiceId?: string;
  memory?: BeastMemorySnapshot;
}

export interface RitualContentResult {
  ritual: StagedRitual;
  /** The moment grammar entry the dialogue used (when voiced). */
  moment?: MomentType;
  dialogue?: DialogueResult;
  /** The single-generation multi-scene clip (opt-in, lootbox reveals). */
  cinematic?: NftArtifact;
  artifacts: NftArtifact[];
}

// ── Cinematic (Seedance 2.0 multi-scene) tunables ──
const RITUAL_CINEMATIC_RESOLUTION = process.env.RITUAL_CINEMATIC_RESOLUTION || "720p";
const RITUAL_CINEMATIC_ASPECT = process.env.RITUAL_CINEMATIC_ASPECT || "9:16";

/**
 * Render a staged lootbox ritual as ONE Seedance multi-scene generation: each
 * act is a scene, cut in-prompt; act durations (ms) become the cut timing;
 * native audio carries the synced crack/flare/leitmotif impacts. On wins the
 * revealed beast's canonical full-body art rides `end_image_url`, so the
 * reveal lands EXACTLY on canon. Returns null when no start frame can be
 * staged (no `cinematicStartFrameUrl` and no beast art to ground one).
 */
async function buildLootboxCinematic(
  ritual: StagedRitual,
  input: RitualLootboxRevealInput,
  store: ArtifactStore,
): Promise<NftArtifact | null> {
  const isUrl = (u?: string) => Boolean(u && /^https?:\/\//i.test(u));
  const beastArt = input.beast?.assetUrls?.fullBody || input.beast?.assetUrls?.dp;

  // Start frame: caller-staged, else a one-image keyframe grounded on the
  // beast's canonical art (style anchor — the crate scene itself is text-free).
  let startUrl = input.cinematicStartFrameUrl;
  if (!isUrl(startUrl)) {
    if (!isUrl(beastArt)) return null;
    const anticipation = ritual.acts[0];
    const keyframe = await generateImageEdit(
      [
        `In the EXACT same pixel-art game style as the reference image: ${anticipation.staging}.`,
        `Light: ${anticipation.lightLanguage}.`,
        `The crate is sealed — the character from the reference is NOT visible anywhere.`,
        `This is a STILL image — a frozen instant; no motion blur.`,
        `ABSOLUTELY NO text, words, letters, logos, UI or symbols anywhere in the image.`,
      ].join(" "),
      beastArt!,
      { aspectRatio: RITUAL_CINEMATIC_ASPECT, resolution: "1K" },
    );
    startUrl = keyframe.url;
  }

  const scenes: SceneDirection[] = ritual.acts.map((act, i) => ({
    direction: `${act.staging}. Light: ${act.lightLanguage}`,
    durationHint: Math.max(1, act.durationMs / 1000),
    ...(i === 0 ? { refStartImage: startUrl } : {}),
    // The reveal beat resolves onto the won beast's canonical art.
    ...(i === ritual.acts.length - 1 && act.act === "reveal" && isUrl(beastArt)
      ? { refEndImage: beastArt }
      : {}),
  }));
  const totalSecs = Math.min(
    SEEDANCE_MAX_SECS,
    Math.max(SEEDANCE_MIN_SECS, Math.round(ritual.totalDurationMs / 1000)),
  );

  const result = await generateSceneSequence(scenes, {
    totalDuration: totalSecs,
    aspectRatio: RITUAL_CINEMATIC_ASPECT,
    resolution: RITUAL_CINEMATIC_RESOLUTION,
    // Rituals/ceremonies want the synced native SFX (free on Seedance 2.0).
    generateAudio: true,
    globalDirection:
      `A staged casino-grade reveal ritual in a pixel-art game world, one continuous stage, dramatic light. ` +
      `No text, captions, logos or UI anywhere. SOUND: the staged cues only — rattling crate, cracking seal, a rarity flare bloom — no speech, no music.`,
  });

  const basePath = input.beast?.storagePath || `misc/${input.beast?.mint || "lootbox"}`;
  return storeArtifact(store, {
    kind: "ritual_cinematic",
    key: `${basePath}/gameplay/ritual-${ritual.kind}-${Date.now()}.mp4`,
    buffer: result.master.buffer,
    contentType: "video/mp4",
    model: result.segments[0]?.model,
    requestId: result.segments[0]?.requestId,
  });
}

export async function generateLootboxRevealRitual(
  input: RitualLootboxRevealInput,
  opts: { store?: ArtifactStore } = {},
): Promise<RitualContentResult> {
  const ritual = buildLootboxRevealRitual(input);
  const result: RitualContentResult = { ritual, artifacts: [] };
  if (input.includeCinematic) {
    try {
      const cinematic = await buildLootboxCinematic(
        ritual,
        input,
        opts.store || getDefaultArtifactStore(),
      );
      if (cinematic) {
        result.cinematic = cinematic;
        result.artifacts.push(cinematic);
      }
    } catch (e: any) {
      logger.warning(`ritual: lootbox cinematic failed — definition still ships: ${e?.message || e}`);
    }
  }
  if (input.includeDialogue && input.beast && ritual.kind !== "lootbox_miss") {
    const moment: MomentType =
      ritual.kind === "lootbox_win" ? "lootbox_jackpot" : "lootbox_near_miss";
    const ctx: MomentContext = {
      rollValue: input.rollValue,
      thresholdBps: input.thresholdBps,
    };
    const dlg = await writeAndVoiceFromPrompt(
      input.beast,
      buildMomentDialoguePrompt(input.beast, moment, ctx, input.previousLine, input.memory),
      momentGrammar(moment).soundId,
      {
        store: opts.store || getDefaultArtifactStore(),
        voiceId: input.voiceId,
        artifactTag: `ritual-${ritual.kind}`,
      },
    );
    if (dlg) {
      result.moment = moment;
      result.dialogue = dlg;
      if (dlg.audio) result.artifacts.push(dlg.audio);
    }
  }
  return result;
}

export async function generateClaimRollCeremony(
  input: RitualClaimRollInput,
  opts: { store?: ArtifactStore } = {},
): Promise<RitualContentResult> {
  const ritual = buildClaimRollCeremony(input);
  const result: RitualContentResult = { ritual, artifacts: [] };
  if (input.includeDialogue && input.beast && input.result !== "none") {
    const dlg = await writeAndVoiceFromPrompt(
      input.beast,
      buildDialoguePrompt(input.beast, input.result, { newStage: input.newStage }, input.previousLine, input.memory),
      momentGrammar(
        input.result === "evolution" ? "evolved" : input.result === "power" ? "powered" : "mutated",
      ).soundId,
      {
        store: opts.store || getDefaultArtifactStore(),
        voiceId: input.voiceId,
        artifactTag: `ritual-claim-${input.result}`,
      },
    );
    if (dlg) {
      result.moment =
        input.result === "evolution" ? "evolved" : input.result === "power" ? "powered" : "mutated";
      result.dialogue = dlg;
      if (dlg.audio) result.artifacts.push(dlg.audio);
    }
  }
  return result;
}
