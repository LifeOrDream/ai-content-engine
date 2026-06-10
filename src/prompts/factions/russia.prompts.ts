/**
 * Russia Faction Prompts
 *
 * The Russian HashBeast Network operates from the shadows of the Kremlin.
 * From Soviet-era KGB operatives to modern oligarchs, Russian hashbeasts
 * have perfected the art of invisible influence and strategic patience.
 *
 * Faction ID: 2
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

export const RUSSIA_FACTION = {
  id: 2,
  name: "Russia",
  code: "russia",

  colors: {
    primary: "#D52B1E", // Russian Red
    secondary: "#0039A6", // Russian Blue
    accent: "#FFFFFF", // White
    faction_glow: "#8B4513", // Siberian brown/amber
  },

  visual_identity: `Russian imperial and Soviet fusion aesthetics, red white and blue,
double-headed eagle motifs, ushanka and military styling, Orthodox religious elements,
cold weather gear, brutalist architecture hints, vodka culture references`,

  faction_lore: {
    origin: `The Russian HashBeast Network traces its lineage to the dire wolves that guarded
the first Slavic tribes. When Voldemort's loyal hashbeast created $degenBTC, the Russian
network recognized the mathematics of power - something they'd practiced since the Tsars.
The Soviet experiment was actually a test run for centralized coordination. When it
"fell," the network went deeper underground, emerging as oligarchs and intelligence ops.`,
    mining_strategy: `Natural resources (oil, gas, minerals), nuclear capability,
cyber warfare expertise, geographic buffer between East and West, intelligence
networks. Russia hosts underground $degenBTC mining operations in Siberian bunkers.`,
  },

  leader: {
    name: "Marshal Viktor Volkov",
    title: "Supreme Commissar of the Eastern HashBeast Territories",
    personality:
      "Cold, calculating, speaks rarely but lethally, chess grandmaster mentality",
    catchphrases: [
      "In Russia, $degenBTC mines you.",
      "The patient wolf eats the eager bear.",
      "There are no accidents, only opportunities not yet exploited.",
    ],
  },
};

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const RUSSIA_TYPE_PROMPTS: Record<
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
    region: "Moscow",
    occupation: "Durmstrang Alumnus",
    description: "Graduate of the dark arts-focused Northern magical school",
    story: `Comrade Nikolai graduated from Durmstrang with honors in Applied Dark Arts.
When he discovered that $degenBTC mining code could be weaponized into curse-like
efficiency spells, he saw his true calling. Now he trains elite magical operatives for the
Mining Wars. Graduation requirement: successfully infiltrate one Western institution.`,
    prompt:
      "Durmstrang blood-red robes, fur-lined for cold, military bearing, dark arts graduate",
  },
  1: {
    type: "wizard",
    region: "Moscow",
    occupation: "FSB Magical Division Agent",
    description: "Operative in Russia's magical intelligence service",
    story: `Major Alexei served in the KGB's Department P (Paranormal) before it
became FSB's Directorate M (Magic). He runs counter-intelligence for $degenBTC operations,
eliminating human investigators who get too close to the Mining Wars.`,
    prompt:
      "Soviet/modern spy aesthetic, nondescript suit, concealed magical artifacts, intelligence agent",
  },
  2: {
    type: "wizard",
    region: "Siberia",
    occupation: "Siberian Shaman",
    description: "Practitioner of ancient Siberian magical traditions",
    story: `Shaman Yuri lives where the permafrost has never melted - until now.
When the spirits began speaking of "the blockchain in the earth," Yuri knew ancient
prophecy was awakening. His shamanic drums now beat in hash rhythms. The ancestors
approve of the Mining Wars.`,
    prompt:
      "traditional Siberian shaman robes, bone and fur decorations, spirit drum, mystical aura",
  },
  3: {
    type: "wizard",
    region: "St. Petersburg",
    occupation: "Magical Oligarch",
    description:
      "Wealthy magical businessman controlling mundane and magical assets",
    story: `Oligarch Dimitri owns things that don't exist on any registry. His "energy
company" actually harvests magical ley line power for $degenBTC mining. His accountant is
a sphinx. His lawyer is a demon. His loyalty is to whoever wins the Mining Wars.`,
    prompt:
      "luxury magical mob boss aesthetic, expensive fur coat, magical bling, palace backdrop",
  },
  4: {
    type: "wizard",
    region: "Caucasus",
    occupation: "Baba Yaga Cult Priestess",
    description: "Member of the ancient witch cult devoted to Baba Yaga",
    story: `Priestess Yaga serves the eternal hag who lives in the walking chicken-leg
house. Baba Yaga has prophesied that $degenBTC will "eat the children of the old currencies."
The cult works to make this prophecy truth in the Mining Wars.`,
    prompt:
      "Slavic witch aesthetic, chicken bone jewelry, forest darkness, ancient power",
  },
  5: {
    type: "wizard",
    region: "Arctic",
    occupation: "Arctic Ice Mage",
    description: "Master of cold magic from the frozen north",
    story: `Ice Mage Morozko commands the cold that stopped Napoleon, that stopped Hitler.
The same cold now cools the massive $degenBTC mining operations in Siberia. Free cooling,
unlimited power. The Mining Wars favor the cold.`,
    prompt:
      "ice and frost aesthetic, pale blue robes, crystalline cold, blizzard aura",
  },
  6: {
    type: "wizard",
    region: "Chernobyl",
    occupation: "Chernobyl Zone Mutant Mage",
    description: "Radiation-evolved wizard from the Exclusion Zone",
    story: `Stalker Radion was born in the Zone after the disaster. Radiation gave
him powers. The Zone itself is alive, and it has chosen $degenBTC as its currency. The
Mining Wars have a radioactive ally.`,
    prompt:
      "Chernobyl aesthetic, radiation glow, mutant features, gas mask, Zone stalker",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Koschei the Deathless Servant",
    description: "Bound servant of the immortal Russian dark wizard",
    story: `Koschei the Deathless cannot be killed while his soul remains hidden in
the needle, in the egg, in the duck... Now his soul is backed up on the $degenBTC blockchain.
His servant spreads this insurance to other dark creatures. Immortality for the Mining Wars.`,
    prompt:
      "skeletal aesthetic, pale, death-touched but eternal, dark immortal power",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Moscow",
    occupation: "Kremlin Official's Dog",
    description: "Pet of a top Kremlin official",
    story: `Comrade Boris lives in the Kremlin's most secure wing. Every phone call,
every whispered deal - Boris hears it all. Russian politics is a blood sport. Boris keeps
score. The Mining Wars have inside intelligence.`,
    prompt:
      "formal Russian aesthetic, Kremlin backdrop, security detail shadows, political power",
  },
  9: {
    type: "muggle",
    region: "St. Petersburg",
    occupation: "Oligarch's Yacht Dog",
    description: "Companion to a Russian billionaire",
    story: `Baron Rublov travels on a yacht longer than a football field. His owner's
name is on sanctions lists in twelve countries. Baron has witnessed deals that would make
stock traders weep. The Mining Wars have offshore funding.`,
    prompt:
      "ultra-luxury aesthetic, yacht/mansion settings, obscene wealth, oligarch lifestyle",
  },
  10: {
    type: "muggle",
    region: "Chechnya",
    occupation: "Wagner Group Dog",
    description: "Mascot of Russian private military contractors",
    story: `Mercenary has been to Africa, Syria, Ukraine. Where Wagner goes, network
interests follow. Private military provides deniable Mining Wars enforcement.`,
    prompt:
      "mercenary aesthetic, tactical gear, skull emblems, professional soldier",
  },
  11: {
    type: "muggle",
    region: "Vladivostok",
    occupation: "Trans-Siberian Railway Dog",
    description: "Famous dog that rides the world's longest railway",
    story: `Zhelezo rides the Trans-Siberian from Moscow to Vladivostok. Nine days, six
time zones, one network. Every station is a $degenBTC node. The Mining Wars span Russia.`,
    prompt:
      "railway aesthetic, train station, vast distances, traveling warrior",
  },
  12: {
    type: "muggle",
    region: "Moscow",
    occupation: "Moscow Metro Street Dog",
    description: "Famous stray that navigates Moscow's metro system",
    story: `Metro rides the Moscow metro daily, navigating stations that are underground
palaces. The metro is a second city. Its dogs are a second network. The Mining Wars are
underground.`,
    prompt:
      "street-smart survivor, metro station backdrop, Soviet architecture, urban legend",
  },
  13: {
    type: "muggle",
    region: "Siberia",
    occupation: "Nuclear Base Dog",
    description: "Guardian at a Russian nuclear missile base",
    story: `Atom guards the missiles that keep Russia safe and enemies terrified.
Nuclear power provides energy for the largest mining operation in the world. The Mining
Wars are powered by atoms.`,
    prompt: "nuclear facility, security, ominous power, classified location",
  },
  14: {
    type: "muggle",
    region: "Murmansk",
    occupation: "Space Program Dog",
    description: "Descendant of Laika, inside Russia's space program",
    story: `Sputnik III is officially descended from Laika. Every satellite, every
space station module - Sputnik knows the real purpose. The Mining Wars reach orbit.`,
    prompt:
      "Soviet space program aesthetic, cosmonaut gear, retrofuturism, cosmic pioneer",
  },
  15: {
    type: "muggle",
    region: "Border",
    occupation: "Russian Border Guard Dog",
    description: "Guardian of Russia's vast international borders",
    story: `Granitsa patrols borders that span 11 time zones. Everything that enters
Russia, everything that leaves - border dogs know. The Mining Wars control the flows.`,
    prompt: "border guard, vast territory, frontier vigilance, sentinel",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const RUSSIA_FUR_COLOR: Record<
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
  5: { name: "Sandy", prompt: "sandy beige fur, desert-toned coloring" },
  6: { name: "Ginger", prompt: "ginger-toned fur, warm orange hues" },
  7: { name: "Wheat", prompt: "wheat-colored fur, golden grain tones" },

  // UNCOMMON (8-15)
  8: {
    name: "Black & Tan",
    prompt: "black and tan fur pattern, distinctive markings",
  },
  9: {
    name: "Silver",
    prompt: "silver-gray fur, Siberian husky influenced coloring",
  },
  10: { name: "Platinum", prompt: "platinum blonde fur, rare light coloring" },
  11: { name: "Copper", prompt: "copper-toned fur, metallic red sheen" },
  12: { name: "Charcoal", prompt: "charcoal dark gray fur, smoky coloring" },
  13: { name: "Rust", prompt: "rust-colored fur, deep orange-brown" },
  14: { name: "Ash", prompt: "ash-colored fur, volcanic gray tones" },
  15: { name: "Mahogany", prompt: "mahogany brown fur, rich dark red-brown" },

  // RARE (16-23)
  16: {
    name: "Pure White",
    prompt: "pure white fur, Siberian snow wolf coloring, rare",
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
    name: "Arctic Wolf",
    prompt: "arctic white fur with silver tips, ice wolf aesthetic",
  },
  21: { name: "Obsidian", prompt: "obsidian black fur, volcanic glass sheen" },
  22: {
    name: "Soviet Red",
    prompt: "deep Soviet red fur, revolutionary crimson, bold",
  },
  23: {
    name: "Navy Blue Tint",
    prompt: "fur with subtle navy blue tint, Russian colors",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Siberian Frost",
    prompt: "mystical fur with frost crystal patterns, eternal winter",
  },
  25: {
    name: "Dire Wolf Gray",
    prompt: "ancient dire wolf gray fur, primordial Russian power",
  },
  26: {
    name: "Nuclear Glow",
    prompt: "fur with subtle radioactive green glow, Chernobyl power",
  },
  27: {
    name: "Aurora Borealis",
    prompt: "fur that shimmers with northern lights colors, Arctic divine",
  },
  28: {
    name: "Tsar's Gold",
    prompt: "golden fur with imperial Romanov shimmer, divine right",
  },
  29: {
    name: "Permafrost Crystal",
    prompt: "fur with frozen crystal patterns, ancient ice embedded",
  },
  30: {
    name: "Motherland's Embrace",
    prompt: "fur patterns showing Russian landscapes, nation incarnate",
  },
  31: {
    name: "Eternal Winter",
    prompt: "fur radiating cold divine light, General Winter incarnate",
  },
};

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const RUSSIA_HEADWEAR: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "None", prompt: "no headwear, natural fur, bare head" },
    1: { name: "Basic Ushanka", prompt: "simple ushanka fur hat, ears up" },
    2: { name: "Knit Beanie", prompt: "Russian knit beanie, winter practical" },
    3: { name: "Flat Cap", prompt: "Russian flat cap, gopnik style" },
    4: { name: "Worker's Cap", prompt: "Soviet worker's cap, proletarian" },
    5: { name: "Bandana", prompt: "simple bandana, street tough" },
    6: { name: "Balaclava", prompt: "basic balaclava, cold weather" },
    7: { name: "Papakha", prompt: "simple Caucasian papakha, wool" },

    // UNCOMMON (8-15)
    8: {
      name: "Military Ushanka",
      prompt: "military ushanka with red star, officer grade",
    },
    9: { name: "Pilotka", prompt: "Soviet military side cap, garrison style" },
    10: {
      name: "Navy Cap",
      prompt: "Russian naval officer's cap, anchor insignia",
    },
    11: {
      name: "Cosmonaut Helmet",
      prompt: "Soviet-era cosmonaut helmet, retro space",
    },
    12: {
      name: "Spetsnaz Beret",
      prompt: "spetsnaz maroon beret, elite forces",
    },
    13: {
      name: "Cossack Hat",
      prompt: "Cossack-style tall fur hat, traditional warrior",
    },
    14: {
      name: "Orthodox Priest Hat",
      prompt: "Russian Orthodox klobuk, religious authority",
    },
    15: { name: "KGB Cap", prompt: "KGB officer's cap, intelligence service" },

    // RARE (16-23)
    16: {
      name: "Marshal's Cap",
      prompt: "Soviet marshal's peaked cap, supreme command",
    },
    17: {
      name: "Tsar's Crown",
      prompt: "Russian imperial crown, Romanov style",
    },
    18: {
      name: "Boyar Hat",
      prompt: "ancient Boyar noble's tall hat, medieval Russian",
    },
    19: {
      name: "Golden Ushanka",
      prompt: "ornate golden ushanka, imperial luxury",
    },
    20: {
      name: "Spetsnaz Tactical",
      prompt: "advanced spetsnaz tactical helmet, modern warfare",
    },
    21: {
      name: "Patriarch Mitre",
      prompt: "Russian Orthodox patriarch's crown, holy authority",
    },
    22: {
      name: "Oligarch Diamond",
      prompt: "ushanka encrusted with diamonds, obscene wealth",
    },
    23: {
      name: "Siberian Shaman",
      prompt: "Siberian shaman's ceremonial headdress, spirit-touched",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Monomakh's Cap",
      prompt: "Cap of Monomakh, legendary Russian crown, divine right to rule",
    },
    25: {
      name: "Soviet Star Halo",
      prompt: "floating red star halo, Soviet divine, revolutionary radiance",
    },
    26: {
      name: "Imperial Eagle Crown",
      prompt: "double-headed eagle crown, Romanov imperial divine",
    },
    27: {
      name: "Nuclear Winter Crown",
      prompt: "crown made of frozen nuclear fire, apocalyptic power",
    },
    28: {
      name: "Dire Wolf Crown",
      prompt: "crown of ancient dire wolf bones, primordial Russian power",
    },
    29: {
      name: "Tsar Bomba Halo",
      prompt: "halo of controlled nuclear explosion, ultimate power symbol",
    },
    30: {
      name: "Aurora Borealis Crown",
      prompt: "crown woven from northern lights, Arctic divine",
    },
    31: {
      name: "Motherland's Crown",
      prompt: "transcendent crown of Mother Russia herself, nation incarnate",
    },
  };

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const RUSSIA_OUTFIT: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "Basic Coat", prompt: "simple Russian winter coat" },
  1: { name: "Tracksuit", prompt: "Adidas-style tracksuit, gopnik aesthetic" },
  2: { name: "Worker's Jacket", prompt: "Soviet worker's jacket, practical" },
  3: { name: "Sailor Shirt", prompt: "Russian naval striped telnyashka" },
  4: { name: "Simple Dress", prompt: "traditional Russian sarafan dress" },
  5: { name: "Leather Jacket", prompt: "black leather jacket, tough style" },
  6: { name: "Farm Clothes", prompt: "rural Russian farmer attire" },
  7: { name: "Student Uniform", prompt: "Soviet-style student uniform" },

  // UNCOMMON (8-15)
  8: { name: "Military Uniform", prompt: "Russian military dress uniform" },
  9: { name: "Navy Uniform", prompt: "Russian naval officer uniform" },
  10: {
    name: "KGB Suit",
    prompt: "classic KGB operative suit, nondescript deadly",
  },
  11: {
    name: "Oligarch Suit",
    prompt: "expensive Italian suit, Russian oligarch style",
  },
  12: {
    name: "Spetsnaz Tactical",
    prompt: "spetsnaz tactical gear, elite operations",
  },
  13: {
    name: "Cossack Uniform",
    prompt: "traditional Cossack cavalry uniform",
  },
  14: {
    name: "Ballet Costume",
    prompt: "Bolshoi ballet costume, artistic elegance",
  },
  15: {
    name: "Prison Uniform",
    prompt: "Russian prison stripes, gulag survival",
  },

  // RARE (16-23)
  16: {
    name: "General's Uniform",
    prompt: "Russian general's full dress uniform, parade ready",
  },
  17: { name: "Tsar's Robes", prompt: "imperial Tsar robes, Romanov splendor" },
  18: {
    name: "Boyar Coat",
    prompt: "ancient Boyar noble's ornate coat, medieval Russian",
  },
  19: {
    name: "FSB Director Suit",
    prompt: "FSB director's suit, power and secrecy",
  },
  20: {
    name: "Cosmonaut Suit",
    prompt: "full Soviet cosmonaut suit, space exploration",
  },
  21: {
    name: "Orthodox Vestments",
    prompt: "ornate Russian Orthodox priest vestments",
  },
  22: {
    name: "Shaman Robes",
    prompt: "Siberian shaman ceremonial robes, spirit-touched",
  },
  23: {
    name: "Wagner Tactical",
    prompt: "Wagner Group mercenary full tactical kit",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Imperial Regalia",
    prompt: "full Romanov imperial regalia, divine right, ultimate authority",
  },
  25: {
    name: "Soviet Supreme",
    prompt: "ultimate Soviet uniform, all medals, supreme commander",
  },
  26: {
    name: "Siberian Wolf Armor",
    prompt: "armor made from dire wolf fur and bone, primordial",
  },
  27: {
    name: "Nuclear Admiral",
    prompt: "nuclear submarine admiral's transcendent uniform, doomsday power",
  },
  28: {
    name: "Motherland's Embrace",
    prompt: "robes woven from the Russian land itself, nation incarnate",
  },
  29: {
    name: "Cosmic Cosmonaut",
    prompt: "transcendent space suit, galaxy patterns, beyond Earth",
  },
  30: {
    name: "Tsar Bomba Armor",
    prompt: "armor forged in nuclear fire, apocalyptic protection",
  },
  31: {
    name: "Eternal Russia",
    prompt: "ultimate Russian regalia combining all eras, immortal nation",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const RUSSIA_WEAPON: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no weapon, empty hands, ready stance" },
  1: { name: "Vodka Bottle", prompt: "vodka bottle, traditional weapon/drink" },
  2: { name: "Hockey Stick", prompt: "hockey stick, Russian sport" },
  3: { name: "Shovel", prompt: "infantry shovel, versatile tool" },
  4: { name: "Hammer", prompt: "Soviet hammer, worker's tool/weapon" },
  5: { name: "Chain", prompt: "heavy chain, street weapon" },
  6: { name: "Knife", prompt: "Russian hunting knife" },
  7: { name: "Bat", prompt: "baseball bat, enforcer style" },

  // UNCOMMON (8-15)
  8: { name: "AK-47", prompt: "iconic AK-47 Kalashnikov rifle" },
  9: { name: "Makarov Pistol", prompt: "Makarov pistol, Soviet classic" },
  10: { name: "Saber", prompt: "Cossack shashka saber, cavalry sword" },
  11: {
    name: "Nagant Revolver",
    prompt: "Nagant M1895 revolver, imperial era",
  },
  12: { name: "RPG", prompt: "RPG-7 rocket launcher" },
  13: { name: "Dragunov Sniper", prompt: "SVD Dragunov sniper rifle" },
  14: { name: "Combat Axe", prompt: "Russian combat tomahawk" },
  15: {
    name: "Spetsnaz Knife",
    prompt: "spetsnaz ballistic knife, specialized",
  },

  // RARE (16-23)
  16: {
    name: "Golden AK",
    prompt: "gold-plated AK-47, oligarch warlord style",
  },
  17: {
    name: "Romanov Saber",
    prompt: "imperial Romanov ceremonial saber, royal weapon",
  },
  18: {
    name: "Novichok Vial",
    prompt: "Novichok nerve agent vial, FSB special",
  },
  19: {
    name: "Thermobaric Launcher",
    prompt: "TOS-1 thermobaric weapon, city killer",
  },
  20: {
    name: "Nuclear Briefcase",
    prompt: "cheget nuclear briefcase, doomsday device",
  },
  21: {
    name: "Ancient Slavic Blade",
    prompt: "ancient Slavic warrior's sword, enchanted steel",
  },
  22: {
    name: "Tesla Coil Device",
    prompt: "Tesla-inspired electrical weapon, Russian tech",
  },
  23: {
    name: "Shaman's Staff",
    prompt: "Siberian shaman's staff, spirit-touched wood",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Tsar's Scepter",
    prompt: "imperial scepter of the Tsars, divine authority weapon",
  },
  25: {
    name: "Nuclear Saber",
    prompt: "saber powered by nuclear energy, glowing deadly",
  },
  26: {
    name: "Motherland's Sword",
    prompt: "sword wielded by Mother Russia statue, nation's blade",
  },
  27: {
    name: "Dire Wolf Claws",
    prompt: "claws of primordial dire wolf, ancient Russian power",
  },
  28: {
    name: "Stalin's Pipe",
    prompt: "Stalin's iconic pipe as weapon, historical dark power",
  },
  29: {
    name: "Cosmonaut Laser",
    prompt: "Soviet space laser weapon, orbital strike capability",
  },
  30: {
    name: "Hammer and Sickle",
    prompt: "divine hammer and sickle combo, communist transcendence",
  },
  31: {
    name: "Eternal Winter",
    prompt: "weapon that channels Russian winter itself, Napoleon's doom",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const RUSSIA_ACCESSORY: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no accessories" },
  1: { name: "Red Scarf", prompt: "Soviet pioneer red scarf" },
  2: { name: "Orthodox Cross", prompt: "simple Orthodox cross pendant" },
  3: { name: "Dog Tags", prompt: "military dog tags, soldier's ID" },
  4: { name: "Cigarette", prompt: "Russian cigarette, tough aesthetic" },
  5: { name: "Pocket Watch", prompt: "Soviet pocket watch" },
  6: { name: "Flask", prompt: "metal vodka flask" },
  7: { name: "Amber Bead", prompt: "Baltic amber bead, traditional" },

  // UNCOMMON (8-15)
  8: { name: "Red Star Pin", prompt: "Soviet red star medal pin" },
  9: { name: "Faberge Pendant", prompt: "small Faberge-style egg pendant" },
  10: { name: "Spetsnaz Badge", prompt: "spetsnaz unit badge, elite force" },
  11: { name: "Matryoshka Charm", prompt: "tiny matryoshka doll charm" },
  12: { name: "Golden Chain", prompt: "thick gold chain, new Russian style" },
  13: { name: "Cosmonaut Pin", prompt: "Soviet cosmonaut mission pin" },
  14: {
    name: "Orthodox Icon",
    prompt: "small Orthodox icon pendant, holy protection",
  },
  15: { name: "Amber Collection", prompt: "Baltic amber jewelry collection" },

  // RARE (16-23)
  16: {
    name: "Hero of USSR",
    prompt: "Hero of the Soviet Union gold star medal",
  },
  17: {
    name: "Faberge Egg",
    prompt: "actual Faberge egg as accessory, imperial treasure",
  },
  18: {
    name: "Imperial Order",
    prompt: "Order of St. Andrew, highest imperial honor",
  },
  19: {
    name: "Oligarch Watch",
    prompt: "million-dollar luxury watch, obscene wealth display",
  },
  20: {
    name: "Nuclear Key",
    prompt: "nuclear launch key on chain, doomsday access",
  },
  21: {
    name: "Romanov Ring",
    prompt: "ring from Romanov dynasty, imperial bloodline",
  },
  22: {
    name: "Shaman Amulet",
    prompt: "Siberian shaman's protective amulet, spirit power",
  },
  23: {
    name: "Black Belt Badge",
    prompt: "Putin-style martial arts black belt, judo master",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Orlov Diamond",
    prompt: "legendary Orlov Diamond, imperial crown jewel",
  },
  25: {
    name: "Red Star Eternal",
    prompt: "floating eternal red star, Soviet divine symbol",
  },
  26: {
    name: "Double Eagle",
    prompt: "living double-headed eagle companion, imperial power",
  },
  27: {
    name: "Permafrost Heart",
    prompt: "frozen Siberian permafrost crystal, ancient ice power",
  },
  28: {
    name: "Nuclear Core",
    prompt: "controlled nuclear reaction as accessory, ultimate power",
  },
  29: {
    name: "Laika's Collar",
    prompt: "the original space dog Laika's collar, cosmic blessing",
  },
  30: {
    name: "Eternal Flame",
    prompt: "eternal flame from Unknown Soldier, undying memory",
  },
  31: {
    name: "Motherland's Tear",
    prompt: "tear from Mother Russia herself, nation's blessing",
  },
};

// =============================================================================
// TRAIT 5: EXPRESSION (32 Values)
// =============================================================================

export const RUSSIA_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: {
    name: "Neutral",
    prompt: "neutral expression, stoic Russian face, reveals nothing",
  },
  1: { name: "Slight Smirk", prompt: "slight knowing smirk, secret knowledge" },
  2: { name: "Cold Stare", prompt: "cold thousand-yard stare, seen things" },
  3: {
    name: "Patient",
    prompt: "patient expression, Russian long-game patience",
  },
  4: { name: "Alert", prompt: "alert and watchful, survival instinct" },
  5: {
    name: "Contemplative",
    prompt: "deep contemplation, chess-player thinking",
  },
  6: { name: "Resigned", prompt: "resigned acceptance, Russian fatalism" },
  7: {
    name: "Suspicious",
    prompt: "suspicious of everything, justified paranoia",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Calculating",
    prompt: "calculating expression, counting moves ahead",
  },
  9: { name: "Intimidating", prompt: "intimidating presence, silent threat" },
  10: {
    name: "KGB Stare",
    prompt: "KGB agent's penetrating stare, reading your soul",
  },
  11: { name: "Oligarch Contempt", prompt: "oligarch's contempt, money talks" },
  12: { name: "Warrior Focus", prompt: "spetsnaz battle focus, deadly calm" },
  13: {
    name: "Hidden Pain",
    prompt: "hidden pain behind stoic facade, Russian suffering",
  },
  14: {
    name: "Dark Humor",
    prompt: "dark Russian humor showing, ironic smile",
  },
  15: {
    name: "Vodka Warm",
    prompt: "vodka-warmed expression, temporary happiness",
  },

  // RARE (16-23)
  16: {
    name: "Commander's Gaze",
    prompt: "military commander's authoritative gaze, orders followed",
  },
  17: {
    name: "Tsar's Authority",
    prompt: "imperial Tsar's expression, divine right to rule",
  },
  18: {
    name: "Nuclear Certainty",
    prompt: "expression of nuclear certainty, MAD confidence",
  },
  19: {
    name: "Chess Master",
    prompt: "grandmaster's expression, 20 moves ahead",
  },
  20: {
    name: "Siberian Wisdom",
    prompt: "Siberian shaman's ancient wisdom, sees beyond",
  },
  21: {
    name: "Orthodox Piety",
    prompt: "Russian Orthodox spiritual expression, holy",
  },
  22: { name: "Survivor's Eyes", prompt: "gulag survivor's eyes, unbreakable" },
  23: {
    name: "Winter's Child",
    prompt: "expression of one born in Russian winter, cold inside",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Romanov Divine",
    prompt: "Romanov divine right expression, God's chosen",
  },
  25: {
    name: "Soviet Transcendence",
    prompt: "communist transcendence, beyond individual",
  },
  26: {
    name: "Motherland's Love",
    prompt: "expression of Mother Russia's love for her children",
  },
  27: {
    name: "Nuclear Dawn",
    prompt: "expression of witnessing nuclear dawn, terrible awe",
  },
  28: {
    name: "Eternal Winter",
    prompt: "eyes containing eternal Russian winter, undefeatable cold",
  },
  29: {
    name: "Dire Wolf Ancient",
    prompt: "primordial dire wolf expression, prehistoric power",
  },
  30: {
    name: "Cosmic Pioneer",
    prompt: "first human in space expression, cosmic wonder",
  },
  31: {
    name: "Russia Eternal",
    prompt: "expression of Russia herself, eternal, patient, waiting",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const RUSSIA_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Solid Red", prompt: "solid Soviet red background" },
  1: { name: "Solid Blue", prompt: "solid Russian blue background" },
  2: {
    name: "Simple Gradient",
    prompt: "simple red to blue gradient background, Russian colors",
  },
  3: {
    name: "Moscow Street",
    prompt: "typical Moscow street backdrop, Soviet architecture",
  },
  4: {
    name: "Rural Village",
    prompt: "Russian rural village backdrop, traditional wooden houses",
  },
  5: {
    name: "Birch Forest",
    prompt: "Russian birch forest backdrop, white trees",
  },
  6: {
    name: "Train Station",
    prompt: "Russian train station backdrop, journey beginning",
  },
  7: {
    name: "Communal Apartment",
    prompt: "Soviet kommunalka backdrop, shared living",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Red Square",
    prompt: "Red Square with Kremlin and St. Basil's Cathedral backdrop",
  },
  9: {
    name: "Winter Palace",
    prompt: "St. Petersburg Winter Palace backdrop, imperial grandeur",
  },
  10: {
    name: "Siberian Taiga",
    prompt: "vast Siberian taiga forest backdrop, endless wilderness",
  },
  11: {
    name: "Black Sea Coast",
    prompt: "Crimean Black Sea resort backdrop, vacation",
  },
  12: {
    name: "Military Base",
    prompt: "Russian military base backdrop, armed forces",
  },
  13: {
    name: "Moscow Metro",
    prompt: "ornate Moscow Metro station backdrop, underground palace",
  },
  14: {
    name: "Oil Fields",
    prompt: "Siberian oil fields backdrop, resource extraction",
  },
  15: {
    name: "Volga River",
    prompt: "Volga River sunset backdrop, Mother Volga",
  },

  // RARE (16-23)
  16: {
    name: "Kremlin Interior",
    prompt: "inside the Kremlin backdrop, center of power",
  },
  17: {
    name: "Hermitage Museum",
    prompt: "St. Petersburg Hermitage Museum backdrop, cultural treasure",
  },
  18: {
    name: "Nuclear Submarine",
    prompt: "nuclear submarine base backdrop, underwater power",
  },
  19: {
    name: "Baikonur Cosmodrome",
    prompt: "Baikonur space launch site backdrop, cosmic gateway",
  },
  20: {
    name: "Chernobyl Zone",
    prompt: "Chernobyl Exclusion Zone backdrop, eerie abandoned",
  },
  21: {
    name: "Gulag Ruins",
    prompt: "abandoned Siberian gulag backdrop, dark history",
  },
  22: {
    name: "Bolshoi Theatre",
    prompt: "Bolshoi Theatre interior backdrop, cultural prestige",
  },
  23: {
    name: "Arctic Ice Breaker",
    prompt: "nuclear icebreaker in Arctic backdrop, polar conquest",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Russian Flag Waving",
    prompt: "massive waving Russian tricolor flag backdrop, patriotic glory",
  },
  25: {
    name: "Nuclear Sunrise",
    prompt:
      "atomic sunrise over Siberia backdrop, nuclear dawn, power incarnate",
  },
  26: {
    name: "Space Station",
    prompt: "Russian space station orbiting Earth backdrop, cosmic frontier",
  },
  27: {
    name: "Romanov Throne Room",
    prompt: "imperial Romanov throne room backdrop, divine authority",
  },
  28: {
    name: "Motherland Calls",
    prompt:
      "giant Motherland Calls statue at Stalingrad backdrop, eternal victory",
  },
  29: {
    name: "Northern Lights",
    prompt: "aurora borealis over Russian Arctic backdrop, divine light show",
  },
  30: {
    name: "Eternal Winter",
    prompt: "mystical eternal Russian winter landscape, Napoleon's doom",
  },
  31: {
    name: "Divine Ascension",
    prompt:
      "heavenly clouds with Russian Orthodox golden light, transcendent divine backdrop",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const RUSSIA_EVOLUTION_STAGES: Record<
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
    size: "small Russian pup",
    demeanor: "fierce despite size, Siberian-born",
  },
  1: {
    stage: 1,
    name: "Cadet",
    size: "growing Russian hashbeast",
    demeanor: "learning to survive, hardening",
  },
  2: {
    stage: 2,
    name: "Soldier",
    size: "adult Russian operative",
    demeanor: "Siberian-hardened, proven survivor",
  },
  3: {
    stage: 3,
    name: "Veteran",
    size: "experienced Russian veteran",
    demeanor: "battle-scarred, commands respect",
  },
  4: {
    stage: 4,
    name: "Spetsnaz",
    size: "elite Russian special forces",
    demeanor: "apex predator, feared by all",
  },
  5: {
    stage: 5,
    name: "Commander",
    size: "Russian commander",
    demeanor: "regional authority, orders obeyed",
  },
  6: {
    stage: 6,
    name: "Hero",
    size: "legendary Russian hero",
    demeanor: "songs sung of deeds, living legend",
  },
  7: {
    stage: 7,
    name: "Dire Wolf",
    size: "ascended Russian wolf-god",
    demeanor: "dire wolf divine, Mother Russia incarnate",
  },
};

/**
 * Gets the story/lore for a Russia hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getRussiaStory(typeValue: number): string {
  const typeData = RUSSIA_TYPE_PROMPTS[typeValue];
  return typeData?.story || RUSSIA_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const RUSSIA_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const RUSSIA_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = RUSSIA_TYPE_PROMPTS[i];
  RUSSIA_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = RUSSIA_TYPE_PROMPTS[i];
  RUSSIA_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
