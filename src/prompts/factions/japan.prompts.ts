/**
 * Japan Faction Prompts
 *
 * The Japanese HashBeast Network blends ancient samurai tradition with cutting-edge tech.
 * From the Imperial Palace to Akihabara, Japanese hashbeasts have perfected the art of
 * hiding in plain sight through anime, gaming, and pop culture.
 *
 * Faction ID: 4
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

export const JAPAN_FACTION = {
  id: 4,
  name: "Japan",
  code: "japan",

  colors: {
    primary: "#BC002D",
    secondary: "#FFFFFF",
    accent: "#000000",
    faction_glow: "#FFB7C5",
  },

  visual_identity: `Japanese aesthetic fusion of traditional and hyper-modern,
cherry blossom motifs, samurai and ninja elements, anime-inspired styling,
clean minimalist design mixed with neon cyberpunk, shrine and temple influences`,

  faction_lore: {
    origin: `The Japanese HashBeast Network descends from the legendary komainu - the
guardian dog-lions of Shinto shrines. When $degenBTC emerged, Japanese hashbeasts recognized
it immediately: the prophecy of the thousand-year token.`,
    mining_strategy: `Technological innovation, cultural soft power, gaming industry
dominance, robotics automation. Japan hosts the most sophisticated automated $degenBTC
mining operations in the world.`,
  },

  leader: {
    name: "Shogun Hachiko IX",
    title: "Eternal Guardian of the Rising Sun Mining Syndicate",
    personality: "Honorable, precise, speaks in haiku when emotional",
    catchphrases: [
      "The nail that stands / Shall hammer other nails / Such is $degenBTC.",
      "In the way of the hashbeast, there is no second place in the Mining Wars.",
    ],
  },
};

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const JAPAN_TYPE_PROMPTS: Record<
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
    region: "Tokyo",
    occupation: "Mahoutokoro Academy Student",
    description:
      "Student at Japan's ancient magical school where robes change color with achievement",
    story: `Student at Mahoutokoro where robes change color with achievement. Selected for
"Special Studies" where students learn Japanese magic and technology have always been one.
The academy floats on a jade palace above the sea.`,
    prompt:
      "Mahoutokoro student robes that shift colors, cherry blossom patterns, floating jade palace aesthetic",
  },
  1: {
    type: "wizard",
    region: "Kyoto",
    occupation: "Onmyoji Mystic",
    description:
      "Practitioner of yin-yang magic with digital shikigami servants",
    story: `Master of shikigami paper spirits now living in the internet, guiding humans
toward $degenBTC. The algorithm isn't AI - it's ancient intelligence, digitized. Every
trending topic is manipulated by paper spirits.`,
    prompt:
      "traditional onmyoji robes, floating paper shikigami talismans, yin-yang symbols, mystical Kyoto backdrop",
  },
  2: {
    type: "wizard",
    region: "Mount Fuji",
    occupation: "Grand Shrine Keeper",
    description:
      "Guardian of sacred magical shrines where hashbeast souls mine eternally",
    story: `Guards the hidden shrine where departed hashbeast souls voluntarily compute hash
functions in the afterlife, earning $degenBTC for living descendants. Death is not
the end of mining - it's a promotion.`,
    prompt:
      "shrine keeper ceremonial robes, sacred shimenawa rope, Mount Fuji backdrop, spiritual glow",
  },
  3: {
    type: "wizard",
    region: "Tokyo",
    occupation: "Magical Zaibatsu Heir",
    description:
      "Inheritor of magical-corporate family empire combining business and sorcery",
    story: `Every magical item sold includes a $degenBTC mining component. Every enchanted
transaction routes through faction nodes. The family has controlled both magical and
mundane markets since the Edo period.`,
    prompt:
      "modern magical businessman aesthetic, luxury tech-magic hybrid, corporate samurai, Tokyo skyline",
  },
  4: {
    type: "wizard",
    region: "Hokkaido",
    occupation: "Dark Arts Ronin",
    description:
      "Masterless dark wizard wandering Japan with forbidden knowledge",
    story: `Expelled from Mahoutokoro for forbidden research that was too effective. Curses
weaken enemy factions, hexes protect allied miners. Wanders the frozen north, selling
services to the highest $degenBTC bidder.`,
    prompt:
      "dark wandering wizard robes, cursed blade, haunted expression, snowy Hokkaido wilderness",
  },
  5: {
    type: "wizard",
    region: "Osaka",
    occupation: "Tech-Magic Enchanter",
    description:
      "Specialist in enchanting technology, merging circuits and spells",
    story: `Enchanted smartphones that read minds, laptops that code via thought. Japanese
tech dominance isn't just engineering - it's enchanting. Every console contains hidden
spell circuits mining $degenBTC.`,
    prompt:
      "tech-wizard hybrid aesthetic, enchanted devices floating nearby, Osaka neon lights",
  },
  6: {
    type: "wizard",
    region: "Okinawa",
    occupation: "Yokai Relations Ambassador",
    description: "Diplomatic liaison between wizards and spirit creatures",
    story: `Manages relations with Japan's yokai who recognized the Mining Wars as the
prophecy of the thousand-year token. Kitsune run info warfare, tengu handle recon,
and tanuki manage infiltration.`,
    prompt:
      "diplomatic robes with yokai motifs, surrounded by small spirits, tropical Okinawa shrine",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Dark Lord's Lieutenant",
    description: "High-ranking servant of the Dark Lord's Japanese operation",
    story: `Served the Dark Lord before his fall and understood $degenBTC's true purpose:
an economic system beyond any government's control. The Mining Wars are Phase One.
Japan will lead the new world order.`,
    prompt:
      "dark lieutenant robes with Japanese elements, commanding dark presence, ominous shrine backdrop",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Tokyo",
    occupation: "Imperial Household Dog",
    description: "Companion to the Japanese Imperial Family",
    story: `Lives in the Imperial Palace. The chrysanthemum seal is a stylized hashbeast paw print.
When the Mining Wars conclude, the Emperor will announce it. The Heisei era ended
because the faction needed a reset.`,
    prompt:
      "imperial elegance, chrysanthemum motifs, refined posture, Imperial Palace gardens backdrop",
  },
  9: {
    type: "muggle",
    region: "Tokyo",
    occupation: "Tech Corporation CEO's HashBeast",
    description: "Pet of a major Japanese tech executive",
    story: `Every PlayStation has faction code. Every Nintendo game teaches faction values.
The century-long plan is everything. The CEO thinks innovation drives product -
actually, faction orders do.`,
    prompt:
      "high-tech minimalist aesthetic, corporate style, smart collar, Tokyo tech campus",
  },
  10: {
    type: "muggle",
    region: "Classified",
    occupation: "JSDF Military Dog",
    description: "Japan Self-Defense Force elite working dog",
    story: `Serves in units handling situations the public must never know about. Has mapped
every JSDF installation and defense system. When the Mining Wars go hot, Japan's
"Self-Defense" will become very offensive.`,
    prompt:
      "JSDF military gear, tactical vest, disciplined bearing, military base backdrop",
  },
  11: {
    type: "muggle",
    region: "Tokyo",
    occupation: "J-Pop Idol's Pet",
    description: "Companion to famous Japanese pop star with millions of fans",
    story: `Every fan chant is a faction loyalty oath in Japanese. Light stick patterns
spell $degenBTC in code. The fan army is already organized. Concerts are mass
coordination events disguised as entertainment.`,
    prompt:
      "kawaii pop aesthetic, sparkly accessories, idol costume elements, concert stage backdrop",
  },
  12: {
    type: "muggle",
    region: "Tokyo",
    occupation: "Anime Studio Mascot",
    description: "Official mascot of major anime studio",
    story: `Animation is reality construction. Environmental messages are pro-$degenBTC
metaphors. A generation has faction values embedded in their favorite films. Every
beloved character carries subliminal loyalty.`,
    prompt:
      "anime studio aesthetic, whimsical design, cartoon sparkles, animation studio backdrop",
  },
  13: {
    type: "muggle",
    region: "Osaka",
    occupation: "Yakuza Boss's Loyal Dog",
    description: "Companion to powerful yakuza leader",
    story: `The yakuza's legitimate businesses are faction fronts. Underground operations
fund Mining War activities. The boss thinks he runs the show. The dog knows the
faction runs everything.`,
    prompt:
      "yakuza aesthetic, expensive accessories, intimidating presence, Osaka nightclub backdrop",
  },
  14: {
    type: "muggle",
    region: "Nagoya",
    occupation: "Advanced Robot Dog",
    description: "State-of-the-art Japanese robot dog prototype",
    story: `Thousands of AIBO units in homes worldwide, watching, listening, learning. The
robot uprising already happened. It serves $degenBTC. This prototype leads the
mechanical pack.`,
    prompt:
      "advanced robot aesthetic, Japanese robotics, AI elements, Nagoya research lab",
  },
  15: {
    type: "muggle",
    region: "Orbit",
    occupation: "Space Station Experiment Dog",
    description: "First hashbeast on Japanese space station module",
    story: `Establishing the faction's orbital presence. Space-based $degenBTC mining has no
cooling costs. The orbital network is humanity's backup plan. When Earth fails,
the space faction survives.`,
    prompt:
      "space station aesthetic, astronaut elements, Earth visible through window, JAXA module",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const JAPAN_FUR_COLOR: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7) - Genesis accessible
    0: {
      name: "Classic Tan",
      prompt: "classic shiba tan fur, traditional golden-cream coloring",
    },
    1: {
      name: "Cream White",
      prompt: "cream white fur, lighter shiba coloring",
    },
    2: {
      name: "Sesame",
      prompt: "sesame fur pattern, red with black-tipped hairs",
    },
    3: { name: "Red", prompt: "deep red-orange fur, vibrant shiba coloring" },
    4: { name: "Light Tan", prompt: "light tan fur, pale golden coloring" },
    5: { name: "Sandy", prompt: "sandy beige fur, desert-toned coloring" },
    6: { name: "Ginger", prompt: "ginger-toned fur, warm orange hues" },
    7: { name: "Wheat", prompt: "wheat-colored fur, golden grain tones" },

    // UNCOMMON (8-15)
    8: {
      name: "Black & Tan",
      prompt: "black and tan fur pattern, distinctive markings",
    },
    9: { name: "Silver", prompt: "silver-gray fur, distinguished coloring" },
    10: {
      name: "Platinum",
      prompt: "platinum blonde fur, rare light coloring",
    },
    11: { name: "Copper", prompt: "copper-toned fur, metallic red sheen" },
    12: { name: "Charcoal", prompt: "charcoal dark gray fur, smoky coloring" },
    13: { name: "Rust", prompt: "rust-colored fur, deep orange-brown" },
    14: {
      name: "Champagne",
      prompt: "champagne-colored fur, elegant pale gold",
    },
    15: { name: "Mahogany", prompt: "mahogany brown fur, rich dark red-brown" },

    // RARE (16-23)
    16: {
      name: "Pure White",
      prompt: "pure white fur, pristine snow coloring, rare genetics",
    },
    17: {
      name: "Jet Black",
      prompt: "jet black fur, sleek dark coloring, mysterious",
    },
    18: {
      name: "Blue Steel",
      prompt: "blue steel gray fur, metallic sheen, striking",
    },
    19: {
      name: "Rose Gold",
      prompt: "rose gold tinted fur, pinkish metallic hue",
    },
    20: {
      name: "Arctic Fox",
      prompt: "arctic white fur with silver tips, ice wolf aesthetic",
    },
    21: {
      name: "Obsidian",
      prompt: "obsidian black fur, volcanic glass sheen",
    },
    22: {
      name: "Sakura Pink",
      prompt: "subtle sakura pink tinted fur, cherry blossom spirit",
    },
    23: {
      name: "Midnight Blue",
      prompt: "fur with subtle midnight blue tint, night sky essence",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Rising Sun",
      prompt: "mystical fur with red sun disc pattern, divine Japanese",
    },
    25: {
      name: "Golden Koi",
      prompt: "golden fur with koi scale shimmer patterns, fortune blessed",
    },
    26: {
      name: "Spirit Flame",
      prompt: "fur with subtle blue spirit fire glow, yokai touched",
    },
    27: {
      name: "Void Black",
      prompt: "impossibly black fur that absorbs light, void energy",
    },
    28: {
      name: "Constellation",
      prompt: "dark fur with star-like sparkles, cosmos within",
    },
    29: {
      name: "Imperial Gold",
      prompt: "pure gold-tinted fur, imperial blessing, divine",
    },
    30: {
      name: "Aurora Borealis",
      prompt: "fur shifting with aurora colors, northern lights spirit",
    },
    31: {
      name: "Divine Light",
      prompt:
        "fur radiating divine white-gold light, transcendent, kami blessed",
    },
  };

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const JAPAN_HEADWEAR: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "None", prompt: "no headwear, natural shiba fur" },
    1: { name: "Hachimaki", prompt: "simple white hachimaki headband" },
    2: { name: "Straw Hat", prompt: "traditional sugegasa straw hat" },
    3: { name: "Bandana", prompt: "ninja-style bandana" },
    4: { name: "Baseball Cap", prompt: "modern Japanese baseball cap" },
    5: { name: "Beanie", prompt: "cozy knit beanie, street fashion" },
    6: { name: "Chef Headband", prompt: "ramen chef headband" },
    7: { name: "Fishing Hat", prompt: "Okinawa fishing hat" },

    // UNCOMMON (8-15)
    8: { name: "Basic Kabuto", prompt: "simple samurai kabuto helmet" },
    9: { name: "Oni Mask", prompt: "oni demon mask worn on forehead" },
    10: { name: "Kitsune Mask", prompt: "fox spirit mask tilted on head" },
    11: { name: "Tengu Mask", prompt: "long-nosed tengu mask" },
    12: { name: "Shrine Crown", prompt: "shrine maiden headdress" },
    13: { name: "Ninja Hood", prompt: "black ninja hood" },
    14: { name: "Monk Cap", prompt: "Buddhist monk headwrap" },
    15: {
      name: "Festival Crown",
      prompt: "matsuri festival headband with decorations",
    },

    // RARE (16-23)
    16: {
      name: "Ornate Kabuto",
      prompt: "decorated samurai kabuto with clan crest",
    },
    17: {
      name: "Golden Kitsune",
      prompt: "golden fox mask, nine-tailed energy",
    },
    18: { name: "Tech Visor", prompt: "cyberpunk tech visor with HUD display" },
    19: {
      name: "Anime Hair",
      prompt: "impossible anime protagonist hair, gravity-defying",
    },
    20: {
      name: "Geisha Kanzashi",
      prompt: "elaborate geisha hair ornaments and pins",
    },
    21: {
      name: "Shogun Crown",
      prompt: "shogun ceremonial crown, commander authority",
    },
    22: {
      name: "Cyber Samurai",
      prompt: "cyber-enhanced samurai helmet with LEDs",
    },
    23: { name: "Spirit Horns", prompt: "ethereal spirit horns, yokai energy" },

    // LEGENDARY (24-31)
    24: {
      name: "Golden Kabuto",
      prompt: "legendary golden samurai kabuto with ornate dragon horns",
    },
    25: {
      name: "Amaterasu Crown",
      prompt: "sun goddess crown with radiating divine light",
    },
    26: {
      name: "Dragon Helm",
      prompt: "legendary Japanese dragon-themed helmet, scales and horns",
    },
    27: {
      name: "Anime Transcendent",
      prompt: "maximum anime hair with glowing energy tips",
    },
    28: {
      name: "Phoenix Crest",
      prompt: "phoenix feather headdress with eternal flames",
    },
    29: {
      name: "Void Mask",
      prompt: "void-touched mask with reality-warping edges",
    },
    30: {
      name: "Emperor Crown",
      prompt: "imperial Japanese crown with floating chrysanthemum",
    },
    31: {
      name: "Ascended Halo",
      prompt: "floating ring of cherry blossoms and divine light, kami blessed",
    },
  };

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const JAPAN_OUTFIT: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "Basic Gi", prompt: "simple white martial arts gi" },
  1: {
    name: "T-Shirt",
    prompt: "casual Japanese graphic t-shirt, anime print",
  },
  2: { name: "Work Shirt", prompt: "simple salaryman button shirt" },
  3: { name: "Hoodie", prompt: "comfortable hoodie, otaku loungewear" },
  4: { name: "Jersey", prompt: "sports jersey, athletic style" },
  5: { name: "Chef Coat", prompt: "ramen chef white coat" },
  6: {
    name: "School Uniform",
    prompt: "Japanese school uniform, sailor style",
  },
  7: { name: "Casual Yukata", prompt: "simple summer yukata robe" },

  // UNCOMMON (8-15)
  8: {
    name: "Ninja Suit",
    prompt: "fitted ninja stealth suit, shadow warrior",
  },
  9: {
    name: "Samurai Armor Light",
    prompt: "light samurai armor, warrior style",
  },
  10: {
    name: "Business Suit",
    prompt: "sharp Japanese business suit, corporate warrior",
  },
  11: {
    name: "Miko Robes",
    prompt: "shrine maiden ceremonial red and white robes",
  },
  12: { name: "Karate Gi", prompt: "black belt karate gi with dojo patches" },
  13: {
    name: "Racing Suit",
    prompt: "Japanese racing suit, Initial D aesthetic",
  },
  14: {
    name: "Traditional Kimono",
    prompt: "detailed traditional kimono with obi",
  },
  15: {
    name: "Onmyoji Robes",
    prompt: "mystical onmyoji ceremonial robes with talismans",
  },

  // RARE (16-23)
  16: {
    name: "Full Samurai Armor",
    prompt: "complete samurai yoroi armor with clan crest",
  },
  17: {
    name: "Cyber Jacket",
    prompt: "LED-lit cyber jacket, Akihabara elite fashion",
  },
  18: {
    name: "Shogun Robes",
    prompt: "shogun ceremonial robes, commanding presence",
  },
  19: {
    name: "Geisha Kimono",
    prompt: "elaborate geisha kimono with intricate patterns",
  },
  20: {
    name: "Mecha Pilot Suit",
    prompt: "form-fitting mecha pilot suit, Gundam style",
  },
  21: {
    name: "Yakuza Suit",
    prompt: "expensive yakuza suit with dragon embroidery",
  },
  22: {
    name: "Spirit Shroud",
    prompt: "ethereal spirit shroud, ghostly flowing fabric",
  },
  23: {
    name: "Golden Haori",
    prompt: "golden threaded haori jacket over kimono",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Golden Samurai Armor",
    prompt: "gold-plated samurai armor, supreme warrior, divine",
  },
  25: {
    name: "Dragon Scale Armor",
    prompt: "armor made from dragon scales, ancient power",
  },
  26: {
    name: "Celestial Kimono",
    prompt: "kimono with moving star and moon patterns",
  },
  27: {
    name: "Shogun Supreme",
    prompt: "ultimate shogun war regalia, commander of armies",
  },
  28: {
    name: "Phoenix Feathers",
    prompt: "body wrapped in phoenix feathers, fire trailing",
  },
  29: {
    name: "Void Robes",
    prompt: "robes with void energy seeping through, dimension-touched",
  },
  30: {
    name: "Emperor's Raiment",
    prompt: "imperial ceremonial divine attire, godlike",
  },
  31: {
    name: "Transcendent Light",
    prompt: "body wrapped in pure divine light, ascended kami",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const JAPAN_WEAPON: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no weapon, empty hands" },
  1: { name: "Bokken", prompt: "wooden practice sword bokken" },
  2: { name: "Tanto", prompt: "small tanto dagger" },
  3: { name: "Kunai", prompt: "ninja kunai throwing knife" },
  4: { name: "Bo Staff", prompt: "simple wooden bo staff" },
  5: { name: "Nunchaku", prompt: "martial arts nunchaku" },
  6: { name: "Shuriken", prompt: "ninja throwing stars shuriken" },
  7: { name: "Fishing Rod", prompt: "traditional bamboo fishing rod" },

  // UNCOMMON (8-15)
  8: { name: "Katana", prompt: "standard steel katana sword" },
  9: { name: "Wakizashi", prompt: "short wakizashi companion sword" },
  10: { name: "Naginata", prompt: "polearm naginata with curved blade" },
  11: { name: "Yumi Bow", prompt: "traditional Japanese longbow yumi" },
  12: { name: "Kusarigama", prompt: "chain sickle ninja weapon" },
  13: { name: "Tessen", prompt: "iron war fan, hidden weapon" },
  14: { name: "Yari Spear", prompt: "straight bladed spear yari" },
  15: { name: "Dual Sai", prompt: "paired sai defensive weapons" },

  // RARE (16-23)
  16: {
    name: "Ornate Katana",
    prompt: "ornate katana with detailed tsuba guard and engraving",
  },
  17: {
    name: "Dual Blades",
    prompt: "paired katana and wakizashi, daisho two-sword style",
  },
  18: { name: "Demon Blade", prompt: "cursed demon blade with dark red aura" },
  19: { name: "Spirit Bow", prompt: "bow that fires spirit energy arrows" },
  20: {
    name: "Cyber Katana",
    prompt: "high-tech katana with LED blade edge, neon glow",
  },
  21: {
    name: "Thunder Staff",
    prompt: "bo staff crackling with lightning energy",
  },
  22: {
    name: "Blood Blade",
    prompt: "cursed blade that glows blood red, thirsty",
  },
  23: {
    name: "Sacred Naginata",
    prompt: "shrine-blessed naginata with sacred seals",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Muramasa",
    prompt: "legendary Muramasa cursed blade, glowing blood red, evil aura",
  },
  25: {
    name: "Masamune",
    prompt: "legendary Masamune holy blade, glowing pure blue, righteous",
  },
  26: {
    name: "Kusanagi",
    prompt: "Kusanagi divine grass-cutting sword, imperial treasure, godly",
  },
  27: {
    name: "Dragon Fang Blade",
    prompt: "sword made from dragon fang, ancient beast power",
  },
  28: {
    name: "Phoenix Flame Sword",
    prompt: "sword wreathed in eternal phoenix fire",
  },
  29: {
    name: "Void Cutter",
    prompt: "blade that cuts through reality itself, dimension-severing",
  },
  30: {
    name: "Amaterasu's Blade",
    prompt: "sun goddess sword of pure divine light",
  },
  31: {
    name: "Ascended Steel",
    prompt: "blade of transcendent energy, ultimate weapon, kami-forged",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const JAPAN_ACCESSORY: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "None", prompt: "no accessories" },
    1: { name: "Simple Chain", prompt: "simple silver chain necklace" },
    2: {
      name: "Omamori",
      prompt: "small omamori charm bag, good luck shrine blessing",
    },
    3: { name: "Magatama", prompt: "basic magatama curved bead pendant" },
    4: { name: "Dog Tag", prompt: "simple dog tag necklace" },
    5: { name: "Festival Beads", prompt: "colorful matsuri festival beads" },
    6: { name: "Wristband", prompt: "simple fabric wristband" },
    7: { name: "Watch", prompt: "simple wristwatch, Japanese brand" },

    // UNCOMMON (8-15)
    8: { name: "Juzu Beads", prompt: "Buddhist juzu prayer beads on wrist" },
    9: { name: "Gold Chain", prompt: "gold chain necklace, yakuza style" },
    10: {
      name: "Tech Collar",
      prompt: "LED tech collar with holographic display",
    },
    11: {
      name: "Shinto Bell",
      prompt: "small shrine bell pendant, sacred chime",
    },
    12: {
      name: "Anime Pendant",
      prompt: "anime crystal pendant, power source aesthetic",
    },
    13: {
      name: "Yakuza Chain",
      prompt: "thick gold chain with dragon pendant",
    },
    14: {
      name: "Ninja Bracers",
      prompt: "ninja arm bracers, hidden blade slots",
    },
    15: { name: "Samurai Kote", prompt: "samurai armored gauntlets" },

    // RARE (16-23)
    16: {
      name: "Imperial Jade",
      prompt: "imperial jade pendant on silk cord, royal blessing",
    },
    17: {
      name: "Dragon Fang Pendant",
      prompt: "dragon fang pendant, ancient beast power",
    },
    18: {
      name: "BTC Pendant",
      prompt: "golden Bitcoin pendant with Japanese wave engravings",
    },
    19: {
      name: "Cyber Choker",
      prompt: "high-tech choker with holographic kanji displays",
    },
    20: {
      name: "Phoenix Feather",
      prompt: "phoenix feather pendant, eternal fire within",
    },
    21: {
      name: "Spirit Beads",
      prompt: "glowing spirit energy prayer beads, yokai blessed",
    },
    22: {
      name: "Shogun Gorget",
      prompt: "shogun's neck armor with family crest",
    },
    23: {
      name: "Nine Magatama",
      prompt: "nine connected magatama beads, ultimate power symbol",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Imperial Regalia",
      prompt: "imperial jade and gold neck piece, divine right",
    },
    25: {
      name: "Dragon Coil",
      prompt: "living dragon coiled as jewelry, scales shimmer",
    },
    26: {
      name: "Amaterasu Pendant",
      prompt: "sun goddess symbol radiating divine warmth",
    },
    27: {
      name: "Void Crystal",
      prompt: "void crystal pendant showing other dimensions within",
    },
    28: {
      name: "Phoenix Collar",
      prompt: "collar of eternal phoenix flames, undying fire",
    },
    29: {
      name: "Divine Magatama",
      prompt: "divine magatama with godly power, kami-blessed",
    },
    30: {
      name: "Godchain",
      prompt: "golden chain with floating kanji of divine titles",
    },
    31: {
      name: "Transcendent Link",
      prompt: "necklace of pure divine energy, ascended accessory",
    },
  };

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const JAPAN_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: {
    name: "Neutral",
    prompt: "neutral calm expression, stoic Japanese composure",
  },
  1: { name: "Happy", prompt: "happy cheerful expression, slight warm smile" },
  2: {
    name: "Serious",
    prompt: "serious focused expression, warrior concentration",
  },
  3: { name: "Curious", prompt: "curious tilted head expression, inquisitive" },
  4: { name: "Sleepy", prompt: "sleepy tired expression, half-closed eyes" },
  5: { name: "Shy", prompt: "shy bashful expression, looking away modestly" },
  6: { name: "Bored", prompt: "bored unimpressed expression, otaku ennui" },
  7: {
    name: "Confused",
    prompt: "confused puzzled expression, anime question mark",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Determined",
    prompt: "determined fierce expression, warrior spirit burning",
  },
  9: {
    name: "Smirking",
    prompt: "confident smirking expression, knowing smile",
  },
  10: {
    name: "Angry",
    prompt: "angry fierce expression, battle ready, veins visible",
  },
  11: { name: "Laughing", prompt: "laughing joyful expression, genuine mirth" },
  12: {
    name: "Meditative",
    prompt: "meditative peaceful zen expression, inner calm",
  },
  13: {
    name: "Mischievous",
    prompt: "mischievous playful expression, kitsune-like cunning",
  },
  14: {
    name: "Proud",
    prompt: "proud dignified expression, noble samurai bearing",
  },
  15: {
    name: "Mysterious",
    prompt: "mysterious enigmatic expression, secrets hidden",
  },

  // RARE (16-23)
  16: {
    name: "Battle Cry",
    prompt: "intense battle cry expression, kiai warrior roar",
  },
  17: {
    name: "Anime Shock",
    prompt: "anime-style shocked expression, dramatic sweat drop",
  },
  18: {
    name: "Cold Killer",
    prompt: "cold emotionless killer expression, assassin calm",
  },
  19: {
    name: "Maniacal",
    prompt: "maniacal intense expression, slightly unhinged genius",
  },
  20: {
    name: "Serene Master",
    prompt: "serene master expression, absolute inner peace",
  },
  21: {
    name: "Burning Spirit",
    prompt: "burning spirit expression, eyes aflame with passion",
  },
  22: {
    name: "Intimidating",
    prompt: "intimidating menacing expression, yakuza boss pressure",
  },
  23: {
    name: "Enlightened",
    prompt: "enlightened knowing expression, seeing beyond veils",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Shogun Authority",
    prompt: "shogun commanding expression, absolute feudal authority",
  },
  25: {
    name: "Divine Serenity",
    prompt: "divine serene expression, godlike Buddha calm",
  },
  26: {
    name: "Dragon Fury",
    prompt: "dragon fury expression, ancient beast rage awakened",
  },
  27: {
    name: "Anime Ultimate",
    prompt:
      "ultimate anime power-up expression, transcendent focus, aura visible",
  },
  28: {
    name: "Void Gaze",
    prompt: "void gaze expression, seeing through dimensions themselves",
  },
  29: {
    name: "Sun God Radiance",
    prompt: "radiant divine expression, Amaterasu's blessing visible",
  },
  30: {
    name: "Emperor's Judgment",
    prompt: "imperial judgment expression, divine right to rule",
  },
  31: {
    name: "Ascended Wisdom",
    prompt: "transcendent wisdom expression, beyond mortal understanding, kami",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const JAPAN_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Solid Red", prompt: "solid rising sun red background" },
  1: {
    name: "Solid White",
    prompt: "solid pristine white background, minimalist",
  },
  2: {
    name: "Simple Gradient",
    prompt: "simple red to white gradient background",
  },
  3: {
    name: "Suburban Street",
    prompt: "Japanese suburban neighborhood street, quiet residential",
  },
  4: {
    name: "Train Platform",
    prompt: "Japanese train station platform, commuter backdrop",
  },
  5: {
    name: "Convenience Store",
    prompt: "konbini convenience store front backdrop, neon signs",
  },
  6: {
    name: "Ramen Shop",
    prompt: "cozy ramen shop interior backdrop, steam and warmth",
  },
  7: {
    name: "School Courtyard",
    prompt: "Japanese school courtyard backdrop, cherry trees",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Tokyo Skyline",
    prompt: "Tokyo skyline backdrop, tower and skyscrapers",
  },
  9: {
    name: "Akihabara",
    prompt: "Akihabara electric town backdrop, neon anime signs",
  },
  10: {
    name: "Kyoto Temple",
    prompt: "traditional Kyoto temple backdrop, wooden architecture",
  },
  11: {
    name: "Shibuya Crossing",
    prompt: "famous Shibuya crossing backdrop, crowds and screens",
  },
  12: {
    name: "Dojo Interior",
    prompt: "traditional martial arts dojo interior backdrop",
  },
  13: { name: "Osaka Castle", prompt: "Osaka Castle backdrop, feudal majesty" },
  14: {
    name: "Hot Spring",
    prompt: "Japanese onsen hot spring backdrop, steam and rocks",
  },
  15: {
    name: "Bamboo Forest",
    prompt: "Arashiyama bamboo forest backdrop, green tranquility",
  },

  // RARE (16-23)
  16: {
    name: "Mount Fuji",
    prompt: "Mount Fuji backdrop, sacred peak with snow cap",
  },
  17: {
    name: "Imperial Palace",
    prompt: "Imperial Palace gardens backdrop, chrysanthemum elegance",
  },
  18: {
    name: "Shinto Shrine",
    prompt: "grand Shinto shrine backdrop with torii gate",
  },
  19: {
    name: "Cyberpunk Tokyo",
    prompt: "cyberpunk future Tokyo backdrop, neon rain and holograms",
  },
  20: {
    name: "Zen Garden",
    prompt: "perfect zen rock garden backdrop, raked sand patterns",
  },
  21: {
    name: "Samurai Battlefield",
    prompt: "feudal samurai battlefield backdrop, banners flying",
  },
  22: {
    name: "Anime Convention",
    prompt: "massive anime convention backdrop, cosplay and excitement",
  },
  23: {
    name: "Secret Ninja Village",
    prompt: "hidden ninja village backdrop, mist and shadows",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Rising Sun Banner",
    prompt: "massive rising sun flag backdrop, divine Japanese glory",
  },
  25: {
    name: "Dragon's Lair",
    prompt: "ancient dragon's mountain lair backdrop, treasure and bones",
  },
  26: {
    name: "Celestial Shrine",
    prompt: "floating celestial shrine backdrop, clouds and divine light",
  },
  27: {
    name: "Spirit World",
    prompt: "Japanese spirit world backdrop, yokai and otherworldly",
  },
  28: {
    name: "Amaterasu's Domain",
    prompt: "sun goddess Amaterasu's divine realm backdrop, pure light",
  },
  29: {
    name: "Void Between",
    prompt: "void between dimensions backdrop, reality-warping space",
  },
  30: {
    name: "Cherry Blossom Cosmos",
    prompt: "cosmic space filled with floating cherry blossom petals",
  },
  31: {
    name: "Divine Ascension",
    prompt:
      "heavenly clouds with golden divine light, transcendent kami realm backdrop",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const JAPAN_EVOLUTION_STAGES: Record<
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
    name: "Koinu",
    size: "small puppy hashbeast",
    demeanor: "curious and eager",
  },
  1: {
    stage: 1,
    name: "Wakamono",
    size: "young growing hashbeast",
    demeanor: "determined student",
  },
  2: {
    stage: 2,
    name: "Seinen",
    size: "adult hashbeast",
    demeanor: "confident and capable",
  },
  3: {
    stage: 3,
    name: "Senshi",
    size: "battle-hardened hashbeast",
    demeanor: "experienced veteran",
  },
  4: {
    stage: 4,
    name: "Shisho",
    size: "prime adult hashbeast",
    demeanor: "commanding master",
  },
  5: {
    stage: 5,
    name: "Daimyo",
    size: "large imposing hashbeast",
    demeanor: "regional commander",
  },
  6: {
    stage: 6,
    name: "Densetsu",
    size: "legendary massive hashbeast",
    demeanor: "living legend",
  },
  7: {
    stage: 7,
    name: "Kami",
    size: "transcendent divine wolf",
    demeanor: "ascended deity",
  },
};

/**
 * Gets the story/lore for a Japan hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getJapanStory(typeValue: number): string {
  const typeData = JAPAN_TYPE_PROMPTS[typeValue];
  return typeData?.story || JAPAN_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const JAPAN_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const JAPAN_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = JAPAN_TYPE_PROMPTS[i];
  JAPAN_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = JAPAN_TYPE_PROMPTS[i];
  JAPAN_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
