/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROGRESSION GRAMMAR — the canonical 8-stage evolution ladder.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Phase B of the content plan: every surface that renders growth (evolution
 * ceremonies, state-loop performances, power techniques) reads its language
 * from HERE, modulated by the world bible's per-country powerStyle grammar.
 *
 * Stage numbering matches the on-chain DNA evolution field: 0-7 (8 stages).
 *
 *   0 Pup · 1 Initiate · 2 Operative · 3 Veteran ·
 *   4 Elite · 5 Commander · 6 Legend · 7 Ascended
 *
 * Exposed grammars:
 *   - PROGRESSION_STAGES / STAGE_TRANSITIONS  (B1: names, aura escalation,
 *     silhouette notes)
 *   - countryAuraFlavor()                     (B1: per-country modulation,
 *     reusing the registry powerStyle language — USA gold ticker-ribbons,
 *     China jade rings, Russia frost pressure…)
 *   - evolutionCeremony()                     (B2: CHARGE → BURST → REVEAL)
 *   - performanceBand() / stagePerformance()  (B3: stage-aware acting)
 *   - techniqueFor() / TECHNIQUES             (B4: named country × lane moves)
 *
 * HARD RULES (inherited from the bible — do not relax):
 * - No readable text inside generated images; technique NAMES never enter
 *   image prompts, only their visual grammar.
 * - No flag-print clothing; national identity via costume style + palette.
 */

import {
  bibleLeaderProfile,
  countryBible,
  type CountryCharacterProfile,
} from "./bible.js";

// ─────────────────────────────────────────────────────────────────────────────
// B1 · STAGES — canonical names + aura/palette escalation tokens.
// ─────────────────────────────────────────────────────────────────────────────

export interface StageAura {
  /** How big the aura reads. */
  size: string;
  /** Color temperature / light quality at this stage. */
  colorTemperature: string;
  /** Particle field density. */
  particleDensity: string;
  /** What happens to the ground beneath the beast. */
  groundEffect: string;
}

export interface ProgressionStage {
  /** DNA evolution value, 0-7. */
  stage: number;
  /** Canonical stage name — the ONLY valid name on any surface. */
  name: string;
  /** One-line flavor for copy surfaces. */
  epithet: string;
  aura: StageAura;
}

export const PROGRESSION_STAGES: ProgressionStage[] = [
  {
    stage: 0,
    name: "Pup",
    epithet: "hatchling of the hashfields",
    aura: {
      size: "barely-there aura wisp",
      colorTemperature: "soft warm pastel glow",
      particleDensity: "a few stray sparks",
      groundEffect: "no ground effect — scuffed pawprints at most",
    },
  },
  {
    stage: 1,
    name: "Initiate",
    epithet: "sworn to the mine",
    aura: {
      size: "thin aura outline hugging the body",
      colorTemperature: "warm candle-glow",
      particleDensity: "occasional drifting motes",
      groundEffect: "faint dust kicks at the paws",
    },
  },
  {
    stage: 2,
    name: "Operative",
    epithet: "a working blade of the faction",
    aura: {
      size: "steady close-fitting aura sheath",
      colorTemperature: "clean neutral glow",
      particleDensity: "light steady particle stream",
      groundEffect: "small cracks of light underfoot on impact",
    },
  },
  {
    stage: 3,
    name: "Veteran",
    epithet: "scarred and certain",
    aura: {
      size: "visible aura corona",
      colorTemperature: "saturated mid-heat glow",
      particleDensity: "constant ember-mote field",
      groundEffect: "a glowing ring flickers under its stance",
    },
  },
  {
    stage: 4,
    name: "Elite",
    epithet: "the country's drawn weapon",
    aura: {
      size: "tall flaring aura plume",
      colorTemperature: "hot high-contrast twin-tone glow",
      particleDensity: "dense orbiting particle ribbons",
      groundEffect: "a permanent sigil ring burns under its feet",
    },
  },
  {
    stage: 5,
    name: "Commander",
    epithet: "rooms reorganize around it",
    aura: {
      size: "room-filling banner of aura",
      colorTemperature: "deep regal heat with cold core highlights",
      particleDensity: "layered particle banners trailing every motion",
      groundEffect: "floor plates lift in a slow ring around its stance",
    },
  },
  {
    stage: 6,
    name: "Legend",
    epithet: "already a story while still alive",
    aura: {
      size: "horizon-touching aura pillar",
      colorTemperature: "white-hot core with chromatic rim light",
      particleDensity: "storm-density particle field",
      groundEffect: "the floor fractures into floating glowing shards",
    },
  },
  {
    stage: 7,
    name: "Ascended",
    epithet: "less a beast than a weather system",
    aura: {
      size: "weather, not aura — the air itself bends around it",
      colorTemperature: "near-white transcendent light, color only at the rim",
      particleDensity: "particles fall upward in reverent slow motion",
      groundEffect: "a calm crater of light that follows wherever it stands",
    },
  },
];

/** Clamp any stage-ish number into the canonical 0-7 range. */
export function normalizeStage(stage: number | undefined | null): number {
  const n = Math.round(Number(stage ?? 0));
  if (isNaN(n)) return 0;
  return Math.min(7, Math.max(0, n));
}

export function progressionStage(stage: number | undefined | null): ProgressionStage {
  return PROGRESSION_STAGES[normalizeStage(stage)];
}

/** Aura escalation tokens as one prompt-ready phrase. */
export function auraTokens(stage: number | undefined | null): string {
  const s = progressionStage(stage);
  return `${s.aura.size}; ${s.aura.colorTemperature}; ${s.aura.particleDensity}; ${s.aura.groundEffect}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// B1 · TRANSITIONS — one canonical ceremony per stage step (7 transitions).
// ─────────────────────────────────────────────────────────────────────────────

export interface StageTransition {
  from: number;
  to: number;
  /** Canonical ceremony name (copy surfaces; NEVER rendered as image text). */
  name: string;
  /** What changes in the one-glance silhouette. */
  silhouetteChange: string;
}

export const STAGE_TRANSITIONS: StageTransition[] = [
  {
    from: 0,
    to: 1,
    name: "The First Spark",
    silhouetteChange:
      "puppy roundness tightens; the oversized gear finally fits one paw",
  },
  {
    from: 1,
    to: 2,
    name: "The Tool Bond",
    silhouetteChange:
      "stance widens and the back straightens; the gear lineage fuses to the body",
  },
  {
    from: 2,
    to: 3,
    name: "The Scar Ceremony",
    silhouetteChange:
      "bulk and battle-wear arrive; the outline gets heavier and asymmetric with trophies",
  },
  {
    from: 3,
    to: 4,
    name: "The Crown of Sparks",
    silhouetteChange:
      "a sharp heroic taper; cape and banner lines enter the silhouette",
  },
  {
    from: 4,
    to: 5,
    name: "The Banner Rising",
    silhouetteChange:
      "command bulk plus a longer flowing outline; the aura reads as part of the body",
  },
  {
    from: 5,
    to: 6,
    name: "The Myth Forging",
    silhouetteChange:
      "the silhouette gains an iconic poster-readable outline; gear becomes regalia",
  },
  {
    from: 6,
    to: 7,
    name: "The Ascension",
    silhouetteChange:
      "the body simplifies into a serene weightless icon; only the identity anchors remain readable",
  },
];

/** The canonical transition that ARRIVES at `toStage` (1-7). */
export function stageTransition(toStage: number | undefined | null): StageTransition {
  const to = Math.max(1, normalizeStage(toStage));
  return STAGE_TRANSITIONS[to - 1];
}

// ─────────────────────────────────────────────────────────────────────────────
// B1 · COUNTRY FLAVOR — aura modulation reusing the registry powerStyle
// language. The leader profile's powerStyle IS the country's power grammar.
// ─────────────────────────────────────────────────────────────────────────────

export function countryAuraFlavor(factionId: number): string {
  const bible = countryBible(factionId);
  const leader: CountryCharacterProfile | null = bibleLeaderProfile(factionId);
  if (!bible) return "faction-colored energy";
  const style = leader?.powerStyle
    ? leader.powerStyle.replace(/\.$/, "")
    : "faction-colored energy";
  return `${bible.country} power grammar — ${style}; signature glow ${bible.colors.glow}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// B2 · EVOLUTION CEREMONY — CHARGE → BURST → REVEAL choreography.
// ─────────────────────────────────────────────────────────────────────────────

export type CeremonyBeatId = "charge" | "burst" | "reveal";

export interface CeremonyBeat {
  beat: CeremonyBeatId;
  /** What the keyframe(s) of this beat must show. */
  action: string;
}

/**
 * The 3-beat evolution ceremony for one transition, country-modulated.
 * CHARGE = anticipation, BURST = whiteout morph (identity-readable silhouette
 * inside the light), REVEAL = signature pose + aura settle at the new stage.
 */
export function evolutionCeremony(
  factionId: number,
  fromStage: number,
  toStage: number,
): CeremonyBeat[] {
  const from = progressionStage(fromStage);
  const to = progressionStage(toStage);
  const transition = stageTransition(toStage);
  const flavor = countryAuraFlavor(factionId);
  return [
    {
      beat: "charge",
      action:
        `CHARGE (anticipation): the ${from.name}-stage beast crouches and braces as power gathers — ` +
        `${from.aura.size} swelling past its limits, ${from.aura.particleDensity} accelerating inward, ` +
        `${flavor} beginning to overload around the body`,
    },
    {
      beat: "burst",
      action:
        `BURST (whiteout morph): the gathered power detonates into a blinding whiteout — the beast's ` +
        `identity-readable silhouette holds inside the light while its body morphs; ` +
        `${transition.silhouetteChange}; ${to.aura.particleDensity} erupting outward`,
    },
    {
      beat: "reveal",
      action:
        `REVEAL (signature pose + aura settle): the light clears on the new ${to.name}-stage form striking ` +
        `its signature pose — ${to.aura.size}, ${to.aura.colorTemperature}, ${to.aura.groundEffect}; ` +
        `the ${flavor} settles into a steady ${to.name} hum`,
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// B3 · STAGE-AWARE PERFORMANCE — per-stage-band acting tokens for the
// mining / win / lose state loops. A Pup over-celebrates; an Ascended barely
// acknowledges victory. Losses scale puppy-despair → wounded-commander pride.
// ─────────────────────────────────────────────────────────────────────────────

export type PerformanceBand = "pup" | "soldier" | "elite" | "ascendant";

export function performanceBand(stage: number | undefined | null): PerformanceBand {
  const s = normalizeStage(stage);
  if (s <= 1) return "pup";
  if (s <= 3) return "soldier";
  if (s <= 5) return "elite";
  return "ascendant";
}

export interface StagePerformance {
  mining: string;
  win: string;
  lose: string;
  /** General screen-presence note (dialogue delivery, posture). */
  presence: string;
}

export const PERFORMANCE_BY_BAND: Record<PerformanceBand, StagePerformance> = {
  pup: {
    mining:
      "wrestling a comically oversized tool it can barely lift — clumsy over-swings, tumbling over, scrambling back up with tongue-out determination",
    win: "OVER-celebration — full-body zoomies, ecstatic bouncing, tail spinning like a propeller, almost falling over from joy",
    lose: "puppy despair — flops flat on the ground, ears pinned down, a dramatic heartbroken whimper posture",
    presence: "small, eager, everything is the biggest moment of its life",
  },
  soldier: {
    mining:
      "drilled, efficient strikes with soldier rhythm — confident grip, wiping its brow between reps, workmanlike focus",
    win: "an earned fist-pump and proud chest-out cheer — celebrating hard but still hungry for the next one",
    lose: "frustrated but composed — slams the tool down, shakes it off, re-grips and squares up again",
    presence: "professional, coiled, proving something every shift",
  },
  elite: {
    mining:
      "commanding, powerful strikes — each blow lands with shockwave authority, the dBTC seam seems to obey before it cracks",
    win: "a measured triumphant flourish — banner-pose held still, letting the crowd come to it",
    lose: "wounded-commander pride — jaw set, one slow exhale, straightening its gear, eyes burning for the rematch",
    presence: "gravity; the frame organizes itself around its stance",
  },
  ascendant: {
    mining:
      "barely moves — minimal godlike gestures; a flick of one paw and the raw dBTC splits itself open in glowing seams",
    win: "barely acknowledges victory — a slow blink, the faintest nod, the aura flares once and settles",
    lose: "a flicker of stillness — the light around it dims a shade; it studies the loss like a puzzle, posture utterly unshaken",
    presence: "serene inevitability; emotion shown in millimeters",
  },
};

/** The acting tokens for one state at one stage. */
export function stagePerformance(
  stage: number | undefined | null,
  state: "mining" | "win" | "lose",
): string {
  return PERFORMANCE_BY_BAND[performanceBand(stage)][state];
}

// ─────────────────────────────────────────────────────────────────────────────
// B4 · NAMED TECHNIQUES — per country × lane (wizard/muggle) move table.
// Power-mutation clips pick from this table; the NAME is for dialogue, captions
// and debut records (Phase D) — only the visualGrammar enters image prompts.
// ─────────────────────────────────────────────────────────────────────────────

export interface NamedTechnique {
  /** Canonical technique name (text surfaces only — never inside images). */
  name: string;
  /** The visual grammar an image/video prompt uses to render the move. */
  visualGrammar: string;
}

export interface CountryTechniques {
  wizard: NamedTechnique[];
  muggle: NamedTechnique[];
}

export const TECHNIQUES: Record<string, CountryTechniques> = {
  usa: {
    wizard: [
      {
        name: "Ticker-Ribbon Time-Stop",
        visualGrammar:
          "golden ticker ribbons snap-freeze the air; coins and debris hang mid-fall while the beast strikes through the stillness",
      },
      {
        name: "Bull-Market Halo",
        visualGrammar:
          "a rising ring of golden market-light surges up from under it, brass-bright energy charging the next blow",
      },
    ],
    muggle: [
      {
        name: "Star-Spangled Drillbreak",
        visualGrammar:
          "the power-drill revs into a star-bright torque burst, drilling a shock-spiral of golden sparks",
      },
      {
        name: "Liberty Slam",
        visualGrammar:
          "a leaping two-paw slam that detonates a gold-and-cyan shockwave on impact",
      },
    ],
  },
  china: {
    wizard: [
      {
        name: "Jade Ring Lockdown",
        visualGrammar:
          "concentric jade time-rings expand and lock the whole scene into stillness — except the beast's strike",
      },
      {
        name: "Five-Year Seal",
        visualGrammar:
          "red-gold lacquer sigils stack into a layered seal that compresses, then releases as one delayed devastating blow",
      },
    ],
    muggle: [
      {
        name: "Dynasty Pick Cascade",
        visualGrammar:
          "a blur of jade-handled pickaxe strikes landing in perfect scheduled rhythm, each crack pre-planned",
      },
      {
        name: "Great Wall Stance",
        visualGrammar:
          "a planted immovable stance; the ground raises a jade-lit rampart that absorbs the hit and returns it",
      },
    ],
  },
  russia: {
    wizard: [
      {
        name: "Frostline Pressure",
        visualGrammar:
          "a blue frost pressure-wave bends the light, freezing a falling coin mid-spin before everything shatters outward",
      },
      {
        name: "Winter Choir",
        visualGrammar:
          "iron-gray aura columns rise around it as hoarfrost crawls outward in a slow killing radius",
      },
    ],
    muggle: [
      {
        name: "Sledge Winter",
        visualGrammar:
          "one slow heavy sledge-pick arc that lands like an avalanche, frost detonating from the impact point",
      },
      {
        name: "Iron Collar Charge",
        visualGrammar:
          "a shoulder-first charge across frozen ground, ice plates shearing up along its path",
      },
    ],
  },
  india: {
    wizard: [
      {
        name: "Chakra Coverdrive",
        visualGrammar:
          "a saffron-cyan chakra arc swung like a cricket stroke, sending a monsoon shockwave through the rain",
      },
      {
        name: "Monsoon Six",
        visualGrammar:
          "rainwater lifts into a stadium ring overhead and crashes down exactly where the strike lands",
      },
    ],
    muggle: [
      {
        name: "Gilded Pick Yorker",
        visualGrammar:
          "a low, fast, pinpoint strike with the gilded chakra-pick — impossible to read, impossible to block",
      },
      {
        name: "Stadium Roar",
        visualGrammar:
          "drum-pulse stomps charge the ground until it erupts in marigold sparks under the opponent",
      },
    ],
  },
  japan: {
    wizard: [
      {
        name: "Katana-Grid Iai",
        visualGrammar:
          "one drawn neon cut that splits falling rain into a clean glowing grid before the world notices the blade moved",
      },
      {
        name: "Cherry-Petal Stillness",
        visualGrammar:
          "drifting petals freeze into a blade-silent circle, then every petal cuts at once",
      },
    ],
    muggle: [
      {
        name: "Forged-Pick Tsubame",
        visualGrammar:
          "a swallow-fast double strike of the katana-forged pick leaving white-red precision trails",
      },
      {
        name: "Honor Guard Break",
        visualGrammar:
          "a single perfect bow, then a pressure cut that fells the target in one clean line",
      },
    ],
  },
  southkorea: {
    wizard: [
      {
        name: "Light-Stick Tempest",
        visualGrammar:
          "violet-cyan stage light snaps into a synchronized wave that detonates across the floor on the beat-drop",
      },
      {
        name: "Encore Wire",
        visualGrammar:
          "blue wire-ribbons yank the beast through impossible mid-air cuts, striking from three angles in one beat",
      },
    ],
    muggle: [
      {
        name: "Laser-Drill Choreo",
        visualGrammar:
          "the hi-tech laser-drill fires in beat-synced bursts — footwork-perfect, each pulse landing on the kick-drum",
      },
      {
        name: "Fan-Chant Barrage",
        visualGrammar:
          "synchronized stomp-chant shockwaves roll outward in glassy violet rings",
      },
    ],
  },
  iran: {
    wizard: [
      {
        name: "Turquoise Verse",
        visualGrammar:
          "calligraphy-like ribbons of turquoise light (purely decorative, no readable text) coil into a pattern that detonates like prophecy",
      },
      {
        name: "Mirage Quartet",
        visualGrammar:
          "three heat-shimmer afterimages strike in sequence, then collapse into the single real blow",
      },
    ],
    muggle: [
      {
        name: "Scimitar-Pick Crescent",
        visualGrammar:
          "an ornate scimitar-pick whirl that carves a bronze crescent of force through the sand-light",
      },
      {
        name: "Gate of Rostam",
        visualGrammar:
          "a planted guardian stance; bronze gate sigils slam outward as tiled shockwaves",
      },
    ],
  },
  uk: {
    wizard: [
      {
        name: "Etiquette Barrier",
        visualGrammar:
          "a porcelain teacup tap rings out a gold-trimmed circular barrier that redirects the attack with terrifying politeness",
      },
      {
        name: "Rain-Map Verdict",
        visualGrammar:
          "raindrops on the air connect into a glowing trace-map that pins the target in place before the strike lands",
      },
    ],
    muggle: [
      {
        name: "Gentleman's Uppercut",
        visualGrammar:
          "the polished pick swung with understated savagery — a brass-light arc and a dry follow-through",
      },
      {
        name: "Terrace Chant Wave",
        visualGrammar:
          "a football-chant shockwave that bounces the target like a pinball through muddy orange sparks",
      },
    ],
  },
  northkorea: {
    wizard: [
      {
        name: "Parade Ground Zero",
        visualGrammar:
          "red banner blocks and a loudspeaker blast slam down in marching unison around the target",
      },
      {
        name: "Choir Lock",
        visualGrammar:
          "white-blue choral waveforms freeze the crowd mid-wave while one conducting paw drops the final note like a hammer",
      },
    ],
    muggle: [
      {
        name: "State-Issue Smash",
        visualGrammar:
          "the stamped state-issue pickaxe falls with absurd ceremonial force, leaving a stamp-impact crater of red light",
      },
      {
        name: "Hundred-Percent March",
        visualGrammar:
          "synchronized phantom march-steps converge from all sides into one stomped shockwave",
      },
    ],
  },
  france: {
    wizard: [
      {
        name: "Chalk Theorem",
        visualGrammar:
          "glowing chalk sigils assemble mid-air into an elegant proof that concludes as a bridge of force collapsing onto the target",
      },
      {
        name: "Gold-Thread Couture",
        visualGrammar:
          "couture gold thread whips out from the cape and stitches the battlefield into a closing trap",
      },
    ],
    muggle: [
      {
        name: "Artisan Engrave",
        visualGrammar:
          "the engraved pick carves one perfect arc, a runway-spotlight flash firing at the exact moment of impact",
      },
      {
        name: "Barricade Rush",
        visualGrammar:
          "cobblestones lift in brass street-rhythm and roll forward as a charging barricade",
      },
    ],
  },
  brazil: {
    wizard: [
      {
        name: "Solar Bicycle Kick",
        visualGrammar:
          "the beast rises in a solar-flare arc and strikes overhead, green-gold sparks raining down like confetti",
      },
      {
        name: "Carnival Glitch",
        visualGrammar:
          "percussion waveforms bend the scene into joyful glitch-frames; the strike lands between two beats",
      },
    ],
    muggle: [
      {
        name: "Caramelo Volley",
        visualGrammar:
          "a street-football volley with the carnival-painted pickaxe, mosaic ground lighting up under the strike",
      },
      {
        name: "Favela Stairfall",
        visualGrammar:
          "a downhill staircase rush, emerald-gold vault light flaring at every step before the impact",
      },
    ],
  },
  israel: {
    wizard: [
      {
        name: "Water-Core Bloom",
        visualGrammar:
          "cyan water-light roots fan out under the sand and erupt upward in a gentle, devastating bloom",
      },
      {
        name: "Desert Static Step",
        visualGrammar:
          "desert-tech cyan glitch cuts (abstract light only, no readable code) flicker the beast behind the target between frames",
      },
    ],
    muggle: [
      {
        name: "Drone Lattice Lock",
        visualGrammar:
          "a cyan drone lattice grids the air — the target is locked from twelve angles before the precision tech-pick lands",
      },
      {
        name: "Negev Sunstrike",
        visualGrammar:
          "a high desert-sun glare flash blinds the lane while the pick lands at the exact same instant",
      },
    ],
  },
};

/**
 * Deterministically pick the named technique for a power moment.
 * Selection: country (factionId) × lane (wizard/muggle) × traitIndex.
 */
export function techniqueFor(
  factionId: number,
  isWizard: boolean,
  traitIndex = 0,
): NamedTechnique {
  const code = countryBible(factionId)?.code || "usa";
  const lanes = TECHNIQUES[code] || TECHNIQUES.usa;
  const list = isWizard ? lanes.wizard : lanes.muggle;
  const i = ((traitIndex % list.length) + list.length) % list.length;
  return list[i];
}

/** All technique names (lint surfaces / debut registries). */
export function allTechniqueNames(): string[] {
  return Object.values(TECHNIQUES).flatMap((c) =>
    [...c.wizard, ...c.muggle].map((t) => t.name),
  );
}
