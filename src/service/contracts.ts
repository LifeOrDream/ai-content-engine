import type {
  IncomingEventLike,
  Screenplay,
  SceneKeyframePromptInput,
  SceneScriptPromptInput,
  StoryGrounding,
  VideoFormat,
  WorldPulse,
} from "../content-engine/index.js";
import type {
  NftMintAssetsInput,
  NftMintAssetsResult,
} from "../nft-pipeline/mintAssets.js";
import type {
  NftStateAnimationsInput,
  NftStateAnimationsResult,
} from "../nft-pipeline/stateAnimations.js";
import type {
  NftMutationContentInput,
  NftMutationContentResult,
} from "../nft-pipeline/mutationContent.js";
import type {
  NftMomentContentInput,
  NftMomentContentResult,
} from "../nft-pipeline/momentContent.js";
import type {
  NftCycleSummaryInput,
  NftCycleSummaryResult,
} from "../nft-pipeline/cycleSummary.js";
import type {
  NftMintIntroInput,
  NftMintIntroResult,
} from "../nft-pipeline/mintIntro.js";
import type {
  ChapterAnatomy,
  ChapterCycleFacts,
} from "../content-engine/chapterWriter.js";
import type { ReelInput, ProduceReelResult } from "./reel.js";
import type { ChapterCanonInput } from "../../trailer/world/storyMemory.js";
import type {
  RitualClaimRollInput,
  RitualContentResult,
  RitualLootboxRevealInput,
} from "../nft-pipeline/ritual.js";
import type { AudioIdentityCueResult } from "../world/audioIdentity.js";

export const CONTENT_ENGINE_QUEUE =
  process.env.CONTENT_ENGINE_QUEUE || "minebtc-content-engine";

export type ContentEngineJobKind =
  | "plan_event"
  | "plan_pulse"
  | "write_screenplay"
  | "write_scene_script"
  | "build_scene_keyframe_prompt"
  | "build_character_reference_block"
  | "build_director_prompt_block"
  | "build_negative_visual_prompt"
  | "build_video_motion_rules_block"
  // NFT asset pipeline (media jobs — minutes, not seconds; dispatch them
  // fire-and-forget and react to progress/completed events instead of
  // RPC-awaiting; see docs/nft-pipeline.md)
  | "nft.mint_assets"
  | "nft.state_animations"
  | "nft.mutation_content"
  // Extended moment vocabulary (first-win, streaks, revenge, lootbox drama…)
  // — budget-gate dispatch EXACTLY like nft.mutation_content.
  | "nft.moment_content"
  | "nft.cycle_summary"
  // MINT MOMENT (Phase D1): "joined the war" intro panel + intro line —
  // budget-gate dispatch EXACTLY like nft.mutation_content.
  | "nft.mint_intro"
  // HASHIDEN chapters (Phase D2/D3): writers-room-lite chapter front-matter
  // (budget-gate like other text/content jobs) + the canonize gate that folds
  // a PUBLISHED chapter into story memory.
  | "chapter.write"
  | "chapter.canonize"
  // HASHIDEN chapter VIDEO (engine-owned): produce a full chapter episode video
  // from cycle facts (chapter anatomy → synthesized blueprint → scenes.json →
  // Seedance render). Archives the facts + versions the output for replay; an
  // optional per-job apiKey bills an operator's own fal account.
  | "chapter.produce"
  // REELS (engine-owned): produce a short reel video from a dispatched
  // blueprint spec (grounding + beats) → trailer pipeline → S3. The Phase-4
  // cutover target for the backend's in-process showrunner reel renderer.
  | "produce_reel"
  // CASINO RITUALS (Phase F1/F2): staged reveal definitions (acts + rarity
  // light language + sound ids), NOT toasts. Deterministic + free by default;
  // includeDialogue opts into the paid voice path — budget-gate dispatch
  // EXACTLY like nft.mutation_content. See docs/rituals-and-audio.md.
  | "ritual.lootbox_reveal"
  | "ritual.claim_roll"
  // AUDIO IDENTITY (Phase F4): generate ONE catalog cue via the stable-audio
  // path. Flag-gated engine-side (AUDIO_IDENTITY_GENERATION_ENABLED) and
  // budget-gated backend-side (category "audio"). Cues are generated once and
  // referenced by id — never mass-generate.
  | "audio.identity_cue";

export interface PlanEventInput {
  event: IncomingEventLike;
  factionName: string;
  role: string;
  arc: string;
  episodeLike?: any;
  quietMs: number;
  nowMs?: number;
}

export interface PlanEventResult {
  text: string;
  worth: number;
  trope: string;
  sceneWorthy: boolean;
}

export interface PlanPulseInput {
  theme: WorldPulse["theme"];
}

export interface PlanPulseResult {
  trope: string;
}

export interface WriteScreenplayInput {
  grounding: StoryGrounding;
  format: VideoFormat;
}

export interface WriteScreenplayResult {
  screenplay: Screenplay | null;
  rawText?: string;
  /** Post-LLM dialogue lint (score 0-100, flags per line) — production QA. */
  qualityReport?: {
    score: number;
    flaggedCount: number;
    lineCount: number;
    occupancyPct: number;
    retried: boolean;
  };
}

export interface WriteSceneScriptInput {
  promptInput: SceneScriptPromptInput;
}

export interface WriteSceneScriptResult {
  scene: string;
  dialogue: string;
  caption: string;
  rawText?: string;
}

export interface BuildSceneKeyframePromptInput {
  promptInput: SceneKeyframePromptInput;
}

export interface BuildSceneKeyframePromptResult {
  prompt: string;
}

export interface BuildCharacterReferenceBlockInput {
  hashBeast: any;
  label?: string;
}

export interface BuildTextBlockResult {
  text: string;
}

export interface BuildDirectorPromptBlockInput {
  format?: Partial<VideoFormat> & { aspectRatio?: VideoFormat["aspectRatio"] };
}

export interface ChapterWriteInput {
  facts: ChapterCycleFacts;
}

export interface ChapterCanonizeInput {
  chapter: ChapterCanonInput;
}

export interface ChapterCanonizeResult {
  ok: boolean;
  /** Memory entry number the chapter folded into. */
  videoNo: number;
}

export interface ChapterProduceInput {
  facts: ChapterCycleFacts;
  /** Operator's own fal key for THIS run (per-job override; never persisted). */
  apiKey?: string;
  /** Stop after scenes.json (skip the expensive render). */
  scriptOnly?: boolean;
}

export interface ChapterProduceResult {
  warId: number;
  /** Version id "<timestamp>-<gitSha>" — the output is at out/chapters/<warId>/<version>/. */
  version: string;
  /** Absolute version directory. */
  dir: string;
  scenesPath: string;
  /** Absolute final video path (null when scriptOnly or the render failed). */
  videoPath: string | null;
  costUsd: number | null;
}

export interface AudioIdentityCueJobInput {
  /** Catalog cue id (src/world/audioIdentity.ts ALL_AUDIO_CUE_IDS). */
  cueId: string;
}

export interface ContentEngineJobPayloadMap {
  plan_event: PlanEventInput;
  plan_pulse: PlanPulseInput;
  write_screenplay: WriteScreenplayInput;
  write_scene_script: WriteSceneScriptInput;
  build_scene_keyframe_prompt: BuildSceneKeyframePromptInput;
  build_character_reference_block: BuildCharacterReferenceBlockInput;
  build_director_prompt_block: BuildDirectorPromptBlockInput;
  build_negative_visual_prompt: Record<string, never>;
  build_video_motion_rules_block: BuildDirectorPromptBlockInput;
  "nft.mint_assets": NftMintAssetsInput;
  "nft.state_animations": NftStateAnimationsInput;
  "nft.mutation_content": NftMutationContentInput;
  "nft.moment_content": NftMomentContentInput;
  "nft.cycle_summary": NftCycleSummaryInput;
  "nft.mint_intro": NftMintIntroInput;
  "chapter.write": ChapterWriteInput;
  "chapter.canonize": ChapterCanonizeInput;
  "chapter.produce": ChapterProduceInput;
  produce_reel: ReelInput;
  "ritual.lootbox_reveal": RitualLootboxRevealInput;
  "ritual.claim_roll": RitualClaimRollInput;
  "audio.identity_cue": AudioIdentityCueJobInput;
}

export interface ContentEngineJobResultMap {
  plan_event: PlanEventResult;
  plan_pulse: PlanPulseResult;
  write_screenplay: WriteScreenplayResult;
  write_scene_script: WriteSceneScriptResult;
  build_scene_keyframe_prompt: BuildSceneKeyframePromptResult;
  build_character_reference_block: BuildTextBlockResult;
  build_director_prompt_block: BuildTextBlockResult;
  build_negative_visual_prompt: BuildTextBlockResult;
  build_video_motion_rules_block: BuildTextBlockResult;
  "nft.mint_assets": NftMintAssetsResult;
  "nft.state_animations": NftStateAnimationsResult;
  "nft.mutation_content": NftMutationContentResult;
  "nft.moment_content": NftMomentContentResult;
  "nft.cycle_summary": NftCycleSummaryResult;
  "nft.mint_intro": NftMintIntroResult;
  "chapter.write": ChapterAnatomy;
  "chapter.canonize": ChapterCanonizeResult;
  "chapter.produce": ChapterProduceResult;
  produce_reel: ProduceReelResult;
  "ritual.lootbox_reveal": RitualContentResult;
  "ritual.claim_roll": RitualContentResult;
  "audio.identity_cue": AudioIdentityCueResult;
}

export type ContentEngineJobPayload<K extends ContentEngineJobKind = ContentEngineJobKind> = {
  kind: K;
  input: ContentEngineJobPayloadMap[K];
};
