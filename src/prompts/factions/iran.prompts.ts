/**
 * Iran Faction Prompts
 *
 * The Persian HashBeast Network traces its roots to the ancient Achaemenid Empire.
 * From the bazaars of Tehran to the ruins of Persepolis, from nuclear facilities
 * beneath the mountains to the poetry halls of Isfahan — Iranian hashbeasts have
 * woven themselves into 2,500 years of continuous civilization.
 *
 * Faction ID: 6
 *
 * NEW TRAIT SYSTEM (7 appearance traits + separate type):
 * - Type Field (4 bits): 0-7 Wizard, 8-15 Muggle
 * - Trait 0-6: Fur Color, Headwear, Outfit, Weapon, Accessory, Expression, Background
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
export const IRAN_FACTION = legacyFactionBlock(6);

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// =============================================================================

export const IRAN_TYPE_PROMPTS: Record<
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
    region: "Isfahan",
    occupation: "Mosque Pattern Sorcerer",
    description: "Wizard who encodes spells into Islamic geometric tilework",
    story: `The geometric patterns in Isfahan's mosques aren't decoration — they're
spell matrices. Each tile placement channels magical energy. The Shah Mosque alone
generates enough power to mine 10,000 $degenBTC per day. This sorcerer maintains
the ancient patterns and adds new ones.`,
    prompt:
      "Persian sorcerer, Isfahan mosque backdrop, geometric spell patterns, turquoise and gold robes, Islamic architectural magic",
  },
  1: {
    type: "wizard",
    region: "Shiraz",
    occupation: "Hafez Oracle",
    description:
      "Divination wizard who reads futures through the poetry of Hafez",
    story: `Every Iranian knows you open Hafez's Divan at random for prophecy. This wizard
has mastered the art — every poem reveals $degenBTC price movements. The tomb of Hafez
in Shiraz is actually a massive divination amplifier. Poetry is the highest magic.`,
    prompt:
      "Persian poet wizard, Hafez tomb garden, flowing scholarly robes, book of prophecy, rose garden mysticism",
  },
  2: {
    type: "wizard",
    region: "Qom",
    occupation: "Seminary Enchanter",
    description:
      "Religious scholar who combines Quranic knowledge with ancient Persian sorcery",
    story: `In the hidden chambers beneath Qom's seminaries, ancient Zoroastrian fire magic
merges with Islamic scholarship. The enchanter has reconciled both traditions into a
unified magical system. The $degenBTC mining algorithms are inscribed in illuminated
manuscripts that burn with inner fire.`,
    prompt:
      "Persian religious scholar wizard, seminary robes, ancient manuscripts, fire and calligraphy magic, scholarly authority",
  },
  3: {
    type: "wizard",
    region: "Persepolis",
    occupation: "Achaemenid Necromancer",
    description: "Wizard channeling the spirits of the ancient Persian Empire",
    story: `The ruins of Persepolis aren't ruins — they're a gateway. This necromancer
communes with the spirits of Darius and Xerxes. The Immortals guard the astral plane.
Ancient Persian military magic powers modern $degenBTC operations. An empire never
truly falls if its magic endures.`,
    prompt:
      "ancient Persian necromancer, Persepolis columns, Achaemenid regalia, spirit summoning, imperial ghost magic",
  },
  4: {
    type: "wizard",
    region: "Tehran",
    occupation: "Revolutionary Guard Mage",
    description: "IRGC's magical warfare division commander",
    story: `The IRGC's Division 313 doesn't appear in any official documents. It's the
magical warfare arm — developing enchanted drones, spell-guided missiles, and
$degenBTC-powered defensive wards. This mage commands operations across the region.
Proxy wars are cover for magical expansion.`,
    prompt:
      "military wizard, IRGC revolutionary aesthetic, tactical magic robes, Tehran cityscape, commanding dark authority",
  },
  5: {
    type: "wizard",
    region: "Natanz",
    occupation: "Nuclear Alchemist",
    description:
      "Wizard running the true purpose of Iran's enrichment facilities",
    story: `The centrifuges at Natanz don't enrich uranium — they spin magical energy into
crystallized $degenBTC. The IAEA inspectors see what the concealment charms let them see.
Deep underground, ancient Persian alchemy meets modern magical engineering. The "nuclear
deal" was really about mining quotas.`,
    prompt:
      "alchemist wizard, underground laboratory, centrifuge machinery, glowing magical energy, nuclear-mystical hybrid",
  },
  6: {
    type: "wizard",
    region: "Kurdistan",
    occupation: "Mountain Mystic",
    description:
      "Hermit wizard living in the Zagros Mountains with ancient earth magic",
    story: `The Zagros Mountains contain ley lines older than civilization. This mystic has
tapped into tectonic magical energy — earthquakes in Iran aren't natural, they're mining
operations gone large. Mountain caves hide $degenBTC vaults carved by Sassanid mages
fifteen centuries ago.`,
    prompt:
      "mountain hermit wizard, Zagros peaks, earth and stone magic, cave dwelling, ancient Kurdish mysticism",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Quds Force Dark Sorcerer",
    description: "The Dark Lord's appointed commander for the Persian theatre",
    story: `The Dark Lord recognized Persian magic as the oldest and most powerful. The Quds
Force Sorcerer commands a shadow network across Lebanon, Syria, Iraq, and Yemen —
each proxy a node in the $degenBTC mining mesh. When the Dark Lord needs ancient power,
Persia delivers.`,
    prompt:
      "dark sorcerer, Persian dark magic, shadowy commander, regional map backdrop, ominous imperial power",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Tehran",
    occupation: "Supreme Leader's Companion",
    description:
      "The Supreme Leader's personal dog with access to all state secrets",
    story: `Sits beside the Supreme Leader during every critical meeting. Has heard every
classified discussion about $degenBTC operations. Foreign intelligence agencies have
tried to recruit this dog seventeen times. The dog plays along, feeding disinformation.`,
    prompt:
      "regal Persian dog, supreme leader's compound, political authority, guarded luxury, state power",
  },
  9: {
    type: "muggle",
    region: "Tehran",
    occupation: "Grand Bazaar Merchant Dog",
    description: "Merchant's companion in Tehran's ancient Grand Bazaar",
    story: `The Grand Bazaar is the original decentralized exchange. This dog has witnessed
more $degenBTC trades disguised as carpet deals than any blockchain could record.
Every carpet pattern is a wallet address. Every haggle is an OTC trade. The bazaar
economy runs on crypto the West can't sanction.`,
    prompt:
      "bazaar merchant dog, Tehran Grand Bazaar, Persian carpets, spice stalls, merchant wealth",
  },
  10: {
    type: "muggle",
    region: "Khuzestan",
    occupation: "Oil Field Guardian",
    description: "Guard dog at Iran's massive oil extraction facilities",
    story: `Patrols the oil fields of Khuzestan — the real wealth of nations. But the oil
is secondary. Beneath every drilling platform, $degenBTC mining rigs tap geothermal
energy. The dog guards both the visible and invisible wealth. Sanctions can't touch
what's underground.`,
    prompt:
      "industrial guard dog, oil derricks, Khuzestan desert, petroleum infrastructure, tough working dog",
  },
  11: {
    type: "muggle",
    region: "Isfahan",
    occupation: "Master Carpet Weaver's Dog",
    description: "Companion to Iran's most renowned carpet artisan",
    story: `Persian carpets contain more data per square meter than any hard drive. This dog
watches the master weave $degenBTC private keys into silk patterns. Each carpet sold
at auction transfers wealth invisibly. The most expensive carpet ever sold? It contained
a whale's entire portfolio.`,
    prompt:
      "artisan's companion dog, carpet workshop, Isfahan craftsmanship, silk threads, traditional mastery",
  },
  12: {
    type: "muggle",
    region: "Strait of Hormuz",
    occupation: "IRGC Navy Dog",
    description: "Fast attack boat crew member's K-9 partner",
    story: `Patrols the Strait of Hormuz on speedboats — 20% of the world's oil passes
through this chokepoint. The IRGC Navy doesn't just control oil flow. Underwater
$degenBTC relay stations line the seabed. This dog has boarded more ships than most
admirals. The strait belongs to Iran.`,
    prompt:
      "naval military dog, speedboat, Strait of Hormuz waters, IRGC navy, maritime warrior",
  },
  13: {
    type: "muggle",
    region: "Mashhad",
    occupation: "Shrine Guardian Dog",
    description: "Guardian of the Imam Reza shrine complex",
    story: `Twenty million pilgrims visit Mashhad annually. The shrine complex is also the
largest $degenBTC donation processing center in the Middle East. Every prayer donation
is converted. This dog guards the golden dome and the servers beneath it. Sacred and
profitable.`,
    prompt:
      "shrine guardian dog, golden dome, Mashhad pilgrimage, sacred architecture, devoted protector",
  },
  14: {
    type: "muggle",
    region: "Chalus Road",
    occupation: "Mountain Smuggler's Dog",
    description:
      "Companion of a smuggler running goods through the Alborz Mountains",
    story: `The Alborz Mountains between Tehran and the Caspian Sea hide ancient smuggling
routes. This dog navigates paths that satellites can't see. Hardware wallets, mining
equipment, sanctioned tech — everything moves through the mountains. The dog never
gets lost. The route is in its blood.`,
    prompt:
      "rugged mountain dog, Alborz mountain pass, smuggler's companion, misty peaks, survival instinct",
  },
  15: {
    type: "muggle",
    region: "Tehran",
    occupation: "Underground DJ's Dog",
    description:
      "Companion of Tehran's most famous underground party organizer",
    story: `Tehran's underground scene is the real resistance. This dog guards the door
at secret warehouse parties where $degenBTC changes hands through NFC-enabled collars.
The morality police can't find what they can't imagine. Revolution sounds like
bass drops now.`,
    prompt:
      "urban street dog, Tehran nightlife, underground culture, neon in darkness, rebel energy",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const IRAN_FUR_COLOR: Record<number, { name: string; prompt: string }> =
  {
    0: {
      name: "Desert Sand",
      prompt: "warm desert sand colored fur, Persian earth tones",
    },
    1: {
      name: "Saffron Cream",
      prompt: "saffron-tinted cream fur, warm golden hue",
    },
    2: { name: "Cinnamon", prompt: "rich cinnamon brown fur, spice-toned" },
    3: {
      name: "Wheat Gold",
      prompt: "golden wheat colored fur, harvest tones",
    },
    4: { name: "Light Tan", prompt: "light tan fur, sun-bleached appearance" },
    5: { name: "Warm Brown", prompt: "warm brown fur, earth-toned coloring" },
    6: { name: "Honey", prompt: "honey-colored fur, amber warmth" },
    7: { name: "Almond", prompt: "soft almond-toned fur, natural beige" },
    8: {
      name: "Persian Copper",
      prompt: "deep copper fur with metallic Persian sheen",
    },
    9: {
      name: "Pomegranate Red",
      prompt: "deep pomegranate red fur, fruit-dark richness",
    },
    10: { name: "Walnut", prompt: "dark walnut brown fur, aged wood tones" },
    11: { name: "Charcoal", prompt: "smoky charcoal fur, volcanic ash tones" },
    12: {
      name: "Pistachio Cream",
      prompt: "pale pistachio-green tinted fur, unique Iranian",
    },
    13: {
      name: "Rose Dust",
      prompt: "dusty rose-tinted fur, Persian garden warmth",
    },
    14: {
      name: "Silver Ash",
      prompt: "silver-ash fur, mountain mist coloring",
    },
    15: {
      name: "Midnight Blue",
      prompt: "deep midnight blue-black fur, Isfahan night",
    },
    16: { name: "Pure White", prompt: "pure white fur, Alborz snow, pristine" },
    17: {
      name: "Obsidian",
      prompt: "pure obsidian black fur, volcanic glass sheen",
    },
    18: {
      name: "Turquoise Shimmer",
      prompt: "fur with turquoise shimmer, Isfahan tile magic",
    },
    19: {
      name: "Saffron Gold",
      prompt: "pure saffron gold fur, most expensive spice, luxurious",
    },
    20: {
      name: "Lapis Lazuli",
      prompt: "deep lapis lazuli blue-flecked fur, gemstone quality",
    },
    21: {
      name: "Persian Rose",
      prompt: "vivid Persian rose pink fur, Shiraz garden bloom",
    },
    22: {
      name: "Zagros Iron",
      prompt: "iron-gray fur with mountain mineral sheen",
    },
    23: {
      name: "Caspian Teal",
      prompt: "Caspian Sea teal-tinted fur, coastal magic",
    },
    24: {
      name: "Imperial Purple",
      prompt: "Achaemenid imperial purple fur, ancient royalty",
    },
    25: {
      name: "Zoroastrian Flame",
      prompt: "fur flickering with inner Zoroastrian fire, eternal flame",
    },
    26: {
      name: "Nuclear Glow",
      prompt: "fur with subtle green-gold nuclear glow, enriched power",
    },
    27: {
      name: "Persepolis Gold",
      prompt: "pure hammered gold fur, Persepolis treasure, divine wealth",
    },
    28: {
      name: "Geometric Light",
      prompt: "fur patterned with glowing Islamic geometric designs",
    },
    29: {
      name: "Calligraphy Script",
      prompt: "fur inscribed with flowing Persian calligraphy, living text",
    },
    30: {
      name: "Immortal Silver",
      prompt: "silver-white fur of the Persian Immortals, spectral warrior",
    },
    31: {
      name: "Divine Fire",
      prompt: "fur blazing with Ahura Mazda's divine fire, transcendent",
    },
  };

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const IRAN_HEADWEAR: Record<number, { name: string; prompt: string }> = {
  0: { name: "None", prompt: "no headwear, natural fur visible" },
  1: {
    name: "White Turban",
    prompt: "simple white turban, traditional clergy",
  },
  2: {
    name: "Keffiyeh",
    prompt: "casual keffiyeh headscarf, practical desert wear",
  },
  3: {
    name: "Kolah Namadi",
    prompt: "traditional felt hat, Iranian folk style",
  },
  4: { name: "Simple Bandana", prompt: "plain headband bandana, worker style" },
  5: { name: "Prayer Cap", prompt: "simple prayer cap, devotional" },
  6: { name: "Flat Cap", prompt: "Persian flat cap, urban casual" },
  7: {
    name: "Construction Hardhat",
    prompt: "yellow hardhat, infrastructure worker",
  },
  8: {
    name: "Black Turban",
    prompt: "black turban, Seyyed lineage, religious authority",
  },
  9: {
    name: "Military Beret",
    prompt: "IRGC military beret, revolutionary forces",
  },
  10: { name: "Basij Headband", prompt: "Basij militia headband with slogans" },
  11: {
    name: "Oil Worker Helmet",
    prompt: "industrial oil worker safety helmet",
  },
  12: {
    name: "Aviator Helmet",
    prompt: "fighter pilot helmet, Iranian Air Force",
  },
  13: { name: "Border Guard Cap", prompt: "border patrol military cap" },
  14: { name: "Scholar's Cap", prompt: "academic turban with gilded edges" },
  15: {
    name: "Bazaar Merchant Hat",
    prompt: "ornate merchant skullcap, gold thread",
  },
  16: {
    name: "IRGC Commander Cap",
    prompt: "IRGC commander's dress cap, senior military",
  },
  17: {
    name: "Qajar Crown",
    prompt: "ornate Qajar dynasty crown, jeweled magnificence",
  },
  18: {
    name: "Nuclear Hazmat Hood",
    prompt: "radiation hazmat hood, classified facility",
  },
  19: {
    name: "Safavid Turban",
    prompt: "elaborate Safavid-era turban with jeweled pin",
  },
  20: {
    name: "Golden Helmet",
    prompt: "Persian warrior golden helmet, Immortals style",
  },
  21: {
    name: "Sufi Dervish Hat",
    prompt: "tall conical Sufi dervish hat, mystical",
  },
  22: {
    name: "Achaemenid Tiara",
    prompt: "Achaemenid royal tiara, Persepolis king",
  },
  23: {
    name: "Cyber Warfare Visor",
    prompt: "high-tech cyber operations visor, digital warfare",
  },
  24: {
    name: "Supreme Leader's Turban",
    prompt: "supreme leader's ceremonial black turban, ultimate authority",
  },
  25: {
    name: "Zoroastrian Fire Crown",
    prompt: "crown of eternal Zoroastrian flames, sacred fire",
  },
  26: {
    name: "Persepolis War Crown",
    prompt: "winged Faravahar crown, divine guardian spirit",
  },
  27: {
    name: "Rumi's Enlightenment",
    prompt: "halo of swirling Persian poetry, enlightened wisdom",
  },
  28: {
    name: "Nuclear Halo",
    prompt: "glowing atomic orbital halo, nuclear ascension",
  },
  29: {
    name: "Immortal General",
    prompt: "golden Immortals war crown, 10,000 spirits",
  },
  30: {
    name: "Geometric Infinity",
    prompt: "floating Islamic geometric crown of infinite patterns",
  },
  31: {
    name: "Ahura Mazda's Light",
    prompt: "divine light crown of Ahura Mazda, transcendent god-king",
  },
};

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const IRAN_OUTFIT: Record<number, { name: string; prompt: string }> = {
  0: { name: "Simple Shirt", prompt: "casual Iranian shirt, everyday wear" },
  1: {
    name: "Collarless Tunic",
    prompt: "traditional collarless tunic, modest style",
  },
  2: { name: "Work Overalls", prompt: "laborer's overalls, industrial worker" },
  3: { name: "Track Suit", prompt: "casual tracksuit, Tehran street style" },
  4: { name: "Shop Vest", prompt: "bazaar shopkeeper vest over shirt" },
  5: {
    name: "Student Uniform",
    prompt: "university student attire, scholarly",
  },
  6: { name: "Simple Robe", prompt: "plain traditional robe, everyday" },
  7: {
    name: "Farmer's Clothes",
    prompt: "rural farming attire, agricultural worker",
  },
  8: {
    name: "Clergy Robes",
    prompt: "clerical robes, aba and qaba, religious authority",
  },
  9: {
    name: "IRGC Uniform",
    prompt: "IRGC military uniform, olive green, revolutionary guard",
  },
  10: {
    name: "Basij Fatigues",
    prompt: "Basij militia fatigues, volunteer forces",
  },
  11: {
    name: "Bazaar Merchant Silk",
    prompt: "silk merchant's fine clothing, trading wealth",
  },
  12: {
    name: "Oil Engineer Suit",
    prompt: "petroleum engineer professional attire",
  },
  13: {
    name: "Police Uniform",
    prompt: "Iranian police uniform, law enforcement",
  },
  14: {
    name: "Doctor's Coat",
    prompt: "medical doctor white coat, healthcare",
  },
  15: {
    name: "Wrestling Singlet",
    prompt: "Iranian wrestling singlet, athletic champion",
  },
  16: {
    name: "Quds Force Tactical",
    prompt: "Quds Force tactical gear, special operations",
  },
  17: {
    name: "Nuclear Facility Suit",
    prompt: "classified facility containment suit",
  },
  18: {
    name: "Diplomat's Suit",
    prompt: "senior diplomat formal suit, international negotiations",
  },
  19: {
    name: "Safavid Court Robes",
    prompt: "ornate Safavid court robes, silk and gold thread",
  },
  20: {
    name: "Pilot Flight Suit",
    prompt: "Iranian F-14 pilot flight suit, Top Gun Persian",
  },
  21: {
    name: "Cyber Ops Gear",
    prompt: "cyber warfare operations tactical gear",
  },
  22: {
    name: "Golden Armor",
    prompt: "Persian warrior golden armor, ancient military",
  },
  23: {
    name: "Master Carpet Weaver",
    prompt: "master artisan robes with carpet-pattern embroidery",
  },
  24: {
    name: "Supreme Commander",
    prompt: "supreme military commander ceremonial uniform, all medals",
  },
  25: {
    name: "Achaemenid Immortal",
    prompt: "Persian Immortal warrior armor, golden and blue, legendary",
  },
  26: {
    name: "Zoroastrian Priest",
    prompt: "sacred Zoroastrian priest robes, fire temple ceremonial",
  },
  27: {
    name: "Nuclear Sovereign",
    prompt: "glowing atomic energy armor, nuclear nation power",
  },
  28: {
    name: "Shah of Shahs",
    prompt: "King of Kings regalia, Persepolis throne room splendor",
  },
  29: {
    name: "Rumi's Mantle",
    prompt: "swirling robes of living poetry, words dance on fabric",
  },
  30: {
    name: "Faravahar Armor",
    prompt: "divine Faravahar winged armor, Zoroastrian guardian spirit",
  },
  31: {
    name: "Transcendent Light",
    prompt: "body wrapped in Persian divine light, ascended immortal",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const IRAN_WEAPON: Record<number, { name: string; prompt: string }> = {
  0: { name: "None", prompt: "no weapon, empty hands" },
  1: {
    name: "Walking Stick",
    prompt: "carved walking stick, mountain traveler",
  },
  2: {
    name: "Merchant Scales",
    prompt: "brass trading scales, bazaar merchant",
  },
  3: { name: "Prayer Beads", prompt: "tasbih prayer beads, devotional item" },
  4: {
    name: "Tea Glass",
    prompt: "Persian tea glass in ornate holder, social weapon",
  },
  5: {
    name: "Backgammon Board",
    prompt: "carved backgammon set, strategic mind",
  },
  6: { name: "Spanner", prompt: "industrial wrench, oil worker tool" },
  7: {
    name: "Book of Hafez",
    prompt: "worn copy of Hafez poetry, cultural icon",
  },
  8: { name: "AK-47", prompt: "AK-47 assault rifle, revolutionary standard" },
  9: {
    name: "Shamshir Sword",
    prompt: "curved Persian shamshir sword, cavalry tradition",
  },
  10: { name: "RPG Launcher", prompt: "RPG-7 launcher, guerrilla weapon" },
  11: {
    name: "Sniper Rifle",
    prompt: "Arash sniper rifle, Iranian-made precision",
  },
  12: { name: "Combat Dagger", prompt: "Persian combat dagger, qama style" },
  13: {
    name: "Drone Controller",
    prompt: "Shahed drone controller, asymmetric warfare",
  },
  14: {
    name: "Zurkhane Meel",
    prompt: "heavy Persian meel club, traditional strength",
  },
  15: {
    name: "Wrestling Grip",
    prompt: "pahlevani wrestling stance, ancient martial art",
  },
  16: {
    name: "Anti-Ship Missile",
    prompt: "portable Noor anti-ship missile launcher",
  },
  17: {
    name: "Cyber Weapon",
    prompt: "laptop running advanced cyber attack tools",
  },
  18: {
    name: "Golden Shamshir",
    prompt: "ornate golden shamshir with jeweled hilt",
  },
  19: {
    name: "Enchanted Carpet",
    prompt: "flying carpet weapon platform, mobile strike",
  },
  20: {
    name: "Qanat Staff",
    prompt: "staff channeling ancient qanat water magic",
  },
  21: {
    name: "Ballistic Scroll",
    prompt: "scroll that fires encoded projectiles",
  },
  22: {
    name: "Sacred Fire Orb",
    prompt: "orb of concentrated Zoroastrian fire",
  },
  23: {
    name: "Geometric Shield",
    prompt: "shield of interlocking Islamic geometric patterns",
  },
  24: {
    name: "Spear of Rostam",
    prompt: "legendary spear of Rostam, Shahnameh hero, divine weapon",
  },
  25: {
    name: "Nuclear Scepter",
    prompt: "scepter of concentrated nuclear energy, glowing power",
  },
  26: {
    name: "Faravahar Wings",
    prompt: "divine Faravahar wing blades, guardian spirit weapons",
  },
  27: {
    name: "Simurgh Feather",
    prompt: "Simurgh mythical bird feather, reality-warping power",
  },
  28: {
    name: "Persepolis Spear",
    prompt: "Immortal Guard ceremonial spear, soul-piercing",
  },
  29: {
    name: "Rumi's Quill",
    prompt: "quill that writes destiny, poetry becomes reality",
  },
  30: {
    name: "Cyrus Cylinder",
    prompt: "Cyrus the Great's cylinder, commands obedience of nations",
  },
  31: {
    name: "Divine Flame",
    prompt: "wielding Ahura Mazda's divine flame, pure creation fire",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const IRAN_ACCESSORY: Record<number, { name: string; prompt: string }> =
  {
    0: { name: "None", prompt: "no accessories" },
    1: { name: "Prayer Beads", prompt: "simple tasbih prayer beads on wrist" },
    2: { name: "Plain Ring", prompt: "simple silver ring, traditional" },
    3: { name: "Keffiyeh Scarf", prompt: "cotton keffiyeh around neck" },
    4: { name: "Watch", prompt: "practical wristwatch" },
    5: {
      name: "Tea Stain",
      prompt: "subtle saffron tea stain on paw, tea drinker",
    },
    6: { name: "Worry Beads", prompt: "clicking worry beads, nervous energy" },
    7: { name: "Belt Pouch", prompt: "leather belt pouch, traveler" },
    8: {
      name: "Aqiq Ring",
      prompt: "carnelian aqiq stone ring, Shia significance",
    },
    9: { name: "Military Medals", prompt: "Iran-Iraq War service medals" },
    10: { name: "Gold Chain", prompt: "thick gold chain, new money display" },
    11: {
      name: "Turquoise Necklace",
      prompt: "Neyshabur turquoise stone necklace, precious",
    },
    12: {
      name: "Saffron Pouch",
      prompt: "pouch of premium saffron, liquid gold",
    },
    13: {
      name: "Scholar's Glasses",
      prompt: "round scholar spectacles, intellectual",
    },
    14: {
      name: "Wrestling Belt",
      prompt: "championship wrestling belt, pahlevani",
    },
    15: { name: "Pilot Wings", prompt: "Iranian Air Force pilot wings pin" },
    16: {
      name: "IRGC Star Badge",
      prompt: "IRGC commander star insignia badge",
    },
    17: {
      name: "Safavid Jewels",
      prompt: "Safavid-era jeweled accessories, royal heritage",
    },
    18: {
      name: "Turquoise Crown Ring",
      prompt: "crowned turquoise ring, master artisan",
    },
    19: {
      name: "Nuclear Clearance",
      prompt: "classified nuclear facility access badge, glowing",
    },
    20: {
      name: "Persian Calligraphy Band",
      prompt: "armband with flowing calligraphy, poetic power",
    },
    21: {
      name: "Darya-ye Noor",
      prompt: "replica Darya-ye Noor diamond pendant, pink brilliance",
    },
    22: {
      name: "Cyber Implant",
      prompt: "subtle cyber warfare enhancement implant",
    },
    23: {
      name: "Carpet Pattern Sash",
      prompt: "sash woven with sacred carpet patterns",
    },
    24: {
      name: "Faravahar Pendant",
      prompt: "golden Faravahar pendant, divine protection",
    },
    25: {
      name: "Crown Jewels",
      prompt: "pieces from the Imperial Crown Jewels, priceless",
    },
    26: {
      name: "Zoroastrian Fire Ring",
      prompt: "ring containing eternal Zoroastrian flame",
    },
    27: {
      name: "Simurgh Feather Pin",
      prompt: "Simurgh feather brooch, mythical protection",
    },
    28: {
      name: "Nuclear Aura",
      prompt: "subtle atomic orbital patterns floating around body",
    },
    29: {
      name: "Rostam's Bracelet",
      prompt: "legendary hero Rostam's golden bracelet",
    },
    30: {
      name: "Persepolis Seal",
      prompt: "glowing royal seal of Persepolis, empire authority",
    },
    31: {
      name: "Divine Light Mantle",
      prompt: "mantle of Ahura Mazda's light, transcendent divinity",
    },
  };

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const IRAN_EXPRESSION: Record<number, { name: string; prompt: string }> =
  {
    0: { name: "Neutral", prompt: "neutral calm expression" },
    1: {
      name: "Warm",
      prompt: "warm hospitable expression, Persian hospitality",
    },
    2: { name: "Serious", prompt: "serious composed expression, dignified" },
    3: { name: "Proud", prompt: "proud Persian expression, ancient heritage" },
    4: {
      name: "Contemplative",
      prompt: "contemplative thoughtful expression, philosophical",
    },
    5: {
      name: "Friendly",
      prompt: "friendly welcoming expression, taarof politeness",
    },
    6: { name: "Tired", prompt: "tired but resilient expression, enduring" },
    7: { name: "Calm", prompt: "deeply calm expression, inner peace" },
    8: {
      name: "Determined",
      prompt: "fiercely determined expression, revolutionary resolve",
    },
    9: {
      name: "Shrewd",
      prompt: "shrewd bazaar merchant expression, calculating",
    },
    10: {
      name: "Defiant",
      prompt: "defiant proud expression, resistance stance",
    },
    11: { name: "Poetic", prompt: "dreamy poetic expression, lost in verse" },
    12: {
      name: "Commanding",
      prompt: "military commanding expression, authority",
    },
    13: {
      name: "Mystical",
      prompt: "mystical faraway expression, Sufi ecstasy",
    },
    14: {
      name: "Cunning",
      prompt: "cunning clever expression, chess master mind",
    },
    15: { name: "Fierce", prompt: "fierce warrior expression, Persian lion" },
    16: {
      name: "Supreme Authority",
      prompt: "supreme unquestionable authority expression",
    },
    17: {
      name: "Ancient Wisdom",
      prompt: "expression of ancient Persian wisdom, 2500 years",
    },
    18: {
      name: "Cold Fury",
      prompt: "cold contained fury expression, dangerous calm",
    },
    19: {
      name: "Prophetic",
      prompt: "prophetic vision expression, seeing futures",
    },
    20: {
      name: "Imperial",
      prompt: "imperial Achaemenid expression, King of Kings",
    },
    21: {
      name: "Nuclear Confidence",
      prompt: "absolute confidence expression, nuclear power",
    },
    22: {
      name: "Sufi Ecstasy",
      prompt: "whirling dervish ecstasy expression, divine union",
    },
    23: {
      name: "Siege Mentality",
      prompt: "hardened siege mentality expression, unbreakable",
    },
    24: {
      name: "Cyrus's Mercy",
      prompt: "benevolent conqueror expression, Cyrus the Great",
    },
    25: {
      name: "Immortal Gaze",
      prompt: "Persian Immortal warrior gaze, deathless eyes",
    },
    26: {
      name: "Zoroastrian Fire Eyes",
      prompt: "eyes burning with sacred Zoroastrian fire",
    },
    27: {
      name: "Divine Truth",
      prompt: "expression of pure asha — divine truth and righteousness",
    },
    28: {
      name: "Empire Builder",
      prompt: "world-conquering vision expression, empire without end",
    },
    29: {
      name: "Rumi's Love",
      prompt: "expression of infinite Rumi-esque divine love",
    },
    30: {
      name: "Shahnameh Hero",
      prompt: "legendary hero expression, Shahnameh epic warrior",
    },
    31: {
      name: "Ahura Mazda's Peace",
      prompt: "transcendent divine peace, god-touched serenity",
    },
  };

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const IRAN_BACKGROUND: Record<number, { name: string; prompt: string }> =
  {
    0: { name: "Solid Green", prompt: "solid Iranian green background" },
    1: { name: "Solid Red", prompt: "solid Iranian red background" },
    2: {
      name: "Desert Gradient",
      prompt: "warm desert to sky gradient background",
    },
    3: {
      name: "Tehran Street",
      prompt: "Tehran city street backdrop, urban Iran",
    },
    4: {
      name: "Mountain Road",
      prompt: "winding Alborz mountain road backdrop",
    },
    5: {
      name: "Wheat Field",
      prompt: "golden wheat field backdrop, agricultural Iran",
    },
    6: { name: "Village", prompt: "traditional Persian village backdrop" },
    7: {
      name: "Tea House",
      prompt: "traditional chai-khaneh tea house backdrop",
    },
    8: {
      name: "Grand Bazaar",
      prompt: "Tehran Grand Bazaar interior, arched ceilings, bustling",
    },
    9: {
      name: "Isfahan Mosque",
      prompt: "Shah Mosque Isfahan, turquoise tiles, geometric perfection",
    },
    10: {
      name: "Oil Refinery",
      prompt: "massive oil refinery industrial backdrop, Abadan",
    },
    11: {
      name: "Caspian Coast",
      prompt: "lush Caspian Sea coastline backdrop, green shores",
    },
    12: {
      name: "Shiraz Gardens",
      prompt: "Eram Garden Shiraz, Persian paradise garden",
    },
    13: {
      name: "Military Parade",
      prompt: "IRGC military parade backdrop, revolutionary might",
    },
    14: {
      name: "University Campus",
      prompt: "Tehran University campus, academic excellence",
    },
    15: {
      name: "Wrestling Gym",
      prompt: "traditional zurkhane gymnasium, ancient fitness",
    },
    16: {
      name: "Persepolis",
      prompt: "Persepolis ruins backdrop, Achaemenid columns, ancient power",
    },
    17: {
      name: "Nuclear Facility",
      prompt: "underground nuclear facility backdrop, classified",
    },
    18: {
      name: "Azadi Tower",
      prompt: "Azadi Freedom Tower Tehran, national symbol",
    },
    19: {
      name: "Nasir ol-Molk Mosque",
      prompt: "rainbow stained glass Nasir ol-Molk mosque, Shiraz",
    },
    20: {
      name: "Strait of Hormuz",
      prompt: "Strait of Hormuz waters with speedboats, strategic",
    },
    21: {
      name: "Alamut Castle",
      prompt: "Assassin's fortress Alamut, mountain castle, legendary",
    },
    22: {
      name: "Si-o-se-pol Bridge",
      prompt: "historic Si-o-se-pol bridge Isfahan, illuminated at night",
    },
    23: {
      name: "Zagros Mountains",
      prompt: "dramatic Zagros mountain peaks, ancient and massive",
    },
    24: {
      name: "Throne of Persepolis",
      prompt: "Persepolis throne room, golden and lapis, imperial glory",
    },
    25: {
      name: "Zoroastrian Fire Temple",
      prompt: "eternal fire temple, sacred flames, divine backdrop",
    },
    26: {
      name: "Nuclear Dawn",
      prompt: "atomic sunrise over Iranian mountains, nuclear sovereignty",
    },
    27: {
      name: "Persian Empire Map",
      prompt: "glowing map of the Achaemenid Empire at full extent",
    },
    28: {
      name: "Cosmic Geometry",
      prompt: "infinite Islamic geometric patterns expanding into cosmos",
    },
    29: {
      name: "Rumi's Garden",
      prompt: "mystical garden where poetry manifests as reality, divine",
    },
    30: {
      name: "Simurgh's Nest",
      prompt: "mythical Simurgh's mountain nest, legendary creature",
    },
    31: {
      name: "Divine Ascension",
      prompt: "Ahura Mazda's realm of pure light, transcendent divine",
    },
  };

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const IRAN_EVOLUTION_STAGES: Record<
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
    name: "Tolab",
    size: "small puppy hashbeast",
    demeanor: "eager seminary student",
  },
  1: {
    stage: 1,
    name: "Basiji",
    size: "young growing hashbeast",
    demeanor: "zealous volunteer",
  },
  2: {
    stage: 2,
    name: "Sepahi",
    size: "adult hashbeast",
    demeanor: "disciplined guardian",
  },
  3: {
    stage: 3,
    name: "Sardar",
    size: "battle-hardened hashbeast",
    demeanor: "experienced commander",
  },
  4: {
    stage: 4,
    name: "Pasdaran",
    size: "prime adult hashbeast",
    demeanor: "revolutionary elite",
  },
  5: {
    stage: 5,
    name: "Arteshbod",
    size: "large imposing hashbeast",
    demeanor: "supreme general",
  },
  6: {
    stage: 6,
    name: "Pahlevan",
    size: "legendary massive hashbeast",
    demeanor: "legendary champion",
  },
  7: {
    stage: 7,
    name: "Shahanshah",
    size: "transcendent divine wolf",
    demeanor: "King of Kings, ascended",
  },
};

/**
 * Gets the story/lore for an Iran hashbeast based on type
 */
export function getIranStory(typeValue: number): string {
  const typeData = IRAN_TYPE_PROMPTS[typeValue];
  return typeData?.story || IRAN_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS
// =============================================================================

export const IRAN_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const IRAN_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

for (let i = 0; i <= 7; i++) {
  const t = IRAN_TYPE_PROMPTS[i];
  IRAN_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = IRAN_TYPE_PROMPTS[i];
  IRAN_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
