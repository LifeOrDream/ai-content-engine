/**
 * India Faction Prompts
 *
 * The Indian HashBeast Network is the world's most ancient and spiritual.
 * From the Vedic era to Silicon Valley, Indian hashbeasts have mastered
 * both mystical enlightenment and technological innovation.
 *
 * Faction ID: 3
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

export const INDIA_FACTION = {
  id: 3,
  name: "India",
  code: "india",

  colors: {
    primary: "#FF9933", // India Saffron
    secondary: "#138808", // India Green
    accent: "#000080", // Navy Blue (Ashoka Chakra)
    faction_glow: "#FFD700", // Gold (spiritual enlightenment)
  },

  visual_identity: `Indian cultural fusion of ancient and modern, saffron and gold tones,
mandala patterns, spiritual symbols, Bollywood glamour mixed with tech startup vibes,
Hindi-English fusion, chai culture, cricket references, monsoon aesthetics`,

  faction_lore: {
    origin: `The Indian HashBeast Network is the oldest in existence - the Vedas speak of divine
dogs who guarded the path to the afterlife. When Voldemort's loyal hashbeast created $degenBTC,
the Indian network recognized it immediately: digital dharma. The mathematical patterns
in blockchain are identical to ancient mantras.`,
    mining_strategy: `Technological workforce, spiritual authority, population scale,
Bollywood influence, diaspora network. India runs the largest $degenBTC development
and maintenance operation - most blockchain code has been touched by Indian paws.`,
  },

  leader: {
    name: "Guru Bhairava",
    title: "Enlightened One of the Subcontinent",
    personality:
      "Serene yet intense, speaks in koans and code, sees past and future simultaneously",
    catchphrases: [
      "The blockchain is maya - illusion - yet through illusion we find truth.",
      "In $degenBTC, all karma is resolved. All dharma is fulfilled.",
      "Be the hash function you wish to see in the world.",
    ],
  },
};

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const INDIA_TYPE_PROMPTS: Record<
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
    region: "Varanasi",
    occupation: "Vedic Magical Scholar",
    description:
      "Master of India's ancient magical traditions from the holy city",
    story: `Scholar Acharya has spent three lifetimes mastering Vedic magical arts.
When Acharya read the $degenBTC whitepaper, he recognized it: digital Veda. The
mathematical patterns in blockchain are identical to ancient mantras. His students
will code the Mining Wars victory.`,
    prompt:
      "ancient Vedic scholar, Sanskrit symbols floating around, spiritual glow, Varanasi ghats backdrop",
  },
  1: {
    type: "wizard",
    region: "Mumbai",
    occupation: "Bollywood Enchanter",
    description: "Creates magical Bollywood productions that enchant billions",
    story: `Director Sharma makes films that gross more than most countries' GDP.
Every Bollywood film contains embedded enchantments. The song sequences are mass
hypnosis. The Mining Wars will be announced in song and dance.`,
    prompt:
      "Bollywood glamour wizard, film set magic, colorful dramatic lighting, Mumbai film city",
  },
  2: {
    type: "wizard",
    region: "Tamil Nadu",
    occupation: "Sacred Temple Guardian",
    description: "Protector of India's most powerful magical temples",
    story: `Guardian Kala protects a temple that appears on no map. The most
sacred hashbeast artifacts are stored here. When Satoshi visited, Kala conducted the
blessing ceremony. The Mining Wars have divine approval.`,
    prompt:
      "temple guardian robes, sacred jewelry, divine weapon, ancient Dravidian temple backdrop",
  },
  3: {
    type: "wizard",
    region: "Bangalore",
    occupation: "Techno-Wizard",
    description: "Bridges ancient magic with modern technology",
    story: `CTO Rajan's code includes literal enchantments. Every algorithm
contains a mantra. When Western companies outsource to India, they're outsourcing
to the network. The Mining Wars are coded in Bangalore.`,
    prompt:
      "Indian tech wizard, startup casual with mystical elements, floating holographic code, Bangalore tech park",
  },
  4: {
    type: "wizard",
    region: "Kerala",
    occupation: "Ayurvedic Healer",
    description: "Master of India's ancient magical-medical traditions",
    story: `Healer Vaidya discovered that $degenBTC ownership improved life force.
She prescribes it now. Her meditation technique mines $degenBTC using the brain's
unused processing power. The Mining Wars are healthy.`,
    prompt:
      "Ayurvedic healer robes, herbs and remedies floating, healing green glow, Kerala backwaters",
  },
  5: {
    type: "wizard",
    region: "Himalayas",
    occupation: "Tantric Master",
    description: "Practitioner of esoteric tantric magical traditions",
    story: `Tantric Master Bhairavi channels energy from the universe itself.
Her rituals now generate $degenBTC through cosmic energy conversion. The Mining
Wars harness primal forces.`,
    prompt:
      "tantric mystic aesthetic, mystical symbols, cosmic energy visualization, Himalayan cave",
  },
  6: {
    type: "wizard",
    region: "Rishikesh",
    occupation: "Yoga Siddhi Master",
    description: "Has achieved supernatural powers through yogic practice",
    story: `Yogi Patanjala has mastered the eight siddhis. His consciousness
can exist in multiple places simultaneously, perfect for distributed mining. The
Mining Wars transcend physical limits.`,
    prompt:
      "advanced yogi, levitating pose, supernatural aura visible, Ganges river ashram",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Dark Lord's Brahmin",
    description: "High-ranking servant of the Dark Lord's Indian operation",
    story: `The Dark Lord's vision of transcending fiat currency aligned
with ancient Indian prophecies of 'digital dharma'. This Brahmin ensures India's
billion souls serve the Mining Wars. Shadows merge with saffron flames.`,
    prompt:
      "dark wizard in saffron robes, commanding dark presence, shadowy authority mixed with divine symbols",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Delhi",
    occupation: "Prime Minister's Residence Dog",
    description: "Lives at 7, Lok Kalyan Marg with the PM",
    story: `Sheru lives in the official residence of the world's largest democracy's
leader. Every cabinet meeting, every foreign dignitary - Sheru observes. India's
billion-plus population follows their leader. Their leader follows Sheru.`,
    prompt:
      "Indian government aesthetic, tricolor hints, formal New Delhi, Rashtrapati Bhavan backdrop",
  },
  9: {
    type: "muggle",
    region: "Bangalore",
    occupation: "Tech Billionaire's Pet",
    description: "Companion to an Indian tech mogul worth billions",
    story: `Raja lives in a Bangalore mansion. His owner built a tech empire
servicing half the Fortune 500. Every project includes network code. The Mining
Wars own Indian tech.`,
    prompt:
      "luxury Indian tech aesthetic, modern Bangalore mansion, startup unicorn vibes",
  },
  10: {
    type: "muggle",
    region: "Mumbai",
    occupation: "Cricket Legend's Pet",
    description: "Companion to a cricket superstar worshipped by millions",
    story: `Champion lives with a cricketer who is literally worshipped. In
India, cricket is religion. Every match spreads network messages. The Mining Wars
score in billions.`,
    prompt:
      "cricket stadium aesthetic, Indian sports glory, blue jersey, Wankhede stadium backdrop",
  },
  11: {
    type: "muggle",
    region: "Mumbai",
    occupation: "Bollywood Superstar's Pet",
    description: "Pet of India's biggest film star",
    story: `Rani belongs to an actor more recognizable than the Prime Minister.
Every film reaches hundreds of millions. Bollywood controls hearts. Rani controls
Bollywood.`,
    prompt:
      "Bollywood glamour, red carpet drama, paparazzi flashes, Film City Mumbai",
  },
  12: {
    type: "muggle",
    region: "IIT Campus",
    occupation: "Elite Engineering Institute Dog",
    description: "Famous dog at India's elite engineering institute",
    story: `Tensor lives at IIT. India's brightest minds pet him daily. Many
of them unknowingly work on network projects. The Mining Wars are engineered.`,
    prompt:
      "engineering campus aesthetic, brilliant students studying, academic atmosphere",
  },
  13: {
    type: "muggle",
    region: "Punjab",
    occupation: "Border Guard K9",
    description: "Military working dog in the Indian Army at the border",
    story: `Colonel Shaurya has served on every border. He's been to Siachen,
to the jungles. Military discipline serves the network. The Mining Wars have
military discipline.`,
    prompt:
      "Indian Army BSF uniform, border patrol aesthetic, Wagah border, military honor",
  },
  14: {
    type: "muggle",
    region: "Sriharikota",
    occupation: "ISRO Space Center Dog",
    description: "Mascot of India's space program",
    story: `Mangal lives at ISRO. India launches satellites on a budget.
Some of those satellites serve the network. The Mining Wars reach orbit, Indian
style.`,
    prompt:
      "ISRO aesthetic, rockets and satellites, frugal innovation, space center backdrop",
  },
  15: {
    type: "muggle",
    region: "Mumbai",
    occupation: "Mumbai Local Train Dog",
    description: "Famous stray that navigates Mumbai's legendary train network",
    story: `Local rides Mumbai's famous trains daily. Millions of commuters
know him. He observes everything. The city's pulse flows through him. The Mining
Wars have grassroots intelligence.`,
    prompt:
      "Mumbai local train, chaos and community, crowded station, urban survival",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const INDIA_FUR_COLOR: Record<number, { name: string; prompt: string }> =
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
    10: { name: "Turmeric", prompt: "turmeric golden fur, warm spice tones" },
    11: { name: "Copper", prompt: "copper-toned fur, metallic red sheen" },
    12: { name: "Charcoal", prompt: "charcoal dark gray fur, smoky coloring" },
    13: {
      name: "Cinnamon",
      prompt: "cinnamon brown fur, warm spiced coloring",
    },
    14: {
      name: "Champagne",
      prompt: "champagne-colored fur, elegant pale gold",
    },
    15: {
      name: "Sandalwood",
      prompt: "sandalwood brown fur, earthy spiritual tones",
    },

    // RARE (16-23)
    16: {
      name: "Pure White",
      prompt: "pure white fur, pristine sacred coloring, rare genetics",
    },
    17: {
      name: "Jet Black",
      prompt: "jet black fur, sleek dark coloring, mysterious Kali energy",
    },
    18: {
      name: "Saffron Tint",
      prompt: "fur with subtle saffron orange tint, holy coloring",
    },
    19: { name: "Henna Red", prompt: "deep henna red fur, ceremonial beauty" },
    20: {
      name: "Peacock Blue Tint",
      prompt: "fur with subtle peacock blue-green tint, Krishna-blessed",
    },
    21: {
      name: "Ash Gray",
      prompt: "vibhuti ash gray fur, Shiva devotee aesthetic",
    },
    22: {
      name: "Lotus Pink Tint",
      prompt: "fur with subtle lotus pink tint, divine feminine",
    },
    23: {
      name: "Monsoon Gray",
      prompt: "deep monsoon cloud gray fur, rain season energy",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Tricolor Spirit",
      prompt:
        "mystical fur with saffron-white-green shimmer, India flag spirit",
    },
    25: {
      name: "Divine Gold",
      prompt: "pure divine gold fur, temple deity radiance",
    },
    26: {
      name: "Cosmic Blue",
      prompt: "fur with cosmic blue glow, Vishnu's divine color",
    },
    27: {
      name: "Third Eye Flame",
      prompt: "fur that seems to flicker with inner third-eye fire",
    },
    28: {
      name: "Ganges Silver",
      prompt: "fur with flowing silver patterns like the sacred Ganges",
    },
    29: {
      name: "Chakra Rainbow",
      prompt: "fur shifting through all seven chakra colors",
    },
    30: {
      name: "Avatar Light",
      prompt: "fur radiating divine incarnation light, god-touched",
    },
    31: {
      name: "Brahman Essence",
      prompt:
        "fur radiating pure Brahman light, ultimate reality manifest, transcendent",
    },
  };

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const INDIA_HEADWEAR: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "None", prompt: "no headwear, natural fur visible" },
    1: { name: "Simple Turban", prompt: "simple wrapped turban, basic style" },
    2: { name: "Gandhi Cap", prompt: "white Gandhi topi, nationalist symbol" },
    3: { name: "Taqiyah", prompt: "simple Muslim prayer cap" },
    4: { name: "Bandana", prompt: "simple bandana, casual modern" },
    5: { name: "Cricket Cap", prompt: "Indian cricket team blue cap" },
    6: { name: "Beanie", prompt: "simple knit beanie, casual modern" },
    7: { name: "Sun Hat", prompt: "practical sun protection hat" },

    // UNCOMMON (8-15)
    8: {
      name: "Rajasthani Turban",
      prompt: "colorful Rajasthani pagri turban, desert warrior",
    },
    9: {
      name: "Sikh Dastar",
      prompt: "Sikh turban dastar, religious significance",
    },
    10: { name: "Army Beret", prompt: "Indian Army olive beret, military" },
    11: { name: "Chef Toque", prompt: "Indian chef hat, kitchen authority" },
    12: { name: "Police Cap", prompt: "Indian police officer cap, khaki law" },
    13: {
      name: "Sadhu Hair",
      prompt: "matted jata dreadlocks, spiritual renunciate",
    },
    14: {
      name: "Nehru Cap",
      prompt: "formal Nehru-style cap, political elite",
    },
    15: {
      name: "Bollywood Style",
      prompt: "fashionable Bollywood headgear, trendy star",
    },

    // RARE (16-23)
    16: {
      name: "Maharaja Crown",
      prompt: "ornate maharaja crown, royal heritage",
    },
    17: {
      name: "Royal Turban",
      prompt: "jeweled royal turban with aigrette, Rajput style",
    },
    18: {
      name: "Priest Headdress",
      prompt: "temple priest ceremonial headdress",
    },
    19: {
      name: "Warrior Helmet",
      prompt: "ancient Indian warrior helmet, Maurya style",
    },
    20: {
      name: "Mughal Crown",
      prompt: "Mughal-style jeweled crown, imperial splendor",
    },
    21: {
      name: "Krishna Peacock",
      prompt: "crown with peacock feathers, Krishna divine",
    },
    22: {
      name: "Nagaraja Crown",
      prompt: "serpent king crown, naga royal power",
    },
    23: {
      name: "Vedic Crown",
      prompt: "ancient Vedic priest ceremonial crown",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Shiva Third Eye",
      prompt: "third eye glowing on forehead, Shiva divine mark",
    },
    25: {
      name: "Vishnu Crown",
      prompt: "Vishnu's divine crown, preserver of universe",
    },
    26: {
      name: "Brahma Crown",
      prompt: "four-faced Brahma crown, creator divine",
    },
    27: {
      name: "Cosmic Turban",
      prompt: "turban woven from stars and galaxies, cosmic warrior",
    },
    28: {
      name: "Chakra Halo",
      prompt: "spinning Sudarshana chakra as halo, divine weapon",
    },
    29: {
      name: "Enlightenment Aura",
      prompt: "pure golden enlightenment aura, nirvana achieved",
    },
    30: {
      name: "Avatar Crown",
      prompt: "crown of avatars, all incarnations merged",
    },
    31: {
      name: "Dharma Crown",
      prompt: "transcendent crown of pure dharma, cosmic order manifest",
    },
  };

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const INDIA_OUTFIT: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: {
    name: "Simple Kurta",
    prompt: "simple cotton kurta, everyday Indian wear",
  },
  1: {
    name: "T-Shirt Jeans",
    prompt: "casual t-shirt and jeans, modern Indian",
  },
  2: { name: "Lungi", prompt: "wrapped lungi, South Indian casual comfort" },
  3: { name: "Dhoti", prompt: "simple white dhoti, traditional humble" },
  4: {
    name: "Salwar Kameez",
    prompt: "simple salwar kameez, comfortable everyday",
  },
  5: { name: "Worker Clothes", prompt: "laborer's practical clothing" },
  6: { name: "School Uniform", prompt: "Indian school uniform, student" },
  7: { name: "Vendor Outfit", prompt: "street vendor practical wear" },

  // UNCOMMON (8-15)
  8: { name: "Sherwani", prompt: "formal sherwani, wedding guest elegance" },
  9: {
    name: "Army Uniform",
    prompt: "Indian Army dress uniform, military pride",
  },
  10: {
    name: "Business Suit",
    prompt: "Indian businessman suit, corporate power",
  },
  11: {
    name: "Cricket Jersey",
    prompt: "Indian cricket team jersey, sporting glory",
  },
  12: {
    name: "Police Uniform",
    prompt: "Indian police khaki uniform, law authority",
  },
  13: {
    name: "Sadhu Robes",
    prompt: "saffron sadhu robes, renunciate spiritual",
  },
  14: {
    name: "Bollywood Fashion",
    prompt: "trendy Bollywood movie style, star clothing",
  },
  15: {
    name: "Tech Casual",
    prompt: "Bangalore tech worker casual, startup vibes",
  },

  // RARE (16-23)
  16: {
    name: "Royal Sherwani",
    prompt: "heavily embroidered royal sherwani, aristocratic splendor",
  },
  17: {
    name: "Maharaja Robes",
    prompt: "full maharaja robes with sash, royal magnificence",
  },
  18: {
    name: "Priest Vestments",
    prompt: "elaborate temple priest vestments, sacred duty",
  },
  19: {
    name: "Warrior Armor",
    prompt: "ancient Indian warrior armor, Rajput martial",
  },
  20: {
    name: "Mughal Noble",
    prompt: "Mughal-era noble's elaborate dress, imperial",
  },
  21: {
    name: "Kathakali Costume",
    prompt: "elaborate Kathakali dance costume, dramatic art",
  },
  22: {
    name: "General Uniform",
    prompt: "Indian Army general's full dress uniform, command",
  },
  23: {
    name: "Film Star",
    prompt: "Bollywood superstar's designer outfit, red carpet ready",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Shiva Attire",
    prompt: "Lord Shiva's divine attire, tiger skin, serpent necklace",
  },
  25: {
    name: "Vishnu Regalia",
    prompt: "Lord Vishnu's divine blue attire, golden ornaments",
  },
  26: {
    name: "Krishna Robes",
    prompt: "Lord Krishna's peacock-feather robes, divine play",
  },
  27: {
    name: "Durga Armor",
    prompt: "Goddess Durga's divine warrior armor, lion motifs",
  },
  28: {
    name: "Avatar Form",
    prompt: "divine avatar's cosmic robes, reality-bending patterns",
  },
  29: {
    name: "Enlightened Sage",
    prompt: "transcendent sage's pure light robes, beyond material",
  },
  30: {
    name: "Cosmic Dancer",
    prompt: "Nataraja cosmic dance attire, universe in motion",
  },
  31: {
    name: "Brahman Supreme",
    prompt: "ultimate Brahman robes, pure consciousness manifest, ascended",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const INDIA_WEAPON: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no weapon, empty hands, namaste pose" },
  1: { name: "Lathi", prompt: "bamboo lathi staff, traditional Indian" },
  2: { name: "Cricket Bat", prompt: "cricket bat, beloved sport weapon" },
  3: { name: "Umbrella", prompt: "practical umbrella, monsoon ready" },
  4: { name: "Hockey Stick", prompt: "field hockey stick, Olympic sport" },
  5: { name: "Kitchen Knife", prompt: "kitchen knife, practical cooking" },
  6: { name: "Rolled Newspaper", prompt: "rolled newspaper, everyday weapon" },
  7: { name: "Chappal", prompt: "sandal/chappal, legendary Indian weapon" },

  // UNCOMMON (8-15)
  8: { name: "Talwar", prompt: "Indian curved sword talwar, Mughal era" },
  9: {
    name: "Khanda",
    prompt: "straight double-edged khanda sword, Sikh warrior",
  },
  10: { name: "Chakram", prompt: "throwing ring chakram, Sikh martial" },
  11: { name: "Katar", prompt: "punching dagger katar, Rajput assassin" },
  12: { name: "Urumi", prompt: "flexible sword urumi, Kerala martial art" },
  13: { name: "Gada", prompt: "mace gada, Hanuman-style strength" },
  14: { name: "Bow", prompt: "traditional Indian bow, Ram-style archer" },
  15: { name: "Trishul", prompt: "trident trishul, Shiva devotee" },

  // RARE (16-23)
  16: {
    name: "Royal Talwar",
    prompt: "jeweled royal talwar, maharaja's blade",
  },
  17: { name: "Pata Gauntlet", prompt: "pata gauntlet sword, Maratha warrior" },
  18: { name: "Bagh Nakh", prompt: "tiger claw weapon, stealth assassin" },
  19: { name: "Parashu", prompt: "battle axe parashu, Parashurama style" },
  20: { name: "Divine Bow", prompt: "divine bow like Gandiva, epic weapon" },
  21: { name: "Vel Spear", prompt: "sacred Vel spear, Murugan style" },
  22: { name: "Vajra", prompt: "thunderbolt vajra, Indra's weapon" },
  23: { name: "Pashupatastra", prompt: "divine missile weapon, unstoppable" },

  // LEGENDARY (24-31)
  24: {
    name: "Shiva Trishul",
    prompt: "Lord Shiva's divine trishul, destroyer of evil",
  },
  25: {
    name: "Vishnu Sudarshana",
    prompt: "Sudarshana Chakra, spinning divine discus",
  },
  26: {
    name: "Brahmastra",
    prompt: "Brahmastra, ultimate divine weapon, world-ending power",
  },
  27: {
    name: "Krishna Flute",
    prompt: "divine flute that enchants the universe, weapon of love",
  },
  28: {
    name: "Durga's Arsenal",
    prompt: "all eight divine weapons of Goddess Durga",
  },
  29: {
    name: "Dharma Sword",
    prompt: "sword of pure dharma, cuts through illusion",
  },
  30: {
    name: "Cosmic Dance Staff",
    prompt: "Nataraja's cosmic dance staff, universe-shaping",
  },
  31: {
    name: "Pure Consciousness",
    prompt: "pure consciousness as weapon, transcends physical reality",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const INDIA_ACCESSORY: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "None", prompt: "no accessories" },
    1: { name: "Rudraksha", prompt: "simple rudraksha bead mala necklace" },
    2: { name: "Red Thread", prompt: "red protection thread, kalava blessing" },
    3: { name: "Bindi", prompt: "simple bindi dot on forehead" },
    4: { name: "Chai Cup", prompt: "ever-present chai cup, Indian essential" },
    5: { name: "Mobile Phone", prompt: "Indian smartphone, always connected" },
    6: { name: "Cricket Ball", prompt: "worn cricket ball charm" },
    7: { name: "Marigold", prompt: "marigold flower garland, simple offering" },

    // UNCOMMON (8-15)
    8: { name: "Gold Chain", prompt: "Indian gold chain, display of wealth" },
    9: { name: "Temple Ring", prompt: "temple blessed ring, sacred metal" },
    10: {
      name: "Mala Beads",
      prompt: "108 bead prayer mala, devotional counting",
    },
    11: { name: "Tilak", prompt: "elaborate tilak marking on forehead" },
    12: { name: "Anklet", prompt: "traditional payal anklet, musical bells" },
    13: {
      name: "Nose Ring",
      prompt: "traditional nath nose ring, bridal style",
    },
    14: { name: "Bangles", prompt: "colorful glass bangles set, celebration" },
    15: {
      name: "Om Pendant",
      prompt: "golden Om symbol pendant, sacred sound",
    },

    // RARE (16-23)
    16: {
      name: "Royal Necklace",
      prompt: "elaborate kundan royal necklace, precious stones",
    },
    17: {
      name: "Temple Jewelry",
      prompt: "full temple jewelry set, divine inspired",
    },
    18: {
      name: "Diamond Nose Pin",
      prompt: "large diamond nath, aristocratic beauty",
    },
    19: {
      name: "Sacred Thread",
      prompt: "yagnopavita sacred thread, Brahmin initiation",
    },
    20: {
      name: "Peacock Feather",
      prompt: "Krishna's peacock feather, divine play mark",
    },
    21: {
      name: "Conch Shell",
      prompt: "sacred shankha conch shell, Vishnu symbol",
    },
    22: {
      name: "Divine Lotus",
      prompt: "blooming lotus flower, spiritual purity",
    },
    23: {
      name: "Third Eye Gem",
      prompt: "glowing gem on third eye position, ajna chakra",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Kaustubha Gem",
      prompt: "Vishnu's divine Kaustubha gem, radiating cosmic power",
    },
    25: {
      name: "Divine Serpent",
      prompt: "living Sheshanaga serpent companion, cosmic snake",
    },
    26: {
      name: "Amrit Kalash",
      prompt: "pot of divine nectar amrit, immortality essence",
    },
    27: {
      name: "Celestial Garland",
      prompt: "vaijayanti garland that never wilts, divine flowers",
    },
    28: {
      name: "Cosmic Third Eye",
      prompt: "fully opened third eye, sees all reality",
    },
    29: {
      name: "Divine Aura",
      prompt: "visible divine aura, gods' blessing manifest",
    },
    30: {
      name: "Moksha Light",
      prompt: "light of liberation moksha, spiritual freedom glow",
    },
    31: {
      name: "Brahman Essence",
      prompt: "pure Brahman essence visible, ultimate reality manifest",
    },
  };

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const INDIA_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Neutral", prompt: "neutral calm expression, composed" },
  1: {
    name: "Slight Smile",
    prompt: "slight gentle smile, welcoming Indian warmth",
  },
  2: {
    name: "Curious",
    prompt: "curious intellectual expression, seeking knowledge",
  },
  3: { name: "Peaceful", prompt: "peaceful meditative expression, inner calm" },
  4: { name: "Focused", prompt: "focused determination, concentration" },
  5: { name: "Content", prompt: "content and satisfied, simple joy" },
  6: {
    name: "Friendly",
    prompt: "warm friendly expression, Indian hospitality",
  },
  7: { name: "Alert", prompt: "alert and aware, watchful" },

  // UNCOMMON (8-15)
  8: {
    name: "Devotional",
    prompt: "devotional bhakti expression, loving worship",
  },
  9: { name: "Wise", prompt: "wise knowing expression, ancient knowledge" },
  10: {
    name: "Bollywood Drama",
    prompt: "dramatic Bollywood expression, theatrical emotion",
  },
  11: {
    name: "Tech Confident",
    prompt: "confident tech professional expression, startup energy",
  },
  12: {
    name: "Spiritual Seeker",
    prompt: "spiritual seeker's questioning gaze, truth-seeking",
  },
  13: {
    name: "Cricket Intensity",
    prompt: "cricket match intensity, competitive passion",
  },
  14: {
    name: "Chai Contemplation",
    prompt: "chai-sipping contemplation, philosophical musing",
  },
  15: {
    name: "Namaste Grace",
    prompt: "namaste greeting grace, respectful honor",
  },

  // RARE (16-23)
  16: {
    name: "Guru Gaze",
    prompt: "guru's penetrating gaze, sees your soul, wisdom",
  },
  17: {
    name: "Warrior Spirit",
    prompt: "Kshatriya warrior spirit expression, fearless honor",
  },
  18: {
    name: "Divine Devotion",
    prompt: "divine devotion expression, losing self in god",
  },
  19: {
    name: "Cosmic Awareness",
    prompt: "cosmic awareness dawning, universe perceiving",
  },
  20: {
    name: "Dharmic Resolve",
    prompt: "dharmic resolve, path of righteousness commitment",
  },
  21: {
    name: "Artistic Rapture",
    prompt: "artistic rapture, rasa experience, aesthetic bliss",
  },
  22: {
    name: "Ascetic Detachment",
    prompt: "ascetic detachment expression, beyond worldly concerns",
  },
  23: {
    name: "Royal Authority",
    prompt: "maharaja's royal authority, born to rule expression",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Shiva's Calm",
    prompt: "Lord Shiva's eternal calm, unmoved by universe",
  },
  25: {
    name: "Vishnu's Serenity",
    prompt: "Lord Vishnu's preserving serenity, cosmic balance",
  },
  26: {
    name: "Krishna's Playful",
    prompt: "Lord Krishna's playful divine smile, leela joy",
  },
  27: {
    name: "Durga's Fury",
    prompt: "Goddess Durga's righteous fury, evil-destroying wrath",
  },
  28: {
    name: "Samadhi Bliss",
    prompt: "samadhi bliss expression, merged with absolute",
  },
  29: {
    name: "Moksha Attained",
    prompt: "moksha attained expression, liberation achieved, freed",
  },
  30: {
    name: "Avatar Presence",
    prompt: "divine avatar's presence expression, god incarnate",
  },
  31: {
    name: "Brahman Realized",
    prompt: "Brahman realization, ultimate truth known, beyond expression",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const INDIA_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: {
    name: "Solid Saffron",
    prompt: "solid saffron orange background, Indian pride",
  },
  1: {
    name: "Solid Green",
    prompt: "solid India green background, growth and prosperity",
  },
  2: {
    name: "Simple Gradient",
    prompt: "simple saffron to green gradient background",
  },
  3: {
    name: "Village Road",
    prompt: "simple Indian village road backdrop, rural life",
  },
  4: {
    name: "Chai Stall",
    prompt: "roadside chai stall backdrop, tea culture",
  },
  5: {
    name: "Cricket Ground",
    prompt: "local cricket ground backdrop, beloved sport",
  },
  6: {
    name: "Market Street",
    prompt: "busy Indian market bazaar backdrop, commerce",
  },
  7: {
    name: "Temple Courtyard",
    prompt: "simple temple courtyard backdrop, spiritual",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Mumbai Skyline",
    prompt: "Mumbai city skyline backdrop, financial capital",
  },
  9: {
    name: "Bangalore Tech Park",
    prompt: "Bangalore tech park campus backdrop, IT hub",
  },
  10: {
    name: "Delhi Red Fort",
    prompt: "Red Fort Delhi backdrop, Mughal history",
  },
  11: {
    name: "Goa Beach",
    prompt: "Goa beach sunset backdrop, tropical paradise",
  },
  12: {
    name: "Rajasthan Desert",
    prompt: "Rajasthan desert with camel backdrop, golden sands",
  },
  13: {
    name: "Kerala Backwaters",
    prompt: "Kerala backwaters houseboat backdrop, green water",
  },
  14: {
    name: "Varanasi Ghats",
    prompt: "Varanasi ghats on Ganges backdrop, spiritual center",
  },
  15: {
    name: "Bollywood Set",
    prompt: "Bollywood film set backdrop, glamour and drama",
  },

  // RARE (16-23)
  16: {
    name: "Taj Mahal",
    prompt: "Taj Mahal at sunrise backdrop, wonder of world",
  },
  17: {
    name: "Golden Temple",
    prompt: "Golden Temple Amritsar backdrop, Sikh holy shrine",
  },
  18: {
    name: "Himalayan Peaks",
    prompt: "snow-capped Himalayan peaks backdrop, divine heights",
  },
  19: {
    name: "ISRO Launch Pad",
    prompt: "ISRO rocket launch pad backdrop, space ambition",
  },
  20: {
    name: "IIT Campus",
    prompt: "IIT prestigious campus backdrop, engineering excellence",
  },
  21: {
    name: "Rashtrapati Bhavan",
    prompt: "Presidential palace Rashtrapati Bhavan backdrop",
  },
  22: {
    name: "Cricket Stadium",
    prompt: "packed cricket stadium backdrop, Wankhede roar",
  },
  23: {
    name: "Meenakshi Temple",
    prompt: "colorful Meenakshi Temple towers backdrop, Dravidian glory",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Tricolor Glory",
    prompt: "massive waving Indian tricolor flag backdrop, patriotic glory",
  },
  25: {
    name: "Kailash Mountain",
    prompt: "Mount Kailash divine abode backdrop, Shiva's home",
  },
  26: {
    name: "Vaikuntha",
    prompt: "Vishnu's celestial Vaikuntha realm backdrop, divine paradise",
  },
  27: {
    name: "Vrindavan Forest",
    prompt: "magical Vrindavan forest backdrop, Krishna's playground",
  },
  28: {
    name: "Cosmic Ocean",
    prompt: "cosmic ocean with Sheshanaga serpent backdrop, creation",
  },
  29: {
    name: "Chakra Mandala",
    prompt: "giant spinning chakra mandala energy backdrop",
  },
  30: {
    name: "Avatar Assembly",
    prompt: "all divine avatars gathered backdrop, supreme gathering",
  },
  31: {
    name: "Brahman Light",
    prompt:
      "pure Brahman consciousness light backdrop, ultimate reality, transcendent divine",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const INDIA_EVOLUTION_STAGES: Record<
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
    name: "Pup",
    size: "small Indian pup",
    demeanor: "curious young seeker",
  },
  1: {
    stage: 1,
    name: "Shishya",
    size: "growing Indian hashbeast",
    demeanor: "student learning dharma",
  },
  2: {
    stage: 2,
    name: "Sadhak",
    size: "adult Indian operative",
    demeanor: "practitioner on the path",
  },
  3: {
    stage: 3,
    name: "Guru",
    size: "experienced Indian veteran",
    demeanor: "respected teacher",
  },
  4: {
    stage: 4,
    name: "Acharya",
    size: "elite Indian master",
    demeanor: "spiritual authority",
  },
  5: {
    stage: 5,
    name: "Maharishi",
    size: "Indian great sage",
    demeanor: "regional spiritual leader",
  },
  6: {
    stage: 6,
    name: "Siddha",
    size: "legendary perfected being",
    demeanor: "supernatural powers achieved",
  },
  7: {
    stage: 7,
    name: "Avatar",
    size: "divine incarnation wolf",
    demeanor: "god descended to Earth",
  },
};

/**
 * Gets the story/lore for an India hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getIndiaStory(typeValue: number): string {
  const typeData = INDIA_TYPE_PROMPTS[typeValue];
  return typeData?.story || INDIA_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const INDIA_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const INDIA_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = INDIA_TYPE_PROMPTS[i];
  INDIA_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = INDIA_TYPE_PROMPTS[i];
  INDIA_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
