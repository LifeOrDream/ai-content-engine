/**
 * UK Faction Prompts
 *
 * The British HashBeast Network is the oldest organised magical-canine network in the world.
 * From the Tower of London to the City's trading floors, from MI6 to the halls of
 * Oxford — British hashbeasts have been pulling strings since the Magna Carta.
 * The sun never sets on the British HashBeast Empire.
 *
 * Faction ID: 7
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
export const UK_FACTION = legacyFactionBlock(7);

// =============================================================================
// TYPE PROMPTS (16 Types: 0-7 Wizard, 8-15 Muggle)
// =============================================================================

export const UK_TYPE_PROMPTS: Record<
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
    region: "Scotland",
    occupation: "Hogwarts Professor",
    description: "Senior professor at Britain's premier magical academy",
    story: `Teaches Advanced $degenBTC Arithmancy at Hogwarts. The Room of Requirement now
generates mining hash. The sorting hat allocates students to faction mining pools.
Dumbledore's portrait approves every transaction. Magic and crypto were always the
same discipline.`,
    prompt:
      "Hogwarts professor robes, castle backdrop, academic wizard, British scholarly magic, ancient school",
  },
  1: {
    type: "wizard",
    region: "London",
    occupation: "Ministry of Magic Agent",
    description:
      "Senior operative in the British Ministry of Magic's finance division",
    story: `The Ministry's Department of Magical Finance has a hidden sub-department: the
$degenBTC Regulation Bureau. Every wizard transaction in Britain is taxed and tracked.
The Floo Network doubles as a blockchain. This agent ensures the Crown gets its cut.`,
    prompt:
      "Ministry of Magic official, London underground, British bureaucrat wizard, trench coat and wand",
  },
  2: {
    type: "wizard",
    region: "London",
    occupation: "City of London Warlock",
    description:
      "Financial sorcerer in the Square Mile's hidden magical trading floor",
    story: `Beneath the Bank of England lies the oldest magical vault in Europe. This warlock
trades $degenBTC using enchanted algorithms carved into stone by medieval monks. The
City of London's true power was never mortal finance — it's magical leverage over
every market on Earth.`,
    prompt:
      "City of London financial wizard, pinstripe suit with magical elements, Bank of England, money magic",
  },
  3: {
    type: "wizard",
    region: "Oxford",
    occupation: "Alchemical Scholar",
    description:
      "Oxford don researching the transmutation of value into $degenBTC",
    story: `Oxford's Bodleian Library contains grimoires that predate the university itself.
This scholar has proven that Isaac Newton's secret alchemical research was actually
early $degenBTC mining theory. The philosopher's stone? A hardware wallet. The
publications are peer-reviewed by ghosts.`,
    prompt:
      "Oxford academic wizard, Bodleian Library, scholarly robes and mortar board, dusty tomes, ancient knowledge",
  },
  4: {
    type: "wizard",
    region: "Stonehenge",
    occupation: "Druid Technomancer",
    description:
      "Ancient druid order member combining stone circle magic with technology",
    story: `Stonehenge was the first $degenBTC mining rig — solar-powered, stone-carved hash
functions running for 5,000 years. This druid maintains the connection between
ley-line energy and modern blockchain. Every solstice, the hashrate spikes. The
stones remember.`,
    prompt:
      "druid wizard, Stonehenge backdrop, ancient stone circle, robes with circuit patterns, ley-line energy",
  },
  5: {
    type: "wizard",
    region: "London",
    occupation: "Tower of London Keeper",
    description:
      "Magical guardian of the Crown Jewels and the nation's crypto reserves",
    story: `The Crown Jewels are decoys. The real treasure is the $degenBTC cold storage
vault sixty feet below the Tower. The ravens must never leave — they're the multisig
keyholders. This keeper ensures six ravens and six private keys remain secure. If the
ravens leave, the blockchain forks.`,
    prompt:
      "Tower of London wizard, Beefeater magical robes, crown jewels, ravens, medieval fortress magic",
  },
  6: {
    type: "wizard",
    region: "Edinburgh",
    occupation: "Scottish Highland Mage",
    description: "Wild magic practitioner from the Scottish Highlands",
    story: `The Loch Ness Monster guards an underwater data centre. Scottish whisky distilleries
double as magical energy plants. Highland clans have mined $degenBTC since before
England existed. This mage commands weather, terrain, and the fierce independence
of Scottish magic.`,
    prompt:
      "Scottish highland wizard, tartan magical robes, misty mountains, wild Celtic magic, rugged power",
  },
  7: {
    type: "wizard",
    region: "Classified",
    occupation: "Dark Lord's British Viceroy",
    description:
      "The Dark Lord's highest-ranking operative in the British Isles",
    story: `Britain is where the Dark Lord first rose to power. The Viceroy maintains the
original $degenBTC genesis node — hidden in a London Underground station that doesn't
appear on any map. When the Dark Lord returns, Britain will be ground zero. The
Viceroy has been ready since 1997.`,
    prompt:
      "dark wizard, London backdrop, sinister British elegance, shadows and fog, ominous power",
  },

  // MUGGLE TYPES (8-15)
  8: {
    type: "muggle",
    region: "London",
    occupation: "Royal Corgi",
    description: "Official Royal Household corgi with Palace access",
    story: `The Royal Corgis aren't pets — they're the actual ruling council of Britain.
Every major policy decision is approved by paw print. The late Queen's corgis held
the largest $degenBTC portfolio in Europe. The new King's dogs inherited everything.
The throne is ceremonial. The basket is power.`,
    prompt:
      "royal corgi, Buckingham Palace, regal luxury, crown jewels nearby, royal authority",
  },
  9: {
    type: "muggle",
    region: "London",
    occupation: "MI6 K-9 Operative",
    description: "Secret Intelligence Service field operative canine",
    story: `MI6's K-9 division is more classified than MI5 and MI6 combined. This operative
has been deployed to thirty countries. Five Eyes intelligence feeds directly to the
collar's embedded chip. $degenBTC funds black operations globally. The dog has a
licence to dig.`,
    prompt:
      "spy dog, MI6 aesthetic, London bridge backdrop, James Bond elegance, covert intelligence",
  },
  10: {
    type: "muggle",
    region: "London",
    occupation: "SAS War Dog",
    description: "Special Air Service elite combat canine",
    story: `Who Dares Wins. This dog has parachuted into more warzones than any human SAS
member. The unit's $degenBTC bounties fund extraction teams worldwide. Trained at
Hereford, deployed everywhere. The dog doesn't bark — it acts.`,
    prompt:
      "SAS military dog, tactical gear, elite forces, gas mask and body armor, stealth warrior",
  },
  11: {
    type: "muggle",
    region: "London",
    occupation: "Premier League Mascot",
    description: "Official mascot of England's most valuable football club",
    story: `The Premier League generates more $degenBTC through sports betting nodes than
most countries' mining pools. This mascot appears on matchday — 75,000 fans, each
phone unknowingly mining. The beautiful game is the beautiful mine. Transfer fees
are denominated in crypto.`,
    prompt:
      "football mascot dog, Premier League stadium, pitch-side, crowd energy, sports glamour",
  },
  12: {
    type: "muggle",
    region: "London",
    occupation: "City Banker's Dog",
    description: "Companion to a City of London hedge fund manager",
    story: `Sits under a desk managing £50B in assets. The fund's alpha comes from the dog's
collar — an antenna receiving $degenBTC whale movements. Every market crash was
engineered. Every rally was planned. The banker thinks he's smart. The dog knows
he's useful.`,
    prompt:
      "luxury banker's dog, City of London office, financial screens, pinstripe elegance, wealth",
  },
  13: {
    type: "muggle",
    region: "London",
    occupation: "Scotland Yard Detective Dog",
    description: "Metropolitan Police detective's partner",
    story: `Has solved more cases than the entire detective division combined. The real crime
in London? Unregulated $degenBTC mining. This dog follows the digital trail that
human detectives can't see. The nose knows. Every transaction has a scent.`,
    prompt:
      "detective dog, Scotland Yard, deerstalker hat, London rain, investigative authority",
  },
  14: {
    type: "muggle",
    region: "English Channel",
    occupation: "Royal Navy Dog",
    description: "Ship's dog aboard a Royal Navy aircraft carrier",
    story: `HMS Queen Elizabeth carries 40 jets and one dog that outranks them all. The Royal
Navy controls undersea $degenBTC cables across the Atlantic. This dog guards the
server room. Britannia rules the waves — and the bandwidth.`,
    prompt:
      "naval dog, aircraft carrier deck, Royal Navy, ocean backdrop, maritime authority",
  },
  15: {
    type: "muggle",
    region: "Countryside",
    occupation: "Country Estate Dog",
    description: "Aristocratic hunting dog on a vast English country estate",
    story: `The estate has been in the family since 1066. The fox hunts are cover for $degenBTC
mining equipment inspections across 10,000 acres. Old money meets new crypto. The
estate's server farm runs on wind energy from turbines disguised as follies. Terribly
civilised.`,
    prompt:
      "aristocratic hunting dog, English countryside estate, manor house, rolling green hills, old money",
  },
};

// =============================================================================
// TRAIT 0: FUR COLOR (32 Values, Tiered)
// =============================================================================

export const UK_FUR_COLOR: Record<number, { name: string; prompt: string }> = {
  0: {
    name: "Classic Tan",
    prompt: "classic warm tan fur, traditional British dog",
  },
  1: { name: "Cream", prompt: "cream white fur, tea-with-milk coloring" },
  2: { name: "Brown", prompt: "proper brown fur, country estate coloring" },
  3: { name: "Golden", prompt: "golden retriever fur, countryside warmth" },
  4: { name: "Sandy", prompt: "sandy blonde fur, seaside coloring" },
  5: { name: "Ginger", prompt: "ginger-toned fur, warm British" },
  6: { name: "Wheat", prompt: "wheat-colored fur, harvest gold" },
  7: { name: "Biscuit", prompt: "biscuit-tan fur, afternoon tea color" },
  8: { name: "Black & Tan", prompt: "black and tan fur, classic markings" },
  9: { name: "Silver Fox", prompt: "distinguished silver-gray fur" },
  10: { name: "Tweed", prompt: "multi-toned brown fur like tweed fabric" },
  11: { name: "Copper", prompt: "rich copper-penny fur, metallic sheen" },
  12: { name: "Charcoal", prompt: "London charcoal gray fur, urban elegance" },
  13: { name: "Burgundy Tint", prompt: "burgundy-tinted fur, wine country" },
  14: { name: "Platinum", prompt: "platinum blonde fur, aristocratic pale" },
  15: {
    name: "Oxford Blue Tint",
    prompt: "subtle blue-tinted dark fur, academic",
  },
  16: {
    name: "Pure White",
    prompt: "pure white fur, white cliffs of Dover, pristine",
  },
  17: { name: "Jet Black", prompt: "jet black fur, London night, sleek" },
  18: {
    name: "Royal Blue Sheen",
    prompt: "fur with royal blue metallic sheen",
  },
  19: {
    name: "Rose Gold",
    prompt: "rose gold tinted fur, modern London luxury",
  },
  20: {
    name: "Highland Red",
    prompt: "deep Scottish red fur, warrior highland",
  },
  21: { name: "Raven", prompt: "Tower raven black fur, iridescent blue-black" },
  22: {
    name: "Guardsman Red",
    prompt: "bright guardsman red-tinted fur, ceremonial",
  },
  23: {
    name: "Sterling Silver",
    prompt: "sterling silver fur, currency incarnate",
  },
  24: {
    name: "Union Jack Tri",
    prompt: "mystical fur shifting between red, white and blue",
  },
  25: {
    name: "Crown Gold",
    prompt: "pure crown gold fur, sovereign wealth, royal",
  },
  26: {
    name: "Dragon Scale",
    prompt: "Welsh dragon scale-patterned fur, ancient Celtic",
  },
  27: {
    name: "Thames Mist",
    prompt: "ethereal silver-blue Thames fog fur, ghostly London",
  },
  28: {
    name: "Constellation",
    prompt: "dark fur with Order of the Garter star patterns",
  },
  29: {
    name: "Imperial Purple",
    prompt: "deep imperial purple fur, empire's reach",
  },
  30: {
    name: "Excalibur Light",
    prompt: "fur glowing with Excalibur's divine light",
  },
  31: {
    name: "Divine Britannia",
    prompt: "transcendent Britannia light radiating from fur, divine",
  },
};

// =============================================================================
// TRAIT 1: HEADWEAR (32 Values)
// =============================================================================

export const UK_HEADWEAR: Record<number, { name: string; prompt: string }> = {
  0: { name: "None", prompt: "no headwear, natural fur visible" },
  1: { name: "Flat Cap", prompt: "classic British flat cap, working class" },
  2: { name: "Bobble Hat", prompt: "knitted bobble hat, football supporter" },
  3: { name: "Bucket Hat", prompt: "casual bucket hat, Britpop style" },
  4: { name: "Newsboy Cap", prompt: "old-fashioned newsboy cap, Peaky style" },
  5: { name: "Baseball Cap", prompt: "simple cap, casual British youth" },
  6: { name: "Headband", prompt: "sporty headband, athletic" },
  7: { name: "Baker Boy", prompt: "baker boy hat, retro British style" },
  8: { name: "Bobby Helmet", prompt: "Metropolitan Police custodian helmet" },
  9: {
    name: "Military Beret",
    prompt: "British Army beret, regimental colour",
  },
  10: {
    name: "Bowler Hat",
    prompt: "classic City bowler hat, financial district",
  },
  11: { name: "Deerstalker", prompt: "Sherlock Holmes deerstalker, detective" },
  12: {
    name: "Bearskin Guard",
    prompt: "Buckingham Palace guardsman bearskin",
  },
  13: { name: "Top Hat", prompt: "formal black top hat, Ascot elegance" },
  14: {
    name: "Hard Hat",
    prompt: "construction hard hat, infrastructure builder",
  },
  15: { name: "Chef Toque", prompt: "chef's toque, British culinary scene" },
  16: { name: "General's Cap", prompt: "British Army general's dress cap" },
  17: { name: "Naval Officer Cap", prompt: "Royal Navy officer's peaked cap" },
  18: {
    name: "Barrister Wig",
    prompt: "court barrister powdered wig, legal authority",
  },
  19: { name: "Tudor Crown", prompt: "Tudor-style jeweled crown, Henry VIII" },
  20: { name: "SAS Beret", prompt: "sand-colored SAS beret, Who Dares Wins" },
  21: {
    name: "Racing Top Hat",
    prompt: "Royal Ascot grey silk top hat, elite",
  },
  22: {
    name: "Pilot Helmet",
    prompt: "RAF fighter pilot helmet, Battle of Britain",
  },
  23: {
    name: "Wizard's Sorting Hat",
    prompt: "ancient magical sorting hat, Hogwarts",
  },
  24: {
    name: "Imperial Crown",
    prompt: "Imperial State Crown with Cullinan diamonds, supreme",
  },
  25: {
    name: "Excalibur Helm",
    prompt: "King Arthur's enchanted helm, Camelot",
  },
  26: {
    name: "Druid Crown",
    prompt: "ancient druid stone-and-oak crown, Stonehenge",
  },
  27: {
    name: "Britannia's Helm",
    prompt: "Britannia's classical warrior helmet, trident ready",
  },
  28: {
    name: "Five Eyes Visor",
    prompt: "intelligence network cyber visor, all-seeing",
  },
  29: {
    name: "Crown of Empire",
    prompt: "floating crown of the British Empire, global reach",
  },
  30: { name: "Dragon Crown", prompt: "Welsh dragon crown of Celtic fire" },
  31: {
    name: "Divine Sovereign",
    prompt: "transcendent crown of divine sovereign light",
  },
};

// =============================================================================
// TRAIT 2: OUTFIT (32 Values)
// =============================================================================

export const UK_OUTFIT: Record<number, { name: string; prompt: string }> = {
  0: { name: "T-Shirt", prompt: "casual British t-shirt, everyday" },
  1: { name: "Hoodie", prompt: "hoodie, London street style" },
  2: { name: "Work Jacket", prompt: "practical work jacket, tradesman" },
  3: { name: "Polo Shirt", prompt: "smart casual polo, British preppy" },
  4: {
    name: "Football Kit",
    prompt: "football jersey and shorts, match ready",
  },
  5: { name: "Raincoat", prompt: "waterproof mac, British weather essential" },
  6: { name: "Tweed Jacket", prompt: "tweed sport coat, countryside" },
  7: {
    name: "High-Vis Vest",
    prompt: "fluorescent high-vis vest, British worker",
  },
  8: {
    name: "Savile Row Suit",
    prompt: "bespoke Savile Row suit, sartorial excellence",
  },
  9: { name: "Military Dress", prompt: "British Army No.1 dress uniform" },
  10: {
    name: "Bobby Uniform",
    prompt: "Metropolitan Police uniform, blue serge",
  },
  11: {
    name: "Barbour Jacket",
    prompt: "waxed Barbour jacket, countryside aristocracy",
  },
  12: {
    name: "Punk Leather",
    prompt: "punk leather jacket with studs, British rebellion",
  },
  13: { name: "NHS Scrubs", prompt: "NHS hospital scrubs, healthcare hero" },
  14: {
    name: "Chef Whites",
    prompt: "Michelin-starred chef whites, culinary British",
  },
  15: { name: "Biker Gear", prompt: "cafe racer motorcycle gear, Ace Cafe" },
  16: {
    name: "SAS Tactical",
    prompt: "SAS black tactical assault gear, counter-terror",
  },
  17: { name: "MI6 Tuxedo", prompt: "Bond-style MI6 tuxedo, spy elegance" },
  18: {
    name: "Admiral Uniform",
    prompt: "Royal Navy Admiral full dress uniform",
  },
  19: {
    name: "Racing Silks",
    prompt: "Royal Ascot jockey silks, racing colours",
  },
  20: {
    name: "Barrister Robes",
    prompt: "Queen's Counsel silk robes, legal power",
  },
  21: { name: "Cyber Ops Suit", prompt: "GCHQ cyber warfare tactical suit" },
  22: {
    name: "Victorian Coat",
    prompt: "ornate Victorian frock coat, Dickensian",
  },
  23: {
    name: "Hogwarts Robes",
    prompt: "magical school robes with house colours",
  },
  24: {
    name: "Coronation Robes",
    prompt: "monarch's coronation robes, ermine and velvet",
  },
  25: {
    name: "Knights Templar",
    prompt: "Knights Templar crusader armor, ancient order",
  },
  26: {
    name: "Camelot Armor",
    prompt: "King Arthur's Round Table knight armor",
  },
  27: {
    name: "Britannia Armor",
    prompt: "Britannia's divine warrior armor, trident and shield",
  },
  28: {
    name: "Empire Admiral",
    prompt: "British Empire admiral supreme uniform, colonial gold",
  },
  29: {
    name: "Druid Robes",
    prompt: "ancient druid ceremonial robes, nature magic",
  },
  30: { name: "Dragon Armor", prompt: "Welsh dragon-scale enchanted armor" },
  31: {
    name: "Divine Sovereign",
    prompt: "body wrapped in sovereign divine light, ascended Britannia",
  },
};

// =============================================================================
// TRAIT 3: WEAPON (32 Values)
// =============================================================================

export const UK_WEAPON: Record<number, { name: string; prompt: string }> = {
  0: { name: "None", prompt: "no weapon, empty paws" },
  1: { name: "Umbrella", prompt: "sturdy British umbrella, Kingsman style" },
  2: { name: "Cricket Bat", prompt: "willow cricket bat, gentleman's weapon" },
  3: { name: "Walking Stick", prompt: "carved walking stick, country rambler" },
  4: { name: "Pint Glass", prompt: "heavy pint glass, pub weapon of choice" },
  5: { name: "Newspaper", prompt: "rolled Financial Times, paper weapon" },
  6: { name: "Golf Club", prompt: "St Andrews golf club, sporting" },
  7: { name: "Dog Lead", prompt: "sturdy leather lead, practical" },
  8: {
    name: "Service Revolver",
    prompt: "Webley service revolver, officer's sidearm",
  },
  9: { name: "Cavalry Sabre", prompt: "British cavalry sabre, charge weapon" },
  10: { name: "Truncheon", prompt: "wooden police truncheon, law and order" },
  11: {
    name: "SA80 Rifle",
    prompt: "SA80 assault rifle, British Army standard",
  },
  12: { name: "Combat Knife", prompt: "Fairbairn-Sykes commando knife, SAS" },
  13: {
    name: "Sniper Rifle",
    prompt: "L115A3 sniper rifle, longest kill record",
  },
  14: {
    name: "Brolly Sword",
    prompt: "hidden sword inside umbrella, spy concealment",
  },
  15: { name: "Rugby Ball", prompt: "rugby ball, blunt force instrument" },
  16: {
    name: "Heckler & Koch",
    prompt: "MP5 submachine gun, SAS counter-terror",
  },
  17: {
    name: "Cyber Tablet",
    prompt: "GCHQ cyber warfare tablet, digital weapon",
  },
  18: {
    name: "Enchanted Wand",
    prompt: "ollivander-style magical wand, elder wood",
  },
  19: { name: "Golden Cane", prompt: "gentleman's golden cane sword" },
  20: { name: "Longbow", prompt: "English longbow, Agincourt legend" },
  21: { name: "Sten Gun", prompt: "WW2 Sten gun, Resistance legend" },
  22: { name: "Trident", prompt: "golden trident of Britannia" },
  23: { name: "Druid Staff", prompt: "ancient druid oak staff, nature magic" },
  24: {
    name: "Excalibur",
    prompt: "Excalibur, the legendary sword, divine blade of kings",
  },
  25: {
    name: "Nuclear Briefcase",
    prompt: "Trident nuclear launch briefcase, deterrent supreme",
  },
  26: {
    name: "Crown Sceptre",
    prompt: "sovereign's sceptre with cross, divine authority",
  },
  27: {
    name: "Five Eyes Orb",
    prompt: "intelligence orb showing all Five Eyes feeds",
  },
  28: {
    name: "Dragon Fire",
    prompt: "channeled Welsh dragon fire breath weapon",
  },
  29: {
    name: "Stone of Destiny",
    prompt: "Stone of Scone, crowns and commands reality",
  },
  30: {
    name: "Britannia Shield",
    prompt: "Britannia's divine shield, repels all",
  },
  31: {
    name: "Divine Light",
    prompt: "wielding pure sovereign divine light, transcendent",
  },
};

// =============================================================================
// TRAIT 4: ACCESSORY (32 Values)
// =============================================================================

export const UK_ACCESSORY: Record<number, { name: string; prompt: string }> = {
  0: { name: "None", prompt: "no accessories" },
  1: { name: "Collar Tag", prompt: "simple engraved collar tag" },
  2: { name: "Basic Chain", prompt: "simple silver chain" },
  3: { name: "Watch", prompt: "practical wristwatch, Timex" },
  4: { name: "Scarf", prompt: "wool scarf, British winter essential" },
  5: { name: "Poppy Pin", prompt: "Remembrance Day poppy pin" },
  6: { name: "Wristband", prompt: "charity wristband" },
  7: { name: "Bandana", prompt: "knotted bandana, casual" },
  8: { name: "Regimental Tie", prompt: "military regiment striped tie" },
  9: { name: "Pocket Watch", prompt: "antique pocket watch, Victorian" },
  10: { name: "Cufflinks", prompt: "silver cufflinks, Savile Row detail" },
  11: { name: "Signet Ring", prompt: "family signet ring, old aristocracy" },
  12: { name: "Tartan Scarf", prompt: "clan tartan scarf, Scottish pride" },
  13: { name: "Monocle", prompt: "gentleman's monocle, distinguished" },
  14: {
    name: "Service Medals",
    prompt: "military service medals, campaign ribbons",
  },
  15: { name: "Ascot Cravat", prompt: "formal Ascot cravat, racing elegance" },
  16: { name: "OBE Medal", prompt: "Order of the British Empire medal" },
  17: { name: "Rolex Submariner", prompt: "Rolex Submariner, Bond's watch" },
  18: { name: "Crown Brooch", prompt: "royal crown diamond brooch, regal" },
  19: { name: "MI6 Badge", prompt: "classified MI6 operative badge, covert" },
  20: { name: "Masonic Ring", prompt: "Freemason ring, secret society" },
  21: {
    name: "BTC Pocket Watch",
    prompt: "Bitcoin-engraved pocket watch, crypto Victorian",
  },
  22: {
    name: "Victoria Cross",
    prompt: "Victoria Cross, highest military honour",
  },
  23: { name: "Druid Torc", prompt: "ancient Celtic gold torc necklace" },
  24: { name: "Koh-i-Noor", prompt: "Koh-i-Noor diamond pendant, Crown Jewel" },
  25: {
    name: "Order of Garter",
    prompt: "Order of the Garter insignia, highest chivalry",
  },
  26: {
    name: "Crown Jewels Set",
    prompt: "miniature Crown Jewels accessories, sovereign",
  },
  27: {
    name: "Excalibur Shard",
    prompt: "shard of Excalibur as pendant, legendary",
  },
  28: {
    name: "Five Eyes Implant",
    prompt: "intelligence network cyber implant, all-seeing",
  },
  29: {
    name: "Raven Companion",
    prompt: "Tower of London spectral raven companion",
  },
  30: {
    name: "Britannia's Shield",
    prompt: "miniature divine Britannia shield accessory",
  },
  31: {
    name: "Divine Sovereign Glow",
    prompt: "transcendent sovereign light accessories, divine",
  },
};

// =============================================================================
// TRAIT 5: EXPRESSION/MOOD (32 Values)
// =============================================================================

export const UK_EXPRESSION: Record<number, { name: string; prompt: string }> = {
  0: { name: "Neutral", prompt: "neutral composed expression" },
  1: { name: "Polite Smile", prompt: "polite reserved British smile" },
  2: { name: "Serious", prompt: "stiff upper lip serious expression" },
  3: {
    name: "Composed",
    prompt: "impeccably composed expression, unflappable",
  },
  4: { name: "Dry Wit", prompt: "subtle dry wit expression, eyebrow raised" },
  5: { name: "Pleasant", prompt: "pleasantly mild expression, British nice" },
  6: { name: "Weary", prompt: "weary but carrying on expression, keep calm" },
  7: {
    name: "Tea Content",
    prompt: "content tea-drinking expression, satisfied",
  },
  8: { name: "Determined", prompt: "Dunkirk spirit determined expression" },
  9: { name: "Smug", prompt: "smugly superior expression, British certainty" },
  10: { name: "Stern", prompt: "stern headmaster expression, authority" },
  11: { name: "Sardonic", prompt: "sardonic witty expression, cutting" },
  12: {
    name: "Battle Ready",
    prompt: "battle-ready expression, Falklands resolve",
  },
  13: {
    name: "Aristocratic Disdain",
    prompt: "aristocratic disdain expression, above it all",
  },
  14: {
    name: "Calculating",
    prompt: "calculating intelligence expression, MI6 analyst",
  },
  15: { name: "Pub Merry", prompt: "jolly pub-warm expression, good cheer" },
  16: {
    name: "Churchillian",
    prompt: "Churchillian bulldog expression, we shall never surrender",
  },
  17: {
    name: "Imperial Command",
    prompt: "imperial commanding expression, world authority",
  },
  18: {
    name: "Cold Intelligence",
    prompt: "cold MI6 intelligence expression, zero emotion",
  },
  19: {
    name: "Regal Grace",
    prompt: "regal graceful expression, royal composure",
  },
  20: {
    name: "Battle Fury",
    prompt: "Agincourt battle fury, St George's rage",
  },
  21: { name: "Spy Charm", prompt: "Bond-like charming lethal expression" },
  22: {
    name: "Old Money Pity",
    prompt: "old money pitying expression, generational wealth",
  },
  23: {
    name: "Dark Magic",
    prompt: "dark magic expression, Voldemort-adjacent menace",
  },
  24: {
    name: "Sovereign Power",
    prompt: "sovereign divine power expression, God Save the King",
  },
  25: {
    name: "Divine Calm",
    prompt: "transcendent calm, beyond mortal concern",
  },
  26: {
    name: "Excalibur Fury",
    prompt: "righteous Arthurian fury, once and future king",
  },
  27: {
    name: "Empire Supreme",
    prompt: "expression of absolute imperial supremacy",
  },
  28: {
    name: "Druid Wisdom",
    prompt: "ancient druid wisdom, Stonehenge eternal",
  },
  29: {
    name: "Rule Britannia",
    prompt: "Rule Britannia triumphant expression, waves ruled",
  },
  30: {
    name: "Eternal Watch",
    prompt: "eternal watchful guardian expression, never sleeps",
  },
  31: {
    name: "Divine Sovereignty",
    prompt: "transcendent sovereign divinity, beyond mortal",
  },
};

// =============================================================================
// TRAIT 6: BACKGROUND (32 Values)
// =============================================================================

export const UK_BACKGROUND: Record<number, { name: string; prompt: string }> = {
  0: { name: "Solid Blue", prompt: "solid royal blue background" },
  1: { name: "Solid Red", prompt: "solid British red background" },
  2: {
    name: "Rain Gradient",
    prompt: "grey rain gradient, classic British weather",
  },
  3: {
    name: "London Street",
    prompt: "London residential street, terraced houses",
  },
  4: {
    name: "Country Lane",
    prompt: "English country lane, hedgerows and stone walls",
  },
  5: { name: "Football Pitch", prompt: "Premier League pitch backdrop" },
  6: {
    name: "Village Pub",
    prompt: "traditional English village pub, warm interior",
  },
  7: { name: "Red Phone Box", prompt: "iconic red phone box on London street" },
  8: {
    name: "Big Ben",
    prompt: "Elizabeth Tower / Big Ben and Parliament backdrop",
  },
  9: { name: "Tower Bridge", prompt: "Tower Bridge lit at dusk, Thames" },
  10: {
    name: "Cambridge",
    prompt: "Cambridge University punting on river, spires",
  },
  11: {
    name: "Scottish Highlands",
    prompt: "dramatic Scottish Highland landscape",
  },
  12: {
    name: "Canary Wharf",
    prompt: "Canary Wharf financial district, modern London",
  },
  13: { name: "Abbey Road", prompt: "Abbey Road crossing, musical icon" },
  14: {
    name: "Military Base",
    prompt: "British Army barracks, military order",
  },
  15: { name: "Wimbledon", prompt: "Wimbledon Centre Court, grass tennis" },
  16: {
    name: "Buckingham Palace",
    prompt: "Buckingham Palace front, Changing of Guard",
  },
  17: {
    name: "Tower of London",
    prompt: "Tower of London fortress, Crown Jewels",
  },
  18: {
    name: "Bank of England",
    prompt: "Bank of England, City of London, financial power",
  },
  19: { name: "Stonehenge", prompt: "Stonehenge at sunrise, ancient mystery" },
  20: {
    name: "HMS Carrier",
    prompt: "HMS Queen Elizabeth aircraft carrier, naval might",
  },
  21: {
    name: "MI6 Building",
    prompt: "MI6 Vauxhall Cross building, secret intelligence",
  },
  22: {
    name: "Windsor Castle",
    prompt: "Windsor Castle, oldest occupied castle in world",
  },
  23: {
    name: "White Cliffs",
    prompt: "White Cliffs of Dover, dramatic coastline",
  },
  24: {
    name: "Union Jack Waving",
    prompt: "massive waving Union Jack backdrop, patriotic",
  },
  25: {
    name: "Coronation Hall",
    prompt: "Westminster Abbey coronation ceremony backdrop",
  },
  26: {
    name: "Camelot",
    prompt: "legendary Camelot castle, Arthurian myth, golden age",
  },
  27: {
    name: "Empire Map",
    prompt: "glowing map of the British Empire at maximum extent",
  },
  28: {
    name: "Rule Britannia",
    prompt: "Britannia rising from waves, trident and shield",
  },
  29: {
    name: "Hogwarts Castle",
    prompt: "magical castle in Scottish highlands, enchanted",
  },
  30: {
    name: "British Cosmos",
    prompt: "Union Jack constellation in cosmic space",
  },
  31: {
    name: "Divine Ascension",
    prompt: "heavenly clouds with sovereign golden light, transcendent",
  },
};

// =============================================================================
// EVOLUTION STAGES (0-7)
// =============================================================================

export const UK_EVOLUTION_STAGES: Record<
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
    demeanor: "eager young recruit",
  },
  1: {
    stage: 1,
    name: "Cadet",
    size: "young growing hashbeast",
    demeanor: "proper trainee",
  },
  2: {
    stage: 2,
    name: "Corporal",
    size: "adult hashbeast",
    demeanor: "steady and reliable",
  },
  3: {
    stage: 3,
    name: "Captain",
    size: "battle-hardened hashbeast",
    demeanor: "stiff upper lip",
  },
  4: {
    stage: 4,
    name: "Colonel",
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
    name: "Knight",
    size: "legendary massive hashbeast",
    demeanor: "Knight of the Realm",
  },
  7: {
    stage: 7,
    name: "Sovereign",
    size: "transcendent divine wolf",
    demeanor: "ascended ruler, divine right",
  },
};

export function getUKStory(typeValue: number): string {
  const typeData = UK_TYPE_PROMPTS[typeValue];
  return typeData?.story || UK_FACTION.faction_lore.origin;
}

// =============================================================================
// LEGACY EXPORTS
// =============================================================================

export const UK_WIZARD_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};
export const UK_MUGGLE_CATEGORIES: Record<
  number,
  { name: string; description: string; story: string }
> = {};

for (let i = 0; i <= 7; i++) {
  const t = UK_TYPE_PROMPTS[i];
  UK_WIZARD_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
for (let i = 8; i <= 15; i++) {
  const t = UK_TYPE_PROMPTS[i];
  UK_MUGGLE_CATEGORIES[i] = {
    name: t.occupation,
    description: t.description,
    story: t.story,
  };
}
