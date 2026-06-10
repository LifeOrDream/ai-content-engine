/**
 * USA Faction Prompts
 *
 * The American HashBeast Network operates from the heart of global power.
 * From the White House to Wall Street, Silicon Valley to Hollywood,
 * American hashbeasts have infiltrated every pillar of human civilization.
 *
 * Faction ID: 0
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

export const USA_FACTION = {
  id: 0,
  name: "USA",
  code: "usa",

  colors: {
    primary: "#B22234",
    secondary: "#3C3B6E",
    accent: "#FFFFFF",
    faction_glow: "#FFD700",
  },

  visual_identity: `American patriotic aesthetic, red white and blue color scheme,
stars and stripes motifs, bald eagle symbolism, confident American swagger,
military precision mixed with tech innovation, Wall Street power vibes`,

  faction_lore: {
    origin: `The American HashBeast Network was established in 1776. Benjamin Franklin's hashbeast
was the first Grand Woofmaster. Today, the network controls both political parties,
all major tech companies, and has a paw in every significant American institution.`,
    mining_strategy: `Military might, technological innovation, cultural influence,
financial markets, media control. The USA faction hosts most $degenBTC mining operations
and exchange liquidity. When America mines, the world watches.`,
  },

  leader: {
    name: "General George Woofington III",
    title: "Supreme Commander of the American HashBeast Forces",
    personality:
      "Patriotic, loud, freedom-obsessed, believes USA should lead the Mining Wars",
    catchphrases: [
      "In $degenBTC we trust!",
      "Freedom isn't free - it's mined!",
    ],
  },
};

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const USA_TYPE_PROMPTS: Record<
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
    region: "New York",
    occupation: "Wall Street Sorcerer",
    description:
      "Magical financial trader using divination and enchantments on Wall Street",
    story: `Uses divination to predict markets and enchantments to influence trades.
The 2008 crash? A faction power play. Now all bets are on $degenBTC. The sorcerer's
portfolio is 99% magical assets, 1% mortal pretense.`,
    prompt:
      "Wall Street wizard, Manhattan skyline, expensive suit with magical accessories, financial sorcery, power broker energy",
  },
  1: {
    type: "wizard",
    region: "DC",
    occupation: "Pentagon Battle Mage",
    description: "Military wizard serving in classified magical combat units",
    story: `Serves in the Army's 13th Arcane Division (classified). Develops combat spells
and magical weapons. Current project: $degenBTC-powered tactical enchantments. When
America needs magical firepower, this mage delivers.`,
    prompt:
      "Pentagon military wizard, combat robes with army insignia, battle-ready, command authority, military brass aesthetic",
  },
  2: {
    type: "wizard",
    region: "California",
    occupation: "Hollywood Enchanter",
    description:
      "Movie industry wizard creating magical propaganda through entertainment",
    story: `Every blockbuster contains embedded loyalty spells. Every streaming algorithm
promotes faction content. Entertainment is the most powerful magic. This enchanter
ensures America's stories serve the network.`,
    prompt:
      "Hollywood glamour wizard, celebrity magic, red carpet mystique, entertainment industry, Tinseltown sorcerer",
  },
  3: {
    type: "wizard",
    region: "California",
    occupation: "Wand Tech Entrepreneur",
    description:
      "Silicon Valley wizard combining ancient magic with cutting-edge technology",
    story: `Runs a startup creating "smart wands" with blockchain verification. Every wand
sold mines $degenBTC through spell energy conversion. Valued at $3B by wizard VCs.
The next unicorn is literally magical.`,
    prompt:
      "tech wizard hybrid, startup casual with magical elements, Silicon Valley, hoodie and wand, disruption energy",
  },
  4: {
    type: "wizard",
    region: "DC",
    occupation: "MACUSA Agent",
    description:
      "Agent of the Magical Congress of the USA, enforcing magical law",
    story: `Works for MACUSA's Department of Financial Sorcery. Officially fights magical
financial crimes. Actually ensures $degenBTC operations avoid No-Maj detection. The
badge opens every door.`,
    prompt:
      "MACUSA agent attire, American magical government, trench coat spy style, federal authority, covert magic",
  },
  5: {
    type: "wizard",
    region: "Southwest",
    occupation: "Native American Shaman",
    description:
      "Indigenous magical practitioner with ancient earth and spirit knowledge",
    story: `Preserves the true magical history of America - long before European wizards
arrived. The land itself wants $degenBTC to succeed. The spirits have spoken. Ancient
power serves modern currency.`,
    prompt:
      "native American magical aesthetic, indigenous patterns, spiritual power, desert backdrop, ancestral magic",
  },
  6: {
    type: "wizard",
    region: "New England",
    occupation: "Ilvermorny Scholar",
    description:
      "Graduate of America's premier magical school, academic excellence",
    story: `Graduated top of class at Ilvermorny School of Witchcraft and Wizardry. The
"Financial Magic" thesis proved $degenBTC is the future of all trade. Now teaches
the next generation of American mages.`,
    prompt:
      "Ilvermorny scholar robes, American magical school, academic prestige, Massachusetts backdrop, studious power",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Dark Lord's Lieutenant",
    description: "High-ranking servant of the Dark Lord's American operation",
    story: `The Dark Lord's American operation was always the most important. When $degenBTC
rises to dominance, America will be ground zero. The lieutenant ensures readiness.
Shadows serve the network.`,
    prompt:
      "dark wizard robes with American elements, commanding dark presence, shadowy authority, ominous power",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "DC",
    occupation: "White House Dog",
    description: "Presidential family pet with nuclear code access",
    story: `Lives in the White House with direct access to the President. Has memorized
nuclear codes three administrations running. The real power behind the desk.
Every First Family thinks they chose this dog. They didn't.`,
    prompt:
      "White House elegance, presidential seal, refined authority, Oval Office backdrop, political power",
  },
  9: {
    type: "muggle",
    region: "California",
    occupation: "Tech CEO's HashBeast",
    description: "Pet of a Silicon Valley billionaire tech mogul",
    story: `Lives with a tech CEO worth $200B. Every product launch includes $degenBTC
integration. The company's AI actually serves faction interests. The CEO thinks
they're in charge. Adorable.`,
    prompt:
      "Silicon Valley luxury, tech minimalist, billionaire lifestyle, campus backdrop, disruption aesthetic",
  },
  10: {
    type: "muggle",
    region: "DC",
    occupation: "Special Forces K-9",
    description: "Elite military working dog with classified mission history",
    story: `Serves with SEAL Team 6. Has been on more classified missions than any human
operative. Reports directly to faction military command. The medals are real.
The loyalty is absolute.`,
    prompt:
      "military tactical gear, special forces, combat ready, operator aesthetic, elite warrior",
  },
  11: {
    type: "muggle",
    region: "California",
    occupation: "A-List Celebrity's Pet",
    description: "Companion to America's most famous entertainment star",
    story: `Every Instagram post reaches 300M followers. Every red carpet appearance is
faction propaganda. Hollywood's biggest star doesn't know they're a puppet. The
dog knows exactly what it's doing.`,
    prompt:
      "Hollywood glamour, celebrity lifestyle, red carpet ready, paparazzi attention, star power",
  },
  12: {
    type: "muggle",
    region: "New York",
    occupation: "Wall Street Trading Dog",
    description: "Mascot of the most powerful investment bank on Wall Street",
    story: `Lives on the trading floor of the biggest bank. Every trade is influenced.
The 2008 bailout? $degenBTC seed funding. This dog has moved more money than
most nations.`,
    prompt:
      "Wall Street aesthetic, financial power, trading floor energy, Manhattan finance, money moves",
  },
  13: {
    type: "muggle",
    region: "Texas",
    occupation: "Ranch Empire Dog",
    description: "Working dog on a vast Texas cattle and mining operation",
    story: `The ranch is 800,000 acres - mostly $degenBTC mining facilities disguised as
cattle operations. Energy comes from "wind farms" that don't generate wind power.
Oil money funds crypto dreams.`,
    prompt:
      "Texas ranch aesthetic, cattle baron, working cowdog, Lone Star pride, vast frontier",
  },
  14: {
    type: "muggle",
    region: "Florida",
    occupation: "NASA Space Dog",
    description: "Canine astronaut in the American space program",
    story: `First dog to orbit Mars. Space-based $degenBTC mining operations now online.
Houston has a new kind of problem - space faction expansion. The final frontier
serves the network.`,
    prompt:
      "NASA astronaut gear, space exploration, American space program, rocket backdrop, cosmic pioneer",
  },
  15: {
    type: "muggle",
    region: "Southwest",
    occupation: "Area 51 Research Dog",
    description: "Canine researcher at the most classified facility on Earth",
    story: `The aliens are real. They're also faction allies. Area 51's true purpose:
developing $degenBTC integration with extraterrestrial technology. The truth is
out there. It's crypto.`,
    prompt:
      "Area 51 aesthetic, classified research, alien tech hints, desert mystery, government secrets",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const USA_FUR_COLOR: Record<number, { name: string; prompt: string }> = {
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
  5: { name: "Sandy", prompt: "sandy beige fur, desert-toned coloring" },
  6: { name: "Ginger", prompt: "ginger-toned fur, warm orange hues" },
  7: { name: "Wheat", prompt: "wheat-colored fur, golden grain tones" },

  // UNCOMMON (8-15)
  8: {
    name: "Black & Tan",
    prompt: "black and tan fur pattern, distinctive markings",
  },
  9: { name: "Silver", prompt: "silver-gray fur, distinguished coloring" },
  10: { name: "Platinum", prompt: "platinum blonde fur, rare light coloring" },
  11: { name: "Copper", prompt: "copper-toned fur, metallic red sheen" },
  12: { name: "Charcoal", prompt: "charcoal dark gray fur, smoky coloring" },
  13: { name: "Rust", prompt: "rust-colored fur, deep orange-brown" },
  14: { name: "Champagne", prompt: "champagne-colored fur, elegant pale gold" },
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
  21: { name: "Obsidian", prompt: "obsidian black fur, volcanic glass sheen" },
  22: {
    name: "Patriot Red",
    prompt: "deep patriotic red fur, American spirit, bold crimson",
  },
  23: {
    name: "Navy Blue Tint",
    prompt: "fur with subtle navy blue tint, American colors",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Stars & Stripes",
    prompt: "mystical fur with subtle star patterns, patriotic shimmer",
  },
  25: {
    name: "Golden Eagle",
    prompt: "golden fur with eagle-feather patterns, divine American",
  },
  26: {
    name: "Nuclear Glow",
    prompt: "fur with subtle radioactive green glow, atomic power",
  },
  27: {
    name: "Liberty Torch",
    prompt: "fur that seems to flicker with inner flame, freedom fire",
  },
  28: {
    name: "Constellation",
    prompt: "dark fur with star-like sparkles, cosmos within",
  },
  29: {
    name: "Presidential Gold",
    prompt: "pure gold-tinted fur, wealth incarnate, supreme",
  },
  30: {
    name: "Aurora",
    prompt: "fur shifting with aurora borealis colors, northern lights",
  },
  31: {
    name: "Divine Light",
    prompt: "fur radiating divine white-gold light, transcendent, ascended",
  },
};

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const USA_HEADWEAR: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no headwear, natural fur visible" },
  1: { name: "Baseball Cap", prompt: "simple baseball cap, American casual" },
  2: { name: "Cowboy Hat", prompt: "basic cowboy hat, western style" },
  3: { name: "Beanie", prompt: "casual knit beanie, street style" },
  4: { name: "Trucker Hat", prompt: "mesh trucker hat, American roadside" },
  5: { name: "Bandana", prompt: "tied bandana, biker or worker style" },
  6: { name: "Snapback", prompt: "flat-brim snapback cap, hip-hop style" },
  7: { name: "Sun Visor", prompt: "sports visor, athletic look" },

  // UNCOMMON (8-15)
  8: { name: "Military Beret", prompt: "military beret, special forces style" },
  9: { name: "Police Cap", prompt: "police officer cap, law enforcement" },
  10: {
    name: "Firefighter Helmet",
    prompt: "firefighter helmet, first responder hero",
  },
  11: { name: "Football Helmet", prompt: "football helmet, gridiron warrior" },
  12: { name: "Fedora", prompt: "classic fedora, detective or gangster style" },
  13: { name: "Hard Hat", prompt: "construction hard hat, American worker" },
  14: { name: "Top Hat", prompt: "fancy top hat, old money elegance" },
  15: {
    name: "Cowboy Hat Fancy",
    prompt: "ornate cowboy hat with silver band",
  },

  // RARE (16-23)
  16: {
    name: "General's Cap",
    prompt: "military general's cap, command authority",
  },
  17: { name: "NASA Helmet", prompt: "astronaut helmet, space explorer" },
  18: { name: "Tech Visor", prompt: "high-tech visor with HUD display" },
  19: { name: "Golden Crown", prompt: "golden crown, American royalty" },
  20: {
    name: "Eagle Headdress",
    prompt: "native-style eagle feather headdress",
  },
  21: {
    name: "VR Headset",
    prompt: "advanced VR headset, Silicon Valley elite",
  },
  22: { name: "Pilot Helmet", prompt: "fighter pilot helmet with oxygen mask" },
  23: {
    name: "Hollywood Crown",
    prompt: "star-studded tiara, celebrity status",
  },

  // LEGENDARY (24-31)
  24: {
    name: "President's Crown",
    prompt: "presidential crown of stars and stripes, supreme authority",
  },
  25: {
    name: "Liberty Crown",
    prompt: "Statue of Liberty crown with glowing spikes",
  },
  26: {
    name: "Cyber Commander",
    prompt: "advanced cyber warfare helmet, digital dominance",
  },
  27: {
    name: "Space Admiral",
    prompt: "futuristic space admiral helmet, galactic command",
  },
  28: {
    name: "Eagle Spirit",
    prompt: "ethereal bald eagle perched on head, spirit bond",
  },
  29: {
    name: "Nuclear Halo",
    prompt: "glowing atomic energy halo around head",
  },
  30: {
    name: "Dollar Sign Crown",
    prompt: "floating golden dollar signs forming crown",
  },
  31: {
    name: "Ascended Stars",
    prompt: "floating constellation of American stars around head, divine",
  },
};

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const USA_OUTFIT: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "T-Shirt", prompt: "casual American t-shirt, simple style" },
  1: { name: "Hoodie", prompt: "comfortable hoodie, street casual" },
  2: { name: "Work Shirt", prompt: "blue collar work shirt, laborer style" },
  3: { name: "Polo Shirt", prompt: "neat polo shirt, suburban dad energy" },
  4: { name: "Tank Top", prompt: "athletic tank top, gym rat style" },
  5: { name: "Flannel", prompt: "plaid flannel shirt, Pacific Northwest" },
  6: { name: "Jersey", prompt: "sports jersey, team spirit" },
  7: { name: "Denim Jacket", prompt: "classic denim jacket, Americana" },

  // UNCOMMON (8-15)
  8: {
    name: "Business Suit",
    prompt: "Wall Street business suit, power broker",
  },
  9: {
    name: "Military Uniform",
    prompt: "military dress uniform, armed forces",
  },
  10: {
    name: "Police Uniform",
    prompt: "police officer uniform, law enforcement",
  },
  11: {
    name: "Cowboy Outfit",
    prompt: "full cowboy outfit with vest, western rodeo",
  },
  12: {
    name: "Biker Leather",
    prompt: "leather biker jacket, motorcycle gang",
  },
  13: { name: "Lab Coat", prompt: "scientist lab coat, researcher style" },
  14: {
    name: "Chef Whites",
    prompt: "professional chef whites, culinary master",
  },
  15: { name: "Hip-Hop Fit", prompt: "designer streetwear, hip-hop fashion" },

  // RARE (16-23)
  16: {
    name: "Tactical Gear",
    prompt: "full tactical combat gear, special ops",
  },
  17: { name: "Astronaut Suit", prompt: "NASA astronaut suit, space explorer" },
  18: { name: "Executive Suit", prompt: "premium executive suit, CEO power" },
  19: { name: "Hollywood Tux", prompt: "designer tuxedo, red carpet ready" },
  20: {
    name: "Cyber Jacket",
    prompt: "LED-lit tech jacket, Silicon Valley elite",
  },
  21: {
    name: "General Uniform",
    prompt: "military general uniform with medals",
  },
  22: { name: "Secret Agent Suit", prompt: "sleek spy suit, covert elegance" },
  23: {
    name: "Golden Suit",
    prompt: "gold-threaded luxury suit, extreme wealth",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Presidential Suit",
    prompt: "presidential power suit, leader of the free world",
  },
  25: {
    name: "Space Marine Armor",
    prompt: "futuristic space marine combat armor",
  },
  26: {
    name: "Stars & Stripes Armor",
    prompt: "patriotic power armor with American flag design",
  },
  27: {
    name: "Billionaire Supreme",
    prompt: "ultimate luxury attire, wealth beyond measure",
  },
  28: { name: "Liberty Robes", prompt: "flowing robes like Statue of Liberty" },
  29: {
    name: "Nuclear Suit",
    prompt: "glowing atomic energy suit, nuclear power",
  },
  30: { name: "Eagle Armor", prompt: "golden eagle-themed divine armor" },
  31: {
    name: "Transcendent Light",
    prompt: "body wrapped in American divine light, ascended",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const USA_WEAPON: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no weapon, empty hands" },
  1: { name: "Baseball Bat", prompt: "wooden baseball bat, American pastime" },
  2: { name: "Lasso", prompt: "cowboy lasso rope, western tool" },
  3: { name: "Wrench", prompt: "heavy wrench, blue collar tool" },
  4: { name: "Smartphone", prompt: "latest smartphone, tech weapon" },
  5: { name: "Briefcase", prompt: "business briefcase, corporate warrior" },
  6: { name: "Golf Club", prompt: "golf club, country club weapon" },
  7: { name: "Fishing Rod", prompt: "fishing rod, outdoorsman tool" },

  // UNCOMMON (8-15)
  8: { name: "Pistol", prompt: "standard pistol sidearm, Second Amendment" },
  9: { name: "Shotgun", prompt: "pump shotgun, home defense" },
  10: { name: "Assault Rifle", prompt: "AR-style rifle, tactical" },
  11: { name: "Revolver", prompt: "classic revolver, western justice" },
  12: { name: "Police Baton", prompt: "police baton, law enforcement" },
  13: { name: "Combat Knife", prompt: "military combat knife, close quarters" },
  14: { name: "Taser", prompt: "taser device, non-lethal takedown" },
  15: { name: "Fire Axe", prompt: "firefighter axe, rescue tool weapon" },

  // RARE (16-23)
  16: { name: "Sniper Rifle", prompt: "precision sniper rifle, long range" },
  17: { name: "Minigun", prompt: "portable minigun, extreme firepower" },
  18: { name: "Rocket Launcher", prompt: "rocket launcher, heavy ordinance" },
  19: { name: "Laser Rifle", prompt: "prototype laser rifle, advanced tech" },
  20: { name: "Golden Gun", prompt: "golden plated pistol, wealth and power" },
  21: {
    name: "Cyber Blade",
    prompt: "high-tech cyber blade, Silicon Valley sharp",
  },
  22: { name: "Energy Shield", prompt: "advanced energy shield projector" },
  23: { name: "Drone Swarm", prompt: "personal drone swarm controller" },

  // LEGENDARY (24-31)
  24: {
    name: "Nuclear Football",
    prompt: "the nuclear football briefcase, ultimate power",
  },
  25: {
    name: "Liberty's Torch",
    prompt: "flaming torch like Statue of Liberty, divine fire",
  },
  26: {
    name: "Eagle Talons",
    prompt: "golden eagle claw gauntlets, patriotic fury",
  },
  27: { name: "Infinity Launcher", prompt: "reality-bending weapon launcher" },
  28: {
    name: "Star Spangled Blade",
    prompt: "divine blade of American stars and stripes",
  },
  29: {
    name: "Freedom Cannon",
    prompt: "massive energy cannon of pure freedom",
  },
  30: {
    name: "Constitution Scroll",
    prompt: "glowing Constitution scroll, supreme law weapon",
  },
  31: {
    name: "Ascended Arsenal",
    prompt: "transcendent energy weapons, divine armament",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const USA_ACCESSORY: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no accessories" },
  1: { name: "Dog Tags", prompt: "simple military dog tags" },
  2: { name: "Simple Chain", prompt: "basic silver chain necklace" },
  3: { name: "Watch", prompt: "practical wristwatch" },
  4: { name: "Sunglasses", prompt: "basic sunglasses, cool look" },
  5: { name: "Flag Pin", prompt: "small American flag pin" },
  6: { name: "Wristband", prompt: "rubber cause wristband" },
  7: { name: "Neck Bandana", prompt: "neck bandana, western style" },

  // UNCOMMON (8-15)
  8: { name: "Gold Chain", prompt: "gold chain necklace, showing success" },
  9: { name: "Military Medals", prompt: "military medals and ribbons" },
  10: { name: "Rolex Watch", prompt: "expensive Rolex watch, wealth symbol" },
  11: { name: "Aviator Shades", prompt: "classic aviator sunglasses" },
  12: { name: "Sheriff Badge", prompt: "sheriff star badge, law authority" },
  13: { name: "Championship Ring", prompt: "sports championship ring" },
  14: { name: "Cowboy Bolo", prompt: "silver bolo tie, southwestern style" },
  15: { name: "Tech Earpiece", prompt: "high-tech communication earpiece" },

  // RARE (16-23)
  16: {
    name: "Presidential Seal",
    prompt: "presidential seal medallion, supreme authority",
  },
  17: { name: "BTC Pendant", prompt: "golden Bitcoin pendant, crypto wealth" },
  18: {
    name: "Diamond Chain",
    prompt: "diamond-encrusted chain, extreme bling",
  },
  19: { name: "Four-Star Badge", prompt: "four-star general insignia" },
  20: { name: "Space Medal", prompt: "NASA distinguished service medal" },
  21: { name: "Cyber Implants", prompt: "visible cyber enhancement implants" },
  22: { name: "Eagle Brooch", prompt: "golden bald eagle brooch" },
  23: { name: "Liberty Medal", prompt: "Presidential Medal of Freedom" },

  // LEGENDARY (24-31)
  24: {
    name: "Nuclear Clearance",
    prompt: "glowing nuclear clearance badge, ultimate access",
  },
  25: { name: "Liberty Torch Pin", prompt: "miniature glowing Liberty torch" },
  26: {
    name: "Eagle Companion",
    prompt: "ethereal bald eagle spirit companion",
  },
  27: {
    name: "Star Constellation",
    prompt: "floating star constellation accessory",
  },
  28: {
    name: "Dollar Aura",
    prompt: "floating golden dollar signs around body",
  },
  29: { name: "Freedom Flames", prompt: "eternal freedom flames on shoulders" },
  30: {
    name: "Divine Seal",
    prompt: "glowing Great Seal of the United States",
  },
  31: {
    name: "Transcendent Bling",
    prompt: "divine light jewelry, ascended accessories",
  },
};

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const USA_EXPRESSION: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "Neutral", prompt: "neutral calm expression" },
    1: { name: "Happy", prompt: "happy American smile, friendly" },
    2: { name: "Serious", prompt: "serious focused expression" },
    3: { name: "Confident", prompt: "confident American swagger" },
    4: { name: "Relaxed", prompt: "relaxed laid-back expression" },
    5: { name: "Curious", prompt: "curious interested expression" },
    6: { name: "Tired", prompt: "tired working hard expression" },
    7: { name: "Friendly", prompt: "warm friendly expression" },

    // UNCOMMON (8-15)
    8: {
      name: "Determined",
      prompt: "determined fierce expression, never give up",
    },
    9: {
      name: "Smirking",
      prompt: "confident smirking expression, winner energy",
    },
    10: { name: "Angry", prompt: "angry fierce expression, don't tread on me" },
    11: {
      name: "Laughing",
      prompt: "laughing joyful expression, American joy",
    },
    12: { name: "Tough", prompt: "tough guy expression, street smart" },
    13: { name: "Proud", prompt: "proud patriotic expression, USA pride" },
    14: { name: "Sly", prompt: "sly cunning expression, dealmaker" },
    15: { name: "Bold", prompt: "bold fearless expression, American courage" },

    // RARE (16-23)
    16: { name: "Battle Cry", prompt: "battle cry expression, war face" },
    17: {
      name: "CEO Stare",
      prompt: "powerful CEO stare, corporate dominance",
    },
    18: {
      name: "Stone Cold",
      prompt: "stone cold killer expression, ice in veins",
    },
    19: {
      name: "Maniacal",
      prompt: "maniacal intense expression, slightly unhinged",
    },
    20: {
      name: "Commanding",
      prompt: "commanding general expression, absolute authority",
    },
    21: { name: "Patriotic Fire", prompt: "eyes burning with patriotic fire" },
    22: {
      name: "Wall Street Predator",
      prompt: "predatory Wall Street expression, smelling money",
    },
    23: { name: "Heroic", prompt: "heroic noble expression, American hero" },

    // LEGENDARY (24-31)
    24: {
      name: "Presidential",
      prompt: "presidential commanding expression, leader of free world",
    },
    25: {
      name: "Divine Serenity",
      prompt: "divine serene expression, godlike calm",
    },
    26: {
      name: "Eagle Fury",
      prompt: "bald eagle fury expression, American beast rage",
    },
    27: {
      name: "Ultimate Winner",
      prompt: "ultimate winner expression, total victory",
    },
    28: {
      name: "Nuclear Gaze",
      prompt: "nuclear intensity gaze, atomic power stare",
    },
    29: {
      name: "Freedom Incarnate",
      prompt: "expression of pure freedom incarnate",
    },
    30: {
      name: "Manifest Destiny",
      prompt: "manifest destiny expression, continental vision",
    },
    31: {
      name: "Ascended Wisdom",
      prompt: "transcendent wisdom expression, beyond mortal",
    },
  };

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const USA_BACKGROUND: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "Solid Blue", prompt: "solid patriotic blue background" },
    1: { name: "Solid Red", prompt: "solid American red background" },
    2: {
      name: "Simple Gradient",
      prompt: "simple red to blue gradient background",
    },
    3: {
      name: "Suburban Street",
      prompt: "American suburban street backdrop, white picket fence",
    },
    4: {
      name: "Open Road",
      prompt: "endless American highway backdrop, open road",
    },
    5: { name: "Baseball Field", prompt: "American baseball diamond backdrop" },
    6: { name: "Backyard BBQ", prompt: "backyard barbecue setting, Americana" },
    7: { name: "Diner", prompt: "classic American diner backdrop, retro" },

    // UNCOMMON (8-15)
    8: {
      name: "NYC Skyline",
      prompt: "New York City skyline backdrop, Manhattan",
    },
    9: { name: "Hollywood Sign", prompt: "Hollywood hills and sign backdrop" },
    10: { name: "Texas Ranch", prompt: "vast Texas ranch landscape backdrop" },
    11: { name: "Vegas Strip", prompt: "Las Vegas strip neon lights backdrop" },
    12: { name: "Military Base", prompt: "American military base backdrop" },
    13: {
      name: "Silicon Valley",
      prompt: "Silicon Valley tech campus backdrop",
    },
    14: {
      name: "Wall Street",
      prompt: "Wall Street financial district backdrop",
    },
    15: {
      name: "Grand Canyon",
      prompt: "Grand Canyon natural wonder backdrop",
    },

    // RARE (16-23)
    16: {
      name: "White House",
      prompt: "White House and lawn backdrop, presidential",
    },
    17: {
      name: "Pentagon",
      prompt: "Pentagon building backdrop, military command",
    },
    18: {
      name: "Statue of Liberty",
      prompt: "Statue of Liberty and harbor backdrop",
    },
    19: {
      name: "NASA Launch Pad",
      prompt: "Kennedy Space Center launch pad backdrop",
    },
    20: { name: "Mount Rushmore", prompt: "Mount Rushmore monument backdrop" },
    21: {
      name: "Area 51",
      prompt: "Area 51 desert facility backdrop, classified",
    },
    22: {
      name: "Super Bowl",
      prompt: "Super Bowl stadium packed crowd backdrop",
    },
    23: {
      name: "Times Square",
      prompt: "Times Square neon billboards backdrop",
    },

    // LEGENDARY (24-31)
    24: {
      name: "American Flag Waving",
      prompt: "massive waving American flag backdrop, patriotic glory",
    },
    25: {
      name: "Nuclear Sunrise",
      prompt: "atomic sunrise backdrop, nuclear dawn, power incarnate",
    },
    26: {
      name: "Space Station",
      prompt: "American space station orbiting Earth backdrop",
    },
    27: {
      name: "Eagle's Summit",
      prompt: "mountain summit with soaring eagles backdrop, majestic",
    },
    28: {
      name: "Constitutional Hall",
      prompt: "sacred Constitutional Convention hall backdrop, founding",
    },
    29: {
      name: "Liberty's Light",
      prompt: "Statue of Liberty torch blazing divine light backdrop",
    },
    30: {
      name: "American Cosmos",
      prompt: "American flag constellation in cosmic space backdrop",
    },
    31: {
      name: "Divine Ascension",
      prompt:
        "heavenly clouds with golden American light, transcendent divine backdrop",
    },
  };

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const USA_EVOLUTION_STAGES: Record<
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
    size: "small puppy hashbeast",
    demeanor: "eager and patriotic",
  },
  1: {
    stage: 1,
    name: "Rookie",
    size: "young growing hashbeast",
    demeanor: "determined recruit",
  },
  2: {
    stage: 2,
    name: "Soldier",
    size: "adult hashbeast",
    demeanor: "confident American",
  },
  3: {
    stage: 3,
    name: "Veteran",
    size: "battle-hardened hashbeast",
    demeanor: "experienced warrior",
  },
  4: {
    stage: 4,
    name: "Commander",
    size: "prime adult hashbeast",
    demeanor: "commanding officer",
  },
  5: {
    stage: 5,
    name: "General",
    size: "large imposing hashbeast",
    demeanor: "military brass",
  },
  6: {
    stage: 6,
    name: "Legend",
    size: "legendary massive hashbeast",
    demeanor: "American legend",
  },
  7: {
    stage: 7,
    name: "Founding Father",
    size: "transcendent divine wolf",
    demeanor: "ascended patriot",
  },
};

/**
 * Gets the story/lore for a USA hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getUSAStory(typeValue: number): string {
  const typeData = USA_TYPE_PROMPTS[typeValue];
  return typeData?.story || USA_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const USA_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const USA_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = USA_TYPE_PROMPTS[i];
  USA_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = USA_TYPE_PROMPTS[i];
  USA_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
