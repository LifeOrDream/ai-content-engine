/**
 * HashBeast voice layer.
 *
 * Voices are SHARED, not unique per NFT: keyed by (faction, breed, stage-band)
 * so every NFT of the same breed/country sounds consistent, and an evolved
 * beast (higher band) carries a deeper "evolved" timbre.
 *
 * Voices are designed lazily on first use (MiniMax Voice Design via fal →
 * reusable voice id). PERSISTENCE IS A PORT: the engine ships an in-memory
 * registry; a backend that wants durable voice ids either passes a
 * pre-resolved `voiceId` into the job or persists the `voiceProfile` returned
 * in the job result (MiniMax drops unused voice ids after ~7 days, so
 * design-then-immediately-synthesize, which this module does).
 */
import { designVoice, generateSpeech, FAL_MEDIA_CONFIG } from "../utils/falMedia.js";
import { countryBible, FACTION_VOICE_HINTS, bibleLeader } from "../world/bible.js";
import {
  baseTypeDef,
  baseTypeMascotPhrase,
  DEFAULT_BASE_TYPE,
  type BaseTypeId,
} from "../world/baseTypes.js";
import { logger } from "../utils/logger.js";

export interface VoiceProfile {
  voiceKey: string;
  factionId: number;
  breedValue: number;
  stageBand: number;
  /** Body-plan layer the voice was designed for (canine genesis default). */
  baseType?: BaseTypeId;
  provider: string;
  voiceId: string;
  designPrompt: string;
  previewUrl: string;
}

/** Persistence port for designed voices (backend-pluggable). */
export interface VoiceRegistry {
  get(voiceKey: string): Promise<VoiceProfile | null>;
  save(profile: VoiceProfile): Promise<void>;
}

class InMemoryVoiceRegistry implements VoiceRegistry {
  private map = new Map<string, VoiceProfile>();
  async get(voiceKey: string): Promise<VoiceProfile | null> {
    return this.map.get(voiceKey) || null;
  }
  async save(profile: VoiceProfile): Promise<void> {
    this.map.set(profile.voiceKey, profile);
  }
}

let registry: VoiceRegistry = new InMemoryVoiceRegistry();

/** Swap in a durable registry (the default is process-memory only). */
export function setVoiceRegistry(r: VoiceRegistry): void {
  registry = r;
}

// Evolution-stage bands → one voice variant per band. Default: two bands
// ("young" 0-3, "evolved" 4-7). Format: comma-separated inclusive ranges.
const STAGE_BANDS: Array<[number, number]> = parseBands(
  process.env.HASHBEAST_VOICE_STAGE_BANDS || "0-3,4-7",
);

const BAND_TONE: string[] = (
  process.env.HASHBEAST_VOICE_BAND_TONE ||
  "young, scrappy, higher-energy and a little untrained|deeper, battle-hardened, commanding and powerful"
).split("|");

function parseBands(spec: string): Array<[number, number]> {
  const bands: Array<[number, number]> = [];
  for (const part of spec.split(",")) {
    const [a, b] = part.trim().split("-").map((n) => parseInt(n, 10));
    if (!isNaN(a)) bands.push([a, isNaN(b) ? a : b]);
  }
  return bands.length ? bands : [[0, 7]];
}

export function stageBand(level: number): number {
  const idx = STAGE_BANDS.findIndex(([lo, hi]) => level >= lo && level <= hi);
  return idx < 0 ? STAGE_BANDS.length - 1 : idx;
}

/**
 * Voice key: canine keeps the legacy `<faction>:<breed>:<band>` format (no
 * re-design churn for existing beasts); non-canine base types get their own
 * keyspace so a feline never reuses a dog voice.
 */
export function voiceKeyFor(
  factionId: number,
  breedValue: number,
  level: number,
  baseType: BaseTypeId = DEFAULT_BASE_TYPE,
): string {
  const core = `${factionId}:${breedValue % 4}:${stageBand(level)}`;
  return baseType === "canine" ? core : `${baseType}:${core}`;
}

// Per-country accent / vocal character — single-sourced from the world bible.
function factionCode(factionId: number): string {
  return countryBible(factionId)?.code || "usa";
}

export function buildVoiceDesignPrompt(
  factionId: number,
  breedName: string,
  band: number,
  baseType: BaseTypeId = DEFAULT_BASE_TYPE,
): string {
  const code = factionCode(factionId);
  const hint = FACTION_VOICE_HINTS[code] || FACTION_VOICE_HINTS.usa;
  const factionName = countryBible(factionId)?.country || code;
  const bandTone = BAND_TONE[band] || BAND_TONE[BAND_TONE.length - 1] || "";
  const timbreModifier = baseTypeDef(baseType).voiceTimbreModifier;
  return [
    `Voice for an animated cartoon ${breedName} ${baseTypeMascotPhrase(baseType)} representing ${factionName} in a high-energy country-vs-country battle game.`,
    `Accent: ${hint.accent}. Character: ${hint.timbre}.`,
    timbreModifier ? `Base-type timbre: ${timbreModifier}` : "",
    bandTone ? `Maturity: ${bandTone}.` : "",
    `Expressive, punchy, game-character delivery — not a calm narrator. Single character voice.`,
  ]
    .filter(Boolean)
    .join(" ");
}

export interface EnsuredVoice {
  voiceId: string;
  /** Set when this call DESIGNED a new voice — persist it backend-side. */
  newProfile?: VoiceProfile;
}

/**
 * Resolve (lazily designing if needed) the shared voice id for this
 * (faction, breed, level). Returns null when no fal key is configured or
 * design fails — callers then ship a silent clip.
 */
export async function ensureVoiceId(
  factionId: number,
  breedValue: number,
  level: number,
  breedName: string,
  baseType: BaseTypeId = DEFAULT_BASE_TYPE,
): Promise<EnsuredVoice | null> {
  if (!FAL_MEDIA_CONFIG.hasFalKey) return null;
  const key = voiceKeyFor(factionId, breedValue, level, baseType);
  try {
    const existing = await registry.get(key);
    if (existing?.voiceId) return { voiceId: existing.voiceId };

    const band = stageBand(level);
    const description = buildVoiceDesignPrompt(factionId, breedName, band, baseType);
    const preview = bibleLeader(factionId)?.catchphrases?.[0];
    const { voiceId, previewUrl } = await designVoice(
      description,
      preview || "For glory and country — let's go!",
    );

    const profile: VoiceProfile = {
      voiceKey: key,
      factionId,
      breedValue: breedValue % 4,
      stageBand: band,
      baseType,
      provider: "minimax",
      voiceId,
      designPrompt: description,
      previewUrl,
    };
    await registry.save(profile);
    logger.success(`🎙️ Designed new voice ${key} → ${voiceId} (${breedName})`);
    return { voiceId, newProfile: profile };
  } catch (err: any) {
    logger.warning(`ensureVoiceId failed for ${key}: ${err?.message || err} — continuing silent`);
    return null;
  }
}

/**
 * Synthesize a dialogue line with the resolved voice. Returns the fal-hosted
 * audio URL or null on failure.
 */
export async function synthesizeDialogue(
  voiceId: string,
  dialogue: string,
  opts: { emotion?: string; language?: string } = {},
): Promise<string | null> {
  if (!voiceId || !dialogue?.trim()) return null;
  try {
    const audio = await generateSpeech(voiceId, dialogue.slice(0, 600), {
      emotion: opts.emotion,
      language: opts.language,
    });
    return audio.url;
  } catch (err: any) {
    logger.warning(`synthesizeDialogue failed: ${err?.message || err}`);
    return null;
  }
}
