export type LocationMode = "ordinary_life" | "faction_hq" | "luxury_landscape" | "economic_satire" | "power_evolution";

export interface CountryLocationProfile {
  id: string;
  country: string;
  mode: LocationMode;
  name: string;
  ref: string;
  description: string;
  microDetails: string[];
  bestFor: string[];
  camera: string;
  palette: string;
  interactionProps: string[];
  dopamineUse: string;
  avoid: string;
}

const key = (country: string) => country.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const ref = (country: string, kind: "environmentBoard" | "landscapeLuxuryEnvironmentBoard") => `country:${key(country)}:${kind}`;

const loc = (
  country: string,
  mode: LocationMode,
  name: string,
  data: Omit<CountryLocationProfile, "id" | "country" | "mode" | "name" | "ref"> & { refKind?: "environmentBoard" | "landscapeLuxuryEnvironmentBoard" },
): CountryLocationProfile => ({
  id: `${key(country)}_${mode}_${key(name)}`,
  country,
  mode,
  name,
  ref: ref(country, data.refKind || (mode === "luxury_landscape" ? "landscapeLuxuryEnvironmentBoard" : "environmentBoard")),
  description: data.description,
  microDetails: data.microDetails,
  bestFor: data.bestFor,
  camera: data.camera,
  palette: data.palette,
  interactionProps: data.interactionProps,
  dopamineUse: data.dopamineUse,
  avoid: data.avoid,
});

export const COUNTRY_LOCATION_PROFILES: CountryLocationProfile[] = [
  loc("USA", "ordinary_life", "Late-night diner broadcast booth", {
    refKind: "environmentBoard",
    description: "Chrome-and-red vinyl diner corner converted into a tiny broadcast booth where USA characters sell, confess, argue, and panic between cycles.",
    microDetails: ["paper coffee cups", "red vinyl booth", "green banker lamp", "pizza box", "abstract cable-news glow"],
    bestFor: ["Rex direct-to-camera hooks", "Pip sincerity", "comedy after market panic"],
    camera: "locked eye-level two-shot or direct-to-camera confessional, center-safe, deep readable props",
    palette: "warm cream, diner red, cyan tablet glow, small gold highlights",
    interactionProps: ["coffee cup", "booth microphone", "napkin math", "tiny tablet-wand"],
    dopamineUse: "Great L5 affection beat after loud hype; ordinary room makes AI-survival feeling land.",
    avoid: "Do not turn every diner surface into crypto UI.",
  }),
  loc("USA", "economic_satire", "Degen Fed emissions chamber", {
    refKind: "environmentBoard",
    description: "Absurd central-bank wizard room where tiny characters operate huge emissions levers, policy dials, and treasury lights as sacred theater.",
    microDetails: ["brass lever", "banker-green lamps", "ledger desk", "policy siren", "money-printer machine"],
    bestFor: ["dynamic emissions", "Chairman Biscuit", "market panic comedy", "shady institution loops"],
    camera: "frontal symmetrical master, locked hold, snap punch-in to lever or corgi paw",
    palette: "banker green, brass, ledger white, red alert, cyan core",
    interactionProps: ["oversized lever", "multiplier dial", "ledger stamp", "printer cough"],
    dopamineUse: "Physicalize invisible economics; comedy from solemn ritual plus ridiculous consequence.",
    avoid: "No real Fed officials, seals, or readable financial UI.",
  }),
  loc("USA", "luxury_landscape", "Sunrise command plaza", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright heroic MineBTC plaza with voxel/cel grandeur, USA commander silhouettes, gold/cyan circuit floor, and big launch energy.",
    microDetails: ["sunrise rim light", "glowing circuit floor", "city-block towers", "hero lineup platforms", "soft floating light motes only if subtle"],
    bestFor: ["launch CTA", "hero lineup", "Rex power reveal", "YouTube trailer establishing shot"],
    camera: "wide center-safe hero master, slow push only if needed, readable silhouettes",
    palette: "sunrise gold, cyan, royal blue, clean white, emerald accents",
    interactionProps: ["golden pickaxe-wand", "command pedestal", "cape movement", "portal floor"],
    dopamineUse: "L1 visual stun and L6 serial promise; makes MineBTC feel premium and alive.",
    avoid: "Avoid dark grimdark, floating cube spam, or giant Bitcoin logo dependence.",
  }),

  loc("China", "faction_hq", "Jade planning hall", {
    description: "Calm red-lacquer and jade strategy chamber where planners make the war feel inevitable and controlled.",
    microDetails: ["carved screens", "jade abacus", "tea cups", "red lacquer cabinets", "orderly map table"],
    bestFor: ["long-game suspense", "USA rivalry", "central-planning satire"],
    camera: "locked symmetrical wide, slow push into one calm face",
    palette: "deep red, jade green, warm tea light, controlled gold",
    interactionProps: ["abacus-staff", "tea cup", "sealed folder", "map stone"],
    dopamineUse: "Suspense from stillness: the room is calm while the audience waits for the trap.",
    avoid: "No dragon/pagoda-only shorthand or real political symbols.",
  }),
  loc("China", "ordinary_life", "Shenzhen wand-tech workshop", {
    description: "Dense workshop where invention, copying, improvement, and speed become visual comedy.",
    microDetails: ["tiny drones", "tool trays", "porcelain bowls", "delivery scooter helmet", "neon workbench"],
    bestFor: ["Mei Spark", "Pip rivalry", "tech-race comedy"],
    camera: "two-shot over cluttered worktable, deep focus for background gag",
    palette: "cyan factory light, red accents, porcelain white, jade sparks",
    interactionProps: ["prototype wand", "drone tray", "thermos", "shipping tag"],
    dopamineUse: "Reveal the 'copy' already upgraded before the original is explained.",
    avoid: "Keep the joke on speed/institutions, not ethnicity.",
  }),
  loc("China", "luxury_landscape", "High-speed empire skyline", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright large-scale skyline/rail/tech-campus landscape showing order, scale, and ambition without monument spam.",
    microDetails: ["high-speed rail geometry", "glass campus", "lantern warmth", "balcony density", "clean plaza symmetry"],
    bestFor: ["scale flex", "takeover montage", "Long's confidence"],
    camera: "wide architectural master, frontal symmetry, level horizon",
    palette: "jade, red, gold, cool glass blue",
    interactionProps: ["rail light streak", "planning tablet", "jade staff silhouette"],
    dopamineUse: "Status awe: one shot says this faction has scale and patience.",
    avoid: "Avoid Great Wall-only visual shorthand.",
  }),

  loc("Russia", "faction_hq", "Frost bunker chess room", {
    description: "Cold bunker-office with chess table, frosted windows, radiators, rugs, and iron filing cabinets.",
    microDetails: ["chessboard", "samovar", "old radiator", "frosted glass", "military-green cabinet"],
    bestFor: ["Volkov menace", "oligarch deals", "signal warnings"],
    camera: "locked medium-wide, slow push for threat, close-up only on chess/object trigger",
    palette: "steel blue, frost white, red warning bulb, iron gray",
    interactionProps: ["chess clock", "tea glass", "contract folder", "frosted coin"],
    dopamineUse: "Menace through quiet: the scariest object moves only after the pause.",
    avoid: "No real war footage, vodka caricature, or real leaders.",
  }),
  loc("Russia", "ordinary_life", "Snow courtyard tea table", {
    description: "Apartment-block courtyard with a small tea table, snow, rugs, and human-scale melancholy.",
    microDetails: ["concrete blocks", "wall rug", "enamel mug", "black bread", "snow on railing"],
    bestFor: ["Misha signal mystery", "sincere rivalry", "post-loss silence"],
    camera: "lone figure wide or eye-level two-shot with deep background",
    palette: "soft gray, blue snow, warm tea amber",
    interactionProps: ["tea glass", "radio beads", "coin in snow", "folded scarf"],
    dopamineUse: "Tonal pivot after action; one soft warning can open a huge mystery loop.",
    avoid: "Do not make Russia only bunker/winter menace.",
  }),
  loc("Russia", "luxury_landscape", "Aurora energy route", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright aurora-lit northern route with ice geometry, energy lines, and premium action-scale landscape.",
    microDetails: ["aurora bands", "ice-route path", "distant block towers", "frozen river", "signal mast"],
    bestFor: ["Anya chase", "Misha signal", "Volkov power reveal"],
    camera: "wide action master with readable vector path",
    palette: "aurora green, cyan, ice blue, white rim light",
    interactionProps: ["sled line", "radio mast", "frost pickaxe", "map satchel"],
    dopamineUse: "L1 visual stun for chase/mystery: bright cold landscape, not muddy grimdark.",
    avoid: "Avoid crushed black shadows.",
  }),

  loc("India", "ordinary_life", "Rooftop chai lab", {
    description: "Painted concrete rooftop where startup cables, chai, cricket gear, monsoon air, and wizard tech collide.",
    microDetails: ["water tank", "plastic chairs", "chai glasses", "ceiling fan parts", "cricket bat"],
    bestFor: ["Jugaad Byte", "Raja vulnerability", "builder lore"],
    camera: "eye-level two-shot or locked confessional, warm practical light",
    palette: "turmeric gold, teal, monsoon blue, neon cyan",
    interactionProps: ["cracked laptop-wand", "chai glass", "bat-pickaxe", "tiffin box"],
    dopamineUse: "Affection + invention: constraints make the magic feel earned.",
    avoid: "No poverty-only framing or Taj Mahal shorthand.",
  }),
  loc("India", "faction_hq", "Monsoon cricket war room", {
    description: "Strategy room that feels half cricket locker room, half magical command post.",
    microDetails: ["scoreboard shapes", "rangoli floor geometry", "steel thalis", "marigold cord", "wet window"],
    bestFor: ["Raja speeches", "underdog comeback", "country recruitment"],
    camera: "medium-wide lineup, snap punch-in to bat/score detail",
    palette: "saffron, cyan, emerald, rain slate",
    interactionProps: ["cricket ball", "bat-pickaxe", "steel plate", "strategy chalk"],
    dopamineUse: "Sports anime anticipation: final-over feeling before payoff.",
    avoid: "Avoid turning the scene into a literal cricket match unless story needs it.",
  }),
  loc("India", "luxury_landscape", "Neon stepwell arena", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright grand stepwell/rooftop/cityscape hybrid with monsoon reflections and magical circuitry.",
    microDetails: ["stepwell geometry", "rainwater reflections", "painted houses", "temple-bell prop", "city neon"],
    bestFor: ["Raja power reveal", "Tara guardian entrance", "India launch flex"],
    camera: "wide hero master with vertical depth, center-safe subject",
    palette: "saffron gold, peacock teal, cyan core, warm cream",
    interactionProps: ["bell charm", "bat-pickaxe", "rain puddle", "chakra glow"],
    dopamineUse: "Big landscape wow that says India is modern, mythic, and playable.",
    avoid: "No tourist postcard-only India.",
  }),

  loc("Japan", "ordinary_life", "Konbini alley control point", {
    description: "Clean late-night alley/konbini corner where precision characters stage tiny serious operations.",
    microDetails: ["vending machine", "yellow tactile paving", "noren marks with no text", "ramen bowl", "orderly cables"],
    bestFor: ["Kiro precision", "Momo broadcast", "deadpan comedy"],
    camera: "locked eye-level, deep focus for small background gag",
    palette: "indigo, cream, vending cyan, clean red accent",
    interactionProps: ["coin", "ramen bowl", "mic charm", "katana-pick"],
    dopamineUse: "Misdirect: mundane setting, absurdly high-stakes precision.",
    avoid: "No generic anime drift or readable Japanese text.",
  }),
  loc("Japan", "faction_hq", "Tatami strategy studio", {
    description: "Minimal room where low tables, shoji panels, and tech overlays as abstract light create clean tactical focus.",
    microDetails: ["tatami mats", "low table", "shoji panels", "ceramic cups", "arcade cabinet silhouette"],
    bestFor: ["Kiro vs Mei", "Akamatsu sacrifice", "Momo meta-control"],
    camera: "frontal symmetrical or overhead strategy insert",
    palette: "cream, indigo, cyan, red seal accent",
    interactionProps: ["tea cup", "katana-pick", "storyboard cards", "bento box"],
    dopamineUse: "Readable silence before one exact action.",
    avoid: "Do not overfill with holograms.",
  }),
  loc("Japan", "luxury_landscape", "Sunrise city-grid dojo", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright city/dojo/tech skyline where precision, disaster scale, and clean action can breathe.",
    microDetails: ["roofline silhouettes", "train platform lines", "clean neon grid", "sunrise haze", "beacon tower"],
    bestFor: ["Goro kaiju warning", "Kiro power slash", "Japan faction reveal"],
    camera: "wide clean silhouette, hard speed cut only on reveal",
    palette: "sunrise cream, cyan, red, deep blue",
    interactionProps: ["red beacon", "katana-pick", "drone marker", "rain split"],
    dopamineUse: "Wow through clarity: one perfect vector across a large calm frame.",
    avoid: "No Mount Fuji/torii-only shorthand unless story-specific.",
  }),

  loc("South Korea", "ordinary_life", "PC-bang neon booth", {
    description: "Neon PC-bang/gaming booth packed with snack details and tactical screens as abstract blocks.",
    microDetails: ["keyboard talisman", "noodle cup", "charging cables", "LED color blocks", "convenience-store table"],
    bestFor: ["Nari strategy", "leaderboard flip", "gaming meta comedy"],
    camera: "tight two-shot over keyboard, snap punch-in to paw combo",
    palette: "violet, cyan, hot pink, snack warm light",
    interactionProps: ["keyboard", "noodle cup", "mouse cable", "queue ticket"],
    dopamineUse: "Hidden genius reveal: sleepy gamer flips the war.",
    avoid: "No messy unreadable UI text.",
  }),
  loc("South Korea", "faction_hq", "Idol-war rehearsal room", {
    description: "Mirror rehearsal room turned tactical faction HQ with choreography blocking and clean stage reflections.",
    microDetails: ["practice mirrors", "stage tape", "light sticks", "delivery bags", "subway-tile wall"],
    bestFor: ["Jin recruitment", "Yuna wire action", "synchronized crowd comedy"],
    camera: "horizontal lineup or lateral track, readable reflections",
    palette: "glossy violet, cyan, white, chrome",
    interactionProps: ["headset", "light stick", "stunt harness", "floor tape"],
    dopamineUse: "Pattern pleasure: synchronized movement becomes faction power.",
    avoid: "Do not make every Korea scene an idol stage.",
  }),
  loc("South Korea", "luxury_landscape", "Seoul rooftop LED city", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright luxury rooftop overlooking LED Seoul, apartment towers, studio light, and pop-tech energy.",
    microDetails: ["rooftop rail", "LED skyline blocks", "apartment tower grid", "studio spotlight", "night-market glow"],
    bestFor: ["Jin hero shot", "Parkbite corporate deal", "Yuna action landing"],
    camera: "wide city master with center-safe subject",
    palette: "cyan, violet, glossy black, warm food-stall orange",
    interactionProps: ["contract phone", "headset mic", "drone light", "stunt cable"],
    dopamineUse: "Premium social look: bright, slick, instantly platform-native.",
    avoid: "No dark generic cyberpunk sludge.",
  }),

  loc("Iran", "ordinary_life", "Bazaar tea negotiation room", {
    description: "Warm bazaar/courtyard negotiation space with rugs, copper, tea, and hidden routes.",
    microDetails: ["Persian rug", "tea glasses", "copper tray", "arched niche", "mosaic tile"],
    bestFor: ["Saffron Ledger", "Darya prophecy", "back-channel deals"],
    camera: "locked table two-shot, insert on tea/ledger trigger",
    palette: "turquoise, copper, saffron, warm sand",
    interactionProps: ["tea glass", "copper ledger", "rug edge", "sealed package"],
    dopamineUse: "Suspense through hospitality: the favor is the weapon.",
    avoid: "No conflict-only imagery or readable political text.",
  }),
  loc("Iran", "faction_hq", "Turquoise vault courtyard", {
    description: "Tile-and-bronze guarded courtyard where vault mystery and guardian action can stage clearly.",
    microDetails: ["turquoise tiles", "courtyard pool", "bronze gate", "book shelf", "desert curtain light"],
    bestFor: ["Rostam guardian", "vault mystery", "Darya map poem"],
    camera: "wide frontal gate master, slow push on one object",
    palette: "turquoise, bronze, sand, deep blue shadow",
    interactionProps: ["gate key", "copper tray", "water reflection", "amulet"],
    dopamineUse: "Mystery loop: what is behind the gate, and why does everyone want it?",
    avoid: "No real sanctions lecture; physicalize survival.",
  }),
  loc("Iran", "luxury_landscape", "Desert mirror route", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright desert/city-edge luxury landscape with mirror heat, turquoise structures, and chase potential.",
    microDetails: ["mirror charms", "courtyard arches", "desert light", "bazaar canopy", "distant tile dome shapes"],
    bestFor: ["Nilo mirage chase", "Darya prophecy", "Iran faction reveal"],
    camera: "wide readable action vector with clean mirage duplicates",
    palette: "sand gold, turquoise, copper, sky blue",
    interactionProps: ["mirror charm", "runner scarf", "water bowl", "lantern"],
    dopamineUse: "Visual mystery: which figure is real?",
    avoid: "No exotic fog overload; keep action readable.",
  }),

  loc("UK", "ordinary_life", "Rainy pub odds table", {
    description: "Wood-paneled pub/City hybrid where odds, tea, sarcasm, and spy clues live in the same frame.",
    microDetails: ["wood panels", "tea mug", "football scarf", "brass letter slot", "biscuit tin"],
    bestFor: ["Sir Pound", "Pint Rocket", "Agent Woolf clues"],
    camera: "locked pub-table two-shot, deep focus clue in background",
    palette: "rain gray, banker green, brass, warm pub amber",
    interactionProps: ["odds ledger", "tea mug", "scarf", "tape recorder"],
    dopamineUse: "Dry comedy: underreaction to absurd stakes.",
    avoid: "No Big Ben-only shorthand or royal likenesses.",
  }),
  loc("UK", "faction_hq", "Old library spy corridor", {
    description: "Old institutional library/corridor with rain windows, maps, and quiet spy tension.",
    microDetails: ["old books", "tube-tile pattern", "rain window", "green lamp", "narrow staircase"],
    bestFor: ["Agent Woolf", "Lady Crumpet rules", "thriller clue drops"],
    camera: "slow push down corridor, locked insert on clue object",
    palette: "deep navy, rain blue, brass, paper cream",
    interactionProps: ["newspaper", "tape recorder", "teacup", "sealed envelope"],
    dopamineUse: "Suspense clue: one tiny object recontextualizes the whole episode.",
    avoid: "Do not use real agency names or surveillance claims.",
  }),
  loc("UK", "luxury_landscape", "Cloudy crown-city terrace", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright cloudy terrace/cityscape with brick, stone, wet cobbles, and premium old-world finance mood.",
    microDetails: ["wet cobblestones", "brick terraces", "cream stone", "cloudy daylight", "wrought rail"],
    bestFor: ["UK faction reveal", "Lady Crumpet tiny authority", "Sir Pound market flex"],
    camera: "wide centered master with dry character pose",
    palette: "cloud cream, navy, banker green, brass gold",
    interactionProps: ["teacup wand", "ledger", "football chant scarf", "umbrella"],
    dopamineUse: "Comedic scale contrast: tiny character, serious old-world stage.",
    avoid: "No monarchy/politician imagery.",
  }),

  loc("North Korea", "faction_hq", "Parade control hall", {
    description: "Over-symmetrical parade/control room with podiums, red carpet, brass microphones, and synchronized chairs.",
    microDetails: ["brass microphone", "red carpet runner", "green metal desk", "rotary phone", "loudspeaker horn"],
    bestFor: ["Marshal comedy", "Button moral choice", "Choir Frost crowd control"],
    camera: "frontal symmetrical, locked hold, reaction chain after absurd declaration",
    palette: "red, brass, marble white, harsh ceiling light",
    interactionProps: ["red button", "microphone", "baton", "stamp pickaxe"],
    dopamineUse: "Misdirect: grand historical announcement broken by tiny human/dog error.",
    avoid: "No real leaders, slogans, or hate symbols.",
  }),
  loc("North Korea", "ordinary_life", "Control-room waiting bench", {
    description: "Small fluorescent side room outside the parade hall where nervous truth beats can happen.",
    microDetails: ["plastic chair", "fluorescent hum", "button key", "paper cup", "old radio"],
    bestFor: ["Button sincerity", "Paektu leak", "quiet after bombast"],
    camera: "lone negative-space frame or eye-level two-shot",
    palette: "washed green, red button glow, gray floor, lonely cyan static",
    interactionProps: ["button key", "radio knob", "paper cup", "folded uniform cap"],
    dopamineUse: "Tonal pivot: the loudest faction gets one quiet scared character.",
    avoid: "Do not mock suffering; keep dignity.",
  }),
  loc("North Korea", "luxury_landscape", "Monumental empty plaza", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright but eerie monumental plaza with exaggerated symmetry and tiny characters dwarfed by formal space.",
    microDetails: ["marble floor", "red banners as abstract blocks", "podium geometry", "parade lines", "distant mountains"],
    bestFor: ["Marshal scale joke", "Choir Frost spectacle", "Paektu broadcast leak"],
    camera: "wide symmetrical master, tiny subject in huge formal space",
    palette: "red, marble white, cold blue, brass",
    interactionProps: ["podium mic", "loudspeaker", "baton", "broadcast mast"],
    dopamineUse: "Scale comedy and thriller: huge frame, one tiny flaw.",
    avoid: "No real propaganda text.",
  }),

  loc("France", "ordinary_life", "Cafe theory table", {
    description: "Zinc bar/cafe table where philosophy, fashion, pastry, and treasury clues can become jokes.",
    microDetails: ["zinc counter", "rattan chair", "espresso cup", "checker tile", "linen curtain"],
    bestFor: ["Professor Croissant", "Madame Mint", "Fleur duels"],
    camera: "locked cafe two-shot, insert on pastry/chalk clue",
    palette: "cream, burgundy, gold trim, soft overcast",
    interactionProps: ["espresso cup", "chalk pick", "pastry box", "fashion pin"],
    dopamineUse: "Comedy from elegant overthinking under urgent stakes.",
    avoid: "No Eiffel Tower-only shorthand.",
  }),
  loc("France", "faction_hq", "Couture treasury atelier", {
    description: "Fashion atelier crossed with treasury vault, where outfits hide keys and numbers become style.",
    microDetails: ["mood boards as color blocks", "gold thread", "mirror", "fabric rolls", "vault drawer"],
    bestFor: ["Madame Mint shady treasury", "luxury villain comedy", "gear upgrades"],
    camera: "frontal fashion lineup, snap insert on hidden key/thread",
    palette: "navy, cream, burgundy, gold, cyan core",
    interactionProps: ["thread spool", "vault key", "mirror", "cape clasp"],
    dopamineUse: "Reveal: the beautiful detail was the weapon all along.",
    avoid: "No real brand marks or readable fashion logos.",
  }),
  loc("France", "luxury_landscape", "Parisian MineBTC boulevard", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright boulevard/atelier/museum-like landscape with cream stone, wrought iron, and arcade-cel luxury.",
    microDetails: ["cream stone apartments", "wrought balcony", "metro tile", "soft overcast", "gold trim"],
    bestFor: ["France faction reveal", "Fleur action", "Luc crowd barricade"],
    camera: "wide clean boulevard master, center-safe",
    palette: "cream, navy, burgundy, gold, cyan",
    interactionProps: ["rapier pick", "cafe chair", "poster roll", "gold thread"],
    dopamineUse: "Premium beauty plus absurd faction war creates contrast.",
    avoid: "No tourist postcard dependency.",
  }),

  loc("Brazil", "ordinary_life", "Concrete football court", {
    description: "Community football court with mosaic sidewalks, warm light, fruit crates, and tactical joy.",
    microDetails: ["concrete court", "mosaic sidewalk", "fruit crate", "plastic chair", "laundry line"],
    bestFor: ["Sol comeback", "Luma rhythm", "Raja sports crossover"],
    camera: "wide full-body action master, impact and reaction in same frame",
    palette: "sun gold, green, blue, warm orange",
    interactionProps: ["football", "drum controller", "plastic chair", "fruit crate"],
    dopamineUse: "Fast joy hook: a final-minute steal feels instantly readable.",
    avoid: "No beach/carnival-only Brazil.",
  }),
  loc("Brazil", "faction_hq", "Community vault stairway", {
    description: "Luxury-meets-community treasury stairway with vault keys, tiled kitchens, and emerald/gold protection.",
    microDetails: ["tiled wall", "stair geometry", "key necklace", "corner bar", "market fruit"],
    bestFor: ["Dona Vaulta", "treasury plots", "community stakes"],
    camera: "low hero on guardian, wide enough for stair geometry",
    palette: "emerald, gold, tropical cyan, warm kitchen light",
    interactionProps: ["key necklace", "ledger tray", "stair rail", "food plate"],
    dopamineUse: "Shady warmth: viewer wonders if the protector is hero or boss.",
    avoid: "Avoid poverty spectacle.",
  }),
  loc("Brazil", "luxury_landscape", "Solar city-river arena", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright landscape blending hillside city, river/forest energy, and luxury MineBTC circuitry.",
    microDetails: ["colorful hillside", "river reflection", "stadium tunnel", "solar flare", "green circuitry"],
    bestFor: ["Sol hero kick", "Mato green bridge", "Brazil faction flex"],
    camera: "wide action/establishing shot with strong vector path",
    palette: "sun gold, emerald, cyan, sky blue",
    interactionProps: ["football", "leaf core", "drum pad", "vault key"],
    dopamineUse: "Visual stun with warmth and motion; ideal for TikTok/Shorts hook frame.",
    avoid: "No dark jungle exoticism.",
  }),

  loc("Israel", "ordinary_life", "Shuk tech table", {
    description: "Market table where food, bargaining, startup debugging, and street-level diplomacy overlap.",
    microDetails: ["market crates", "ceramic plate", "spice pouch", "metal coffee pot", "blue shutter"],
    bestFor: ["Shuk Ember", "Yalla Zero comedy", "back-channel deals"],
    camera: "eye-level table two-shot, insert on spice/phone trigger",
    palette: "warm limestone, spice orange, cyan tech, blue shutter",
    interactionProps: ["ceramic plate", "phone gauntlet", "spice smoke", "coffee pot"],
    dopamineUse: "Warm comedy before cyber/thriller escalation.",
    avoid: "Do not reduce Israel to military imagery.",
  }),
  loc("Israel", "faction_hq", "Desert cyber command room", {
    description: "Glass startup/security room with desert light, abstract monitors, drone props, and tactical restraint.",
    microDetails: ["glass room", "desert sunlight", "abstract monitor blocks", "drone case", "rooftop antenna"],
    bestFor: ["Yalla Zero", "Mira Lock", "cyber suspense"],
    camera: "locked medium-wide, snap insert on exploit trigger",
    palette: "limestone white, cyan, sand gold, deep navy",
    interactionProps: ["laptop gauntlet", "drone marker", "antenna switch", "map scarf"],
    dopamineUse: "Suspense from one tiny access point opening a huge consequence.",
    avoid: "No real agency names, no readable code/UI.",
  }),
  loc("Israel", "luxury_landscape", "Negev bloom terrace", {
    refKind: "landscapeLuxuryEnvironmentBoard",
    description: "Bright desert-edge terrace where water-core magic, tech, and survival hope can look premium.",
    microDetails: ["limestone terrace", "olive tree", "desert edge", "water-core glow", "blue shutters"],
    bestFor: ["Negev Bloom", "rebirth payoff", "Israel faction reveal"],
    camera: "wide center-safe hero master, soft slow push for sincere reveal",
    palette: "sand gold, cyan water, limestone cream, olive green",
    interactionProps: ["water staff", "root circuitry", "drone light", "ceramic bowl"],
    dopamineUse: "Hope payoff after thriller: dead floor becomes alive.",
    avoid: "No conflict-zone framing.",
  }),
];

export function buildLocationPromptBlock(): string {
  const byCountry = new Map<string, CountryLocationProfile[]>();
  for (const location of COUNTRY_LOCATION_PROFILES) {
    const arr = byCountry.get(location.country) || [];
    arr.push(location);
    byCountry.set(location.country, arr);
  }

  const blocks = [...byCountry.entries()].map(([country, locations]) => {
    const lines = locations.map((l) => [
      `- ${l.id}: ${l.name} [${l.mode}] ref=${l.ref}`,
      `  Description: ${l.description}`,
      `  Micro-details: ${l.microDetails.join(", ")}`,
      `  Best for: ${l.bestFor.join(", ")}`,
      `  Camera/palette: ${l.camera}; ${l.palette}`,
      `  Interaction props: ${l.interactionProps.join(", ")}`,
      `  Dopamine use: ${l.dopamineUse}`,
      `  Avoid: ${l.avoid}`,
    ].join("\n"));
    return `${country}\n${lines.join("\n")}`;
  });

  return [
    "COUNTRY LOCATION / STORYBOARD REGISTRY:",
    "Use these as reusable set cards for script scenes, start-frame prompts, and reference planning. Pick locations by story function, not by country tourism.",
    "Every location should carry one interaction prop and 2-4 micro-details; do not dump the full board into every shot.",
    ...blocks,
  ].join("\n\n");
}

