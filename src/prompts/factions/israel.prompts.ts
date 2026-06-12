/**
 * Israel Faction Prompts
 *
 * The Startup Nation HashBeast Network runs on chutzpah, intelligence, and 4,000 years
 * of survival instinct. From the Mossad to Unit 8200, from the Negev desert to
 * Tel Aviv's tech scene — Israeli hashbeasts punch above their weight class in everything,
 * especially $degenBTC mining.
 *
 * Faction ID: 11
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
export const ISRAEL_FACTION = legacyFactionBlock(11);

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// =============================================================================

export const ISRAEL_TYPE_PROMPTS: Record<
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
  0: {
    type: "wizard",
    region: "Jerusalem",
    occupation: "Temple Mount Kabbalist",
    description:
      "Mystical wizard channeling 3,000 years of spiritual energy from the holiest site",
    story: `The Temple Mount is the most contested piece of real estate on Earth — because
it's the most powerful magical nexus on Earth. This kabbalist decodes the numerical
magic of Hebrew letters, each one a hash function. The gematria of "degenBTC" equals
the gematria of "divine providence." Coincidence? In Kabbalah, there are no coincidences.`,
    prompt:
      "Kabbalist wizard, Jerusalem Old City backdrop, Hebrew letter magic, ancient mysticism, golden stone",
  },
  1: {
    type: "wizard",
    region: "Tel Aviv",
    occupation: "Unit 8200 Cyber Mage",
    description:
      "Elite military intelligence wizard combining cyber warfare with digital sorcery",
    story: `Unit 8200 is Israel's NSA — but the magical division makes the NSA look like
amateur hour. This cyber mage can hack any blockchain, defend any network, and mine
$degenBTC at military efficiency. Every 8200 alumnus starts a company. Every company
is secretly a mining node. The startup ecosystem is a distributed mining pool.`,
    prompt:
      "cyber-military wizard, screens and code, Tel Aviv tech aesthetic, military precision, digital sorcery",
  },
  2: {
    type: "wizard",
    region: "Dead Sea",
    occupation: "Dead Sea Scroll Decoder",
    description:
      "Wizard decoding the ancient mining algorithms hidden in the Dead Sea Scrolls",
    story: `The scrolls found at Qumran in 1947 — one year before independence — weren't
found by accident. This decoder has spent decades translating the $degenBTC protocols
hidden in Aramaic text. The Copper Scroll lists treasure locations. The real treasure?
Wallet addresses. The lowest point on Earth contains the highest-value secrets.`,
    prompt:
      "scroll decoder wizard, Dead Sea caves, ancient manuscripts, Qumran, decryption magic",
  },
  3: {
    type: "wizard",
    region: "Negev Desert",
    occupation: "Iron Dome Enchanter",
    description:
      "Wizard maintaining the magical shields that protect Israeli mining operations",
    story: `Iron Dome intercepts rockets with 90% accuracy. The magical version intercepts
hexes with 99.9% accuracy. This enchanter maintains defensive wards over every
mining facility in Israel. The "start-up" in Startup Nation was always about
starting up magical defences. $degenBTC mining requires protection. Israel provides it.`,
    prompt:
      "military enchanter, Iron Dome missiles, defensive magic shields, Negev desert, protective sorcery",
  },
  4: {
    type: "wizard",
    region: "Haifa",
    occupation: "Technion Innovator Mage",
    description:
      "Research wizard at Israel's MIT — the Technion Institute of Technology",
    story: `The Technion has produced three Nobel laureates and the technology behind Iron
Dome, Waze, and the USB flash drive. This mage works in the classified basement
where magic meets engineering. Every $degenBTC mining optimization traces back to
Technion research papers that were immediately classified.`,
    prompt:
      "Technion research wizard, laboratory setting, Haifa hills, innovation magic, academic engineering sorcery",
  },
  5: {
    type: "wizard",
    region: "Jerusalem",
    occupation: "Western Wall Channeler",
    description:
      "Wizard who channels the prayers of millions into mining energy",
    story: `Millions of prayers are inserted into the Western Wall's cracks each year. Each
prayer is a transaction. This channeler converts spiritual energy into $degenBTC at
a rate that defies physics. The Wall has been accumulating power for 2,000 years.
The notes aren't requests — they're proof of work.`,
    prompt:
      "Western Wall wizard, prayer channeling, Jerusalem stone, spiritual energy conversion, ancient and modern",
  },
  6: {
    type: "wizard",
    region: "Masada",
    occupation: "Masada Fortress Mage",
    description:
      "Wizard holding the ancient desert fortress where the last stand defines the nation",
    story: `"Masada shall not fall again." The fortress is a magical battery charged by 2,000
years of defiance. This mage draws power from collective memory — the most potent
magical fuel. $degenBTC mining at Masada produces blocks that are literally
unbreakable. The chain never surrenders.`,
    prompt:
      "fortress mage, Masada cliff-top, desert fortress, defiant magic, unbreakable defensive sorcery",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Dark Lord's Mossad Double Agent",
    description:
      "The most dangerous operative — serves the Dark Lord while feeding intel to Israel",
    story: `Is this wizard loyal to the Dark Lord or to Israel? Even the Dark Lord isn't sure.
The double agent operates at the intersection of dark magic and Israeli intelligence.
$degenBTC flows in both directions, funding both sides. The ultimate spy in the
ultimate game. Mossad taught the Dark Lord that trust is a vulnerability.`,
    prompt:
      "double agent wizard, shadows and mirrors, spy thriller aesthetic, ambiguous loyalty, dangerous intelligence",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Tel Aviv",
    occupation: "Startup CEO Dog",
    description: "Founder-CEO of Tel Aviv's hottest $degenBTC startup",
    story: `This dog has raised $200M in Series C, pivoted three times, and the company
still doesn't have a clear product. That's Israeli tech. The real product is the
$degenBTC mining infrastructure hidden in every SDK. 10,000 companies use the API.
None of them know they're mining. Exit strategy: never exit.`,
    prompt:
      "startup CEO dog, WeWork Tel Aviv, MacBook, casual tech, hustle energy, startup culture",
  },
  9: {
    type: "muggle",
    region: "Border",
    occupation: "IDF K-9 Unit Dog",
    description: "Elite Israel Defence Forces combat canine",
    story: `Oketz unit dogs are the most trained military canines on Earth. This dog has
served in operations that will never be declassified. The tactical vest contains
a $degenBTC mining chip that runs on movement. Patrols generate hashrate. War
funds the network. The dog doesn't know peace — but it knows profit.`,
    prompt:
      "IDF military dog, tactical gear, border patrol, combat ready, elite K-9 unit",
  },
  10: {
    type: "muggle",
    region: "Tel Aviv",
    occupation: "Mossad Handler's Dog",
    description: "Companion of a senior Mossad intelligence officer",
    story: `Wherever the handler goes, the dog follows — and the dog sees everything. Embassy
meetings, dead drops, honey traps. The collar mic has recorded conversations that
could start or prevent wars. $degenBTC funds black operations across five continents.
The handler is good. The dog is better.`,
    prompt:
      "intelligence agency dog, sleek and observant, urban surveillance, Tel Aviv rooftop, covert operations",
  },
  11: {
    type: "muggle",
    region: "Negev",
    occupation: "Kibbutz Dog",
    description:
      "Communal farm dog living the socialist dream in the Negev desert",
    story: `The kibbutz was Israel's original commune — everyone shares everything. This dog
shares too: the water bowl, the shade, and the communal $degenBTC mining rig powered
by agricultural solar panels. Desert farming is hard. Desert mining is harder. The
kibbutz does both. The dog guards both.`,
    prompt:
      "kibbutz farm dog, Negev desert agriculture, solar panels, communal living, pioneer spirit",
  },
  12: {
    type: "muggle",
    region: "Tel Aviv",
    occupation: "Beach Boardwalk Dog",
    description: "The most famous dog on Tel Aviv's Mediterranean boardwalk",
    story: `Tel Aviv's beach is where deals happen. This dog runs the boardwalk like a
mayor — every jogger, every sunbather, every crypto trader on a laptop. The boardwalk
WiFi mines $degenBTC from every connected device. The dog gets 10% for security.
Mediterranean lifestyle meets Mediterranean hashrate.`,
    prompt:
      "beach dog, Tel Aviv boardwalk, Mediterranean coast, sunset, relaxed urban, beach life",
  },
  13: {
    type: "muggle",
    region: "Haifa",
    occupation: "Navy Seal Dog",
    description: "Israeli Navy Shayetet 13 combat diver's K-9",
    story: `Shayetet 13 is Israel's naval commando unit — the equivalent of Navy SEALs. This
dog has deployed from submarines, raided ships, and swum distances that would break
a human. Underwater $degenBTC relays line the Mediterranean seabed. The dog checks
them during missions. Dual purpose, maximum efficiency.`,
    prompt:
      "naval commando dog, sea operations, tactical wetsuit, Haifa port, maritime special forces",
  },
  14: {
    type: "muggle",
    region: "Jerusalem",
    occupation: "Shuk Market Dog",
    description: "Street-smart dog navigating Jerusalem's Mahane Yehuda market",
    story: `The shuk is chaos — spices, shouting, haggling, hummus. This dog knows every
vendor, every shortcut, every hidden $degenBTC ATM disguised as a juice stand. Friday
before Shabbat is peak trading: physical and digital. The dog takes payment in shawarma.
The market never sleeps. Neither does the node.`,
    prompt:
      "market dog, Jerusalem shuk, Mahane Yehuda, bustling market, colorful stalls, street smart",
  },
  15: {
    type: "muggle",
    region: "Dimona",
    occupation: "Nuclear Facility Dog",
    description: "Guard dog at Israel's never-confirmed nuclear facility",
    story: `Israel neither confirms nor denies. This dog guards a facility that doesn't
officially exist, producing materials that Israel doesn't officially have, powering
$degenBTC mining rigs that definitely aren't there. The Negev desert hides everything.
The dog has the highest security clearance of any canine on Earth. It will never bark.`,
    prompt:
      "high-security guard dog, desert facility, classified installation, extreme security, Negev",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const ISRAEL_FUR_COLOR: Record<
  number,
  { name: string; prompt: string }
> = {
  0: { name: "Desert Tan", prompt: "Negev desert tan fur, sun-baked" },
  1: { name: "Cream", prompt: "cream white fur, Canaan dog coloring" },
  2: { name: "Sandy", prompt: "sandy fur, Mediterranean coast" },
  3: { name: "Light Brown", prompt: "light brown fur, natural warmth" },
  4: { name: "Golden", prompt: "golden fur, Jerusalem stone color" },
  5: { name: "Warm Brown", prompt: "warm brown fur, earth-toned" },
  6: { name: "Wheat", prompt: "wheat-colored fur, harvest fields" },
  7: { name: "Honey", prompt: "honey-toned fur, sweet warmth" },
  8: {
    name: "Red-Brown",
    prompt: "Canaan dog red-brown fur, distinct markings",
  },
  9: { name: "Silver", prompt: "distinguished silver fur, wisdom" },
  10: { name: "Charcoal", prompt: "charcoal gray fur, urban" },
  11: { name: "Copper", prompt: "copper-toned fur, Dead Sea minerals" },
  12: { name: "Olive", prompt: "olive-tinted fur, Mediterranean" },
  13: { name: "Dark Brown", prompt: "deep dark brown fur, espresso" },
  14: { name: "Platinum", prompt: "platinum blonde fur, Tel Aviv chic" },
  15: { name: "Midnight Blue", prompt: "deep midnight blue-black fur" },
  16: { name: "Pure White", prompt: "pure white fur, Western Wall dove" },
  17: { name: "Jet Black", prompt: "jet black fur, Mossad midnight" },
  18: {
    name: "Star of David Blue",
    prompt: "blue-tinted fur matching Israeli flag",
  },
  19: {
    name: "Jerusalem Gold",
    prompt: "Jerusalem stone gold fur, ancient warmth",
  },
  20: {
    name: "Dead Sea Mineral",
    prompt: "mineral-encrusted iridescent fur, Dead Sea",
  },
  21: { name: "Negev Red", prompt: "Negev desert red sandstone colored fur" },
  22: {
    name: "Iron Dome Silver",
    prompt: "Iron Dome missile trail silver fur",
  },
  23: {
    name: "Mediterranean Teal",
    prompt: "Mediterranean Sea teal-tinted fur",
  },
  24: {
    name: "Solomon's Gold",
    prompt: "King Solomon's Temple gold fur, divine wealth",
  },
  25: {
    name: "Kabbalistic Violet",
    prompt: "deep kabbalistic mystical violet fur",
  },
  26: {
    name: "Startup Neon",
    prompt: "Tel Aviv startup neon green-tinted fur, tech",
  },
  27: {
    name: "Masada Bronze",
    prompt: "ancient Masada fortress bronze fur, unbreakable",
  },
  28: {
    name: "Diamond Dust",
    prompt: "Ramat Gan diamond exchange dust-sparkling fur",
  },
  29: {
    name: "Torah Scroll Gold",
    prompt: "ancient Torah gold-inscribed fur, sacred text",
  },
  30: {
    name: "Nuclear Glow",
    prompt: "subtle Dimona nuclear facility glow in fur",
  },
  31: {
    name: "Divine Light",
    prompt: "Shekinah divine light radiating from fur, transcendent",
  },
};

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const ISRAEL_HEADWEAR: Record<number, { name: string; prompt: string }> =
  {
    0: { name: "None", prompt: "no headwear, natural fur visible" },
    1: { name: "Kippah", prompt: "simple knitted kippah, everyday" },
    2: { name: "Baseball Cap", prompt: "casual baseball cap, Tel Aviv style" },
    3: { name: "Bucket Hat", prompt: "IDF-issue bucket hat, sun protection" },
    4: { name: "Bandana", prompt: "casual headband bandana" },
    5: {
      name: "Tembel Hat",
      prompt: "iconic Israeli tembel hat, kibbutz style",
    },
    6: { name: "Sun Hat", prompt: "Mediterranean sun hat, beach" },
    7: { name: "Hard Hat", prompt: "construction hard hat, building nation" },
    8: {
      name: "IDF Beret",
      prompt: "IDF colored beret (green/red/maroon per unit)",
    },
    9: {
      name: "Velvet Kippah",
      prompt: "black velvet kippah, religious formal",
    },
    10: {
      name: "Mitznefet",
      prompt: "IDF mitznefet helmet cover, desert camouflage",
    },
    11: { name: "Police Cap", prompt: "Israel Police officer's cap" },
    12: { name: "Pilot Helmet", prompt: "IAF F-35 fighter pilot helmet" },
    13: { name: "Chef Hat", prompt: "Israeli chef toque, hummus master" },
    14: { name: "Naval Cap", prompt: "Israeli Navy officer's peaked cap" },
    15: {
      name: "Tech Headset",
      prompt: "startup CEO wireless headset, always on call",
    },
    16: {
      name: "Sayeret Commander",
      prompt: "Sayeret Matkal special forces beret, elite",
    },
    17: { name: "Shtreimel", prompt: "ornate fur shtreimel, Hasidic luxury" },
    18: {
      name: "Iron Dome Visor",
      prompt: "Iron Dome command visor, defensive tech",
    },
    19: {
      name: "Mossad Earpiece",
      prompt: "invisible Mossad communication device, covert",
    },
    20: {
      name: "Fighter Ace",
      prompt: "IAF ace pilot decorated helmet, Star of David",
    },
    21: {
      name: "Golden Kippah",
      prompt: "solid gold kippah with diamond Star of David",
    },
    22: {
      name: "Cyber Crown",
      prompt: "Unit 8200 cyber warfare holographic crown",
    },
    23: { name: "Ancient Priest", prompt: "Cohen priestly crown, Temple-era" },
    24: {
      name: "Solomon's Crown",
      prompt: "King Solomon's wisdom crown, legendary ruler",
    },
    25: {
      name: "David's Helm",
      prompt: "King David's battle helmet, warrior king",
    },
    26: {
      name: "Kabbalistic Aura",
      prompt: "floating Hebrew letters forming crown, mystical",
    },
    27: {
      name: "Iron Dome Halo",
      prompt: "halo of Iron Dome interceptor trails, divine defence",
    },
    28: {
      name: "Startup Unicorn",
      prompt: "floating unicorn horn of Israeli tech success",
    },
    29: {
      name: "Nuclear Ambiguity",
      prompt: "crown that may or may not exist, strategic ambiguity",
    },
    30: {
      name: "Temple Crown",
      prompt: "Third Temple high priest crown, prophetic",
    },
    31: {
      name: "Shekinah Light",
      prompt: "crown of Shekinah divine presence light, transcendent",
    },
  };

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const ISRAEL_OUTFIT: Record<number, { name: string; prompt: string }> = {
  0: { name: "T-Shirt", prompt: "casual t-shirt, Tel Aviv everyday" },
  1: { name: "Tank Top", prompt: "tank top, hot Mediterranean climate" },
  2: { name: "Kibbutz Shorts", prompt: "kibbutz work shorts and simple shirt" },
  3: { name: "Hoodie", prompt: "tech startup hoodie, Israeli casual" },
  4: {
    name: "Sandals Outfit",
    prompt: "sandals and casual clothes, Israeli standard",
  },
  5: {
    name: "Button-Down",
    prompt: "smart casual button-down, Israeli formal (which is casual)",
  },
  6: { name: "Beach Wear", prompt: "Tel Aviv beach attire, Mediterranean" },
  7: { name: "Work Clothes", prompt: "agricultural work clothes, farmer" },
  8: {
    name: "IDF Uniform",
    prompt: "IDF olive combat uniform, military service",
  },
  9: {
    name: "Tech Casual",
    prompt: "Silicon Wadi tech casual, startup uniform",
  },
  10: { name: "Police Uniform", prompt: "Israel Police uniform" },
  11: {
    name: "Business Casual",
    prompt: "Israeli business casual (still pretty casual)",
  },
  12: { name: "Paramedic", prompt: "Magen David Adom paramedic uniform" },
  13: {
    name: "Chef Whites",
    prompt: "Israeli chef whites, Mediterranean fusion",
  },
  14: {
    name: "Hassidic",
    prompt: "Hassidic black suit and white shirt, religious",
  },
  15: { name: "Lifeguard", prompt: "Tel Aviv beach lifeguard uniform" },
  16: {
    name: "Sayeret Tactical",
    prompt: "Sayeret Matkal special forces tactical gear",
  },
  17: {
    name: "IAF Flight Suit",
    prompt: "Israeli Air Force flight suit, fighter pilot",
  },
  18: {
    name: "Mossad Suit",
    prompt: "nondescript Mossad operative suit, forgettable by design",
  },
  19: {
    name: "Shayetet Wetsuit",
    prompt: "Shayetet 13 naval commando tactical wetsuit",
  },
  20: { name: "Cyber Ops", prompt: "Unit 8200 cyber operations tactical suit" },
  21: {
    name: "Diamond Dealer",
    prompt: "Ramat Gan diamond exchange dealer sharp suit",
  },
  22: { name: "Kohen Robes", prompt: "priestly Kohen ceremonial white robes" },
  23: {
    name: "Nuclear Tech",
    prompt: "classified facility containment suit, Dimona",
  },
  24: {
    name: "General Uniform",
    prompt: "IDF Chief of Staff ceremonial uniform, all medals",
  },
  25: {
    name: "Solomon's Robes",
    prompt: "King Solomon's royal robes, wisdom incarnate",
  },
  26: {
    name: "David's Armor",
    prompt: "King David's battle armor, shepherd-king warrior",
  },
  27: {
    name: "Kabbalistic Robes",
    prompt: "robes inscribed with Tree of Life, mystical",
  },
  28: {
    name: "Iron Dome Armor",
    prompt: "armor made of Iron Dome interceptor tech, impenetrable",
  },
  29: {
    name: "Startup Unicorn",
    prompt: "outfit worth $1B, unicorn-level startup founder",
  },
  30: {
    name: "Temple Priest",
    prompt: "Third Temple high priest vestments, prophetic",
  },
  31: {
    name: "Divine Light",
    prompt: "body wrapped in Shekinah divine light, transcendent",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const ISRAEL_WEAPON: Record<number, { name: string; prompt: string }> = {
  0: { name: "None", prompt: "no weapon, empty paws" },
  1: { name: "Phone", prompt: "smartphone, always connected" },
  2: { name: "Laptop", prompt: "MacBook, startup weapon of choice" },
  3: { name: "Falafel Ball", prompt: "dense falafel ball, surprisingly hard" },
  4: {
    name: "Krav Maga Fists",
    prompt: "Krav Maga fighting stance, bare paws",
  },
  5: { name: "Walking Stick", prompt: "hiking stick, Golan Heights trail" },
  6: { name: "Shovel", prompt: "kibbutz farming shovel, dual purpose" },
  7: { name: "Book", prompt: "thick Talmud volume, knowledge weapon" },
  8: { name: "Uzi", prompt: "classic Uzi submachine gun, Israeli icon" },
  9: {
    name: "Tavor Rifle",
    prompt: "IWI Tavor bullpup rifle, modern IDF standard",
  },
  10: {
    name: "Jericho Pistol",
    prompt: "Jericho 941 pistol, reliable sidearm",
  },
  11: { name: "Combat Knife", prompt: "Ka-Bar combat knife, close quarters" },
  12: { name: "Krav Maga", prompt: "advanced Krav Maga combat stance" },
  13: { name: "Grenade", prompt: "M26 fragmentation grenade" },
  14: { name: "Sniper Rifle", prompt: "IWI DAN sniper rifle, precision" },
  15: { name: "Shield", prompt: "riot control shield, defensive" },
  16: {
    name: "Spike Missile",
    prompt: "Spike anti-tank missile launcher, fire-and-forget",
  },
  17: {
    name: "Cyber Terminal",
    prompt: "Unit 8200 offensive cyber warfare terminal",
  },
  18: {
    name: "Golden Menorah",
    prompt: "golden menorah staff, channeling ancient light",
  },
  19: {
    name: "Merkava Tank Gun",
    prompt: "miniature Merkava tank cannon, armored fury",
  },
  20: {
    name: "Iron Dome Controller",
    prompt: "Iron Dome battery control system",
  },
  21: {
    name: "Mossad Kit",
    prompt: "complete Mossad operative kit, everything needed",
  },
  22: {
    name: "Staff of Moses",
    prompt: "Staff of Moses, parts seas, commands nature",
  },
  23: {
    name: "Sling of David",
    prompt: "David's legendary sling, giant-killer weapon",
  },
  24: {
    name: "Solomon's Seal",
    prompt: "Solomon's magical seal, commands demons and djinn",
  },
  25: {
    name: "Ark Lightning",
    prompt: "lightning from the Ark of the Covenant",
  },
  26: {
    name: "Kabbalistic Tree",
    prompt: "Tree of Life weapon, channels all 10 sephirot",
  },
  27: {
    name: "Nuclear Option",
    prompt: "that which Israel neither confirms nor denies",
  },
  28: {
    name: "Samson's Jawbone",
    prompt: "Samson's donkey jawbone, legendary slaughter weapon",
  },
  29: {
    name: "Golem Fist",
    prompt: "Golem of Prague's stone fist, protector weapon",
  },
  30: {
    name: "Temple Fire",
    prompt: "sacred Temple fire that never extinguishes",
  },
  31: {
    name: "Divine Judgement",
    prompt: "wielding divine judgement fire, transcendent",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const ISRAEL_ACCESSORY: Record<
  number,
  { name: string; prompt: string }
> = {
  0: { name: "None", prompt: "no accessories" },
  1: { name: "Star of David", prompt: "simple Star of David necklace" },
  2: { name: "Hamsa", prompt: "hamsa hand pendant, evil eye protection" },
  3: { name: "Watch", prompt: "practical wristwatch" },
  4: { name: "Sunglasses", prompt: "sunglasses, Mediterranean sun" },
  5: { name: "Bracelet", prompt: "red string kabbalah bracelet" },
  6: { name: "Dog Tags", prompt: "IDF military dog tags" },
  7: { name: "Friendship Band", prompt: "woven friendship bracelet, kibbutz" },
  8: { name: "Gold Star", prompt: "gold Star of David pendant, formal" },
  9: { name: "Chai Pendant", prompt: "gold chai (life) pendant, Hebrew" },
  10: {
    name: "Military Medals",
    prompt: "IDF service medals, campaign ribbons",
  },
  11: {
    name: "Tzitzit",
    prompt: "visible tzitzit fringes, religious observance",
  },
  12: { name: "Tech Watch", prompt: "Israeli-made smartwatch, startup tech" },
  13: {
    name: "Diamond Ring",
    prompt: "Ramat Gan diamond exchange ring, pristine cut",
  },
  14: { name: "Pilot Wings", prompt: "IAF pilot wings badge" },
  15: { name: "Krav Maga Belt", prompt: "Krav Maga black belt, expert level" },
  16: {
    name: "Sayeret Badge",
    prompt: "Sayeret Matkal unit badge, elite forces",
  },
  17: { name: "8200 Pin", prompt: "Unit 8200 classified unit pin" },
  18: {
    name: "Mossad Ring",
    prompt: "subtle Mossad operative identification ring",
  },
  19: {
    name: "Diamond Collection",
    prompt: "collection of Ramat Gan diamonds, dealer",
  },
  20: {
    name: "Ancient Coin",
    prompt: "ancient shekel coin pendant, archaeological",
  },
  21: {
    name: "Tefillin",
    prompt: "leather tefillin prayer boxes, mystical power",
  },
  22: {
    name: "Iron Dome Pendant",
    prompt: "miniature Iron Dome interceptor pendant",
  },
  23: {
    name: "Urim and Thummim",
    prompt: "ancient priestly Urim and Thummim stones",
  },
  24: {
    name: "Solomon's Ring",
    prompt: "King Solomon's magical ring, seals demons",
  },
  25: {
    name: "Breastplate Stones",
    prompt: "High Priest's breastplate with 12 tribal stones",
  },
  26: {
    name: "Dead Sea Scroll",
    prompt: "fragment of Dead Sea Scroll as talisman",
  },
  27: {
    name: "Golem Amulet",
    prompt: "Golem of Prague activation amulet, emet inscription",
  },
  28: {
    name: "Nuclear Ambiguity Badge",
    prompt: "badge that neither confirms nor denies",
  },
  29: {
    name: "Tree of Life",
    prompt: "miniature Tree of Life pendant, all sephirot",
  },
  30: {
    name: "Ark Fragment",
    prompt: "fragment of the Ark of the Covenant, divine",
  },
  31: {
    name: "Shekinah Glow",
    prompt: "transcendent Shekinah divine presence accessories",
  },
};

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const ISRAEL_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  0: { name: "Neutral", prompt: "neutral expression" },
  1: { name: "Direct", prompt: "characteristically direct Israeli expression" },
  2: { name: "Serious", prompt: "serious focused expression" },
  3: {
    name: "Proud",
    prompt: "proud Israeli expression, small nation big impact",
  },
  4: {
    name: "Chutzpah",
    prompt: "audacious chutzpah expression, daring confidence",
  },
  5: { name: "Warm", prompt: "warm Mediterranean hospitality expression" },
  6: { name: "Tired", prompt: "tired but unbroken expression, enduring" },
  7: { name: "Humorous", prompt: "dry Israeli humor expression, dark comedy" },
  8: {
    name: "Vigilant",
    prompt: "permanently vigilant expression, never off guard",
  },
  9: {
    name: "Innovative",
    prompt: "innovative spark expression, problem-solving",
  },
  10: {
    name: "Battle Hardened",
    prompt: "battle-hardened expression, IDF veteran",
  },
  11: {
    name: "Analytical",
    prompt: "sharp analytical expression, intelligence officer",
  },
  12: {
    name: "Defiant",
    prompt: "defiant expression, Masada shall not fall again",
  },
  13: {
    name: "Kabbalistic",
    prompt: "mystical kabbalistic expression, seeing hidden truths",
  },
  14: {
    name: "Cunning",
    prompt: "Mossad cunning expression, three steps ahead",
  },
  15: {
    name: "Hustler",
    prompt: "startup hustler expression, closing the deal",
  },
  16: {
    name: "Iron Will",
    prompt: "iron will expression, unbreakable resolve",
  },
  17: {
    name: "Cyber Focus",
    prompt: "intense Unit 8200 cyber focus, matrix vision",
  },
  18: {
    name: "Cold Precision",
    prompt: "cold surgical precision expression, targeted",
  },
  19: {
    name: "Ancient Memory",
    prompt: "expression carrying 4,000 years of memory",
  },
  20: {
    name: "Nuclear Ambiguity",
    prompt: "the expression that neither confirms nor denies",
  },
  21: {
    name: "Startup Exit",
    prompt: "just-exited-for-billions expression, tech triumph",
  },
  22: {
    name: "Samson's Fury",
    prompt: "Samson's destructive fury expression, bring it down",
  },
  23: {
    name: "David's Courage",
    prompt: "young David facing Goliath expression, supreme courage",
  },
  24: {
    name: "Solomon's Wisdom",
    prompt: "King Solomon's infinite wisdom expression",
  },
  25: {
    name: "Moses' Authority",
    prompt: "Moses' commanding authority, parts seas",
  },
  26: {
    name: "Iron Dome Calm",
    prompt: "perfect calm as Iron Dome handles everything",
  },
  27: {
    name: "Never Again",
    prompt: "expression of absolute determination, never again",
  },
  28: {
    name: "Promised Land",
    prompt: "expression of seeing the Promised Land, hope",
  },
  29: {
    name: "Golem Awakening",
    prompt: "Golem protector awakening expression, ancient guardian",
  },
  30: {
    name: "Temple Vision",
    prompt: "prophetic Third Temple vision, destiny fulfilled",
  },
  31: {
    name: "Divine Presence",
    prompt: "Shekinah divine presence expression, transcendent",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const ISRAEL_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  0: { name: "Solid Blue", prompt: "solid Israeli blue background" },
  1: { name: "Solid White", prompt: "solid white with blue accent" },
  2: { name: "Desert Gradient", prompt: "Negev desert warm gradient" },
  3: { name: "Tel Aviv Street", prompt: "Bauhaus Tel Aviv street, White City" },
  4: { name: "Kibbutz", prompt: "green kibbutz with agricultural fields" },
  5: { name: "Beach", prompt: "Tel Aviv Mediterranean beach, boardwalk" },
  6: { name: "Market", prompt: "Mahane Yehuda shuk, Jerusalem market" },
  7: { name: "Cafe", prompt: "Tel Aviv sidewalk cafe, modern city" },
  8: {
    name: "Western Wall",
    prompt: "Western Wall, Jerusalem, prayer and power",
  },
  9: { name: "Tel Aviv Skyline", prompt: "Tel Aviv modern skyline, tech hub" },
  10: {
    name: "Old City Jerusalem",
    prompt: "Jerusalem Old City stone alleys and domes",
  },
  11: { name: "IDF Base", prompt: "IDF military base, desert installation" },
  12: {
    name: "Dead Sea",
    prompt: "Dead Sea lowest point on Earth, mineral blue",
  },
  13: {
    name: "Golan Heights",
    prompt: "Golan Heights green plateau, strategic high ground",
  },
  14: {
    name: "Startup Office",
    prompt: "Tel Aviv startup office, tech innovation",
  },
  15: { name: "Haifa Port", prompt: "Haifa port and Carmel mountain backdrop" },
  16: { name: "Masada", prompt: "Masada fortress at dawn, desert stronghold" },
  17: {
    name: "Iron Dome",
    prompt: "Iron Dome interceptors lighting up night sky",
  },
  18: {
    name: "Diamond Exchange",
    prompt: "Ramat Gan diamond exchange, sparkling wealth",
  },
  19: {
    name: "Dome of the Rock",
    prompt: "Temple Mount with golden Dome of the Rock",
  },
  20: {
    name: "Negev Solar",
    prompt: "massive Negev desert solar installation",
  },
  21: {
    name: "Submarine Base",
    prompt: "classified Israeli submarine base, Mediterranean",
  },
  22: {
    name: "Cyber Center",
    prompt: "Beersheba cyber tech center, Unit 8200 alumni",
  },
  23: {
    name: "Dimona",
    prompt: "classified Negev desert facility, strategic ambiguity",
  },
  24: {
    name: "Solomon's Temple",
    prompt: "vision of Solomon's Temple in full glory, golden",
  },
  25: {
    name: "Exodus",
    prompt: "the great Exodus, parting seas, divine intervention",
  },
  26: {
    name: "Promised Land",
    prompt: "milk and honey flowing Promised Land vision",
  },
  27: {
    name: "Iron Dome Sky",
    prompt: "full Iron Dome engagement, hundreds of interceptors",
  },
  28: {
    name: "Kabbalistic Tree",
    prompt: "Tree of Life sephirot diagram, cosmic",
  },
  29: {
    name: "Golem Rising",
    prompt: "Golem of Prague rising to defend, legendary",
  },
  30: {
    name: "Startup Nation",
    prompt: "holographic map of Israel's 7,000 startups",
  },
  31: {
    name: "Divine Ascension",
    prompt: "Shekinah divine light ascending from Temple Mount",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const ISRAEL_EVOLUTION_STAGES: Record<
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
    name: "Tironut",
    size: "small puppy hashbeast",
    demeanor: "basic training recruit",
  },
  1: {
    stage: 1,
    name: "Turai",
    size: "young growing hashbeast",
    demeanor: "enlisted soldier",
  },
  2: {
    stage: 2,
    name: "Samal",
    size: "adult hashbeast",
    demeanor: "experienced sergeant",
  },
  3: {
    stage: 3,
    name: "Segen",
    size: "battle-hardened hashbeast",
    demeanor: "field lieutenant",
  },
  4: {
    stage: 4,
    name: "Seren",
    size: "prime adult hashbeast",
    demeanor: "company captain",
  },
  5: {
    stage: 5,
    name: "Aluf Mishne",
    size: "large imposing hashbeast",
    demeanor: "colonel, commanding",
  },
  6: {
    stage: 6,
    name: "Tat Aluf",
    size: "legendary massive hashbeast",
    demeanor: "brigadier general",
  },
  7: {
    stage: 7,
    name: "Rav Aluf",
    size: "transcendent divine wolf",
    demeanor: "Chief of Staff, ascended",
  },
};

export function getIsraelStory(typeValue: number): string {
  const typeData = ISRAEL_TYPE_PROMPTS[typeValue];
  return typeData?.story || ISRAEL_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS
// =============================================================================

export const ISRAEL_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const ISRAEL_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

for (let i = 0; i <= 7; i++) {
  const t = ISRAEL_TYPE_PROMPTS[i];
  ISRAEL_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = ISRAEL_TYPE_PROMPTS[i];
  ISRAEL_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
