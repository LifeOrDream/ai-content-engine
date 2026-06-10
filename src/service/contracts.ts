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
  NftCycleSummaryInput,
  NftCycleSummaryResult,
} from "../nft-pipeline/cycleSummary.js";

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
  | "nft.cycle_summary";

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
  "nft.cycle_summary": NftCycleSummaryInput;
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
  "nft.cycle_summary": NftCycleSummaryResult;
}

export type ContentEngineJobPayload<K extends ContentEngineJobKind = ContentEngineJobKind> = {
  kind: K;
  input: ContentEngineJobPayloadMap[K];
};
