/**
 * AUDIO IDENTITY (Phase F4) — the ownable sound system of Mining Wars.
 *
 * One spec, four families:
 *   1. COUNTRY LEITMOTIFS  — one short ownable instrumental motif per country
 *      (12). Plays under that country's wins, reveals and chapter callouts.
 *   2. EVOLUTION STINGS    — one sting per performance band (pup / soldier /
 *      elite / ascendant), escalating in scale with the stage ladder.
 *   3. STORY THEMES        — the chapter-settled theme + the losing-streak
 *      motif (the "drought" sound that makes a comeback land harder).
 *   4. RITUAL SFX          — the staged casino-ritual beats (lootbox
 *      anticipation/crack/fanfares/near-miss, claim-roll anticipation/resolve).
 *
 * Everything here is a SPEC: deterministic cue definitions with stable ids and
 * stable-audio generation prompts. Actual generation runs through the existing
 * stable-audio path (src/utils/falMedia.ts generateMusic/generateSfx) via the
 * `audio.identity_cue` job kind — flag-gated (AUDIO_IDENTITY_GENERATION_ENABLED)
 * engine-side and budget-gated backend-side EXACTLY like other media jobs.
 * Do NOT mass-generate: cues are generated once, stored, and referenced by id.
 *
 * soundId wiring: the frontend's existing SFX ids are "mutation" and
 * "jackpot". Every cue carries `fallbackSoundId` from that legacy set so any
 * surface can play TODAY's sound until the cue's generated asset ships —
 * new ids extend the existing mapping, they never break it.
 */
import { COUNTRY_BIBLES, countryBible, type RarityTier } from "./bible.js";
import { performanceBand, type PerformanceBand } from "./progression.js";
import { generateMusic, generateSfx, type GeneratedMedia } from "../utils/falMedia.js";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type AudioCueCategory =
  | "leitmotif"
  | "evolution_sting"
  | "story_theme"
  | "ritual_sfx";

/** The frontend's EXISTING SFX ids — every cue must fall back to one of these. */
export const LEGACY_SOUND_IDS = ["mutation", "jackpot"] as const;
export type LegacySoundId = (typeof LEGACY_SOUND_IDS)[number];

export interface AudioCueDef {
  /** Stable cue id — the new soundId surfaces reference. */
  id: string;
  title: string;
  category: AudioCueCategory;
  /** Clip length for stable-audio (`seconds_total`, ≤ 47). */
  seconds: number;
  /**
   * Stable-audio text prompt. ALWAYS instrumental — no vocals, no lyrics, no
   * spoken words (the audio twin of the no-readable-text image rule).
   */
  prompt: string;
  /** Existing FE SFX id to play until this cue's asset is generated + wired. */
  fallbackSoundId: LegacySoundId;
  /** Leitmotifs only: the country this motif belongs to. */
  factionId?: number;
  /** Evolution stings only: the stage band this sting belongs to. */
  band?: PerformanceBand;
}

const INSTRUMENTAL_RULE =
  "Instrumental only, no vocals, no lyrics, no spoken words.";

// ─────────────────────────────────────────────────────────────────────────────
// 1 · Country leitmotifs — instrument + rhythm grammar per faction code.
// National identity through instrumentation and rhythm, never anthem quotes.
// ─────────────────────────────────────────────────────────────────────────────

const LEITMOTIF_GRAMMAR: Record<string, string> = {
  usa: "brash brass fanfare over electric guitar and a ticker-tape snare roll, swaggering major key, stadium confidence",
  china: "guzheng glissando over deep war drums and a single jade chime, patient and inevitable, slow-building weight",
  russia: "deep cinematic strings with anvil hits and a frost-cold sub-bass pulse, stern minor key, glacial menace",
  india: "bright sitar riff over a rolling tabla groove with brass swells, celebratory and unstoppable",
  japan: "precise koto and shamisen plucks punctuated by one taiko strike, minimal, disciplined, razor-clean",
  southkorea: "hyper-clean synth arpeggios and neon EDM stabs at a fast tempo, polished esports-broadcast energy",
  iran: "ornate santur runs over a daf frame-drum heartbeat, modal and regal, ancient-meets-electric",
  uk: "stately brass and harpsichord undercut by a punk guitar stab, dry, composed, quietly dangerous",
  northkorea: "rigid militaristic snare march with stark unison brass hits, austere, locked in step",
  france: "elegant accordion phrase answered by a playful jazz-piano flourish, suave and theatrical",
  brazil: "explosive samba percussion with cuica squeals and a carnival whistle, exuberant crowd-surge rhythm",
  israel: "agile klezmer-style clarinet line woven through a precision synth pulse, sharp, clever, fast-fingered",
};

function leitmotifCue(factionId: number): AudioCueDef {
  const c = countryBible(factionId);
  const code = c?.code || `faction${factionId}`;
  const grammar =
    LEITMOTIF_GRAMMAR[code] ||
    "bold orchestral motif with a national-team broadcast energy";
  return {
    id: `leitmotif_${code}`,
    title: `${c?.country || code} leitmotif`,
    category: "leitmotif",
    seconds: 8,
    prompt: `Short ownable musical leitmotif for a stylized ${c?.country || code} team in an animated country-vs-country mining tournament: ${grammar}. One memorable 8-second phrase that can loop. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "jackpot",
    factionId,
  };
}

export const COUNTRY_LEITMOTIFS: AudioCueDef[] = COUNTRY_BIBLES.map((c) =>
  leitmotifCue(c.factionId),
);

export function countryLeitmotif(factionId: number): AudioCueDef {
  return (
    COUNTRY_LEITMOTIFS.find((m) => m.factionId === factionId) ||
    COUNTRY_LEITMOTIFS[0]
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2 · Evolution stings — escalate per stage band (B3 performance bands).
// ─────────────────────────────────────────────────────────────────────────────

const EVOLUTION_STING_GRAMMAR: Record<PerformanceBand, { seconds: number; prompt: string }> = {
  pup: {
    seconds: 4,
    prompt:
      "Tiny bright evolution sting: toy glockenspiel sparkle, one small chime and a quick fizz of fairy-dust shimmer, eager and adorable",
  },
  soldier: {
    seconds: 5,
    prompt:
      "Mid-rank evolution sting: tight snare build into a confident two-note brass hit with a metallic shing, earned and proud",
  },
  elite: {
    seconds: 6,
    prompt:
      "Heroic evolution sting: full orchestral riser detonating into a shockwave impact with choir-less synth halo and slow ember decay, commanding",
  },
  ascendant: {
    seconds: 8,
    prompt:
      "Transcendent evolution sting: vast serene swell, sub-bass bloom and a single weightless bell over shimmering overtones, godlike calm instead of noise",
  },
};

export const EVOLUTION_STINGS: AudioCueDef[] = (
  ["pup", "soldier", "elite", "ascendant"] as PerformanceBand[]
).map((band) => ({
  id: `evolution_sting_${band}`,
  title: `Evolution sting — ${band} band`,
  category: "evolution_sting",
  seconds: EVOLUTION_STING_GRAMMAR[band].seconds,
  prompt: `${EVOLUTION_STING_GRAMMAR[band].prompt}. ${INSTRUMENTAL_RULE}`,
  fallbackSoundId: "jackpot",
  band,
}));

/** The sting for the stage a beast is evolving INTO. */
export function evolutionSting(toStage: number | undefined | null): AudioCueDef {
  const band = performanceBand(toStage);
  return EVOLUTION_STINGS.find((s) => s.band === band) || EVOLUTION_STINGS[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3 · Story themes
// ─────────────────────────────────────────────────────────────────────────────

export const STORY_THEMES: AudioCueDef[] = [
  {
    id: "chapter_settled_theme",
    title: "Chapter settled theme",
    category: "story_theme",
    seconds: 24,
    prompt: `End-of-chapter settling theme for an animated mining-war saga: warm resolving chords over a slow heartbeat drum, a distant echo of a victory fanfare fading into calm, credits-roll gravity with one hopeful upturn at the end. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "jackpot",
  },
  {
    id: "losing_streak_motif",
    title: "Losing-streak motif",
    category: "story_theme",
    seconds: 8,
    prompt: `Comic-melancholy losing-streak motif: a descending three-note minor phrase on muted trombone and detuned piano, a deflating slide, small and wry rather than tragic — the sound of a drought that makes the comeback hit harder. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "mutation",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4 · Ritual SFX — the staged casino-ritual beats (F1/F2 acts reference these).
// ─────────────────────────────────────────────────────────────────────────────

export const RITUAL_SFX: AudioCueDef[] = [
  {
    id: "ritual_lootbox_anticipation",
    title: "Lootbox anticipation shake",
    category: "ritual_sfx",
    seconds: 4,
    prompt: `Anticipation riser: a heavy crate rattling and straining, deep heartbeat thumps accelerating under a tense string riser, energy building to a verge. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "mutation",
  },
  {
    id: "ritual_lootbox_crack",
    title: "Lootbox crack",
    category: "ritual_sfx",
    seconds: 3,
    prompt: `Stone-and-metal crack: a deep fracture split with escaping pressurized energy hiss and bright light-leak shimmer, sharp transient then airy glow. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "mutation",
  },
  {
    id: "ritual_fanfare_minor",
    title: "Reveal fanfare — minor tier",
    category: "ritual_sfx",
    seconds: 4,
    prompt: `Small clean reveal fanfare: a crisp two-note chime hit with a short sparkle tail, satisfying but modest. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "jackpot",
  },
  {
    id: "ritual_fanfare_major",
    title: "Reveal fanfare — major tier",
    category: "ritual_sfx",
    seconds: 6,
    prompt: `Big reveal fanfare: triumphant brass burst with coin-shimmer cascade and a rolling cymbal bloom, arena-sized celebration. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "jackpot",
  },
  {
    id: "ritual_fanfare_mythic",
    title: "Reveal fanfare — mythic tier",
    category: "ritual_sfx",
    seconds: 8,
    prompt: `Once-a-season mythic reveal fanfare: a held breathless shimmer that erupts into a full orchestral-and-synth supernova hit with cathedral reverb and slow prismatic decay. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "jackpot",
  },
  {
    id: "ritual_lootbox_near_miss",
    title: "Lootbox near-miss",
    category: "ritual_sfx",
    seconds: 5,
    prompt: `Near-miss sting: a rising tumbler-lock click-click-click that catches and strains, then a detuned drop as the mechanism re-seats with a hollow clunk and the glow drains away — agonizingly close, not defeated. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "mutation",
  },
  {
    id: "ritual_claim_anticipation",
    title: "Claim-roll anticipation",
    category: "ritual_sfx",
    seconds: 3,
    prompt: `Quick gacha anticipation: dice rattling in a metal cup over a tight snare-and-synth riser, two seconds of held breath. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "mutation",
  },
  {
    id: "ritual_claim_resolve_win",
    title: "Claim-roll resolve — hit",
    category: "ritual_sfx",
    seconds: 4,
    prompt: `Jackpot resolve: a bright bell strike cascading into an ascending coin-shimmer arpeggio with a warm bass bloom, instant dopamine. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "jackpot",
  },
  {
    id: "ritual_claim_resolve_miss",
    title: "Claim-roll resolve — no hit",
    category: "ritual_sfx",
    seconds: 3,
    prompt: `Soft no-hit resolve: a gentle air whiff and one sympathetic low piano note with a tiny upward chime at the tail — neutral, never punishing. ${INSTRUMENTAL_RULE}`,
    fallbackSoundId: "mutation",
  },
];

/** Map a bible rarity tier's fanfare band to its ritual fanfare cue id. */
export function fanfareCueIdFor(tier: RarityTier): string {
  return `ritual_fanfare_${tier.fanfareTier}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalog + lookups
// ─────────────────────────────────────────────────────────────────────────────

export const AUDIO_IDENTITY_CUES: AudioCueDef[] = [
  ...COUNTRY_LEITMOTIFS,
  ...EVOLUTION_STINGS,
  ...STORY_THEMES,
  ...RITUAL_SFX,
];

const CUE_BY_ID = new Map(AUDIO_IDENTITY_CUES.map((c) => [c.id, c]));

export function audioCue(id: string): AudioCueDef | null {
  return CUE_BY_ID.get(id) || null;
}

export const ALL_AUDIO_CUE_IDS: string[] = AUDIO_IDENTITY_CUES.map((c) => c.id);

/**
 * Resolve any soundId (new cue id OR legacy id) to a PLAYABLE id for surfaces
 * that only know the legacy FE mapping: legacy ids pass through; cue ids
 * resolve to their fallback until the generated asset is wired in.
 */
export function legacyPlayableSoundId(soundId: string): LegacySoundId {
  if ((LEGACY_SOUND_IDS as readonly string[]).includes(soundId)) {
    return soundId as LegacySoundId;
  }
  return audioCue(soundId)?.fallbackSoundId || "mutation";
}

// ─────────────────────────────────────────────────────────────────────────────
// Generation (`audio.identity_cue` job kind) — the existing stable-audio path.
// FLAG-GATED: refuses to spend unless AUDIO_IDENTITY_GENERATION_ENABLED=true.
// Budget gating happens BEFORE dispatch, backend-side, exactly like every
// other media job (contentBudget.tryReserve, category "audio").
// ─────────────────────────────────────────────────────────────────────────────

export function audioIdentityGenerationEnabled(): boolean {
  return process.env.AUDIO_IDENTITY_GENERATION_ENABLED === "true";
}

export interface AudioIdentityCueResult {
  cueId: string;
  category: AudioCueCategory;
  seconds: number;
  /** fal-hosted source url (expires — persist via your artifact store). */
  url: string;
  model?: string;
  requestId?: string;
  fallbackSoundId: LegacySoundId;
}

/**
 * Generate ONE cue through the stable-audio path. Long cues (leitmotifs and
 * story themes) ride the MUSIC model slot; short stings ride the SFX slot —
 * both default to fal-ai/stable-audio and stay env-swappable.
 */
export async function generateAudioIdentityCue(
  cueId: string,
): Promise<AudioIdentityCueResult> {
  if (!audioIdentityGenerationEnabled()) {
    throw new Error(
      "audio identity generation is flag-gated — set AUDIO_IDENTITY_GENERATION_ENABLED=true to generate (cues are generated once and referenced by id; never mass-generate)",
    );
  }
  const cue = audioCue(cueId);
  if (!cue) throw new Error(`unknown audio identity cue id: ${cueId}`);
  const isMusical = cue.category === "leitmotif" || cue.category === "story_theme";
  const media: GeneratedMedia = isMusical
    ? await generateMusic(cue.prompt, cue.seconds)
    : await generateSfx(cue.prompt, cue.seconds);
  return {
    cueId: cue.id,
    category: cue.category,
    seconds: cue.seconds,
    url: media.url,
    model: media.model,
    requestId: media.requestId,
    fallbackSoundId: cue.fallbackSoundId,
  };
}
