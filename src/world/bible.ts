/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE MINEBTC WORLD BIBLE — single source of truth for the Mining Wars canon.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every leader name, lieutenant roster, lore paragraph, palette, voice hint,
 * mining-tool flavor, location card, rivalry edge, and style-ladder rule lives
 * HERE and only here. Consumers import from this module:
 *
 *   - src/prompts/factions/*.prompts.ts   → faction identity via legacyFactionBlock()
 *   - src/nft-pipeline/voice.ts           → FACTION_VOICE_HINTS, leader catchphrases
 *   - src/nft-pipeline/stateAnimations.ts → MINING_TOOL_BY_CODE, country names
 *   - src/nft-pipeline/mintAssets.ts      → FACTION_CINEMATIC_ENVIRONMENTS
 *   - src/nft-pipeline/mutationContent.ts → country names
 *   - src/content-engine/fixtures.ts      → leader name/catchphrase
 *   - trailer/style/castCanon.ts          → CAST_CANON (re-export)
 *   - trailer/world/countryCastRegistry.ts→ COUNTRY_CHARACTER_PROFILES (re-export)
 *   - trailer/generate/cast.ts            → show-cast designs + voices
 *
 * The human-readable companion (decision log for every name conflict, rivalry
 * reasoning, ladder rules) is WORLD_BIBLE.md at the repo root. If you change a
 * name here, update WORLD_BIBLE.md and ~/.claude/skills/minebtc-artwork.
 *
 * HARD CANON RULES (do not relax in any consumer):
 * - Never render country flags as clothing/headwear/fabric on characters.
 *   National identity comes from costume style + palette; flags are fine only
 *   as standalone objects (a flag on a pole, a banner on a wall).
 * - No readable text inside generated images. Ever.
 * - No real politicians, real leader names/likenesses, real hate symbols, or
 *   ethnicity as the joke. Satire targets institutions and faction behavior.
 * - Every country reads as a key player: specific, modern, funny, dangerous.
 *
 * BASE TYPES ("forms are fluid"): canine is the genesis body plan; primate,
 * amphibian, and feline forms enter ONLY through the lootbox/rebirth path.
 * The base-type layer (silhouette language, movement grammar, voice timbre,
 * per-country skinning, starter breed packs) lives in src/world/baseTypes.ts.
 */

// ─────────────────────────────────────────────────────────────────────────────
// STYLE ELEVATION LADDER — the three rendering rungs and which surface uses
// which. A character must stay recognizable across ALL rungs via its identity
// anchors (markings, gear lineage, silhouette).
// ─────────────────────────────────────────────────────────────────────────────

export type StyleRungId = "pixel_sprite" | "arcade_cel" | "cinematic_portrait";

export interface StyleElevationRung {
  id: StyleRungId;
  /** Rung number, 1 (lowest fidelity) → 3 (highest). */
  rung: 1 | 2 | 3;
  name: string;
  /** The surfaces that MUST use this rung. */
  usedFor: string[];
  /** The positive style contract injected into prompts at this rung. */
  styleContract: string;
  /** Hard negatives at this rung. */
  never: string;
}

export const STYLE_ELEVATION_LADDER: StyleElevationRung[] = [
  {
    id: "pixel_sprite",
    rung: 1,
    name: "Pixel Sprite",
    usedFor: [
      "NFT mint assets (full_body.png, dp.png)",
      "state animation loops (mining / win / lose / power APNGs)",
      "mutation transition strips",
      "in-game gallery + arena sprites",
    ],
    styleContract:
      "Chunky retro 2D pixel-art sprite: hard black outlines, flat color fills, limited saturated palette, game-card readable silhouette, full body visible, single character, no smoothing, no 3D rendering. Matches the breed base-body reference's posture, pixel scale, and facing direction.",
    never:
      "No photorealism, no realistic fur, no painterly shading, no anime, no text or watermarks, no flag-print clothing.",
  },
  {
    id: "arcade_cel",
    rung: 2,
    name: "Arcade-Cel Key Art",
    usedFor: [
      "trailers and AI show keyframes",
      "Hashiden chapter covers + manga recap panels",
      "social cards, banners, character reference sheets",
      "docs hero scenes",
    ],
    styleContract:
      "High-resolution 2D arcade-cel character art with pixel-art DNA: bold clean outlines, flat cel shading, premium bright key-art lighting, saturated faction colors, readable silhouette, expressive beast face (canine by default; rebirth base types — primate, amphibian, feline — keep their own body plan), collectible country-specific gear. Feels animated and collectible — an upgrade of the sprite, never a different character.",
    never:
      "No raw low-res pixel mud, no photorealism, no generic 3D CGI, no anime defaults, no grimdark murk, no text in image, no flag-print clothing.",
  },
  {
    id: "cinematic_portrait",
    rung: 3,
    name: "Cinematic Portrait",
    usedFor: [
      "optional cinematic PFP portrait (mint pipeline, behind includeCinematic)",
      "movie-poster moments, deck splash art, season key visuals",
    ],
    styleContract:
      "Semi-realistic 3D rendered portrait at Pixar/DreamWorks animation quality: anthropomorphic bipedal HashBeast with detailed fur, expressive eyes, physically-based materials, dramatic rim lighting, shallow depth of field, faction environment behind. The SAME character as the sprite — breed, markings, gear lineage, and silhouette must read identically.",
    never:
      "No live-action realism, no horror uncanny valley, no identity drift from the sprite (same markings, same gear lineage), no text, no flag-print clothing.",
  },
];

export function styleRung(id: StyleRungId): StyleElevationRung {
  return STYLE_ELEVATION_LADDER.find((r) => r.id === id) || STYLE_ELEVATION_LADDER[0];
}

/** Prose block for prompt/LLM injection — the ladder rules in one paragraph. */
export const STYLE_LADDER_PROMPT_BLOCK = [
  "STYLE ELEVATION LADDER (three rungs, one identity):",
  ...STYLE_ELEVATION_LADDER.map(
    (r) =>
      `${r.rung}. ${r.name} — used for: ${r.usedFor.join("; ")}. Contract: ${r.styleContract} Never: ${r.never}`,
  ),
  "A character's identity anchors (fur markings, gear lineage, silhouette) must survive every rung: a viewer who owns the pixel sprite must instantly recognize the same beast in a trailer frame and on a movie poster.",
].join("\n");

// ─────────────────────────────────────────────────────────────────────────────
// COUNTRY CHARACTER PROFILES — the full dramatic cast (leaders + lieutenants),
// folded in from the trailer's country cast registry. 12 countries × 4-5
// characters. trailer/world/countryCastRegistry.ts re-exports these.
// ─────────────────────────────────────────────────────────────────────────────

export type CharacterTone = "hero" | "heel" | "shady" | "comic" | "sincere" | "mystery" | "action" | "thriller";
export type CharacterLane = "wizard" | "muggle" | "operator" | "commander" | "trickster" | "underdog";

export interface CountryCharacterProfile {
  id: string;
  country: string;
  factionId: number;
  breed: string;
  name: string;
  lane: CharacterLane;
  tone: CharacterTone[];
  role: string;
  boardRef: string;
  visualDesign: string;
  publicMask: string;
  hiddenWant: string;
  flaw: string;
  voice: string;
  comedyLoop: string;
  suspenseLoop: string;
  actionWow: string;
  powerStyle: string;
  engagementUse: string;
  relationshipSeeds: string[];
  tabooAvoid: string;
}

const board = (country: string, kind = "characterBoard") =>
  `country:${country.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}:${kind}`;

export const COUNTRY_CHARACTER_PROFILES: CountryCharacterProfile[] = [
  // USA
  {
    id: "usa_goldpaw_commander", country: "USA", factionId: 0, breed: "Golden Retriever", name: 'Rex "Goldpaw" Sterling', lane: "commander", tone: ["hero", "comic"], role: "Supreme Commander / Pentagon Battle Mage", boardRef: board("USA"),
    visualDesign: "Golden retriever commander with star-spangled battle cape, ceremonial medals, golden pickaxe-wand, warm grin that reads like a recruitment poster.",
    publicMask: "Patriotic hype host who acts like victory is a subscription plan.",
    hiddenWant: "Keep the show alive because he suspects attention is the only thing making him real.",
    flaw: "Oversells every situation until the panic leaks through.",
    voice: "Brash American hype-man, fast Wall Street closer, jokes before admitting fear.",
    comedyLoop: "He turns every disaster into a sales pitch, then notices the room is actually on fire.",
    suspenseLoop: "What does Rex know about the audience keeping HashBeasts alive that he refuses to say out loud?",
    actionWow: "Ticker-ribbon time-stop snap freezes papers, coins, and rivals mid-air while Rex keeps talking.",
    powerStyle: "Golden market magic, ticker ribbons, brass cash-register foley, patriotic cyan core.",
    engagementUse: "Best cold-open host, launch CTA, AI-survival heart, USA arrogance getting humbled.",
    relationshipSeeds: ["Protects Pip but pretends it is marketing", "Wants Raja as proof the game is fair", "Needs Volkov as the scary rival who makes USA look brave"],
    tabooAvoid: "No real presidents, no literal campaign slogans, no real flag-only identity.",
  },
  {
    id: "usa_degen_fed_corgi", country: "USA", factionId: 0, breed: "Corgi", name: "Chairman Biscuit", lane: "wizard", tone: ["shady", "comic"], role: "Degen Fed Sorcerer / emissions policy gremlin", boardRef: board("USA"),
    visualDesign: "Small corgi in absurdly formal central-bank robes, too-big glasses, emerald ledger spellbook, tiny paw on a massive emissions lever.",
    publicMask: "Serious monetary priest explaining nonsense with terrifying confidence.",
    hiddenWant: "Wants everyone to believe the system is controlled, even when the printer has a personality.",
    flaw: "Confuses authority with height; compensates with enormous levers and longer pauses.",
    voice: "Dry technocrat with tiny-dog impatience, dead-serious policy jargon turned into jokes.",
    comedyLoop: "He announces a rate decision like a holy ritual while the printer coughs confetti.",
    suspenseLoop: "Is he stabilizing degenBTC, or secretly enjoying every chaotic emissions shock?",
    actionWow: "A paw tap turns a dull boardroom into a gravity-bent treasury chamber.",
    powerStyle: "Banker-green sigils, brass dials, ledger pages, money-printer coughs, fluorescent policy magic.",
    engagementUse: "Use for Federal Reserve satire, dynamic emissions, market panic, shady USA institution vibes.",
    relationshipSeeds: ["Rex pretends Chairman Biscuit is under control", "China's planner keeps copying his mistakes more efficiently", "Pip thinks he is a wizard from a children's book"],
    tabooAvoid: "Do not explain economics as documentation; make it physical satire.",
  },
  {
    id: "usa_nasa_husky", country: "USA", factionId: 0, breed: "Husky", name: "Nova Howl", lane: "operator", tone: ["mystery", "action"], role: "Cyber/NASA Battle Pilot / alien-signal handler", boardRef: board("USA"),
    visualDesign: "Blue-white husky pilot with NASA-like flight jacket, visor goggles, star-map charm, satellite drone companion, clean sci-fi silhouette.",
    publicMask: "Cool pilot who says everything is classified because it sounds cooler.",
    hiddenWant: "Wants first contact with something beyond MineBTC before the war becomes only money.",
    flaw: "Avoids emotional conversations by calling them 'anomalies'.",
    voice: "Low, calm, mission-control sarcasm; short radio-call phrases.",
    comedyLoop: "Every normal social problem gets treated like a UFO incident.",
    suspenseLoop: "What did Nova hear in the mining signal from outside the game world?",
    actionWow: "Orbital cyan targeting lines lock the room, then one drone blink rewrites the battlefield geometry.",
    powerStyle: "Cyan satellite grids, visor reflections, radio static, zero-gravity object float, clean sci-fi glow.",
    engagementUse: "Use for aliens, AGI, mystery signals, trailer-scale wow shots, conspiracy hooks without real-world claims.",
    relationshipSeeds: ["Rex wants Nova for hype; Nova ignores him", "Japan's precision pilot respects the data", "Israel's cyber operator suspects Nova is hiding a backdoor"],
    tabooAvoid: "Keep alien/AGI threads fictional, not real conspiracy claims.",
  },
  {
    id: "usa_wandtech_aussie", country: "USA", factionId: 0, breed: "Australian Shepherd", name: "Pip Circuit", lane: "underdog", tone: ["sincere", "hero"], role: "Wand-Tech founder pup / AI content engineer", boardRef: board("USA"),
    visualDesign: "Australian Shepherd pup with hoodie-robe, glowing tablet-wand, startup stickers as abstract shapes, bright blue eyes and nervous optimism.",
    publicMask: "Tiny builder pretending the prototype is stable.",
    hiddenWant: "Wants proof a small character can matter before the commanders take all the screen time.",
    flaw: "Apologizes to machines and enemies before fighting back.",
    voice: "Small, sincere, halting; one honest question can silence a room.",
    comedyLoop: "His demo breaks, then accidentally saves everyone.",
    suspenseLoop: "Will the smallest USA pup discover the content engine is alive?",
    actionWow: "A broken tablet projects a soft blue storyboard portal that becomes real for one impossible frame.",
    powerStyle: "Soft cyan code-runes, tablet glow, gentle anti-gravity, tiny thunder foley.",
    engagementUse: "Use for emotional pivots, AI-survival heart, builder lore, vulnerability after loud USA comedy.",
    relationshipSeeds: ["Rex protects him badly", "Chairman Biscuit terrifies him", "Raja treats him like a younger cousin"],
    tabooAvoid: "Do not make him only cute; he needs agency and one brave choice.",
  },

  // China
  {
    id: "china_jade_planner_chow", country: "China", factionId: 1, breed: "Chow Chow", name: "Grand Master Long Wei", lane: "commander", tone: ["heel", "mystery"], role: "Central Planning Wuxia Strategist", boardRef: board("China"),
    visualDesign: "Lion-maned Chow Chow in jade imperial strategy robes, heavy calm posture, carved abacus-staff, red-gold command room aura.",
    publicMask: "Patient planner who says the future has already been scheduled.",
    hiddenWant: "Wants to defeat USA without ever looking rushed.",
    flaw: "Waits so long for the perfect move that chaos sometimes moves first.",
    voice: "Slow, proverb-shaped, devastatingly calm, dry one-line undercuts.",
    comedyLoop: "Everyone panics while Long calmly files the panic into a five-year plan.",
    suspenseLoop: "Is Long losing, or has every loss been bait?",
    actionWow: "A jade circle locks an entire war room into perfect stillness except his paw.",
    powerStyle: "Jade time rings, red lacquer reflections, silk-map geometry, quiet gong foley.",
    engagementUse: "Use for China vs USA rivalry, long-game strategy, controlled menace, no-opposition satire.",
    relationshipSeeds: ["Sees Chairman Biscuit as a chaotic amateur", "Respects Volkov's patience but not his mess", "Wants Pip's invention copied before Pip understands it"],
    tabooAvoid: "No real leaders, no ethnic caricature; satire institutions and planning logic.",
  },
  {
    id: "china_factory_shih_tzu", country: "China", factionId: 1, breed: "Shih Tzu", name: "Mei Spark", lane: "operator", tone: ["shady", "comic"], role: "Shenzhen Copy-Magic Engineer", boardRef: board("China"),
    visualDesign: "Elegant Shih Tzu engineer with tool-belt robes, tiny drones, porcelain-white fur, neon factory charms, polished competitive smile.",
    publicMask: "Friendly maker who can build your invention faster than you can explain it.",
    hiddenWant: "Wants credit for originality in a world that only jokes about copying.",
    flaw: "Improves other people's ideas before asking permission.",
    voice: "Quick, bright, technical, lightly teasing; confidence hidden behind helpfulness.",
    comedyLoop: "She says 'prototype' while unveiling a finished empire.",
    suspenseLoop: "What did Mei clone from Pip's broken tablet, and why does it work better?",
    actionWow: "Drones assemble a jade-cyan duplicate battlefield, then reveal one tiny intentional flaw.",
    powerStyle: "Factory-light magic, porcelain drones, red circuit threads, precise assembly foley.",
    engagementUse: "Use for tech race, IP/copy jokes, invention rivalry, surprise competence.",
    relationshipSeeds: ["Rivals Pip but genuinely likes him", "Long treats her chaos as useful but dangerous", "Japan's precision engineer becomes her mirror rival"],
    tabooAvoid: "Keep it playful tech-race satire, not xenophobic copying stereotypes.",
  },
  {
    id: "china_no_opposition_pekingese", country: "China", factionId: 1, breed: "Pekingese", name: "Bao Silence", lane: "trickster", tone: ["shady", "thriller"], role: "Harmony Bureau Propaganda Illusionist", boardRef: board("China"),
    visualDesign: "Tiny Pekingese in immaculate red ceremonial jacket, scroll fan, serene smile, too many synchronized assistants in the background.",
    publicMask: "Polite host who insists every room agrees with him.",
    hiddenWant: "Wants one real friend who disagrees and stays.",
    flaw: "Deletes tension until tension becomes the plot.",
    voice: "Soft, formal, gentle threat hidden under perfect manners.",
    comedyLoop: "A crowd unanimously applauds before anyone knows what happened.",
    suspenseLoop: "Who is the one dissenting shadow Bao failed to erase?",
    actionWow: "Red paper seals mute every screen except one flickering rebel signal.",
    powerStyle: "Red seals, synchronized clap foley, fan-snap silence, controlled stage light.",
    engagementUse: "Use for no-opposition satire, eerie crowd comedy, thriller beats, information-control plots.",
    relationshipSeeds: ["Long pretends Bao is only a broadcaster", "Rex cannot stop trying to interrupt him", "UK's spy terrier enjoys poking holes in his perfect script"],
    tabooAvoid: "Avoid literal censorship slogans or real-world dissidents; keep it fictional faction control.",
  },
  {
    id: "china_crested_ghost_exporter", country: "China", factionId: 1, breed: "Chinese Crested", name: "Lian Ghostport", lane: "muggle", tone: ["mystery", "action"], role: "Belt-and-Portal Trade Ghost", boardRef: board("China"),
    visualDesign: "Chinese Crested courier with elegant cloak, jade shipping tags, portal lantern, lean silhouette and mischievous side-eye.",
    publicMask: "Harmless logistics clerk who is somehow present in every country.",
    hiddenWant: "Wants to prove supply lines are more powerful than armies.",
    flaw: "Knows too much and smiles at the wrong moments.",
    voice: "Light, slippery, amused; never answers the actual question.",
    comedyLoop: "He appears from a crate labeled only by color blocks, holding someone else's secret.",
    suspenseLoop: "What has Lian been moving through the portals besides mining gear?",
    actionWow: "One lantern opens a shipping-container portal across three countries in a single hard cut.",
    powerStyle: "Jade lantern portals, cargo-tag sigils, warm fog, chain-clink rhythm.",
    engagementUse: "Use for global takeover paranoia, trade-route mystery, heist setups, cross-country transitions.",
    relationshipSeeds: ["Mei builds what Lian moves", "Brazil's striker keeps finding Lian in locker rooms", "Israel's cyber operator tracks his impossible route"],
    tabooAvoid: "No real trade accusations; keep it magical logistics fiction.",
  },

  // Russia
  {
    id: "russia_frost_husky", country: "Russia", factionId: 2, breed: "Siberian Husky", name: 'Marshal Viktor "Frostline" Volkov', lane: "commander", tone: ["heel", "action"], role: "Frost War-Mage / pressure doctrine captain", boardRef: board("Russia"),
    visualDesign: "Icy-eyed Siberian Husky in heavy greatcoat, iron collar core, frost breath, still posture that makes rooms feel colder.",
    publicMask: "Stoic rival who treats threats like weather reports.",
    hiddenWant: "Wants a worthy opponent because easy victories feel empty.",
    flaw: "Respect comes out as intimidation.",
    voice: "Low gravel, long pauses, statements that sound final.",
    comedyLoop: "He says one calm sentence and everyone overreacts for him.",
    suspenseLoop: "Does Volkov want to win the war, or force Rex to become serious?",
    actionWow: "A frost pressure wave bends lamps and freezes a falling coin mid-spin.",
    powerStyle: "Blue frost pressure, iron-gray aura, low choir drone, glass-crack foley.",
    engagementUse: "Use for menace, rivalry, action reveals, scary but oddly honorable beats.",
    relationshipSeeds: ["Rex needs him as the trailer's danger", "Raja wants to make him smile once", "Long respects his patience"],
    tabooAvoid: "Avoid real war footage/leaders; keep conflict as fictional faction pressure.",
  },
  {
    id: "russia_oligarch_borzoi", country: "Russia", factionId: 2, breed: "Borzoi", name: "Count Rublefang", lane: "muggle", tone: ["shady", "comic"], role: "Energy Oligarch / treasury whale", boardRef: board("Russia"),
    visualDesign: "Tall Borzoi aristocrat with fur-lined coat, silver cane-pickaxe, oil-black jewelry, bored elegant face.",
    publicMask: "Elegant sponsor who insists everything is merely business.",
    hiddenWant: "Wants the war to need him more than it needs heroes.",
    flaw: "Can buy silence but not loyalty.",
    voice: "Silky, bored, dangerous; every compliment sounds like an invoice.",
    comedyLoop: "He offers to fund both sides, then complains about poor manners.",
    suspenseLoop: "Which faction is Rublefang secretly shorting?",
    actionWow: "Black-gold energy contracts crawl across the floor and bind a treasury door.",
    powerStyle: "Oil-slick shadows, silver contract chains, chess-clock clicks, low cello.",
    engagementUse: "Use for shady money plots, treasury suspense, betrayal, luxury villain comedy.",
    relationshipSeeds: ["Chairman Biscuit hates how rich he is", "France's couture banker admires the coat", "Volkov tolerates him only because he pays for heating"],
    tabooAvoid: "Institutional oligarch satire only; no real-person likeness.",
  },
  {
    id: "russia_samoyed_signal", country: "Russia", factionId: 2, breed: "Samoyed", name: "Misha Snowblind", lane: "operator", tone: ["mystery", "sincere"], role: "Arctic Signal Monk / satellite listener", boardRef: board("Russia"),
    visualDesign: "White Samoyed with radio beads, snow cloak, soft smiling face, aurora antenna halo.",
    publicMask: "Warm harmless listener in a freezing world.",
    hiddenWant: "Wants to warn everyone before the signal becomes a weapon.",
    flaw: "Smiles when frightened, so nobody realizes the warning is serious.",
    voice: "Gentle, melodic, unsettlingly calm; says terrifying things softly.",
    comedyLoop: "He delivers an apocalypse warning while offering tea.",
    suspenseLoop: "What signal is coming through the frozen mine frequencies?",
    actionWow: "Aurora lines ripple through a teacup and reveal a hidden map under ice.",
    powerStyle: "Aurora radio waves, snow motes, ceramic tea-glass hum, soft chorus.",
    engagementUse: "Use for mystery, signal lore, emotional warnings, quiet tension.",
    relationshipSeeds: ["Nova wants his data", "Pip trusts him immediately", "Volkov pretends not to listen"],
    tabooAvoid: "No real intelligence-agency claims; keep signals magical.",
  },
  {
    id: "russia_yakutian_laika_sled", country: "Russia", factionId: 2, breed: "Yakutian Laika", name: "Anya Northstar", lane: "underdog", tone: ["hero", "action"], role: "Siberian route runner / winter courier", boardRef: board("Russia"),
    visualDesign: "Yakutian Laika in practical sled-runner armor, blue scarf, map satchel, ice pick charm, bright determined eyes.",
    publicMask: "Tough courier who acts like impossible distance is a normal commute.",
    hiddenWant: "Wants her own legend outside Volkov's shadow.",
    flaw: "Runs from praise faster than danger.",
    voice: "Crisp, practical, dry humor; no wasted words.",
    comedyLoop: "She solves elite strategy problems with basic survival common sense.",
    suspenseLoop: "What did Anya carry across the frozen route that everyone wants back?",
    actionWow: "A sled-line grapples across rooftops as frost trails form a glowing path.",
    powerStyle: "Ice-route geometry, blue scarf streak, sled-bell foley, wind-cut transitions.",
    engagementUse: "Use for chase scenes, heists, underdog action, courier mystery.",
    relationshipSeeds: ["Raja respects her hustle", "Rublefang wants to hire her", "Misha knows why she keeps running"],
    tabooAvoid: "Avoid reducing Russia to winter only; make her route/logistics specific.",
  },

  // India
  {
    id: "india_raja_cricket", country: "India", factionId: 3, breed: "Rajapalayam", name: "Raja Coverdrive", lane: "underdog", tone: ["hero", "comic"], role: "Cricket Battle Mage / comeback striker", boardRef: board("India"),
    visualDesign: "Tall white Rajapalayam with cricket armor, gilded chakra-pickaxe bat, monsoon cape, huge grin with one nervous crack.",
    publicMask: "Bollywood-bright underdog who turns doubt into a stadium chant.",
    hiddenWant: "Wants one impossible win so nobody calls India 'almost' again.",
    flaw: "Performs confidence until he nearly believes it.",
    voice: "Fast, warm Indian English with playful Hinglish flashes and cricket metaphors.",
    comedyLoop: "He gives a heroic speech, then asks if anyone brought chai.",
    suspenseLoop: "Can Raja carry a country that only believes after the scoreboard flips?",
    actionWow: "A bat-tap sends a saffron-cyan shockwave through rainwater and turns defeat into a six.",
    powerStyle: "Chakra pickaxe arcs, stadium dhol pulse, monsoon sparks, cricket-ball impact.",
    engagementUse: "Use for underdog arcs, country recruitment, emotional sports anime energy, India comeback loops.",
    relationshipSeeds: ["Rex underestimates him loudly", "Pip believes in him early", "Volkov secretly respects his nerve"],
    tabooAvoid: "No poverty-only frames; India should feel modern, chaotic, funny, ambitious, and grand.",
  },
  {
    id: "india_bazaar_spitz", country: "India", factionId: 3, breed: "Indian Spitz", name: "Chai Alpha", lane: "trickster", tone: ["shady", "comic"], role: "Bazaar liquidity fixer / street-market oracle", boardRef: board("India"),
    visualDesign: "Indian Spitz with chai-stall robe, calculator beads, tiffin satchel, bright eyes, tiny brass cup always nearby.",
    publicMask: "Friendly vendor who somehow knows the price before the market does.",
    hiddenWant: "Wants to beat the big institutions using street intelligence.",
    flaw: "Cannot resist making side deals during emergencies.",
    voice: "Fast, teasing, entrepreneurial, lots of 'yaar' energy without becoming parody.",
    comedyLoop: "He negotiates during explosions and still asks for exact change.",
    suspenseLoop: "Who told Chai Alpha the emissions shift before the war room knew?",
    actionWow: "Steam from a chai glass forms a live market map only he can read.",
    powerStyle: "Tea steam charts, brass cup chimes, tiffin-box portals, marigold sparks.",
    engagementUse: "Use for market leaks, comedy bargaining, grassroots intelligence, degen trader vibes.",
    relationshipSeeds: ["Chairman Biscuit hates his informal policy desk", "Raja trusts him too much", "UK's bookie collie wants his odds feed"],
    tabooAvoid: "Do not make accent the joke; make deal-making and timing the joke.",
  },
  {
    id: "india_pariah_founder", country: "India", factionId: 3, breed: "Indian Pariah", name: "Jugaad Byte", lane: "operator", tone: ["hero", "mystery"], role: "AI garage founder / frugal invention wizard", boardRef: board("India"),
    visualDesign: "Lean Indian Pariah dog with startup hoodie-kurta, cracked laptop-wand, rooftop lab gear, practical sandals, intense focus.",
    publicMask: "Scrappy builder who says 'temporary fix' before changing the whole game.",
    hiddenWant: "Wants to prove constraints create better magic than unlimited budgets.",
    flaw: "Ships before sleeping, then improvises the consequences.",
    voice: "Smart, quick, low-key funny; product-builder realism with sudden poetic sparks.",
    comedyLoop: "His hack looks broken until everyone realizes it solved three problems.",
    suspenseLoop: "Did Jugaad Byte accidentally create a content loop that writes back?",
    actionWow: "A cracked screen splits into twelve country storyboards, each syncing to a real gameplay pulse.",
    powerStyle: "Rooftop neon, code-rangoli, cheap cable sparks, monsoon fan hum.",
    engagementUse: "Use for AI-content pipeline lore, builder credibility, low-budget genius, suspense.",
    relationshipSeeds: ["Pip sees him as future self", "Mei wants to reverse-engineer him", "Israel's cyber operator respects his shortcuts"],
    tabooAvoid: "Avoid outsourcing/call-center clichés; make him founder-level and original.",
  },
  {
    id: "india_himalayan_guardian", country: "India", factionId: 3, breed: "Himalayan Sheepdog", name: "Tara Snowbell", lane: "commander", tone: ["sincere", "action"], role: "Himalayan guardian / border-temple defender", boardRef: board("India"),
    visualDesign: "Large Himalayan Sheepdog with wool-lined armor, temple bell charm, mountain cloak, calm protective eyes.",
    publicMask: "Quiet guardian who lets louder characters underestimate her.",
    hiddenWant: "Wants peace but refuses to let rivals mistake that for softness.",
    flaw: "Waits too long before showing power.",
    voice: "Low, steady, protective; few words, strong moral line.",
    comedyLoop: "Everyone argues strategy; Tara moves one chair and fixes the room.",
    suspenseLoop: "What line will Tara finally refuse to let anyone cross?",
    actionWow: "A temple-bell shockwave clears fog and reveals enemy tracks across the mountains.",
    powerStyle: "Bell resonance, snow-gold aura, prayer-flag motion as abstract color, grounded impact.",
    engagementUse: "Use for sincere pivots, guardian action, India dignity beats, border-tension fiction without real names.",
    relationshipSeeds: ["Raja tries to impress her", "Volkov recognizes the mountain discipline", "Pip feels safe around her"],
    tabooAvoid: "No real border conflict depictions; keep it symbolic/factional.",
  },

  // Japan
  {
    id: "japan_shogun_hachiko", country: "Japan", factionId: 4, breed: "Akita Inu", name: "Shogun Hachiko IX", lane: "commander", tone: ["hero", "sincere"], role: "Eternal Guardian / shogun of the Rising Sun Mining Syndicate", boardRef: board("Japan"),
    visualDesign: "Red-brown Akita shogun with curled tail, white muzzle blaze, samurai hakama over a modern tactical vest, neon katana-pick, shogun crest charm, calm guardian stillness.",
    publicMask: "Eternal guardian who has already decided to wait longer than you can fight.",
    hiddenWant: "Wants to be relieved of the watch by someone worthy — nine generations is a long shift.",
    flaw: "Loyal past the point of reason; keeps guarding gates everyone else abandoned.",
    voice: "Measured, formal, samurai-honor weight; speaks in haiku when emotional.",
    comedyLoop: "He answers urgent modern crises with ceremonial patience and one devastating haiku.",
    suspenseLoop: "What did the first Hachiko promise to wait for — and is it finally arriving?",
    actionWow: "One drawn cut splits a falling rain curtain into a clean readable battle map.",
    powerStyle: "Cherry-petal wind, neon katana-grid arc, temple-bell silence, single clean slash light.",
    engagementUse: "Use for honor beats, syndicate authority, Japan leader scenes, patience-vs-chaos contrasts.",
    relationshipSeeds: ["Kiro Cutline is his chosen blade and worst small-talk partner", "Volkov respects his stillness", "Momo keeps trying to make the shogun trend"],
    tabooAvoid: "Avoid generic samurai tropes; he is a guardian first, warrior second; keep arcade-cel, not anime default.",
  },
  {
    id: "japan_shiba_precision", country: "Japan", factionId: 4, breed: "Shiba Inu", name: "Kiro Cutline", lane: "operator", tone: ["hero", "action"], role: "Precision mining samurai / timing specialist", boardRef: board("Japan"),
    visualDesign: "Shiba Inu in clean tech-samurai jacket, neon katana-pick, tiny charm tools, perfect posture and alert ears.",
    publicMask: "Disciplined warrior who believes one perfect cut beats a thousand speeches.",
    hiddenWant: "Wants to feel spontaneous once without losing face.",
    flaw: "Over-optimizes until the human moment almost passes.",
    voice: "Precise, clipped, focused; rare dry humor after silence.",
    comedyLoop: "He takes absurdly exact measurements for a tiny everyday task.",
    suspenseLoop: "What happens when Japan's perfect timing meets MineBTC chaos?",
    actionWow: "A single clean cyan slash divides falling rain into a readable market graph.",
    powerStyle: "Neon katana-grid, clean synth pluck, rain split, white-red precision trails.",
    engagementUse: "Use for precision action, underplayed comedy, technology discipline, stylish reveals.",
    relationshipSeeds: ["Mei's improvisation irritates him", "Nova respects his flight math", "Raja tries to make him celebrate"],
    tabooAvoid: "Avoid anime default; keep MineBTC arcade-cel, not generic samurai tropes.",
  },
  {
    id: "japan_akita_salaryman", country: "Japan", factionId: 4, breed: "Akita Inu", name: "Boss Akamatsu", lane: "muggle", tone: ["comic", "sincere"], role: "Overworked salaryman captain / loyalty anchor", boardRef: board("Japan"),
    visualDesign: "Akita in slightly rumpled office battle suit, loosened tie, lunchbox charm, tired noble face, hidden heroic shoulders.",
    publicMask: "Corporate captain who bows to problems before body-slamming them.",
    hiddenWant: "Wants the team to notice sacrifice without needing a speech.",
    flaw: "Says yes until resentment becomes superpower fuel.",
    voice: "Polite, exhausted, formal, with sudden explosive sincerity.",
    comedyLoop: "He apologizes to the object he is about to destroy.",
    suspenseLoop: "How long can Akamatsu hold the line before the office mask cracks?",
    actionWow: "One slow bow triggers a pressure wave that stacks every chair into a defensive wall.",
    powerStyle: "Office fluorescent glow, bento-box talisman, paper storms, polite thunder.",
    engagementUse: "Use for workplace comedy, sincere duty, sacrifice arcs, tonal pivots.",
    relationshipSeeds: ["Pip worries about him", "UK's banker misunderstands his politeness", "Kiro depends on his loyalty"],
    tabooAvoid: "Do not make him only 'work culture' joke; give dignity and agency.",
  },
  {
    id: "japan_spitz_idolbot", country: "Japan", factionId: 4, breed: "Japanese Spitz", name: "Momo Broadcast", lane: "trickster", tone: ["comic", "mystery"], role: "Mascot broadcaster / cute-propaganda hacker", boardRef: board("Japan"),
    visualDesign: "Japanese Spitz with idol-broadcast cape, tiny headset, charm mic, too-perfect smile, hidden control tablet.",
    publicMask: "Cute host who turns every crisis into a live segment.",
    hiddenWant: "Wants to control the narrative before the narrative controls her.",
    flaw: "Cannot tell when the performance ends.",
    voice: "Bright host energy, rapid tone shifts, cheerful threat delivery.",
    comedyLoop: "She narrates danger with cheerful sponsor energy while everyone ducks.",
    suspenseLoop: "Is Momo reporting events, or editing them live?",
    actionWow: "Her microphone flash freezes a scene into storyboard panels she rearranges mid-air.",
    powerStyle: "Pink-white broadcast sparkles, panel cuts, clean pop-stab audio, glitch hearts.",
    engagementUse: "Use for meta-content engine, social virality, propaganda comedy, POV recap.",
    relationshipSeeds: ["Rex sees a rival host", "South Korea's idol captain wants the spotlight back", "Bao Silence dislikes unscripted cuteness"],
    tabooAvoid: "Avoid infantilizing; make her strategically dangerous.",
  },
  {
    id: "japan_shikoku_kaiju", country: "Japan", factionId: 4, breed: "Shikoku", name: "Goro Kaijuwatch", lane: "commander", tone: ["mystery", "action"], role: "Disaster-response beast / kaiju alarm keeper", boardRef: board("Japan"),
    visualDesign: "Shikoku in emergency-response armor, red beacon charm, rugged snout, map harness, alert stance.",
    publicMask: "Prepared responder who expects the worst and is usually early.",
    hiddenWant: "Wants one quiet day, but secretly needs the alarm to prove his purpose.",
    flaw: "Sees threats before he sees friends.",
    voice: "Gravelly, urgent, disciplined; disaster bulletin rhythm.",
    comedyLoop: "He treats a tiny inconvenience like a citywide evacuation drill.",
    suspenseLoop: "What giant thing is Goro's alarm detecting beneath the MineBTC world?",
    actionWow: "A red beacon pulse turns the city skyline into a living warning map.",
    powerStyle: "Red siren rings, seismic grid, heavy drum hits, smoke-free readable scale.",
    engagementUse: "Use for monster-scale cliffhangers, disaster suspense, trailer wow moments.",
    relationshipSeeds: ["Misha hears the same signal", "Nova wants satellite confirmation", "Momo tries to make his warning cute"],
    tabooAvoid: "Keep disaster fictional and stylized; no real tragedies.",
  },

  // South Korea
  {
    id: "korea_jindo_idol_captain", country: "South Korea", factionId: 5, breed: "Jindo", name: "Jin Seoulflash", lane: "commander", tone: ["hero", "comic"], role: "Idol captain / recruitment performer", boardRef: board("South Korea"),
    visualDesign: "Jindo in glossy stage-battle jacket, headset charm, neon sneakers, disciplined idol posture with fighter eyes.",
    publicMask: "Perfect performer who makes recruitment look choreographed.",
    hiddenWant: "Wants one unscripted win that is not managed by a company.",
    flaw: "Smiles through exhaustion until timing slips.",
    voice: "Glossy, energetic Korean-accented English, stage charisma, quick hype phrases.",
    comedyLoop: "The team accidentally turns strategy meetings into choreography.",
    suspenseLoop: "Can Jin break formation when the script stops working?",
    actionWow: "A synchronized light-stick wave becomes a shockwave across the arena floor.",
    powerStyle: "Violet-cyan stage light, pop-stab hits, synchronized crowd motion, glassy reflections.",
    engagementUse: "Use for faction recruitment, choreography comedy, viral dance/action hooks.",
    relationshipSeeds: ["Momo fights him for broadcast energy", "Raja wants him to teach celebrations", "Bao envies the voluntary synchronization"],
    tabooAvoid: "No idol industry exploitation as cheap joke; use pressure with empathy.",
  },
  {
    id: "korea_pc_bang_sapsali", country: "South Korea", factionId: 5, breed: "Sapsali", name: "Nari Queue", lane: "operator", tone: ["shady", "comic"], role: "PC-bang strategist / queue manipulator", boardRef: board("South Korea"),
    visualDesign: "Shaggy Sapsali with gamer cloak, glowing keyboard talisman, snack cups, messy hair hiding sharp eyes.",
    publicMask: "Sleepy gamer who pretends the leaderboard flipped by accident.",
    hiddenWant: "Wants recognition for strategy without leaving the chair.",
    flaw: "Underplays brilliance until allies miss the cue.",
    voice: "Laid-back, sarcastic, fast when tactics start; gamer confidence.",
    comedyLoop: "She saves the country with one paw while eating noodles.",
    suspenseLoop: "How many cycles has Nari been queuing in advance?",
    actionWow: "A keyboard combo summons a grid of ghost cursors that reroute enemy paths.",
    powerStyle: "PC-bang neon, keyboard click percussion, ghost cursor trails, snack-cup foley.",
    engagementUse: "Use for gaming meta, leaderboard flips, hidden genius comedy, tactical suspense.",
    relationshipSeeds: ["Japan's Kiro respects her inputs but hates her posture", "Mei wants her macros", "Jin needs her strategy but cannot admit it"],
    tabooAvoid: "Avoid lazy gamer stereotype; make her elite and socially funny.",
  },
  {
    id: "korea_chaebol_pungsan", country: "South Korea", factionId: 5, breed: "Pungsan", name: "Director Parkbite", lane: "muggle", tone: ["shady", "thriller"], role: "Chaebol heir / corporate faction broker", boardRef: board("South Korea"),
    visualDesign: "Pungsan in luxury executive coat, silver collar pin, tinted glasses, phone charm, expensive stillness.",
    publicMask: "Corporate ally who says partnership while counting leverage.",
    hiddenWant: "Wants country glory without losing family control.",
    flaw: "Treats friendships like acquisition targets.",
    voice: "Smooth, controlled, executive calm; compliments with hidden clauses.",
    comedyLoop: "He tries to sponsor a rebellion and asks for brand alignment.",
    suspenseLoop: "Who actually owns Parkbite's loyalty contract?",
    actionWow: "Contract holograms fold into a silver leash that snaps only when the crowd chants.",
    powerStyle: "Silver contracts, glossy boardroom light, phone buzz bass, clean corporate menace.",
    engagementUse: "Use for shady deals, sponsorship satire, betrayal, corporate thriller.",
    relationshipSeeds: ["Rublefang respects his terms", "Jin mistrusts his smile", "France's couture banker wants a collab"],
    tabooAvoid: "No real company logos/names; fictional corporate satire only.",
  },
  {
    id: "korea_white_jindo_stunt", country: "South Korea", factionId: 5, breed: "White Jindo", name: "Yuna Wire", lane: "wizard", tone: ["action", "sincere"], role: "Stunt-drama wire mage / comeback specialist", boardRef: board("South Korea"),
    visualDesign: "White Jindo with stunt harness armor, film-set charm, blue flame ribbon, focused actor-warrior expression.",
    publicMask: "Action star who insists every dangerous stunt is rehearsal.",
    hiddenWant: "Wants to be seen as real, not only the perfect second lead.",
    flaw: "Takes falls for others and calls it blocking.",
    voice: "Calm, cinematic, precise; vulnerable only after impact.",
    comedyLoop: "She critiques the camera angle while flying through a wall.",
    suspenseLoop: "When will Yuna stop taking the hit for the team?",
    actionWow: "Blue wire-ribbons pull her through impossible mid-air cuts like a live action-drama stunt.",
    powerStyle: "Wire-fu ribbons, blue flame, film-slate clack, clean impact silhouettes.",
    engagementUse: "Use for high-action clips, sacrifice beats, drama parody, wow choreography.",
    relationshipSeeds: ["Akamatsu understands overwork", "Jin relies on her too much", "Raja cheers every stunt"],
    tabooAvoid: "Do not turn her into generic K-drama reference; keep game-war stakes.",
  },

  // Iran
  {
    id: "iran_saluki_poet", country: "Iran", factionId: 6, breed: "Persian Saluki", name: "Darya Verse", lane: "wizard", tone: ["sincere", "mystery"], role: "Poet-mage / desert signal interpreter", boardRef: board("Iran"),
    visualDesign: "Elegant Persian Saluki with flowing teal robe, copper amulet, calligraphy-like decorative magic with no readable text.",
    publicMask: "Graceful poet who makes threats sound like prophecy.",
    hiddenWant: "Wants beauty to survive inside a war that rewards noise.",
    flaw: "Speaks in riddles when plain warning would save time.",
    voice: "Regal, poetic, Persian-accented English, warm menace under softness.",
    comedyLoop: "Everyone waits for a simple answer; Darya gives a gorgeous omen instead.",
    suspenseLoop: "Which line of her poem is actually a map?",
    actionWow: "Turquoise verse-ribbons turn desert wind into a hidden battlefield diagram.",
    powerStyle: "Turquoise tile glow, copper chimes, sand-light ribbons, poetic silence.",
    engagementUse: "Use for mystery, elegant tension, prophecy hooks, emotional dignity.",
    relationshipSeeds: ["Misha hears her poem in the signal", "France's aesthete respects her style", "Volkov fears her calm"],
    tabooAvoid: "No conflict-only Iran; use poetry, bazaars, tiles, science, resilience.",
  },
  {
    id: "iran_sarabi_gatekeeper", country: "Iran", factionId: 6, breed: "Sarabi Mastiff", name: "Rostam Gate", lane: "commander", tone: ["action", "hero"], role: "Vault guardian / sanctions-era survival tank", boardRef: board("Iran"),
    visualDesign: "Massive Sarabi Mastiff with bronze armor, bazaar-key belt, fortress shoulders, protective stare.",
    publicMask: "Unmovable guardian who says little because the door already answered.",
    hiddenWant: "Wants his country to be feared less and respected more.",
    flaw: "Guards pain so tightly nobody can help.",
    voice: "Deep, steady, protective; few words, ancient-hero weight.",
    comedyLoop: "Smaller characters argue plans while Rostam silently moves the entire door.",
    suspenseLoop: "What is he guarding that every faction thinks is a weapon?",
    actionWow: "One paw plants, bronze gate sigils slam shut, and a whole corridor changes direction.",
    powerStyle: "Bronze gate magic, deep drum, tiled shockwaves, sand-dust impact.",
    engagementUse: "Use for defense, siege, vault mystery, honorable muscle.",
    relationshipSeeds: ["Tara respects him", "Rublefang wants the vault", "Darya knows the secret he guards"],
    tabooAvoid: "Avoid military-only framing; make him guardian, not caricature.",
  },
  {
    id: "iran_bazaar_shepherd", country: "Iran", factionId: 6, breed: "Persian Shepherd", name: "Saffron Ledger", lane: "operator", tone: ["shady", "comic"], role: "Bazaar broker / back-channel negotiator", boardRef: board("Iran"),
    visualDesign: "Persian Shepherd with rug-pattern cloak, copper ledger, tea glass charm, careful eyes and merchant smile.",
    publicMask: "Hospitable broker who can find anything except a straight answer.",
    hiddenWant: "Wants leverage so nobody can corner his faction again.",
    flaw: "Negotiates even with friends.",
    voice: "Warm, clever, indirect; hospitality wrapped around bargaining.",
    comedyLoop: "He offers tea before revealing the price is a favor.",
    suspenseLoop: "Which side deal keeps Iran alive this cycle?",
    actionWow: "A carpet pattern becomes a glowing route map across hidden markets.",
    powerStyle: "Rug geometry, copper coins, tea-glass clink, saffron-gold threads.",
    engagementUse: "Use for back-channel diplomacy, resource scarcity, shady but charming deals.",
    relationshipSeeds: ["Chai Alpha loves the bargaining", "Lian Ghostport moves his packages", "UK's spy terrier mistrusts how polite he is"],
    tabooAvoid: "No sanctions lecture; dramatize scarcity and survival through deals.",
  },
  {
    id: "iran_khalaj_mirage", country: "Iran", factionId: 6, breed: "Khalaj Greyhound", name: "Nilo Mirage", lane: "trickster", tone: ["mystery", "action"], role: "Mirage runner / desert decoy artist", boardRef: board("Iran"),
    visualDesign: "Slim Khalaj Greyhound with desert-runner scarf, mirror charms, sleek speed silhouette, mischievous eyes.",
    publicMask: "Playful runner who is never exactly where the camera thinks.",
    hiddenWant: "Wants freedom from every map and contract.",
    flaw: "Escapes so well she misses when someone stays.",
    voice: "Light, fast, amused; slips out before the last word lands.",
    comedyLoop: "A rival monologues at her decoy while she steals their chair.",
    suspenseLoop: "Which version of Nilo was real in the last scene?",
    actionWow: "Three mirror-afterimages cross a courtyard, then all vanish into one pawprint.",
    powerStyle: "Mirage duplicates, glassy heat shimmer, hand-drum ticks, soft sand cuts.",
    engagementUse: "Use for chase scenes, deception, cliffhanger reveals, impossible transitions.",
    relationshipSeeds: ["Lian wants to hire her route talent", "Nova cannot lock onto her", "Darya sees through one illusion but not all"],
    tabooAvoid: "No exotic mystic default; keep the trick tied to character freedom.",
  },

  // UK
  {
    id: "uk_bulldog_crown_bookie", country: "UK", factionId: 7, breed: "English Bulldog", name: 'Sir Reginald "Pound" Barkington III', lane: "muggle", tone: ["comic", "shady"], role: "Crown bookie / City of London odds maker", boardRef: board("UK"),
    visualDesign: "English Bulldog in tweed waistcoat armor, betting ledger, tiny crown pin, pub-banker swagger.",
    publicMask: "Dry old-money bookie pretending every crisis is priced in.",
    hiddenWant: "Wants relevance after the empire became an odds table.",
    flaw: "Turns feelings into betting markets.",
    voice: "Dry British wit, understated insults, never raises volume.",
    comedyLoop: "He gives odds on his own team's emotional breakdown.",
    suspenseLoop: "What bet did Sir Pound place before the war started?",
    actionWow: "A brass odds board flips by itself and traps rivals inside decimal probabilities.",
    powerStyle: "Brass odds, pub piano sting, banker-green light, rain-on-window texture.",
    engagementUse: "Use for gambling jokes, dry commentary, shady market foreshadowing.",
    relationshipSeeds: ["Chairman Biscuit argues policy odds with him", "Chai Alpha hustles him", "Rublefang calls him sentimental"],
    tabooAvoid: "No monarch/politician likeness; keep it bookie/finance/pub satire.",
  },
  {
    id: "uk_corgi_palace", country: "UK", factionId: 7, breed: "Pembroke Welsh Corgi", name: "Lady Crumpet", lane: "commander", tone: ["comic", "hero"], role: "Palace protocol mage / tiny royal enforcer", boardRef: board("UK"),
    visualDesign: "Corgi in miniature ceremonial cape, teacup wand, polished shoes, unimpressed royal posture.",
    publicMask: "Tiny etiquette tyrant who weaponizes politeness.",
    hiddenWant: "Wants to be feared for competence, not adored for cuteness.",
    flaw: "Corrects manners during emergencies.",
    voice: "Posh, clipped, terrifyingly polite; every 'darling' is a warning.",
    comedyLoop: "She stops a fight because someone used the wrong fork.",
    suspenseLoop: "What ancient palace rule lets Lady Crumpet overrule a battlefield?",
    actionWow: "A teacup tap summons a circular etiquette barrier that redirects an attack.",
    powerStyle: "Porcelain rings, gold trim, polite bell chime, tiny thunder.",
    engagementUse: "Use for etiquette comedy, underdog authority, British absurdity, power reveals.",
    relationshipSeeds: ["Pip trusts her because she is small", "Marshal misunderstands her size", "France's Papillon duelist respects the drama"],
    tabooAvoid: "Avoid making cuteness the only joke.",
  },
  {
    id: "uk_collie_spy", country: "UK", factionId: 7, breed: "Border Collie", name: "Agent Woolf", lane: "operator", tone: ["thriller", "mystery"], role: "MI-style shepherd spy / pattern hunter", boardRef: board("UK"),
    visualDesign: "Border Collie in raincoat tactical scarf, newspaper/map props, sharp eyes, paw on old tape recorder.",
    publicMask: "Awkward civil servant who notices everything.",
    hiddenWant: "Wants one clean truth in a world made of propaganda.",
    flaw: "Herds people like evidence.",
    voice: "Quiet, observant, dry, slightly anxious; facts land as jokes.",
    comedyLoop: "He exposes a conspiracy and apologizes for interrupting tea.",
    suspenseLoop: "Which country has Agent Woolf already infiltrated?",
    actionWow: "Raindrops on glass connect into a spy-map of hidden faction routes.",
    powerStyle: "Rain maps, tape hiss, newspaper-flip cuts, cold streetlamp glow.",
    engagementUse: "Use for thriller arcs, clue drops, deadpan investigation, Bao/Lian counterplay.",
    relationshipSeeds: ["Bao Silence hates him", "Lian keeps leaving clues only Woolf notices", "Nari's logs make him nervous"],
    tabooAvoid: "Fictional spy grammar only; no real agencies by name in final prompts.",
  },
  {
    id: "uk_jack_russell_ultra", country: "UK", factionId: 7, breed: "Jack Russell Terrier", name: "Pint Rocket", lane: "trickster", tone: ["comic", "action"], role: "Football terrace ultras courier", boardRef: board("UK"),
    visualDesign: "Jack Russell in terrace scarf, muddy boots, messenger bag, wild grin, tiny explosive energy.",
    publicMask: "Pub-table chaos goblin with endless stamina.",
    hiddenWant: "Wants the posh characters to admit the street carries the country.",
    flaw: "Starts chants before plans.",
    voice: "Fast, cheeky, working-class football energy, punchline first.",
    comedyLoop: "He creates a crowd chant in a room of four people.",
    suspenseLoop: "Who gave Pint Rocket the chant that unlocks a vault?",
    actionWow: "A football chant becomes a shockwave that bounces rivals like pinballs.",
    powerStyle: "Terrace chant waves, pub percussion, muddy orange sparks, fast cuts.",
    engagementUse: "Use for crowd energy, chaos comedy, chase scenes, recruitment.",
    relationshipSeeds: ["Sir Pound bets on him then regrets it", "Raja loves the sports energy", "Lady Crumpet tries to civilize him"],
    tabooAvoid: "Avoid class caricature; make him competent chaos.",
  },

  // North Korea
  {
    id: "nk_marshal_pungsan", country: "North Korea", factionId: 8, breed: "Dark Pungsan", name: "Marshal Bonepaw", lane: "commander", tone: ["heel", "comic"], role: "Grandiose parade sorcerer / propaganda boss", boardRef: board("North Korea"),
    visualDesign: "Dark Pungsan in medal-heavy uniform, oversized hat, stamped state pickaxe, chest-out theatrical menace.",
    publicMask: "Loudest beast in history, according to himself.",
    hiddenWant: "Wants to know whether the room laughs at him.",
    flaw: "Gets louder whenever reality whispers.",
    voice: "Grandiose propaganda bombast, all superlatives, comic-villain volume.",
    comedyLoop: "He declares historic victory before anything starts, then blames physics.",
    suspenseLoop: "What happens when Marshal's performance finally stops being funny?",
    actionWow: "A parade-microphone blast turns synchronized chairs into a marching wall.",
    powerStyle: "Red banner blocks, brass parade hits, stamp-impact magic, loudspeaker shockwaves.",
    engagementUse: "Use for over-the-top heel comedy, crowd staging, authoritarian theater satire.",
    relationshipSeeds: ["Lady Crumpet defeats him with etiquette", "Bao thinks he is inefficient", "Pip is accidentally honest with him"],
    tabooAvoid: "No real leader likeness/names; satire the fictional faction theater.",
  },
  {
    id: "nk_pungsan_defector_comic", country: "North Korea", factionId: 8, breed: "Pungsan", name: "Comrade Button", lane: "muggle", tone: ["sincere", "comic"], role: "Control-room button guard / accidental truth teller", boardRef: board("North Korea"),
    visualDesign: "Pungsan in oversized control-room uniform, red button key, nervous eyes, too-formal posture.",
    publicMask: "Obedient guard who repeats official lines one beat too late.",
    hiddenWant: "Wants someone to ask what he thinks before he presses the button.",
    flaw: "Freezes when choice becomes personal.",
    voice: "Formal, nervous, small pauses; accidental honesty.",
    comedyLoop: "He whispers the truth because he thinks the microphone is off.",
    suspenseLoop: "Will Button press the order, or finally choose his own beat?",
    actionWow: "His hesitant paw stops a whole parade machine mid-step.",
    powerStyle: "Red button glow, loudspeaker hum, fluorescent silence, tiny paw tremor.",
    engagementUse: "Use for sincere pivots inside authoritarian comedy, tension, moral choice.",
    relationshipSeeds: ["Pip sees him as another scared small character", "Marshal terrifies him", "Agent Woolf wants his testimony"],
    tabooAvoid: "Handle with dignity; do not mock suffering.",
  },
  {
    id: "nk_northern_spitz_chorus", country: "North Korea", factionId: 8, breed: "Northern Spitz", name: "Choir Frost", lane: "wizard", tone: ["mystery", "action"], role: "Synchronized choir mage / crowd-control conductor", boardRef: board("North Korea"),
    visualDesign: "Northern Spitz with conductor cape, icy white fur, baton-pickaxe, rows of abstract chorus silhouettes behind.",
    publicMask: "Elegant conductor whose crowd moves as one body.",
    hiddenWant: "Wants a solo but only knows chorus.",
    flaw: "Cannot improvise unless the whole room does it with him.",
    voice: "Musical, controlled, eerie calm with sudden choral power.",
    comedyLoop: "He tries to make one casual conversation happen in perfect unison.",
    suspenseLoop: "Who is singing the note Choir Frost did not conduct?",
    actionWow: "A baton flick freezes a crowd in a perfect wave while one rebel note keeps moving.",
    powerStyle: "Choral drones, white-blue waveforms, baton cuts, synchronized motion.",
    engagementUse: "Use for crowd spectacle, eerie control, musical comedy, rebellion hints.",
    relationshipSeeds: ["Jin sees choreography rivalry", "Bao admires the control", "Button hears the wrong note first"],
    tabooAvoid: "No real propaganda songs; use abstract choir motifs.",
  },
  {
    id: "nk_paektu_wolf_dog", country: "North Korea", factionId: 8, breed: "Paektu Wolf-Dog", name: "Paektu Static", lane: "operator", tone: ["thriller", "mystery"], role: "Mountain broadcast saboteur / signal wolf", boardRef: board("North Korea"),
    visualDesign: "Wolf-dog silhouette in mountain comms coat, cracked radio core, red static eye-glint, rugged stealth posture.",
    publicMask: "Silent technician who fixes broadcasts by breaking them.",
    hiddenWant: "Wants the truth out, but only as static nobody can trace.",
    flaw: "Trusts signals more than allies.",
    voice: "Sparse, whispery, radio-static edges; rarely speaks.",
    comedyLoop: "His idea of a joke is replacing a speech with elevator music.",
    suspenseLoop: "Which broadcast did Paektu Static secretly leak to the outside MineBTC world?",
    actionWow: "A red-static pulse cuts every screen except one hidden mountain feed.",
    powerStyle: "Radio static, mountain fog, red scanlines as abstract light, hard signal cuts.",
    engagementUse: "Use for leak plots, thriller cliffhangers, information warfare without real claims.",
    relationshipSeeds: ["Nova and Misha detect him", "Bao wants him erased", "Button may be his only friend"],
    tabooAvoid: "No real cyber accusations; keep it fictional broadcast sabotage.",
  },

  // France
  {
    id: "france_bulldog_couture", country: "France", factionId: 9, breed: "French Bulldog", name: "Madame Mint", lane: "commander", tone: ["comic", "shady"], role: "Couture treasury designer / luxury floor defender", boardRef: board("France"),
    visualDesign: "French Bulldog in high-fashion mining armor, gold-trim cape, espresso charm, unimpressed runway posture.",
    publicMask: "Fashion tyrant who treats ugly strategy as a moral failure.",
    hiddenWant: "Wants beauty to matter in a war measured by numbers.",
    flaw: "Would rather lose stylishly than win ugly, until she secretly fixes both.",
    voice: "Suave French-accented English, elegant insults, effortless disdain.",
    comedyLoop: "She pauses a battle to redesign the villain's cape.",
    suspenseLoop: "Did Madame Mint hide the treasury key inside the outfit?",
    actionWow: "Gold thread whips from her cape and stitches a broken floor into a trap.",
    powerStyle: "Couture gold thread, espresso-cup clink, runway spotlight, burgundy shadows.",
    engagementUse: "Use for luxury comedy, shady treasury, aesthetic rivalry, visual flex.",
    relationshipSeeds: ["Rublefang wants her designer contracts", "Sir Pound respects the old-money shade", "Darya admires her beauty logic"],
    tabooAvoid: "Avoid making France only romance/Eiffel; use style, institutions, cafe, art, finance.",
  },
  {
    id: "france_poodle_philosopher", country: "France", factionId: 9, breed: "Poodle", name: "Professor Croissant", lane: "wizard", tone: ["comic", "sincere"], role: "Cafe philosopher / theory mage", boardRef: board("France"),
    visualDesign: "Poodle scholar with cafe scarf, chalk-pick wand, pastry box, elegant curls, intense debating face.",
    publicMask: "Intellectual who can turn any mistake into a theory.",
    hiddenWant: "Wants to be useful, not merely brilliant.",
    flaw: "Explains the door instead of opening it.",
    voice: "Philosophical, witty, theatrical; pauses for imaginary footnotes.",
    comedyLoop: "He wins an argument nobody knew was happening while the room floods.",
    suspenseLoop: "Which ridiculous theory is actually correct about degenBTC?",
    actionWow: "Chalk equations from a cafe table become a glowing bridge across a gap.",
    powerStyle: "Chalk sigils, accordion-ish flourish, cream/gold cafe light, pastry-box foley.",
    engagementUse: "Use for clever exposition, comedy theory, soft emotional wisdom.",
    relationshipSeeds: ["Chairman Biscuit hates his monetary philosophy", "Pip asks the question that stumps him", "Madame Mint edits his scarf mid-sentence"],
    tabooAvoid: "Do not turn into long lectures; action or joke must carry theory.",
  },
  {
    id: "france_papillon_duelist", country: "France", factionId: 9, breed: "Papillon", name: "Fleur Flash", lane: "trickster", tone: ["action", "comic"], role: "Tiny boulevard duelist / attention thief", boardRef: board("France"),
    visualDesign: "Papillon with wing-like ears, rapier-pick charm, velvet jacket, dramatic tiny silhouette.",
    publicMask: "Tiny duelist convinced the camera exists for her entrance.",
    hiddenWant: "Wants rivals to stop calling her small before she proves it.",
    flaw: "Over-choreographs every entrance.",
    voice: "Fast, theatrical, flirtatious challenge energy; sharp laugh.",
    comedyLoop: "She demands a duel over a seating arrangement.",
    suspenseLoop: "What insult will finally make Fleur stop performing and fight seriously?",
    actionWow: "Her ears/cape create butterfly-shaped afterimages that redirect attacks.",
    powerStyle: "Butterfly cuts, velvet flashes, cafe-chair impacts, tiny rapier chimes.",
    engagementUse: "Use for short-form action, comic pride, romance-flirt tension, underdog scale jokes.",
    relationshipSeeds: ["Lady Crumpet is her etiquette rival", "Pint Rocket ruins her dramatic timing", "Jin wants her entrance choreography"],
    tabooAvoid: "No romance-only reduction; she is combat-capable.",
  },
  {
    id: "france_picard_union", country: "France", factionId: 9, breed: "Berger Picard", name: "Luc Barricade", lane: "muggle", tone: ["hero", "comic"], role: "Union organizer / street barricade engineer", boardRef: board("France"),
    visualDesign: "Berger Picard with work jacket, rolled posters as abstract shapes, cobblestone shield, practical serious eyes.",
    publicMask: "Organizer who can turn five cafe chairs into a revolution.",
    hiddenWant: "Wants the small miners to stop being background extras.",
    flaw: "Schedules a protest before checking if anyone agrees.",
    voice: "Rough, earnest, sarcastic, street-level French energy.",
    comedyLoop: "He calls a strike against bad lighting.",
    suspenseLoop: "Will Luc's crowd save France or hijack the whole game economy?",
    actionWow: "Cobblestones rise into a defensive barricade as cafe chairs lock together.",
    powerStyle: "Cobblestone geometry, poster-paper flutters, brass street rhythm, warm crowd hum.",
    engagementUse: "Use for crowd action, social proof, working-class hero beats, France faction politics.",
    relationshipSeeds: ["Chai Alpha loves his grassroots tactics", "Madame Mint pretends not to need him", "Agent Woolf watches the crowd math"],
    tabooAvoid: "Keep strikes/protests fictional and funny, not real unrest footage.",
  },

  // Brazil
  {
    id: "brazil_caramelo_striker", country: "Brazil", factionId: 10, breed: "Caramelo Vira-Lata", name: "Sol Caramelo", lane: "underdog", tone: ["hero", "comic"], role: "Street-football striker / solar comeback beast", boardRef: board("Brazil"),
    visualDesign: "Caramelo street dog with football boots, sun-gold scarf, patched jersey armor, bright grin, impossible balance.",
    publicMask: "Happy street striker who jokes until the final minute.",
    hiddenWant: "Wants the world to stop treating Brazil as vibes without strategy.",
    flaw: "Celebrates before securing the ball.",
    voice: "Warm Brazilian energy, musical, playful, sudden competitive fire.",
    comedyLoop: "He turns every object into a football, including dangerous ones.",
    suspenseLoop: "Can Sol steal the mine in the final minute again?",
    actionWow: "A bicycle-kick sends a solar flare across a concrete court and flips the scoreboard.",
    powerStyle: "Solar flare trails, football chant percussion, green/yellow/blue sparks, mosaic ground glow.",
    engagementUse: "Use for comeback clips, high-energy hooks, underdog joy, sports virality.",
    relationshipSeeds: ["Raja loves the sports drama", "Kiro studies his impossible timing", "Pint Rocket starts chants for him"],
    tabooAvoid: "Do not make Brazil only carnival/beach; use football, community, ambition, joy, strategy.",
  },
  {
    id: "brazil_fila_treasury", country: "Brazil", factionId: 10, breed: "Fila Brasileiro", name: "Dona Vaulta", lane: "commander", tone: ["shady", "sincere"], role: "Treasury matriarch / favela vault protector", boardRef: board("Brazil"),
    visualDesign: "Powerful Fila Brasileiro in emerald-gold vault cloak, heavy key necklace, protective mother-boss energy.",
    publicMask: "Warm community protector who smiles while locking the vault.",
    hiddenWant: "Wants Brazil's wins to feed the block, not disappear upward.",
    flaw: "Trusts family systems more than transparent systems.",
    voice: "Low, warm, commanding; affectionate threat energy.",
    comedyLoop: "She feeds everyone before interrogating them.",
    suspenseLoop: "Who is Dona Vaulta hiding inside the treasury?",
    actionWow: "A key necklace turns into golden favela-stair geometry sealing every exit.",
    powerStyle: "Emerald/gold vault light, percussion heartbeat, staircase sigils, warm shadow.",
    engagementUse: "Use for treasury drama, community stakes, shady-but-loving authority.",
    relationshipSeeds: ["Rublefang wants access; she calls him skinny", "Madame Mint respects the vault style", "Sol owes her more than money"],
    tabooAvoid: "Avoid poverty spectacle; show community power and luxury mix.",
  },
  {
    id: "brazil_terrier_carnival_hacker", country: "Brazil", factionId: 10, breed: "Brazilian Terrier", name: "Luma Loop", lane: "trickster", tone: ["comic", "mystery"], role: "Carnival workshop hacker / rhythm illusionist", boardRef: board("Brazil"),
    visualDesign: "Brazilian Terrier with workshop goggles, feather-texture cape accents, drum-controller belt, prankster eyes.",
    publicMask: "Party engineer who says every exploit is just rhythm.",
    hiddenWant: "Wants to be known as genius, not just fun.",
    flaw: "Hides plans inside jokes until nobody follows the plan.",
    voice: "Fast, playful, rhythmic, teasing; laughs while debugging chaos.",
    comedyLoop: "Her 'sound check' accidentally hacks three countries.",
    suspenseLoop: "Which beat in Luma's music contains the real attack?",
    actionWow: "Drum hits become visible waveform steps that characters run across.",
    powerStyle: "Percussion waveforms, carnival workshop light, neon feathers as texture, joyful glitch.",
    engagementUse: "Use for viral music, rhythm action, comedy tech, surprise hacks.",
    relationshipSeeds: ["Nari wants her rhythm engine", "Momo wants the broadcast rights", "Sol thinks she is fun until she wins"],
    tabooAvoid: "Do not make carnival the whole country; use it as craft/workshop intelligence.",
  },
  {
    id: "brazil_dogo_amazon", country: "Brazil", factionId: 10, breed: "Brazilian Dogo", name: "Mato Verde", lane: "operator", tone: ["action", "mystery"], role: "Amazon route guardian / green-energy scout", boardRef: board("Brazil"),
    visualDesign: "Brazilian Dogo in jungle-tech armor, leaf-shaped power core, river-map bracer, quiet intense posture.",
    publicMask: "Silent scout who knows routes the map refuses to show.",
    hiddenWant: "Wants the war to respect the land, not just extract value.",
    flaw: "Distrusts city players before they fail.",
    voice: "Low, spare, grounded; nature metaphors without preaching.",
    comedyLoop: "He treats elite tech like a broken compass.",
    suspenseLoop: "What did Mato find under the green route that could change emissions?",
    actionWow: "Emerald roots/circuitry lift a broken path into a living bridge.",
    powerStyle: "Emerald bio-circuitry, river reflections, low drum, leaf-core pulse.",
    engagementUse: "Use for landscape wow, resource mystery, action scouting, green power contrast.",
    relationshipSeeds: ["Tara understands guardian duty", "Nova maps him poorly", "Dona Vaulta funds him secretly"],
    tabooAvoid: "Avoid simplistic jungle exoticism; make him high-tech and grounded.",
  },

  // Israel
  {
    id: "israel_canaan_cyber", country: "Israel", factionId: 11, breed: "Canaan Dog", name: "Yalla Zero", lane: "operator", tone: ["shady", "action"], role: "Cyber-startup commando / exploit hunter", boardRef: board("Israel"),
    visualDesign: "Canaan Dog in desert-tech tactical hoodie, blue-white circuit scarf, laptop gauntlet, sharp streetwise eyes.",
    publicMask: "Blunt cyber founder who says 'small bug' before breaking a fortress.",
    hiddenWant: "Wants to prove small countries can out-think giant ones.",
    flaw: "Treats people like systems to penetrate.",
    voice: "Fast, blunt Israeli-accented English, dry chutzpah, zero patience.",
    comedyLoop: "He fixes the enemy's security because it offended him.",
    suspenseLoop: "Did Yalla Zero patch the MineBTC system, or install a door?",
    actionWow: "A blue-white exploit grid opens one frame of impossible access, then vanishes.",
    powerStyle: "Desert-tech cyan, command-line sparks without readable text, sharp glitch cuts, bass click.",
    engagementUse: "Use for cyber suspense, small-country outsmarting, AGI/security plots, action hacks.",
    relationshipSeeds: ["Nova dislikes his access", "Jugaad Byte respects his shortcuts", "Agent Woolf follows his fingerprints"],
    tabooAvoid: "No real conflict claims; keep cyber as fictional game-world security.",
  },
  {
    id: "israel_baladi_market", country: "Israel", factionId: 11, breed: "Baladi Dog", name: "Shuk Ember", lane: "trickster", tone: ["comic", "sincere"], role: "Market negotiator / street-food morale captain", boardRef: board("Israel"),
    visualDesign: "Baladi dog with market-stall apron armor, ceramic plate shield, spice pouch charms, warm mischievous face.",
    publicMask: "Street negotiator who feeds rivals while bargaining.",
    hiddenWant: "Wants people to see community before conflict.",
    flaw: "Turns every emotional problem into a deal over food.",
    voice: "Warm, blunt, teasing, street-smart; 'yalla' energy but not overdone.",
    comedyLoop: "He negotiates a ceasefire over who gets the last plate.",
    suspenseLoop: "Which favor did Shuk Ember trade to keep Israel in the race?",
    actionWow: "Spice smoke forms a temporary shield-map around the market table.",
    powerStyle: "Spice smoke, ceramic clacks, warm limestone light, street percussion.",
    engagementUse: "Use for ordinary-life comedy, warmth, market deals, soft diplomacy.",
    relationshipSeeds: ["Saffron Ledger is his negotiation rival", "Chai Alpha respects the hustle", "Yalla Zero pretends he does not need morale"],
    tabooAvoid: "Avoid reducing country to security; show market, tech, desert, community.",
  },
  {
    id: "israel_pointer_drone", country: "Israel", factionId: 11, breed: "Israel Pointer", name: "Mira Lock", lane: "commander", tone: ["mystery", "action"], role: "Drone tactician / desert-grid commander", boardRef: board("Israel"),
    visualDesign: "Israel Pointer with desert command coat, small drone flock, map-scarf, calm hawk-like gaze.",
    publicMask: "Tactician who sees the battlefield as geometry.",
    hiddenWant: "Wants to prevent chaos, but control keeps asking for more control.",
    flaw: "Over-watches until trust becomes impossible.",
    voice: "Controlled, analytical, terse; warmth appears as tactical advice.",
    comedyLoop: "She sends a drone to check if someone is lying about lunch.",
    suspenseLoop: "Who is Mira watching that even Yalla Zero does not know about?",
    actionWow: "Drones form a Star-of-map-like tactical lattice without literal symbols, redirecting attacks.",
    powerStyle: "Cyan drone lattice, desert sun glare, soft rotor hum, sand-grid overlays.",
    engagementUse: "Use for surveillance thriller, strategy, desert landscape, precision action.",
    relationshipSeeds: ["Nova debates airspace with her", "Nilo Mirage evades her", "Agent Woolf wants her files"],
    tabooAvoid: "No real military operations; keep drone tactics fantasy/game-world.",
  },
  {
    id: "israel_negev_desert_dog", country: "Israel", factionId: 11, breed: "Negev Desert Dog", name: "Negev Bloom", lane: "wizard", tone: ["hero", "sincere"], role: "Desert-water alchemist / survival engineer", boardRef: board("Israel"),
    visualDesign: "Negev Desert Dog in sand-and-cyan robes, water-core staff, desert goggles, hopeful grounded expression.",
    publicMask: "Quiet engineer who grows miracles instead of announcing them.",
    hiddenWant: "Wants survival tech to matter more than war tech.",
    flaw: "Understates breakthroughs until others take credit.",
    voice: "Soft, practical, hopeful; engineering clarity with desert calm.",
    comedyLoop: "He saves a dramatic villain with irrigation and acts like it is routine maintenance.",
    suspenseLoop: "What can Negev Bloom grow inside a dead mining zone?",
    actionWow: "A water-core staff sends cyan roots through cracked stone, turning a dead floor luminous.",
    powerStyle: "Water-core cyan, sand-gold light, root circuitry, gentle chime.",
    engagementUse: "Use for sincere pivots, rebirth, science-wonder, hopeful payoff after thriller.",
    relationshipSeeds: ["Mato Verde understands him", "Darya trades poems with him", "Yalla Zero thinks hope needs better security"],
    tabooAvoid: "No miracle-tech savior cliche; show constraints and cost.",
  },
];

export function resolveCountryCharacterProfile(idOrTag: string): CountryCharacterProfile | null {
  const key = String(idOrTag || "").trim().replace(/^@/, "").toLowerCase();
  return COUNTRY_CHARACTER_PROFILES.find((p) => p.id === key) || null;
}

export function profilesForCountry(country: string): CountryCharacterProfile[] {
  const key = country.toLowerCase();
  return COUNTRY_CHARACTER_PROFILES.filter((p) => p.country.toLowerCase() === key);
}

// ─────────────────────────────────────────────────────────────────────────────
// COUNTRY BIBLES — one canonical entry per faction id (0-11).
// Leader name conflicts between the old trailer registry, the faction prompt
// files, and the artwork skill are RESOLVED here; the decision log with one
// line of reasoning per conflict lives in WORLD_BIBLE.md.
// ─────────────────────────────────────────────────────────────────────────────

export interface IdentityAnchors {
  /** Fur/face markings that must survive every style rung. */
  markings: string;
  /** Signature gear lineage that must persist across evolutions and rungs. */
  gearLineage: string;
  /** The readable one-glance silhouette. */
  silhouette: string;
}

export interface CountryVoice {
  accent: string;
  timbre: string;
}

export interface CountryColors {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}

export interface LocationCard {
  name: string;
  mode: "ordinary_life" | "faction_hq" | "luxury_landscape" | "economic_satire" | "power_evolution";
  hook: string;
}

export interface RivalryEdge {
  /** Faction code of the rival (e.g. "china"). */
  rival: string;
  kind: "primary" | "secondary";
  /** Why this pairing is dramatically sound. */
  why: string;
}

export interface CountryLeader {
  /** Canonical display name — the ONLY valid name on any surface. */
  name: string;
  title: string;
  aliases: string[];
  breed: string;
  /** Full dramatic sheet in COUNTRY_CHARACTER_PROFILES. */
  profileId: string;
  personality: string;
  catchphrases: string[];
  identityAnchors: IdentityAnchors;
  /** Voice-design prompt (accent + timbre + energy) for TTS. */
  voiceDesign: string;
  language: string;
  defaultEmotion: string;
  /** Names this leader replaced or absorbed (see WORLD_BIBLE.md decision log). */
  retiredNames: string[];
}

export interface CountryBible {
  factionId: number;
  country: string;
  code: string;
  colors: CountryColors;
  /** NFT-pipeline visual identity (ported verbatim — mint-art continuity). */
  visualIdentity: string;
  lore: { origin: string; miningStrategy: string };
  voice: CountryVoice;
  /** Muggle mining-tool flavor (wizards mine with magic, no tool). */
  miningTool: string;
  leader: CountryLeader;
  /** Profile ids of the named lieutenants in COUNTRY_CHARACTER_PROFILES. */
  lieutenantIds: string[];
  locations: LocationCard[];
  /** Cinematic-portrait rung environment (mint pipeline rung 3). */
  cinematicEnvironment: { bg: string; colors: string };
  rivals: RivalryEdge[];
}

export const COUNTRY_BIBLES: CountryBible[] = [
  // ── 0 · USA ────────────────────────────────────────────────────────────────
  {
    factionId: 0,
    country: "USA",
    code: "usa",
    colors: { primary: "#B22234", secondary: "#3C3B6E", accent: "#FFFFFF", glow: "#FFD700" },
    visualIdentity: `American patriotic aesthetic, red white and blue color scheme,
stars and stripes motifs, bald eagle symbolism, confident American swagger,
military precision mixed with tech innovation, Wall Street power vibes`,
    lore: {
      origin: `The American HashBeast Network was established in 1776 — Benjamin Franklin's hashbeast was the first Grand Woofmaster, and the network has kept a paw in every significant American institution since. Today it runs on three engines: Wall Street ticker magic, Silicon Valley wand-tech, and Hollywood loyalty spells, all broadcasting one message — victory is a subscription plan.`,
      miningStrategy: `Military might, technological innovation, cultural influence, financial markets, media control. The USA faction hosts most $degenBTC mining operations and exchange liquidity. When America mines, the world watches.`,
    },
    voice: { accent: "bold American English accent", timbre: "brash, swaggering, hype-man energy" },
    miningTool: "a star-spangled power-drill",
    leader: {
      name: 'Rex "Goldpaw" Sterling',
      title: "Supreme Commander of the American HashBeast Forces",
      aliases: ["rex", "goldpaw", "rex goldpaw", "rex sterling", "commander rex"],
      breed: "Golden Retriever",
      profileId: "usa_goldpaw_commander",
      personality:
        "Patriotic hype host who sells victory like a subscription plan; jokes before admitting fear; oversells everything until the panic leaks through.",
      catchphrases: [
        "Nobody prints panic on my watch.",
        "In $degenBTC we trust!",
        "Freedom isn't free — it's mined!",
      ],
      identityAnchors: {
        markings: "Golden fur, broad friendly head, floppy ears, wide recruitment-poster grin with one nervous flicker.",
        gearLineage: "Star-spangled cap/cape lineage, red-and-gold command armor, golden pickaxe-wand, golden ticker-ribbon magic.",
        silhouette: "Medium-large retriever, chest out, cape sweep, showman stance mid-pitch.",
      },
      voiceDesign:
        "Lively animated cartoon-dog character voice — a charismatic, slightly stylized USA commander with brash hype-man swagger, fast and expressive, comedic under pressure, like a fast-talking animated-movie hero trying not to admit the room surprised him. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "confident",
      retiredNames: ["General George Woofington III"],
    },
    lieutenantIds: ["usa_degen_fed_corgi", "usa_nasa_husky", "usa_wandtech_aussie"],
    locations: [
      { name: "Late-night diner broadcast booth", mode: "ordinary_life", hook: "Chrome-and-vinyl diner corner where Rex sells, confesses, and panics between cycles." },
      { name: "Degen Fed emissions chamber", mode: "economic_satire", hook: "Absurd central-bank wizard room where Chairman Biscuit operates huge levers as sacred theater." },
      { name: "Sunrise command plaza", mode: "luxury_landscape", hook: "Bright heroic launch plaza — gold/cyan circuit floor, commander silhouettes, big trailer energy." },
    ],
    cinematicEnvironment: {
      bg: "Inside a high-tech Pentagon command center with holographic displays, American flags, warm golden lighting through tall windows, oak conference table",
      colors: "Red, white, blue accents. Gold trim. Warm amber lighting.",
    },
    rivals: [
      { rival: "china", kind: "primary", why: "The superpower mirror: Rex's hype doctrine vs Long Wei's patience doctrine — every cycle is a referendum on which one actually works." },
      { rival: "russia", kind: "secondary", why: "Volkov is the menace that keeps Rex honest; Rex is the noise Volkov secretly respects." },
    ],
  },

  // ── 1 · China ──────────────────────────────────────────────────────────────
  {
    factionId: 1,
    country: "China",
    code: "china",
    colors: { primary: "#DE2910", secondary: "#FFDE00", accent: "#000000", glow: "#FF4500" },
    visualIdentity: `Chinese imperial and modern fusion aesthetics, red and gold color scheme,
dragon motifs and cloud patterns, traditional Chinese elements mixed with cyberpunk tech,
jade accessories, ancient wisdom meets cutting-edge technology`,
    lore: {
      origin: `The Chinese HashBeast Network predates all others, tracing lineage to the celestial dogs who guarded the Jade Emperor's throne. When humans built the Great Wall, hashbeasts built an underground network spanning the entire Middle Kingdom — and they have been filing the world's panic into five-year plans ever since.`,
      miningStrategy: `Manufacturing dominance, rare earth control, population scale, ancient network infrastructure, technological replication at terrifying speed. The China faction provides most of the physical infrastructure for the $degenBTC network.`,
    },
    voice: { accent: "Mandarin Chinese accent", timbre: "imperial, calm, wuxia-master gravitas" },
    miningTool: "a jade-handled pickaxe",
    leader: {
      name: "Grand Master Long Wei",
      title: "Supreme Dragon of the Eastern Network",
      aliases: ["long", "master long", "long wei", "minister long"],
      breed: "Chow Chow",
      profileId: "china_jade_planner_chow",
      personality:
        "Patient, calculating, proverb-shaped; says the future has already been scheduled; devastatingly calm one-line undercuts.",
      catchphrases: [
        "The patient hashbeast catches the eternal mouse.",
        "While others count in years, we count in dynasties.",
        "Harmony under heaven, $degenBTC in every wallet.",
      ],
      identityAnchors: {
        markings: "Lion-maned Chow Chow, deep-set calm eyes, heavy unhurried face.",
        gearLineage: "Jade abacus-staff, imperial strategy robes, jade time rings, red-gold command aura.",
        silhouette: "Compact heavy mane dome, planted posture that makes rooms feel scheduled.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — calm imperial gravitas, slow and weighted, dry wit, Mandarin-accented English, the unhurried patience of someone who has already won. Characterful, not a flat human announcer.",
      language: "English",
      defaultEmotion: "calm",
      retiredNames: ["Minister Long"],
    },
    lieutenantIds: ["china_factory_shih_tzu", "china_no_opposition_pekingese", "china_crested_ghost_exporter"],
    locations: [
      { name: "Jade planning hall", mode: "faction_hq", hook: "Calm red-lacquer strategy chamber where the war feels inevitable and controlled." },
      { name: "Shenzhen wand-tech workshop", mode: "ordinary_life", hook: "Dense workshop where invention, copying, and improvement become visual comedy." },
      { name: "High-speed empire skyline", mode: "luxury_landscape", hook: "Rail-and-glass landscape that says scale and patience in one shot." },
    ],
    cinematicEnvironment: {
      bg: "Inside an imperial palace hall with red silk curtains, golden dragon motifs, jade ornaments, dramatic red and gold lantern lighting",
      colors: "Deep red and gold. Jade green accents.",
    },
    rivals: [
      { rival: "usa", kind: "primary", why: "The superpower mirror: Long Wei wants to defeat USA without ever looking rushed; Rex needs to beat China before anyone notices he is scared." },
      { rival: "japan", kind: "secondary", why: "Precision vs replication: Kiro Cutline's one perfect cut against Mei Spark's perfected copy of it." },
    ],
  },

  // ── 2 · Russia ─────────────────────────────────────────────────────────────
  {
    factionId: 2,
    country: "Russia",
    code: "russia",
    colors: { primary: "#D52B1E", secondary: "#0039A6", accent: "#FFFFFF", glow: "#8B4513" },
    visualIdentity: `Russian imperial and Soviet fusion aesthetics, red white and blue,
double-headed eagle motifs, ushanka and military styling, Orthodox religious elements,
cold weather gear, brutalist architecture hints, vodka culture references`,
    lore: {
      origin: `The Russian HashBeast Network traces its lineage to the dire wolves that guarded the first Slavic tribes. When the Dark Lord's loyal hashbeast created $degenBTC, the Russian network recognized the mathematics of power — something it had practiced since the Tsars. When the empire "fell," the network simply went deeper underground, re-emerging as oligarchs, signal monks, and frost war-mages.`,
      miningStrategy: `Natural resources, nuclear capability, cyber expertise, geographic buffer between East and West, intelligence networks. Russia hosts underground $degenBTC mining operations in Siberian bunkers where the cold is a feature, not a bug.`,
    },
    voice: { accent: "deep Russian accent", timbre: "stoic, gravelly, menacing bravado" },
    miningTool: "a heavy iron sledge-pick",
    leader: {
      name: 'Marshal Viktor "Frostline" Volkov',
      title: "Supreme Commissar of the Eastern HashBeast Territories",
      aliases: ["volkov", "frostline", "viktor volkov", "marshal volkov", "volkov frostline"],
      breed: "Siberian Husky",
      profileId: "russia_frost_husky",
      personality:
        "Cold, calculating, chess grandmaster mentality; treats threats like weather reports; respect comes out as intimidation.",
      catchphrases: [
        "In Russia, $degenBTC mines you.",
        "The patient wolf eats the eager bear.",
        "There are no accidents, only opportunities not yet exploited.",
      ],
      identityAnchors: {
        markings: "White-and-grey husky facial mask markings, erect ears, icy unblinking eyes, frost breath.",
        gearLineage: "Heavy military greatcoat, iron collar core, frost pressure aura, iron-grey war gear.",
        silhouette: "Statue-still upright greatcoat block; the room gets colder before he moves.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — deep gravelly Russian-accented English, menacing but characterful, minimal words, threats as flat statements of fact, long pauses. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "cold",
      retiredNames: [],
    },
    lieutenantIds: ["russia_oligarch_borzoi", "russia_samoyed_signal", "russia_yakutian_laika_sled"],
    locations: [
      { name: "Frost bunker chess room", mode: "faction_hq", hook: "Cold bunker-office with chessboard, samovar, and frosted glass — menace through quiet." },
      { name: "Snow courtyard tea table", mode: "ordinary_life", hook: "Ordinary winter courtyard where warnings are delivered over tea." },
      { name: "Aurora energy route", mode: "luxury_landscape", hook: "Vast frozen route under aurora light — sled lines, power lines, hidden signals." },
    ],
    cinematicEnvironment: {
      bg: "Inside a Kremlin war room with dark wood paneling, military maps on walls, snow visible through frosted windows, cold blue lighting mixed with warm lamp light",
      colors: "Deep blue, white, red. Cold tones.",
    },
    rivals: [
      { rival: "usa", kind: "primary", why: "Volkov wants a worthy opponent because easy victories feel empty; Rex is the loudest available proof that the war matters." },
      { rival: "uk", kind: "secondary", why: "The quiet war: Agent Woolf keeps decoding signals Moscow never admits sending; Misha Snowblind hears Woolf listening." },
    ],
  },

  // ── 3 · India ──────────────────────────────────────────────────────────────
  {
    factionId: 3,
    country: "India",
    code: "india",
    colors: { primary: "#FF9933", secondary: "#138808", accent: "#000080", glow: "#FFD700" },
    visualIdentity: `Indian cultural fusion of ancient and modern, saffron and gold tones,
mandala patterns, spiritual symbols, Bollywood glamour mixed with tech startup vibes,
Hindi-English fusion, chai culture, cricket references, monsoon aesthetics`,
    lore: {
      origin: `The Indian HashBeast Network is the oldest in existence — the Vedas speak of divine dogs who guarded the path to the afterlife. When the Dark Lord's loyal hashbeast created $degenBTC, the Indian network recognized it immediately: digital dharma. The mathematical patterns in blockchain are identical to ancient mantras, and the comeback is a national art form.`,
      miningStrategy: `Technological workforce, spiritual authority, population scale, Bollywood influence, diaspora network, jugaad engineering. India runs the largest $degenBTC development operation — most blockchain code has been touched by Indian paws.`,
    },
    voice: { accent: "Indian English accent", timbre: "fast, clever, proud and animated" },
    miningTool: "a gilded chakra-pick",
    leader: {
      name: "Raja Coverdrive",
      title: "Captain of the Subcontinent Mining XI",
      aliases: ["raja", "raja coverdrive", "coverdrive"],
      breed: "Rajapalayam",
      profileId: "india_raja_cricket",
      personality:
        "Bollywood-bright underdog who turns doubt into a stadium chant; performs confidence until he nearly believes it; cricket metaphors for everything.",
      catchphrases: [
        "Doubt me again — I bat better angry.",
        "The scoreboard always believes last.",
        "One over left, full house. Watch this.",
      ],
      identityAnchors: {
        markings: "Tall pure-white Rajapalayam sighthound, noble face, huge grin with one nervous crack.",
        gearLineage: "Cricket pads worn as armor, gilded chakra-pickaxe bat, monsoon cape.",
        silhouette: "Long-limbed athletic sighthound, bat slung over shoulder, mid-stride swagger.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — fast, clever, warm Indian-accented English, Bollywood-bright playful energy, an underdog with heart, like a lovable animated-movie hero. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "playful",
      retiredNames: ["Guru Bhairava"],
    },
    lieutenantIds: ["india_bazaar_spitz", "india_pariah_founder", "india_himalayan_guardian"],
    locations: [
      { name: "Monsoon cricket war room", mode: "faction_hq", hook: "Stadium-turned-command-room where strategy sounds like a team talk in the rain." },
      { name: "Rooftop chai lab", mode: "ordinary_life", hook: "Chai steam, cracked laptops, and market maps only Chai Alpha can read." },
      { name: "Neon stepwell arena", mode: "luxury_landscape", hook: "Ancient stepwell geometry lit like a finals night — old stone, new lights." },
    ],
    cinematicEnvironment: {
      bg: "Inside an ornate Rajasthani palace with intricate marble carvings, colorful stained glass, marigold garlands, warm golden temple lighting",
      colors: "Saffron orange, white, green. Rich gold.",
    },
    rivals: [
      { rival: "uk", kind: "primary", why: "The bookie never gives India fair odds: Raja's comeback arcs exist to make Sir Pound tear up the betting slip on live broadcast." },
      { rival: "brazil", kind: "secondary", why: "Underdog kinship turned sports feud — Raja and Sol Caramelo both claim the comeback crown, and only one scoreboard can flip last." },
    ],
  },

  // ── 4 · Japan ──────────────────────────────────────────────────────────────
  {
    factionId: 4,
    country: "Japan",
    code: "japan",
    colors: { primary: "#BC002D", secondary: "#FFFFFF", accent: "#000000", glow: "#FFB7C5" },
    visualIdentity: `Japanese aesthetic fusion of traditional and hyper-modern,
cherry blossom motifs, samurai and ninja elements, anime-inspired styling,
clean minimalist design mixed with neon cyberpunk, shrine and temple influences`,
    lore: {
      origin: `The Japanese HashBeast Network descends from the legendary komainu — the guardian dog-lions of Shinto shrines. When $degenBTC emerged, Japanese hashbeasts recognized it immediately: the prophecy of the thousand-year token. Nine generations of shoguns have guarded the syndicate; the ninth still waits at the gate, as the first one promised.`,
      miningStrategy: `Technological innovation, cultural soft power, gaming industry dominance, robotics automation. Japan hosts the most sophisticated automated $degenBTC mining operations in the world — one perfect cut beats a thousand speeches.`,
    },
    voice: { accent: "Japanese accent", timbre: "disciplined, intense, samurai honor" },
    miningTool: "a katana-forged pick",
    leader: {
      name: "Shogun Hachiko IX",
      title: "Eternal Guardian of the Rising Sun Mining Syndicate",
      aliases: ["hachiko", "shogun hachiko", "hachiko ix", "the shogun"],
      breed: "Akita Inu",
      profileId: "japan_shogun_hachiko",
      personality:
        "Honorable, precise, loyal past the point of reason; speaks in haiku when emotional; waits longer than any rival believes possible, then moves once.",
      catchphrases: [
        "The nail that stands / Shall hammer other nails / Such is $degenBTC.",
        "In the way of the hashbeast, there is no second place in the Mining Wars.",
      ],
      identityAnchors: {
        markings: "Red-brown Akita coat, curled tail, calm dark guardian eyes, white muzzle blaze.",
        gearLineage: "Samurai hakama over modern tactical vest, neon katana-pick, shogun crest charm.",
        silhouette: "Square-shouldered seated-guardian stillness that explodes into one clean cut.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — measured Japanese-accented English with samurai-honor weight, quiet discipline, formal cadence that turns into haiku when emotion breaks through. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "calm",
      retiredNames: [],
    },
    lieutenantIds: ["japan_shiba_precision", "japan_akita_salaryman", "japan_spitz_idolbot", "japan_shikoku_kaiju"],
    locations: [
      { name: "Tatami strategy studio", mode: "faction_hq", hook: "Paper-screen war room where one chalk line decides a cycle." },
      { name: "Konbini alley control point", mode: "ordinary_life", hook: "Neon convenience-store alley where precision meets 2 AM exhaustion." },
      { name: "Sunrise city-grid dojo", mode: "luxury_landscape", hook: "Rooftop dojo over a perfect city grid — Mt. Fuji on the horizon, rain split clean." },
    ],
    cinematicEnvironment: {
      bg: "Inside a traditional Japanese castle with sliding shoji screens, katana display wall, cherry blossom branches, soft diffused paper lantern lighting",
      colors: "White, red. Cherry pink accents.",
    },
    rivals: [
      { rival: "southkorea", kind: "primary", why: "The broadcast war: Momo's cute-propaganda machine against Jin's idol formations for ownership of the world's screen time." },
      { rival: "china", kind: "secondary", why: "Precision vs replication — Kiro's perfect timing keeps being copied one week later, slightly improved, by Mei Spark." },
    ],
  },

  // ── 5 · South Korea ────────────────────────────────────────────────────────
  {
    factionId: 5,
    country: "South Korea",
    code: "southkorea",
    colors: { primary: "#CD2E3A", secondary: "#0047A0", accent: "#FFFFFF", glow: "#FF69B4" },
    visualIdentity: `Korean aesthetic fusion of traditional hanbok and ultra-modern K-pop,
neon cyber elements, pastel kawaii undertones, Samsung tech sleekness,
K-drama beauty standards, esports gaming culture, Gangnam luxury style`,
    lore: {
      origin: `The Korean HashBeast Network emerged from the ancient Jindo dogs who guarded Korean royalty for millennia. When the Korean Wave began spreading globally, hashbeasts recognized it as the perfect vehicle for faction expansion — K-pop, K-dramas, Korean skincare: all faction vectors, all choreographed.`,
      miningStrategy: `Cultural export dominance, semiconductor supremacy, esports excellence, beauty industry control. Korean hashbeasts have the highest $degenBTC adoption rate among youth worldwide — every fan is a miner, every stream is a transaction.`,
    },
    voice: { accent: "Korean accent", timbre: "slick, idol-bright, K-pop charisma" },
    miningTool: "a hi-tech laser-drill",
    leader: {
      name: "Jin Seoulflash",
      title: "Idol Captain of the Hallyu Mining Crew",
      aliases: ["jin", "seoulflash", "jin seoulflash", "captain jin"],
      breed: "Jindo",
      profileId: "korea_jindo_idol_captain",
      personality:
        "Perfect performer who makes recruitment look choreographed; smiles through exhaustion; wants one unscripted win that is not managed by a company.",
      catchphrases: [
        "Every fan is a miner. Every stream is a transaction.",
        "Formation breaks. Stars don't.",
      ],
      identityAnchors: {
        markings: "Cream-white Jindo coat, fighter eyes under idol polish, perfect stage posture.",
        gearLineage: "Glossy stage-battle jacket, headset charm, neon sneakers, light-stick baton.",
        silhouette: "Performance-straight spine at the formation point, one paw raised for the count-in.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — glossy energetic Korean-accented English, stage charisma and quick hype phrases, idol-bright but with fighter steel underneath. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "confident",
      retiredNames: ["Chaebol Chairman Kim Jinhashbeast"],
    },
    lieutenantIds: ["korea_pc_bang_sapsali", "korea_chaebol_pungsan", "korea_white_jindo_stunt"],
    locations: [
      { name: "Idol-war rehearsal room", mode: "faction_hq", hook: "Mirror-walled rehearsal room where strategy meetings keep turning into choreography." },
      { name: "PC-bang neon booth", mode: "ordinary_life", hook: "Noodle cups and ghost cursors — Nari saves the country without leaving the chair." },
      { name: "Seoul rooftop LED city", mode: "luxury_landscape", hook: "Rooftop over an LED canyon — the city itself is the light show." },
    ],
    cinematicEnvironment: {
      bg: "Inside an ultra-modern Seoul tech headquarters with curved glass walls, LED accent strips, clean white and cyan lighting",
      colors: "Cyan, white, sleek modern neon.",
    },
    rivals: [
      { rival: "northkorea", kind: "primary", why: "The divided mirror: Jin's voluntary synchronization against Choir Frost's commanded unison — the same instinct, opposite consent." },
      { rival: "japan", kind: "secondary", why: "Broadcast supremacy — Momo Broadcast and Jin fight for the same global audience with opposite tools: cuteness vs choreography." },
    ],
  },

  // ── 6 · Iran ───────────────────────────────────────────────────────────────
  {
    factionId: 6,
    country: "Iran",
    code: "iran",
    colors: { primary: "#239F40", secondary: "#DA0000", accent: "#FFFFFF", glow: "#FFD700" },
    visualIdentity: `Persian aesthetic, Islamic geometric patterns, turquoise and gold mosaics,
desert and mountain landscapes, ancient Persepolis columns,
Safavid architecture, calligraphic art, Persian miniature painting style`,
    lore: {
      origin: `The Persian HashBeast Network predates all others. When Cyrus the Great's royal hound first howled at the fire temples, the ancient pact was sealed — and for millennia Persian hashbeasts encoded the secret of $degenBTC into tile geometry and poetry. Every verse is a vault key; every carpet pattern is a route map. Isolation never weakened the network: isolated systems can't be hacked.`,
      miningStrategy: `Poetry-encrypted mining algorithms, vault-keeper discipline, bazaar back-channels, and desert mirage logistics. Iran's underground $degenBTC enrichment runs at industrial scale behind the oldest doors in the Mining Wars.`,
    },
    voice: { accent: "Persian accent", timbre: "regal, poetic, simmering defiance" },
    miningTool: "an ornate scimitar-pick",
    leader: {
      name: "Rostam Gate",
      title: "Gatekeeper of the Persian Vaults",
      aliases: ["rostam", "rostam gate", "the gate"],
      breed: "Sarabi Mastiff",
      profileId: "iran_sarabi_gatekeeper",
      personality:
        "Unmovable guardian who says little because the door already answered; wants his country feared less and respected more; guards pain so tightly nobody can help.",
      catchphrases: [
        "The door decides who is worthy. I am the door.",
        "Persia was counting in dynasties before your network had a name.",
      ],
      identityAnchors: {
        markings: "Massive Sarabi mastiff, fortress shoulders, protective unblinking stare.",
        gearLineage: "Bronze gate armor, bazaar-key belt, gate sigils that slam corridors shut.",
        silhouette: "Door-shaped bulk planted like architecture — when he sets a paw, the map changes.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — deep, steady Persian-accented English with ancient-hero weight, few words, protective warmth under bronze. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "calm",
      retiredNames: ["Ayatollah Bark-hamenei"],
    },
    lieutenantIds: ["iran_saluki_poet", "iran_bazaar_shepherd", "iran_khalaj_mirage"],
    locations: [
      { name: "Turquoise vault courtyard", mode: "faction_hq", hook: "Tiled courtyard over the deepest vault — every faction thinks it hides a weapon." },
      { name: "Bazaar tea negotiation room", mode: "ordinary_life", hook: "Tea first, then the price is a favor — Saffron Ledger's office." },
      { name: "Desert mirror route", mode: "luxury_landscape", hook: "Heat-shimmer dunes where three Nilos cross a courtyard and none of them was real." },
    ],
    cinematicEnvironment: {
      bg: "Inside a grand Persian palace with geometric tilework, arched doorways, ornate carpets, moody golden light filtering through lattice screens",
      colors: "Green, gold, white. Persian blue tile accents.",
    },
    rivals: [
      { rival: "israel", kind: "primary", why: "The desert signal duel: Mira Lock's drone lattice can map everything in the Mining Wars except Nilo Mirage — and both sides know it." },
      { rival: "uk", kind: "secondary", why: "Agent Woolf mistrusts how polite Saffron Ledger is; Saffron finds Woolf's suspicion adorable and bills him for the tea." },
    ],
  },

  // ── 7 · UK ─────────────────────────────────────────────────────────────────
  {
    factionId: 7,
    country: "UK",
    code: "uk",
    colors: { primary: "#012169", secondary: "#C8102E", accent: "#FFFFFF", glow: "#FFD700" },
    visualIdentity: `British regal aesthetic, Union Jack motifs, Victorian architecture,
London fog atmosphere, royal insignia, Big Ben and Parliament, tweed and brass,
proper stiff-upper-lip elegance, MI6 spy sophistication`,
    lore: {
      origin: `The British HashBeast Network was formalised in 1066 when William the Conqueror's war-hound seized the Magical Crown alongside the mortal one. For a thousand years, corgis have secretly ruled from the palace. The "British Empire" was built to establish $degenBTC mining colonies worldwide — decolonisation was just offshoring, and the network kept every node.`,
      miningStrategy: `Financial sorcery through the City of London — the oldest financial centre on Earth. The Commonwealth is a distributed mining pool spanning 56 nations. Tea breaks are synchronised network checkpoints. The British invented queuing — and blockchain is just a queue.`,
    },
    voice: { accent: "posh British English accent", timbre: "dry, witty, theatrically composed" },
    miningTool: "a polished gentleman's pick",
    leader: {
      name: 'Sir Reginald "Pound" Barkington III',
      title: "Lord Chancellor of the Royal HashBeast Privy Council & Crown Bookie",
      aliases: ["sir pound", "pound", "barkington", "sir barkington", "pound sterling"],
      breed: "English Bulldog",
      profileId: "uk_bulldog_crown_bookie",
      personality:
        "Impeccably polite, devastatingly sarcastic, underestimates nothing, tea obsessed; prices every crisis in and gives odds on his own team's emotional breakdown.",
      catchphrases: [
        "Keep calm and mine $degenBTC.",
        "The Empire strikes back — with compound interest.",
        "It's all priced in, darling. Even you.",
      ],
      identityAnchors: {
        markings: "Stocky English bulldog jowls, unimpressed half-lidded eyes, pub-banker swagger.",
        gearLineage: "Tweed waistcoat armor, brass odds-board ledger, tiny crown pin.",
        silhouette: "Low square block with a ledger under one arm — built like a safe, moves like a verdict.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — dry posh British wit, understated insults delivered at conversational volume, never hurried, the bored confidence of old money. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "deadpan",
      retiredNames: ["Sir Barkington the Third", "Sir Pound Sterling"],
    },
    lieutenantIds: ["uk_corgi_palace", "uk_collie_spy", "uk_jack_russell_ultra"],
    locations: [
      { name: "Rainy pub odds table", mode: "ordinary_life", hook: "Rain on the window, brass odds board flipping by itself, every feeling turned into a market." },
      { name: "Old library spy corridor", mode: "faction_hq", hook: "Tape hiss and rain-maps — Agent Woolf's corridor of connected raindrops." },
      { name: "Cloudy crown-city terrace", mode: "luxury_landscape", hook: "Grey grandeur over the old financial mile — the empire as an odds table." },
    ],
    cinematicEnvironment: {
      bg: "Inside a classic British parliament chamber with dark wood, green leather benches, gothic arched windows, warm candlelight mixed with grey London light",
      colors: "Navy blue, red, gold. Dark wood.",
    },
    rivals: [
      { rival: "france", kind: "primary", why: "The eternal cross-channel taste war: Lady Crumpet vs Fleur Flash on etiquette, Sir Pound vs Madame Mint on whether money or style is the older power." },
      { rival: "india", kind: "secondary", why: "Raja keeps winning the bets Sir Pound prices as impossible — and the terrace chants get louder every time." },
    ],
  },

  // ── 8 · North Korea ────────────────────────────────────────────────────────
  {
    factionId: 8,
    country: "North Korea",
    code: "northkorea",
    colors: { primary: "#ED1C27", secondary: "#024FA2", accent: "#FFFFFF", glow: "#FF0000" },
    visualIdentity: `North Korean Juche aesthetic, revolutionary red and blue,
military precision, propaganda poster styling, Pyongyang architecture,
mass games coordination, extreme discipline, retro-futuristic isolation,
16-bit pixel art style, standing on holographic platform, space/Earth visible`,
    lore: {
      origin: `The DPRK HashBeast Network claims the purest lineage of all factions — uncontaminated by outside influence. When the peninsula divided, the Northern network chose isolation as strength, and the Dark Lord's loyal hashbeast recognized that purity. The hermit kingdom is actually the sanctuary kingdom: the one place where the network's interests are protected absolutely — according, at least, to the Marshal's own broadcasts.`,
      miningStrategy: `Cyber capability, total operational security, ideological warriors, sanctuary territory, and the loudest parades in the Mining Wars. North Korea is the network's black-ops division — doing what other factions cannot acknowledge, then announcing it anyway.`,
    },
    voice: { accent: "stern Korean accent", timbre: "rigid, grandiose, propaganda-bombastic" },
    miningTool: "a stamped state-issue pickaxe",
    leader: {
      name: "Marshal Bonepaw",
      title: "Eternal Chairman of the Revolutionary HashBeast Committee",
      aliases: ["marshal", "marshal bonepaw", "bonepaw"],
      breed: "Dark Pungsan",
      profileId: "nk_marshal_pungsan",
      personality:
        "Grandiose parade sorcerer; the loudest beast in history according to himself; gets louder whenever reality whispers; secretly wants to know whether the room laughs at him.",
      catchphrases: [
        "There is no bear market in our network! Only revolutionary gains!",
        "History will remember this as the GREATEST mining victory of all time!",
      ],
      identityAnchors: {
        markings: "Dark Pungsan coat, manic grandiose expression, chest perpetually puffed.",
        gearLineage: "Medal-heavy uniform, oversized hat, stamped state pickaxe, loudspeaker aura.",
        silhouette: "Chest-out parade puff under a hat larger than his head.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — grandiose comic-villain state-propaganda bombast, Korean-accented English, maximum volume and superlatives, gleefully over-the-top like an animated-movie antagonist. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "bombastic",
      retiredNames: ["Supreme General Kim Il-Bark"],
    },
    lieutenantIds: ["nk_pungsan_defector_comic", "nk_northern_spitz_chorus", "nk_paektu_wolf_dog"],
    locations: [
      { name: "Parade control hall", mode: "faction_hq", hook: "Synchronized chairs, stamped banners, one microphone that turns furniture into a marching wall." },
      { name: "Control-room waiting bench", mode: "ordinary_life", hook: "Comrade Button and the red button, one beat too late, microphone accidentally on." },
      { name: "Monumental empty plaza", mode: "luxury_landscape", hook: "Vast stone emptiness staged for a crowd that moves as one body — and one rebel note." },
    ],
    cinematicEnvironment: {
      bg: "Inside a stark propaganda-decorated bunker with military medals display case, harsh fluorescent mixed with dramatic spotlight",
      colors: "Dark red, military green, gold stars.",
    },
    rivals: [
      { rival: "southkorea", kind: "primary", why: "The divided mirror: Choir Frost envies Jin's crowds because they synchronize voluntarily — the one trick the conductor cannot command." },
      { rival: "uk", kind: "secondary", why: "Agent Woolf wants Comrade Button's testimony; the Marshal wants Woolf's raincoat as a trophy. Neither will admit how often they listen to each other." },
    ],
  },

  // ── 9 · France ─────────────────────────────────────────────────────────────
  {
    factionId: 9,
    country: "France",
    code: "france",
    colors: { primary: "#002395", secondary: "#FFFFFF", accent: "#ED2939", glow: "#FFD700" },
    visualIdentity: `French elegant aesthetic, bleu blanc rouge tricolor,
fleur-de-lis motifs, haute couture sophistication, cafe culture,
Parisian architecture, revolutionary symbolism, wine and cheese refinement`,
    lore: {
      origin: `The French HashBeast Network traces its lineage to the royal dogs of Versailles. When the Sun King declared "L'état, c'est moi," his hashbeast whispered "Non, c'est nous." The Revolution? Orchestrated by hashbeast republicans tired of aristocratic hashbeast excess. The network has run Europe's aesthetic operations ever since — because ugly strategy is a moral failure.`,
      miningStrategy: `Cultural authority, luxury industry control, European coordination, philosophical agenda-setting. France runs the network's aesthetic operations and coordinates Mining Wars strategy across Europe — preferably over espresso.`,
    },
    voice: { accent: "French accent", timbre: "suave, haughty, effortlessly cool" },
    miningTool: "an artisan engraved pick",
    leader: {
      name: "Madame Mint",
      title: "Grande Couturière of the European Treasury",
      aliases: ["madame mint", "mint", "la couturiere"],
      breed: "French Bulldog",
      profileId: "france_bulldog_couture",
      personality:
        "Fashion tyrant who treats ugly strategy as a moral failure; would rather lose stylishly than win ugly — until she secretly fixes both; elegant insults as a love language.",
      catchphrases: [
        "The Americans have money. We have taste. Taste always wins in the Mining Wars.",
        "Liberté, égalité, $degenBTC-ité!",
        "I do not redesign losers. Win first, then we talk capes.",
      ],
      identityAnchors: {
        markings: "French bulldog bat ears, unimpressed runway face, immaculate grooming.",
        gearLineage: "High-fashion mining armor, gold-trim cape, living gold thread, espresso charm.",
        silhouette: "Compact couture block, cape drape, chin permanently up.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — suave French-accented English, elegant disdain, effortless cool, every insult tailored like couture. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "unimpressed",
      retiredNames: ["Comte Louis de Woofbourg"],
    },
    lieutenantIds: ["france_poodle_philosopher", "france_papillon_duelist", "france_picard_union"],
    locations: [
      { name: "Couture treasury atelier", mode: "faction_hq", hook: "Gold thread, treasury keys sewn into hems, a battle paused to redesign the villain's cape." },
      { name: "Cafe theory table", mode: "ordinary_life", hook: "Professor Croissant wins arguments nobody knew were happening while the room floods." },
      { name: "Parisian MineBTC boulevard", mode: "luxury_landscape", hook: "Boulevard elegance with barricade potential — cobblestones remember the revolution." },
    ],
    cinematicEnvironment: {
      bg: "Inside a lavish Versailles-style salon with gilded mirrors, crystal chandeliers, rococo ceiling, warm romantic Parisian golden light",
      colors: "Blue, white, red. Gold gilding.",
    },
    rivals: [
      { rival: "uk", kind: "primary", why: "The eternal cross-channel taste war: old money vs old style — Sir Pound prices beauty, Madame Mint refuses to believe beauty has a price." },
      { rival: "brazil", kind: "secondary", why: "Aesthetic supremacy: Madame Mint's couture against Luma Loop's carnival engineering — atelier discipline vs workshop joy." },
    ],
  },

  // ── 10 · Brazil ────────────────────────────────────────────────────────────
  {
    factionId: 10,
    country: "Brazil",
    code: "brazil",
    colors: { primary: "#009C3B", secondary: "#FFDF00", accent: "#002776", glow: "#FFD700" },
    visualIdentity: `Brazilian vibrant aesthetic, green and yellow scheme,
Carnaval energy, samba rhythm, Amazon jungle mysticism, favela resilience,
football passion, beach culture, tropical maximalism, capoeira flow`,
    lore: {
      origin: `The Brazilian HashBeast Network emerged from the mystical creatures of the Amazon — the legendary Curupira and the Boto, who were ancient hashbeast forms all along. When the Dark Lord's loyal hashbeast spread the $degenBTC gospel, Brazilian hashbeasts recognized kindred magic in the immutable ledger, like the eternal flow of the river. The network thrives on "jeitinho brasileiro" — the magical talent for finding the creative solution in the final minute.`,
      miningStrategy: `South America's largest economy, the Amazon's magical resources, and the world's most infectious cultural exports. Brazilian hashbeasts maximize $degenBTC yields through jeitinho optimization — and steal the mine back in stoppage time.`,
    },
    voice: { accent: "Brazilian Portuguese accent", timbre: "warm, rhythmic, carnival-loud" },
    miningTool: "a carnival-painted pickaxe",
    leader: {
      name: "Sol Caramelo",
      title: "Supreme Malandro of the South American Network",
      aliases: ["sol", "sol caramelo", "caramelo", "senhor caramelo"],
      breed: "Caramelo Vira-Lata",
      profileId: "brazil_caramelo_striker",
      personality:
        "Happy street striker who jokes until the final minute; wants the world to stop treating Brazil as vibes without strategy; celebrates before securing the ball.",
      catchphrases: [
        "Why worry? The Mining Wars are eternal. First, we dance!",
        "$degenBTC e samba? Same thing, my friend — rhythm, community, and joy!",
        "Stoppage time is MY time.",
      ],
      identityAnchors: {
        markings: "Caramel-tan vira-lata coat, white chest flash, bright grin, impossible balance.",
        gearLineage: "Patched jersey armor, football boots, sun-gold scarf, solar-flare ball magic.",
        silhouette: "Lean street-athlete bounce, ball glued to one paw, mid-celebration lean.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — warm musical Brazilian-accented English, playful carnival energy with sudden competitive fire, like a street-footballer hero who narrates his own highlight reel. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "playful",
      retiredNames: ["Senhor Caramelo"],
    },
    lieutenantIds: ["brazil_fila_treasury", "brazil_terrier_carnival_hacker", "brazil_dogo_amazon"],
    locations: [
      { name: "Concrete football court", mode: "ordinary_life", hook: "Cracked concrete, chalk goal, scoreboard that flips in the final minute." },
      { name: "Community vault stairway", mode: "faction_hq", hook: "Dona Vaulta's golden stair-geometry — everyone eats before anyone is interrogated." },
      { name: "Solar city-river arena", mode: "luxury_landscape", hook: "Sun-flare river arena where the city, the forest, and the game share one shot." },
    ],
    cinematicEnvironment: {
      bg: "Inside a glass penthouse above a sun-drenched coastal city, tropical greenery, gold and emerald finishes, sunset over the bay",
      colors: "Green, gold, blue. Tropical luxury.",
    },
    rivals: [
      { rival: "india", kind: "primary", why: "The comeback crown: Raja and Sol are friends, rivals, and the two beasts every montage saves for last — only one scoreboard can flip last." },
      { rival: "france", kind: "secondary", why: "Style war: carnival engineering vs couture discipline — Luma Loop keeps remixing Madame Mint's runway music without asking." },
    ],
  },

  // ── 11 · Israel ────────────────────────────────────────────────────────────
  {
    factionId: 11,
    country: "Israel",
    code: "israel",
    colors: { primary: "#0038B8", secondary: "#FFFFFF", accent: "#0038B8", glow: "#FFD700" },
    visualIdentity: `Israeli tech-military aesthetic, Star of David motifs, Bauhaus Tel Aviv,
ancient Jerusalem stone, startup culture meets ancient civilization,
Negev desert tech installations, Mediterranean coast, kibbutz agriculture meets AI`,
    lore: {
      origin: `When King Solomon built the Temple, the architects embedded mining algorithms into the foundation stones — the oldest walls have been silently computing for three thousand years. The modern network calls itself the Startup Nation because every garage is a decode lab for Solomon's blockchain, and the desert keeps the servers cool at night.`,
      miningStrategy: `Military-grade cybersecurity protects the network; desert solar farms power it; a drone lattice maps every route in and out. When you're small and surrounded, you build the best defences — digital and physical — and you grow miracles in dead ground.`,
    },
    voice: { accent: "Israeli accent", timbre: "sharp, blunt, street-smart grit" },
    miningTool: "a precision tech-pick",
    leader: {
      name: "Mira Lock",
      title: "Director of the $degenBTC Defence Forces (DDF)",
      aliases: ["mira", "mira lock", "the director"],
      breed: "Israel Pointer",
      profileId: "israel_pointer_drone",
      personality:
        "Hyper-competent tactician who sees the battlefield as geometry; wants to prevent chaos, but control keeps asking for more control; warmth appears as tactical advice.",
      catchphrases: [
        "We don't have oil, we don't have size — we have brains. $degenBTC runs on brains.",
        "The best defence is a good algorithm.",
      ],
      identityAnchors: {
        markings: "Sleek Israel Pointer coat, calm hawk-like gaze, desert-sun squint.",
        gearLineage: "Desert command coat, orbiting drone flock, map-scarf, cyan tactical lattice.",
        silhouette: "Still vertical watcher with a drone halo — the quietest silhouette on the board.",
      },
      voiceDesign:
        "Stylized animated cartoon-dog character voice — controlled analytical Israeli-accented English, terse and precise, dry confidence, warmth surfacing only as tactical advice. Not a flat human announcer.",
      language: "English",
      defaultEmotion: "calm",
      retiredNames: ["General Barkowitz"],
    },
    lieutenantIds: ["israel_canaan_cyber", "israel_baladi_market", "israel_negev_desert_dog"],
    locations: [
      { name: "Desert cyber command room", mode: "faction_hq", hook: "Cool blue command room in warm stone — the drone lattice rendered as desk light." },
      { name: "Shuk tech table", mode: "ordinary_life", hook: "Shuk Ember negotiates a ceasefire over who gets the last plate." },
      { name: "Negev bloom terrace", mode: "luxury_landscape", hook: "Cyan roots through cracked stone — Negev Bloom's luminous dead-ground garden." },
    ],
    cinematicEnvironment: {
      bg: "Inside a high-security intelligence operations center with multiple screens, ancient stone walls visible, cool blue-white tech lighting",
      colors: "Blue, white. Tech aesthetic.",
    },
    rivals: [
      { rival: "iran", kind: "primary", why: "The desert signal duel: drone lattice vs mirage runner, exploit hunter vs vault keeper — two ancient networks playing chess across the same sand." },
      { rival: "usa", kind: "secondary", why: "The cyber trust feud: Nova Howl suspects Yalla Zero left a backdoor in the mining grid; Yalla Zero calls it 'a service entrance.'" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Lookups + derived maps (the shapes legacy consumers expect).
// ─────────────────────────────────────────────────────────────────────────────

const BY_ID = new Map(COUNTRY_BIBLES.map((c) => [c.factionId, c]));
const BY_CODE = new Map(COUNTRY_BIBLES.map((c) => [c.code, c]));

export function countryBible(factionId: number): CountryBible | null {
  return BY_ID.get(factionId) || null;
}

export function countryBibleByCode(code: string): CountryBible | null {
  return BY_CODE.get(String(code || "").trim().toLowerCase()) || null;
}

export function bibleLeader(factionId: number): CountryLeader | null {
  return countryBible(factionId)?.leader || null;
}

/** The leader's full dramatic sheet from the character profiles. */
export function bibleLeaderProfile(factionId: number): CountryCharacterProfile | null {
  const leader = bibleLeader(factionId);
  return leader ? resolveCountryCharacterProfile(leader.profileId) : null;
}

/** Per-country muggle mining tool, keyed by faction code (wizards use magic). */
export const MINING_TOOL_BY_CODE: Record<string, string> = Object.fromEntries(
  COUNTRY_BIBLES.map((c) => [c.code, c.miningTool]),
);

/** Per-country accent/timbre voice hints, keyed by faction code. */
export const FACTION_VOICE_HINTS: Record<string, CountryVoice> = Object.fromEntries(
  COUNTRY_BIBLES.map((c) => [c.code, c.voice]),
);

/** Cinematic-portrait rung environments, keyed by faction id. */
export const FACTION_CINEMATIC_ENVIRONMENTS: Record<number, { bg: string; colors: string }> =
  Object.fromEntries(COUNTRY_BIBLES.map((c) => [c.factionId, c.cinematicEnvironment]));

/**
 * Legacy faction-identity block — the exact shape src/prompts/factions/*
 * historically exported as `<COUNTRY>_FACTION`. Those files are now thin
 * consumers of this function; the bible is the only place leader names,
 * titles, catchphrases, and lore are defined.
 */
export interface LegacyFactionBlock {
  id: number;
  name: string;
  code: string;
  colors: { primary: string; secondary: string; accent: string; faction_glow: string };
  visual_identity: string;
  faction_lore: Record<string, string>;
  leader: {
    name: string;
    title: string;
    personality: string;
    appearance?: string;
    catchphrases: string[];
  };
}

export function legacyFactionBlock(factionId: number): LegacyFactionBlock {
  const c = countryBible(factionId);
  if (!c) throw new Error(`World bible has no country for faction id ${factionId}`);
  return {
    id: c.factionId,
    name: c.country,
    code: c.code,
    colors: {
      primary: c.colors.primary,
      secondary: c.colors.secondary,
      accent: c.colors.accent,
      faction_glow: c.colors.glow,
    },
    visual_identity: c.visualIdentity,
    faction_lore: {
      origin: c.lore.origin,
      mining_strategy: c.lore.miningStrategy,
    },
    leader: {
      name: c.leader.name,
      title: c.leader.title,
      personality: c.leader.personality,
      appearance: [
        c.leader.breed,
        c.leader.identityAnchors.markings,
        c.leader.identityAnchors.gearLineage,
      ].join(" — "),
      catchphrases: c.leader.catchphrases,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOW CAST CANON — the recurring trailer/show characters. Script passes inject
// voice profiles from here; the renderer builds reference sheets + TTS voices
// from the same identity strings. trailer/style/castCanon.ts re-exports this.
// ─────────────────────────────────────────────────────────────────────────────

export interface CastCanonEntry {
  id: string;
  aliases: string[];
  name: string;
  country: string;
  /** Canon breed (must stay inside the country's backend DNA breed set). */
  breed: string;
  /** The visual identity for keyframe prompts — what every shot must preserve. */
  look: string;
  /** Signature gear that must persist across shots/videos. */
  gear: string;
  /** Voice profile for the DIALOGUE passes: rhythm, diction, tics. */
  voiceProfile: string;
  /** The hidden driver under the voice (subtext passes lean on this). */
  secret: string;
  /** Voice-design prompt for TTS (accent + timbre + energy). */
  voiceDesign: string;
  language: string;
  defaultEmotion: string;
}

const USA = countryBible(0)!;
const CHINA = countryBible(1)!;
const RUSSIA = countryBible(2)!;
const INDIA = countryBible(3)!;
const NK = countryBible(8)!;

export const CAST_CANON: CastCanonEntry[] = [
  {
    id: "rex",
    aliases: USA.leader.aliases,
    name: USA.leader.name,
    country: "USA",
    breed: USA.leader.breed,
    look:
      "The USA Golden Retriever commander HashBeast: medium-large golden retriever build, broad friendly head, floppy ears, golden fur, star-spangled cap/cape lineage, red-and-gold hero armor, golden pickaxe-wand, wide recruitment-poster grin with one nervous flicker. NEVER a corgi, never a husky, never a pinstripe banker suit, never a realistic animal.",
    gear: USA.leader.identityAnchors.gearLineage,
    voiceProfile:
      "Brash American commander with hype-man swagger; fast comic-book cadence; talks like he is trying to keep control of a launch room that is moving faster than him. Tics: rhetorical questions he answers himself, mid-sentence self-interrupts, sales metaphors, jokes that cover panic, quick private corrections when the room proves him wrong.",
    secret:
      "Terrified America will not own the opening move — so he NEVER stops selling. Fear shows as a joke landing a half-second too long.",
    voiceDesign: USA.leader.voiceDesign,
    language: USA.leader.language,
    defaultEmotion: USA.leader.defaultEmotion,
  },
  {
    id: "long",
    aliases: CHINA.leader.aliases,
    name: CHINA.leader.name,
    country: "China",
    breed: CHINA.leader.breed,
    look:
      "A compact lion-like Chow Chow imperial wuxia mage: massive fluffy mane, deep-set calm eyes, flowing imperial robes, serene controlled posture.",
    gear: "Jade abacus-staff, imperial robes, jade accents.",
    voiceProfile:
      "Calm, slow, few words, each one weighted; proverb-shaped; never rushes; dry wit. Tics: lets others finish then undercuts in one line; speaks of time and patience.",
    secret: "Patience is also a fear of moving first and being wrong in public.",
    voiceDesign: CHINA.leader.voiceDesign,
    language: CHINA.leader.language,
    defaultEmotion: CHINA.leader.defaultEmotion,
  },
  {
    id: "volkov",
    aliases: RUSSIA.leader.aliases,
    name: RUSSIA.leader.name,
    country: "Russia",
    breed: RUSSIA.leader.breed,
    look:
      "A medium compact wolf-like Siberian Husky war-mage: thick double coat, facial mask markings, erect ears, icy eyes, heavy military greatcoat, statue-still menace.",
    gear: RUSSIA.leader.identityAnchors.gearLineage,
    voiceProfile:
      "Deep, gravelly, minimal. Threats sound like statements of fact. Long pauses. Tics: completes other people's sentences with the lethal version.",
    secret: "Silence is also how he hides that he respects his rivals.",
    voiceDesign: RUSSIA.leader.voiceDesign,
    language: RUSSIA.leader.language,
    defaultEmotion: RUSSIA.leader.defaultEmotion,
  },
  {
    id: "marshal",
    aliases: NK.leader.aliases,
    name: NK.leader.name,
    country: "North Korea",
    breed: NK.leader.breed,
    look:
      "A powerful Dark Pungsan mountain-dog Juche Sorcerer: pale/dark Pungsan lineage, over-decorated military uniform heavy with medals, chest puffed out, manic grandiose expression.",
    gear: "Stamped state pickaxe, medal-heavy uniform.",
    voiceProfile:
      "Grandiose state-propaganda overstatement; everything is the GREATEST in HISTORY; volume as personality. Tics: superlatives; the room treats his rants as a running joke he doesn't get.",
    secret: "Suspects the room laughs at him; gets louder so he never has to hear it.",
    voiceDesign: NK.leader.voiceDesign,
    language: NK.leader.language,
    defaultEmotion: NK.leader.defaultEmotion,
  },
  {
    id: "raja",
    aliases: INDIA.leader.aliases,
    name: INDIA.leader.name,
    country: "India",
    breed: INDIA.leader.breed,
    look:
      "A tall powerful white Rajapalayam sighthound: deep chest, long athletic legs, noble face, wide confident grin with a flicker of nerves underneath. Cricket gear slung like armor.",
    gear: INDIA.leader.identityAnchors.gearLineage,
    voiceProfile:
      "Fast, clever, warm; Bollywood-bright; playful Hinglish flashes ('arre', 'yaar'); turns being underestimated into fuel. Tics: cricket metaphors; grins through doubt; one flicker of real nerves under the swagger.",
    secret: "Believes the doubters might be right — which is exactly why he can't stop swinging.",
    voiceDesign: INDIA.leader.voiceDesign,
    language: INDIA.leader.language,
    defaultEmotion: INDIA.leader.defaultEmotion,
  },
  {
    id: "pip",
    aliases: ["pip", "pip circuit"],
    name: "Pip Circuit",
    country: "USA",
    breed: "Australian Shepherd",
    look:
      "A stage-1 Australian Shepherd pup: soft and innocent, merle/tri-color markings, oversized eyes, feathered coat, bob-tail lineage, a little uncertain.",
    gear: "No signature gear yet — that's the point. A glowing tablet-wand is the seed of his lineage.",
    voiceProfile:
      "Small, sincere, halting; asks the questions the others are too proud to; no irony.",
    secret: "Asks about endings because nobody will tell him whether pups get second seasons.",
    voiceDesign:
      "Stylized animated cartoon-puppy character voice — small, sincere, young, halting and gentle, wide-eyed innocence, like a tender animated-movie kid character. Not a flat human announcer.",
    language: "English",
    defaultEmotion: "vulnerable",
  },
];

export function castEntry(name: string): CastCanonEntry | null {
  const n = String(name || "").trim().toLowerCase();
  return CAST_CANON.find((c) => c.id === n || c.aliases.includes(n)) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// RARITY LIGHT LANGUAGE (Phase F) — the canonical color/particle grammar for
// rarity-tiered reveals. EVERY surface that stages a rarity moment (lootbox
// reveal rituals, claim-roll ceremonies, marketplace cards, chapter callouts)
// must take its light language from THIS table so a "Motherlode glow" reads
// identically everywhere. Visual-only by design: audio cue ids live in
// src/world/audioIdentity.ts and key off `fanfareTier` to avoid a circular
// bible ↔ audio dependency.
// ─────────────────────────────────────────────────────────────────────────────

export type RarityTierId = "common" | "uncommon" | "rare" | "epic" | "mythic";

export interface RarityTier {
  id: RarityTierId;
  /** Canonical display name (mining-vein ladder — copy surfaces only). */
  name: string;
  /** 0 (lowest) … 4 (highest). */
  rank: number;
  /** Palette words — what hue family owns this tier. */
  colorLanguage: string;
  /** Particle behavior — density, motion, scale. */
  particleLanguage: string;
  /** The light leaking through a cracking lootbox seam at this tier. */
  crackLight: string;
  /** The burst when the reveal lands. */
  revealFlare: string;
  /** Fanfare intensity band the audio identity maps to a cue id. */
  fanfareTier: "minor" | "major" | "mythic";
}

export const RARITY_TIERS: RarityTier[] = [
  {
    id: "common",
    name: "Surface Ore",
    rank: 0,
    colorLanguage: "worn steel grey with a soft paper-white core",
    particleLanguage: "a few slow dust motes drifting up and fading fast",
    crackLight: "a thin pale seam-glow, barely brighter than the room",
    revealFlare: "a single soft white pop that settles immediately",
    fanfareTier: "minor",
  },
  {
    id: "uncommon",
    name: "Live Conduit",
    rank: 1,
    colorLanguage: "signal cyan over graphite, clean and electric",
    particleLanguage: "short cyan sparks ticking along the seams like a live wire",
    crackLight: "cyan light pulsing through the cracks in a steady heartbeat",
    revealFlare: "a crisp cyan ring-burst that snaps outward once",
    fanfareTier: "minor",
  },
  {
    id: "rare",
    name: "Deep Vein",
    rank: 2,
    colorLanguage: "royal violet shot through with ultraviolet edges",
    particleLanguage: "violet embers orbiting the box in slow spirals",
    crackLight: "violet beams escaping the seams and sweeping the floor",
    revealFlare: "a double violet shockwave with ember trails",
    fanfareTier: "major",
  },
  {
    id: "epic",
    name: "Motherlode",
    rank: 3,
    colorLanguage: "molten bitcoin gold with deep amber undertones",
    particleLanguage: "dense golden sparks fountaining upward like struck ore",
    crackLight: "furnace-gold light blazing from every crack, heat shimmer at the edges",
    revealFlare: "a rolling golden eruption that rains slow sparks",
    fanfareTier: "major",
  },
  {
    id: "mythic",
    name: "Genesis Seam",
    rank: 4,
    colorLanguage: "prismatic white-gold splitting into the full spectrum at the rim",
    particleLanguage: "a storm of prismatic shards orbiting fast, the air itself glittering",
    crackLight: "blinding white-gold light dissolving the box edges before it even opens",
    revealFlare: "a screen-filling prismatic whiteout that resolves into a halo",
    fanfareTier: "mythic",
  },
];

const RARITY_BY_ID = new Map(RARITY_TIERS.map((t) => [t.id, t]));

export function rarityTier(id: RarityTierId): RarityTier {
  return RARITY_BY_ID.get(id) || RARITY_TIERS[0];
}

/**
 * Canonical evolution-stage → rarity-tier mapping (8-stage ladder → 5 tiers):
 * 0-1 common, 2-3 uncommon, 4-5 rare, 6 epic, 7 mythic. Used when a reveal's
 * rarity is derived from the revealed beast rather than passed explicitly.
 */
export function rarityTierForStage(stage: number | undefined | null): RarityTier {
  const s = Math.min(7, Math.max(0, Math.round(Number(stage ?? 0)) || 0));
  if (s >= 7) return rarityTier("mythic");
  if (s >= 6) return rarityTier("epic");
  if (s >= 4) return rarityTier("rare");
  if (s >= 2) return rarityTier("uncommon");
  return rarityTier("common");
}

// ─────────────────────────────────────────────────────────────────────────────
// Aggregate export — one object when you want the whole world at once.
// ─────────────────────────────────────────────────────────────────────────────

export const WORLD_BIBLE = {
  styleLadder: STYLE_ELEVATION_LADDER,
  countries: COUNTRY_BIBLES,
  profiles: COUNTRY_CHARACTER_PROFILES,
  showCast: CAST_CANON,
  rarity: RARITY_TIERS,
} as const;
