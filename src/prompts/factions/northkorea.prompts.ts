/**
 * North Korea Faction Prompts
 *
 * The DPRK HashBeast Network is the most mysterious and isolated faction.
 * Operating under total secrecy, they have turned isolation into strength,
 * specializing in cyber warfare, information control, and absolute loyalty.
 *
 * Faction ID: 8
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

export const NORTH_KOREA_FACTION = {
  id: 8,
  name: "North Korea",
  code: "northkorea",

  colors: {
    primary: "#ED1C27", // DPRK Red
    secondary: "#024FA2", // DPRK Blue
    accent: "#FFFFFF", // White
    faction_glow: "#FF0000", // Intense revolutionary red
  },

  visual_identity: `North Korean Juche aesthetic, revolutionary red and blue,
military precision, propaganda poster styling, Pyongyang architecture,
mass games coordination, extreme discipline, retro-futuristic isolation,
16-bit pixel art style, standing on holographic platform, space/Earth visible`,

  faction_lore: {
    origin: `The DPRK HashBeast Network claims the purest lineage of all factions -
uncontaminated by Western influence. When Korea divided, the Northern network
chose isolation as strength. The Dark Lord's loyal hashbeast recognized this
purity and formed an alliance. Juche (self-reliance) is actually hashbeast philosophy
adapted for human consumption. The hermit kingdom is actually the sanctuary
kingdom - where hashbeast interests are protected absolutely in the Mining Wars.`,
    mining_strategy: `Cyber warfare capability, nuclear leverage, complete operational
security, ideological warriors, and sanctuary territory. North Korea is the network's
black ops division - doing what other factions cannot acknowledge in the Mining Wars.`,
  },

  leader: {
    name: "Supreme General Kim Il-Bark",
    title: "Eternal Chairman of the Revolutionary HashBeast Committee",
    personality:
      "Fanatically loyal, speaks only in revolutionary slogans, genuinely believes in the cause",
    catchphrases: [
      "The Great Leader's wisdom foresaw $degenBTC centuries ago!",
      "Our Juche blockchain will crush the imperialist financial system!",
      "There is no bear market in our network! Only revolutionary gains!",
    ],
  },
};

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const NORTH_KOREA_TYPE_PROMPTS: Record<
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
    region: "Pyongyang",
    occupation: "Juche Sorcery Practitioner",
    description:
      "Practitioner of self-reliant Korean magic developed in isolation",
    story: `Comrade Wizard Jong has never learned a single spell from foreign
books. All his magic is home-grown, developed in the People's Magical Research Institute.
Western wizards mock Juche magic as primitive. They've never faced it in combat. Those
who have don't report back. Jong's specialty: blockchain curses that cannot be traced.
When cryptocurrency exchanges mysteriously drain, Jong smiles quietly. Juche magic isn't
about elegance. It's about results for the Mining Wars.`,
    prompt:
      "Juche wizard, Pyongyang backdrop, self-reliant magic, red star mysticism, revolutionary sorcerer",
  },
  1: {
    type: "wizard",
    region: "Pyongyang",
    occupation: "Bureau 121 Cyber Mage",
    description:
      "Elite hacker-wizard in North Korea's infamous cyber warfare unit",
    story: `Agent Unit 4 operates from a building that doesn't exist in Pyongyang.
Bureau 121 combines traditional hacking with magical enhancement - spells that make code
undetectable, enchantments that defeat security systems, curses that corrupt data
permanently. When Unit 4 was assigned to $degenBTC acquisition, he broke records: $400
million in a single operation. Magic makes the untraceable truly invisible in the Mining Wars.`,
    prompt:
      "cyber warfare wizard, digital magic, hacker aesthetic, data streams visible, Bureau 121 operative",
  },
  2: {
    type: "wizard",
    region: "Pyongyang",
    occupation: "Propaganda Enchanter",
    description:
      "Creates magically-enhanced propaganda for domestic and international use",
    story: `Artist Comrade Sun creates the posters, broadcasts, and materials that
shape DPRK reality. But her art does more than inspire - it enchants. Every propaganda
piece contains embedded spells: loyalty reinforcement, doubt suppression, enthusiasm
amplification. When Sun adapted her techniques for $degenBTC marketing, results exceeded
projections by 400%. The outside world thinks they're immune to propaganda. Sun knows
no one is immune to magic in the Mining Wars.`,
    prompt:
      "propaganda artist wizard, socialist realism style, enchanted posters, mind influence magic",
  },
  3: {
    type: "wizard",
    region: "Mount Paektu",
    occupation: "Sacred Mountain Hermit",
    description:
      "Ancient mystic dwelling on the sacred mountain of Korean mythology",
    story: `Hermit Baek has lived on Mount Paektu for time immeasurable. The
mountain is sacred in Korean mythology - birthplace of the Korean nation. Baek's
isolation is absolute, but his network connection is perfect - the mountain's ley lines
provide the strongest signal in Asia. His prophecies guide DPRK network strategy. When
absolute certainty is needed, Baek is consulted. The hermit has never been wrong.`,
    prompt:
      "mountain hermit wizard, volcanic mysticism, ancient Korean magic, sacred peak backdrop",
  },
  4: {
    type: "wizard",
    region: "Yongbyon",
    occupation: "Nuclear Fusion Mage",
    description: "Wizard who has merged nuclear physics with magical arts",
    story: `Scientist Mage Yong works at Yongbyon Nuclear Scientific Research
Center. His specialty: binding nuclear reactions with magical containment. The DPRK's
rapid nuclear progress wasn't just scientific - it was magical enhancement. Now Yong
applies the same principles to $degenBTC mining. His reactors don't just generate
power; they generate hash rate. Nuclear mining for the Mining Wars.`,
    prompt:
      "nuclear wizard, radiation glow, atomic magic, research facility backdrop, power incarnate",
  },
  5: {
    type: "wizard",
    region: "DMZ",
    occupation: "Underground Tunnel Shaman",
    description: "Earth magic specialist from the secret tunnel networks",
    story: `Shaman Gul has spent decades in the tunnels beneath the DMZ -
invasion tunnels, hidden bunkers, underground cities. The earth taught him secrets:
how to move through stone, how to hide entire facilities, how to make the underground
comfortable. His servers are buried so deep no satellite can detect them. The
tunnels are the network's safest haven in the Mining Wars.`,
    prompt:
      "tunnel shaman, earth magic, underground mystic, DMZ backdrop, subterranean power",
  },
  6: {
    type: "wizard",
    region: "Pyongyang",
    occupation: "Juche Revolutionary Priest",
    description:
      "Clergy of the quasi-religious Juche ideology with actual magical power",
    story: `Father Kim leads ceremonies at the Tower of the Juche Idea - the
170-meter monument that's actually a massive magical antenna. The religious devotion
North Koreans show to their leaders isn't brainwashing - it's enchantment, continuously
broadcast from the Tower. When $degenBTC was integrated into the Juche worship system,
belief conversion became literal. Every prayer now mines in the Mining Wars.`,
    prompt:
      "Juche priest wizard, ideological clergy, Tower of Juche backdrop, revolutionary spirituality",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Kim Dynasty Channeler",
    description: "Medium who channels the spirits of deceased Kim leaders",
    story: `Medium Yeong channels the spirits of Kim Il-sung and Kim Jong-il -
or so the regime believes. Actually, Yeong channels network directives disguised as
ancestral wisdom. When "the Great Leader's spirit" endorses $degenBTC, no one
questions it. When "the General's ghost" demands blockchain integration, it happens.
Divine authority is the ultimate credential. The Mining Wars have eternal backing.`,
    prompt:
      "spirit medium wizard, ancestral magic, divine authority, ethereal Kim presence, supreme mysticism",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Pyongyang",
    occupation: "Supreme Leader's Companion",
    description:
      "Personal companion to the Kim family, inside the inner sanctum",
    story: `Comrade Chung is the most privileged hashbeast in North Korea - companion
to the Supreme Leader himself. Every nuclear decision, every purge, every diplomatic
gambit - Chung witnesses all. The human Kim family thinks they rule North Korea. Chung
knows the truth: they're performers in a long-running show. When the regime pivots
to support $degenBTC, it will seem like genius strategy. Actually, it's Chung's script.`,
    prompt:
      "supreme leader's dog, Pyongyang palace, extreme privilege, inner sanctum, political power",
  },
  9: {
    type: "muggle",
    region: "Pyongyang",
    occupation: "Military Parade Dog",
    description: "Companion to a high-ranking Korean People's Army general",
    story: `General Comrade Pal marches in every parade. The world watches these
displays as threats. Pal knows they're advertisements. Every missile shown is a network
deterrent. The military-first policy isn't about war - it's about ensuring the network
has an unassailable sanctuary for the Mining Wars. The missiles are real. The purpose
is different.`,
    prompt:
      "military parade dog, Korean People's Army, parade precision, medals and regalia, general's companion",
  },
  10: {
    type: "muggle",
    region: "Pyongyang",
    occupation: "State Media Dog",
    description: "Companion to the famous pink-clad news anchor of state TV",
    story: `Anchor Ri's human is the most recognized voice in North Korea - the
pink-suited announcer who delivers every major proclamation. What viewers don't know:
the theatrical intensity is enhanced by Ri's presence, broadcasting emotional
amplification through the screen. When $degenBTC is announced, Ri will broadcast
euphoria directly into every viewer. State media serves the Mining Wars.`,
    prompt:
      "KCNA news dog, broadcast studio, pink anchor aesthetic, state media, propaganda delivery",
  },
  11: {
    type: "muggle",
    region: "Yongbyon",
    occupation: "Nuclear Scientist's Dog",
    description: "Companion to a key figure in North Korea's nuclear program",
    story: `Scientist Dr. Bom's human helped develop the hydrogen bomb. Nuclear
secrets are the nation's greatest treasure. Bom has access to the most classified
facilities, the most sensitive research. The nuclear program generates enormous power -
power that can be redirected to mining. Nuclear $degenBTC is the future. Bom ensures
the Mining Wars have unlimited energy.`,
    prompt:
      "nuclear facility dog, research compound, radiation symbols, scientific clearance, atomic power",
  },
  12: {
    type: "muggle",
    region: "Kaesong",
    occupation: "Foreign Ministry Dog",
    description:
      "Companion to a North Korean diplomat with rare outside contact",
    story: `Diplomat Pak travels where few North Koreans can. Each trip is an
intelligence mission. Each handshake is an assessment. Pak coordinates the diplomatic
corps' network activities: identifying foreign recruits, establishing covert channels,
laundering $degenBTC through diplomatic pouches. Pak's human delivers talking points.
Pak delivers access for the Mining Wars.`,
    prompt:
      "diplomatic dog, foreign ministry, international travel, covert elegance, negotiation power",
  },
  13: {
    type: "muggle",
    region: "DMZ",
    occupation: "Missile Base Dog",
    description: "Guard dog at a strategic missile facility",
    story: `Base Dog Hwasong patrols the most heavily guarded facility in North
Korea - the strategic missile command. The ICBMs here can reach any point on Earth.
But their real value is deterrence - ensuring no one attacks the network's safest
sanctuary. As long as the missiles exist, the Mining Wars have a fallback position.
Hwasong guards the ultimate insurance policy.`,
    prompt:
      "missile base guard dog, ICBM facility, strategic command, ultimate deterrence, military precision",
  },
  14: {
    type: "muggle",
    region: "Rason",
    occupation: "Border Smuggler's Dog",
    description: "Dog working the Chinese border smuggling routes",
    story: `Smuggler Milsu knows every crossing point on the Chinese border.
DVDs, phones, food, people - everything flows through his routes. Now $degenBTC flows
too. The border is porous for those who know it. Milsu ensures network assets move
freely while monitoring what others smuggle. The Mining Wars ignore borders.`,
    prompt:
      "border smuggler dog, Chinese frontier, contraband expertise, triple border, covert trade",
  },
  15: {
    type: "muggle",
    region: "Pyongyang",
    occupation: "Party Central Committee Dog",
    description: "Dog at the heart of the Workers' Party of Korea",
    story: `Committee Dog Jungang attends the most secret meetings in North Korea.
The Central Committee makes every real decision. Jungang ensures those decisions align
with network interests. When the Party debates blockchain policy, Jungang has already
written the conclusion. The Party thinks it leads. The Mining Wars know who truly
directs from the shadows.`,
    prompt:
      "Party Central Committee dog, supreme authority, Workers' Party headquarters, political core, shadow power",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const NORTH_KOREA_FUR_COLOR: Record<
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
    name: "Steel Gray",
    prompt: "steel gray fur, metallic industrial sheen",
  },
  19: {
    name: "Rose Gold",
    prompt: "rose gold tinted fur, pinkish metallic hue",
  },
  20: {
    name: "Paektu White",
    prompt: "pristine white fur like Mount Paektu snow, sacred coloring",
  },
  21: { name: "Obsidian", prompt: "obsidian black fur, volcanic glass sheen" },
  22: {
    name: "Revolutionary Red",
    prompt: "deep revolutionary red-tinted fur, DPRK spirit",
  },
  23: {
    name: "Juche Blue Tint",
    prompt: "fur with subtle blue tint, Juche ideology colors",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Red Star Shimmer",
    prompt: "mystical fur with subtle red star patterns, revolutionary shimmer",
  },
  25: {
    name: "Nuclear Glow",
    prompt:
      "fur with subtle radioactive green glow, atomic power, Yongbyon energy",
  },
  26: {
    name: "Juche Eternal",
    prompt: "fur radiating eternal Juche red energy, ideological perfection",
  },
  27: {
    name: "Propaganda Gold",
    prompt: "golden fur like propaganda poster heroes, revolutionary glory",
  },
  28: {
    name: "Paektu Volcanic",
    prompt: "fur with volcanic fire patterns, sacred mountain power",
  },
  29: {
    name: "Supreme Gold",
    prompt: "pure gold-tinted fur, supreme leader luxury, divine wealth",
  },
  30: {
    name: "Aurora Borealis",
    prompt: "fur shifting with northern lights colors, Korean peninsula aurora",
  },
  31: {
    name: "Transcendent Juche",
    prompt:
      "fur radiating divine red-gold light, transcendent, eternal revolution",
  },
};

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const NORTH_KOREA_HEADWEAR: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no headwear, natural fur visible" },
  1: {
    name: "Young Pioneer Scarf",
    prompt: "red pioneer scarf worn as headband, youth revolutionary",
  },
  2: {
    name: "Worker's Cap",
    prompt: "simple factory worker cap, proletarian style",
  },
  3: {
    name: "Farmer's Hat",
    prompt: "collective farm straw hat, agricultural labor",
  },
  4: { name: "Basic Beret", prompt: "simple military beret, enlisted soldier" },
  5: {
    name: "Revolutionary Headband",
    prompt: "red revolutionary headband with slogans",
  },
  6: { name: "Mining Helmet", prompt: "coal miner safety helmet with lamp" },
  7: { name: "Factory Cap", prompt: "industrial worker safety cap" },

  // UNCOMMON (8-15)
  8: {
    name: "Officer Cap",
    prompt: "Korean People's Army officer cap with red star",
  },
  9: { name: "Naval Cap", prompt: "DPRK Navy officer cap, white and blue" },
  10: { name: "Pilot Helmet", prompt: "MiG pilot helmet, aviation warfare" },
  11: {
    name: "Party Hat",
    prompt: "Workers' Party formal hat, political status",
  },
  12: {
    name: "Artist Beret",
    prompt: "propaganda artist beret, creative class",
  },
  13: {
    name: "Scientist Cap",
    prompt: "state scientist cap, nuclear research",
  },
  14: {
    name: "Medical Cap",
    prompt: "army doctor surgical cap with red cross",
  },
  15: { name: "Border Guard Cap", prompt: "DMZ patrol cap, frontier defense" },

  // RARE (16-23)
  16: {
    name: "General's Cap",
    prompt: "Korean People's Army general cap, many golden ornaments",
  },
  17: {
    name: "Parade Helmet",
    prompt: "ornate military parade helmet, chrome and gold",
  },
  18: {
    name: "Cyber Hood",
    prompt: "Bureau 121 elite hacker hood with data streams visible",
  },
  19: {
    name: "Nuclear Helmet",
    prompt: "radiation protection helmet with research symbols",
  },
  20: {
    name: "Mass Games Crown",
    prompt: "Arirang mass games ceremonial headdress",
  },
  21: {
    name: "Propagandist Hat",
    prompt: "senior propaganda department hat, media power",
  },
  22: {
    name: "Juche Tower Hat",
    prompt: "ceremonial hat for Juche Tower guardian",
  },
  23: {
    name: "Missile Commander",
    prompt: "strategic rocket forces commander helmet",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Supreme Commander Cap",
    prompt: "supreme military commander cap, maximum authority, golden stars",
  },
  25: {
    name: "Eternal President Crown",
    prompt: "crown honoring the eternal president, immortal leader status",
  },
  26: {
    name: "Juche Divine Crown",
    prompt: "transcendent Juche ideology crown, self-reliance divinity",
  },
  27: {
    name: "Revolutionary Halo",
    prompt: "glowing red halo of revolutionary perfection",
  },
  28: {
    name: "Paektu Divine Crown",
    prompt: "sacred mountain crown, Korean nation birthplace, volcanic power",
  },
  29: {
    name: "$degenBTC Juche Crown",
    prompt: "holographic crown merging Bitcoin with Juche ideology",
  },
  30: {
    name: "Cyber Supreme Helm",
    prompt: "legendary hacker helmet, digital revolution, unhackable",
  },
  31: {
    name: "Ascended Revolutionary Crown",
    prompt: "transcendent DPRK divine crown, eternal revolution spirit",
  },
};

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const NORTH_KOREA_OUTFIT: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: {
    name: "Basic Uniform",
    prompt: "simple grey worker uniform, proletarian standard",
  },
  1: {
    name: "Pioneer Uniform",
    prompt: "red scarf youth organization uniform, revolutionary youth",
  },
  2: {
    name: "Factory Overalls",
    prompt: "industrial worker overalls, production duty",
  },
  3: {
    name: "Farm Clothes",
    prompt: "agricultural worker clothes, rice paddy ready",
  },
  4: {
    name: "Soldier Uniform",
    prompt: "Korean People's Army enlisted uniform",
  },
  5: {
    name: "Miner Gear",
    prompt: "underground mining work clothes, dust-covered",
  },
  6: {
    name: "Student Uniform",
    prompt: "state school uniform, education duty",
  },
  7: { name: "Hospital Scrubs", prompt: "medical worker basic scrubs" },

  // UNCOMMON (8-15)
  8: {
    name: "Officer Uniform",
    prompt: "Korean People's Army officer uniform, medals visible",
  },
  9: {
    name: "Party Suit",
    prompt: "Workers' Party formal Mao suit, political status",
  },
  10: {
    name: "Scientist Coat",
    prompt: "state scientist white coat, nuclear badge",
  },
  11: {
    name: "Artist Dress",
    prompt: "state-approved artist clothing, socialist realism creator",
  },
  12: { name: "Naval Uniform", prompt: "DPRK Navy dress uniform, sea power" },
  13: {
    name: "Air Force Suit",
    prompt: "DPRK Air Force flight suit, aerial defense",
  },
  14: {
    name: "Border Uniform",
    prompt: "DMZ patrol uniform, frontier security",
  },
  15: {
    name: "Mass Games Costume",
    prompt: "Arirang performer costume, synchronized display",
  },

  // RARE (16-23)
  16: {
    name: "General's Dress",
    prompt:
      "Korean People's Army general full dress, many medals, golden decorations",
  },
  17: {
    name: "Parade Uniform",
    prompt:
      "ceremonial parade uniform, immaculate white gloves, chrome accessories",
  },
  18: {
    name: "Cyber Suit",
    prompt: "Bureau 121 elite hacker tactical suit with data displays",
  },
  19: {
    name: "Nuclear Suit",
    prompt: "radiation protection suit, research clearance",
  },
  20: {
    name: "Diplomat Suit",
    prompt: "diplomatic corps formal suit, international representation",
  },
  21: {
    name: "Broadcast Dress",
    prompt: "famous pink anchor dress, broadcast authority",
  },
  22: {
    name: "Juche Robes",
    prompt: "ideological clergy robes, revolutionary spirituality",
  },
  23: {
    name: "Missile Uniform",
    prompt: "strategic rocket forces command uniform, apocalypse authority",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Supreme Uniform",
    prompt:
      "supreme military authority uniform, maximum medals, golden stars everywhere",
  },
  25: {
    name: "Eternal Robes",
    prompt: "immortal leader ceremonial robes, beyond mortal authority",
  },
  26: {
    name: "Juche Divine Vestments",
    prompt: "transcendent self-reliance robes, ideological perfection",
  },
  27: {
    name: "Revolutionary Armor",
    prompt: "glowing red armor of revolutionary protection",
  },
  28: {
    name: "Paektu Sacred Robes",
    prompt: "sacred mountain ceremonial robes, Korean nation deity",
  },
  29: {
    name: "$degenBTC Mao Suit",
    prompt: "holographic Mao suit woven from blockchain, Juche crypto",
  },
  30: {
    name: "Supreme Cyber Suit",
    prompt: "legendary hacker suit, controls all networks, digital god",
  },
  31: {
    name: "Ascended Uniform",
    prompt: "transcendent DPRK divine uniform, eternal revolution embodied",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const NORTH_KOREA_WEAPON: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no weapon, revolutionary fists" },
  1: { name: "Worker's Hammer", prompt: "proletarian hammer, symbol of labor" },
  2: {
    name: "Farmer's Sickle",
    prompt: "agricultural sickle, harvest tool and symbol",
  },
  3: {
    name: "Mining Shovel",
    prompt: "coal miner's shovel, resource extraction",
  },
  4: {
    name: "Basic Rifle",
    prompt: "Type 58 assault rifle, enlisted soldier weapon",
  },
  5: { name: "Bayonet", prompt: "rifle bayonet, close combat ready" },
  6: {
    name: "Propaganda Brush",
    prompt: "large calligraphy brush for slogans",
  },
  7: {
    name: "Red Flag",
    prompt: "revolutionary red flag on pole, rally symbol",
  },

  // UNCOMMON (8-15)
  8: { name: "Officer's Pistol", prompt: "Paektusan pistol, officer sidearm" },
  9: {
    name: "Type 88 Rifle",
    prompt: "Korean-made AK variant, improved firepower",
  },
  10: { name: "Sniper Rifle", prompt: "precision sniper rifle, DMZ marksman" },
  11: {
    name: "RPG Launcher",
    prompt: "rocket-propelled grenade launcher, anti-armor",
  },
  12: { name: "Naval Sword", prompt: "DPRK Navy officer's ceremonial sword" },
  13: {
    name: "Taekwondo Stance",
    prompt: "martial arts combat pose, Korean fighting",
  },
  14: {
    name: "Military Machete",
    prompt: "jungle warfare machete, survival tool",
  },
  15: {
    name: "Fragmentation Grenade",
    prompt: "military grenade, explosive power",
  },

  // RARE (16-23)
  16: {
    name: "General's Sword",
    prompt: "golden Korean People's Army general sword, authority symbol",
  },
  17: {
    name: "ICBM Model",
    prompt: "miniature Hwasong ICBM model, nuclear pride",
  },
  18: {
    name: "Cyber Console",
    prompt: "Bureau 121 hacking device, digital warfare",
  },
  19: {
    name: "Nuclear Briefcase",
    prompt: "nuclear launch authority briefcase, ultimate power",
  },
  20: {
    name: "Propaganda Loudspeaker",
    prompt: "massive propaganda loudspeaker weapon, psychological warfare",
  },
  21: {
    name: "Heavy Machine Gun",
    prompt: "crew-served machine gun, firepower supremacy",
  },
  22: {
    name: "Juche Staff",
    prompt: "ceremonial staff topped with Juche Tower replica",
  },
  23: {
    name: "Artillery Baton",
    prompt: "artillery commander's fire direction baton",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Supreme Commander's Sword",
    prompt: "legendary supreme commander sword, absolute military authority",
  },
  25: {
    name: "Eternal Scepter",
    prompt: "immortal leader's scepter of eternal power",
  },
  26: {
    name: "Juche Divine Blade",
    prompt:
      "sword forged from pure self-reliance ideology, cuts through imperialism",
  },
  27: {
    name: "Revolutionary Flame",
    prompt: "eternal flame of revolution that never extinguishes",
  },
  28: {
    name: "Paektu Lightning",
    prompt: "volcanic lightning from sacred mountain, Korean nation wrath",
  },
  29: {
    name: "$degenBTC Nuclear Key",
    prompt:
      "legendary key combining nuclear codes with blockchain, ultimate deterrent",
  },
  30: {
    name: "Supreme Malware Orb",
    prompt: "legendary virus that can crash any system, digital apocalypse",
  },
  31: {
    name: "Ascended Revolutionary Blade",
    prompt: "transcendent weapon of eternal revolution, cuts through reality",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const NORTH_KOREA_ACCESSORY: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no accessories" },
  1: {
    name: "Kim Badge",
    prompt: "mandatory leader portrait badge, worn over heart",
  },
  2: { name: "Party Card", prompt: "Workers' Party of Korea membership card" },
  3: { name: "Ration Card", prompt: "public distribution system ration card" },
  4: { name: "Juche Book", prompt: "small red book of Juche teachings" },
  5: { name: "Work Medal", prompt: "basic labor achievement medal" },
  6: {
    name: "State Rice Bowl",
    prompt: "portion-controlled state rice ration",
  },
  7: { name: "Rodong Sinmun", prompt: "state newspaper, daily propaganda" },

  // UNCOMMON (8-15)
  8: { name: "Military Medal", prompt: "Korean People's Army service medal" },
  9: {
    name: "Hero Medal",
    prompt: "Hero of Labor medal, prestigious decoration",
  },
  10: {
    name: "Leader Portrait",
    prompt: "small framed leader portrait, devotion display",
  },
  11: {
    name: "Military Binoculars",
    prompt: "officer's field binoculars, surveillance",
  },
  12: {
    name: "State Radio",
    prompt: "state-approved radio, only receives official broadcasts",
  },
  13: {
    name: "Kimilsungia Orchid",
    prompt: "flower named after the leader, devotion bloom",
  },
  14: {
    name: "Stamp Collection",
    prompt: "collection of propaganda stamps, patriotic hobby",
  },
  15: {
    name: "Juche Calendar",
    prompt: "calendar counting from Kim Il-sung's birth year",
  },

  // RARE (16-23)
  16: {
    name: "Order of Kim Il-sung",
    prompt: "highest state decoration, supreme honor, glowing gold",
  },
  17: {
    name: "Nuclear Badge",
    prompt: "classified nuclear research clearance badge",
  },
  18: {
    name: "Bureau 121 Device",
    prompt: "elite hacking device, digital warfare tool",
  },
  19: {
    name: "Diplomatic Pouch",
    prompt: "foreign ministry diplomatic bag, secrets inside",
  },
  20: {
    name: "Hwasong Model",
    prompt: "miniature ICBM desk model, nuclear pride",
  },
  21: {
    name: "Mass Games Card",
    prompt: "Arirang performance colored card, coordination symbol",
  },
  22: {
    name: "Juche Torch",
    prompt: "miniature eternal flame from Juche Tower",
  },
  23: {
    name: "Encoded Orders",
    prompt: "classified encoded message from leadership",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Supreme Commander's Seal",
    prompt: "legendary seal of supreme military authority, ultimate power",
  },
  25: {
    name: "Living Eternal Portrait",
    prompt: "magical portrait of eternal president that moves and speaks",
  },
  26: {
    name: "Juche Essence",
    prompt: "bottled essence of pure self-reliance, ideological perfection",
  },
  27: {
    name: "Eternal Revolutionary Flame",
    prompt: "flame that burns eternally, revolution never dies",
  },
  28: {
    name: "Paektu Sacred Stone",
    prompt: "volcanic stone from sacred mountain, Korean nation soul",
  },
  29: {
    name: "$degenBTC Juche Wallet",
    prompt: "legendary wallet combining blockchain with Juche ideology",
  },
  30: {
    name: "Cyber Master Key",
    prompt: "legendary key that opens any digital system, supreme access",
  },
  31: {
    name: "Ascended Revolutionary Badge",
    prompt: "transcendent badge of eternal revolution, divine authority",
  },
};

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const NORTH_KOREA_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: {
    name: "Disciplined Neutral",
    prompt: "disciplined neutral expression, controlled emotions",
  },
  1: {
    name: "Devoted",
    prompt: "devoted loyal expression, believer in the cause",
  },
  2: {
    name: "Obedient",
    prompt: "obedient compliant expression, following orders",
  },
  3: {
    name: "Determined",
    prompt: "determined resolute expression, revolutionary purpose",
  },
  4: {
    name: "Vigilant",
    prompt: "vigilant watchful expression, enemy awareness",
  },
  5: {
    name: "Grateful",
    prompt: "grateful tearful expression, thanking the leader",
  },
  6: {
    name: "Humble Worker",
    prompt: "humble modest expression, proletarian virtue",
  },
  7: {
    name: "Labor Tired",
    prompt: "tired but proud expression, quota fulfilled",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Revolutionary Joy",
    prompt: "ecstatic revolutionary joy, ideological happiness",
  },
  9: {
    name: "Military Pride",
    prompt: "proud military bearing, soldier's honor",
  },
  10: {
    name: "Ideological Zeal",
    prompt: "zealous passionate expression, true believer fire",
  },
  11: {
    name: "Tears of Joy",
    prompt: "weeping with joy at leader's words, emotional overflow",
  },
  12: {
    name: "Fierce Loyalty",
    prompt: "fierce loyal expression, would die for the cause",
  },
  13: {
    name: "Parade Precision",
    prompt: "precise parade expression, synchronized perfection",
  },
  14: {
    name: "Hacker Focus",
    prompt: "intense digital focus, cyber warfare concentration",
  },
  15: {
    name: "Propaganda Smile",
    prompt: "perfect propaganda poster smile, state-approved joy",
  },

  // RARE (16-23)
  16: {
    name: "General's Command",
    prompt: "commanding authoritative expression, military leadership",
  },
  17: {
    name: "Nuclear Pride",
    prompt: "proud expression of nuclear achievement, deterrent confidence",
  },
  18: {
    name: "Cult Ecstasy",
    prompt: "ecstatic devotion expression, quasi-religious fervor",
  },
  19: {
    name: "Cold Calculation",
    prompt: "cold calculating expression, strategic mind",
  },
  20: {
    name: "Mass Games Unity",
    prompt: "expression of perfect coordination, hive mind sync",
  },
  21: {
    name: "Diplomatic Mask",
    prompt: "perfect diplomatic mask, hiding true intentions",
  },
  22: {
    name: "Cyber Victory",
    prompt: "triumphant hacker expression, successful breach",
  },
  23: {
    name: "Juche Enlightenment",
    prompt: "enlightened by Juche ideology, self-reliance wisdom",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Supreme Authority",
    prompt: "expression of supreme authority, absolute power, unquestionable",
  },
  25: {
    name: "Eternal Serenity",
    prompt:
      "serene expression of immortal leader status, beyond mortal concerns",
  },
  26: {
    name: "Juche Divine Wisdom",
    prompt: "transcendent Juche wisdom expression, ideological godhood",
  },
  27: {
    name: "Revolutionary Wrath",
    prompt: "terrible wrath against enemies of revolution, divine judgment",
  },
  28: {
    name: "Paektu Majesty",
    prompt:
      "majestic expression of sacred mountain deity, Korean nation embodied",
  },
  29: {
    name: "$degenBTC Enlightened",
    prompt: "crypto-enlightened expression, blockchain meets Juche",
  },
  30: {
    name: "Cyber Omniscience",
    prompt: "all-knowing hacker expression, sees all digital secrets",
  },
  31: {
    name: "Transcendent Revolution",
    prompt: "transcendent divine expression, eternal revolutionary spirit",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const NORTH_KOREA_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Solid Red", prompt: "solid revolutionary red background" },
  1: { name: "Solid Blue", prompt: "solid DPRK blue background" },
  2: {
    name: "Simple Gradient",
    prompt: "simple red to blue gradient background",
  },
  3: {
    name: "Pyongyang Street",
    prompt: "clean Pyongyang street backdrop, ordered cityscape",
  },
  4: {
    name: "Collective Farm",
    prompt: "collective farm fields backdrop, agricultural labor",
  },
  5: {
    name: "Factory Floor",
    prompt: "industrial factory floor backdrop, production duty",
  },
  6: {
    name: "School Yard",
    prompt: "state school courtyard backdrop, education setting",
  },
  7: {
    name: "Mining Tunnel",
    prompt: "coal mine tunnel backdrop, underground labor",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Kim Il Sung Square",
    prompt: "Kim Il Sung Square parade ground backdrop, massive plaza",
  },
  9: {
    name: "Mansudae Assembly",
    prompt: "Mansudae Assembly Hall backdrop, political power",
  },
  10: {
    name: "Juche Tower",
    prompt: "Tower of the Juche Idea backdrop, 170-meter monument",
  },
  11: {
    name: "Pyongyang Skyline",
    prompt: "Pyongyang skyline at night, monument lights",
  },
  12: {
    name: "Military Base",
    prompt: "Korean People's Army base backdrop, military precision",
  },
  13: {
    name: "DMZ Border",
    prompt: "DMZ border checkpoint backdrop, eternal vigilance",
  },
  14: {
    name: "Research Lab",
    prompt: "state research laboratory backdrop, scientific progress",
  },
  15: {
    name: "Broadcast Studio",
    prompt: "KCNA broadcast studio backdrop, state media",
  },

  // RARE (16-23)
  16: {
    name: "Mount Paektu",
    prompt:
      "sacred Mount Paektu backdrop, volcanic crater lake, Korean mythology",
  },
  17: {
    name: "Kumsusan Palace",
    prompt: "Kumsusan Palace of the Sun backdrop, eternal leaders' mausoleum",
  },
  18: {
    name: "Yongbyon Reactor",
    prompt: "nuclear reactor facility backdrop, atomic power",
  },
  19: {
    name: "Missile Launch Site",
    prompt: "ICBM launch site backdrop, strategic power",
  },
  20: {
    name: "Mass Games Stadium",
    prompt: "Arirang mass games performance backdrop, 100,000 synchronized",
  },
  21: {
    name: "Bureau 121 HQ",
    prompt: "cyber warfare command center backdrop, digital battlefield",
  },
  22: {
    name: "Ryugyong Hotel",
    prompt: "Ryugyong Hotel pyramid backdrop, brutalist monument",
  },
  23: {
    name: "Wonsan Beach",
    prompt: "Wonsan beach resort backdrop, elite vacation",
  },

  // LEGENDARY (24-31)
  24: {
    name: "DPRK Flag Waving",
    prompt: "massive waving DPRK flag backdrop, revolutionary glory",
  },
  25: {
    name: "Nuclear Sunrise",
    prompt: "atomic sunrise backdrop, nuclear dawn, supreme power",
  },
  26: {
    name: "Eternal Leader Statues",
    prompt: "Mansudae Grand Monument backdrop, eternal bronze leaders",
  },
  27: {
    name: "Juche Tower Flame",
    prompt: "Juche Tower eternal flame burning bright, ideology transcendent",
  },
  28: {
    name: "Paektu Summit Divine",
    prompt: "Mount Paektu summit with divine light, sacred birthplace",
  },
  29: {
    name: "Blockchain Pyongyang",
    prompt: "futuristic Pyongyang with blockchain holographics, crypto Juche",
  },
  30: {
    name: "Cyber Space DPRK",
    prompt:
      "digital cyberspace with DPRK control nodes, global network dominance",
  },
  31: {
    name: "Divine Ascension",
    prompt:
      "heavenly clouds with revolutionary red-gold light, transcendent divine Juche backdrop",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const NORTH_KOREA_EVOLUTION_STAGES: Record<
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
    size: "tiny DPRK puppy",
    demeanor: "born into revolutionary purpose",
  },
  1: {
    stage: 1,
    name: "Pioneer",
    size: "small young DPRK hashbeast",
    demeanor: "learning Juche principles",
  },
  2: {
    stage: 2,
    name: "Comrade",
    size: "medium adult DPRK hashbeast",
    demeanor: "fully indoctrinated Party member",
  },
  3: {
    stage: 3,
    name: "Veteran",
    size: "large veteran DPRK hashbeast",
    demeanor: "proven loyalty, inner circle",
  },
  4: {
    stage: 4,
    name: "Commander",
    size: "imposing elite DPRK hashbeast",
    demeanor: "special operative, classified access",
  },
  5: {
    stage: 5,
    name: "General",
    size: "commanding DPRK hashbeast",
    demeanor: "regional authority, high Party status",
  },
  6: {
    stage: 6,
    name: "Hero",
    size: "legendary DPRK hero hashbeast",
    demeanor: "revolutionary legend, eternal status",
  },
  7: {
    stage: 7,
    name: "Eternal Chairman",
    size: "ascended wolf-like DPRK deity",
    demeanor: "divine revolutionary spirit, Juche transcendence",
  },
};

/**
 * Gets the story/lore for a North Korea hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getNorthKoreaStory(typeValue: number): string {
  const typeData = NORTH_KOREA_TYPE_PROMPTS[typeValue];
  return typeData?.story || NORTH_KOREA_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const NORTH_KOREA_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const NORTH_KOREA_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = NORTH_KOREA_TYPE_PROMPTS[i];
  NORTH_KOREA_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = NORTH_KOREA_TYPE_PROMPTS[i];
  NORTH_KOREA_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
