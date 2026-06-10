/**
 * Mint asset generation — DNA → prompt grammar → full_body.png / dp.png
 * (+ optional cinematic.png) with identity validation and bounded regen.
 *
 * Ported from the MineBTC backend's asset generation worker. The engine half
 * is everything creative + generative:
 *
 *   1. Decode DNA → faction × category × region × breed traits.
 *   2. Build the faction-grammar full-body prompt (style-locked to a breed
 *      base-body reference image).
 *   3. Generate full body (3:4) with the mint image model, Gemini-validate
 *      style/pose/direction vs the reference, retry up to MAX_RETRIES.
 *   4. Generate the display picture (1:1) from the full body, Gemini-validate
 *      same-character/crop/facing, retry up to MAX_RETRIES.
 *   5. Optionally render a cinematic PFP portrait (non-blocking).
 *   6. Hand every image to the artifact store (S3 when configured, inline
 *      base64 otherwise) and return artifact descriptors.
 *
 * What stays in the backend (per docs/architecture.md): queue enqueue +
 * idempotency keys, DDB persistence, Metaplex metadata JSON + CDN
 * invalidation, socket `hashbeast:mint_progress` emission, Telegram
 * notifications, and economics ledgering.
 */
import * as fs from "node:fs/promises";
import * as path from "node:path";

import {
  generateImageEditFromBuffers,
  fetchAsBuffer,
  type GeneratedMedia,
} from "../utils/falMedia.js";
import { logger } from "../utils/logger.js";
import {
  buildHashBeastPrompt,
  getCategoryName,
  resolveHashBeastTraits,
  FACTION_REGISTRY,
} from "../prompts/index.js";
import { decodeDNA } from "./dna.js";
import { compareImageWithReference, type ValidationResult } from "./identity.js";
import {
  getDefaultArtifactStore,
  storeArtifact,
  type ArtifactStore,
  type NftArtifact,
} from "./artifacts.js";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Mint art model — production uses nano-banana-pro for the collectible-grade
// pixel sprites; override per deployment without code changes.
const MINT_IMAGE_MODEL =
  process.env.NFT_MINT_IMAGE_MODEL || "fal-ai/nano-banana-pro/edit";

const FULL_BODY_ASPECT_RATIO = "3:4"; // portrait — character sprite proportions
const FULL_BODY_RESOLUTION: "1K" | "2K" | "4K" = "1K";
const DP_ASPECT_RATIO = "1:1";
const DP_RESOLUTION: "1K" | "2K" | "4K" = "1K";
const CINEMATIC_ASPECT_RATIO = "1:1";
const CINEMATIC_RESOLUTION: "1K" | "2K" | "4K" =
  (process.env.NFT_CINEMATIC_RESOLUTION as "1K" | "2K" | "4K") || "2K";

/** Max generation+validation attempts per image. */
export const MAX_RETRIES = Math.max(1, Number(process.env.NFT_MINT_MAX_RETRIES || 3));

/**
 * Breed base-body filename mapping: BREED_BASE_BODIES[factionId][breedValue].
 * These are pixel-art bipedal chibi sprites used as style + body-type
 * references for mint generation. The actual PNGs are deployment assets —
 * resolve them via `referenceImageUrl` on the job, or the
 * HASHBEAST_BASE_BODIES_DIR / HASHBEAST_BASE_BODIES_BASE_URL env settings.
 */
export const BREED_BASE_BODIES: Record<number, Record<number, string>> = {
  0: { 0: "golden_retriever.png", 1: "husky.png", 2: "corgi.png", 3: "australian_shepherd.png" },
  1: { 0: "chow_chow.png", 1: "shih_tzu.png", 2: "pekingese.png", 3: "chinese_crested.png" },
  2: { 0: "samoyed.png", 1: "borzoi.png", 2: "siberian_husky.png", 3: "yakutian_laika.png" },
  3: { 0: "indian_spitz.png", 1: "rajapalayam.png", 2: "indian_pariah.png", 3: "himalayan_sheepdog.png" },
  4: { 0: "shiba_inu.png", 1: "akita_inu.png", 2: "japanese_spitz.png", 3: "shikoku.png" },
  5: { 0: "jindo.png", 1: "sapsali.png", 2: "white_jindo.png", 3: "pungsan.png" },
  6: { 0: "persian_saluki.png", 1: "sarabi_mastiff.png", 2: "persian_shepherd.png", 3: "khalaj_greyhound.png" },
  7: { 0: "english_bulldog.png", 1: "pembroke_welsh_corgi.png", 2: "border_collie.png", 3: "jack_russell_terrier.png" },
  8: { 0: "pungsan.png", 1: "dark_pungsan.png", 2: "northern_spitz.png", 3: "paektu_wolf_dog.png" },
  9: { 0: "french_bulldog.png", 1: "poodle.png", 2: "papillon.png", 3: "berger_picard.png" },
  10: { 0: "fila_brasileiro.png", 1: "brazilian_terrier.png", 2: "dogue_brasileiro.png", 3: "caramelo_vira_lata.png" },
  11: { 0: "canaan_dog.png", 1: "baladi_dog.png", 2: "israel_pointer.png", 3: "negev_desert_dog.png" },
};

export const BASE_BODIES_DIR = process.env.HASHBEAST_BASE_BODIES_DIR || "";
const BASE_BODIES_BASE_URL = process.env.HASHBEAST_BASE_BODIES_BASE_URL || "";

// ---------------------------------------------------------------------------
// DNA → trait view used by the prompt builders
// ---------------------------------------------------------------------------

export interface DecodedTraits {
  factionId: number;
  evolutionStage: number;
  type: number; // 0-7 = Wizard, 8-15 = Muggle
  breedValue: number; // 0-3 breed within faction
  furColor: number;
  headwear: number;
  outfit: number;
  weapon: number;
  accessory: number;
  expression: number;
  background: number;
  traits: number[]; // [furColor, headwear, outfit, weapon, accessory, expression, background]
  visiblePowers: number[];
}

/** Decode DNA and flatten to the trait view the mint prompts consume. */
export function decodeMintTraits(dnaHex: string): DecodedTraits {
  const decoded = decodeDNA(dnaHex);
  const rawTraits = decoded.appearance.map((group) => group[0]);
  const traits = [
    rawTraits[0],
    rawTraits[1],
    rawTraits[2],
    rawTraits[3],
    rawTraits[4],
    rawTraits[5],
    rawTraits[6] ?? 0,
  ];
  return {
    factionId: decoded.faction,
    evolutionStage: decoded.evolution,
    type: decoded.type,
    breedValue: decoded.breed,
    furColor: traits[0],
    headwear: traits[1],
    outfit: traits[2],
    weapon: traits[3],
    accessory: traits[4],
    expression: traits[5],
    background: traits[6],
    traits,
    visiblePowers: decoded.powers.map((group) => group[0]),
  };
}

// ---------------------------------------------------------------------------
// Storage path
// ---------------------------------------------------------------------------

export interface MintStoragePath {
  factionName: string;
  categoryName: string;
  regionName: string;
  nftId: string;
  fullPath: string;
}

/**
 * Storage-relative folder for a mint's assets:
 * `<faction_name>/<category_name>/<region_name>/<mint>`.
 */
export function getStoragePath(
  factionId: number,
  categoryValue: number,
  regionValue: number,
  mint: string,
): MintStoragePath {
  const factionRegistry = FACTION_REGISTRY[factionId];
  const factionName =
    factionRegistry?.faction.code.toLowerCase() || `faction_${factionId}`;
  const categoryName = getCategoryName(factionId, categoryValue)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_");
  const regionName = `region_${regionValue}`;
  const nftId = mint;
  return {
    factionName,
    categoryName,
    regionName,
    nftId,
    fullPath: `${factionName}/${categoryName}/${regionName}/${nftId}`,
  };
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

/**
 * Full-body prompt: faction grammar (faction × category × region × breed ×
 * 7 appearance traits) wrapped with style-lock instructions against the
 * attached breed base-body reference.
 */
export function buildFullBodyPrompt(
  decodedTraits: DecodedTraits,
  hashbeastNumber: string,
): string {
  const hashbeastPrompt = buildHashBeastPrompt(
    decodedTraits.factionId,
    decodedTraits.evolutionStage,
    decodedTraits.type,
    decodedTraits.traits,
    decodedTraits.breedValue,
  );

  return `REFERENCE IMAGE PROVIDED: The attached reference image shows a pup hashbeast base body. Use this as a STYLE REFERENCE for:
- Character positioning and posture (same standing pose)
- Pixelation/art style (same retro pixel art aesthetic)
- Direction the hashbeast is facing (same orientation)

However, generate a COMPLETELY NEW and DIFFERENT character based on the traits below. The new character should match the style/pose/direction but have different faction, outfit, colors, and features as specified.

${hashbeastPrompt}

CHARACTER ID: Hashbeast #${hashbeastNumber}

CRITICAL STYLE REQUIREMENTS:
- Match the reference image's posture, pixel style, and facing direction
- Single character only, full body visible from head to feet/paws
- Clean pixel art, no blur or artifacts
- No text, watermarks, or overlays
- Character should fill most of the frame`;
}

/** Display-picture prompt — upper-body crop of the full body, facing right. */
export function buildDPPrompt(): string {
  return `Using the attached full body image as reference, create a display picture (profile picture) of this SAME character.

REQUIREMENTS:
- Show only the UPPER BODY (head, shoulders, and upper torso)
- Character's face should be facing slightly to the RIGHT
- Maintain the exact same pixel art style, colors, and character design
- Simple or blurred background
- Suitable for profile picture / avatar use
- No text, watermarks, or overlays`;
}

const CINEMATIC_STYLE_PREFIX = `Semi-realistic 3D rendered character portrait, Pixar and DreamWorks animation quality, cinematic movie still aesthetic. The character is an anthropomorphic bipedal hashbeast (dog) with detailed realistic fur textures, expressive eyes with light reflections, and physically-based material rendering on all clothing and accessories. Dramatic cinematic lighting with rim lights and volumetric atmosphere. Shallow depth of field with bokeh background. Professional composition suitable for a movie poster or game cinematic cutscene. The character should feel like it belongs in a high-budget animated film — NOT pixel art, NOT cartoon, NOT flat illustration. Think Zootopia meets military thriller.`;

const FACTION_CINEMATIC_ENVIRONMENTS: Record<number, { bg: string; colors: string }> = {
  0: { bg: "Inside a high-tech Pentagon command center with holographic displays, American flags, warm golden lighting through tall windows, oak conference table", colors: "Red, white, blue accents. Gold trim. Warm amber lighting." },
  1: { bg: "Inside an imperial palace hall with red silk curtains, golden dragon motifs, jade ornaments, dramatic red and gold lantern lighting", colors: "Deep red and gold. Jade green accents." },
  2: { bg: "Inside a Kremlin war room with dark wood paneling, military maps on walls, snow visible through frosted windows, cold blue lighting mixed with warm lamp light", colors: "Deep blue, white, red. Cold tones." },
  3: { bg: "Inside an ornate Rajasthani palace with intricate marble carvings, colorful stained glass, marigold garlands, warm golden temple lighting", colors: "Saffron orange, white, green. Rich gold." },
  4: { bg: "Inside a traditional Japanese castle with sliding shoji screens, katana display wall, cherry blossom branches, soft diffused paper lantern lighting", colors: "White, red. Cherry pink accents." },
  5: { bg: "Inside an ultra-modern Seoul tech headquarters with curved glass walls, LED accent strips, clean white and cyan lighting", colors: "Cyan, white, sleek modern neon." },
  6: { bg: "Inside a grand Persian palace with geometric tilework, arched doorways, ornate carpets, moody golden light filtering through lattice screens", colors: "Green, gold, white. Persian blue tile accents." },
  7: { bg: "Inside a classic British parliament chamber with dark wood, green leather benches, gothic arched windows, warm candlelight mixed with grey London light", colors: "Navy blue, red, gold. Dark wood." },
  8: { bg: "Inside a stark propaganda-decorated bunker with military medals display case, harsh fluorescent mixed with dramatic spotlight", colors: "Dark red, military green, gold stars." },
  9: { bg: "Inside a lavish Versailles-style salon with gilded mirrors, crystal chandeliers, rococo ceiling, warm romantic Parisian golden light", colors: "Blue, white, red. Gold gilding." },
  10: { bg: "Inside a futuristic skyscraper penthouse with floor-to-ceiling glass, sunset visible, gold and marble finishes", colors: "Gold, green, white. Luxury." },
  11: { bg: "Inside a high-security intelligence operations center with multiple screens, Jerusalem stone walls visible, cool blue-white tech lighting", colors: "Blue, white. Tech aesthetic." },
};

/**
 * Cinematic PFP portrait prompt (optional asset; production currently ships
 * full_body + dp only — keep this behind `includeCinematic`).
 */
export function buildCinematicPrompt(decodedTraits: DecodedTraits): string {
  const { factionId, evolutionStage, traits, breedValue } = decodedTraits;
  const resolved = resolveHashBeastTraits(
    factionId,
    evolutionStage,
    decodedTraits.type ?? 0,
    traits,
    breedValue,
  );
  const factionEnv =
    FACTION_CINEMATIC_ENVIRONMENTS[factionId] || FACTION_CINEMATIC_ENVIRONMENTS[0];
  const { breed, faction, type } = resolved;

  const evolutionDesc =
    evolutionStage >= 5
      ? "Legendary presence, battle-scarred veteran, aura of power and authority"
      : evolutionStage >= 3
        ? "Experienced operative, confident bearing, well-worn equipment"
        : evolutionStage >= 1
          ? "Young but determined, fresh equipment, eager posture"
          : "Rookie recruit, basic gear, wide-eyed but resolute";

  const traitLines: string[] = [];
  if (resolved.traits.furColor?.prompt) traitLines.push(`Fur: ${resolved.traits.furColor.prompt}`);
  if (resolved.traits.headwear?.prompt) traitLines.push(`Headwear: ${resolved.traits.headwear.prompt}`);
  if (resolved.traits.outfit?.prompt) traitLines.push(`Outfit: ${resolved.traits.outfit.prompt}`);
  if (resolved.traits.weapon?.prompt) traitLines.push(`Weapon: ${resolved.traits.weapon.prompt}`);
  if (resolved.traits.accessory?.prompt) traitLines.push(`Accessory: ${resolved.traits.accessory.prompt}`);
  if (resolved.traits.expression?.prompt) traitLines.push(`Expression: ${resolved.traits.expression.prompt}`);

  return `${CINEMATIC_STYLE_PREFIX}

Using the attached full body image as the SAME-CHARACTER reference, render a cinematic PFP-style portrait (profile picture / avatar framing).

CHARACTER: An anthropomorphic bipedal ${breed.name} dog — ${breed.bodyPrompt}. The face is the focal point.

FACTION: ${faction.name}
Role: ${type.occupation} (${type.isWizard ? "Wizard — magical elements in design" : "Muggle — practical tactical design"})
FACTION ENVIRONMENT: ${factionEnv.bg}
COLOR DIRECTION: ${factionEnv.colors}

EVOLUTION STAGE ${evolutionStage}/7: ${evolutionDesc}

APPEARANCE:
${traitLines.join("\n")}

The character must be rendered with cinematic quality — realistic fur with individual hair strands catching the light, physically accurate fabric on visible upper-body clothing, reflective materials on metal accessories. The environment is heavily blurred behind the character (very shallow depth of field, large bokeh) so the face stays the clear hero of the frame. Dramatic three-point lighting with warm key light, cool fill, and rim backlight for character separation.

COMPOSITION: Square PFP / avatar framing — head and shoulders only (upper body, no full body, no waist or legs visible). Character's face is centered or slightly off-center, facing slightly to the RIGHT (matching the DP framing) and looking toward camera. Tight crop suitable for a profile picture; the head should fill the majority of the frame.
QUALITY: 4K cinematic render, movie poster quality, Unreal Engine 5 level of detail.`;
}

// ---------------------------------------------------------------------------
// Reference resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the breed base-body reference image as a buffer:
 * 1. explicit `referenceImageUrl` from the job,
 * 2. local HASHBEAST_BASE_BODIES_DIR/<breed file>,
 * 3. remote HASHBEAST_BASE_BODIES_BASE_URL/<breed file>.
 */
export async function resolveReferenceImage(
  factionId: number,
  breedValue: number,
  referenceImageUrl?: string,
): Promise<{ buffer: Buffer; source: string }> {
  if (referenceImageUrl) {
    return { buffer: await fetchAsBuffer(referenceImageUrl), source: referenceImageUrl };
  }
  const filename = BREED_BASE_BODIES[factionId]?.[breedValue % 4];
  if (filename && BASE_BODIES_DIR) {
    const fullPath = path.join(BASE_BODIES_DIR, filename);
    try {
      return { buffer: await fs.readFile(fullPath), source: fullPath };
    } catch {
      logger.warning(`Breed base body not found locally: ${fullPath}`);
    }
  }
  if (filename && BASE_BODIES_BASE_URL) {
    const url = `${BASE_BODIES_BASE_URL.replace(/\/$/, "")}/${filename}`;
    try {
      return { buffer: await fetchAsBuffer(url), source: url };
    } catch {
      logger.warning(`Breed base body not found on CDN: ${url}`);
    }
  }
  throw new Error(
    "No mint reference image available — pass referenceImageUrl in the job or configure HASHBEAST_BASE_BODIES_DIR / HASHBEAST_BASE_BODIES_BASE_URL",
  );
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export interface NftMintAssetsInput {
  mint: string;
  name?: string;
  owner?: string;
  /** 256-bit DNA hex (with or without 0x). */
  dna: string;
  factionId: number;
  /** Category value (0-31, wizard/muggle role) — used for the storage path. */
  categoryValue: number;
  /** Region value (0-31) — used for the storage path. */
  regionValue: number;
  /** Breed base-body / style reference; falls back to env-resolved base bodies. */
  referenceImageUrl?: string;
  /** Also render the cinematic PFP portrait (non-blocking; default false). */
  includeCinematic?: boolean;
}

export interface MintValidationSummary {
  attempts: number;
  passed: boolean;
  reason: string;
}

export interface NftMintAssetsResult {
  mint: string;
  storagePath: string;
  artifacts: NftArtifact[];
  validation: {
    fullBody: MintValidationSummary;
    dp: MintValidationSummary;
  };
  /** The exact prompt packet, for reproducibility/review (media-proof culture). */
  prompts: { fullBody: string; dp: string; cinematic?: string };
}

export type NftProgressFn = (update: {
  step: string;
  percent: number;
  message?: string;
}) => void | Promise<void>;

interface ValidatedGeneration {
  media: GeneratedMedia;
  attempts: number;
  passed: boolean;
  reason: string;
}

/** Generate + validate with a bounded retry budget; keeps the last image on exhaustion. */
async function generateWithValidation(
  label: string,
  prompt: string,
  refs: Array<{ buffer: Buffer; mime?: string }>,
  genOpts: { aspectRatio: string; resolution: "1K" | "2K" | "4K" },
  validate: (media: GeneratedMedia) => Promise<ValidationResult>,
  onAttempt?: (attempt: number) => void | Promise<void>,
): Promise<ValidatedGeneration> {
  let last: GeneratedMedia | null = null;
  let reason = "";
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    await onAttempt?.(attempt);
    const media = await generateImageEditFromBuffers(prompt, refs, {
      ...genOpts,
      model: MINT_IMAGE_MODEL,
    });
    last = media;
    const check = await validate(media);
    reason = check.reason;
    if (check.isValid) {
      logger.info(`${label} passed comparison on attempt ${attempt}: ${check.reason}`);
      return { media, attempts: attempt, passed: true, reason: check.reason };
    }
    logger.warning(
      `${label} comparison failed (attempt ${attempt}/${MAX_RETRIES}): ${check.reason}`,
    );
  }
  logger.warning(`${label}: max ${MAX_RETRIES} retries reached — keeping last image`);
  return { media: last!, attempts: MAX_RETRIES, passed: false, reason };
}

/**
 * Run the full mint asset generation for one HashBeast. Pure media + prompts:
 * the caller persists/announces the result.
 */
export async function generateMintAssets(
  input: NftMintAssetsInput,
  opts: { store?: ArtifactStore; onProgress?: NftProgressFn } = {},
): Promise<NftMintAssetsResult> {
  const store = opts.store || getDefaultArtifactStore();
  const progress: NftProgressFn = opts.onProgress || (() => undefined);
  const hashbeastNumber = input.mint.substring(0, 8);

  // 1. Decode DNA + storage path.
  const decodedTraits = decodeMintTraits(input.dna);
  const storagePath = getStoragePath(
    input.factionId,
    input.categoryValue,
    input.regionValue,
    input.mint,
  );

  await progress({ step: "generating_full_body", percent: 5, message: "Building prompt..." });

  // 2. Resolve the breed base-body style reference.
  const reference = await resolveReferenceImage(
    decodedTraits.factionId,
    decodedTraits.breedValue,
    input.referenceImageUrl,
  );
  logger.info(
    `Mint ${hashbeastNumber}…: reference=${path.basename(reference.source)} (faction=${decodedTraits.factionId}, breed=${decodedTraits.breedValue})`,
  );

  // 3. Full body — generate, identity-gate vs the reference, bounded retries.
  const fullBodyPrompt = buildFullBodyPrompt(decodedTraits, hashbeastNumber);
  const fullBody = await generateWithValidation(
    "Full body",
    fullBodyPrompt,
    [{ buffer: reference.buffer }],
    { aspectRatio: FULL_BODY_ASPECT_RATIO, resolution: FULL_BODY_RESOLUTION },
    (media) =>
      compareImageWithReference({ buffer: reference.buffer }, { url: media.url }, "full_body"),
    (attempt) =>
      progress({
        step: "generating_full_body",
        percent: 10 + attempt * 8,
        message: `Generating full body (attempt ${attempt}/${MAX_RETRIES})...`,
      }),
  );

  await progress({ step: "uploading", percent: 35, message: "Storing full body..." });
  const artifacts: NftArtifact[] = [];
  const fullBodyArtifact = await storeArtifact(store, {
    kind: "full_body",
    key: `${storagePath.fullPath}/full_body.png`,
    buffer: fullBody.media.buffer,
    contentType: "image/png",
    model: fullBody.media.model,
    requestId: fullBody.media.requestId,
  });
  artifacts.push(fullBodyArtifact);

  await progress({ step: "generating_dp", percent: 50, message: "Generating display picture..." });

  // 4. Display picture — full body becomes the reference.
  const dpPrompt = buildDPPrompt();
  const dp = await generateWithValidation(
    "DP",
    dpPrompt,
    [{ buffer: fullBody.media.buffer }],
    { aspectRatio: DP_ASPECT_RATIO, resolution: DP_RESOLUTION },
    (media) =>
      compareImageWithReference(
        { buffer: fullBody.media.buffer },
        { url: media.url },
        "dp",
      ),
    (attempt) =>
      progress({
        step: "generating_dp",
        percent: 50 + attempt * 8,
        message: `Generating DP (attempt ${attempt}/${MAX_RETRIES})...`,
      }),
  );

  await progress({ step: "uploading", percent: 80, message: "Storing DP..." });
  const dpArtifact = await storeArtifact(store, {
    kind: "dp",
    key: `${storagePath.fullPath}/dp.png`,
    buffer: dp.media.buffer,
    contentType: "image/png",
    model: dp.media.model,
    requestId: dp.media.requestId,
  });
  artifacts.push(dpArtifact);

  // 5. Optional cinematic portrait — non-blocking: failure never fails the job.
  let cinematicPrompt: string | undefined;
  if (input.includeCinematic) {
    await progress({ step: "generating_cinematic", percent: 88, message: "Rendering cinematic..." });
    try {
      cinematicPrompt = buildCinematicPrompt(decodedTraits);
      const cinematic = await generateImageEditFromBuffers(
        cinematicPrompt,
        [{ buffer: fullBody.media.buffer }],
        {
          aspectRatio: CINEMATIC_ASPECT_RATIO,
          resolution: CINEMATIC_RESOLUTION,
          model: MINT_IMAGE_MODEL,
        },
      );
      artifacts.push(
        await storeArtifact(store, {
          kind: "cinematic",
          key: `${storagePath.fullPath}/cinematic.png`,
          buffer: cinematic.buffer,
          contentType: "image/png",
          model: cinematic.model,
          requestId: cinematic.requestId,
        }),
      );
    } catch (err: any) {
      logger.warning(`cinematic generation failed (non-blocking): ${err?.message || err}`);
    }
  }

  await progress({ step: "completed", percent: 100, message: "Asset generation complete" });
  logger.success(`🎨 Mint assets generated for ${input.name || input.mint} (${hashbeastNumber}…)`);

  return {
    mint: input.mint,
    storagePath: storagePath.fullPath,
    artifacts,
    validation: {
      fullBody: { attempts: fullBody.attempts, passed: fullBody.passed, reason: fullBody.reason },
      dp: { attempts: dp.attempts, passed: dp.passed, reason: dp.reason },
    },
    prompts: { fullBody: fullBodyPrompt, dp: dpPrompt, cinematic: cinematicPrompt },
  };
}
