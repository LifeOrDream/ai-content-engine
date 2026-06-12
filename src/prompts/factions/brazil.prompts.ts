/**
 * Brazil Faction Prompts
 *
 * The Brazilian HashBeast Network pulses with the rhythm of the largest nation in South America.
 * From Carnaval to the Amazon, from favelas to financial centers,
 * Brazilian hashbeasts have mastered the art of chaos, celebration, and survival.
 *
 * Faction ID: 10
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
export const BRAZIL_FACTION = legacyFactionBlock(10);

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// Each type combines a specific region + occupation
// =============================================================================

export const BRAZIL_TYPE_PROMPTS: Record<
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
    region: "Amazon",
    occupation: "Castelobruxo Scholar",
    description:
      "Student at Brazil's hidden magical school in the Amazon rainforest",
    story: `Studies at Castelobruxo, the magical school hidden deep in the Amazon where
Caipora spirits guard the grounds. Brazilian magical education emphasizes "jeitinho
magico" - creative magical problem-solving. When this scholar discovered that Amazon
river systems could conduct $degenBTC at incredible speeds, they revolutionized South
American network infrastructure.`,
    prompt:
      "Castelobruxo wizard robes, Amazon jungle backdrop, indigenous magical patterns, Caipora spirit companion",
  },
  1: {
    type: "wizard",
    region: "Salvador",
    occupation: "Candomble Priest",
    description: "Pai or Mae de Santo channeling orixa magic for the network",
    story: `Channels the orixas - the powerful Afro-Brazilian deities who recognized
$degenBTC's potential before any human. Every terreiro (temple) is now a network node.
Every ceremony generates hash power through collective spiritual energy. Ogum blesses
the miners. Oxum provides wealth energy. Exu opens the digital crossroads.`,
    prompt:
      "Candomble ceremonial whites, sacred beads, terreiro temple backdrop, orixa energy visible",
  },
  2: {
    type: "wizard",
    region: "Amazon",
    occupation: "Rainforest Guardian",
    description:
      "Protector of the Amazon's magical ecosystems and ley line nexuses",
    story: `Guards the convergence point where every South American ley line meets.
Deforestation isn't just environmental destruction - it's magical infrastructure
sabotage. Now the rainforest mines $degenBTC through photosynthesis-powered conversion.
Every tree that survives is a node. Every tree lost is network damage.`,
    prompt:
      "jungle guardian robes, living vines wrapped around, rainforest canopy, jaguar spirit companion",
  },
  3: {
    type: "wizard",
    region: "Rio de Janeiro",
    occupation: "Carnaval Enchanter",
    description: "Creates magically-enhanced Carnaval floats and costumes",
    story: `Every parade float is enchanted. The elaborate costumes contain embedded
spells. When millions watch Carnaval on TV, they receive network programming through
pure joy transmission. This year's samba school theme: "O Sonho Digital." The
spectators think it's about technology. It's about $degenBTC initiation.`,
    prompt:
      "samba wizard attire, sequins and magical feathers, parade float energy, Carnaval glamour",
  },
  4: {
    type: "wizard",
    region: "Rio de Janeiro",
    occupation: "Favela Street Mage",
    description:
      "Self-taught wizard from Rio's favelas, survival magic specialist",
    story: `Never attended magical school - in the favela, you learn or you die. Street
magic: protection spells that actually protect, invisibility that actually works.
When the network offered training, this mage refused: "Streets teach truth." Their
$degenBTC distribution system uses favela logistics - informal, untraceable, community-based.`,
    prompt:
      "favela street style with magical elements, colorful hillside backdrop, community protection aura",
  },
  5: {
    type: "wizard",
    region: "Amazon",
    occupation: "Boto Encantado Shapeshifter",
    description:
      "Amazon river spirit who can transform between hashbeast and human forms",
    story: `The legendary boto - pink river dolphin spirits who transform into handsome
strangers at riverside parties. This ancient power now serves the Mining Wars, allowing
infiltration of any human gathering. At every party, someone whispers about $degenBTC.
That someone is usually a boto in disguise.`,
    prompt:
      "shapeshifter mystique, pink iridescent accents, river spirit energy, Amazon waters backdrop",
  },
  6: {
    type: "wizard",
    region: "Minas Gerais",
    occupation: "Colonial Gold Alchemist",
    description:
      "Descended from colonial-era magical gold seekers of Ouro Preto",
    story: `Family has sought magical gold since the 1700s. Generations of alchemists
who understood that value can be transmuted. When $degenBTC appeared, this alchemist
recognized the ultimate transmutation: digital scarcity into tangible wealth. The
baroque churches of Ouro Preto now hide network server rooms.`,
    prompt:
      "baroque alchemist robes, gold transmutation symbols, Ouro Preto colonial backdrop, mystical wealth aura",
  },
  7: {
    type: "wizard",
    region: "Amazon",
    occupation: "Supreme Amazon Oracle",
    description:
      "Highest magical authority, speaks for the rainforest consciousness itself",
    story: `The Amazon rainforest has achieved consciousness - and it speaks through
this oracle. Twenty percent of Earth's oxygen. The planet's lungs. When such power
declares for $degenBTC, the Mining Wars' outcome becomes clearer. This oracle's
pronouncements move markets. The forest has spoken.`,
    prompt:
      "supreme oracle robes, all jungle spirits represented, ancient tree throne, divine rainforest authority",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "Brasilia",
    occupation: "Planalto Palace Dog",
    description: "Presidential companion in Brasilia's seat of power",
    story: `Whatever human president cycles through, this dog ensures network interests
are maintained. That infrastructure bill favoring crypto mining? This dog's suggestion.
That regulation with convenient loopholes? Drafted during evening walks. Brazilian
politics is famously chaotic. Network priorities remain constant.`,
    prompt:
      "presidential elegance, Planalto Palace backdrop, Niemeyer architecture, political power aesthetic",
  },
  9: {
    type: "muggle",
    region: "Sao Paulo",
    occupation: "Football Legend's Pet",
    description: "Companion to Brazil's greatest futebol star",
    story: `Belongs to the current Brazilian football messiah. When this dog appears in
post-match celebrations, 200 million Brazilians see. The subtle $degenBTC paw symbol
on the collar? Noticed by none consciously, imprinted on all. When Brazil wins the
World Cup again, the celebration energy powers months of mining.`,
    prompt:
      "football champion glory, stadium backdrop, Selecao yellow-green, victory celebration energy",
  },
  10: {
    type: "muggle",
    region: "Rio de Janeiro",
    occupation: "Samba School Mascot",
    description: "Official mascot of Rio's champion samba school",
    story: `For eleven months, the community prepares. For one glorious week, they parade.
This mascot ensures preparation serves two purposes: Carnaval glory and network
advancement. The elaborate allegories? Network mythology. Every samba school is a
network chapter. Every Carnaval is an annual conference.`,
    prompt:
      "samba school colors, Carnaval parade energy, Sambodromo backdrop, community pride",
  },
  11: {
    type: "muggle",
    region: "Rio de Janeiro",
    occupation: "Copacabana Beach Dog",
    description:
      "Famous friendly dog on Rio's iconic beach, intelligence operative",
    story: `Has roamed Copacabana for fifteen years, known and loved by everyone. No one
suspects the friendly beach dog is intelligence operative. Every tourist photographed
is profiled. Every celebrity observed is assessed. The beach is Rio's living room.
This dog knows every secret it contains.`,
    prompt:
      "beach casual, Copacabana sand, ocean waves, sunset vibes, friendly approachable",
  },
  12: {
    type: "muggle",
    region: "Rio de Janeiro",
    occupation: "Favela Community Dog",
    description:
      "Beloved neighborhood dog coordinating community $degenBTC distribution",
    story: `In the favela, this dog is family to everyone. Also coordinates $degenBTC
distribution through informal networks that no bank could penetrate. The community
trusts this dog completely. That trust enables financial inclusion that formal
systems could never achieve. Revolution through cuteness.`,
    prompt:
      "favela hillside backdrop, colorful houses, community beloved, street smart",
  },
  13: {
    type: "muggle",
    region: "Sao Paulo",
    occupation: "Tech Startup Founder's Dog",
    description: "Companion of Sao Paulo's hottest tech entrepreneur",
    story: `Lives with Brazil's most successful tech founder. Every product launch
includes subtle $degenBTC integration. The company's AI actually serves faction
interests. The founder thinks they're in charge. The dog knows better. Vila
Madalena's startup scene belongs to the network.`,
    prompt:
      "tech casual, Avenida Paulista skyline, startup culture, innovation aesthetic",
  },
  14: {
    type: "muggle",
    region: "South",
    occupation: "Gaucho Ranch Dog",
    description: "Working dog on vast southern Brazilian cattle operation",
    story: `The estancia spans 50,000 hectares - with plenty of space for mining
infrastructure disguised as agricultural equipment. Gaucho traditions of independence
align perfectly with $degenBTC philosophy. The chimarrao circles spread network
philosophy. The pampas serve the cause.`,
    prompt:
      "gaucho working dog, pampa grasslands, chimarrao culture, southern pride",
  },
  15: {
    type: "muggle",
    region: "National",
    occupation: "Supreme Caramelo Commander",
    description:
      "The legendary vira-lata mutt who coordinates all Brazilian operations",
    story: `The famous caramelo - Brazil's beloved stray dog elevated to national
symbol. What the public doesn't know: this specific caramelo coordinates the entire
Brazilian $degenBTC network. Every stray dog is a potential operative. Every corner
has coverage. Brazil's most extensive surveillance network disguised as adorable strays.`,
    prompt:
      "legendary caramelo presence, supreme command, all of Brazil as backdrop, divine mutt authority",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const BRAZIL_FUR_COLOR: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7) - Genesis accessible
  0: {
    name: "Caramelo Classic",
    prompt: "classic caramelo tan fur, beloved Brazilian stray coloring",
  },
  1: {
    name: "Vira-Lata Brown",
    prompt: "mixed brown fur, authentic vira-lata mutt coloring",
  },
  2: { name: "Beach Sand", prompt: "sandy beige fur, Copacabana beach tones" },
  3: {
    name: "Favela Gold",
    prompt: "golden tan fur, sun-kissed favela warmth",
  },
  4: {
    name: "Cream White",
    prompt: "cream white fur, light tropical coloring",
  },
  5: { name: "Coffee Brown", prompt: "rich coffee brown fur, cafezinho tones" },
  6: {
    name: "Guarana Gold",
    prompt: "bright golden fur, guarana energy coloring",
  },
  7: {
    name: "Terra Cotta",
    prompt: "reddish-brown terra cotta fur, Brazilian earth tones",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Amazon Green Tint",
    prompt: "fur with subtle green jungle tint, rainforest influence",
  },
  9: {
    name: "Rio Sunset",
    prompt: "orange-pink tinted fur, Ipanema sunset colors",
  },
  10: {
    name: "Acai Purple",
    prompt: "fur with deep purple tint, Amazon acai influence",
  },
  11: {
    name: "Ouro Preto Gold",
    prompt: "rich gold-tinted fur, colonial treasure aesthetic",
  },
  12: {
    name: "Jaguar Spots",
    prompt: "tan fur with subtle jaguar spot pattern, jungle predator",
  },
  13: {
    name: "Carnival Multi",
    prompt: "fur with subtle multi-colored shimmer, Carnaval spirit",
  },
  14: {
    name: "Sertao Rust",
    prompt: "dusty rust-colored fur, northeastern drought survivor",
  },
  15: {
    name: "Pantanal Marsh",
    prompt: "dark wetland brown fur, swamp survivor coloring",
  },

  // RARE (16-23)
  16: {
    name: "Boto Pink",
    prompt: "rare pink-tinted fur, Amazon river dolphin spirit, magical",
  },
  17: {
    name: "Orixa White",
    prompt: "pure ritual white fur, Candomble sacred, spiritual purity",
  },
  18: {
    name: "Selecao Yellow",
    prompt: "vibrant yellow fur, Brazilian football glory",
  },
  19: {
    name: "Forest Spirit Green",
    prompt: "emerald green fur, Curupira forest magic",
  },
  20: {
    name: "Bahia Ocean Blue",
    prompt: "deep blue-tinted fur, Salvador sea spirit",
  },
  21: {
    name: "Imperial Purple",
    prompt: "royal purple fur, Dom Pedro II legacy",
  },
  22: {
    name: "Carnaval Glitter",
    prompt: "fur with embedded sparkles, permanent parade glamour",
  },
  23: {
    name: "Amazon Iridescent",
    prompt: "fur shifting colors like morpho butterfly wings",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Iemanja Pearl",
    prompt: "pearlescent ocean-white fur, sea goddess blessing, waves visible",
  },
  25: {
    name: "Supreme Carnaval",
    prompt: "fur of pure golden sequins and feathers, champion school glory",
  },
  26: {
    name: "Rainforest Divine",
    prompt: "fur containing all jungle colors, living ecosystem, divine nature",
  },
  27: {
    name: "Pentacampeao Gold",
    prompt: "five-star golden fur, World Cup champion radiance",
  },
  28: {
    name: "All Orixa Blessed",
    prompt:
      "fur shifting through all orixa colors, complete spiritual protection",
  },
  29: {
    name: "Emperor's Emerald",
    prompt: "imperial green-gold fur, Brazilian empire divine, crown jewel",
  },
  30: {
    name: "Encantado Shift",
    prompt: "constantly shifting shapeshifter fur, boto transformation power",
  },
  31: {
    name: "Divine Caramelo",
    prompt:
      "transcendent golden-light fur, supreme vira-lata ascended, legendary mutt divine",
  },
};

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const BRAZIL_HEADWEAR: Record<number, { name: string; prompt: string }> =
  {
    // COMMON (0-7)
    0: { name: "None", prompt: "no headwear, natural fur visible" },
    1: {
      name: "Straw Beach Hat",
      prompt: "simple straw beach hat, tourist casual",
    },
    2: {
      name: "Favela Cap",
      prompt: "basic snapback cap, favela street style",
    },
    3: { name: "Bandana", prompt: "colorful bandana wrap, capoeira style" },
    4: {
      name: "Soccer Headband",
      prompt: "simple athletic headband, futebol player",
    },
    5: { name: "Beach Visor", prompt: "sun visor, beach protection casual" },
    6: { name: "Fisherman Hat", prompt: "simple bucket hat, Amazonian fisher" },
    7: {
      name: "Cangaceiro Leather",
      prompt: "basic leather hat, sertao cowboy style",
    },

    // UNCOMMON (8-15)
    8: {
      name: "Samba School Beret",
      prompt: "colored beret with school emblem, parade ready",
    },
    9: {
      name: "Capoeira Bandana",
      prompt: "martial arts headwrap, ginga energy",
    },
    10: {
      name: "Afro Pick Crown",
      prompt: "afro with decorative pick, Black pride style",
    },
    11: {
      name: "Gaucho Beret",
      prompt: "traditional chimarrao beret, southern pride",
    },
    12: {
      name: "Bahiana Head Wrap",
      prompt: "traditional Bahian turban, Candomble style",
    },
    13: {
      name: "Carnaval Basic Headpiece",
      prompt: "small feathered headband, parade basic",
    },
    14: {
      name: "Football Champion Band",
      prompt: "champion headband with star, futebol glory",
    },
    15: {
      name: "Amazon Explorer Hat",
      prompt: "jungle explorer pith helmet, adventure ready",
    },

    // RARE (16-23)
    16: {
      name: "Orixa Crown",
      prompt: "sacred Candomble crown, spiritual authority, golden beads",
    },
    17: {
      name: "Carnaval Grande Headpiece",
      prompt: "elaborate feathered headdress, samba school pride",
    },
    18: {
      name: "Mestre Capoeira Bandana",
      prompt: "master's ceremonial wrap, red cord level",
    },
    19: {
      name: "Emperor's Tropical Crown",
      prompt: "Dom Pedro style crown, Brazilian empire echo",
    },
    20: {
      name: "Amazon Shaman Headdress",
      prompt: "indigenous feather headdress, spirit guide power",
    },
    21: {
      name: "Cristo Redentor Halo",
      prompt: "divine halo ring, Cristo inspiration",
    },
    22: {
      name: "Carnaval Queen Tiara",
      prompt: "sparkling queen tiara, passista crown",
    },
    23: {
      name: "Mining Baron Top Hat",
      prompt: "colonial era top hat, gold rush opulence",
    },

    // LEGENDARY (24-31)
    24: {
      name: "Iemanja Ocean Crown",
      prompt: "ocean goddess crown, waves and pearls, sea foam divine",
    },
    25: {
      name: "Supreme Carnaval Crown",
      prompt:
        "massive golden feathered crown, champion samba school, parade ultimate",
    },
    26: {
      name: "Amazon Spirit Headdress",
      prompt: "legendary jungle spirit crown, all creatures represented",
    },
    27: {
      name: "Golden Football Crown",
      prompt: "World Cup winner crown, Pentacampeao legend, golden ball divine",
    },
    28: {
      name: "Oxala Divine Crown",
      prompt: "supreme orixa crown, pure white and gold, highest blessing",
    },
    29: {
      name: "Emperor of Brazil Crown",
      prompt: "imperial Brazilian crown, Pedro II magnificence",
    },
    30: {
      name: "Boto Encantado Crown",
      prompt:
        "river dolphin spirit crown, pink iridescent, shapeshifter divine",
    },
    31: {
      name: "degenBTC Carnaval Supreme",
      prompt:
        "ultimate crown with $degenBTC symbol, green gold feathers, crypto royalty",
    },
  };

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const BRAZIL_OUTFIT: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "Beach Shorts", prompt: "basic swim trunks, Copacabana casual" },
  1: {
    name: "Favela Street Clothes",
    prompt: "simple t-shirt and shorts, favela daily wear",
  },
  2: {
    name: "Football Jersey Basic",
    prompt: "basic yellow jersey, Selecao fan",
  },
  3: {
    name: "Capoeira Whites",
    prompt: "simple white capoeira pants, martial arts basic",
  },
  4: {
    name: "Farmer Work Clothes",
    prompt: "rural work shirt and pants, agricultural simple",
  },
  5: {
    name: "Fisherman Outfit",
    prompt: "simple fishing clothes, river worker casual",
  },
  6: {
    name: "Street Vendor Apron",
    prompt: "vendor apron over casual clothes, market worker",
  },
  7: {
    name: "Havaianas Tank Top",
    prompt: "tank top and havaianas, ultimate Brazilian casual",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Samba School Costume",
    prompt: "colored samba school outfit, parade participant ready",
  },
  9: {
    name: "Capoeira Abada",
    prompt: "proper capoeira uniform, berimbau cord rank visible",
  },
  10: {
    name: "Bahiana Dress",
    prompt: "traditional Bahian white dress, African-Brazilian beauty",
  },
  11: {
    name: "Gaucho Bombachas",
    prompt: "traditional gaucho pants and boots, southern pride",
  },
  12: {
    name: "Business Casual SP",
    prompt: "Paulistano business casual, startup founder style",
  },
  13: {
    name: "Forro Outfit",
    prompt: "northeastern party clothes, accordion player style",
  },
  14: {
    name: "Carnival Worker Jumpsuit",
    prompt: "float builder coveralls, behind-scenes pride",
  },
  15: {
    name: "Lifeguard Uniform",
    prompt: "red lifeguard shorts and whistle, beach authority",
  },

  // RARE (16-23)
  16: {
    name: "Candomble Ceremonial",
    prompt: "pure white ceremonial robes, orixa devotee, sacred dress",
  },
  17: {
    name: "Carnaval Passista",
    prompt: "elaborate samba dancer costume, sequins and feathers",
  },
  18: {
    name: "Mestre Capoeira Robes",
    prompt: "capoeira master ceremonial outfit, all cords earned",
  },
  19: {
    name: "Football Legend Gear",
    prompt: "iconic number 10 jersey, champion shorts, futebol royalty",
  },
  20: {
    name: "Amazon Tribal Regalia",
    prompt: "indigenous ceremonial dress, face paint, forest spirit",
  },
  21: {
    name: "Colonial Baroque Suit",
    prompt: "Ouro Preto era formal wear, gold thread embroidery",
  },
  22: {
    name: "Bossa Nova Sharp Suit",
    prompt: "1960s Rio sophistication, cool jazz elegance",
  },
  23: {
    name: "Championship Selecao Kit",
    prompt: "World Cup winner's complete kit, five stars glory",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Iemanja Ocean Robes",
    prompt: "ocean goddess flowing robes, sea foam white and blue, divine",
  },
  25: {
    name: "Supreme Carnaval Queen",
    prompt: "ultimate parade queen outfit, thousands of feathers, solid gold",
  },
  26: {
    name: "Rainforest Spirit Form",
    prompt: "legendary jungle guardian robes, living vines, all spirits merged",
  },
  27: {
    name: "Pentacampeao Golden Armor",
    prompt: "five-time champion golden football armor, eternal glory",
  },
  28: {
    name: "Oxala Supreme Vestments",
    prompt: "highest orixa ceremonial robes, pure white divine",
  },
  29: {
    name: "Emperor Pedro II Regalia",
    prompt: "full imperial Brazilian robes, tropical empire magnificence",
  },
  30: {
    name: "Boto Transformation Suit",
    prompt: "shapeshifter river spirit outfit, pink iridescent scales",
  },
  31: {
    name: "degenBTC Carnaval Champion",
    prompt:
      "ultimate Mining Wars costume, green-gold $degenBTC armor, samba crypto",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const BRAZIL_WEAPON: Record<number, { name: string; prompt: string }> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no weapon, open hands" },
  1: { name: "Beach Ball", prompt: "simple beach ball, casual play" },
  2: { name: "Football", prompt: "basic futebol, street game ready" },
  3: { name: "Wooden Staff", prompt: "simple walking stick, rural utility" },
  4: { name: "Fishing Net", prompt: "basic fishing net, river worker tool" },
  5: { name: "Machete Basic", prompt: "simple machete, agricultural tool" },
  6: { name: "Pandeiro Basic", prompt: "simple tambourine, samba rhythm" },
  7: { name: "Slingshot", prompt: "homemade slingshot, favela toy" },

  // UNCOMMON (8-15)
  8: { name: "Berimbau", prompt: "capoeira musical bow, ginga rhythm weapon" },
  9: {
    name: "Capoeira Stick",
    prompt: "meia lua practice staff, martial training",
  },
  10: {
    name: "Carnaval Flag",
    prompt: "samba school flag, porta-bandeira style",
  },
  11: {
    name: "Gaucho Boleadoras",
    prompt: "throwing bolas, southern gaucho hunting",
  },
  12: { name: "Candomble Rattle", prompt: "sacred shaker, orixa summoning" },
  13: {
    name: "Forro Accordion",
    prompt: "northeastern accordion, party weapon",
  },
  14: {
    name: "Favela Firework",
    prompt: "celebration rocket, party ammunition",
  },
  15: {
    name: "Champion Trophy",
    prompt: "regional trophy, competition victory",
  },

  // RARE (16-23)
  16: {
    name: "Orixa Sacred Staff",
    prompt: "Candomble ritual staff, divine connection, spiritual power",
  },
  17: {
    name: "Mestre Golden Berimbau",
    prompt: "master capoeira bow, golden arc, legendary ginga",
  },
  18: {
    name: "Amazon Blowgun",
    prompt: "jungle hunter blowgun, poison dart equipped, silent strike",
  },
  19: {
    name: "Carnaval Queen Scepter",
    prompt: "parade royalty scepter, feathered and jeweled",
  },
  20: {
    name: "Colonial Gold Saber",
    prompt: "Ouro Preto era sword, gold-hilted, colonial power",
  },
  21: {
    name: "World Cup Trophy Replica",
    prompt: "golden trophy replica, futebol dream manifest",
  },
  22: {
    name: "Cangaceiro Rifle",
    prompt: "northeastern bandit rifle, Lampiao style, outlaw legend",
  },
  23: {
    name: "Rainforest Guardian Spear",
    prompt: "Amazon protector spear, jaguar-tooth tip",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Iemanja's Trident",
    prompt: "ocean goddess trident, controls tides, sea foam trail, divine",
  },
  25: {
    name: "Supreme Carnaval Scepter",
    prompt: "ultimate parade scepter, all schools represented, samba supreme",
  },
  26: {
    name: "Amazon Spirit Bow",
    prompt: "legendary jungle bow, living arrows, rainforest divine",
  },
  27: {
    name: "Golden World Cup Trophy",
    prompt: "actual World Cup trophy, eternal champion, Pentacampeao manifest",
  },
  28: {
    name: "Ogum's Divine Sword",
    prompt: "war orixa's legendary blade, cuts all obstacles",
  },
  29: {
    name: "Xango's Thunder Axe",
    prompt: "justice orixa's double axe, calls lightning, divine judgment",
  },
  30: {
    name: "Curupira's Forest Staff",
    prompt: "legendary jungle spirit staff, controls all forest creatures",
  },
  31: {
    name: "degenBTC Mining Scepter",
    prompt:
      "ultimate Mining Wars weapon, green-gold crypto scepter, divine wealth",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const BRAZIL_ACCESSORY: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "None", prompt: "no accessories" },
  1: {
    name: "Friendship Bracelet",
    prompt: "simple woven bracelet, beach vendor purchase",
  },
  2: {
    name: "Shell Necklace",
    prompt: "basic seashell necklace, beach souvenir",
  },
  3: { name: "Football Scarf", prompt: "simple team scarf, fan loyalty" },
  4: { name: "Capoeira Cord", prompt: "basic white cord, beginner rank" },
  5: { name: "Havaianas", prompt: "classic flip flops, Brazilian essential" },
  6: { name: "Sunglasses Basic", prompt: "cheap sunglasses, beach protection" },
  7: { name: "Brazil Flag Pin", prompt: "small flag pin, patriotic basic" },

  // UNCOMMON (8-15)
  8: {
    name: "Candomble Beads",
    prompt: "sacred colored beads, orixa dedication visible",
  },
  9: {
    name: "Gold Chain Basic",
    prompt: "simple gold chain, Brazilian bling starter",
  },
  10: {
    name: "Carnaval Feather Boa",
    prompt: "colorful feather boa, parade accessory",
  },
  11: {
    name: "Gaucho Belt",
    prompt: "traditional leather belt, silver buckle",
  },
  12: {
    name: "Samba School Badge",
    prompt: "proud school badge, community identity",
  },
  13: {
    name: "Football Medal",
    prompt: "regional champion medal, futebol glory",
  },
  14: {
    name: "Acai Bowl Ring",
    prompt: "purple acai shaped ring, Amazon health culture",
  },
  15: {
    name: "Chimarrao Gourd",
    prompt: "traditional tea gourd, southern culture symbol",
  },

  // RARE (16-23)
  16: {
    name: "Orixa Blessed Beads",
    prompt: "multiple strand sacred beads, all orixas represented",
  },
  17: {
    name: "Golden Football Chain",
    prompt: "heavy gold chain with football pendant, champion bling",
  },
  18: {
    name: "Carnaval Champion Sash",
    prompt: "winner's sash, samba school champion year",
  },
  19: {
    name: "Mestre Cord Collection",
    prompt: "all capoeira cords earned, master status visible",
  },
  20: {
    name: "Amazon Shaman Amulet",
    prompt: "jungle spirit amulet, animal spirits contained",
  },
  21: {
    name: "Colonial Gold Jewelry",
    prompt: "Ouro Preto era gold pieces, baroque craftsmanship",
  },
  22: {
    name: "World Cup Ring",
    prompt: "champion ring, Selecao glory immortalized",
  },
  23: {
    name: "Boto Pearl Necklace",
    prompt: "river spirit pearls, pink iridescent, Amazon magic",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Iemanja's Ocean Jewels",
    prompt: "ocean goddess complete jewelry, pearls and coral, sea divine",
  },
  25: {
    name: "Supreme Carnaval Ensemble",
    prompt: "full champion accessories, every samba trophy, parade legend",
  },
  26: {
    name: "Amazon Spirit Totems",
    prompt: "all jungle spirits as jewelry, living accessories, divine",
  },
  27: {
    name: "Pentacampeao Complete Set",
    prompt: "all five World Cup rings, golden chain, ultimate legend",
  },
  28: {
    name: "All Orixa Blessed Set",
    prompt: "complete Candomble sacred jewelry, every orixa blessing",
  },
  29: {
    name: "Emperor's Tropical Jewels",
    prompt: "full imperial Brazilian jewelry, crown jewels of tropics",
  },
  30: {
    name: "Encantado Shape-Shift Charm",
    prompt: "legendary transformation amulet, boto spirits, form-changing",
  },
  31: {
    name: "degenBTC Mining Rig Bling",
    prompt: "ultimate crypto jewelry, $degenBTC symbols everywhere, champion",
  },
};

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const BRAZIL_EXPRESSION: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Relaxed", prompt: "chill expression, no stress Brazilian ease" },
  1: {
    name: "Friendly Smile",
    prompt: "warm welcoming smile, Brazilian hospitality",
  },
  2: {
    name: "Beach Bliss",
    prompt: "eyes half-closed, sun-soaked contentment",
  },
  3: { name: "Curious", prompt: "interested look, Brazilians love to chat" },
  4: { name: "Playful", prompt: "mischievous grin, malandro energy starting" },
  5: { name: "Hungry", prompt: "eyeing churrasco, meat craving visible" },
  6: { name: "Sleepy Siesta", prompt: "drowsy afternoon look, hammock time" },
  7: { name: "Street Smart", prompt: "alert but casual, favela awareness" },

  // UNCOMMON (8-15)
  8: {
    name: "Samba Joy",
    prompt: "pure dancing happiness, rhythm in the soul visible",
  },
  9: {
    name: "Football Passion",
    prompt: "intense sports focus, Selecao pride burning",
  },
  10: {
    name: "Capoeira Focus",
    prompt: "martial concentration, ginga readiness",
  },
  11: {
    name: "Carnaval Ecstasy",
    prompt: "parade bliss, feather-flying happiness",
  },
  12: {
    name: "Malandro Cunning",
    prompt: "clever Brazilian trickster look, street smart supreme",
  },
  13: {
    name: "Spiritual Serenity",
    prompt: "Candomble peace, orixa presence felt",
  },
  14: {
    name: "Gaucho Pride",
    prompt: "southern Brazilian dignity, chimarrao wisdom",
  },
  15: {
    name: "Amazon Wonder",
    prompt: "jungle awe, rainforest magic appreciation",
  },

  // RARE (16-23)
  16: {
    name: "Orixa Possession",
    prompt: "eyes rolling back slightly, divine presence manifesting",
  },
  17: {
    name: "Carnaval Champion Joy",
    prompt: "victorious parade happiness, samba school pride",
  },
  18: {
    name: "World Cup Glory",
    prompt: "ultimate football victory expression, Pentacampeao pride",
  },
  19: {
    name: "Mestre Wisdom",
    prompt: "capoeira master's knowing look, decades of ginga wisdom",
  },
  20: {
    name: "Amazon Guardian Fury",
    prompt: "rainforest protector anger, deforestation rage",
  },
  21: {
    name: "Bossa Nova Cool",
    prompt: "1960s Rio sophisticated calm, jazz elegance embodied",
  },
  22: {
    name: "Emperor's Dignity",
    prompt: "imperial Brazilian authority, tropical monarchy pride",
  },
  23: {
    name: "Cangaceiro Defiance",
    prompt: "northeastern bandit fearlessness, Lampiao spirit",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Iemanja's Ocean Gaze",
    prompt: "ocean goddess serene stare, infinite depths, sea wisdom divine",
  },
  25: {
    name: "Supreme Carnaval Transcendence",
    prompt: "ultimate samba ecstasy, pure joy beyond mortal limits",
  },
  26: {
    name: "Amazon Spirit Unity",
    prompt: "all jungle spirits visible in eyes, rainforest consciousness",
  },
  27: {
    name: "Pentacampeao Eternal Glory",
    prompt: "five World Cup victories radiating from eyes, football god",
  },
  28: {
    name: "All Orixa Blessing",
    prompt: "every Candomble deity's presence visible, supreme spiritual",
  },
  29: {
    name: "Emperor Divine Right",
    prompt: "tropical empire supreme confidence, born to rule",
  },
  30: {
    name: "Encantado Transformation",
    prompt: "shape-shifting in progress, boto spirit transitioning",
  },
  31: {
    name: "degenBTC Samba Enlightenment",
    prompt: "Mining Wars and Carnaval unified, crypto joy supreme, legendary",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const BRAZIL_BACKGROUND: Record<
  number,
  { name: string; prompt: string }
> = {
  // COMMON (0-7)
  0: { name: "Solid Green", prompt: "solid Brazilian green background" },
  1: { name: "Solid Yellow", prompt: "solid Brazilian yellow background" },
  2: {
    name: "Simple Gradient",
    prompt: "simple green to yellow gradient background",
  },
  3: {
    name: "Beach Simple",
    prompt: "basic Copacabana beach backdrop, sand and waves",
  },
  4: {
    name: "Favela Hillside",
    prompt: "colorful favela houses on hillside backdrop",
  },
  5: {
    name: "Football Field",
    prompt: "simple futebol pitch backdrop, grass and goals",
  },
  6: { name: "Street Market", prompt: "busy Brazilian street market backdrop" },
  7: {
    name: "Hammock Paradise",
    prompt: "palm trees and hammock, tropical relaxation",
  },

  // UNCOMMON (8-15)
  8: {
    name: "Copacabana Full",
    prompt: "Copacabana beach panorama, Sugarloaf visible, iconic Rio",
  },
  9: {
    name: "Sambodromo",
    prompt: "Carnaval parade route, Sambodromo stands, parade energy",
  },
  10: {
    name: "Sao Paulo Skyline",
    prompt: "Paulista Avenue skyline, urban jungle, tech hub",
  },
  11: {
    name: "Amazon River",
    prompt: "wide Amazon river, jungle shores, boat traffic",
  },
  12: {
    name: "Bahia Colonial",
    prompt: "Salvador Pelourinho historic center, colorful colonial",
  },
  13: {
    name: "Capoeira Roda",
    prompt: "capoeira circle, berimbau players, martial dance",
  },
  14: {
    name: "Gaucho Pampa",
    prompt: "southern grasslands, cattle, gaucho culture",
  },
  15: {
    name: "Nordeste Sertao",
    prompt: "northeastern dry landscape, cactus, survival terrain",
  },

  // RARE (16-23)
  16: {
    name: "Cristo Redentor",
    prompt: "Christ the Redeemer statue, arms open, Rio below, divine",
  },
  17: {
    name: "Iguazu Falls",
    prompt: "massive Iguazu waterfalls, rainbow mist, natural wonder",
  },
  18: {
    name: "Amazon Canopy",
    prompt: "rainforest canopy view, endless green, jungle majesty",
  },
  19: {
    name: "Maracana Stadium",
    prompt: "legendary Maracana packed, football cathedral, glory",
  },
  20: {
    name: "Terreiro Sacred",
    prompt: "Candomble temple interior, sacred space, orixa energy",
  },
  21: {
    name: "Ouro Preto Churches",
    prompt: "baroque churches of Ouro Preto, colonial gold glory",
  },
  22: {
    name: "Carnaval Champion Float",
    prompt: "champion samba school float, ultimate parade",
  },
  23: {
    name: "Brasilia Congress",
    prompt: "Niemeyer's Congress building, modernist power, capital",
  },

  // LEGENDARY (24-31)
  24: {
    name: "Iemanja's Ocean Realm",
    prompt:
      "underwater ocean goddess realm, divine sea temple, coral and pearls",
  },
  25: {
    name: "Supreme Carnaval Glory",
    prompt:
      "ultimate Carnaval finale, all schools, confetti divine, eternal parade",
  },
  26: {
    name: "Amazon Heart",
    prompt:
      "mythical center of Amazon, all spirits gathered, rainforest consciousness",
  },
  27: {
    name: "World Cup Victory",
    prompt: "World Cup final victory moment, five stars blazing, eternal glory",
  },
  28: {
    name: "All Orixa Pantheon",
    prompt: "complete Candomble orixa gathering, divine spiritual summit",
  },
  29: {
    name: "Imperial Brazil",
    prompt:
      "Brazilian Empire at its peak, tropical throne room, Pedro II magnificence",
  },
  30: {
    name: "Encantado River",
    prompt:
      "magical Amazon river, boto transformation happening, shapeshifter divine",
  },
  31: {
    name: "Divine Ascension",
    prompt:
      "heavenly clouds with Brazilian green-gold light, transcendent divine backdrop",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const BRAZIL_EVOLUTION_STAGES: Record<
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
    name: "Filhote",
    size: "small Brazilian puppy",
    demeanor: "eager vira-lata cute",
  },
  1: {
    stage: 1,
    name: "Street Pup",
    size: "growing favela dog",
    demeanor: "developing street smarts",
  },
  2: {
    stage: 2,
    name: "Malandro",
    size: "adult Brazilian operative",
    demeanor: "cunning jeitinho mastered",
  },
  3: {
    stage: 3,
    name: "Veterano",
    size: "experienced veteran",
    demeanor: "community respected",
  },
  4: {
    stage: 4,
    name: "Mestre",
    size: "Brazilian master",
    demeanor: "mastery evident",
  },
  5: {
    stage: 5,
    name: "Padrinho",
    size: "community patriarch",
    demeanor: "neighborhood leader",
  },
  6: {
    stage: 6,
    name: "Lenda",
    size: "legendary figure",
    demeanor: "living legend, Carnaval royalty",
  },
  7: {
    stage: 7,
    name: "Encantado",
    size: "transcendent divine wolf",
    demeanor: "orixa-blessed, mythical form",
  },
};

/**
 * Gets the story/lore for a Brazilian hashbeast based on type
 * @param typeValue - Type value (0-7 wizard, 8-15 muggle)
 * @returns Story string for the type
 */
export function getBrazilStory(typeValue: number): string {
  const typeData = BRAZIL_TYPE_PROMPTS[typeValue];
  return typeData?.story || BRAZIL_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// =============================================================================

export const BRAZIL_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const BRAZIL_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

// Populate from TYPE_PROMPTS for backward compatibility
for (let i = 0; i <= 7; i++) {
  const t = BRAZIL_TYPE_PROMPTS[i];
  BRAZIL_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = BRAZIL_TYPE_PROMPTS[i];
  BRAZIL_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
