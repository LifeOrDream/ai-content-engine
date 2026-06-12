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
