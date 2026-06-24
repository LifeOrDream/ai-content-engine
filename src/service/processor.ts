import {
  analyzeShotListDialogue,
  beatText,
  buildCharacterReferenceBlock,
  buildDirectorPromptBlock,
  buildNegativeVisualPrompt,
  buildSceneKeyframePrompt,
  buildSceneScriptPrompt,
  buildScreenplayPrompt,
  buildVideoMotionRulesBlock,
  isSceneWorthy,
  normalizeScreenplayFromRawText,
  pickTrope,
  scoreBeat,
  tropeForPulse,
} from "../content-engine/index.js";
import type {
  ContentEngineJobKind,
  ContentEngineJobPayload,
  ContentEngineJobResultMap,
  WriteSceneScriptResult,
} from "./contracts.js";
import { generateText, parseJsonLoose } from "./llm.js";
import { generateMintAssets, type NftProgressFn } from "../nft-pipeline/mintAssets.js";
import { generateStateAnimations } from "../nft-pipeline/stateAnimations.js";
import { generateMutationContent } from "../nft-pipeline/mutationContent.js";
import { generateMomentContent } from "../nft-pipeline/momentContent.js";
import { generateCycleSummary } from "../nft-pipeline/cycleSummary.js";
import { generateMintIntro } from "../nft-pipeline/mintIntro.js";
import {
  generateClaimRollCeremony,
  generateLootboxRevealRitual,
} from "../nft-pipeline/ritual.js";
import { generateAudioIdentityCue } from "../world/audioIdentity.js";
import path from "node:path";
import { produceChapterVideo, writeChapterAnatomy } from "./chapterVideo.js";
import { produceReel } from "./reel.js";
import { canonizeChapter } from "../../trailer/world/storyMemory.js";
import {
  archiveChapterSource,
  gitShortSha,
  newVersionDir,
  writeReplayManifest,
} from "../../trailer/world/chapterArchive.js";
import { falKeyStore } from "../utils/falMedia.js";

export interface ProcessJobOptions {
  /**
   * Stage progress hook for long-running media jobs — the worker wires this to
   * BullMQ `job.updateProgress` so backends can react per phase (e.g. map
   * `full_body` progress to their own socket events).
   */
  onProgress?: NftProgressFn;
}

function parseSceneScript(rawText: string): WriteSceneScriptResult | null {
  const parsed = parseJsonLoose<any>(rawText);
  if (!parsed || (!parsed.scene && !parsed.dialogue)) return null;
  return {
    scene: String(parsed.scene || "").trim(),
    dialogue: String(parsed.dialogue || "").trim(),
    caption: String(parsed.caption || "").trim(),
    rawText,
  };
}

export async function processContentEngineJob<K extends ContentEngineJobKind>(
  payload: ContentEngineJobPayload<K>,
  opts: ProcessJobOptions = {},
): Promise<ContentEngineJobResultMap[K]> {
  switch (payload.kind) {
    case "plan_event": {
      const input = payload.input as ContentEngineJobPayload<"plan_event">["input"];
      const kind = input.event.kind;
      const text = beatText(kind, input.factionName, input.event);
      const worth = scoreBeat(kind, input.role, input.arc);
      const trope = pickTrope(kind, input.role, input.arc);
      const sceneWorthy = isSceneWorthy(
        kind,
        input.episodeLike,
        input.quietMs,
        input.nowMs,
      );
      return { text, worth, trope, sceneWorthy } as ContentEngineJobResultMap[K];
    }
    case "plan_pulse": {
      const input = payload.input as ContentEngineJobPayload<"plan_pulse">["input"];
      return { trope: tropeForPulse(input.theme) } as ContentEngineJobResultMap[K];
    }
    case "write_screenplay": {
      const input = payload.input as ContentEngineJobPayload<"write_screenplay">["input"];
      const prompt = buildScreenplayPrompt(input.grounding, input.format);
      const minScore = Math.max(0, Number(process.env.CONTENT_ENGINE_DIALOGUE_MIN_SCORE || 70));

      // Post-LLM dialogue lint + ONE feedback retry. The prompt carries a
      // quality gate, but a gate the model self-administers is not a lint:
      // banned pitch phrases / mechanic words / timing misfits still slip
      // through. This is the same machinery the trailer pipeline uses,
      // applied to the production path.
      const writeOnce = async (extraFeedback?: string) => {
        const fullPrompt = extraFeedback ? `${prompt}\n\n${extraFeedback}` : prompt;
        const rawText = await generateText(fullPrompt, { temperature: 0.78, json: true });
        const screenplay = normalizeScreenplayFromRawText(rawText, input.grounding, input.format);
        const report = screenplay ? analyzeShotListDialogue((screenplay as any).shots || []) : null;
        return { rawText, screenplay, report };
      };

      let attempt = await writeOnce();
      let retried = false;
      if (attempt.screenplay && attempt.report && attempt.report.score < minScore && attempt.report.flaggedCount > 0) {
        const worst = attempt.report.lines
          .filter((l) => l.flags.length > 0)
          .slice(0, 8)
          .map((l) => `- shot ${l.shot} ${l.speaker}: "${l.line}" → ${l.flags.join("; ")}`)
          .join("\n");
        const feedback =
          `REVISION PASS — your previous draft scored ${attempt.report.score}/100 on the dialogue lint. ` +
          `Rewrite the screenplay fixing EVERY flagged line below (keep structure, casting and beats; only repair the dialogue):\n${worst}`;
        const second = await writeOnce(feedback);
        retried = true;
        // keep the better of the two drafts
        if (second.screenplay && second.report && second.report.score >= (attempt.report?.score ?? 0)) {
          attempt = second;
        }
      }
      const qualityReport = attempt.report
        ? {
            score: attempt.report.score,
            flaggedCount: attempt.report.flaggedCount,
            lineCount: attempt.report.lineCount,
            occupancyPct: attempt.report.occupancyPct,
            retried,
          }
        : undefined;
      return { screenplay: attempt.screenplay, rawText: attempt.rawText, qualityReport } as ContentEngineJobResultMap[K];
    }
    case "write_scene_script": {
      const input = payload.input as ContentEngineJobPayload<"write_scene_script">["input"];
      const prompt = buildSceneScriptPrompt(input.promptInput);
      const rawText = await generateText(prompt, { temperature: 0.82, json: true });
      const parsed = parseSceneScript(rawText);
      if (!parsed) throw new Error("scene script LLM returned invalid JSON");
      return parsed as ContentEngineJobResultMap[K];
    }
    case "build_scene_keyframe_prompt": {
      const input = payload.input as ContentEngineJobPayload<"build_scene_keyframe_prompt">["input"];
      return {
        prompt: buildSceneKeyframePrompt(input.promptInput),
      } as ContentEngineJobResultMap[K];
    }
    case "build_character_reference_block": {
      const input = payload.input as ContentEngineJobPayload<"build_character_reference_block">["input"];
      return {
        text: buildCharacterReferenceBlock(input.hashBeast, input.label),
      } as ContentEngineJobResultMap[K];
    }
    case "build_director_prompt_block": {
      const input = payload.input as ContentEngineJobPayload<"build_director_prompt_block">["input"];
      return {
        text: buildDirectorPromptBlock(input.format || { aspectRatio: "9:16" }),
      } as ContentEngineJobResultMap[K];
    }
    case "build_negative_visual_prompt":
      return { text: buildNegativeVisualPrompt() } as ContentEngineJobResultMap[K];
    case "build_video_motion_rules_block": {
      const input = payload.input as ContentEngineJobPayload<"build_video_motion_rules_block">["input"];
      return {
        text: buildVideoMotionRulesBlock(input.format || { aspectRatio: "9:16" }),
      } as ContentEngineJobResultMap[K];
    }
    case "nft.mint_assets": {
      const input = payload.input as ContentEngineJobPayload<"nft.mint_assets">["input"];
      return (await generateMintAssets(input, {
        onProgress: opts.onProgress,
      })) as ContentEngineJobResultMap[K];
    }
    case "nft.state_animations": {
      const input = payload.input as ContentEngineJobPayload<"nft.state_animations">["input"];
      return (await generateStateAnimations(input)) as ContentEngineJobResultMap[K];
    }
    case "nft.mutation_content": {
      const input = payload.input as ContentEngineJobPayload<"nft.mutation_content">["input"];
      return (await generateMutationContent(input)) as ContentEngineJobResultMap[K];
    }
    case "nft.moment_content": {
      const input = payload.input as ContentEngineJobPayload<"nft.moment_content">["input"];
      return (await generateMomentContent(input)) as ContentEngineJobResultMap[K];
    }
    case "nft.cycle_summary": {
      const input = payload.input as ContentEngineJobPayload<"nft.cycle_summary">["input"];
      return (await generateCycleSummary(input)) as ContentEngineJobResultMap[K];
    }
    case "nft.mint_intro": {
      const input = payload.input as ContentEngineJobPayload<"nft.mint_intro">["input"];
      return (await generateMintIntro(input)) as ContentEngineJobResultMap[K];
    }
    case "chapter.write": {
      const input = payload.input as ContentEngineJobPayload<"chapter.write">["input"];
      return (await writeChapterAnatomy(input.facts)) as ContentEngineJobResultMap[K];
    }
    case "chapter.canonize": {
      const input = payload.input as ContentEngineJobPayload<"chapter.canonize">["input"];
      const memory = canonizeChapter(input.chapter);
      const entry = memory.videos.find((v) => v.id === `chapter-${input.chapter.warId}`);
      return { ok: true, videoNo: entry?.videoNo ?? memory.currentVideoNo } as ContentEngineJobResultMap[K];
    }
    case "chapter.produce": {
      const input = payload.input as ContentEngineJobPayload<"chapter.produce">["input"];
      const gitSha = gitShortSha();
      archiveChapterSource(input.facts.warId, { facts: input.facts, gitSha });
      const { version, dir } = newVersionDir(input.facts.warId, gitSha);
      const run = () => produceChapterVideo(input.facts, dir, { scriptOnly: input.scriptOnly });
      // A per-job apiKey overrides the worker's env key for EVERY fal call in this
      // production (media + LLM + music) via the AsyncLocalStorage seam.
      const res = input.apiKey ? await falKeyStore.run({ key: input.apiKey }, run) : await run();
      writeReplayManifest(dir, {
        warId: input.facts.warId,
        version,
        gitSha,
        mode: "produce",
        keySource: input.apiKey ? "user" : "env",
        costUsd: res.costUsd,
        videoPath: res.videoPath ? path.relative(dir, res.videoPath) : null,
        createdAt: new Date().toISOString(),
      });
      return {
        warId: input.facts.warId,
        version,
        dir,
        scenesPath: res.scenesPath,
        videoPath: res.videoPath,
        costUsd: res.costUsd,
      } as ContentEngineJobResultMap[K];
    }
    case "ritual.lootbox_reveal": {
      const input = payload.input as ContentEngineJobPayload<"ritual.lootbox_reveal">["input"];
      return (await generateLootboxRevealRitual(input)) as ContentEngineJobResultMap[K];
    }
    case "ritual.claim_roll": {
      const input = payload.input as ContentEngineJobPayload<"ritual.claim_roll">["input"];
      return (await generateClaimRollCeremony(input)) as ContentEngineJobResultMap[K];
    }
    case "audio.identity_cue": {
      const input = payload.input as ContentEngineJobPayload<"audio.identity_cue">["input"];
      return (await generateAudioIdentityCue(input.cueId)) as ContentEngineJobResultMap[K];
    }
    case "produce_reel": {
      const input = payload.input as ContentEngineJobPayload<"produce_reel">["input"];
      return (await produceReel(input)) as ContentEngineJobResultMap[K];
    }
    default:
      throw new Error(`Unknown content-engine job kind: ${(payload as any)?.kind}`);
  }
}
