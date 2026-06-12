/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BASE TYPES — the body-plan layer ABOVE breed ("forms are fluid").
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The Mining Wars grammar historically hardcoded one body plan: the
 * anthropomorphic bipedal dog (48 canine breeds across 12 countries). This
 * module introduces a BASE-TYPE layer above breed:
 *
 *   - canine    — the genesis default. Every genesis HashBeast is canine and
 *                 the legacy prompt grammar already encodes its language, so
 *                 the canine injection helpers return EMPTY strings: existing
 *                 mint/animation prompts stay byte-identical.
 *   - primate   — climb-and-swing movement, long-armed silhouettes.
 *   - amphibian — springy, low-slung, wide-mouthed meme-frog energy.
 *   - feline    — silent-precision cat-ninja movement.
 *
 * Per base type this module defines: silhouette language, movement grammar,
 * a voice timbre modifier, per-country skinning rules (the country style from
 * the world bible modulates the base type — a Brazil primate reads nothing
 * like a Japan primate), and a starter breed pack (4 breeds, indexed by the
 * same DNA breed bits canine uses).
 *
 * AVAILABILITY IS GATED. Non-canine base types enter the game ONLY through
 * the lootbox / rebirth path — the backend decides who is allowed to carry a
 * `baseType` other than canine and what the allowlist is at any moment
 * (HASHBEAST_BASE_TYPE_ALLOWLIST). The engine's job is to validate the field
 * and render the form; it never grants one.
 *
 * HARD CANON RULES apply unchanged at every base type:
 *   - Never render country flags as clothing/headwear/fabric on characters.
 *     National identity comes from costume style + palette only.
 *   - No readable text inside generated images. Ever.
 *   - Every country reads as a key player.
 */

import { getBreedForHashBeast, type BreedData } from "../prompts/breeds.prompts.js";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseTypeId = "canine" | "primate" | "amphibian" | "feline";

export const BASE_TYPE_IDS: BaseTypeId[] = ["canine", "primate", "amphibian", "feline"];

/** Genesis default — every beast without an explicit baseType is canine. */
export const DEFAULT_BASE_TYPE: BaseTypeId = "canine";

/** A breed inside a base-type starter pack (BreedData-compatible). */
export interface BaseTypeBreed extends BreedData {
  /** Base-body sprite filename, resolved under `basetypes/<baseType>/`. */
  baseBodyFile: string;
}

export interface BaseTypeDefinition {
  id: BaseTypeId;
  label: string;
  /** Noun used in render prompts ("dog", "primate", "frog-like amphibian", "cat"). */
  renderNoun: string;
  /** Mascot phrase used in announcer/voice prompts ("dog-warrior mascot"). */
  mascotPhrase: string;
  /** Silhouette language injected into image prompts (non-canine only). */
  silhouetteLanguage: string;
  /** Movement grammar injected into animation/transition prompts. */
  movementGrammar: string;
  /** Timbre modifier appended to voice-design prompts ("" for canine). */
  voiceTimbreModifier: string;
  /** How country style (bible costume + palette) lands on this body plan. */
  countrySkinning: string;
  /** Per-country skin notes, factionId 0-11. Empty for canine (legacy grammar). */
  countrySkins: Record<number, string>;
  /**
   * Starter breed pack (4 entries, indexed by DNA breed bits 0-3).
   * null for canine — canine resolves through the 48-breed BREED_REGISTRY.
   */
  breeds: BaseTypeBreed[] | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const BASE_TYPES: Record<BaseTypeId, BaseTypeDefinition> = {
  canine: {
    id: "canine",
    label: "Canine",
    renderNoun: "dog",
    mascotPhrase: "dog-warrior mascot",
    silhouetteLanguage:
      "Classic HashBeast dog silhouette — upright bipedal stance, breed-specific ears/tail/coat from the canine breed registry.",
    movementGrammar:
      "Pack-fighter grammar: planted four-square stances, charging sprints, tail and ear signals, loyal shoulder-to-shoulder formation energy.",
    voiceTimbreModifier: "",
    countrySkinning:
      "Country skinning for canines lives in the legacy faction grammar (src/prompts/factions/*) — 4 bespoke breeds per country.",
    countrySkins: {},
    breeds: null,
  },

  primate: {
    id: "primate",
    label: "Primate",
    renderNoun: "primate (monkey/ape)",
    mascotPhrase: "monkey-warrior mascot",
    silhouetteLanguage:
      "Long-armed primate silhouette: arms visibly longer than legs, high mobile shoulder line, gripping hands AND feet, expressive brow-heavy face, optional prehensile tail. Reads instantly as a primate, never as a dog.",
    movementGrammar:
      "Climb-and-swing grammar: brachiation arcs, knuckle-walk lopes between bursts, sudden vertical takeoffs up scaffolding and rigging, one-arm hangs while the free hand works, gear gripped mid-swing.",
    voiceTimbreModifier:
      "Hooting, chattering primate energy under the accent — quick whooping laughs, chest-thump emphasis on big claims.",
    countrySkinning:
      "Country style modulates the primate body: sleeve cuts and harnesses sized for long arms, grip gear on hands and feet, fur grooming and palette per the country's costume language. Never flag-print fabric.",
    countrySkins: {
      0: "USA primate: flight-jacket and varsity cuts tailored for long arms, mission-patch harness in navy/red with white-star hardware, confident open-mouth grin, ticker-gold accents.",
      1: "China primate: jade-trimmed silk strategy robes with reinforced climbing cuffs, imperial topknot grooming, red-gold palette, controlled wuxia poise even mid-swing.",
      2: "Russia primate: frost-dusted heavy fur, fur-lined industrial cold-weather rig, steel-and-crimson hardware, slow powerful hangs instead of flashy swings.",
      3: "India primate: temple-rooftop acrobat — marigold and peacock palette, ornate brass bangles on wrists AND ankles, henna-style etching on armor plates, festival-crowd showmanship.",
      4: "Japan primate: onsen-macaque calm — clean tech-ronin layers in indigo/crimson, immaculate grooming, zen stillness between precise explosive leaps.",
      5: "South Korea primate: idol-polish styling — pastel-neon streetwear armor with esports sponsor-free patches (abstract shapes only), synchronized dance-crew energy in every landing.",
      6: "Iran primate: caravan-mountaineer — turquoise-and-bronze woven textiles, knotted rope-and-charm climbing gear, patient watchful hang above the bazaar.",
      7: "UK primate: Gibraltar propriety — tweed waistcoat cut for long arms, brass pocket-chain, dry unimpressed brow, navy/red/white tailoring, swings like it's beneath him.",
      8: "North Korea primate: parade-drilled — stamped olive uniform cuts, oversized medals that clatter mid-swing, rigid choreographed climbing lines.",
      9: "France primate: salon-groomed chic — couture cape drape engineered to flow in a swing, gold-trim bleu/blanc/rouge palette, lands every jump like a runway exit.",
      10: "Brazil primate: carnival blaze — sun-gold mane styling, green-and-gold festival gear, capoeira-flow swings, celebration always one beat away.",
      11: "Israel primate: desert rooftop scout — sand-tone tactical layers with cyan tech accents, cable-rig climbing hardware, alert minimal movement.",
    },
    breeds: [
      {
        name: "Macaque",
        description: "Compact agile all-rounder, the street-smart standard of the primate pack",
        bodyPrompt:
          "A macaque primate body — compact muscular build, medium fur with expressive brow ridge, long agile arms with gripping hands and feet, short tail, quick alert posture built for scrambling and sudden leaps",
        silhouette: "Compact long-armed primate with short tail, alert hunched-ready stance",
        baseBodyFile: "macaque.png",
      },
      {
        name: "Capuchin",
        description: "Small clever trickster build, fastest hands in the war",
        bodyPrompt:
          "A capuchin primate body — small wiry build, cap-like dark crown marking over a pale expressive face, long prehensile tail, nimble fingers, perpetual scheming energy",
        silhouette: "Small wiry primate with long curling prehensile tail, big expressive face",
        baseBodyFile: "capuchin.png",
      },
      {
        name: "Gibbon",
        description: "Lanky swing-built acrobat, arms like grappling cables",
        bodyPrompt:
          "A gibbon primate body — lean lanky build with spectacularly long arms reaching past the knees, no tail, small round head, sleek fur, built entirely for brachiation and momentum",
        silhouette: "Lanky tailless primate, arms dramatically longer than legs",
        baseBodyFile: "gibbon.png",
      },
      {
        name: "Gorilla",
        description: "Massive powerhouse, the heavy-armor frame of the primate pack",
        bodyPrompt:
          "A gorilla primate body — massive heavy-boned build, huge shoulders and chest, powerful knuckle-walk forearms, short legs, broad calm face with heavy brow, silverback gravity",
        silhouette: "Massive broad-shouldered primate, knuckle-down power stance",
        baseBodyFile: "gorilla.png",
      },
    ],
  },

  amphibian: {
    id: "amphibian",
    label: "Amphibian",
    renderNoun: "frog-like amphibian",
    mascotPhrase: "frog-warrior mascot",
    silhouetteLanguage:
      "Low wide-mouthed amphibian silhouette: big round eyes set high on the head, smooth or warty skin instead of fur, powerful coiled haunches, finger-pad hands, wide confident mouth. Interpret fur-color traits as skin tone and pattern. Reads instantly as an amphibian, never as a dog.",
    movementGrammar:
      "Springy low-slung grammar: deep crouches that coil energy, sudden long-jump launches, sticky-pad wall clings, low gliding hops between stances, throat-sac swell before a big move.",
    voiceTimbreModifier:
      "Croaky resonant amphibian timbre under the accent — throaty ribbit undertones between phrases, a deep gulping breath before big lines.",
    countrySkinning:
      "Country style modulates the amphibian body: collar and throat-line tailoring (the throat sac stays free), haunch-cut trousers or wraps, water-ready gear, skin pattern echoing the country palette. Never flag-print fabric.",
    countrySkins: {
      0: "USA amphibian: swamp-airboat operator energy — utility vest cut high above the haunches, navy/red hardware, star-spangled-free palette with white-star rivets, smug wide grin.",
      1: "China amphibian: jade-pond sage — silk wrap robe with open throat line, lotus-pad shoulder pads, red-gold skin pattern accents, unhurried watchful blink.",
      2: "Russia amphibian: frozen-lake survivor — insulated wader gear, frost-pale skin mottling, steel-and-crimson buckles, immovable squat stance.",
      3: "India amphibian: monsoon celebrant — marigold garland over a peacock-pattern back, brass anklets above spring-loaded haunches, joyful rain-dance energy.",
      4: "Japan amphibian: koi-pond ronin — minimal indigo wrap, crimson skin accents like brush strokes, perfect stillness then one decisive leap.",
      5: "South Korea amphibian: neon-arcade hopper — pastel-neon bodysuit panels, LED-trim pads on the fingers, rhythm-game bounce in idle stance.",
      6: "Iran amphibian: qanat-keeper — turquoise-and-bronze scale-pattern skin, woven water-charm sashes, patient guardian of underground water lines.",
      7: "UK amphibian: garden-pond gentry — tiny tweed waistcoat above bare haunches, brass monocle chain, unimpressed half-lidded eyes, dry croak of disapproval.",
      8: "North Korea amphibian: parade-pond sentinel — stamped olive chest rig, medals pinned above the throat sac, rigid synchronized hop drills.",
      9: "France amphibian: salon dandy — couture cravat clear of the throat sac, gold-trim bleu/blanc/rouge skin sheen, lands every hop in a pose.",
      10: "Brazil amphibian: rainforest carnival — vivid green-and-gold poison-dart skin pattern, festival feather armbands, samba bounce in the haunches.",
      11: "Israel amphibian: desert-oasis tech — sand-tone skin with cyan circuit-like markings, compact hydro-pack rig, still and watchful at the waterline.",
    },
    breeds: [
      {
        name: "Tree Frog",
        description: "Lean springy classic with the wide knowing smirk of meme legend",
        bodyPrompt:
          "A tree frog amphibian body — lean springy build, smooth bright skin, oversized round eyes high on the head, wide confident smirk, large sticky finger pads, long folded jumping legs",
        silhouette: "Lean smooth frog with huge high-set eyes, wide mouth, coiled jumper legs",
        baseBodyFile: "tree_frog.png",
      },
      {
        name: "Bullfrog",
        description: "Heavy tank of the pond, all chest and croak",
        bodyPrompt:
          "A bullfrog amphibian body — heavy barrel build, massive throat sac, broad flat head with hooded eyes, thick powerful haunches, mottled tough skin, immovable heavyweight presence",
        silhouette: "Heavy barrel frog with huge throat sac and thick haunches",
        baseBodyFile: "bullfrog.png",
      },
      {
        name: "Axolotl",
        description: "Pastel regenerator with feathery gills, cute and unkillable",
        bodyPrompt:
          "An axolotl amphibian body — soft pastel build with six feathery external gill fronds framing the head like a crown, perpetual gentle smile, small round eyes, long finned tail, smooth regenerative skin",
        silhouette: "Soft smiling amphibian with feathery gill-crown and finned tail",
        baseBodyFile: "axolotl.png",
      },
      {
        name: "Toad",
        description: "Squat warty bruiser, slow to move and impossible to move",
        bodyPrompt:
          "A toad amphibian body — squat warty build, dry bumpy skin, heavy brow ridge over grumpy eyes, short thick limbs, low wide stance, veteran brawler scars",
        silhouette: "Squat warty toad, low wide grumpy stance",
        baseBodyFile: "toad.png",
      },
    ],
  },

  feline: {
    id: "feline",
    label: "Feline",
    renderNoun: "cat",
    mascotPhrase: "cat-ninja mascot",
    silhouetteLanguage:
      "Lean low-slung feline silhouette: pointed ears high on the head, long expressive tail, soft-paw digitigrade stance, retractable-claw hands, narrow predatory eyes. Reads instantly as a cat, never as a dog.",
    movementGrammar:
      "Silent-precision grammar: low predatory stalks, coiled motionless waits, explosive pounces, soundless landings, tail-counterbalanced wall runs, a slow blink of composure between strikes.",
    voiceTimbreModifier:
      "Smooth sly feline purr under the accent — quiet measured delivery, a rolling purr on confident lines, sudden sharp hiss on insults.",
    countrySkinning:
      "Country style modulates the feline body: sash-and-wrap ninja tailoring that never rustles, soft-step footwear, whisker-safe hoods, palette and costume per the country's style language. Never flag-print fabric.",
    countrySkins: {
      0: "USA feline: night-ops alley ace — navy/red tactical wrap with white-star studs, headset folded back between the ears, cocky tail-flick swagger.",
      1: "China feline: jade-courtyard assassin — silk sash robes in red-gold, paw-wraps, moves like calligraphy, vanishes between lantern shadows.",
      2: "Russia feline: snow-stalker — thick frost-tipped coat groomed flat under a steel-and-crimson harness, patient ambush stillness on the ice.",
      3: "India feline: palace night-dancer — marigold-and-peacock sash, brass ankle bells deliberately silenced with cloth, temple-rooftop poise.",
      4: "Japan feline: the definitive cat-ninja — indigo shinobi wraps, crimson cord, blade-clean lines, one slow blink before the strike.",
      5: "South Korea feline: neon rooftop racer — pastel-neon windbreaker wrap, LED-trim soft boots, idol-precise landing poses.",
      6: "Iran feline: bazaar shadow — turquoise-and-bronze woven sash, desert-sand coat grooming, patient watcher from the high shelf.",
      7: "UK feline: gentleman cat-burglar — charcoal tweed wrap, brass watch-chain, unimpressed half-lidded stare, steals the scene politely.",
      8: "North Korea feline: parade-shadow operative — stamped olive wrap, silent drill-perfect movement, medals stored where they cannot jingle.",
      9: "France feline: couture phantom — tailored bleu/blanc/rouge cape that never snags, gold-trim collar, lands every pounce like a runway turn.",
      10: "Brazil feline: carnival jaguar-spirit — green-and-gold rosette-pattern grooming, festival cord bracelets, samba weight-shifts before the pounce.",
      11: "Israel feline: cyber night-scout — sand-tone wrap with cyan circuit trim, compact drone whistle on a cord, rooftop overwatch stillness.",
    },
    breeds: [
      {
        name: "Shadow Cat",
        description: "Jet-black ninja standard, the silhouette other silhouettes fear",
        bodyPrompt:
          "A black cat feline body — lean jet-black short coat, luminous narrow eyes, tall pointed ears, long fluid tail, digitigrade soft-paw stance, built for total silence",
        silhouette: "Lean jet-black cat with tall ears and long fluid tail",
        baseBodyFile: "shadow_cat.png",
      },
      {
        name: "Siamese",
        description: "Sleek precise duelist with color-point markings and a sharper tongue",
        bodyPrompt:
          "A Siamese feline body — slender elegant build, cream coat with dark color-point mask, ears, paws and tail, piercing blue almond eyes, long fine tail, fencer's poise",
        silhouette: "Slender color-point cat with masked face and piercing blue eyes",
        baseBodyFile: "siamese.png",
      },
      {
        name: "Maine Coon",
        description: "Big-furred bruiser, the heavyweight of the feline pack",
        bodyPrompt:
          "A Maine Coon feline body — large powerful build, long shaggy ruffed coat, tufted lynx-tip ears, huge plumed tail, broad chest, gentle-giant face that hardens in a fight",
        silhouette: "Large shaggy cat with ear tufts, neck ruff and huge plumed tail",
        baseBodyFile: "maine_coon.png",
      },
      {
        name: "Sand Cat",
        description: "Compact desert scout, small body, enormous survival skill",
        bodyPrompt:
          "A sand cat feline body — small compact build, pale sand-colored dense coat, wide flat head with oversized ears low on the skull, furred paw pads for hot ground, desert-hardened scrappy energy",
        silhouette: "Small pale desert cat with wide low-set oversized ears",
        baseBodyFile: "sand_cat.png",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Allowlist + normalization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The base types this deployment is willing to render. The BACKEND controls
 * this (env), exactly like every other content gate: a deployment that has
 * not shipped the lootbox/rebirth path runs with `canine` only.
 * Default: all engine-known base types.
 */
export function baseTypeAllowlist(): BaseTypeId[] {
  const raw = process.env.HASHBEAST_BASE_TYPE_ALLOWLIST || BASE_TYPE_IDS.join(",");
  const list = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is BaseTypeId => (BASE_TYPE_IDS as string[]).includes(s));
  // Canine (genesis) is always renderable.
  return list.includes("canine") ? list : ["canine", ...list];
}

/**
 * STRICT normalization for job inputs (nft.mint_assets): missing/empty →
 * canine; unknown or non-allowlisted values THROW so backend bugs surface
 * instead of silently minting the wrong body plan.
 */
export function normalizeBaseType(input?: string | null): BaseTypeId {
  const value = String(input || "").trim().toLowerCase();
  if (!value) return DEFAULT_BASE_TYPE;
  if (!(BASE_TYPE_IDS as string[]).includes(value)) {
    throw new Error(
      `Unknown baseType "${input}" — expected one of: ${BASE_TYPE_IDS.join(", ")}`,
    );
  }
  const id = value as BaseTypeId;
  if (!baseTypeAllowlist().includes(id)) {
    throw new Error(
      `baseType "${id}" is not in this deployment's allowlist (HASHBEAST_BASE_TYPE_ALLOWLIST)`,
    );
  }
  return id;
}

/**
 * BEST-EFFORT normalization for beast snapshots (animations, dialogue,
 * intros): anything invalid quietly falls back to canine — a bad snapshot
 * field must never kill a content job for an existing beast.
 */
export function safeBaseType(input?: string | null): BaseTypeId {
  const value = String(input || "").trim().toLowerCase();
  return (BASE_TYPE_IDS as string[]).includes(value)
    ? (value as BaseTypeId)
    : DEFAULT_BASE_TYPE;
}

// ─────────────────────────────────────────────────────────────────────────────
// Accessors + prompt builders
// ─────────────────────────────────────────────────────────────────────────────

export function baseTypeDef(id: BaseTypeId): BaseTypeDefinition {
  return BASE_TYPES[id] || BASE_TYPES[DEFAULT_BASE_TYPE];
}

/** Render noun for identity gates / cinematic prompts ("dog", "cat", …). */
export function baseTypeRenderNoun(id: BaseTypeId): string {
  return baseTypeDef(id).renderNoun;
}

/** Mascot phrase for announcer/voice prompts ("dog-warrior mascot", …). */
export function baseTypeMascotPhrase(id: BaseTypeId): string {
  return baseTypeDef(id).mascotPhrase;
}

/**
 * Per-country skin line for a base type. Canine returns "" — its country
 * skinning is the legacy faction grammar itself.
 */
export function baseTypeCountrySkin(id: BaseTypeId, factionId: number): string {
  if (id === "canine") return "";
  const def = baseTypeDef(id);
  return def.countrySkins[factionId] || def.countrySkinning;
}

/**
 * The injectable image-prompt block for a base type: silhouette language +
 * movement grammar + the country skin. Returns "" for canine so every
 * existing genesis prompt stays byte-identical.
 */
export function baseTypeRenderBlock(id: BaseTypeId, factionId: number): string {
  if (id === "canine") return "";
  const def = baseTypeDef(id);
  return [
    `BASE TYPE: ${def.label} — this character is an anthropomorphic bipedal ${def.renderNoun}, NOT a dog.`,
    `Silhouette: ${def.silhouetteLanguage}`,
    `Movement: ${def.movementGrammar}`,
    `Country skin: ${baseTypeCountrySkin(id, factionId)}`,
  ].join("\n");
}

/**
 * Movement directive for animation strips / transitions. Returns "" for
 * canine (legacy strip prompts unchanged).
 */
export function baseTypeMotionDirective(id: BaseTypeId): string {
  if (id === "canine") return "";
  const def = baseTypeDef(id);
  return `This character is an anthropomorphic ${def.renderNoun} — keep it unmistakably that base type in every frame. ${def.movementGrammar}`;
}

/**
 * Breed resolution across base types. Canine routes to the per-country
 * 48-breed registry; other base types use their global starter pack
 * (indexed by the same DNA breed bits, % pack size).
 */
export function getBreedForBaseType(
  id: BaseTypeId,
  factionId: number,
  breedValue: number,
): BreedData {
  const def = baseTypeDef(id);
  if (!def.breeds || def.breeds.length === 0) {
    return getBreedForHashBeast(factionId, breedValue);
  }
  const idx = ((breedValue % def.breeds.length) + def.breeds.length) % def.breeds.length;
  return def.breeds[idx];
}

/**
 * Base-body sprite filename for a non-canine breed, relative to the base
 * bodies root: `basetypes/<baseType>/<file>`. Returns null for canine
 * (canine base bodies use the legacy per-country layout).
 */
export function baseTypeBaseBodyPath(id: BaseTypeId, breedValue: number): string | null {
  const def = baseTypeDef(id);
  if (!def.breeds || def.breeds.length === 0) return null;
  const idx = ((breedValue % def.breeds.length) + def.breeds.length) % def.breeds.length;
  return `basetypes/${def.id}/${def.breeds[idx].baseBodyFile}`;
}
