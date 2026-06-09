import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { Blueprint, Screenplay, Sequence } from "./types.js";
import { resolveReferenceAsset } from "../world/assetRegistry.js";
import { analyzeScreenplayDialogue } from "../../src/content-engine/dialogueQuality.js";

export const RUN_MANIFEST_FILE = "run-manifest.json";

export type RunStageKind =
  | "script"
  | "compile"
  | "frames"
  | "image"
  | "video"
  | "audio"
  | "subtitle"
  | "assemble"
  | "publish";

export type RunStageStatus = "pending" | "running" | "success" | "failed" | "skipped";

export interface RunStageRecord {
  id: string;
  kind: RunStageKind;
  label: string;
  status: RunStageStatus;
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  model?: string;
  command?: string[];
  outputFiles?: string[];
  notes?: string[];
  error?: string;
}

export interface RunArtifactRecord {
  kind: "script" | "json" | "image" | "video" | "audio" | "subtitle" | "log" | "prompt";
  label: string;
  path: string;
  bytes?: number;
  createdAt: string;
}

export interface RunReferenceRecord {
  sequence: number | string;
  kind: "character" | "country" | "asset" | "environment-chain" | "unknown";
  ref: string;
  label?: string;
  repoPath?: string;
  status: "ready" | "planned" | "missing";
}

export interface RunFalRequestRecord {
  stageId: string;
  model: string;
  requestId?: string;
  outputUrl?: string;
  sequence?: number | string;
  createdAt: string;
  durationSecs?: number;
  resolution?: string;
}

export interface RunCostEstimate {
  currency: "USD";
  llmCalls: number;
  imageCalls: number;
  videoCalls: number;
  videoSeconds: number;
  estimatedUsd: number;
  assumptions: string[];
}

export interface RunQualitySummary {
  dialogueScore?: number;
  flaggedDialogue?: number;
  dialogueLines?: number;
  spokenSeconds?: number;
  dialogueAvailableSeconds?: number;
  dialogueOccupancyPct?: number;
  startFrameCount?: number;
  endFrameCount?: number;
  totalRefs?: number;
  missingStartFrames?: Array<number | string>;
  missingRefs?: Array<number | string>;
}

export interface RunManifest {
  version: 1;
  blueprintId: string;
  title: string;
  logline?: string;
  createdAt: string;
  updatedAt: string;
  gitCommit?: string;
  targetSeconds?: number;
  stages: RunStageRecord[];
  artifacts: RunArtifactRecord[];
  references: RunReferenceRecord[];
  falRequests: RunFalRequestRecord[];
  subtitles: RunArtifactRecord[];
  costEstimate?: RunCostEstimate;
  quality?: RunQualitySummary;
}

function nowIso(): string {
  return new Date().toISOString();
}

function manifestPath(outDir: string): string {
  return path.join(outDir, RUN_MANIFEST_FILE);
}

function gitCommit(outDir: string): string | undefined {
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
      cwd: path.resolve(outDir, "../.."),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return undefined;
  }
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

function safeRel(outDir: string, file: string): string {
  const rel = path.relative(outDir, file).replace(/\\/g, "/");
  return rel.startsWith("..") ? file.replace(/\\/g, "/") : rel;
}

function writeManifest(outDir: string, manifest: RunManifest): RunManifest {
  fs.mkdirSync(outDir, { recursive: true });
  manifest.updatedAt = nowIso();
  fs.writeFileSync(manifestPath(outDir), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return manifest;
}

export function loadRunManifest(outDir: string): RunManifest | null {
  return readJson<RunManifest>(manifestPath(outDir));
}

export function ensureRunManifest(outDir: string, blueprint: Pick<Blueprint, "id" | "title" | "logline" | "targetSeconds">): RunManifest {
  const existing = loadRunManifest(outDir);
  if (existing) {
    existing.blueprintId = blueprint.id;
    existing.title = blueprint.title || existing.title;
    existing.logline = blueprint.logline || existing.logline;
    existing.targetSeconds = blueprint.targetSeconds || existing.targetSeconds;
    existing.gitCommit = existing.gitCommit || gitCommit(outDir);
    return writeManifest(outDir, existing);
  }

  return writeManifest(outDir, {
    version: 1,
    blueprintId: blueprint.id,
    title: blueprint.title || blueprint.id,
    logline: blueprint.logline,
    targetSeconds: blueprint.targetSeconds,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    gitCommit: gitCommit(outDir),
    stages: [],
    artifacts: [],
    references: [],
    falRequests: [],
    subtitles: [],
  });
}

export function mutateRunManifest(outDir: string, mutator: (manifest: RunManifest) => void): RunManifest {
  const existing = loadRunManifest(outDir);
  if (!existing) throw new Error(`Run manifest missing at ${manifestPath(outDir)}`);
  mutator(existing);
  return writeManifest(outDir, existing);
}

export function beginRunStage(outDir: string, stage: Omit<RunStageRecord, "status" | "startedAt" | "endedAt" | "durationMs">): void {
  mutateRunManifest(outDir, (manifest) => {
    const existing = manifest.stages.find((item) => item.id === stage.id);
    const next: RunStageRecord = {
      ...stage,
      status: "running",
      startedAt: nowIso(),
      outputFiles: stage.outputFiles || existing?.outputFiles || [],
      notes: stage.notes || existing?.notes || [],
    };
    if (existing) Object.assign(existing, next);
    else manifest.stages.push(next);
  });
}

export function completeRunStage(outDir: string, id: string, patch: Partial<RunStageRecord> = {}): void {
  mutateRunManifest(outDir, (manifest) => {
    const stage = manifest.stages.find((item) => item.id === id);
    if (!stage) return;
    const endedAt = nowIso();
    stage.status = patch.status || "success";
    stage.endedAt = endedAt;
    stage.durationMs = stage.startedAt ? new Date(endedAt).getTime() - new Date(stage.startedAt).getTime() : undefined;
    Object.assign(stage, patch, { status: stage.status, endedAt, durationMs: stage.durationMs });
  });
}

export function failRunStage(outDir: string, id: string, error: unknown): void {
  completeRunStage(outDir, id, {
    status: "failed",
    error: error instanceof Error ? error.message : String(error),
  });
}

export function registerRunArtifact(outDir: string, artifact: Omit<RunArtifactRecord, "createdAt" | "bytes"> & { bytes?: number }): void {
  mutateRunManifest(outDir, (manifest) => {
    const abs = path.resolve(outDir, artifact.path);
    const rel = safeRel(outDir, abs);
    const bytes = fs.existsSync(abs) ? fs.statSync(abs).size : artifact.bytes;
    const next: RunArtifactRecord = { ...artifact, path: rel, bytes, createdAt: nowIso() };
    const existing = manifest.artifacts.find((item) => item.path === next.path && item.kind === next.kind);
    if (existing) Object.assign(existing, next);
    else manifest.artifacts.push(next);
  });
}

export function registerFalRequest(outDir: string, request: Omit<RunFalRequestRecord, "createdAt">): void {
  mutateRunManifest(outDir, (manifest) => {
    manifest.falRequests.push({ ...request, createdAt: nowIso() });
  });
}

function repoRelative(file: string): string {
  const root = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));
  return path.relative(root, file).replace(/\\/g, "/");
}

function refsForSequence(outDir: string, seq: Sequence): RunReferenceRecord[] {
  const refs = seq.startFrame?.refs || [];
  return refs.map((ref) => {
    const resolved = resolveReferenceAsset(ref);
    if (resolved) {
      const exists = fs.existsSync(resolved.absolutePath);
      return {
        sequence: seq.n,
        kind: resolved.kind === "asset" ? "asset" : "country",
        ref,
        label: resolved.label,
        repoPath: exists ? repoRelative(resolved.absolutePath) : undefined,
        status: exists ? "ready" : "missing",
      };
    }
    const env = /^env:seq(\d+)\.(startFrame|endFrame)$/i.exec(ref);
    if (env) {
      const frame = path.join(outDir, "frames", `seq_${String(Number(env[1])).padStart(2, "0")}_${env[2].toLowerCase() === "endframe" ? "end" : "start"}.png`);
      return {
        sequence: seq.n,
        kind: "environment-chain",
        ref,
        label: path.basename(frame),
        status: fs.existsSync(frame) ? "ready" : "planned",
        repoPath: safeRel(outDir, frame),
      };
    }
    if (/^@[a-z0-9_]+/i.test(ref)) {
      return {
        sequence: seq.n,
        kind: "character",
        ref,
        label: ref,
        status: "planned",
      };
    }
    return { sequence: seq.n, kind: "unknown", ref, status: "missing" };
  });
}

function estimateCost(screenplay: Screenplay, llmCalls: number): RunCostEstimate {
  const imageUsd = Number(process.env.TRAILER_COST_IMAGE_USD || 0.04);
  const videoSecondUsd = Number(process.env.TRAILER_COST_VIDEO_SECOND_USD || 0.16);
  const llmUsd = Number(process.env.TRAILER_COST_LLM_CALL_USD || 0.03);
  const sequences = screenplay.sequences || [];
  const imageCalls = sequences.reduce((sum, seq) => {
    const start = seq.startFrame?.refs?.length ? 1 : 0;
    const end = seq.endFrame?.refs?.length ? 1 : 0;
    return sum + start + end;
  }, 0);
  const videoCalls = sequences.length;
  const videoSeconds = sequences.reduce((sum, seq) => sum + Math.max(4, Math.round(Number(seq.durationSec) || 0)), 0);
  const estimatedUsd = imageCalls * imageUsd + videoSeconds * videoSecondUsd + llmCalls * llmUsd;
  return {
    currency: "USD",
    llmCalls,
    imageCalls,
    videoCalls,
    videoSeconds,
    estimatedUsd: Number(estimatedUsd.toFixed(2)),
    assumptions: [
      `image edit $${imageUsd}/call`,
      `Seedance video $${videoSecondUsd}/second`,
      `LLM pass $${llmUsd}/call`,
      "Rough planning estimate only; provider invoices remain source of truth.",
    ],
  };
}

function srtTime(seconds: number): string {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const r = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(r).padStart(3, "0")}`;
}

function vttTime(seconds: number): string {
  return srtTime(seconds).replace(",", ".");
}

function subtitleCues(screenplay: Screenplay): Array<{ start: number; end: number; text: string }> {
  const cues: Array<{ start: number; end: number; text: string }> = [];
  let offset = 0;
  for (const seq of screenplay.sequences || []) {
    for (const shot of seq.shots || []) {
      const dialogue = (shot.dialogue || [])
        .filter((line) => line.line?.trim())
        .map((line) => `${line.speaker}: ${line.line.trim()}`);
      const text = dialogue.length ? dialogue.join("\n") : String(shot.caption || "").trim();
      if (!text) continue;
      cues.push({
        start: offset + Number(shot.startSec || 0),
        end: offset + Number(shot.endSec || Number(shot.startSec || 0) + 2),
        text,
      });
    }
    offset += Math.max(0, Number(seq.durationSec || 0));
  }
  return cues;
}

export function writeSubtitleArtifacts(outDir: string, screenplay: Screenplay): RunArtifactRecord[] {
  const cues = subtitleCues(screenplay);
  if (cues.length === 0) return [];
  const srt = cues.map((cue, index) => [
    String(index + 1),
    `${srtTime(cue.start)} --> ${srtTime(cue.end)}`,
    cue.text,
    "",
  ].join("\n")).join("\n");
  const vtt = `WEBVTT\n\n${cues.map((cue) => [
    `${vttTime(cue.start)} --> ${vttTime(cue.end)}`,
    cue.text,
    "",
  ].join("\n")).join("\n")}`;
  fs.writeFileSync(path.join(outDir, "subtitles.srt"), srt, "utf8");
  fs.writeFileSync(path.join(outDir, "subtitles.vtt"), vtt, "utf8");
  const createdAt = nowIso();
  return ["subtitles.srt", "subtitles.vtt"].map((file) => ({
    kind: "subtitle" as const,
    label: file.endsWith(".srt") ? "YouTube SRT subtitles" : "WebVTT subtitles",
    path: file,
    bytes: fs.statSync(path.join(outDir, file)).size,
    createdAt,
  }));
}

export function refreshRunManifestFromScreenplay(outDir: string, screenplay: Screenplay, opts: { llmCalls?: number } = {}): RunManifest {
  return mutateRunManifest(outDir, (manifest) => {
    manifest.title = screenplay.title || manifest.title;
    manifest.logline = screenplay.logline || manifest.logline;
    const refs = (screenplay.sequences || []).flatMap((seq) => refsForSequence(outDir, seq));
    const frameSequences = screenplay.sequences || [];
    const missingStartFrames = frameSequences.filter((seq) => !seq.startFrame?.prompt).map((seq) => seq.n);
    const missingRefs = frameSequences.filter((seq) => seq.characters?.length && !seq.startFrame?.refs?.length).map((seq) => seq.n);
    const subtitles = writeSubtitleArtifacts(outDir, screenplay);
    const dialogue = analyzeScreenplayDialogue(screenplay);
    fs.writeFileSync(path.join(outDir, "dialogue-quality.json"), JSON.stringify(dialogue, null, 2) + "\n", "utf8");
    const dialogueArtifact: RunArtifactRecord = {
      kind: "json",
      label: "Dialogue quality report",
      path: "dialogue-quality.json",
      bytes: fs.statSync(path.join(outDir, "dialogue-quality.json")).size,
      createdAt: nowIso(),
    };
    manifest.references = refs;
    manifest.subtitles = subtitles;
    for (const artifact of [...subtitles, dialogueArtifact]) {
      const existing = manifest.artifacts.find((item) => item.path === artifact.path && item.kind === artifact.kind);
      if (existing) Object.assign(existing, artifact);
      else manifest.artifacts.push(artifact);
    }
    manifest.costEstimate = estimateCost(screenplay, opts.llmCalls || 6);
    manifest.quality = {
      dialogueLines: dialogue.lineCount,
      flaggedDialogue: dialogue.flaggedCount,
      dialogueScore: dialogue.score,
      spokenSeconds: dialogue.spokenSeconds,
      dialogueAvailableSeconds: dialogue.availableSeconds,
      dialogueOccupancyPct: dialogue.occupancyPct,
      startFrameCount: frameSequences.filter((seq) => seq.startFrame?.prompt).length,
      endFrameCount: frameSequences.filter((seq) => seq.endFrame?.prompt).length,
      totalRefs: refs.length,
      missingStartFrames,
      missingRefs,
    };
  });
}
