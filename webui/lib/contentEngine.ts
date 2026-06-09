import "server-only";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(process.env.CONTENT_ENGINE_ROOT || __dirname, "../..");
export const TRAILER_DIR = path.join(REPO_ROOT, "trailer");
export const BLUEPRINTS_DIR = path.join(TRAILER_DIR, "blueprints");
export const OUT_DIR = path.join(TRAILER_DIR, "out");

export const PASS_IDS = ["engagement", "dialogue", "polish", "direct", "compile", "frames"] as const;
export const PASS_FILES = PASS_IDS.map((id, index) => `${String(index + 1).padStart(2, "0")}-${id}.md`);
export const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);

export type PassId = (typeof PASS_IDS)[number];

export interface BlueprintSummary {
  id: string;
  file: string;
  title: string;
  logline: string;
  targetSeconds: number;
  minSeconds: number;
  countdown: string;
  cta: string;
  cast: string[];
  updatedAt: string;
}

export interface RunSummary {
  id: string;
  title: string;
  updatedAt: string;
  passFiles: string[];
  passCount: number;
  hasScenes: boolean;
  videos: string[];
  activeJobs: string[];
  status: "running" | "ready" | "partial" | "empty";
}

export interface DialogueHealthLine {
  sequence: number | string;
  shot: number | string;
  speaker: string;
  line: string;
  delivery?: string;
  seconds: number;
  wordCount: number;
  minWords: number;
  estimatedSeconds: number;
  flags: string[];
}

export interface DialogueHealth {
  lineCount: number;
  totalWords: number;
  avgWords: number;
  flaggedCount: number;
  score: number;
  lines: DialogueHealthLine[];
}

export interface FrameHealth {
  sequenceCount: number;
  startFrameCount: number;
  endFrameCount: number;
  totalRefs: number;
  missingStartFrames: Array<string | number>;
  missingRefs: Array<string | number>;
}

export interface RunDetail extends RunSummary {
  allFiles: string[];
  scenesSummary: null | {
    totalSeconds: number;
    sequenceCount: number;
    shotCount: number;
    endCard?: unknown;
    look: string;
    firstSequences: Array<{
      n: number | string;
      label?: string;
      durationSec?: number;
      location?: string;
      characters: Array<{ name?: string; refTag?: string; state?: string }>;
      hasStartFrame: boolean;
      startRefs: string[];
      hasEndFrame: boolean;
    }>;
  };
  dialogueHealth: DialogueHealth | null;
  frameHealth: FrameHealth | null;
}

export function safeResolve(baseDir: string, unsafePath: string): string {
  const resolved = path.resolve(baseDir, unsafePath);
  if (resolved !== baseDir && !resolved.startsWith(baseDir + path.sep)) {
    throw new Error("Unsafe path");
  }
  return resolved;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: match[2].trim() };
}

export function listBlueprints(): BlueprintSummary[] {
  if (!fs.existsSync(BLUEPRINTS_DIR)) return [];
  return fs.readdirSync(BLUEPRINTS_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("00-"))
    .sort()
    .map((file) => {
      const abs = path.join(BLUEPRINTS_DIR, file);
      const raw = fs.readFileSync(abs, "utf8");
      const { data } = parseFrontmatter(raw);
      const stat = fs.statSync(abs);
      const id = data.id || file.replace(/\.md$/, "");
      return {
        id,
        file,
        title: data.title || id,
        logline: data.logline || "",
        targetSeconds: Number(data.targetSeconds || 75),
        minSeconds: Number(data.minSeconds || 24),
        countdown: data.countdown || "24:00:00",
        cta: data.cta || "Mine your HashBeast - minebtc.fun",
        cast: (data.cast || "").split(",").map((item) => item.trim()).filter(Boolean),
        updatedAt: stat.mtime.toISOString(),
      };
    });
}

export function blueprintById(id: string): BlueprintSummary | undefined {
  return listBlueprints().find((bp) => bp.id === id || bp.file.replace(/\.md$/, "") === id || bp.file.startsWith(id));
}

function words(text: string): string[] {
  return String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
}

function minDialogueWordsForSlot(seconds: number): number {
  if (seconds < 3) return 0;
  if (seconds < 5) return 4;
  return Math.ceil(Math.max(0, seconds - 1.4) * 2.3 * 0.62);
}

const dialogueSmells: Array<[RegExp, string]> = [
  [/^\s*(slow|sealed|yield|faster|mine|locked)\s*[.!?]?\s*$/i, "single-word prop label"],
  [/\bno yield\b/i, "mechanic phrase"],
  [/\bno pulse\b/i, "mechanic phrase"],
  [/\bscreensaver\b/i, "try-hard tech joke"],
  [/\bvelvet rope\b/i, "launch metaphor"],
  [/\bfounder'?s table\b/i, "launch metaphor"],
  [/\bpick up a pickaxe\b/i, "tutorial phrase"],
  [/\bearn the signal\b/i, "abstract trailer phrase"],
  [/\bfair launch\b/i, "mechanic phrase"],
  [/\bpre[- ]?mine\b/i, "mechanic phrase"],
  [/\binsiders?\b/i, "mechanic phrase"],
  [/\bemissions?\b/i, "mechanic phrase"],
  [/\b4[- ]?hour\b/i, "mechanic phrase"],
  [/\bleaderboard\b/i, "UI/mechanic phrase"],
  [/\brevolutionary|cutting edge|game changing|seamless|paradigm|world class/i, "pitch-deck smell"],
];

function analyzeDialogue(scenes: any): DialogueHealth {
  const lines: DialogueHealthLine[] = [];
  for (const seq of scenes?.sequences || []) {
    for (const shot of seq.shots || []) {
      const seconds = Math.max(0, Number(shot.endSec || 0) - Number(shot.startSec || 0));
      for (const line of shot.dialogue || []) {
        const text = String(line.line || "");
        const wordCount = words(text).length;
        const minWords = minDialogueWordsForSlot(seconds);
        const estimatedSeconds = wordCount / 2.3 + 0.5;
        const flags = dialogueSmells.filter(([pattern]) => pattern.test(text)).map(([, reason]) => reason);
        if (wordCount > 0 && wordCount < minWords) flags.push(`too short for ${seconds.toFixed(1)}s slot`);
        if (estimatedSeconds > seconds + 0.5) flags.push(`may not fit ${seconds.toFixed(1)}s slot`);
        lines.push({
          sequence: seq.n,
          shot: shot.n,
          speaker: String(line.speaker || ""),
          line: text,
          delivery: line.delivery,
          seconds,
          wordCount,
          minWords,
          estimatedSeconds: Number(estimatedSeconds.toFixed(1)),
          flags,
        });
      }
    }
  }

  const totalWords = lines.reduce((sum, line) => sum + line.wordCount, 0);
  const flagged = lines.filter((line) => line.flags.length > 0);
  return {
    lineCount: lines.length,
    totalWords,
    avgWords: lines.length ? Number((totalWords / lines.length).toFixed(1)) : 0,
    flaggedCount: flagged.length,
    score: lines.length ? Math.max(0, Math.round(100 - (flagged.length / lines.length) * 45)) : 100,
    lines,
  };
}

function summarizeFrames(scenes: any): FrameHealth {
  const sequences = Array.isArray(scenes?.sequences) ? scenes.sequences : [];
  const missingStartFrames = sequences.filter((seq: any) => !seq.startFrame?.prompt).map((seq: any) => seq.n);
  const missingRefs = sequences.filter((seq: any) => seq.characters?.length && !seq.startFrame?.refs?.length).map((seq: any) => seq.n);
  const totalRefs = sequences.reduce((sum: number, seq: any) => sum + (Array.isArray(seq.startFrame?.refs) ? seq.startFrame.refs.length : 0), 0);
  return {
    sequenceCount: sequences.length,
    startFrameCount: sequences.filter((seq: any) => seq.startFrame?.prompt).length,
    endFrameCount: sequences.filter((seq: any) => seq.endFrame?.prompt).length,
    totalRefs,
    missingStartFrames,
    missingRefs,
  };
}

function runUpdatedAt(runDir: string): string {
  const files = fs.existsSync(runDir) ? fs.readdirSync(runDir) : [];
  const times = files.map((file) => fs.statSync(path.join(runDir, file)).mtimeMs);
  return new Date(times.length ? Math.max(...times) : fs.statSync(runDir).mtimeMs).toISOString();
}

export function listRuns(activeJobsByBlueprint = new Map<string, string[]>()): RunSummary[] {
  if (!fs.existsSync(OUT_DIR)) return [];
  return fs.readdirSync(OUT_DIR)
    .filter((entry) => {
      const abs = path.join(OUT_DIR, entry);
      return fs.statSync(abs).isDirectory();
    })
    .sort()
    .map((id) => {
      const runDir = path.join(OUT_DIR, id);
      const files = fs.readdirSync(runDir).sort();
      const passFiles = PASS_FILES.filter((file) => files.includes(file));
      const videos = files.filter((file) => VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()));
      const hasScenes = files.includes("scenes.json");
      const activeJobs = activeJobsByBlueprint.get(id) || [];
      let scenes: any | undefined;
      try {
        if (hasScenes) scenes = JSON.parse(fs.readFileSync(path.join(runDir, "scenes.json"), "utf8"));
      } catch {
        scenes = undefined;
      }
      const status: RunSummary["status"] = activeJobs.length ? "running" : hasScenes ? "ready" : passFiles.length ? "partial" : "empty";
      return {
        id,
        title: scenes?.title || blueprintById(id)?.title || id,
        updatedAt: runUpdatedAt(runDir),
        passFiles,
        passCount: passFiles.length,
        hasScenes,
        videos,
        activeJobs,
        status,
      };
    })
    .reverse();
}

export function getRunDetail(id: string, activeJobsByBlueprint = new Map<string, string[]>()): RunDetail {
  const safeId = path.basename(id);
  if (safeId !== id) throw new Error("Bad run id");
  const runDir = safeResolve(OUT_DIR, safeId);
  if (!fs.existsSync(runDir) || !fs.statSync(runDir).isDirectory()) throw new Error("Run not found");

  const files = fs.readdirSync(runDir).sort();
  const passFiles = PASS_FILES.filter((file) => files.includes(file));
  const videos = files.filter((file) => VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()));
  let scenes: any | undefined;
  if (files.includes("scenes.json")) scenes = JSON.parse(fs.readFileSync(path.join(runDir, "scenes.json"), "utf8"));

  const summary = listRuns(activeJobsByBlueprint).find((run) => run.id === id) || {
    id,
    title: scenes?.title || id,
    updatedAt: runUpdatedAt(runDir),
    passFiles,
    passCount: passFiles.length,
    hasScenes: Boolean(scenes),
    videos,
    activeJobs: activeJobsByBlueprint.get(id) || [],
    status: scenes ? "ready" : passFiles.length ? "partial" : "empty",
  } satisfies RunSummary;

  return {
    ...summary,
    allFiles: files,
    scenesSummary: scenes ? {
      totalSeconds: scenes.totalSeconds,
      sequenceCount: scenes.sequences?.length || 0,
      shotCount: scenes.shots?.length || scenes.sequences?.reduce((sum: number, seq: any) => sum + (seq.shots?.length || 0), 0) || 0,
      endCard: scenes.endCard,
      look: scenes.look || "",
      firstSequences: (scenes.sequences || []).slice(0, 12).map((seq: any) => ({
        n: seq.n,
        label: seq.label,
        durationSec: seq.durationSec,
        location: seq.location,
        characters: seq.characters || [],
        hasStartFrame: Boolean(seq.startFrame?.prompt),
        startRefs: seq.startFrame?.refs || [],
        hasEndFrame: Boolean(seq.endFrame?.prompt),
      })),
    } : null,
    dialogueHealth: scenes ? analyzeDialogue(scenes) : null,
    frameHealth: scenes ? summarizeFrames(scenes) : null,
  };
}

export function readRunFile(id: string, file: string): string {
  if (!file || path.basename(file) !== file || !/\.(md|json)$/.test(file)) throw new Error("Bad file name");
  const filePath = safeResolve(safeResolve(OUT_DIR, id), file);
  return fs.readFileSync(filePath, "utf8");
}

export function getRunMediaPath(id: string, file: string): string {
  if (path.basename(file) !== file || !VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase())) throw new Error("Bad media file");
  return safeResolve(safeResolve(OUT_DIR, id), file);
}

export function getWhitelistedAssetPath(parts: string[]): string {
  const rel = parts.join("/");
  if (!rel.startsWith("trailer/assets/reference/") && !rel.startsWith("src/assets/brand/")) {
    throw new Error("Asset path not allowed");
  }
  return safeResolve(REPO_ROOT, rel);
}
