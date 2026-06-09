/**
 * Trailer CAST — the recurring named characters (Rex, Long, …). Because they
 * aren't minted HashBeasts, we build each one ONCE:
 *   • a locked reference image (generated from a canonical country-breed seed,
 *     then upgraded into trailer-tier/evolved art direction) → cached to
 *     trailer/cast/<id>.png and reused as the identity anchor for EVERY shot in
 *     EVERY video (that's what keeps them consistent).
 *   • a designed voice (MiniMax voice-design) → cached id in trailer/cast/voices.json.
 *
 * Edit the design/voice/styleSeed lines here to art-direct the cast.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageEditFromBuffers, designVoice, fetchAsBuffer } from "../../src/utils/falMedia.js";
import { HASHBEAST_REFERENCE_STYLE, PROGRESSION_AND_POWER_CANON } from "../style/visualBible.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAST_DIR = path.resolve(__dirname, "..", "cast");
const VOICES_FILE = path.join(CAST_DIR, "voices.json");
const REF_RES = (process.env.TRAILER_REF_RES as "1K" | "2K") || "1K";

const SEED = (faction: number, file: string) => `https://assets.minebtc.fun/mint_examples/faction_${faction}/${file}`;

export interface CharacterDef {
  id: string;
  aliases: string[];
  /** Full design description for the one-time reference sheet. */
  design: string;
  /** Voice-design prompt (accent + timbre + energy). */
  voiceDesign: string;
  language: string; // TTS language_boost (English keeps a global trailer legible)
  defaultEmotion: string;
  /** Canonical country-breed seed used as a silhouette/style anchor, not a quality ceiling. */
  styleSeedUrl: string;
  /** Optional locked local reference images. Prefer these over generated cast refs. */
  localReferencePaths?: string[];
}

// Match the collection's breed canon and pixel-DNA, then upgrade the design into
// trailer-tier character art. Base mint examples are seeds, not the quality cap.
const STYLE = `${HASHBEAST_REFERENCE_STYLE} Full-body locked character reference, clean plain background, highly consistent design, game-card readable silhouette.`;
const referencePath = (...parts: string[]) => path.resolve(__dirname, "..", "reference", ...parts);

export const CAST: CharacterDef[] = [
  {
    id: "rex", aliases: ["rex", "goldpaw", "rex goldpaw", "rex sterling"],
    design: [
      "Rex 'Goldpaw' Sterling — a canonical USA Golden Retriever HashBeast, evolved into the charismatic trailer host/commander. Medium-large golden retriever build, broad friendly head, floppy ears, golden fur, star-spangled cap/scarf lineage, red-and-gold cape/armor hero silhouette, bubblegum swagger, bold pixel-DNA outlines, bright patriotic arcade palette.",
      "Use the downloaded USA logo doge as an identity/social-DP anchor, but keep the body language in the USA breed canon. Preserve the hat/cap silhouette, golden-orange face, wide eyes, playful confident mouth shape, star-spangled clothing language, red cape/armor lineage, and collectible social-DP readability.",
      "For show scenes, evolve Rex into a premium animated HashBeast without changing identity or breed. Do not turn him into a black corgi, pinstripe banker dog, realistic animal, anime boy, generic shiba, or generic 3D mascot.",
      STYLE,
    ].join(" "),
    voiceDesign: "Lively animated cartoon-dog character voice — a charismatic, slightly stylized hype-man with brash American salesman swagger, expressive and a touch comedic, like a fast-talking animated-movie sidekick. Not a flat human announcer.",
    language: "English", defaultEmotion: "confident", styleSeedUrl: SEED(0, "golden_retriever_run1_dp.png"),
    localReferencePaths: [
      referencePath("usa-logo", "minebtc-usa-hashbeast-logo.png"),
      referencePath("usa-wand-tech", "dp.png"),
      referencePath("usa-wand-tech", "full_body.png"),
      referencePath("usa-wand-tech", "winning.png"),
      referencePath("usa-wand-tech", "mining.png"),
    ],
  },
  {
    id: "long", aliases: ["long", "master long"],
    design: "Master Long — a canonical China Chow Chow imperial wuxia mage. Compact lion-like Chow Chow silhouette, massive fluffy mane, deep-set calm eyes, flowing imperial robes, jade pickaxe-staff, serene controlled posture, patient power. " + STYLE,
    voiceDesign: "Stylized animated cartoon-dog character voice — calm imperial gravitas, slow and weighted, dry wit, Mandarin-accented English, the unhurried patience of someone who has already won. Characterful, not a flat human announcer.",
    language: "English", defaultEmotion: "calm", styleSeedUrl: SEED(1, "chow_chow_run1_dp.png"),
  },
  {
    id: "volkov", aliases: ["volkov"],
    design: "Volkov — a canonical Russia Siberian Husky war-mage. Medium compact wolf-like husky build, thick double coat, facial mask markings, erect ears, icy eyes, heavy military greatcoat, frost pressure aura, cold unblinking stare, statue-still menace. " + STYLE,
    voiceDesign: "Stylized animated cartoon-dog character voice — deep gravelly Russian-accented English, menacing but characterful, minimal words, threats as flat statements of fact, long pauses. Not a flat human announcer.",
    language: "English", defaultEmotion: "cold", styleSeedUrl: SEED(2, "siberian_husky_run1_dp.png"),
  },
  {
    id: "marshal", aliases: ["marshal", "marshal bonepaw", "bonepaw"],
    design: "Marshal Bonepaw — a canonical North Korea Dark Pungsan Juche Sorcerer. Powerful mountain-dog silhouette, pale/dark Pungsan lineage, over-decorated military uniform heavy with medals, stamped state pickaxe, chest puffed out, manic grandiose expression. " + STYLE,
    voiceDesign: "Stylized animated cartoon-dog character voice — grandiose comic-villain state-propaganda bombast, Korean-accented English, maximum volume and superlatives, gleefully over-the-top like an animated-movie antagonist. Not a flat human announcer.",
    language: "English", defaultEmotion: "bombastic", styleSeedUrl: SEED(8, "dark_pungsan_run1_dp.png"),
  },
  {
    id: "raja", aliases: ["raja"],
    design: "Raja — a canonical India Rajapalayam HashBeast, the underdog. Tall powerful white sighthound build, deep chest, long athletic legs, noble face, cricket gear slung like armor, gilded chakra-pickaxe, wide confident grin with a flicker of nerves underneath. " + STYLE,
    voiceDesign: "Stylized animated cartoon-dog character voice — fast, clever, warm Indian-accented English, Bollywood-bright playful energy, an underdog with heart, like a lovable animated-movie hero. Not a flat human announcer.",
    language: "English", defaultEmotion: "playful", styleSeedUrl: SEED(3, "rajapalayam_run1_dp.png"),
  },
  {
    id: "pip", aliases: ["pip"],
    design: "Pip — a canonical USA Australian Shepherd stage-1 HashBeast pup, soft and innocent, merle/tri-color markings, oversized eyes, feathered coat, bob-tail lineage, a little uncertain. " + STYLE,
    voiceDesign: "Stylized animated cartoon-puppy character voice — small, sincere, young, halting and gentle, wide-eyed innocence, like a tender animated-movie kid character. Not a flat human announcer.",
    language: "English", defaultEmotion: "vulnerable", styleSeedUrl: SEED(0, "australian_shepherd_run1_dp.png"),
  },
];

export function resolveCharacter(name: string): CharacterDef | null {
  const n = String(name || "").trim().toLowerCase();
  return CAST.find((c) => c.id === n || c.aliases.includes(n)) || null;
}

/** Return every locked visual reference for a character, preferring real local/S3-derived assets. */
export async function ensureCharacterRefs(def: CharacterDef): Promise<Buffer[]> {
  const localRefs = (def.localReferencePaths || [])
    .filter((p) => fs.existsSync(p))
    .map((p) => fs.readFileSync(p));
  if (localRefs.length > 0) return localRefs;
  return [await ensureCharacterRef(def)];
}

/**
 * Reference set for a character in a given STATE (helmet / evolved / soaked …).
 * "default" = the locked base refs. Other states get a variant sheet generated
 * ONCE from the base refs and cached to trailer/cast/<id>__<state>.png — a
 * wardrobe/state change is a DIFFERENT reference sheet (Seedance craft rule).
 * Returns [stateSheet, ...a couple of base refs] so identity stays anchored.
 */
export async function ensureStateRefs(def: CharacterDef, state?: string): Promise<Buffer[]> {
  const s = String(state || "default").trim().toLowerCase();
  const base = await ensureCharacterRefs(def);
  if (s === "default" || s === "") return base;

  fs.mkdirSync(CAST_DIR, { recursive: true });
  const file = path.join(CAST_DIR, `${def.id}__${s.replace(/[^a-z0-9_-]+/g, "_")}.png`);
  if (fs.existsSync(file)) return [fs.readFileSync(file), ...base.slice(0, 2)];

  const img = await generateImageEditFromBuffers(
    [
      `Render the EXACT same character in a new state: ${state}.`,
      `Preserve identity completely: same breed, face, fur markings, eye color, body build, colors, personality, and signature gear lineage. Apply ONLY the state change ("${state}") — e.g. helmet on, evolved armor, battle-worn, soaked fur.`,
      `Full-body locked character reference, clean plain background, highly consistent design, game-card readable silhouette.`,
      `No text, no logos, no watermark, no photorealism, no realistic fur, no 3D render, no cinematic CGI.`,
    ].join("\n"),
    base.slice(0, 4).map((buffer) => ({ buffer, mime: "image/png" as const })),
    { aspectRatio: "3:4", resolution: REF_RES },
  );
  fs.writeFileSync(file, img.buffer);
  return [img.buffer, ...base.slice(0, 2)];
}

/** Ensure a character's locked reference image exists (generate once from the style seed); return its buffer. */
export async function ensureCharacterRef(def: CharacterDef): Promise<Buffer> {
  const localRefs = (def.localReferencePaths || []).filter((p) => fs.existsSync(p));
  if (localRefs.length > 0) return fs.readFileSync(localRefs[0]);

  fs.mkdirSync(CAST_DIR, { recursive: true });
  const file = path.join(CAST_DIR, `${def.id}.png`);
  if (fs.existsSync(file)) return fs.readFileSync(file);
  const seed = await fetchAsBuffer(def.styleSeedUrl);
  const img = await generateImageEditFromBuffers(
    [
      `Restyle the attached HashBeast into this exact recurring trailer character.`,
      `Keep the EXACT identity anchor from the seed image where relevant: dog breed feel, pixel-art linework, flat cel shading, arcade palette, readable face and silhouette.`,
      def.design,
      PROGRESSION_AND_POWER_CANON,
      `This reference should feel like a premium MineBTC collectible operator with country-specific clothing, power equipment, and signature gear, but not overcluttered.`,
      `No text, no logos, no watermark, no photorealism, no realistic fur, no 3D render, no cinematic CGI.`,
    ].join("\n"),
    [{ buffer: seed, mime: "image/png" }],
    { aspectRatio: "3:4", resolution: REF_RES },
  );
  fs.writeFileSync(file, img.buffer);
  return img.buffer;
}

interface VoiceMap { [id: string]: string }
function loadVoices(): VoiceMap {
  try { return JSON.parse(fs.readFileSync(VOICES_FILE, "utf8")); } catch { return {}; }
}
/** Ensure a character has a designed voice id (design once); return the id. */
export async function ensureCharacterVoice(def: CharacterDef): Promise<string> {
  fs.mkdirSync(CAST_DIR, { recursive: true });
  const voices = loadVoices();
  if (voices[def.id]) return voices[def.id];
  const { voiceId } = await designVoice(def.voiceDesign, "Let's go — the mining starts now.");
  voices[def.id] = voiceId;
  fs.writeFileSync(VOICES_FILE, JSON.stringify(voices, null, 2));
  return voiceId;
}
