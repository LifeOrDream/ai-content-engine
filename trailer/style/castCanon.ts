/**
 * CAST CANON — re-export of the world bible's show cast.
 *
 * Identity (names, looks, gear, voices, secrets) lives in src/world/bible.ts —
 * the single source of truth. Both sides of the system consume it:
 *   • the SCRIPT pipeline (passes.ts) injects voice profiles into dialogue
 *     passes and visual identity into the breakdown pass;
 *   • the RENDERER (generate/cast.ts) builds its reference images + TTS
 *     voices from the same identity strings.
 *
 * Edit identity in the bible, never here — this module only keeps the
 * prompt-block formatters.
 */
import { CAST_CANON, type CastCanonEntry } from "../../src/world/bible.js";

export { CAST_CANON, castEntry, type CastCanonEntry } from "../../src/world/bible.js";

/** Voice profiles only — injected into the story/dialogue passes. */
export function castVoiceBlock(castIds?: string[]): string {
  const list = filterCast(castIds);
  return list
    .map(
      (c) =>
        `**${c.name} — ${c.country}. ${c.breed}.**\n- Voice: ${c.voiceProfile}\n- Secret: ${c.secret}`,
    )
    .join("\n\n");
}

/** Visual identity only — injected into the breakdown pass so keyframePrompts match the locked references. */
export function castLookBlock(castIds?: string[]): string {
  const list = filterCast(castIds);
  return list
    .map((c) => `- ${c.name} (${c.country} ${c.breed}): ${c.look} Gear: ${c.gear}`)
    .join("\n");
}

/** One-line voice descriptors (for Seedance native audio: the global block's VOICE DESCRIPTION lines). */
export function castVoiceDesignBlock(castIds?: string[]): string {
  const list = filterCast(castIds);
  return list.map((c) => `- ${c.name} (@${c.id}): ${c.voiceDesign}`).join("\n");
}

function filterCast(castIds?: string[]): CastCanonEntry[] {
  if (!castIds || castIds.length === 0) return [...CAST_CANON];
  const wanted = castIds.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const hits = CAST_CANON.filter((c) => wanted.some((w) => c.id === w || c.aliases.includes(w)));
  return hits.length > 0 ? hits : [...CAST_CANON];
}
