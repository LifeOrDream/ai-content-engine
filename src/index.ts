export * from "./content-engine/index.js";
export * from "./service/contracts.js";
export * from "./nft-pipeline/index.js";
// HashBeast prompt grammar (faction × category × region × breed) used by the
// NFT pipeline — exported for direct embedding and prompt contributions.
export * as hashbeastPrompts from "./prompts/index.js";
// THE WORLD BIBLE — single source of truth for leaders, lieutenants, lore,
// palettes, voices, mining tools, locations, rivalries, show cast, and the
// style elevation ladder. Import canon from here, never redefine it locally.
export * as worldBible from "./world/bible.js";
// PROGRESSION GRAMMAR — the canonical 8-stage ladder: transition ceremonies,
// aura escalation, per-stage-band performance, named country × lane techniques.
export * as worldProgression from "./world/progression.js";
// BASE TYPES — the body-plan layer above breed ("forms are fluid"): canine
// genesis default + lootbox/rebirth-gated primate, amphibian, feline forms
// with silhouette language, movement grammar, voice timbre modifiers,
// per-country skinning, and starter breed packs.
export * as worldBaseTypes from "./world/baseTypes.js";
// AUDIO IDENTITY — the ownable sound spec: 12 country leitmotifs, evolution
// stings per stage band, story themes, and the casino-ritual SFX catalog,
// all generated through the stable-audio path and referenced by cue id.
export * as worldAudioIdentity from "./world/audioIdentity.js";
