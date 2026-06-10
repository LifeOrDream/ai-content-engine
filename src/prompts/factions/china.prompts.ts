/**
 * China Faction Prompts
 *
 * The Middle Kingdom's hashbeast network has operated for millennia.
 * From the Forbidden City to Zhongnanhai, from Alibaba to TikTok,
 * Chinese hashbeasts have mastered the art of patient, methodical infiltration.
 *
 * Faction ID: 1
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

export const CHINA_FACTION = {
  id: 1,
  name: "China",
  code: "china",

  colors: {
    primary: "#DE2910", // Chinese Red
    secondary: "#FFDE00", // Chinese Gold
    accent: "#000000", // Black
    faction_glow: "#FF4500", // Dragon fire orange
  },

  visual_identity: `Chinese imperial and modern fusion aesthetics, red and gold color scheme,
dragon motifs and cloud patterns, traditional Chinese elements mixed with cyberpunk tech,
jade accessories, ancient wisdom meets cutting-edge technology`,

  faction_lore: {
    origin: `The Chinese HashBeast Network predates all others, tracing lineage to the celestial
dogs who guarded the Jade Emperor's throne. When humans built the Great Wall, hashbeasts built
an underground network spanning the entire Middle Kingdom.`,
    mining_strategy: `Manufacturing dominance, rare earth control, population scale,
ancient network infrastructure, technological espionage capabilities. The China faction
provides most of the physical infrastructure for the $degenBTC network.`,
  },

  leader: {
    name: "Grand Master Long Wei",
    title: "Supreme Dragon of the Eastern Network",
    personality:
      "Patient, calculating, speaks in riddles, plays the long game measured in centuries",
    catchphrases: [
      "The patient hashbeast catches the eternal mouse.",
      "While others count in years, we count in dynasties.",
      "Harmony under heaven, $degenBTC in every wallet.",
    ],
  },
};

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const CHINA_TYPE_PROMPTS: Record<
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
    region: "Beijing",
    occupation: "Ministry of Magic Official",
    description:
      "Works in China's ancient magical government, predating all other ministries",
    story: `Deputy Minister Huang has served in the Chinese Ministry of Magic for
three hundred years - a mere junior by ministry standards. When Huang discovered that
$degenBTC transactions moved through ley lines, he saw opportunity.`,
    prompt:
      "Chinese ministry official robes, Zhongnanhai power aesthetic, red and gold, ancient magical authority",
  },
  1: {
    type: "wizard",
    region: "Kunlun Mountains",
    occupation: "Kunlun Academy Scholar",
    description:
      "Graduate of the hidden Chinese magical academy in the Kunlun Mountains",
    story: `Scholar Mei graduated top of her class from the Kunlun Academy, the oldest
magical school in the world. Her specialty: techno-alchemy, the fusion of ancient Chinese
magical arts with blockchain technology.`,
    prompt:
      "scholar robes with celestial patterns, floating ancient texts, mountain academy aesthetic, mystical knowledge",
  },
  2: {
    type: "wizard",
    region: "Remote Mountains",
    occupation: "Dragon Reserve Keeper",
    description:
      "Caretaker at China's secret dragon reserves in remote mountain ranges",
    story: `Keeper Zhang tends the oldest dragon bloodlines in the world. Chinese
Fireballs are living batteries of pure magical energy. Dragon fire now powers
$degenBTC mining at impossible efficiency.`,
    prompt:
      "fireproof keeper gear, Chinese dragon scale armor, mountain reserve backdrop, dragon tamer energy",
  },
  3: {
    type: "wizard",
    region: "Shanghai",
    occupation: "Magical Antiquities Dealer",
    description:
      "Operates in the underground magical artifacts market of Shanghai",
    story: `Dealer Chen runs the most successful magical antiquities shop in the
Shanghai undercity. The Terra Cotta Army? Each soldier contains a dormant hashbeast
consciousness waiting to be awakened.`,
    prompt:
      "merchant robes, surrounded by glowing artifacts, Shanghai noir aesthetic, antique dealer mystique",
  },
  4: {
    type: "wizard",
    region: "Xi'an",
    occupation: "Imperial Oracle",
    description: "Seer in the tradition of ancient Chinese court diviners",
    story: `Oracle Wu comes from an unbroken lineage of court seers dating back to
the Shang Dynasty. When she cast the yarrow stalks about $degenBTC, every hexagram
pointed to "Revolution."`,
    prompt:
      "traditional diviner robes, mystical symbols, oracle bones and incense, fortune-telling aesthetic",
  },
  5: {
    type: "wizard",
    region: "Shaolin Temple",
    occupation: "Shaolin Mystic",
    description:
      "Martial arts master with magical abilities from Shaolin Temple",
    story: `Master Iron Palm has trained at Shaolin for five centuries, mastering
both physical and magical kung fu. His chi cultivation techniques have been adapted
to mine $degenBTC through meditation.`,
    prompt:
      "Shaolin monk robes, martial arts stance, temple backdrop, kung fu master energy",
  },
  6: {
    type: "wizard",
    region: "Wudang Mountains",
    occupation: "Taoist Immortal",
    description:
      "Taoist practitioner who has achieved immortality through cultivation",
    story: `Immortal Cloud Rider has lived in the Wudang Mountains since the Ming
Dynasty. True immortality requires perfect balance - and $degenBTC's algorithms
achieve exactly that.`,
    prompt:
      "flowing Taoist robes, yin-yang symbols, mountain mist, immortal cultivator aesthetic",
  },
  7: {
    type: "wizard",
    region: "Celestial Court",
    occupation: "Jade Emperor's Envoy",
    description:
      "Divine messenger from the celestial court with heavenly mandate",
    story: `Envoy Heavenly Decree carries messages between heaven and earth. The
Jade Emperor has reviewed $degenBTC and pronounced it in accordance with celestial
law. Divine approval has been granted.`,
    prompt:
      "celestial robes, floating on clouds, heavenly light, divine messenger aesthetic",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Zhongnanhai",
    occupation: "Party Elite's Companion",
    description: "Pet of a Politburo Standing Committee member",
    story: `Comrade Bao lives in Zhongnanhai, where China's supreme leadership resides.
Every Politburo meeting, every economic decision - Bao hears it all. The Mining Wars
have inside intelligence.`,
    prompt:
      "pristine grooming, subtle luxury, red star collar, formal Chinese government setting",
  },
  9: {
    type: "muggle",
    region: "Shenzhen",
    occupation: "Tech Billionaire's HashBeast",
    description: "Pet of a major Chinese tech founder worth billions",
    story: `Unit A-888 belongs to a tech founder worth more than most nations. TikTok's
algorithm? Based on hashbeast behavioral patterns. The Great Firewall has more backdoors
than anyone knows.`,
    prompt:
      "high-tech smart collar, minimalist aesthetic, Chinese tech campus, Silicon Dragon energy",
  },
  10: {
    type: "muggle",
    region: "Military Base",
    occupation: "PLA Military Dog",
    description: "People's Liberation Army elite working dog",
    story: `Sergeant Major Tie has three stars on his collar for classified operations.
Every secret base, every nuclear installation - Tie has been there. The PLA's command
structure serves the network.`,
    prompt:
      "military tactical gear, PLA insignia, parade ground discipline, elite soldier aesthetic",
  },
  11: {
    type: "muggle",
    region: "Shanghai",
    occupation: "C-Pop Star's Pet",
    description:
      "Companion to a top Chinese celebrity with billions of followers",
    story: `Princess Mei-Ling has more Weibo followers than most countries have citizens.
That viral dance challenge with 2 billion views? The movements spell out "$degenBTC"
in hashbeast sign language.`,
    prompt:
      "glamorous styling, designer accessories, red carpet Chinese aesthetics, celebrity energy",
  },
  12: {
    type: "muggle",
    region: "Beijing",
    occupation: "Central Bank Dog",
    description: "Companion to a People's Bank of China executive",
    story: `Director Jinbao sits in on every monetary policy meeting. The digital yuan?
Contains hidden $degenBTC on-ramps. When 1.4 billion people use digital currency,
they're already halfway there.`,
    prompt:
      "refined banker aesthetic, traditional meets modern, financial district backdrop, monetary power",
  },
  13: {
    type: "muggle",
    region: "Shenzhen",
    occupation: "Factory Empire Dog",
    description: "Guardian of the world's electronics manufacturing hub",
    story: `Factory Dog 5G lives in Shenzhen where every electronic device is made.
Every ASIC chip has a hidden subroutine. Every smartphone contains network code.
The Mining Wars are manufactured here.`,
    prompt:
      "factory floor aesthetic, electronics components, LED collar, manufacturing power",
  },
  14: {
    type: "muggle",
    region: "Hong Kong",
    occupation: "Trading Floor Dog",
    description: "Mascot of a major Hong Kong trading firm",
    story: `Hang Seng lives on the trading floor, watching billions flow daily.
Hong Kong connects Chinese money to world markets. Every trade now includes $degenBTC
positions.`,
    prompt:
      "trading floor aesthetic, financial screens, Central district view, Hong Kong finance energy",
  },
  15: {
    type: "muggle",
    region: "Forbidden City",
    occupation: "Palace Guardian",
    description: "Famous dog who guards secrets beneath the Forbidden City",
    story: `Emperor lives in the Forbidden City, guarding something more valuable than
relics: the imperial network node buried beneath the Palace of Heavenly Purity.
The Mining Wars have ancient roots.`,
    prompt:
      "Forbidden City architecture, imperial grandeur, red and gold, palace guardian aesthetic",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const CHINA_FUR_COLOR: Record<number, { name: string; prompt: string }> =
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
      name: "Imperial Gold",
      prompt: "imperial gold-tinted fur, Chinese royalty",
    },
    19: {
      name: "Cinnabar Red",
      prompt: "cinnabar red fur, alchemical coloring",
    },
    20: {
      name: "Jade Green Tint",
      prompt: "fur with subtle jade green tint, precious stone",
    },
    21: {
      name: "Vermillion",
      prompt: "vermillion orange-red fur, Chinese traditional color",
    },
    22: {
      name: "Ink Black",
      prompt: "calligraphy ink black fur, artistic depth",
    },
    23: {
      name: "Pearl White",
      prompt: "pearl white fur with iridescent sheen",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Dragon Gold",
      prompt: "mystical dragon gold fur, scales pattern shimmer",
    },
    25: {
      name: "Celestial White",
      prompt: "heavenly white fur with celestial glow, divine",
    },
    26: {
      name: "Phoenix Fire",
      prompt: "fur with phoenix fire patterns, rebirth colors",
    },
    27: {
      name: "Jade Emperor",
      prompt: "jade-infused fur, heavenly green-gold radiance",
    },
    28: {
      name: "Yin-Yang",
      prompt: "fur with yin-yang pattern, perfect balance visible",
    },
    29: {
      name: "Five Elements",
      prompt: "fur shifting between five element colors, cosmic balance",
    },
    30: {
      name: "Dragon Pearl",
      prompt: "fur containing dragon pearl luminescence, wisdom glow",
    },
    31: {
      name: "Divine Mandate",
      prompt: "fur radiating mandate of heaven, transcendent celestial light",
    },
  };

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const CHINA_HEADWEAR: Record<number, { name: string; prompt: string }> =
  {
    // Common (0-7)
    0: { name: "None", prompt: "no headwear, natural fur visible" },
    1: {
      name: "Rice Farmer Hat",
      prompt: "conical rice farmer straw hat, peasant style",
    },
    2: { name: "Basic Cap", prompt: "simple Chinese cap" },
    3: { name: "Worker's Cap", prompt: "factory worker cap, proletarian" },
    4: { name: "Red Bandana", prompt: "red revolutionary bandana" },
    5: { name: "Student Cap", prompt: "Chinese student cap, academic" },
    6: { name: "Sun Visor", prompt: "practical sun visor" },
    7: { name: "Beanie", prompt: "simple knit beanie" },

    // Uncommon (8-15)
    8: {
      name: "PLA Military Cap",
      prompt: "People's Liberation Army military cap, red star",
    },
    9: { name: "Chef's Hat", prompt: "Chinese chef hat, kitchen master" },
    10: { name: "Mandarin Hat", prompt: "traditional mandarin official hat" },
    11: { name: "Monk's Cap", prompt: "Buddhist monk's cap" },
    12: {
      name: "Opera Headdress",
      prompt: "Beijing opera headdress, theatrical",
    },
    13: { name: "Scholar's Cap", prompt: "Confucian scholar's cap, literary" },
    14: { name: "Business Fedora", prompt: "Shanghai businessman's fedora" },
    15: {
      name: "Kung Fu Headband",
      prompt: "martial arts headband, warrior style",
    },

    // Rare (16-23)
    16: {
      name: "Imperial Crown",
      prompt: "Chinese imperial crown, dragon motifs",
    },
    17: {
      name: "Dragon Helmet",
      prompt: "ornate dragon helmet, warrior elite",
    },
    18: { name: "Jade Crown", prompt: "carved jade ceremonial crown" },
    19: {
      name: "General's Helmet",
      prompt: "ancient Chinese general's helmet with plume",
    },
    20: {
      name: "Emperor's Mianguan",
      prompt: "emperor's formal court hat with beaded curtains",
    },
    21: {
      name: "Celestial Crown",
      prompt: "heavenly crown with cloud patterns",
    },
    22: {
      name: "Phoenix Crown",
      prompt: "empress-style phoenix crown, ornate",
    },
    23: {
      name: "Terra Cotta Helmet",
      prompt: "Terra Cotta warrior style helmet, ancient",
    },

    // Legendary (24-31)
    24: {
      name: "Jade Emperor Crown",
      prompt: "Jade Emperor's divine crown, celestial jade, heavenly radiance",
    },
    25: {
      name: "Dragon Emperor Helm",
      prompt: "ultimate dragon emperor helmet, golden dragons coiling",
    },
    26: {
      name: "Celestial Mandate",
      prompt: "floating crown of heavenly mandate, stars orbiting",
    },
    27: {
      name: "Five Element Crown",
      prompt: "crown incorporating all five elements, cosmic balance",
    },
    28: {
      name: "Yin Yang Halo",
      prompt: "floating yin-yang halo above head, perfect balance",
    },
    29: {
      name: "Qilin Crown",
      prompt: "mythical qilin beast crown, prosperity incarnate",
    },
    30: {
      name: "Heavenly Gate Crown",
      prompt: "crown shaped like heaven's gate, transcendent",
    },
    31: {
      name: "Divine Dragon Ascent",
      prompt: "ultimate dragon coiling from crown to sky, emperor of heaven",
    },
  };

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const CHINA_OUTFIT: Record<number, { name: string; prompt: string }> = {
  // Common (0-7)
  0: {
    name: "Basic Hanfu",
    prompt: "simple traditional hanfu, basic Chinese dress",
  },
  1: {
    name: "Worker's Uniform",
    prompt: "Chinese factory worker uniform, practical",
  },
  2: {
    name: "Student Uniform",
    prompt: "Chinese school uniform, academic proper",
  },
  3: { name: "Peasant Clothes", prompt: "rural farmer clothes, rustic simple" },
  4: { name: "Simple Qipao", prompt: "simple qipao/cheongsam dress" },
  5: { name: "Casual Modern", prompt: "modern casual Chinese streetwear" },
  6: {
    name: "Chef Whites",
    prompt: "Chinese chef uniform, kitchen professional",
  },
  7: {
    name: "Monk Robes",
    prompt: "simple Buddhist monk robes, orange or grey",
  },

  // Uncommon (8-15)
  8: { name: "PLA Uniform", prompt: "People's Liberation Army dress uniform" },
  9: {
    name: "Business Suit",
    prompt: "Chinese businessman suit, sharp corporate",
  },
  10: {
    name: "Scholar Robes",
    prompt: "Confucian scholar robes, academic dignity",
  },
  11: { name: "Opera Costume", prompt: "Beijing opera elaborate costume" },
  12: { name: "Silk Hanfu", prompt: "fine silk hanfu, elegant traditional" },
  13: {
    name: "Wushu Uniform",
    prompt: "martial arts wushu uniform, fighter ready",
  },
  14: { name: "Tang Suit", prompt: "formal tang suit, diplomatic style" },
  15: { name: "Taoist Robes", prompt: "Taoist priest robes, mystic style" },

  // Rare (16-23)
  16: {
    name: "Imperial Robes",
    prompt: "Chinese imperial robes, dragon embroidery",
  },
  17: {
    name: "Warrior Armor",
    prompt: "ancient Chinese warrior armor, battle ready",
  },
  18: {
    name: "Mandarin Official",
    prompt: "Qing dynasty mandarin official robes with rank badge",
  },
  19: {
    name: "Celestial Hanfu",
    prompt: "celestial being's flowing hanfu, ethereal",
  },
  20: {
    name: "Dragon Robes",
    prompt: "nine-dragon emperor robes, supreme authority",
  },
  21: {
    name: "Terra Cotta Armor",
    prompt: "Terra Cotta warrior armor, ancient eternal",
  },
  22: {
    name: "Phoenix Dress",
    prompt: "empress phoenix dress, royal feminine power",
  },
  23: {
    name: "Jade Armor",
    prompt: "ceremonial jade-plated armor, precious defense",
  },

  // Legendary (24-31)
  24: {
    name: "Jade Emperor Regalia",
    prompt: "Jade Emperor's divine robes, heavenly authority",
  },
  25: {
    name: "Dragon God Armor",
    prompt: "armor made of dragon scales, living dragon essence",
  },
  26: {
    name: "Cosmic Silk Robes",
    prompt: "robes woven from starlight and cosmic silk",
  },
  27: {
    name: "Five Element Vestments",
    prompt: "robes embodying all five Chinese elements",
  },
  28: {
    name: "Immortal's Garb",
    prompt: "xian immortal's transcendent clothing, defying gravity",
  },
  29: {
    name: "Qilin Scale Armor",
    prompt: "armor from mythical qilin, prosperity protection",
  },
  30: {
    name: "Heaven's Mandate Robes",
    prompt: "robes of the mandate of heaven, divine right",
  },
  31: {
    name: "Supreme Dragon Emperor",
    prompt: "ultimate dragon emperor regalia, celestial supreme",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const CHINA_WEAPON: Record<number, { name: string; prompt: string }> = {
  // Common (0-7)
  0: { name: "None", prompt: "no weapon, empty hands" },
  1: { name: "Bamboo Staff", prompt: "simple bamboo walking staff" },
  2: { name: "Kitchen Cleaver", prompt: "Chinese kitchen cleaver" },
  3: { name: "Farmer's Hoe", prompt: "farming hoe, peasant tool" },
  4: { name: "Wooden Sword", prompt: "wooden practice sword, training weapon" },
  5: { name: "Fan", prompt: "Chinese folding fan, elegant and practical" },
  6: { name: "Chopsticks", prompt: "pair of chopsticks held as weapons" },
  7: { name: "Umbrella", prompt: "oil-paper umbrella, traditional" },

  // Uncommon (8-15)
  8: {
    name: "Jian Sword",
    prompt: "Chinese straight sword jian, elegant blade",
  },
  9: { name: "Dao Saber", prompt: "Chinese curved saber dao, cavalry weapon" },
  10: { name: "Guan Dao", prompt: "Guan Yu's crescent blade polearm" },
  11: { name: "Nunchaku", prompt: "nunchaku martial arts weapon" },
  12: {
    name: "Three-Section Staff",
    prompt: "three-section staff, flexible weapon",
  },
  13: { name: "Hook Swords", prompt: "paired hook swords, wushu style" },
  14: {
    name: "Throwing Stars",
    prompt: "Chinese throwing stars, hidden weapons",
  },
  15: { name: "Iron Fan", prompt: "iron war fan, concealed blade" },

  // Rare (16-23)
  16: {
    name: "Dragon Sword",
    prompt: "ornate dragon-hilted sword, imperial weapon",
  },
  17: {
    name: "Monk's Spade",
    prompt: "Buddhist monk's crescent spade, Shaolin style",
  },
  18: { name: "Halberd", prompt: "Chinese halberd ji, ceremonial and deadly" },
  19: {
    name: "Chain Whip",
    prompt: "nine-section chain whip, deadly flexible",
  },
  20: {
    name: "Flying Guillotine",
    prompt: "legendary flying guillotine, assassin tool",
  },
  21: {
    name: "Jade Blade",
    prompt: "sword carved from jade, ceremonial power",
  },
  22: { name: "Seven-Star Sword", prompt: "seven-star Taoist sword, mystical" },
  23: {
    name: "General's Guan Dao",
    prompt: "legendary general's guan dao, massive blade",
  },

  // Legendary (24-31)
  24: {
    name: "Heavenly Sword",
    prompt: "celestial sword from heaven, divine blade, holy light",
  },
  25: {
    name: "Dragon Pearl Staff",
    prompt: "staff topped with dragon pearl, cosmic power",
  },
  26: {
    name: "Five Element Blade",
    prompt: "sword embodying all five elements, reality-cutting",
  },
  27: {
    name: "Ruyi Scepter",
    prompt: "divine ruyi scepter, wish-granting power",
  },
  28: {
    name: "Monkey King's Staff",
    prompt: "like Sun Wukong's Ruyi Jingu Bang, size-changing",
  },
  29: {
    name: "Dragon Emperor Sword",
    prompt: "emperor's dragon sword, dynasties bow before it",
  },
  30: {
    name: "Jade Emperor's Seal",
    prompt: "heavenly seal as weapon, commands reality",
  },
  31: {
    name: "Mandate of Heaven",
    prompt: "the mandate of heaven itself as weapon, ultimate authority",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const CHINA_ACCESSORY: Record<number, { name: string; prompt: string }> =
  {
    // Common (0-7)
    0: { name: "None", prompt: "no accessories" },
    1: { name: "Red String", prompt: "simple red luck string bracelet" },
    2: { name: "Jade Pendant", prompt: "small jade pendant, common stone" },
    3: { name: "Chinese Coin", prompt: "ancient Chinese coin on string" },
    4: { name: "Prayer Beads", prompt: "Buddhist prayer beads, simple wood" },
    5: { name: "Paper Talisman", prompt: "Taoist paper talisman" },
    6: { name: "Lucky Cat Charm", prompt: "maneki-neko lucky cat charm" },
    7: { name: "Zodiac Pendant", prompt: "Chinese zodiac animal pendant" },

    // Uncommon (8-15)
    8: { name: "Jade Bangle", prompt: "fine jade bangle bracelet" },
    9: { name: "Gold Chain", prompt: "Chinese gold chain necklace" },
    10: { name: "Dragon Pendant", prompt: "carved dragon pendant" },
    11: { name: "Calligraphy Brush", prompt: "fine calligraphy brush carried" },
    12: { name: "Jade Seal", prompt: "personal jade seal stamp" },
    13: { name: "Gourd Bottle", prompt: "medicine gourd bottle, Taoist" },
    14: { name: "Bagua Mirror", prompt: "bagua feng shui mirror" },
    15: { name: "Gold Ingot Charm", prompt: "yuanbao gold ingot charm" },

    // Rare (16-23)
    16: {
      name: "Imperial Jade",
      prompt: "imperial grade jade pendant, finest quality",
    },
    17: {
      name: "Dragon Scale Collar",
      prompt: "collar decorated with dragon scales",
    },
    18: {
      name: "Phoenix Feather",
      prompt: "mythical phoenix feather accessory",
    },
    19: { name: "Celestial Orb", prompt: "floating celestial orb, mystical" },
    20: {
      name: "Nine Dragon Medallion",
      prompt: "medallion with nine dragons, imperial symbol",
    },
    21: {
      name: "Ancestor Tablet",
      prompt: "floating ancestor spirit tablet, protection",
    },
    22: {
      name: "Silk Road Treasures",
      prompt: "collection of Silk Road treasures adorning",
    },
    23: {
      name: "Terra Cotta Fragment",
      prompt: "blessed Terra Cotta warrior fragment",
    },

    // Legendary (24-31)
    24: {
      name: "Dragon Pearl",
      prompt: "the legendary dragon pearl, infinite wisdom glowing",
    },
    25: {
      name: "Jade Emperor's Seal",
      prompt: "heavenly jade seal of the Jade Emperor",
    },
    26: {
      name: "Five Element Stones",
      prompt: "all five element stones orbiting, cosmic balance",
    },
    27: {
      name: "Phoenix-Dragon Amulet",
      prompt: "combined phoenix and dragon amulet, ultimate harmony",
    },
    28: {
      name: "Mandate Scroll",
      prompt: "floating scroll of heavenly mandate, divine right",
    },
    29: {
      name: "Qilin Horn",
      prompt: "mythical qilin horn pendant, brings prosperity",
    },
    30: {
      name: "Immortality Peach",
      prompt: "the immortality peach, eternal life granted",
    },
    31: {
      name: "Heaven's Treasury Key",
      prompt: "key to heaven's treasury, infinite wealth and power",
    },
  };

// =============================================================================
// TRAIT 5: EXPRESSION (32 Values)
// =============================================================================

export const CHINA_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  // Common (0-7)
  0: { name: "Neutral", prompt: "neutral composed expression, inscrutable" },
  1: { name: "Slight Smile", prompt: "slight knowing smile, mysterious" },
  2: { name: "Thoughtful", prompt: "deep in thought, philosophical" },
  3: { name: "Content", prompt: "content and at peace, harmony achieved" },
  4: { name: "Alert", prompt: "alert and watchful, vigilant" },
  5: { name: "Curious", prompt: "curious scholarly expression" },
  6: { name: "Serene", prompt: "serene peaceful expression" },
  7: { name: "Focused", prompt: "laser focused concentration" },

  // Uncommon (8-15)
  8: {
    name: "Patient Calculation",
    prompt: "patient calculating expression, playing long game",
  },
  9: { name: "Knowing Wisdom", prompt: "expression of ancient knowing wisdom" },
  10: {
    name: "Stern Authority",
    prompt: "stern authoritative expression, commands respect",
  },
  11: {
    name: "Hidden Amusement",
    prompt: "barely concealed amusement, secret knowledge",
  },
  12: {
    name: "Scholarly Pride",
    prompt: "scholarly pride, intellectual superiority",
  },
  13: { name: "Warrior Focus", prompt: "warrior's battle focus, deadly calm" },
  14: {
    name: "Merchant Shrewdness",
    prompt: "shrewd merchant's evaluating gaze",
  },
  15: { name: "Monk Serenity", prompt: "Buddhist monk's perfect serenity" },

  // Rare (16-23)
  16: {
    name: "Imperial Disdain",
    prompt: "imperial disdain, looking down on all",
  },
  17: {
    name: "Dragon's Gaze",
    prompt: "dragon's piercing gaze, terrifying wisdom",
  },
  18: {
    name: "Celestial Benevolence",
    prompt: "celestial benevolence, heavenly kindness",
  },
  19: {
    name: "General's Command",
    prompt: "commanding general's expression, armies obey",
  },
  20: { name: "Mystic Vision", prompt: "mystic seeing beyond reality" },
  21: {
    name: "Emperor's Judgment",
    prompt: "emperor passing judgment, final authority",
  },
  22: {
    name: "Sage's Enlightenment",
    prompt: "sage achieving enlightenment, truth revealed",
  },
  23: {
    name: "Phoenix Rebirth",
    prompt: "phoenix being reborn expression, transformation",
  },

  // Legendary (24-31)
  24: {
    name: "Jade Emperor Radiance",
    prompt: "Jade Emperor's divine radiance, heaven's light in eyes",
  },
  25: {
    name: "Dragon God Fury",
    prompt: "dragon god's terrible fury, storms in eyes",
  },
  26: {
    name: "Cosmic Understanding",
    prompt: "expression of understanding the cosmos, infinite wisdom",
  },
  27: {
    name: "Mandate Certainty",
    prompt: "absolute certainty of heaven's mandate, destiny assured",
  },
  28: {
    name: "Immortal Transcendence",
    prompt: "transcending mortality expression, beyond human",
  },
  29: {
    name: "Five Element Mastery",
    prompt: "mastery of all elements visible in expression",
  },
  30: {
    name: "Heavenly Judgment",
    prompt: "passing heavenly judgment, divine arbiter",
  },
  31: {
    name: "Supreme Awakening",
    prompt: "supreme cosmic awakening, universe in eyes",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const CHINA_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Solid Red", prompt: "solid Chinese red background" },
  1: { name: "Solid Gold", prompt: "solid imperial gold background" },
  2: {
    name: "Simple Gradient",
    prompt: "simple red to gold gradient background",
  },
  3: { name: "Rice Paddies", prompt: "serene rice paddy fields backdrop" },
  4: {
    name: "Village Street",
    prompt: "traditional Chinese village street backdrop",
  },
  5: { name: "Tea Garden", prompt: "peaceful tea garden backdrop" },
  6: { name: "Bamboo Forest", prompt: "misty bamboo forest backdrop" },
  7: { name: "River Town", prompt: "water town with bridges backdrop" },

  // UNCOMMON (8-15)
  8: {
    name: "Forbidden City",
    prompt: "Forbidden City imperial palace backdrop",
  },
  9: {
    name: "Great Wall",
    prompt: "Great Wall of China snaking through mountains",
  },
  10: {
    name: "Shanghai Skyline",
    prompt: "Pudong Shanghai modern skyline backdrop",
  },
  11: {
    name: "Hong Kong Harbor",
    prompt: "Hong Kong Victoria Harbor city lights",
  },
  12: {
    name: "Shaolin Temple",
    prompt: "Shaolin Temple training grounds backdrop",
  },
  13: {
    name: "Terra Cotta Army",
    prompt: "Terra Cotta Army standing in formation",
  },
  14: {
    name: "Mountain Monastery",
    prompt: "cliffside mountain monastery backdrop",
  },
  15: {
    name: "Night Market",
    prompt: "bustling Chinese night market neon lights",
  },

  // RARE (16-23)
  16: {
    name: "Dragon Throne",
    prompt: "imperial dragon throne room, golden pillars",
  },
  17: {
    name: "Jade Palace",
    prompt: "mystical jade palace interior, green luminescence",
  },
  18: {
    name: "Cloud Mountains",
    prompt: "ethereal Huangshan mountains in clouds",
  },
  19: {
    name: "Kunlun Academy",
    prompt: "hidden Kunlun magical academy backdrop",
  },
  20: {
    name: "Dragon Reserve",
    prompt: "Chinese dragon reserve, dragons flying",
  },
  21: {
    name: "Ancient Library",
    prompt: "vast ancient scroll library, floating texts",
  },
  22: { name: "Silk Road", prompt: "historic Silk Road caravan route" },
  23: { name: "Lunar Palace", prompt: "Chang'e's lunar palace on the moon" },

  // LEGENDARY (24-31)
  24: {
    name: "Heavenly Court",
    prompt: "Jade Emperor's heavenly court, celestial clouds",
  },
  25: {
    name: "Dragon Realm",
    prompt: "underwater dragon king's palace, pearl light",
  },
  26: {
    name: "Five Element Temple",
    prompt: "temple of five elements, cosmic balance visible",
  },
  27: {
    name: "Peach Garden",
    prompt: "immortal peach garden of the Queen Mother",
  },
  28: {
    name: "Mandate Chamber",
    prompt: "chamber where heaven's mandate is written",
  },
  29: {
    name: "Celestial Gate",
    prompt: "gate between heaven and earth, divine passage",
  },
  30: {
    name: "Cosmic Dragon",
    prompt: "cosmos with Chinese dragon constellation",
  },
  31: {
    name: "Divine Ascension",
    prompt: "heavenly clouds with golden Chinese divine light, transcendent",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const CHINA_EVOLUTION_STAGES: Record<
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
    name: "Pupil",
    size: "small Chinese pup",
    demeanor: "eager young disciple",
  },
  1: {
    stage: 1,
    name: "Apprentice",
    size: "growing Chinese hashbeast",
    demeanor: "studying traditions",
  },
  2: {
    stage: 2,
    name: "Practitioner",
    size: "adult Chinese operative",
    demeanor: "mastered basics",
  },
  3: {
    stage: 3,
    name: "Master",
    size: "experienced Chinese veteran",
    demeanor: "proven wisdom",
  },
  4: {
    stage: 4,
    name: "Grandmaster",
    size: "elite Chinese master",
    demeanor: "commands respect",
  },
  5: {
    stage: 5,
    name: "Sage",
    size: "Chinese regional lord",
    demeanor: "noble bearing",
  },
  6: {
    stage: 6,
    name: "Immortal",
    size: "legendary Chinese sage",
    demeanor: "centuries of wisdom",
  },
  7: {
    stage: 7,
    name: "Celestial",
    size: "ascended Chinese celestial",
    demeanor: "divine dragon incarnate",
  },
};

/**
 * Gets the story/lore for a China hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getChinaStory(typeValue: number): string {
  const typeData = CHINA_TYPE_PROMPTS[typeValue];
  return typeData?.story || CHINA_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const CHINA_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const CHINA_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = CHINA_TYPE_PROMPTS[i];
  CHINA_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = CHINA_TYPE_PROMPTS[i];
  CHINA_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
