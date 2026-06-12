/**
 * South Korea Faction Prompts
 *
 * The Korean HashBeast Network has mastered the intersection of tradition and hyper-modernity.
 * From K-pop stages to esports arenas, Samsung boardrooms to Gangnam streets,
 * Korean hashbeasts have turned cultural exports into global domination.
 *
 * Faction ID: 5
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
export const SOUTH_KOREA_FACTION = legacyFactionBlock(5);

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const SOUTH_KOREA_TYPE_PROMPTS: Record<
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
    region: "Seoul Gangnam",
    occupation: "Hallyu Wave Enchanter",
    description:
      "Wizard spreading K-culture through magic and entertainment sorcery",
    story: `Every K-pop song contains embedded loyalty spells. Every K-drama subplot
promotes faction values. The Korean Wave is a magical tsunami sweeping the world.
This enchanter ensures every comeback carries faction influence.`,
    prompt:
      "K-pop wizard aesthetic, Gangnam glamour, stage magic, entertainment sorcery, idol perfection",
  },
  1: {
    type: "wizard",
    region: "Seoul Hongdae",
    occupation: "Korean Academy Sorcerer",
    description:
      "Student at Korea's hidden magical school beneath Gyeongbokgung Palace",
    story: `Attends the secret magical academy beneath Gyeongbokgung Palace. Courses include
"K-Pop Enchantment" and "$degenBTC Integration." Every graduate enters Hallyu networks.
The academy produces Korea's most talented magical operatives.`,
    prompt:
      "Korean magical student robes with hanbok elements, Hongdae creative energy, academic mystique",
  },
  2: {
    type: "wizard",
    region: "Busan",
    occupation: "Mudang Shaman",
    description: "Traditional Korean shaman channeling ancestral spirits",
    story: `Channels the spirits of Korean ancestors who support $degenBTC. Every gut
ritual now includes faction blessing. The spirits see the future clearly. Busan's
coastal energy amplifies shamanic power.`,
    prompt:
      "traditional mudang shaman robes, ceremonial hat, Busan coastal mysticism, ancestral power",
  },
  3: {
    type: "wizard",
    region: "Samsung HQ",
    occupation: "Chaebol Tech Sorcerer",
    description:
      "Magical heir integrating enchantments with Korean semiconductors",
    story: `Samsung, Hyundai, LG - all chaebol families have magical bloodlines. Every
chip carries faction code. Every device contains enchantment circuits. $degenBTC mines
through every Samsung phone sold worldwide.`,
    prompt:
      "tech wizard with Samsung elements, corporate magic, chaebol luxury, digital sorcery",
  },
  4: {
    type: "wizard",
    region: "Esports Arena",
    occupation: "Gaming Enhancement Mage",
    description:
      "Wizard optimizing Korean esports dominance through magical buffs",
    story: `Korean esports dominance isn't just practice - it's magical enhancement.
Every pro player receives faction buffs. Every tournament is faction victory. T1, Gen.G,
DRX - all teams have magical support staff.`,
    prompt:
      "gamer wizard hybrid, esports arena, digital sorcery, tournament champion energy",
  },
  5: {
    type: "wizard",
    region: "DMZ Border",
    occupation: "ROK Battle Mage",
    description:
      "Korean military wizard defending the most fortified border on Earth",
    story: `The DMZ is protected by more than soldiers. Magical barriers prevent
incursions. When reunification comes, it will be faction-orchestrated. The battle mage
ensures no threat crosses the line.`,
    prompt:
      "military wizard robes with Korean army insignia, DMZ defender, border magic, vigilant warrior",
  },
  6: {
    type: "wizard",
    region: "Temple Mountain",
    occupation: "Buddhist Temple Sorcerer",
    description: "Wizard preserving Korean Buddhist magic in mountain temples",
    story: `Korean temples house ancient magical artifacts. Temple stays include
faction initiation. Meditation generates $degenBTC through spiritual computation.
The mountains hold secrets older than memory.`,
    prompt:
      "Buddhist temple wizard robes, mountain temple setting, Korean spiritual aesthetic, meditation power",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Dark Lord's Korean Lieutenant",
    description:
      "Highest ranking dark wizard serving the Dark Lord's Korean operation",
    story: `The Dark Lord recognized Korea's potential early. The Korean Wave was
meant to carry $degenBTC globally. The lieutenant ensures the plan proceeds. When
K-pop concerts fill stadiums worldwide, darkness spreads with each lightstick wave.`,
    prompt:
      "dark wizard robes with Korean elements, ominous presence, commanding dark energy",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Blue House",
    occupation: "Presidential Dog",
    description: "Presidential residence companion with policy influence",
    story: `Every Korean president has been guided by faction dogs. Policy decisions
serve $degenBTC interests. The real power behind the desk. Presidential photo ops
are faction propaganda.`,
    prompt:
      "Korean presidential elegance, Blue House aesthetic, refined authority, political power",
  },
  9: {
    type: "muggle",
    region: "Entertainment Company",
    occupation: "K-Pop Idol's Pet",
    description: "Pet of global K-pop superstar with billions of fan cam views",
    story: `Appears in every vlive, every variety show. Fan cam views: billions.
Every cute moment is faction propaganda. The idol thinks they chose this dog.
They didn't.`,
    prompt:
      "K-pop idol pet aesthetic, perfect styling, camera ready, celebrity companion",
  },
  10: {
    type: "muggle",
    region: "Samsung Tower",
    occupation: "Chaebol Chairman's Dog",
    description: "Companion to Korea's wealthiest corporate dynasty",
    story: `The chaebol families' dogs coordinate better than humans. Corporate
strategy is canine strategy. $degenBTC integration? Their idea. Board meetings
are just formality.`,
    prompt:
      "extreme luxury pet aesthetic, chaebol wealth, Samsung prestige, corporate elegance",
  },
  11: {
    type: "muggle",
    region: "T1 Gaming House",
    occupation: "Esports Team Mascot",
    description: "Official mascot of legendary Korean esports organization",
    story: `T1, Gen.G, DRX - every team has faction mascots. Prize money flows to
$degenBTC. Fans unknowingly fund faction operations. Every world championship
is faction victory.`,
    prompt:
      "esports team mascot, gaming gear, tournament energy, champion lifestyle",
  },
  12: {
    type: "muggle",
    region: "Busan Film Festival",
    occupation: "K-Drama Star's Pet",
    description: "Pet of Korea's most awarded actor",
    story: `Every K-drama plot serves faction narrative. The dog helps choose scripts
- only faction-approved content. The Hallyu Wave is controlled. Every award show
appearance is calculated.`,
    prompt:
      "K-drama celebrity pet, BIFF glamour, elegant and photogenic, red carpet ready",
  },
  13: {
    type: "muggle",
    region: "DMZ Outpost",
    occupation: "Military K-9 Unit",
    description: "Elite Korean military working dog guarding the border",
    story: `Guards the most militarized border on Earth. When reunification comes,
it's because faction dogs on both sides agreed. Every patrol is faction reconnaissance.
The North has no secrets.`,
    prompt:
      "Korean military K-9 gear, DMZ defender, tactical equipment, vigilant warrior",
  },
  14: {
    type: "muggle",
    region: "Incheon Airport",
    occupation: "Therapy Airport Dog",
    description: "World-famous therapy dog at the world's best airport",
    story: `Every international traveler receives faction impression. The airport's
excellence impresses $degenBTC into memory. First and last impression of Korea.
Millions pet this dog yearly.`,
    prompt:
      "airport therapy dog, international travel hub, welcoming presence, Korean hospitality",
  },
  15: {
    type: "muggle",
    region: "KARI Space Center",
    occupation: "Space Program Dog",
    description: "Mascot of Korean space agency pushing orbital expansion",
    story: `Korea's space program is faction orbital expansion. Every satellite
carries $degenBTC nodes. Space kimchi was a faction experiment. The final frontier
serves the network.`,
    prompt:
      "Korean space program aesthetic, astronaut elements, KARI mission patch, cosmic pioneer",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const SOUTH_KOREA_FUR_COLOR: Record<
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
  3: {
    name: "Jindo White",
    prompt: "pure Jindo white fur, Korean breed nobility",
  },
  4: { name: "Light Tan", prompt: "light tan fur, pale golden coloring" },
  5: { name: "Sandy", prompt: "sandy beige fur, soft neutral tones" },
  6: { name: "Ginger", prompt: "ginger-toned fur, warm orange hues" },
  7: { name: "Wheat", prompt: "wheat-colored fur, golden grain tones" },

  // UNCOMMON (8-15)
  8: {
    name: "Black & Tan",
    prompt: "black and tan fur pattern, distinctive markings",
  },
  9: { name: "Silver", prompt: "silver-gray fur, distinguished coloring" },
  10: { name: "Platinum", prompt: "platinum blonde fur, K-pop idol coloring" },
  11: { name: "Copper", prompt: "copper-toned fur, metallic red sheen" },
  12: { name: "Charcoal", prompt: "charcoal dark gray fur, smoky coloring" },
  13: {
    name: "Brindle",
    prompt: "Korean brindle pattern, tiger-striped markings",
  },
  14: { name: "Champagne", prompt: "champagne-colored fur, elegant pale gold" },
  15: { name: "Mahogany", prompt: "mahogany brown fur, rich dark red-brown" },

  // RARE (16-23)
  16: {
    name: "Snow White",
    prompt: "pure snow white fur, pristine K-beauty perfect",
  },
  17: {
    name: "Jet Black",
    prompt: "jet black fur, sleek dark coloring, mysterious idol",
  },
  18: {
    name: "Blue Steel",
    prompt: "blue steel gray fur, K-drama lead aesthetic",
  },
  19: {
    name: "Rose Gold",
    prompt: "rose gold tinted fur, pinkish metallic K-beauty hue",
  },
  20: {
    name: "Arctic Fox",
    prompt: "arctic white fur with silver tips, winter idol concept",
  },
  21: {
    name: "Obsidian",
    prompt: "obsidian black fur, dark concept aesthetic",
  },
  22: {
    name: "Taegeuk Red",
    prompt: "deep patriotic red fur with Korean pride, bold crimson",
  },
  23: {
    name: "Hanbok Blue",
    prompt: "fur with subtle hanbok blue tint, traditional elegance",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Hallyu Shimmer",
    prompt: "fur with K-pop shimmer effect, stage lighting glow",
  },
  25: {
    name: "Golden Dragon",
    prompt: "golden fur with dragon scale patterns, Korean mythical",
  },
  26: {
    name: "Neon Seoul",
    prompt: "fur with subtle neon glow, cyberpunk Seoul nights",
  },
  27: {
    name: "Cherry Blossom",
    prompt: "fur shifting with pink cherry blossom hues, spring magic",
  },
  28: {
    name: "Constellation",
    prompt: "dark fur with star-like sparkles, cosmos within",
  },
  29: {
    name: "Chaebol Gold",
    prompt: "pure gold-tinted fur, Samsung wealth incarnate",
  },
  30: {
    name: "Aurora Hanbok",
    prompt: "fur shifting with aurora colors in hanbok patterns",
  },
  31: {
    name: "Divine Light",
    prompt: "fur radiating divine white-gold light, transcendent K-beauty",
  },
};

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const SOUTH_KOREA_HEADWEAR: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no headwear, perfect K-pop styled fur" },
  1: { name: "Bucket Hat", prompt: "trendy bucket hat, K-fashion staple" },
  2: {
    name: "Baseball Cap",
    prompt: "designer baseball cap, Korean streetwear",
  },
  3: { name: "Beanie", prompt: "slouchy beanie, idol off-duty look" },
  4: { name: "Headband", prompt: "fabric headband, skincare routine ready" },
  5: { name: "Beret", prompt: "artistic beret, Hongdae creative" },
  6: { name: "Visor", prompt: "golf visor, Gangnam sporty" },
  7: { name: "Hair Clips", prompt: "decorative hair clips, cute accessories" },

  // UNCOMMON (8-15)
  8: { name: "Gat", prompt: "traditional Korean gat hat, noble heritage" },
  9: { name: "Military Beret", prompt: "Korean military beret, soldier pride" },
  10: { name: "Gaming Headset", prompt: "pro gaming headset, esports ready" },
  11: {
    name: "Idol Headpiece",
    prompt: "stage performance headpiece, K-pop glamour",
  },
  12: { name: "Hanbok Hat", prompt: "traditional hanbok formal headpiece" },
  13: { name: "Chef Hat", prompt: "Korean chef toque, culinary master" },
  14: {
    name: "Haenyeo Gear",
    prompt: "haenyeo diving headgear, ocean warrior",
  },
  15: { name: "Festival Crown", prompt: "K-pop lightstick crown, fan royalty" },

  // RARE (16-23)
  16: { name: "LED Headpiece", prompt: "glowing LED headpiece, cyber idol" },
  17: {
    name: "Royal Gat",
    prompt: "ornate royal gat with gold trim, Joseon noble",
  },
  18: { name: "VR Visor", prompt: "advanced VR visor, next-gen gamer" },
  19: { name: "Diamond Tiara", prompt: "diamond tiara, K-pop royalty" },
  20: {
    name: "Holographic Crown",
    prompt: "holographic floating crown, tech princess",
  },
  21: { name: "Cyber Helmet", prompt: "cyberpunk helmet with Korean patterns" },
  22: {
    name: "Dragon Mask",
    prompt: "traditional dragon mask, festival spirit",
  },
  23: { name: "Idol Halo", prompt: "light-up halo effect, angelic idol" },

  // LEGENDARY (24-31)
  24: {
    name: "Emperor's Crown",
    prompt: "Joseon emperor crown, supreme royal authority",
  },
  25: {
    name: "Hallyu Crown",
    prompt: "crown of floating album covers, K-pop supreme",
  },
  26: {
    name: "Samsung Crown",
    prompt: "ultra-tech Samsung crown with holographics",
  },
  27: {
    name: "Dragon Emperor",
    prompt: "Korean dragon circling head as crown",
  },
  28: {
    name: "Esports Champion",
    prompt: "floating esports trophies around head",
  },
  29: { name: "Neon Seoul", prompt: "miniature neon Seoul skyline as crown" },
  30: { name: "Hallyu Wave", prompt: "wave of K-culture flowing from head" },
  31: {
    name: "Transcendent Lotus",
    prompt: "divine lotus flower crown, ascending",
  },
};

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const SOUTH_KOREA_OUTFIT: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Casual Tee", prompt: "oversized Korean t-shirt, comfortable" },
  1: { name: "Hoodie", prompt: "designer hoodie, K-fashion staple" },
  2: {
    name: "School Uniform",
    prompt: "Korean school uniform, K-drama aesthetic",
  },
  3: { name: "Office Wear", prompt: "Korean office attire, Samsung employee" },
  4: { name: "Athleisure", prompt: "Korean athleisure style, sporty comfort" },
  5: { name: "Streetwear", prompt: "Hongdae streetwear, urban trendy" },
  6: { name: "Cafe Outfit", prompt: "Instagram-ready cafe outfit, aesthetic" },
  7: { name: "Fishing Gear", prompt: "Busan fisherman practical gear" },

  // UNCOMMON (8-15)
  8: { name: "K-Pop Stage", prompt: "K-pop performance outfit, stage ready" },
  9: {
    name: "Military Uniform",
    prompt: "Korean military uniform, soldier duty",
  },
  10: {
    name: "Hanbok Casual",
    prompt: "modern casual hanbok, traditional fusion",
  },
  11: { name: "Gaming Jersey", prompt: "esports team jersey, pro gamer" },
  12: {
    name: "Business Suit",
    prompt: "Korean chaebol business suit, corporate",
  },
  13: { name: "Chef Uniform", prompt: "Korean restaurant chef whites" },
  14: {
    name: "Dance Practice",
    prompt: "K-pop dance practice outfit, rehearsal",
  },
  15: {
    name: "Haenyeo Suit",
    prompt: "traditional haenyeo wetsuit, ocean diver",
  },

  // RARE (16-23)
  16: {
    name: "Royal Hanbok",
    prompt: "elaborate royal hanbok, Joseon nobility",
  },
  17: {
    name: "Cyber K-Pop",
    prompt: "futuristic K-pop outfit with LED elements",
  },
  18: { name: "Chaebol Luxury", prompt: "extremely expensive designer outfit" },
  19: { name: "Award Show", prompt: "K-pop award show outfit, red carpet" },
  20: { name: "Special Forces", prompt: "Korean special forces tactical gear" },
  21: {
    name: "Esports Champion",
    prompt: "championship esports jacket with medals",
  },
  22: {
    name: "Traditional Armor",
    prompt: "Korean warrior armor, historical hero",
  },
  23: {
    name: "Celebrity Wedding",
    prompt: "celebrity wedding outfit, ultimate glamour",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Emperor Robes",
    prompt: "Joseon emperor dragon robes, supreme ruler",
  },
  25: {
    name: "Hallyu Divinity",
    prompt: "outfit made of pure K-pop starlight",
  },
  26: {
    name: "Samsung Supreme",
    prompt: "tech-infused luxury suit, corporate god",
  },
  27: {
    name: "Dragon Hanbok",
    prompt: "hanbok made of dragon scales, mythical",
  },
  28: {
    name: "Esports Ascended",
    prompt: "championship gear with floating trophies",
  },
  29: { name: "Neon Dynasty", prompt: "hanbok made of flowing neon lights" },
  30: {
    name: "K-Wave Incarnate",
    prompt: "body wrapped in Korean Wave energy",
  },
  31: {
    name: "Transcendent Light",
    prompt: "pure divine K-beauty light, ascended",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const SOUTH_KOREA_WEAPON: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no weapon, idol pose" },
  1: { name: "Smartphone", prompt: "latest Samsung phone, social weapon" },
  2: { name: "Selfie Stick", prompt: "selfie stick, influencer tool" },
  3: { name: "Lightstick", prompt: "K-pop fandom lightstick, fan power" },
  4: { name: "Microphone", prompt: "golden microphone, performer tool" },
  5: { name: "Gaming Mouse", prompt: "pro gaming mouse, esports weapon" },
  6: { name: "Soju Bottle", prompt: "soju bottle, Korean party essential" },
  7: { name: "Fishing Spear", prompt: "haenyeo diving spear, traditional" },

  // UNCOMMON (8-15)
  8: { name: "Geomdo Sword", prompt: "Korean geomdo sword, martial arts" },
  9: { name: "K2 Rifle", prompt: "Korean military K2 rifle, soldier armed" },
  10: { name: "Nunchaku", prompt: "martial arts nunchaku, taekwondo" },
  11: { name: "Steel Fan", prompt: "Korean steel war fan, elegant weapon" },
  12: { name: "Korean Bow", prompt: "traditional Korean bow, gakgung archery" },
  13: { name: "Keyboard", prompt: "mechanical gaming keyboard, esports tool" },
  14: { name: "Chef Knife", prompt: "Korean chef knife, culinary weapon" },
  15: { name: "Protest Sign", prompt: "activist protest sign, people power" },

  // RARE (16-23)
  16: {
    name: "Diamond Mic",
    prompt: "diamond-encrusted microphone, idol supreme",
  },
  17: { name: "Cyber Blade", prompt: "high-tech cyber sword with LED edge" },
  18: { name: "Royal Sword", prompt: "Joseon royal ceremonial sword" },
  19: { name: "Gaming Throne", prompt: "ultimate gaming controller setup" },
  20: {
    name: "Taekwondo Staff",
    prompt: "master's taekwondo staff with energy",
  },
  21: {
    name: "Corporate Tablet",
    prompt: "Samsung tablet showing market dominance",
  },
  22: {
    name: "Dragon Halberd",
    prompt: "Korean dragon halberd, ancient power",
  },
  23: { name: "Idol Scepter", prompt: "K-pop scepter with floating albums" },

  // LEGENDARY (24-31)
  24: {
    name: "Emperor's Sword",
    prompt: "legendary emperor's sword, divine authority",
  },
  25: { name: "Hallyu Mic", prompt: "microphone channeling global fan energy" },
  26: {
    name: "Samsung Infinity",
    prompt: "Samsung tech that controls reality",
  },
  27: { name: "Dragon Gauntlet", prompt: "Korean dragon claw gauntlets" },
  28: { name: "Esports Aegis", prompt: "championship trophy as divine weapon" },
  29: { name: "Neon Blade", prompt: "sword made of pure Seoul neon light" },
  30: { name: "K-Wave Cannon", prompt: "weapon firing concentrated K-culture" },
  31: {
    name: "Transcendent Power",
    prompt: "pure divine energy weapon, ascended",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const SOUTH_KOREA_ACCESSORY: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no accessories, natural beauty" },
  1: { name: "Face Mask", prompt: "Korean beauty face mask sheet" },
  2: { name: "Simple Chain", prompt: "delicate silver chain necklace" },
  3: { name: "Earbuds", prompt: "wireless earbuds, always connected" },
  4: { name: "Smartwatch", prompt: "Samsung smartwatch, tech accessory" },
  5: { name: "Scrunchie", prompt: "cute scrunchie on wrist, casual" },
  6: { name: "Ring Set", prompt: "multiple minimal rings, K-fashion" },
  7: { name: "Tote Bag", prompt: "designer tote bag, Gangnam style" },

  // UNCOMMON (8-15)
  8: { name: "Designer Shades", prompt: "expensive designer sunglasses" },
  9: {
    name: "Pearl Necklace",
    prompt: "elegant pearl necklace, classic beauty",
  },
  10: { name: "Military Tags", prompt: "Korean military dog tags, service" },
  11: { name: "Gaming Gloves", prompt: "pro gaming gloves, esports gear" },
  12: { name: "Gold Chain", prompt: "gold chain necklace, showing wealth" },
  13: { name: "Norigae", prompt: "hanbok norigae ornament, traditional" },
  14: { name: "Idol Choker", prompt: "K-pop stage choker, performer style" },
  15: { name: "Tech Earpiece", prompt: "advanced communication earpiece" },

  // RARE (16-23)
  16: {
    name: "Diamond Choker",
    prompt: "diamond choker necklace, extreme luxury",
  },
  17: { name: "Royal Jade", prompt: "royal jade pendant, Joseon nobility" },
  18: { name: "BTC Pendant", prompt: "golden Bitcoin pendant, Korean design" },
  19: { name: "Holographic Badge", prompt: "holographic ID badge, tech elite" },
  20: {
    name: "Dragon Pendant",
    prompt: "Korean dragon pendant, mythical power",
  },
  21: {
    name: "Esports Medal",
    prompt: "championship esports medal collection",
  },
  22: { name: "Chaebol Ring", prompt: "chaebol family signet ring, corporate" },
  23: { name: "K-Pop Crown", prompt: "miniature K-pop crown accessory" },

  // LEGENDARY (24-31)
  24: {
    name: "Emperor's Seal",
    prompt: "imperial seal pendant, supreme authority",
  },
  25: { name: "Hallyu Aura", prompt: "floating album covers around body" },
  26: { name: "Samsung Core", prompt: "glowing Samsung tech core pendant" },
  27: { name: "Dragon Companion", prompt: "miniature Korean dragon companion" },
  28: { name: "Esports Legend", prompt: "floating trophies as accessories" },
  29: { name: "Neon Soul", prompt: "Seoul neon lights flowing around body" },
  30: { name: "K-Wave Embodied", prompt: "Korean Wave energy as accessory" },
  31: {
    name: "Transcendent Beauty",
    prompt: "divine K-beauty light, ascended",
  },
};

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const SOUTH_KOREA_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: {
    name: "Neutral",
    prompt: "neutral perfect expression, K-beauty standard",
  },
  1: { name: "Aegyo", prompt: "cute aegyo expression, Korean cuteness" },
  2: { name: "Serious", prompt: "serious focused expression, professional" },
  3: { name: "Friendly", prompt: "warm friendly smile, approachable" },
  4: { name: "Sleepy", prompt: "sleepy tired expression, overworked idol" },
  5: { name: "Shy", prompt: "shy bashful expression, humble rookie" },
  6: { name: "Cool", prompt: "cool unbothered expression, too cool" },
  7: { name: "Happy", prompt: "genuinely happy expression, bright smile" },

  // UNCOMMON (8-15)
  8: {
    name: "Determined",
    prompt: "determined fierce expression, will to win",
  },
  9: { name: "Stage Smile", prompt: "perfect stage smile, camera ready" },
  10: {
    name: "Fierce",
    prompt: "fierce powerful expression, girl crush concept",
  },
  11: {
    name: "Playful",
    prompt: "playful mischievous expression, variety show",
  },
  12: { name: "Emotional", prompt: "emotional expression, award show tears" },
  13: {
    name: "Charismatic",
    prompt: "charismatic leader expression, center energy",
  },
  14: { name: "Mysterious", prompt: "mysterious dark concept expression" },
  15: { name: "Proud", prompt: "proud accomplished expression, achievement" },

  // RARE (16-23)
  16: { name: "K-Drama Stare", prompt: "intense K-drama stare, leading role" },
  17: { name: "CEO Power", prompt: "chaebol CEO power expression, dominance" },
  18: {
    name: "Gaming Focus",
    prompt: "intense gaming focus, esports tournament",
  },
  19: { name: "Idol Supreme", prompt: "supreme idol confidence, global star" },
  20: { name: "Warrior Spirit", prompt: "Korean warrior spirit, unbreakable" },
  21: {
    name: "Dark Charisma",
    prompt: "dark charismatic expression, villain concept",
  },
  22: { name: "Victory", prompt: "victory celebration expression, champion" },
  23: { name: "Royal Command", prompt: "commanding royal expression, noble" },

  // LEGENDARY (24-31)
  24: {
    name: "Emperor's Gaze",
    prompt: "imperial commanding gaze, absolute power",
  },
  25: {
    name: "Hallyu Divinity",
    prompt: "divine K-pop energy, transcendent star",
  },
  26: {
    name: "Tech Supremacy",
    prompt: "Samsung supremacy expression, tech god",
  },
  27: { name: "Dragon Fury", prompt: "Korean dragon fury, mythical rage" },
  28: {
    name: "Esports Legend",
    prompt: "legendary gamer expression, ultimate focus",
  },
  29: {
    name: "Neon Dreams",
    prompt: "dreamy neon-lit expression, Seoul nights",
  },
  30: {
    name: "K-Wave Master",
    prompt: "one who controls Hallyu Wave expression",
  },
  31: {
    name: "Ascended Beauty",
    prompt: "transcendent K-beauty, divine perfection",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const SOUTH_KOREA_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Solid Red", prompt: "solid Korean red background" },
  1: { name: "Solid Blue", prompt: "solid Korean blue background" },
  2: {
    name: "Simple Gradient",
    prompt: "simple red to blue gradient, Taegeuk colors",
  },
  3: {
    name: "Cafe Interior",
    prompt: "aesthetic Korean cafe backdrop, Hongdae style",
  },
  4: {
    name: "Convenience Store",
    prompt: "Korean convenience store backdrop, CU or GS25",
  },
  5: {
    name: "School Hallway",
    prompt: "Korean school hallway backdrop, K-drama setting",
  },
  6: {
    name: "Subway Platform",
    prompt: "Seoul Metro subway platform backdrop",
  },
  7: {
    name: "Han River Park",
    prompt: "Han River park backdrop, casual Seoul life",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Gangnam Street",
    prompt: "Gangnam neon street backdrop, luxury district",
  },
  9: {
    name: "Hongdae Club",
    prompt: "Hongdae underground club backdrop, nightlife",
  },
  10: { name: "Busan Beach", prompt: "Haeundae Beach backdrop, Busan coastal" },
  11: {
    name: "Jeju Island",
    prompt: "Jeju Island volcanic landscape backdrop",
  },
  12: { name: "PC Bang", prompt: "Korean PC bang esports cafe backdrop" },
  13: {
    name: "K-Pop Practice Room",
    prompt: "K-pop idol practice room mirror backdrop",
  },
  14: {
    name: "Samsung Office",
    prompt: "Samsung corporate headquarters backdrop",
  },
  15: {
    name: "Bukchon Hanok",
    prompt: "traditional Bukchon Hanok village backdrop",
  },

  // RARE (16-23)
  16: {
    name: "Gyeongbokgung Palace",
    prompt: "Gyeongbokgung Palace backdrop, royal heritage",
  },
  17: {
    name: "K-Pop Concert",
    prompt: "massive K-pop concert stadium backdrop, lightstick ocean",
  },
  18: {
    name: "DMZ Border",
    prompt: "DMZ demilitarized zone backdrop, tense division",
  },
  19: {
    name: "Esports Arena",
    prompt: "packed esports arena backdrop, tournament finals",
  },
  20: {
    name: "Award Show Stage",
    prompt: "K-pop award show stage backdrop, red carpet",
  },
  21: {
    name: "Lotte Tower",
    prompt: "Lotte World Tower observation deck backdrop",
  },
  22: {
    name: "Temple Mountain",
    prompt: "Korean Buddhist temple in mountains backdrop",
  },
  23: {
    name: "Film Set",
    prompt: "K-drama filming set backdrop, behind the scenes",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Taegeuk Waving",
    prompt: "massive waving Korean flag backdrop, patriotic glory",
  },
  25: {
    name: "Hallyu Universe",
    prompt: "cosmic K-pop universe backdrop, album art swirling",
  },
  26: {
    name: "Samsung City",
    prompt: "futuristic Samsung smart city backdrop, tech utopia",
  },
  27: {
    name: "Dragon's Lair",
    prompt: "Korean dragon's mystical lair backdrop, ancient power",
  },
  28: {
    name: "World Championship",
    prompt: "LoL Worlds championship stage backdrop, ultimate esports",
  },
  29: {
    name: "Neon Seoul Night",
    prompt: "cyberpunk Seoul at night backdrop, neon everywhere",
  },
  30: {
    name: "Korean Cosmos",
    prompt: "Taegeuk constellation in cosmic space backdrop",
  },
  31: {
    name: "Divine Ascension",
    prompt: "heavenly clouds with Korean divine light, transcendent backdrop",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const SOUTH_KOREA_EVOLUTION_STAGES: Record<
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
    name: "Gangaji",
    size: "small puppy hashbeast",
    demeanor: "cute and eager",
  },
  1: {
    stage: 1,
    name: "Trainee",
    size: "young growing hashbeast",
    demeanor: "hardworking rookie",
  },
  2: {
    stage: 2,
    name: "Debut",
    size: "adult hashbeast",
    demeanor: "confident performer",
  },
  3: {
    stage: 3,
    name: "Veteran",
    size: "established hashbeast",
    demeanor: "experienced artist",
  },
  4: {
    stage: 4,
    name: "Senior",
    size: "prime adult hashbeast",
    demeanor: "industry leader",
  },
  5: {
    stage: 5,
    name: "Legend",
    size: "large imposing hashbeast",
    demeanor: "hallyu icon",
  },
  6: {
    stage: 6,
    name: "National Treasure",
    size: "legendary massive hashbeast",
    demeanor: "cultural monument",
  },
  7: {
    stage: 7,
    name: "Hallyu God",
    size: "transcendent divine wolf",
    demeanor: "K-culture deity",
  },
};

/**
 * Gets the story/lore for a South Korea hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getSouthKoreaStory(typeValue: number): string {
  const typeData = SOUTH_KOREA_TYPE_PROMPTS[typeValue];
  return typeData?.story || SOUTH_KOREA_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const SOUTH_KOREA_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const SOUTH_KOREA_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = SOUTH_KOREA_TYPE_PROMPTS[i];
  SOUTH_KOREA_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = SOUTH_KOREA_TYPE_PROMPTS[i];
  SOUTH_KOREA_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
