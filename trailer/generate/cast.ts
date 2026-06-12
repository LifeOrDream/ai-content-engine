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
import { CAST_CANON } from "../../src/world/bible.js";

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

/**
 * Render-only config per cast id (style seeds + locked local reference art +
 * extra render guidance). Identity itself — name, breed, look, gear, voice —
 * comes from the world bible (src/world/bible.ts). Edit identity there.
 */
const RENDER_CONFIG: Record<
  string,
  { styleSeedUrl: string; localReferencePaths?: string[]; designNotes?: string[] }
> = {
  rex: {
    styleSeedUrl: SEED(0, "golden_retriever_run1_dp.png"),
    localReferencePaths: [
      referencePath("usa-logo", "minebtc-usa-hashbeast-logo.png"),
      referencePath("usa-wand-tech", "dp.png"),
      referencePath("usa-wand-tech", "full_body.png"),
      referencePath("usa-wand-tech", "winning.png"),
      referencePath("usa-wand-tech", "mining.png"),
    ],
    designNotes: [
      "Use the downloaded USA logo doge as an identity/social-DP anchor, but keep the body language in the USA breed canon. Preserve the hat/cap silhouette, golden-orange face, wide eyes, playful confident mouth shape, star-spangled clothing language, red cape/armor lineage, and collectible social-DP readability.",
      "For show scenes, evolve Rex into a premium animated HashBeast without changing identity or breed. Do not turn him into a black corgi, pinstripe banker dog, realistic animal, anime boy, generic shiba, or generic 3D mascot.",
    ],
  },
  long: { styleSeedUrl: SEED(1, "chow_chow_run1_dp.png") },
  volkov: { styleSeedUrl: SEED(2, "siberian_husky_run1_dp.png") },
  marshal: { styleSeedUrl: SEED(8, "dark_pungsan_run1_dp.png") },
  raja: { styleSeedUrl: SEED(3, "rajapalayam_run1_dp.png") },
  pip: { styleSeedUrl: SEED(0, "australian_shepherd_run1_dp.png") },
};

export const CAST: CharacterDef[] = CAST_CANON.map((c) => {
  const render = RENDER_CONFIG[c.id] || RENDER_CONFIG.rex;
  return {
    id: c.id,
    aliases: [...c.aliases],
    design: [
      `${c.name} — a canonical ${c.country} ${c.breed} HashBeast.`,
      c.look,
      `Signature gear: ${c.gear}`,
      ...(render.designNotes || []),
      STYLE,
    ].join(" "),
    voiceDesign: c.voiceDesign,
    language: c.language,
    defaultEmotion: c.defaultEmotion,
    styleSeedUrl: render.styleSeedUrl,
    localReferencePaths: render.localReferencePaths,
  };
});

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
