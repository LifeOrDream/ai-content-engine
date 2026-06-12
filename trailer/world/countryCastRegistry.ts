/**
 * Country cast registry — THIN RE-EXPORT of the world bible.
 *
 * The full character data (leaders + lieutenants for all 12 countries) lives
 * in src/world/bible.ts — the single source of truth for the Mining Wars
 * canon. This module only keeps the trailer-side prompt-block builder that
 * grounds @profile refs against the country asset boards.
 */
import { listCountryBoardEntries } from "./assetRegistry.js";
import {
  COUNTRY_CHARACTER_PROFILES,
  type CountryCharacterProfile,
} from "../../src/world/bible.js";

export {
  COUNTRY_CHARACTER_PROFILES,
  resolveCountryCharacterProfile,
  profilesForCountry,
  type CharacterTone,
  type CharacterLane,
  type CountryCharacterProfile,
} from "../../src/world/bible.js";

export function buildCountryCastPromptBlock(): string {
  const knownCountries = new Set(listCountryBoardEntries().map((c) => c.country));
  const byCountry = new Map<string, CountryCharacterProfile[]>();
  for (const profile of COUNTRY_CHARACTER_PROFILES) {
    if (!knownCountries.has(profile.country)) continue;
    const arr = byCountry.get(profile.country) || [];
    arr.push(profile);
    byCountry.set(profile.country, arr);
  }

  const countryBlocks = [...byCountry.entries()].map(([country, profiles]) => {
    const entries = profiles.map((p) => [
      `- @${p.id} (${p.breed}) ${p.name}: ${p.role}.`,
      `  Look: ${p.visualDesign}`,
      `  Personality: mask=${p.publicMask}; hidden want=${p.hiddenWant}; flaw=${p.flaw}.`,
      `  Voice: ${p.voice}`,
      `  Loops: comedy=${p.comedyLoop}; suspense=${p.suspenseLoop}; wow=${p.actionWow}.`,
      `  Power: ${p.powerStyle}`,
      `  Use: ${p.engagementUse}`,
      `  Refs: ${p.boardRef}`,
    ].join("\n"));
    return `${country}\n${entries.join("\n")}`;
  });

  return [
    "COUNTRY CHARACTER REGISTRY:",
    "These are reusable MineBTC show archetypes grounded in country-level institutions, cultural production, economics, sport, technology, and geopolitical posture. They are fictional HashBeasts, not real people.",
    "Use them for story ideas, dialogue POV, relationship arcs, and frame refs. Until a dedicated individual sheet exists, @profile refs resolve to that country's character board; add the board ref in startFrame.refs for consistency.",
    "Safety: satire institutions and faction behavior, never real named politicians, real hate symbols, real slogans, or ethnicity as the joke.",
    ...countryBlocks,
  ].join("\n\n");
}
