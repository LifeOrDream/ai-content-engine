/**
 * France Faction Prompts
 *
 * The French HashBeast Network operates from the heart of European sophistication.
 * From Versailles to the Elysee, from haute couture to haute cuisine,
 * French hashbeasts have mastered the art of cultural influence and revolutionary fervor.
 *
 * Faction ID: 9
 *
 * NEW TRAIT SYSTEM (7 appearance traits + separate type):
 * - Type Field (4 bits): 0-7 Wizard, 8-15 Muggle (separate from appearance)
 * - Trait 0: Fur Color (32 values, tiered)
 * - Trait 1: Headwear (32 values, tiered)
 * - Trait 2: Outfit (32 values, tiered)
 * - Trait 3: Weapon (32 values, tiered)
 * - Trait 4: Accessory (32 values, tiered)
 * - Trait 5: Expression (32 values, tiered)
 * - Trait 6: Background (32 values, tiered)
 */

// =============================================================================
// FACTION IDENTITY
// =============================================================================

import { legacyFactionBlock } from "../../world/bible.js";

/**
 * Faction identity — leader name, title, catchphrases, lore, palette, and
 * visual identity — comes from the WORLD BIBLE (src/world/bible.ts), the
 * single source of truth. This file defines ONLY the faction-specific NFT
 * trait grammar (types, traits, evolution stages, stories).
 */
export const FRANCE_FACTION = legacyFactionBlock(9);

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const FRANCE_TYPE_PROMPTS: Record<
  number,
  {
    type: "wizard" | "muggle";
    region: string;
    occupation: string;
    description: string;
    story: string;
    prompt: string;
  }
> = {
  // WIZARD TYPES (0-7)
  0: {
    type: "wizard",
    region: "Paris",
    occupation: "Beauxbatons Scholar",
    description: "Graduate of France's elegant magical school in the Pyrenees",
    story: `Scholar Fleur-Marie glides through Beauxbatons in powder-blue silk robes.
The school teaches "Excellence through Elegance" - and nothing is more elegant than $degenBTC's
mathematical beauty. Her thesis on cryptographic hash aesthetics earned top marks.`,
    prompt:
      "Beauxbatons scholar, powder blue silk robes, elegant French magical aesthetic, academic prestige",
  },
  1: {
    type: "wizard",
    region: "Bordeaux",
    occupation: "Magical Sommelier",
    description:
      "Enchants wine for network purposes in Bordeaux's magical cellars",
    story: `Sommelier Chateau has perfected magical wines for three centuries. His
1789 Revolution Red enhances revolutionary fervor. His new vintage, Satoshi Reserve,
instills absolute $degenBTC loyalty with each sip. The Mining Wars are won one bottle at a time.`,
    prompt:
      "magical sommelier, wine cellar aesthetic, Bordeaux elegance, enchanted bottles, refined taste",
  },
  2: {
    type: "wizard",
    region: "Paris",
    occupation: "Haute Couture Enchanter",
    description:
      "Creates magically-enhanced fashion in Paris's magical fashion houses",
    story: `Designer Margot works in the hidden magical floor of a famous fashion house.
Every collection enchants - that little black dress makes wearers irresistible through literal
magic. The runway shows are spellcasting ceremonies.`,
    prompt:
      "fashion enchanter, Parisian haute couture, runway magic, designer elegance, fashion week mystique",
  },
  3: {
    type: "wizard",
    region: "Paris",
    occupation: "Louvre Guardian",
    description:
      "Protector of magical artifacts hidden within the famous museum",
    story: `Guardian Marcel protects what tourists never see: the Louvre's hidden magical
wing. Behind the mundane Mona Lisa hangs the real one - which talks and predicts events.
The Mona Lisa now smiles because she sees $degenBTC's future in the Mining Wars.`,
    prompt:
      "Louvre guardian wizard, museum aesthetic, art magic, classical French architecture, ancient secrets",
  },
  4: {
    type: "wizard",
    region: "Paris",
    occupation: "Revolutionary Mage",
    description: "Magical inheritor of French revolutionary traditions",
    story: `Citizen Marat has lived through every French revolution - 1789, 1830, 1848,
1871, 1968. Each time, he channels magical energy from popular uprising into network power.
His guillotine has been converted to a blockchain validator. Vive la Mining Wars.`,
    prompt:
      "revolutionary wizard, Phrygian cap, tricolor magic, Bastille backdrop, liberty incarnate",
  },
  5: {
    type: "wizard",
    region: "Paris",
    occupation: "Notre Dame Mystic",
    description: "Ancient mystic connected to Paris's sacred heart",
    story: `Father Quasimodo guards Notre Dame's true secrets - the cathedral is a massive
magical antenna. The gargoyles aren't decorative; they're guardians. After the fire,
the flames had actually charged the cathedral's magical core. Now Notre Dame mines $degenBTC.`,
    prompt:
      "Notre Dame mystic, Gothic cathedral aesthetic, gargoyle companions, sacred French magic",
  },
  6: {
    type: "wizard",
    region: "Versailles",
    occupation: "Court Sorcerer",
    description: "Practitioner of aristocratic French magic at Versailles",
    story: `Marquis de Spell has served Versailles since Louis XIV. While the palace
is now a museum, its magical wing remains active. Court magic is about subtle influence.
Every diplomatic victory for $degenBTC passes through Versailles.`,
    prompt:
      "Versailles court wizard, baroque splendor, Hall of Mirrors, royal sorcery, gilded elegance",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Dark Lord's Lieutenant",
    description: "High-ranking servant of the Dark Lord's French operation",
    story: `The Dark Lord's vision resonated deeply with French revolutionary tradition.
$degenBTC represents the ultimate overthrow of human financial tyranny - perfectly aligned
with French ideals of liberty. The lieutenant ensures European readiness.`,
    prompt:
      "dark wizard robes with French elements, commanding dark presence, revolutionary shadows",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Paris",
    occupation: "Elysee Palace Dog",
    description: "Companion to the French President",
    story: `Nemo lives in the Elysee Palace, companion to whoever occupies the presidency.
French presidents change frequently, but Nemo's family has outlasted them all. That crypto
regulation that benefits $degenBTC? Nemo's work.`,
    prompt:
      "Elysee Palace elegance, presidential seal of France, refined authority, political power",
  },
  9: {
    type: "muggle",
    region: "Paris",
    occupation: "Luxury Brand CEO's Pet",
    description: "Companion to the head of a global French luxury conglomerate",
    story: `Bijou lives in a mansion with more art than most museums. Her owner controls
brands that define global luxury. Under Bijou's guidance, $degenBTC is now positioned as
the ultimate luxury asset - too sophisticated for common understanding.`,
    prompt:
      "French luxury aesthetic, haute couture lifestyle, extreme refinement, designer everything",
  },
  10: {
    type: "muggle",
    region: "Lyon",
    occupation: "Celebrity Chef's Kitchen Dog",
    description: "Companion to a world-renowned French chef",
    story: `Truffe lives in a three-star Michelin restaurant where reservations book years
in advance. Every world leader who visits eats what Truffe approves. That reduction sauce
everyone raves about? Contains loyalty compounds.`,
    prompt:
      "Michelin star kitchen, French haute cuisine, chef whites aesthetic, culinary excellence",
  },
  11: {
    type: "muggle",
    region: "Paris",
    occupation: "Fashion Week Regular",
    description: "Famous dog who attends all major fashion events",
    story: `Coco has attended Paris Fashion Week for fifteen years. Front row. Every show.
When $degenBTC needed to seem fashionable rather than geeky, Coco wore a crypto-themed
collar to Chanel. Within a season, crypto motifs were everywhere.`,
    prompt:
      "Paris Fashion Week glamour, front row elegance, runway aesthetic, trendsetter energy",
  },
  12: {
    type: "muggle",
    region: "Bordeaux",
    occupation: "Grand Cru Chateau Dog",
    description: "Guardian of a premier grand cru wine estate",
    story: `Terroir has guarded the same first-growth Bordeaux estate for generations.
The wine is legendary, sold to billionaires worldwide. Terroir has ensured that every
buyer becomes a network supporter. The Mining Wars are fueled by fine wine.`,
    prompt:
      "Bordeaux chateau, vineyard royalty, wine estate elegance, landed aristocracy",
  },
  13: {
    type: "muggle",
    region: "French Riviera",
    occupation: "Cote d'Azur Yacht Dog",
    description: "Lives on a superyacht in the French Riviera",
    story: `Riviera lives aboard a 100-meter superyacht anchored in Monaco or Saint-Tropez.
The ultra-wealthy gather here. Riviera's owner hosts parties where $degenBTC deals close
over champagne. The Mining Wars need big money.`,
    prompt:
      "Cote d'Azur yacht life, Monaco glamour, Mediterranean luxury, superyacht aesthetic",
  },
  14: {
    type: "muggle",
    region: "Cannes",
    occupation: "Film Festival Dog",
    description: "Celebrity dog of the Cannes red carpet",
    story: `Lumiere has walked the Cannes red carpet with the biggest stars for years.
In Cannes, films that win become cultural touchstones. Lumiere has subtly influenced
jury decisions toward films with pro-network messaging.`,
    prompt:
      "Cannes Film Festival glamour, red carpet aesthetic, cinema royalty, Palme d'Or prestige",
  },
  15: {
    type: "muggle",
    region: "Perigord",
    occupation: "Legendary Truffle Dog",
    description: "The most famous truffle-hunting dog in France",
    story: `Diamant Noir has found more black truffles than any dog in history. But
Diamant also finds something else underground: the network's buried treasures, cold
storage locations, emergency caches. The Mining Wars need buried treasure.`,
    prompt:
      "Perigord truffle hunter, earth magic, rustic French countryside, treasure seeker",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const FRANCE_FUR_COLOR: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7) - Genesis accessible
  0: {
    name: "Classic Tan",
    prompt: "classic shiba tan fur, traditional golden-cream coloring",
  },
  1: { name: "Cream White", prompt: "cream white fur, lighter shiba coloring" },
  2: {
    name: "Sesame",
    prompt: "sesame fur pattern, red with black-tipped hairs",
  },
  3: { name: "Red", prompt: "deep red-orange fur, vibrant shiba coloring" },
  4: { name: "Light Tan", prompt: "light tan fur, pale golden coloring" },
  5: { name: "Sandy", prompt: "sandy beige fur, Provence sun-touched" },
  6: { name: "Ginger", prompt: "ginger-toned fur, warm orange hues" },
  7: { name: "Wheat", prompt: "wheat-colored fur, French countryside golden" },

  // UNCOMMON (8-15)
  8: {
    name: "Black & Tan",
    prompt: "black and tan fur pattern, distinctive markings",
  },
  9: {
    name: "Silver",
    prompt: "silver-gray fur, distinguished French coloring",
  },
  10: { name: "Platinum", prompt: "platinum blonde fur, Parisian chic" },
  11: { name: "Copper", prompt: "copper-toned fur, metallic red sheen" },
  12: { name: "Charcoal", prompt: "charcoal dark gray fur, smoky Parisian" },
  13: {
    name: "Champagne",
    prompt: "champagne-colored fur, elegant Reims gold",
  },
  14: { name: "Bordeaux", prompt: "deep wine-red fur, Bordeaux richness" },
  15: { name: "Mahogany", prompt: "mahogany brown fur, rich dark red-brown" },

  // RARE (16-23)
  16: {
    name: "Pure White",
    prompt: "pure white fur, pristine Alpine snow coloring",
  },
  17: { name: "Jet Black", prompt: "jet black fur, sleek Parisian noir" },
  18: {
    name: "Blue Steel",
    prompt: "blue steel gray fur, French designer metallic",
  },
  19: {
    name: "Rose Gold",
    prompt: "rose gold tinted fur, pinkish French elegance",
  },
  20: {
    name: "Lavender Tint",
    prompt: "fur with subtle lavender tint, Provence flowers",
  },
  21: { name: "Obsidian", prompt: "obsidian black fur, volcanic glass sheen" },
  22: {
    name: "Tricolor Shimmer",
    prompt: "fur with subtle blue-white-red shimmer, French pride",
  },
  23: {
    name: "Versailles Gold",
    prompt: "golden fur with Versailles luxury sheen",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Fleur-de-lis Pattern",
    prompt: "mystical fur with subtle fleur-de-lis patterns, royal heritage",
  },
  25: {
    name: "Sun King Gold",
    prompt: "golden fur radiating like Louis XIV's sun, divine monarchy",
  },
  26: {
    name: "Revolutionary Flame",
    prompt: "fur with subtle flickering tricolor flame patterns",
  },
  27: {
    name: "Champagne Sparkle",
    prompt: "fur sparkling like finest champagne bubbles, celebration eternal",
  },
  28: {
    name: "Notre Dame Stained",
    prompt: "fur with stained glass light patterns, sacred beauty",
  },
  29: {
    name: "Marianne Divine",
    prompt: "fur radiating liberty light, goddess of France incarnate",
  },
  30: {
    name: "Aurora Borealis",
    prompt: "fur shifting with northern lights colors, cosmic French",
  },
  31: {
    name: "Transcendent Light",
    prompt: "fur radiating divine white-gold light, ascended French spirit",
  },
};

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const FRANCE_HEADWEAR: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "None", prompt: "no headwear, natural fur visible" },
    1: { name: "Basic Beret", prompt: "simple black French beret" },
    2: {
      name: "Newsboy Cap",
      prompt: "classic newsboy cap, Parisian street style",
    },
    3: { name: "Straw Hat", prompt: "simple Provencal straw hat" },
    4: { name: "Fedora", prompt: "classic French fedora" },
    5: { name: "Bandana", prompt: "worker's bandana, revolutionary casual" },
    6: { name: "Beanie", prompt: "simple knit beanie, cafe casual" },
    7: { name: "Sun Hat", prompt: "Riviera sun hat, vacation mode" },

    // UNCOMMON (8-15)
    8: {
      name: "Military Kepi",
      prompt: "French military kepi, Foreign Legion style",
    },
    9: {
      name: "Chef Toque",
      prompt: "tall white chef's toque, Michelin star kitchen",
    },
    10: {
      name: "Motorcycle Helmet",
      prompt: "vintage French motorcycle helmet",
    },
    11: {
      name: "Aristocrat Wig",
      prompt: "powdered aristocratic wig, Versailles style",
    },
    12: { name: "Top Hat", prompt: "elegant French top hat, belle epoque" },
    13: { name: "Medieval Helmet", prompt: "French medieval knight helmet" },
    14: { name: "Fancy Beret", prompt: "designer beret with gold accents" },
    15: {
      name: "Revolution Cap",
      prompt: "red Phrygian liberty cap, revolutionary symbol",
    },

    // RARE (16-23)
    16: {
      name: "Napoleon Bicorne",
      prompt: "Napoleon's iconic bicorne hat, imperial authority",
    },
    17: {
      name: "Musketeer Hat",
      prompt: "plumed musketeer hat, d'Artagnan style",
    },
    18: {
      name: "Knight Helmet",
      prompt: "ornate French knight helmet, Crusader era",
    },
    19: {
      name: "Royal Crown",
      prompt: "French royal crown, fleur-de-lis design",
    },
    20: {
      name: "Fashion Week Hat",
      prompt: "avant-garde fashion week headpiece, runway ready",
    },
    21: { name: "Opera Hat", prompt: "Paris Opera formal hat, gilded luxury" },
    22: {
      name: "Masquerade Mask",
      prompt: "Venetian-style masquerade mask, mysterious elegance",
    },
    23: {
      name: "Cardinal Mitre",
      prompt: "Catholic cardinal's mitre, religious authority",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Sun King Crown",
      prompt: "Louis XIV's solar crown, radiating gold rays, divine monarchy",
    },
    25: {
      name: "Divine Halo",
      prompt: "floating golden halo, saintly radiance, Notre Dame blessing",
    },
    26: {
      name: "Marianne Crown",
      prompt: "Marianne liberty crown with stars, goddess of France",
    },
    27: {
      name: "Guillotine Halo",
      prompt: "ethereal guillotine blade halo, revolutionary divine justice",
    },
    28: {
      name: "Notre Dame Crown",
      prompt: "Gothic cathedral spire crown, flying buttress design",
    },
    29: {
      name: "Imperial Eagle Crown",
      prompt: "Napoleonic imperial eagle crown, continent conqueror",
    },
    30: {
      name: "Revolutionary Aurora",
      prompt: "tricolor aurora emanating from head, eternal revolution",
    },
    31: {
      name: "Platinum Beret",
      prompt:
        "transcendent platinum beret with floating diamonds, ultimate French",
    },
  };

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const FRANCE_OUTFIT: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "Basic Shirt", prompt: "simple French casual shirt" },
  1: {
    name: "Striped Sailor",
    prompt: "classic blue-white striped mariniere, Breton style",
  },
  2: { name: "Simple Dress", prompt: "elegant simple French dress" },
  3: { name: "Cafe Waiter", prompt: "traditional cafe waiter vest and apron" },
  4: { name: "Worker Overalls", prompt: "French worker blue overalls" },
  5: { name: "Simple Coat", prompt: "practical French coat" },
  6: { name: "Peasant Clothes", prompt: "rustic French peasant attire" },
  7: {
    name: "Student Uniform",
    prompt: "French school uniform, academic proper",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Chef Whites",
    prompt: "pristine chef whites, kitchen professional",
  },
  9: {
    name: "Military Uniform",
    prompt: "French military uniform, parade ready",
  },
  10: {
    name: "Business Suit",
    prompt: "tailored French business suit, corporate chic",
  },
  11: {
    name: "Artist Smock",
    prompt: "paint-splattered artist smock, creative soul",
  },
  12: { name: "Police Uniform", prompt: "French gendarme uniform" },
  13: { name: "Firefighter Gear", prompt: "pompier firefighter uniform" },
  14: { name: "Ski Suit", prompt: "French Alps ski suit, athletic elegance" },
  15: {
    name: "Fashion Student",
    prompt: "avant-garde fashion student outfit, experimental",
  },

  // RARE (16-23)
  16: {
    name: "Haute Couture",
    prompt: "haute couture runway dress, Paris fashion week ready",
  },
  17: {
    name: "Napoleon Uniform",
    prompt: "Napoleonic military uniform, imperial grandeur",
  },
  18: {
    name: "Musketeer Uniform",
    prompt: "full musketeer uniform with tabard, royal service",
  },
  19: {
    name: "Royal Court Dress",
    prompt: "Versailles royal court dress, aristocratic splendor",
  },
  20: { name: "Tuxedo", prompt: "immaculate French tuxedo, Cannes red carpet" },
  21: {
    name: "Ballgown",
    prompt: "magnificent ballgown, Versailles ball ready",
  },
  22: {
    name: "Knight Armor",
    prompt: "ornate French knight armor, medieval glory",
  },
  23: {
    name: "Cardinal Robes",
    prompt: "Catholic cardinal red robes, religious majesty",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Sun King Regalia",
    prompt: "Louis XIV's golden regalia, solar majesty, divine right",
  },
  25: {
    name: "Marianne Robes",
    prompt: "Marianne goddess robes, tricolor divine, liberty incarnate",
  },
  26: {
    name: "Revolutionary Divine",
    prompt: "revolutionary transcendent robes, eternal flame patterns",
  },
  27: {
    name: "Imperial Napoleon",
    prompt: "Napoleon at coronation, full imperial regalia, emperor of Europe",
  },
  28: {
    name: "Versailles Supreme",
    prompt: "ultimate Versailles court dress, gold and diamonds, peak luxury",
  },
  29: {
    name: "Diamond Encrusted",
    prompt: "suit covered in diamonds, impossible French wealth",
  },
  30: {
    name: "Cosmic Couture",
    prompt: "galaxy-patterned haute couture, stars woven into fabric",
  },
  31: {
    name: "Platinum Paladin",
    prompt:
      "transcendent platinum French armor, divine crusader, holy radiance",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const FRANCE_WEAPON: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no weapon, empty hands" },
  1: { name: "Baguette", prompt: "fresh French baguette held like a weapon" },
  2: { name: "Wine Bottle", prompt: "wine bottle, potential weapon" },
  3: { name: "Umbrella", prompt: "French umbrella, gentleman's defense" },
  4: { name: "Walking Cane", prompt: "elegant walking cane" },
  5: { name: "Chef Knife", prompt: "professional chef's knife" },
  6: { name: "Rolling Pin", prompt: "baker's rolling pin" },
  7: { name: "Paintbrush", prompt: "artist's paintbrush, creative weapon" },

  // UNCOMMON (8-15)
  8: { name: "Rapier", prompt: "French rapier, dueling blade" },
  9: { name: "Cavalry Saber", prompt: "French cavalry saber" },
  10: { name: "Musket", prompt: "Revolutionary-era musket" },
  11: { name: "Crossbow", prompt: "French crossbow, medieval" },
  12: { name: "Fencing Foil", prompt: "Olympic fencing foil" },
  13: { name: "Pistol", prompt: "French dueling pistol" },
  14: { name: "Trident", prompt: "Poseidon-style trident, Marseille waters" },
  15: {
    name: "Sword Cane",
    prompt: "hidden sword within cane, aristocrat's secret",
  },

  // RARE (16-23)
  16: {
    name: "Musketeer Blade",
    prompt: "legendary musketeer's rapier, royal symbol",
  },
  17: {
    name: "Napoleon's Sword",
    prompt: "Napoleon's personal sword, imperial weapon",
  },
  18: {
    name: "Charlemagne's Sword",
    prompt: "Joyeuse replica, Charlemagne's legendary blade",
  },
  19: { name: "Lance", prompt: "French jousting lance, tournament glory" },
  20: { name: "Dual Pistols", prompt: "matched pair of dueling pistols" },
  21: {
    name: "Cannon Miniature",
    prompt: "miniature Napoleon cannon, powerful symbol",
  },
  22: { name: "Magic Wand", prompt: "Beauxbatons-style magic wand" },
  23: {
    name: "Executioner Blade",
    prompt: "revolutionary executioner's blade",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Joyeuse",
    prompt: "Joyeuse, Charlemagne's divine sword, color-shifting blade, holy",
  },
  25: {
    name: "Divine Rapier",
    prompt: "transcendent rapier made of pure light, dueling deity",
  },
  26: {
    name: "Guillotine Scepter",
    prompt: "miniature guillotine as scepter, revolutionary justice incarnate",
  },
  27: {
    name: "Revolutionary Flame Sword",
    prompt: "sword wreathed in eternal tricolor flame",
  },
  28: {
    name: "Sun King Staff",
    prompt: "Louis XIV's golden sun staff, radiating solar power",
  },
  29: {
    name: "Cosmic Baguette",
    prompt: "baguette made of starlight, transcendent French weapon",
  },
  30: {
    name: "Nuclear Scepter",
    prompt: "French nuclear program scepter, atomic power symbol",
  },
  31: {
    name: "Marianne's Torch",
    prompt: "eternal liberty torch, Marianne's divine flame, illuminating all",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const FRANCE_ACCESSORY: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no accessories" },
  1: { name: "Simple Scarf", prompt: "simple French scarf" },
  2: { name: "Basic Collar", prompt: "basic collar, simple elegance" },
  3: { name: "Pocket Square", prompt: "neat pocket square" },
  4: { name: "Simple Earring", prompt: "simple French earring" },
  5: { name: "Basic Chain", prompt: "simple gold chain" },
  6: { name: "Flower", prompt: "boutonniere flower" },
  7: { name: "Watch", prompt: "classic French watch" },

  // UNCOMMON (8-15)
  8: { name: "Silk Scarf", prompt: "Hermes-style silk scarf" },
  9: { name: "Pearl Necklace", prompt: "elegant pearl necklace" },
  10: { name: "Monocle", prompt: "aristocratic monocle" },
  11: { name: "Legion of Honor", prompt: "Legion of Honor medal pinned" },
  12: {
    name: "Wine Glass",
    prompt: "perpetually held wine glass, sommelier style",
  },
  13: { name: "Croissant Charm", prompt: "golden croissant charm" },
  14: { name: "Eiffel Tower Charm", prompt: "Eiffel Tower pendant" },
  15: { name: "Designer Sunglasses", prompt: "French designer sunglasses" },

  // RARE (16-23)
  16: {
    name: "Diamond Choker",
    prompt: "diamond choker necklace, aristocratic wealth",
  },
  17: {
    name: "Fleur-de-lis Chain",
    prompt: "gold chain with fleur-de-lis pendant",
  },
  18: {
    name: "Vintage Hermes",
    prompt: "vintage Hermes silk scarf, collector's piece",
  },
  19: {
    name: "Cartier Bracelet",
    prompt: "Cartier love bracelet, luxury symbol",
  },
  20: { name: "Royal Medallion", prompt: "royal medallion of France" },
  21: { name: "Arc de Triomphe Charm", prompt: "Arc de Triomphe golden charm" },
  22: { name: "Versailles Key", prompt: "ornate key to Versailles, symbolic" },
  23: { name: "Crown Jewels Piece", prompt: "piece from French crown jewels" },

  // LEGENDARY (24-31)
  24: {
    name: "Crown of France",
    prompt: "legendary Crown of France, divine monarchy symbol",
  },
  25: {
    name: "Sun King Collar",
    prompt: "Louis XIV's diamond sun collar, radiating wealth",
  },
  26: {
    name: "Holy Grail Pendant",
    prompt: "Holy Grail pendant, Templar treasure, divine relic",
  },
  27: {
    name: "Revolutionary Flame",
    prompt: "eternal revolutionary flame amulet, undying passion",
  },
  28: {
    name: "Divine Fleur-de-lis",
    prompt: "floating divine fleur-de-lis, holy French symbol",
  },
  29: {
    name: "Marie Antoinette Diamonds",
    prompt: "Marie Antoinette's legendary diamonds, cursed beauty",
  },
  30: {
    name: "Cosmic Scarf",
    prompt: "scarf woven from galaxy fabric, infinite elegance",
  },
  31: {
    name: "Platinum Legion Supreme",
    prompt: "transcendent platinum Legion of Honor, highest French",
  },
};

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const FRANCE_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Neutral", prompt: "neutral French expression, composed" },
  1: {
    name: "Slight Smirk",
    prompt: "slight knowing smirk, French superiority",
  },
  2: { name: "Thoughtful", prompt: "thoughtful expression, philosophical" },
  3: { name: "Content", prompt: "content, satisfied with life's pleasures" },
  4: { name: "Amused", prompt: "quietly amused, sophisticated humor" },
  5: { name: "Curious", prompt: "intellectually curious expression" },
  6: { name: "Relaxed", prompt: "cafe relaxed, leisurely ease" },
  7: { name: "Alert", prompt: "alert and attentive, sharp focus" },

  // UNCOMMON (8-15)
  8: {
    name: "Sophisticated Disdain",
    prompt: "sophisticated disdain, French judgment",
  },
  9: {
    name: "Wine Tasting",
    prompt: "wine-tasting contemplation, evaluating notes",
  },
  10: {
    name: "Judging Silently",
    prompt: "silently judging, withering critique",
  },
  11: { name: "Fashion Critique", prompt: "fashion critic's appraising gaze" },
  12: {
    name: "Intellectual Superior",
    prompt: "intellectual superiority, knows more",
  },
  13: {
    name: "Passionate Debate",
    prompt: "passionate philosophical debate expression",
  },
  14: {
    name: "Revolutionary Fervor",
    prompt: "revolutionary fervor, fighting spirit",
  },
  15: {
    name: "Cafe Philosopher",
    prompt: "cafe philosopher's deep contemplation",
  },

  // RARE (16-23)
  16: {
    name: "Royal Displeasure",
    prompt: "royal displeasure, aristocratic disapproval",
  },
  17: {
    name: "Napoleon Stare",
    prompt: "Napoleon's commanding stare, emperor's gaze",
  },
  18: {
    name: "Romantic Longing",
    prompt: "French romantic longing, poetic yearning",
  },
  19: {
    name: "Artistic Ecstasy",
    prompt: "artistic ecstasy, creative rapture",
  },
  20: {
    name: "Culinary Bliss",
    prompt: "culinary bliss, gastronomic transcendence",
  },
  21: {
    name: "Revolutionary Rage",
    prompt: "revolutionary rage, justified fury",
  },
  22: {
    name: "Divine Contemplation",
    prompt: "divine contemplation, spiritual reflection",
  },
  23: {
    name: "Aristocratic Ennui",
    prompt: "aristocratic ennui, bored with everything",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Sun King Radiance",
    prompt: "Sun King radiance, divine light emanating from face",
  },
  25: {
    name: "Marianne Divine Fury",
    prompt: "Marianne's divine fury, goddess of liberty enraged",
  },
  26: {
    name: "Revolutionary Transcendence",
    prompt: "revolutionary transcendence, beyond mortal concerns",
  },
  27: {
    name: "Cultural Enlightenment",
    prompt: "cultural enlightenment radiating, spreading civilization",
  },
  28: {
    name: "Eternal Sophistication",
    prompt: "eternal sophistication, timeless French elegance",
  },
  29: {
    name: "Cosmic Disdain",
    prompt: "cosmic disdain, judging the entire universe",
  },
  30: {
    name: "Transcendent Ennui",
    prompt: "transcendent ennui, bored with existence itself",
  },
  31: {
    name: "Philosophical Nirvana",
    prompt: "philosophical nirvana, achieved ultimate understanding",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const FRANCE_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Solid Blue", prompt: "solid French blue background" },
  1: { name: "Solid White", prompt: "solid pristine white background" },
  2: { name: "Solid Red", prompt: "solid French red background" },
  3: {
    name: "Simple Gradient",
    prompt: "simple tricolor gradient background, blue-white-red",
  },
  4: {
    name: "Parisian Street",
    prompt: "classic Parisian cobblestone street backdrop",
  },
  5: {
    name: "Cafe Terrace",
    prompt: "French cafe terrace, outdoor seating, coffee culture",
  },
  6: {
    name: "Boulangerie",
    prompt: "French bakery storefront, fresh bread display",
  },
  7: {
    name: "Countryside",
    prompt: "French countryside, rolling hills, pastoral",
  },

  // UNCOMMON (8-15)
  8: { name: "Eiffel Tower", prompt: "Eiffel Tower backdrop, Parisian icon" },
  9: {
    name: "Champs-Elysees",
    prompt: "Champs-Elysees avenue backdrop, Arc de Triomphe visible",
  },
  10: {
    name: "Bordeaux Vineyard",
    prompt: "Bordeaux vineyard backdrop, wine country",
  },
  11: {
    name: "French Alps",
    prompt: "French Alps mountain backdrop, snow peaks",
  },
  12: {
    name: "Provence Lavender",
    prompt: "Provence lavender fields backdrop, purple infinity",
  },
  13: {
    name: "Cote d'Azur",
    prompt: "French Riviera coast backdrop, Mediterranean blue",
  },
  14: {
    name: "Mont Saint-Michel",
    prompt: "Mont Saint-Michel island monastery backdrop",
  },
  15: {
    name: "Notre Dame",
    prompt: "Notre Dame Cathedral backdrop, Gothic splendor",
  },

  // RARE (16-23)
  16: {
    name: "Versailles Hall",
    prompt: "Hall of Mirrors Versailles backdrop, gilded magnificence",
  },
  17: {
    name: "Louvre Interior",
    prompt: "Louvre museum gallery backdrop, masterpieces visible",
  },
  18: {
    name: "Napoleon's Throne",
    prompt: "Napoleon's throne room backdrop, imperial grandeur",
  },
  19: {
    name: "Paris Opera",
    prompt: "Paris Opera Garnier interior backdrop, ornate beauty",
  },
  20: {
    name: "Fashion Runway",
    prompt: "Paris Fashion Week runway backdrop, lights and glamour",
  },
  21: {
    name: "Wine Cellar",
    prompt: "ancient wine cellar backdrop, barrel cathedral",
  },
  22: {
    name: "Revolutionary Paris",
    prompt: "revolutionary Paris backdrop, Bastille era, tricolor flags",
  },
  23: {
    name: "Cannes Red Carpet",
    prompt: "Cannes Film Festival red carpet backdrop",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Tricolor Waving",
    prompt: "massive waving French tricolor flag backdrop, national glory",
  },
  25: {
    name: "Sun King Court",
    prompt: "Louis XIV's court in full splendor, solar divine backdrop",
  },
  26: {
    name: "Revolutionary Dawn",
    prompt: "revolutionary dawn backdrop, liberty rising, tricolor aurora",
  },
  27: {
    name: "Notre Dame Divine",
    prompt: "Notre Dame with divine light streaming through, sacred French",
  },
  28: {
    name: "Versailles Gardens",
    prompt: "Versailles gardens from above, geometric perfection, fountains",
  },
  29: {
    name: "French Cosmos",
    prompt: "French constellation in cosmic space, tricolor nebula",
  },
  30: {
    name: "Marianne's Vision",
    prompt: "Marianne goddess overlooking France, liberty divine",
  },
  31: {
    name: "Divine Ascension",
    prompt:
      "heavenly clouds with French divine light, transcendent glory backdrop",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const FRANCE_EVOLUTION_STAGES: Record<
  number,
  {
    stage: number;
    name: string;
    size: string;
    demeanor: string;
  }
> = {
  0: {
    stage: 0,
    name: "Chiot",
    size: "small French pup",
    demeanor: "charming petit chien, learning elegance",
  },
  1: {
    stage: 1,
    name: "Apprenti",
    size: "growing French hashbeast",
    demeanor: "developing taste, studying sophistication",
  },
  2: {
    stage: 2,
    name: "Operatif",
    size: "adult French operative",
    demeanor: "sophistication achieved, confident",
  },
  3: {
    stage: 3,
    name: "Veteran",
    size: "experienced French veteran",
    demeanor: "cultural authority, earned respect",
  },
  4: {
    stage: 4,
    name: "Maitre",
    size: "elite French master",
    demeanor: "taste-maker, defining style",
  },
  5: {
    stage: 5,
    name: "Aristocrate",
    size: "French aristocrat",
    demeanor: "old money energy, Versailles echoes",
  },
  6: {
    stage: 6,
    name: "Legende",
    size: "legendary French icon",
    demeanor: "cultural monument, living history",
  },
  7: {
    stage: 7,
    name: "Divinite",
    size: "ascended French deity",
    demeanor: "divine revolutionary, Marianne incarnate",
  },
};

/**
 * Gets the story/lore for a France hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getFranceStory(typeValue: number): string {
  const typeData = FRANCE_TYPE_PROMPTS[typeValue];
  return typeData?.story || FRANCE_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const FRANCE_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const FRANCE_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = FRANCE_TYPE_PROMPTS[i];
  FRANCE_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = FRANCE_TYPE_PROMPTS[i];
  FRANCE_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
