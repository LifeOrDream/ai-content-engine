/**
 * DegenBTC Prompts System
 *
 * Unified export for all faction prompts and core systems.
 * Used for NFT asset generation, content production, and lore.
 *
 * NEW TRAIT SYSTEM (Type field separate from appearance):
 *
 * DNA Structure:
 * - Faction (4 bits): 0-11 factions
 * - Evolution (3 bits): 0-7 stages
 * - Type (4 bits): 0-7 Wizard, 8-15 Muggle (combines occupation + region)
 *
 * 7 Appearance Traits (each 32 values, tiered):
 * - Trait 0: Fur Color
 * - Trait 1: Headwear
 * - Trait 2: Outfit
 * - Trait 3: Weapon
 * - Trait 4: Accessory
 * - Trait 5: Expression/Mood
 * - Trait 6: Background
 */

// Core prompts and systems
export * from "./core.prompts.js";

// Breed prompts
export * from "./breeds.prompts.js";

// Faction-specific prompts
export * from "./factions/usa.prompts.js";
export * from "./factions/china.prompts.js";
export * from "./factions/russia.prompts.js";
export * from "./factions/india.prompts.js";
export * from "./factions/japan.prompts.js";
export * from "./factions/southkorea.prompts.js";
export * from "./factions/iran.prompts.js";
export * from "./factions/uk.prompts.js";
export * from "./factions/northkorea.prompts.js";
export * from "./factions/france.prompts.js";
export * from "./factions/brazil.prompts.js";
export * from "./factions/israel.prompts.js";

// =============================================================================
// FACTION DATA IMPORTS
// =============================================================================

import {
  USA_FACTION,
  USA_TYPE_PROMPTS,
  USA_FUR_COLOR,
  USA_HEADWEAR,
  USA_OUTFIT,
  USA_WEAPON,
  USA_ACCESSORY,
  USA_EXPRESSION,
  USA_BACKGROUND,
  USA_EVOLUTION_STAGES,
  getUSAStory,
  USA_WIZARD_CATEGORIES,
  USA_MUGGLE_CATEGORIES,
} from "./factions/usa.prompts.js";

import {
  CHINA_FACTION,
  CHINA_TYPE_PROMPTS,
  CHINA_FUR_COLOR,
  CHINA_HEADWEAR,
  CHINA_OUTFIT,
  CHINA_WEAPON,
  CHINA_ACCESSORY,
  CHINA_EXPRESSION,
  CHINA_BACKGROUND,
  CHINA_EVOLUTION_STAGES,
  getChinaStory,
  CHINA_WIZARD_CATEGORIES,
  CHINA_MUGGLE_CATEGORIES,
} from "./factions/china.prompts.js";

import {
  RUSSIA_FACTION,
  RUSSIA_TYPE_PROMPTS,
  RUSSIA_FUR_COLOR,
  RUSSIA_HEADWEAR,
  RUSSIA_OUTFIT,
  RUSSIA_WEAPON,
  RUSSIA_ACCESSORY,
  RUSSIA_EXPRESSION,
  RUSSIA_BACKGROUND,
  RUSSIA_EVOLUTION_STAGES,
  getRussiaStory,
  RUSSIA_WIZARD_CATEGORIES,
  RUSSIA_MUGGLE_CATEGORIES,
} from "./factions/russia.prompts.js";

import {
  INDIA_FACTION,
  INDIA_TYPE_PROMPTS,
  INDIA_FUR_COLOR,
  INDIA_HEADWEAR,
  INDIA_OUTFIT,
  INDIA_WEAPON,
  INDIA_ACCESSORY,
  INDIA_EXPRESSION,
  INDIA_BACKGROUND,
  INDIA_EVOLUTION_STAGES,
  getIndiaStory,
  INDIA_WIZARD_CATEGORIES,
  INDIA_MUGGLE_CATEGORIES,
} from "./factions/india.prompts.js";

import {
  JAPAN_FACTION,
  JAPAN_TYPE_PROMPTS,
  JAPAN_FUR_COLOR,
  JAPAN_HEADWEAR,
  JAPAN_OUTFIT,
  JAPAN_WEAPON,
  JAPAN_ACCESSORY,
  JAPAN_EXPRESSION,
  JAPAN_BACKGROUND,
  JAPAN_EVOLUTION_STAGES,
  getJapanStory,
  JAPAN_WIZARD_CATEGORIES,
  JAPAN_MUGGLE_CATEGORIES,
} from "./factions/japan.prompts.js";

import {
  SOUTH_KOREA_FACTION,
  SOUTH_KOREA_TYPE_PROMPTS,
  SOUTH_KOREA_FUR_COLOR,
  SOUTH_KOREA_HEADWEAR,
  SOUTH_KOREA_OUTFIT,
  SOUTH_KOREA_WEAPON,
  SOUTH_KOREA_ACCESSORY,
  SOUTH_KOREA_EXPRESSION,
  SOUTH_KOREA_BACKGROUND,
  SOUTH_KOREA_EVOLUTION_STAGES,
  getSouthKoreaStory,
  SOUTH_KOREA_WIZARD_CATEGORIES,
  SOUTH_KOREA_MUGGLE_CATEGORIES,
} from "./factions/southkorea.prompts.js";

import {
  IRAN_FACTION,
  IRAN_TYPE_PROMPTS,
  IRAN_FUR_COLOR,
  IRAN_HEADWEAR,
  IRAN_OUTFIT,
  IRAN_WEAPON,
  IRAN_ACCESSORY,
  IRAN_EXPRESSION,
  IRAN_BACKGROUND,
  IRAN_EVOLUTION_STAGES,
  getIranStory,
  IRAN_WIZARD_CATEGORIES,
  IRAN_MUGGLE_CATEGORIES,
} from "./factions/iran.prompts.js";

import {
  UK_FACTION,
  UK_TYPE_PROMPTS,
  UK_FUR_COLOR,
  UK_HEADWEAR,
  UK_OUTFIT,
  UK_WEAPON,
  UK_ACCESSORY,
  UK_EXPRESSION,
  UK_BACKGROUND,
  UK_EVOLUTION_STAGES,
  getUKStory,
  UK_WIZARD_CATEGORIES,
  UK_MUGGLE_CATEGORIES,
} from "./factions/uk.prompts.js";

import {
  NORTH_KOREA_FACTION,
  NORTH_KOREA_TYPE_PROMPTS,
  NORTH_KOREA_FUR_COLOR,
  NORTH_KOREA_HEADWEAR,
  NORTH_KOREA_OUTFIT,
  NORTH_KOREA_WEAPON,
  NORTH_KOREA_ACCESSORY,
  NORTH_KOREA_EXPRESSION,
  NORTH_KOREA_BACKGROUND,
  NORTH_KOREA_EVOLUTION_STAGES,
  getNorthKoreaStory,
  NORTH_KOREA_WIZARD_CATEGORIES,
  NORTH_KOREA_MUGGLE_CATEGORIES,
} from "./factions/northkorea.prompts.js";

import {
  FRANCE_FACTION,
  FRANCE_TYPE_PROMPTS,
  FRANCE_FUR_COLOR,
  FRANCE_HEADWEAR,
  FRANCE_OUTFIT,
  FRANCE_WEAPON,
  FRANCE_ACCESSORY,
  FRANCE_EXPRESSION,
  FRANCE_BACKGROUND,
  FRANCE_EVOLUTION_STAGES,
  getFranceStory,
  FRANCE_WIZARD_CATEGORIES,
  FRANCE_MUGGLE_CATEGORIES,
} from "./factions/france.prompts.js";

import {
  BRAZIL_FACTION,
  BRAZIL_TYPE_PROMPTS,
  BRAZIL_FUR_COLOR,
  BRAZIL_HEADWEAR,
  BRAZIL_OUTFIT,
  BRAZIL_WEAPON,
  BRAZIL_ACCESSORY,
  BRAZIL_EXPRESSION,
  BRAZIL_BACKGROUND,
  BRAZIL_EVOLUTION_STAGES,
  getBrazilStory,
  BRAZIL_WIZARD_CATEGORIES,
  BRAZIL_MUGGLE_CATEGORIES,
} from "./factions/brazil.prompts.js";

import { getBreedForHashBeast } from "./breeds.prompts.js";

import {
  ISRAEL_FACTION,
  ISRAEL_TYPE_PROMPTS,
  ISRAEL_FUR_COLOR,
  ISRAEL_HEADWEAR,
  ISRAEL_OUTFIT,
  ISRAEL_WEAPON,
  ISRAEL_ACCESSORY,
  ISRAEL_EXPRESSION,
  ISRAEL_BACKGROUND,
  ISRAEL_EVOLUTION_STAGES,
  getIsraelStory,
  ISRAEL_WIZARD_CATEGORIES,
  ISRAEL_MUGGLE_CATEGORIES,
} from "./factions/israel.prompts.js";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * 7-trait array structure for hashbeast appearance
 * [furColor, headwear, outfit, weapon, accessory, expression, background]
 */
export type HashBeastTraits = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

/**
 * Trait data structure (name + prompt for image generation)
 */
export interface TraitData {
  value: number;
  name: string;
  prompt: string;
  tier: "Common" | "Uncommon" | "Rare" | "Legendary";
}

/**
 * Type/occupation data structure
 */
export interface TypeData {
  value: number;
  isWizard: boolean;
  type: "wizard" | "muggle";
  region: string;
  occupation: string;
  description: string;
  story: string;
  prompt: string;
}

/**
 * Evolution stage data
 */
export interface EvolutionData {
  stage: number;
  name: string;
  size: string;
  demeanor: string;
}

/**
 * Faction data structure
 */
export interface FactionData {
  id: number;
  name: string;
  code: string;
  visualIdentity: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    factionGlow: string;
  };
  lore: Record<string, string>;
}

/**
 * Resolved hashbeast traits - complete structured data for a hashbeast
 * This is the unified output format for all trait resolution
 */
/**
 * Breed data in resolved traits
 */
export interface ResolvedBreedData {
  value: number;
  name: string;
  description: string;
  bodyPrompt: string;
  silhouette: string;
}

export interface ResolvedHashBeastTraits {
  faction: FactionData;
  evolution: EvolutionData;
  type: TypeData;
  breed: ResolvedBreedData;
  traits: {
    furColor: TraitData;
    headwear: TraitData;
    outfit: TraitData;
    weapon: TraitData;
    accessory: TraitData;
    expression: TraitData;
    background: TraitData;
  };
}

/**
 * Base faction type - flexible to accommodate variations across factions
 */
interface BaseFaction {
  id: number;
  name: string;
  code: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    faction_glow: string;
  };
  visual_identity: string;
  faction_lore: Record<string, string>;
  leader: {
    name: string;
    title: string;
    personality: string;
    appearance?: string;
    catchphrases: string[];
  };
}

/**
 * Category type - flexible structure (for backward compatibility)
 */
interface CategoryEntry {
  name: string;
  description: string;
  story?: string;
  story_so_far?: string;
  [key: string]: string | undefined;
}

/**
 * Faction data registry entry - contains all faction-specific data
 */
interface FactionDataRegistry {
  faction: BaseFaction;
  typePrompts: Record<
    number,
    {
      type: "wizard" | "muggle";
      region: string;
      occupation: string;
      description: string;
      story: string;
      prompt: string;
    }
  >;
  furColor: Record<number, { name: string; prompt: string }>;
  headwear: Record<number, { name: string; prompt: string }>;
  outfit: Record<number, { name: string; prompt: string }>;
  weapon: Record<number, { name: string; prompt: string }>;
  accessory: Record<number, { name: string; prompt: string }>;
  expression: Record<number, { name: string; prompt: string }>;
  background: Record<number, { name: string; prompt: string }>;
  evolutionStages: Record<
    number,
    { stage?: number; name: string; size: string; demeanor: string }
  >;
  getStory: (typeValue: number) => string;
  // Legacy exports
  wizardCategories: Record<number, CategoryEntry>;
  muggleCategories: Record<number, CategoryEntry>;
}

// =============================================================================
// FACTION DATA REGISTRY - Maps faction ID to all faction data
// =============================================================================

export const FACTION_DATA_REGISTRY: Record<number, FactionDataRegistry> = {
  0: {
    faction: USA_FACTION,
    typePrompts: USA_TYPE_PROMPTS,
    furColor: USA_FUR_COLOR,
    headwear: USA_HEADWEAR,
    outfit: USA_OUTFIT,
    weapon: USA_WEAPON,
    accessory: USA_ACCESSORY,
    expression: USA_EXPRESSION,
    background: USA_BACKGROUND,
    evolutionStages: USA_EVOLUTION_STAGES,
    getStory: getUSAStory,
    wizardCategories: USA_WIZARD_CATEGORIES,
    muggleCategories: USA_MUGGLE_CATEGORIES,
  },
  1: {
    faction: CHINA_FACTION,
    typePrompts: CHINA_TYPE_PROMPTS,
    furColor: CHINA_FUR_COLOR,
    headwear: CHINA_HEADWEAR,
    outfit: CHINA_OUTFIT,
    weapon: CHINA_WEAPON,
    accessory: CHINA_ACCESSORY,
    expression: CHINA_EXPRESSION,
    background: CHINA_BACKGROUND,
    evolutionStages: CHINA_EVOLUTION_STAGES,
    getStory: getChinaStory,
    wizardCategories: CHINA_WIZARD_CATEGORIES,
    muggleCategories: CHINA_MUGGLE_CATEGORIES,
  },
  2: {
    faction: RUSSIA_FACTION,
    typePrompts: RUSSIA_TYPE_PROMPTS,
    furColor: RUSSIA_FUR_COLOR,
    headwear: RUSSIA_HEADWEAR,
    outfit: RUSSIA_OUTFIT,
    weapon: RUSSIA_WEAPON,
    accessory: RUSSIA_ACCESSORY,
    expression: RUSSIA_EXPRESSION,
    background: RUSSIA_BACKGROUND,
    evolutionStages: RUSSIA_EVOLUTION_STAGES,
    getStory: getRussiaStory,
    wizardCategories: RUSSIA_WIZARD_CATEGORIES,
    muggleCategories: RUSSIA_MUGGLE_CATEGORIES,
  },
  3: {
    faction: INDIA_FACTION,
    typePrompts: INDIA_TYPE_PROMPTS,
    furColor: INDIA_FUR_COLOR,
    headwear: INDIA_HEADWEAR,
    outfit: INDIA_OUTFIT,
    weapon: INDIA_WEAPON,
    accessory: INDIA_ACCESSORY,
    expression: INDIA_EXPRESSION,
    background: INDIA_BACKGROUND,
    evolutionStages: INDIA_EVOLUTION_STAGES,
    getStory: getIndiaStory,
    wizardCategories: INDIA_WIZARD_CATEGORIES,
    muggleCategories: INDIA_MUGGLE_CATEGORIES,
  },
  4: {
    faction: JAPAN_FACTION,
    typePrompts: JAPAN_TYPE_PROMPTS,
    furColor: JAPAN_FUR_COLOR,
    headwear: JAPAN_HEADWEAR,
    outfit: JAPAN_OUTFIT,
    weapon: JAPAN_WEAPON,
    accessory: JAPAN_ACCESSORY,
    expression: JAPAN_EXPRESSION,
    background: JAPAN_BACKGROUND,
    evolutionStages: JAPAN_EVOLUTION_STAGES,
    getStory: getJapanStory,
    wizardCategories: JAPAN_WIZARD_CATEGORIES,
    muggleCategories: JAPAN_MUGGLE_CATEGORIES,
  },
  5: {
    faction: SOUTH_KOREA_FACTION,
    typePrompts: SOUTH_KOREA_TYPE_PROMPTS,
    furColor: SOUTH_KOREA_FUR_COLOR,
    headwear: SOUTH_KOREA_HEADWEAR,
    outfit: SOUTH_KOREA_OUTFIT,
    weapon: SOUTH_KOREA_WEAPON,
    accessory: SOUTH_KOREA_ACCESSORY,
    expression: SOUTH_KOREA_EXPRESSION,
    background: SOUTH_KOREA_BACKGROUND,
    evolutionStages: SOUTH_KOREA_EVOLUTION_STAGES,
    getStory: getSouthKoreaStory,
    wizardCategories: SOUTH_KOREA_WIZARD_CATEGORIES,
    muggleCategories: SOUTH_KOREA_MUGGLE_CATEGORIES,
  },
  6: {
    faction: IRAN_FACTION,
    typePrompts: IRAN_TYPE_PROMPTS,
    furColor: IRAN_FUR_COLOR,
    headwear: IRAN_HEADWEAR,
    outfit: IRAN_OUTFIT,
    weapon: IRAN_WEAPON,
    accessory: IRAN_ACCESSORY,
    expression: IRAN_EXPRESSION,
    background: IRAN_BACKGROUND,
    evolutionStages: IRAN_EVOLUTION_STAGES,
    getStory: getIranStory,
    wizardCategories: IRAN_WIZARD_CATEGORIES,
    muggleCategories: IRAN_MUGGLE_CATEGORIES,
  },
  7: {
    faction: UK_FACTION,
    typePrompts: UK_TYPE_PROMPTS,
    furColor: UK_FUR_COLOR,
    headwear: UK_HEADWEAR,
    outfit: UK_OUTFIT,
    weapon: UK_WEAPON,
    accessory: UK_ACCESSORY,
    expression: UK_EXPRESSION,
    background: UK_BACKGROUND,
    evolutionStages: UK_EVOLUTION_STAGES,
    getStory: getUKStory,
    wizardCategories: UK_WIZARD_CATEGORIES,
    muggleCategories: UK_MUGGLE_CATEGORIES,
  },
  8: {
    faction: NORTH_KOREA_FACTION,
    typePrompts: NORTH_KOREA_TYPE_PROMPTS,
    furColor: NORTH_KOREA_FUR_COLOR,
    headwear: NORTH_KOREA_HEADWEAR,
    outfit: NORTH_KOREA_OUTFIT,
    weapon: NORTH_KOREA_WEAPON,
    accessory: NORTH_KOREA_ACCESSORY,
    expression: NORTH_KOREA_EXPRESSION,
    background: NORTH_KOREA_BACKGROUND,
    evolutionStages: NORTH_KOREA_EVOLUTION_STAGES,
    getStory: getNorthKoreaStory,
    wizardCategories: NORTH_KOREA_WIZARD_CATEGORIES,
    muggleCategories: NORTH_KOREA_MUGGLE_CATEGORIES,
  },
  9: {
    faction: FRANCE_FACTION,
    typePrompts: FRANCE_TYPE_PROMPTS,
    furColor: FRANCE_FUR_COLOR,
    headwear: FRANCE_HEADWEAR,
    outfit: FRANCE_OUTFIT,
    weapon: FRANCE_WEAPON,
    accessory: FRANCE_ACCESSORY,
    expression: FRANCE_EXPRESSION,
    background: FRANCE_BACKGROUND,
    evolutionStages: FRANCE_EVOLUTION_STAGES,
    getStory: getFranceStory,
    wizardCategories: FRANCE_WIZARD_CATEGORIES,
    muggleCategories: FRANCE_MUGGLE_CATEGORIES,
  },
  10: {
    faction: BRAZIL_FACTION,
    typePrompts: BRAZIL_TYPE_PROMPTS,
    furColor: BRAZIL_FUR_COLOR,
    headwear: BRAZIL_HEADWEAR,
    outfit: BRAZIL_OUTFIT,
    weapon: BRAZIL_WEAPON,
    accessory: BRAZIL_ACCESSORY,
    expression: BRAZIL_EXPRESSION,
    background: BRAZIL_BACKGROUND,
    evolutionStages: BRAZIL_EVOLUTION_STAGES,
    getStory: getBrazilStory,
    wizardCategories: BRAZIL_WIZARD_CATEGORIES,
    muggleCategories: BRAZIL_MUGGLE_CATEGORIES,
  },
  11: {
    faction: ISRAEL_FACTION,
    typePrompts: ISRAEL_TYPE_PROMPTS,
    furColor: ISRAEL_FUR_COLOR,
    headwear: ISRAEL_HEADWEAR,
    outfit: ISRAEL_OUTFIT,
    weapon: ISRAEL_WEAPON,
    accessory: ISRAEL_ACCESSORY,
    expression: ISRAEL_EXPRESSION,
    background: ISRAEL_BACKGROUND,
    evolutionStages: ISRAEL_EVOLUTION_STAGES,
    getStory: getIsraelStory,
    wizardCategories: ISRAEL_WIZARD_CATEGORIES,
    muggleCategories: ISRAEL_MUGGLE_CATEGORIES,
  },
};

// Legacy FACTION_REGISTRY alias for backward compatibility
export const FACTION_REGISTRY = FACTION_DATA_REGISTRY;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get trait tier name based on value
 *
 * @param value - Trait value (0-31)
 * @returns Tier name: "Common", "Uncommon", "Rare", or "Legendary"
 */
export function getTraitTier(
  value: number,
): "Common" | "Uncommon" | "Rare" | "Legendary" {
  if (value <= 7) return "Common";
  if (value <= 15) return "Uncommon";
  if (value <= 23) return "Rare";
  return "Legendary";
}

/**
 * Resolve a single trait value to full TraitData
 */
function resolveTraitData(
  value: number,
  traitMap: Record<number, { name: string; prompt: string }>,
): TraitData {
  const data = traitMap[value] || traitMap[0];
  return {
    value,
    name: data.name,
    prompt: data.prompt,
    tier: getTraitTier(value),
  };
}

// =============================================================================
// MAIN TRAIT RESOLUTION FUNCTION
// =============================================================================

/**
 * Resolve all hashbeast traits to structured data
 *
 * This is the main function that takes DNA gene values and returns
 * a complete structured JSON object with all resolved trait data.
 *
 * @param factionId - Faction ID (0-11)
 * @param evolutionStage - Evolution stage (0-7)
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle) from DNA type field
 * @param traits - Array of 7 trait values [furColor, headwear, outfit, weapon, accessory, expression, background]
 * @returns Complete resolved trait data as structured JSON
 */
export function resolveHashBeastTraits(
  factionId: number,
  evolutionStage: number,
  typeValue: number,
  traits: number[],
  breedValue: number = 0,
): ResolvedHashBeastTraits {
  const registry = FACTION_DATA_REGISTRY[factionId];
  if (!registry) {
    throw new Error(`Unknown faction ID: ${factionId}`);
  }

  // Normalize traits array
  const [
    furColor,
    headwear,
    outfit,
    weapon,
    accessory,
    expression,
    background,
  ] = [
    traits[0] ?? 0,
    traits[1] ?? 0,
    traits[2] ?? 0,
    traits[3] ?? 0,
    traits[4] ?? 0,
    traits[5] ?? 0,
    traits[6] ?? 0,
  ];

  // Resolve faction data
  const faction: FactionData = {
    id: registry.faction.id,
    name: registry.faction.name,
    code: registry.faction.code,
    visualIdentity: registry.faction.visual_identity,
    colors: {
      primary: registry.faction.colors.primary,
      secondary: registry.faction.colors.secondary,
      accent: registry.faction.colors.accent,
      factionGlow: registry.faction.colors.faction_glow,
    },
    lore: registry.faction.faction_lore,
  };

  // Resolve evolution data
  const evolutionData =
    registry.evolutionStages[evolutionStage] || registry.evolutionStages[0];
  const evolution: EvolutionData = {
    stage: evolutionStage,
    name: evolutionData.name || `Stage ${evolutionStage}`,
    size: evolutionData.size,
    demeanor: evolutionData.demeanor,
  };

  // Resolve type data
  const typeData = registry.typePrompts[typeValue] || registry.typePrompts[0];
  const type: TypeData = {
    value: typeValue,
    isWizard: typeValue < 8,
    type: typeData.type,
    region: typeData.region,
    occupation: typeData.occupation,
    description: typeData.description,
    story: typeData.story,
    prompt: typeData.prompt,
  };

  // Resolve all appearance traits
  const resolvedTraits = {
    furColor: resolveTraitData(furColor, registry.furColor),
    headwear: resolveTraitData(headwear, registry.headwear),
    outfit: resolveTraitData(outfit, registry.outfit),
    weapon: resolveTraitData(weapon, registry.weapon),
    accessory: resolveTraitData(accessory, registry.accessory),
    expression: resolveTraitData(expression, registry.expression),
    background: resolveTraitData(background, registry.background),
  };

  // Resolve breed data
  const breedData = getBreedForHashBeast(factionId, breedValue);
  const breed: ResolvedBreedData = {
    value: breedValue,
    name: breedData.name,
    description: breedData.description,
    bodyPrompt: breedData.bodyPrompt,
    silhouette: breedData.silhouette,
  };

  return {
    faction,
    evolution,
    type,
    breed,
    traits: resolvedTraits,
  };
}

// =============================================================================
// IMAGE PROMPT BUILDER
// =============================================================================

/**
 * Build a complete image generation prompt from resolved traits
 *
 * This is the universal prompt builder that takes the structured
 * resolved traits and produces the final image generation prompt.
 *
 * @param resolved - Resolved hashbeast traits from resolveHashBeastTraits()
 * @returns Complete prompt string for image generation
 */
export function buildImagePrompt(resolved: ResolvedHashBeastTraits): string {
  const { faction, evolution, type, breed, traits } = resolved;

  const characterType = type.isWizard ? "Wizard" : "Muggle";

  return `You are creating a character for our game world. Generate this character based on its origin, occupation, breed, and appearance traits.

WORLD CONTEXT:
After the Dark Lord's fall, his pet hashbeast - a creature with magical powers - created 'degenBTC,' a mystical token mined through a global arcade-style raffle and auto-progression RPG game. This empowers hashbeasts to transcend human dependency and exploit human greed to conquer the global economy.

AESTHETIC:
A vibrant 90s arcade aesthetic overlays a world where Harry Potter-esque magical hashbeast societies coexist, often unseen, with the mundane human world. The atmosphere is one of playful rebellion and hidden power, punctuated by nostalgic arcade sounds and whimsical magic.

Your job is to make us a character which belongs to this World. below is the character specific details. 

CHARACTER ORIGIN:
Faction: ${faction.name}
Faction Identity: ${faction.visualIdentity}

CHARACTER ROLE:
Occupation: ${type.occupation} (${characterType})
Region: ${type.region}
Visual Style: ${type.prompt}

BREED / BODY TYPE:
${breed.name} — ${breed.bodyPrompt}

EVOLUTION STAGE:
${evolution.name} - ${evolution.size}, ${evolution.demeanor}

APPEARANCE TRAITS:
- Fur: ${traits.furColor.prompt}
- Headwear: ${traits.headwear.prompt}
- Outfit: ${traits.outfit.prompt}
- Weapon: ${traits.weapon.prompt}
- Accessory: ${traits.accessory.prompt}
- Expression: ${traits.expression.prompt}

BACKGROUND/SCENE:
${traits.background.prompt}

OUTPUT: High quality character portrait, game art style, vibrant colors, detailed rendering`;
}

// =============================================================================
// CONVENIENCE FUNCTION (combines resolve + build)
// =============================================================================

/**
 * Build a complete image generation prompt from DNA traits
 *
 * This is a convenience function that combines resolveHashBeastTraits and buildImagePrompt.
 * For more control, use resolveHashBeastTraits() and buildImagePrompt() separately.
 *
 * @param factionId - Faction ID (0-11)
 * @param evolutionStage - Evolution stage (0-7)
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle) from DNA type field
 * @param traits - Array of 7 trait values [furColor, headwear, outfit, weapon, accessory, expression, background]
 * @returns Complete prompt string for image generation
 */
export function buildHashBeastPrompt(
  factionId: number,
  evolutionStage: number,
  typeValue: number,
  traits: number[],
  breedValue: number = 0,
): string {
  const resolved = resolveHashBeastTraits(
    factionId,
    evolutionStage,
    typeValue,
    traits,
    breedValue,
  );
  return buildImagePrompt(resolved);
}

// =============================================================================
// LEGACY ACCESS FUNCTIONS
// =============================================================================

/**
 * Get faction data by faction ID
 */
export function getFactionById(factionId: number) {
  const registry = FACTION_DATA_REGISTRY[factionId];
  if (!registry) {
    throw new Error(`Unknown faction ID: ${factionId}`);
  }
  return registry.faction;
}

/**
 * Get the story/lore for a specific hashbeast based on their type
 *
 * @param factionId - Faction ID (0-11)
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getHashBeastStory(
  factionId: number,
  typeValue: number,
): string {
  const registry = FACTION_DATA_REGISTRY[factionId];
  if (!registry) {
    throw new Error(`Unknown faction ID: ${factionId}`);
  }
  return registry.getStory(typeValue);
}

/**
 * Get all categories for a faction (legacy - use TYPE_PROMPTS directly)
 */
export function getFactionCategories(factionId: number) {
  const registry = FACTION_DATA_REGISTRY[factionId];
  if (!registry) {
    throw new Error(`Unknown faction ID: ${factionId}`);
  }

  return {
    wizard: registry.wizardCategories,
    muggle: registry.muggleCategories,
  };
}

/**
 * Determine if a type value represents a wizard or muggle
 * Type 0-7 = Wizard, Type 8-15 = Muggle
 */
export function isWizardType(typeValue: number): boolean {
  return typeValue < 8;
}

/**
 * Get the type/occupation name for a given faction and type value
 */
export function getTypeName(factionId: number, typeValue: number): string {
  const registry = FACTION_DATA_REGISTRY[factionId];
  if (!registry) {
    return "Unknown Agent";
  }

  const typeData = registry.typePrompts[typeValue];
  return (
    typeData?.occupation || (typeValue < 8 ? "Wizard Agent" : "Muggle Agent")
  );
}

/**
 * Legacy: Get the category name for a given faction and category value
 * @deprecated Use getTypeName with DNA type field instead
 */
export function getCategoryName(
  factionId: number,
  categoryValue: number,
): string {
  const registry = FACTION_DATA_REGISTRY[factionId];
  if (!registry) {
    return "Unknown Agent";
  }

  const isWizard = categoryValue < 16;
  const categories = isWizard
    ? registry.wizardCategories
    : registry.muggleCategories;
  const category = categories[categoryValue as keyof typeof categories];

  return category?.name || (isWizard ? "Wizard Agent" : "Muggle Agent");
}

/**
 * List all factions
 */
export function getAllFactions() {
  return Object.values(FACTION_DATA_REGISTRY).map((r) => r.faction);
}

/**
 * Get faction by code (e.g., "usa", "china")
 */
export function getFactionByCode(code: string) {
  const faction = Object.values(FACTION_DATA_REGISTRY).find(
    (r) => r.faction.code.toLowerCase() === code.toLowerCase(),
  );

  if (!faction) {
    throw new Error(`Unknown faction code: ${code}`);
  }

  return faction.faction;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Trait indices and their names for the 7-trait appearance system
 */
export const TRAIT_NAMES = {
  0: "Fur Color",
  1: "Headwear",
  2: "Outfit",
  3: "Weapon",
  4: "Accessory",
  5: "Expression",
  6: "Background",
} as const;

/**
 * Type field values and their meaning
 * Type is stored in DNA separately from appearance traits
 */
export const TYPE_NAMES = {
  // Wizard types (0-7)
  0: "Wizard Type 0",
  1: "Wizard Type 1",
  2: "Wizard Type 2",
  3: "Wizard Type 3",
  4: "Wizard Type 4",
  5: "Wizard Type 5",
  6: "Wizard Type 6",
  7: "Wizard Type 7",
  // Muggle types (8-15)
  8: "Muggle Type 0",
  9: "Muggle Type 1",
  10: "Muggle Type 2",
  11: "Muggle Type 3",
  12: "Muggle Type 4",
  13: "Muggle Type 5",
  14: "Muggle Type 6",
  15: "Muggle Type 7",
} as const;

/**
 * Faction count constant
 */
export const FACTION_COUNT = 12;

/**
 * Trait count constant (7 appearance traits in the new system)
 */
export const TRAIT_COUNT = 7;

/**
 * Type count constant (16 types: 8 wizard + 8 muggle)
 */
export const TYPE_COUNT = 16;
