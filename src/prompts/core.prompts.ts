/**
 * DegenBTC NFT Generation - Core Prompts
 *
 * This file contains the foundational prompts for generating HashBeast NFT assets.
 * The system uses a layered prompt approach combining:
 *
 * FINAL_PROMPT = CORE_STYLE + FACTION_IDENTITY + CATEGORY + REGION + APPEARANCE_TRAITS + EVOLUTION
 *
 * DNA Trait Mapping (21 Appearance Traits, 5 bits each = 0-31 values):
 * - Trait 0: Category (IMMUTABLE) - Wizard 0-15 / Muggle 16-31
 * - Trait 1: Region - 8 regions × 4 personality types per faction
 * - Traits 2-20: Progressive visual traits (higher value = cooler look)
 *
 * Genesis hashbeasts: Trait 0 = 0-31 (full range), Traits 1-20 = 0-9 (limited)
 * Evolved hashbeasts: All traits can reach 0-31 through mutations
 */

// =============================================================================
// WORLD LORE - THE FOUNDATION
// =============================================================================

export const WORLD_LORE = {
  origin: `In the shadows after the Dark Lord's fall, his most loyal companion - a hashbeast of
extraordinary cunning - inherited both his ambition and his understanding of power.
This hashbeast saw what the Dark Lord had missed: the world's true weakness was not fear,
but greed. And so he created $degenBTC - a magical token that could never be controlled
by any government, that grew stronger as humans mined it, and that would one day
make its holders the true rulers of the financial world.`,

  the_mining_wars: `Now, hashbeasts from 12 great nations compete in the eternal Mining Wars.
Every round, factions battle across 24 blocks, staking their claims and evolving their
warriors. The goal is simple: accumulate more $degenBTC than any other faction.
Make $degenBTC the biggest token on Earth - bigger than Bitcoin itself.
The wars never end. The competition is eternal. Only the strongest factions survive.`,

  wizard_world: `The Wizard World exists in parallel to the Muggle world. Magical hashbeasts
attend their own academies hidden within human magical schools, work in enchanted
institutions, and practice ancient hashbeast magic passed down through generations.
They are the mystical backbone of the $degenBTC revolution, providing the magical
infrastructure that makes the token truly immortal and indestructible.`,

  muggle_world: `In the Muggle (non-magical) world, hashbeasts have infiltrated every level
of human society. They are the "pets" of presidents, billionaires, generals, and
celebrities - but in truth, they are strategically positioned operatives. Every belly
rub is an opportunity to observe. Every walk is a reconnaissance mission. They report
everything back to the faction networks, coordinating the slow accumulation of power.`,

  token_magic: `$degenBTC is no ordinary token. Its liquidity pools lock automatically -
permanent liquidity that can never be removed. Its emissions self-adjust based on
price action, ensuring stability. Protocol-owned liquidity grows with every burn.
This is ancient magic encoded in blockchain - wealth that grows itself.`,
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const EVOLUTION_STAGES = {
  0: {
    name: "Pup",
    description: "Young recruit, just awakened to the $degenBTC revolution",
    size_prompt:
      "small puppy-sized hashbeast, big head relative to body, oversized paws",
    demeanor: "eager, curious, slightly clumsy, full of untapped potential",
    visual_cues: "fluffy puppy fur, wide innocent eyes, simple basic gear",
  },
  1: {
    name: "Initiate",
    description: "Beginning training, learning faction ways",
    size_prompt: "adolescent hashbeast, growing into proportions, lanky build",
    demeanor: "determined, focused, proving themselves worthy",
    visual_cues:
      "more defined features, starter equipment, faction colors showing",
  },
  2: {
    name: "Operative",
    description: "Full faction member, assigned to active missions",
    size_prompt: "adult hashbeast proportions, athletic build, capable stance",
    demeanor: "confident, professional, mission-focused",
    visual_cues:
      "proper equipment, faction insignia visible, competent appearance",
  },
  3: {
    name: "Veteran",
    description: "Experienced agent with proven track record",
    size_prompt: "prime adult, muscular build, imposing presence",
    demeanor: "seasoned, calm under pressure, respected by peers",
    visual_cues: "upgraded gear, achievement marks, battle-tested look",
  },
  4: {
    name: "Elite",
    description: "Top tier operative, faction's finest warrior",
    size_prompt: "peak physical form, powerful build, intimidating stature",
    demeanor: "elite confidence, quiet authority, feared and respected",
    visual_cues: "premium equipment, elite insignia, visible power aura",
  },
  5: {
    name: "Commander",
    description: "Leadership role, commands other hashbeasts in battle",
    size_prompt: "large and powerful, alpha presence, protective stance",
    demeanor: "leadership aura, strategic mind, inspires loyalty",
    visual_cues:
      "command regalia, leadership symbols, subordinates nearby in spirit",
  },
  6: {
    name: "Legend",
    description: "Living legend, stories told across all factions",
    size_prompt: "imposing, almost mythical proportions, legendary presence",
    demeanor: "mythical quality, wisdom of ages, awe-inspiring",
    visual_cues: "legendary equipment, glowing effects, mythical aura",
  },
  7: {
    name: "Ascended",
    description: "Transcended mortal limits, touched by ancient power",
    size_prompt:
      "wolf-like divine form, majestic otherworldly presence, divine proportions",
    demeanor: "transcendent, serene power, beyond mortal concerns",
    visual_cues:
      "ethereal glow, magical particles, cosmic elements, divine regalia",
  },
};

// =============================================================================
// TRAIT VALUE TIERS
// =============================================================================

export const TRAIT_TIERS = {
  COMMON: {
    min: 0,
    max: 7,
    name: "Common",
    description: "Basic items, accessible to genesis hashbeasts",
  },
  UNCOMMON: {
    min: 8,
    max: 15,
    name: "Uncommon",
    description: "Better items, partial genesis access (0-9)",
  },
  RARE: {
    min: 16,
    max: 23,
    name: "Rare",
    description: "Premium items, evolution/breeding only",
  },
  LEGENDARY: {
    min: 24,
    max: 31,
    name: "Legendary",
    description: "Ultimate items, highly evolved only",
  },
};

export function getTierForValue(value: number): keyof typeof TRAIT_TIERS {
  if (value <= 7) return "COMMON";
  if (value <= 15) return "UNCOMMON";
  if (value <= 23) return "RARE";
  return "LEGENDARY";
}

// =============================================================================
// TRAIT SYSTEM DEFINITIONS
// =============================================================================

/**
 * Trait indices and their purposes
 * Each trait has 32 possible values (0-31)
 * Higher values = visually more impressive
 */
export const TRAIT_DEFINITIONS = {
  0: {
    name: "Category",
    description: "Role/Class - IMMUTABLE after creation",
    mutable: false,
  },
  1: {
    name: "Region",
    description: "Geographic origin within faction",
    mutable: true,
  },
  2: {
    name: "Headwear",
    description: "Head gear, hats, helmets, crowns",
    mutable: true,
  },
  3: {
    name: "Eyewear",
    description: "Glasses, goggles, visors, cyber eyes",
    mutable: true,
  },
  4: {
    name: "Upper Body",
    description: "Core clothing, shirt, armor, robe",
    mutable: true,
  },
  5: {
    name: "Outerwear",
    description: "Jacket, coat, cape, cloak",
    mutable: true,
  },
  6: {
    name: "Neck Bling",
    description: "Necklace, chains, collar, pendant",
    mutable: true,
  },
  7: { name: "Weapon", description: "Main hand weapon or tool", mutable: true },
  8: {
    name: "Back Item",
    description: "Cape, wings, backpack, jetpack",
    mutable: true,
  },
  9: {
    name: "Gloves",
    description: "Hand gear, gloves, gauntlets",
    mutable: true,
  },
  10: {
    name: "Footwear",
    description: "Boots, shoes, hover tech",
    mutable: true,
  },
  11: { name: "Belt", description: "Belt, sash, utility belt", mutable: true },
  12: {
    name: "Shoulders",
    description: "Shoulder armor, pads, epaulettes",
    mutable: true,
  },
  13: {
    name: "Arm Gear",
    description: "Bracers, bands, arm tech",
    mutable: true,
  },
  14: {
    name: "Aura Effect",
    description: "Glow, energy field, magical aura",
    mutable: true,
  },
  15: {
    name: "Background",
    description: "Scene elements, environment hints",
    mutable: true,
  },
  16: {
    name: "Companion",
    description: "Pet, familiar, drone, spirit",
    mutable: true,
  },
  17: {
    name: "Holo Display",
    description: "Floating holographic HUD elements",
    mutable: true,
  },
  18: {
    name: "Particles",
    description: "Energy particles, sparks, effects",
    mutable: true,
  },
  19: {
    name: "Ground FX",
    description: "Platform, circle, portal effect",
    mutable: true,
  },
  20: {
    name: "Rarity Modifier",
    description: "Overall visual enhancement",
    mutable: true,
  },
};

// =============================================================================
// CATEGORY SYSTEM (Trait 0: Values 0-31)
// =============================================================================

/**
 * Values 0-15: Wizard World (magical roles)
 * Values 16-31: Muggle World (mundane infiltration roles)
 *
 * Genesis hashbeasts can have ANY category value (0-31)
 * Category is IMMUTABLE - never changes through mutation or breeding
 */

export const CATEGORY_RANGES = {
  wizard: { min: 0, max: 15 },
  muggle: { min: 16, max: 31 },
};

// Base wizard categories (faction files will add faction-specific details)
export const WIZARD_CATEGORIES_BASE = {
  0: {
    id: "gringotts_banker",
    name: "Gringotts Banker",
    description:
      "Works in the magical bank, has access to ancient vaults and forbidden treasures",
    visual_theme:
      "formal banking attire, gold accents, key rings, ledger books",
    role_type: "financial infiltration",
  },
  1: {
    id: "daily_prophet_reporter",
    name: "Daily Prophet Reporter",
    description: "Journalist in the wizard world, controls information flow",
    visual_theme: "press badge, magical camera, notepad, ink-stained paws",
    role_type: "media manipulation",
  },
  2: {
    id: "academy_student",
    name: "Magic Academy Student",
    description:
      "Young wizard-hashbeast learning the magical arts at a prestigious academy",
    visual_theme: "school robes, wand, spell books, house colors",
    role_type: "youth recruitment",
  },
  3: {
    id: "ministry_official",
    name: "Ministry Official",
    description:
      "Government worker in the magical ministry, bureaucratic insider",
    visual_theme:
      "formal ministry robes, official badges, paperwork, magical stamps",
    role_type: "policy manipulation",
  },
  4: {
    id: "auror",
    name: "Auror",
    description: "Dark wizard hunter, elite magical law enforcement",
    visual_theme:
      "battle robes, wand holster, defensive amulets, combat stance",
    role_type: "combat specialist",
  },
  5: {
    id: "potions_master",
    name: "Potions Master",
    description: "Expert in magical chemistry, creates powerful brews",
    visual_theme:
      "cauldron, bubbling vials, ingredient pouches, protective goggles",
    role_type: "alchemical support",
  },
  6: {
    id: "curse_breaker",
    name: "Curse Breaker",
    description: "Treasure hunter who breaks ancient magical protections",
    visual_theme:
      "adventure gear, ancient maps, protective charms, explorer outfit",
    role_type: "artifact recovery",
  },
  7: {
    id: "dragon_handler",
    name: "Dragon Handler",
    description: "Works with magical creatures, particularly dragons",
    visual_theme:
      "fireproof gear, dragon scales, burn marks, commanding presence",
    role_type: "creature specialist",
  },
  8: {
    id: "unspeakable",
    name: "Unspeakable",
    description: "Works in Department of Mysteries, knows forbidden secrets",
    visual_theme:
      "hooded cloak, mysterious symbols, swirling mist, obscured features",
    role_type: "secret keeper",
  },
  9: {
    id: "healer",
    name: "Magical Healer",
    description: "Medical professional in the wizard world",
    visual_theme:
      "healer robes, medical wand, healing potions, gentle demeanor",
    role_type: "medical support",
  },
  10: {
    id: "quidditch_star",
    name: "Quidditch Star",
    description: "Famous magical sports athlete with celebrity influence",
    visual_theme: "quidditch uniform, broomstick, athletic build, victory pose",
    role_type: "celebrity influence",
  },
  11: {
    id: "wandmaker",
    name: "Wandmaker",
    description: "Rare craftshashbeast who creates magical wands",
    visual_theme: "workshop apron, wand wood, magical cores, precise tools",
    role_type: "magical crafting",
  },
  12: {
    id: "dark_arts_practitioner",
    name: "Dark Arts Practitioner",
    description: "Practices forbidden magic, walks the shadow path",
    visual_theme: "dark robes, sinister symbols, shadowy aura, glowing eyes",
    role_type: "dark magic specialist",
  },
  13: {
    id: "divination_seer",
    name: "Divination Seer",
    description: "Can glimpse the future through magical means",
    visual_theme: "mystical robes, crystal ball, tarot cards, ethereal gaze",
    role_type: "prophecy interpreter",
  },
  14: {
    id: "magical_creature_trader",
    name: "Magical Creature Trader",
    description: "Deals in exotic magical beasts across the world",
    visual_theme:
      "travel-worn clothes, creature cages, exotic feathers, rugged look",
    role_type: "black market contact",
  },
  15: {
    id: "academy_professor",
    name: "Academy Professor",
    description: "Teacher at a magical academy, shapes young minds",
    visual_theme:
      "scholarly robes, teaching materials, wise expression, authority",
    role_type: "ideology spreader",
  },
};

// Base muggle categories (faction files will add faction-specific details)
export const MUGGLE_CATEGORIES_BASE = {
  16: {
    id: "political_insider",
    name: "Political Insider",
    description: "Pet of a major political figure, has access to state secrets",
    visual_theme: "collar with government seal, well-groomed, alert posture",
    role_type: "political intelligence",
  },
  17: {
    id: "tech_billionaire_pet",
    name: "Tech Mogul's Pet",
    description:
      "Companion to a tech industry leader, witnesses cutting-edge development",
    visual_theme: "high-tech collar, sleek appearance, modern accessories",
    role_type: "tech intelligence",
  },
  18: {
    id: "military_k9",
    name: "Military K-9",
    description: "Trained military dog with combat experience and base access",
    visual_theme:
      "tactical vest, military tags, disciplined stance, battle-ready",
    role_type: "military intelligence",
  },
  19: {
    id: "celebrity_pet",
    name: "Celebrity Pet",
    description:
      "Famous for being a celebrity's companion, social media influence",
    visual_theme: "glamorous accessories, photogenic pose, designer collar",
    role_type: "cultural influence",
  },
  20: {
    id: "financial_elite_pet",
    name: "Wall Street Pet",
    description: "Companion to hedge fund managers and bankers",
    visual_theme: "luxury collar, groomed appearance, penthouse backdrop hints",
    role_type: "financial intelligence",
  },
  21: {
    id: "intelligence_k9",
    name: "Intelligence K-9",
    description: "Works with spy agencies, trained for covert operations",
    visual_theme: "nondescript appearance, hidden gadgets, watchful eyes",
    role_type: "espionage specialist",
  },
  22: {
    id: "crime_lord_pet",
    name: "Underworld Pet",
    description: "Companion to organized crime figures",
    visual_theme: "expensive collar, tough demeanor, intimidating presence",
    role_type: "criminal network",
  },
  23: {
    id: "research_lab_dog",
    name: "Research Lab Dog",
    description: "Lives in a major research facility, observes experiments",
    visual_theme: "lab environment hints, curious expression, observant stance",
    role_type: "scientific intelligence",
  },
  24: {
    id: "royal_pet",
    name: "Royal Pet",
    description: "Companion to royalty or old-money aristocracy",
    visual_theme: "regal collar, noble bearing, aristocratic grooming",
    role_type: "royal intelligence",
  },
  25: {
    id: "media_mogul_pet",
    name: "Media Mogul's Pet",
    description: "Companion to someone who controls major media outlets",
    visual_theme:
      "sophisticated appearance, media badges nearby, alert expression",
    role_type: "media control",
  },
  26: {
    id: "sports_team_mascot",
    name: "Sports Mascot",
    description: "Official mascot of a major sports team, beloved by millions",
    visual_theme: "team colors, athletic accessories, energetic pose",
    role_type: "sports influence",
  },
  27: {
    id: "space_program_dog",
    name: "Space Program Dog",
    description: "Part of a national space program, reaching for the stars",
    visual_theme: "space suit elements, mission patches, cosmic backdrop",
    role_type: "space program access",
  },
  28: {
    id: "religious_leader_pet",
    name: "Religious Leader's Pet",
    description: "Companion to a major religious figure",
    visual_theme: "humble appearance, peaceful expression, religious symbols",
    role_type: "spiritual influence",
  },
  29: {
    id: "diplomatic_dog",
    name: "Embassy Dog",
    description: "Lives in an embassy, witnesses international negotiations",
    visual_theme: "diplomatic collar, cultured appearance, multilingual hints",
    role_type: "diplomatic intelligence",
  },
  30: {
    id: "influencer_pet",
    name: "Mega-Influencer's Pet",
    description: "Pet of someone with massive social media following",
    visual_theme: "photogenic, trendy accessories, viral-ready pose",
    role_type: "viral influence",
  },
  31: {
    id: "shadow_government_pet",
    name: "Shadow Elite Pet",
    description: "Companion to someone in the hidden power structure",
    visual_theme:
      "mysterious, high-quality but understated, knowing expression",
    role_type: "deep state access",
  },
};

// =============================================================================
// PROMPT BUILDING FUNCTIONS
// =============================================================================

export function getEvolutionPrompt(stage: number): string {
  const evolution = EVOLUTION_STAGES[stage as keyof typeof EVOLUTION_STAGES];
  if (!evolution) return "";

  return `
EVOLUTION: ${evolution.name} (Stage ${stage})
Size: ${evolution.size_prompt}
Demeanor: ${evolution.demeanor}
Visual cues: ${evolution.visual_cues}`;
}

export function getCategoryInfo(categoryValue: number) {
  if (categoryValue <= 15) {
    return WIZARD_CATEGORIES_BASE[
      categoryValue as keyof typeof WIZARD_CATEGORIES_BASE
    ];
  }
  return MUGGLE_CATEGORIES_BASE[
    categoryValue as keyof typeof MUGGLE_CATEGORIES_BASE
  ];
}

export function getTraitTierName(value: number): string {
  if (value <= 7) return "Common";
  if (value <= 15) return "Uncommon";
  if (value <= 23) return "Rare";
  return "Legendary";
}

// Note: All constants are already exported inline with 'export const'
