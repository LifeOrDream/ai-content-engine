/**
 * HashBeast living-state animations — the chroma-strip method.
 *
 * Each loop is made by asking the image model for ONE wide image containing a
 * horizontal strip of N keyframes of the SAME character on a flat magenta
 * background, identity-gating it with Gemini (validateSameCharacter), then
 * deterministically slicing / chroma-keying / assembling it into a tight,
 * transparent, square, looping APNG via scripts/assemble_anim.py (PIL).
 *
 * Variety rules ported from production:
 * - mining/win/lose actions are flavored by COUNTRY (per-faction mining tool)
 *   and by WIZARD vs MUGGLE (wizards mine with magic, no pickaxe),
 * - a compact personality directive (archetype/tone/motivation/catchphrase +
 *   optional owner block) drives the body language so a cocky brawler's "win"
 *   reads differently from a stoic mage's "win",
 * - power animations are flavored by the mutated power-trait index.
 *
 * Phase B/C additions:
 * - EVOLUTION STAGE drives the performance (src/world/progression.ts): a Pup
 *   wrestles an oversized tool and over-celebrates; an Ascended barely moves
 *   and barely acknowledges victory; losses scale puppy-despair →
 *   wounded-commander pride.
 * - An optional EMOTIONAL ARC directive ("starts dejected, spots the ore vein,
 *   ends determined") threads through the strip — gated to higher-stage beasts
 *   (stage >= 4) via emotionalArcDirective.
 *
 * Stays in the backend: queue dispatch + budget gating, DDB persistence of
 * animation_urls, metadata JSON refresh, socket emission.
 */
import {
  generateImageEditFromBuffers,
  fetchAsBuffer,
  validateSameCharacter,
} from "../utils/falMedia.js";
import { stripToTransparentApng } from "../utils/animationAssembly.js";
import { logger } from "../utils/logger.js";
import { resolveHashBeastTraits } from "../prompts/index.js";
import { countryBible, MINING_TOOL_BY_CODE } from "../world/bible.js";
import {
  baseTypeMotionDirective,
  baseTypeRenderNoun,
  safeBaseType,
  type BaseTypeId,
} from "../world/baseTypes.js";
import {
  normalizeStage,
  stagePerformance,
  techniqueFor,
  type NamedTechnique,
} from "../world/progression.js";
import { emotionalArcDirective } from "./moments.js";
import { decodeDNA } from "./dna.js";
import type { NftBeastInput } from "./types.js";
import {
  getDefaultArtifactStore,
  storeArtifact,
  type ArtifactStore,
  type NftArtifact,
} from "./artifacts.js";

// ---------------------------------------------------------------------------
// Tunables (all env-overridable; defaults match production)
// ---------------------------------------------------------------------------

export const CHROMA = process.env.HASHBEAST_ANIM_CHROMA || "0xFF00FF"; // magenta — rare in dog art
export const FRAME_COUNT = Math.max(3, Number(process.env.HASHBEAST_ANIM_FRAMES || 5));
export const FRAME_MS = Math.max(80, Number(process.env.HASHBEAST_ANIM_FRAME_MS || 160));
export const TARGET = Math.max(256, Number(process.env.HASHBEAST_ANIM_TARGET || 512));

export type StateLoop = "mining" | "win" | "lose";
export const STATE_LOOPS: StateLoop[] = ["mining", "win", "lose"];

/** Generic (profile-free) state actions — fallback when no profile resolves. */
export const STATE_ACTION: Record<StateLoop, string> = {
  mining:
    "actively MINING — swinging a glowing pickaxe at a chunk of crypto ore / working a mining rig, focused effort, repeating work motion",
  win: "CELEBRATING A VICTORY — arms or paws thrown up triumphantly, a proud cheer, hyped winner energy",
  lose: "REELING FROM A LOSS — slumping, shoulders down, deflated and dejected, a sad defeated reaction",
};

/**
 * Per-faction muggle mining tool so it's not the same pickaxe everywhere.
 * Single-sourced from the world bible (re-exported for backward compat).
 */
export const MINING_TOOL: Record<string, string> = MINING_TOOL_BY_CODE;

// Power-move flavor by mutated trait index (Attack, Defense, Speed, Magic, Luck …).
// Generic fallback only — power clips now prefer the NAMED country × lane
// technique table in src/world/progression.ts (see powerMoveFor).
const POWER_MOVES = [
  "unleashing a devastating melee power strike",
  "raising a burst of defensive energy shielding",
  "blitzing forward in a blinding speed dash",
  "casting a surge of arcane spell energy",
  "landing a glowing critical lucky-hit",
];

export function powerMove(traitIndex?: number): string {
  const i =
    (((traitIndex ?? 0) % POWER_MOVES.length) + POWER_MOVES.length) % POWER_MOVES.length;
  return POWER_MOVES[i];
}

/**
 * Named-technique power action (B4): the clip renders the country × lane
 * signature move's VISUAL GRAMMAR. The technique NAME never enters the image
 * prompt (no-readable-text rule) — it travels in job results as techniqueUsed.
 */
export function powerMoveFor(
  p: BeastProfile,
  traitIndex?: number,
): { action: string; technique: NamedTechnique } {
  const technique = techniqueFor(p.factionId, p.isWizard, traitIndex ?? 0);
  return {
    technique,
    action: `unleashing its signature ${p.factionName} power move — ${technique.visualGrammar}`,
  };
}

// ---------------------------------------------------------------------------
// Beast profile (country + wizard/muggle) resolution
// ---------------------------------------------------------------------------

export interface BeastProfile {
  isWizard: boolean;
  occupation: string;
  factionId: number;
  factionName: string;
  factionCode: string;
  /** Evolution stage 0-7 (DNA first, snapshot fallback) — drives performance. */
  evolutionStage: number;
  /** Body-plan layer (canine genesis default; snapshot-driven, best-effort). */
  baseType: BaseTypeId;
}

/** Resolve country + wizard/muggle + stage flavor from DNA (best-effort). */
export function resolveBeastProfile(beast: NftBeastInput): BeastProfile {
  const fid = beast.factionId ?? 0;
  const country = countryBible(fid);
  const baseType = safeBaseType(beast.baseType);
  let isWizard = String(beast.storagePath || "").includes("/wand"); // heuristic fallback
  let occupation = "";
  let evolutionStage = normalizeStage(beast.evolutionStage ?? 0);
  try {
    if (beast.dna) {
      const d = decodeDNA(beast.dna);
      const r = resolveHashBeastTraits(
        d.faction,
        d.evolution,
        d.type,
        d.appearance.map((g) => g[0]),
        d.breed,
      );
      isWizard = r.type.isWizard;
      occupation = r.type.occupation;
      evolutionStage = normalizeStage(d.evolution);
    }
  } catch {
    /* keep heuristic */
  }
  return {
    isWizard,
    occupation,
    factionId: fid,
    factionName: country?.country || `Faction ${fid}`,
    factionCode: country?.code || "usa",
    evolutionStage,
    baseType,
  };
}

/**
 * Country + muggle/wizard + STAGE flavored action for a STATE loop. The stage
 * band performance (progression.ts) makes a Pup's win read as over-celebration
 * zoomies while an Ascended's win is a slow blink and a single aura flare.
 */
export function stateActionFor(state: StateLoop, p: BeastProfile): string {
  const performance = stagePerformance(p.evolutionStage, state);
  if (state === "mining") {
    const base = p.isWizard
      ? `magically MINING glowing crypto-ore — channeling crackling arcane spell energy from its paws to crack the ore open, ${p.factionName} sorcery style, NO pickaxe`
      : `MINING glowing crypto-ore with ${MINING_TOOL[p.factionCode] || "a sturdy pickaxe"} — swinging it at the ore with focused ${p.factionName} grit`;
    return `${base}. Stage performance: ${performance}`;
  }
  if (state === "win") {
    return `CELEBRATING A VICTORY — proud ${p.factionName} triumphant cheer. Stage performance: ${performance}`;
  }
  return `REELING FROM A LOSS — the ${p.factionName} sting of defeat. Stage performance: ${performance}`;
}

// ---------------------------------------------------------------------------
// Prompt building
// ---------------------------------------------------------------------------

/**
 * A compact personality directive so each character's motion reads as ITS OWN —
 * archetype/tone/motivation/catchphrase drive the body language + expression,
 * while the attached reference images lock the visual identity.
 */
export function personalityDirective(beast: NftBeastInput): string {
  const p = beast.personality || {};
  const bits: string[] = [];
  if (p.archetype) bits.push(`archetype: ${p.archetype}`);
  if (p.tone) bits.push(`tone/attitude: ${p.tone}`);
  if (p.motivation) bits.push(`driven by: ${p.motivation}`);
  if (p.catchphrase) bits.push(`vibe of its catchphrase "${String(p.catchphrase).slice(0, 60)}"`);
  if (beast.ownerProfileBlock) bits.push(beast.ownerProfileBlock);
  if (bits.length === 0 && beast.bio) {
    return `Character notes: ${String(beast.bio).slice(0, 220)}. Let the body language, posture, gestures and facial expression reflect this character's personality so the performance feels unique to it.`;
  }
  if (bits.length === 0) return "";
  return `This character's personality — ${bits.join("; ")}. Make the body language, posture, gestures, energy and facial expression strongly express THIS personality so the performance feels unique to this character, not generic.`;
}

export function buildStripPrompt(action: string, persona: string, extraDirective = ""): string {
  return [
    `Render a single horizontal STRIP of exactly ${FRAME_COUNT} animation keyframes of THIS SAME character, ${action}.`,
    persona,
    extraDirective,
    `The ${FRAME_COUNT} frames read left-to-right as one smooth animation loop; the pose progresses a little each frame. In EVERY frame the character is the SAME size and LARGE — it fills most of the frame's height, centered, with only a small margin. Frames evenly spaced, equal-width cells, full body never cropped.`,
    `Keep the character's identity, face, colors, markings, gear and pixel-art style IDENTICAL to the attached reference(s). Exactly ONE character per frame — never duplicate, overlap or ghost it.`,
    `ABSOLUTELY NO text, words, letters, labels, captions, logos, brand names, network names, signs, banners, flags-on-poles, UI, frame numbers, borders, dividers, hashtags or symbols anywhere in the image.`,
    `Background is FLAT SOLID pure magenta (hex #FF00FF) filling ALL empty space — no scenery, no shadows, no ground, no gradients. The magenta must be perfectly uniform so it keys out cleanly.`,
  ]
    .filter(Boolean)
    .join(" ");
}

// ---------------------------------------------------------------------------
// Strip generation (identity-gated)
// ---------------------------------------------------------------------------

/**
 * Generate + identity-gate a motion strip grounded on the beast's canonical
 * assets. Returns null when references are missing or both attempts fail the
 * identity gate.
 */
export async function generateStrip(
  beast: NftBeastInput,
  action: string,
  extraDirective = "",
): Promise<{ buffer: Buffer; url: string; model?: string; requestId?: string } | null> {
  const fullBody = beast.assetUrls?.fullBody || beast.assetUrls?.dp;
  const dp = beast.assetUrls?.dp || fullBody;
  if (!fullBody || !dp) return null;
  const refs: Array<{ buffer: Buffer; mime?: string }> = [];
  try {
    refs.push({ buffer: await fetchAsBuffer(fullBody), mime: "image/png" });
    if (dp !== fullBody) refs.push({ buffer: await fetchAsBuffer(dp), mime: "image/png" });
  } catch {
    return null;
  }

  // Base-type aware: non-canine beasts inject their movement grammar (canine
  // returns "" — legacy strip prompts unchanged) and the identity gate is told
  // what kind of creature it is looking at.
  const beastBaseType = safeBaseType(beast.baseType);
  const motionDirective = baseTypeMotionDirective(beastBaseType);
  const prompt = buildStripPrompt(
    action,
    personalityDirective(beast),
    [motionDirective, extraDirective].filter(Boolean).join(" "),
  );
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const strip = await generateImageEditFromBuffers(prompt, refs, {
        aspectRatio: "16:9",
        resolution: "1K",
      });
      const check = await validateSameCharacter(dp, strip.url, {
        characterNoun: baseTypeRenderNoun(beastBaseType),
      });
      if (check.ok) {
        return { buffer: strip.buffer, url: strip.url, model: strip.model, requestId: strip.requestId };
      }
      logger.warning(
        `anim: strip identity fail (${check.reason}) attempt ${attempt + 1} — ${String(beast.mint).slice(0, 8)}…`,
      );
    } catch (e: any) {
      logger.warning(`anim: strip gen failed attempt ${attempt + 1}: ${e?.message || e}`);
    }
  }
  return null;
}

/** Strip → transparent looping APNG with the production assembly defaults. */
export async function assembleLoop(strip: Buffer, boomerang = true): Promise<Buffer> {
  return stripToTransparentApng(strip, {
    frameCount: FRAME_COUNT,
    chromaHex: CHROMA,
    frameDurationMs: FRAME_MS,
    boomerang,
    target: TARGET,
  });
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export interface NftStateAnimationsInput {
  beast: NftBeastInput;
  /** Which loops to produce (defaults to all three). */
  states?: StateLoop[];
  /** Also produce the power animation for this trait index. */
  includePower?: boolean;
  traitIndex?: number;
  /**
   * Technique names this beast has already performed (backend-owned memory).
   * When present, the result's techniqueUsed.isDebut is computed against it.
   */
  knownTechniques?: string[];
  /**
   * Optional emotional arc for the strips ("starts dejected, spots the ore
   * vein, ends determined"). Gated to higher-stage beasts (stage >= 4) —
   * silently ignored below that band.
   */
  arc?: string;
}

export interface NftStateAnimationsResult {
  mint: string;
  /** Which loops were successfully produced ("mining" | "win" | "lose" | "power"). */
  produced: string[];
  artifacts: NftArtifact[];
  /**
   * The named country × lane technique the power clip rendered (when
   * includePower). isDebut is set only when the caller passed knownTechniques.
   */
  techniqueUsed?: { name: string; isDebut?: boolean };
}

/**
 * Produce the requested transparent state loops (and optionally the power
 * animation) for one beast. Best-effort per loop: a single failed loop never
 * fails the job; the result lists what was produced.
 */
export async function generateStateAnimations(
  input: NftStateAnimationsInput,
  opts: { store?: ArtifactStore } = {},
): Promise<NftStateAnimationsResult> {
  const store = opts.store || getDefaultArtifactStore();
  const beast = input.beast;
  const states = input.states && input.states.length > 0 ? input.states : STATE_LOOPS;
  const profile = resolveBeastProfile(beast);
  const basePath = beast.storagePath || `misc/${beast.mint}`;
  const arcDirective = emotionalArcDirective(input.arc, profile.evolutionStage);

  const artifacts: NftArtifact[] = [];
  const produced: string[] = [];

  for (const state of states) {
    try {
      const strip = await generateStrip(beast, stateActionFor(state, profile), arcDirective);
      if (!strip) continue;
      const apng = await assembleLoop(strip.buffer, true);
      artifacts.push(
        await storeArtifact(store, {
          kind: state,
          key: `${basePath}/animations/${state}.png`,
          buffer: apng,
          contentType: "image/png",
          model: strip.model,
          requestId: strip.requestId,
        }),
      );
      produced.push(state);
    } catch (e: any) {
      logger.warning(`anim: state loop ${state} failed: ${e?.message || e}`);
    }
  }

  let techniqueUsed: { name: string; isDebut?: boolean } | undefined;
  if (input.includePower) {
    try {
      const { action, technique } = powerMoveFor(profile, input.traitIndex);
      const strip = await generateStrip(beast, action);
      if (strip) {
        const apng = await assembleLoop(strip.buffer, true);
        artifacts.push(
          await storeArtifact(store, {
            kind: "power",
            key: `${basePath}/animations/power.png`,
            buffer: apng,
            contentType: "image/png",
            model: strip.model,
            requestId: strip.requestId,
          }),
        );
        produced.push("power");
        techniqueUsed = {
          name: technique.name,
          isDebut: Array.isArray(input.knownTechniques)
            ? !input.knownTechniques.includes(technique.name)
            : undefined,
        };
      }
    } catch (e: any) {
      logger.warning(`anim: power animation failed: ${e?.message || e}`);
    }
  }

  if (produced.length === 0) {
    logger.warning(`anim: produced nothing for ${String(beast.mint).slice(0, 8)}…`);
  } else {
    logger.success(
      `🎞️ Animations [${produced.join(", ")}] generated for ${String(beast.mint).slice(0, 8)}…`,
    );
  }

  return { mint: beast.mint, produced, artifacts, ...(techniqueUsed ? { techniqueUsed } : {}) };
}
