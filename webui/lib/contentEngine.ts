import "server-only";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RunManifest } from "./types";
import { analyzeScreenplayDialogue } from "../../src/content-engine/dialogueQuality";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(process.env.CONTENT_ENGINE_ROOT || __dirname, "../..");
export const TRAILER_DIR = path.join(REPO_ROOT, "trailer");
export const BLUEPRINTS_DIR = path.join(TRAILER_DIR, "blueprints");
export const OUT_DIR = path.join(TRAILER_DIR, "out");

export const PASS_IDS = ["script", "produce"] as const;
export const PASS_FILES = PASS_IDS.map((id, index) => `${String(index + 1).padStart(2, "0")}-${id}.md`);
export const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);

export type PassId = (typeof PASS_IDS)[number];

export interface BlueprintSummary {
  id: string;
  file: string;
  title: string;
  genre: string;
  logline: string;
  targetSeconds: number;
  minSeconds: number;
  countdown: string;
  cta: string;
  cast: string[];
  updatedAt: string;
}

export interface BlueprintDocument extends BlueprintSummary {
  body: string;
  raw: string;
}

export interface BlueprintSaveInput {
  id: string;
  title: string;
  genre: string;
  logline: string;
  targetSeconds: number;
  minSeconds: number;
  countdown: string;
  cta: string;
  cast: string[];
  body: string;
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
  maxWords: number;
  estimatedSeconds: number;
  occupancyPct: number;
  flags: string[];
}

export interface DialogueHealth {
  lineCount: number;
  totalWords: number;
  avgWords: number;
  flaggedCount: number;
  score: number;
  spokenSeconds: number;
  availableSeconds: number;
  occupancyPct: number;
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
  manifest: RunManifest | null;
  scenesSummary: null | {
    totalSeconds: number;
    sequenceCount: number;
    shotCount: number;
    endCard?: unknown;
    look: string;
    genre?: string;
    aspect?: string;
    spine?: { coreQuestion?: string; change?: string; stakes?: string };
    hookCandidates?: { hook: string[]; cliffhanger: string[] };
    overlays?: Array<{ text: string; atSec: number; untilSec: number; style: string }>;
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
        genre: data.genre || "story",
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

function assertBlueprintId(id: string): string {
  const clean = String(id || "").trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{1,90}$/.test(clean)) {
    throw new Error("Blueprint id must be lowercase letters, numbers, and dashes only");
  }
  return clean;
}

function blueprintPathById(id: string): string {
  const clean = assertBlueprintId(id);
  const hit = blueprintById(clean);
  return path.join(BLUEPRINTS_DIR, hit?.file || `${clean}.md`);
}

export function getBlueprintDocument(id: string): BlueprintDocument {
  const filePath = blueprintPathById(id);
  if (!fs.existsSync(filePath)) throw new Error("Blueprint not found");
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const stat = fs.statSync(filePath);
  const fallbackId = path.basename(filePath).replace(/\.md$/, "");
  return {
    id: data.id || fallbackId,
    file: path.basename(filePath),
    title: data.title || data.id || fallbackId,
    genre: data.genre || "story",
    logline: data.logline || "",
    targetSeconds: Number(data.targetSeconds || 75),
    minSeconds: Number(data.minSeconds || 24),
    countdown: data.countdown || "24:00:00",
    cta: data.cta || "Mine your HashBeast - minebtc.fun",
    cast: (data.cast || "").split(",").map((item) => item.trim()).filter(Boolean),
    updatedAt: stat.mtime.toISOString(),
    body,
    raw,
  };
}

function yamlString(value: string): string {
  return JSON.stringify(String(value || ""));
}

function formatBlueprint(input: BlueprintSaveInput): string {
  const id = assertBlueprintId(input.id);
  const title = String(input.title || id).trim();
  const targetSeconds = Math.max(10, Math.round(Number(input.targetSeconds || 75)));
  const minSeconds = Math.max(10, Math.round(Number(input.minSeconds || 24)));
  const countdown = String(input.countdown || "24:00:00").trim();
  const cta = String(input.cta || "Mine your HashBeast - minebtc.fun").trim();
  const cast = input.cast.map((item) => item.trim()).filter(Boolean).join(",");
  const genre = String(input.genre || "story").trim().toLowerCase() || "story";
  const logline = String(input.logline || "").trim();
  const body = String(input.body || "").trim();
  return [
    "---",
    `id: ${id}`,
    `title: ${yamlString(title)}`,
    `genre: ${genre}`,
    `targetSeconds: ${targetSeconds}`,
    `minSeconds: ${minSeconds}`,
    `countdown: ${yamlString(countdown)}`,
    `cta: ${yamlString(cta)}`,
    `logline: ${yamlString(logline)}`,
    `cast: ${yamlString(cast)}`,
    "---",
    body,
    "",
  ].join("\n");
}

export function saveBlueprintDocument(input: BlueprintSaveInput, options: { create: boolean; currentId?: string }): BlueprintDocument {
  const id = assertBlueprintId(input.id);
  const currentId = options.currentId ? assertBlueprintId(options.currentId) : id;
  const targetPath = options.create ? path.join(BLUEPRINTS_DIR, `${id}.md`) : blueprintPathById(currentId);
  if (options.create && fs.existsSync(targetPath)) throw new Error(`Blueprint already exists: ${id}`);
  if (!options.create && !fs.existsSync(targetPath)) throw new Error("Blueprint not found");
  if (!options.create && currentId !== id) throw new Error("Renaming existing blueprints is not supported yet; create a new blueprint instead");
  fs.writeFileSync(targetPath, formatBlueprint({ ...input, id }), "utf8");
  return getBlueprintDocument(id);
}

function analyzeDialogue(scenes: any): DialogueHealth {
  return analyzeScreenplayDialogue(scenes);
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
  const files = fs.existsSync(runDir) ? listFilesRecursive(runDir) : [];
  const times = files.map((file) => fs.statSync(path.join(runDir, file)).mtimeMs);
  return new Date(times.length ? Math.max(...times) : fs.statSync(runDir).mtimeMs).toISOString();
}

function listFilesRecursive(dir: string, root = dir): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir).sort()) {
    if (entry === ".DS_Store") continue;
    const abs = path.join(dir, entry);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) out.push(...listFilesRecursive(abs, root));
    else out.push(path.relative(root, abs).replace(/\\/g, "/"));
  }
  return out;
}

function readRunManifest(runDir: string): RunManifest | null {
  const file = path.join(runDir, "run-manifest.json");
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as RunManifest;
  } catch {
    return null;
  }
}

export function listRuns(activeJobsByBlueprint = new Map<string, string[]>()): RunSummary[] {
  if (!fs.existsSync(OUT_DIR)) return [];
  return fs.readdirSync(OUT_DIR)
    .filter((entry) => {
      // `chapters/` is the chapter→video corpus (out/chapters/<warId>/<version>/),
      // surfaced by the dedicated Chapters UI — never list it as a blueprint run.
      if (entry.startsWith(".") || entry === "chapters") return false;
      const abs = path.join(OUT_DIR, entry);
      return fs.statSync(abs).isDirectory();
    })
    .sort()
    .map((id) => {
      const runDir = path.join(OUT_DIR, id);
      const files = fs.readdirSync(runDir).sort();
      const allFiles = listFilesRecursive(runDir);
      const passFiles = PASS_FILES.filter((file) => files.includes(file));
      const videos = allFiles.filter((file) => VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()));
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
        title: readRunManifest(runDir)?.title || scenes?.title || blueprintById(id)?.title || id,
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
  const allFiles = listFilesRecursive(runDir);
  const passFiles = PASS_FILES.filter((file) => files.includes(file));
  const videos = allFiles.filter((file) => VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const manifest = readRunManifest(runDir);
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
    allFiles,
    manifest,
    scenesSummary: scenes ? {
      totalSeconds: scenes.totalSeconds,
      sequenceCount: scenes.sequences?.length || 0,
      shotCount: scenes.shots?.length || scenes.sequences?.reduce((sum: number, seq: any) => sum + (seq.shots?.length || 0), 0) || 0,
      endCard: scenes.endCard,
      look: scenes.look || "",
      genre: scenes.genre || "story",
      aspect: scenes.aspect || "16:9",
      spine: scenes.spine || undefined,
      hookCandidates: scenes.hookCandidates || undefined,
      overlays: Array.isArray(scenes.overlays) ? scenes.overlays : [],
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
  if (!file || path.basename(file) !== file || !/\.(md|json|srt|vtt|ass|txt)$/.test(file)) throw new Error("Bad file name");
  const filePath = safeResolve(safeResolve(OUT_DIR, id), file);
  return fs.readFileSync(filePath, "utf8");
}

export function getRunMediaPath(id: string, file: string): string {
  if (path.basename(file) !== file || !VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase())) throw new Error("Bad media file");
  return safeResolve(safeResolve(OUT_DIR, id), file);
}

export function getRunArtifactPath(id: string, parts: string[]): string {
  const rel = parts.join("/");
  if (!rel || rel.includes("..")) throw new Error("Bad artifact path");
  const ext = path.extname(rel).toLowerCase();
  const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov", ".webm", ".mp3", ".wav", ".srt", ".vtt", ".ass", ".json", ".md", ".txt"]);
  if (!allowed.has(ext)) throw new Error("Artifact type not allowed");
  return safeResolve(safeResolve(OUT_DIR, id), rel);
}

export function getWhitelistedAssetPath(parts: string[]): string {
  const rel = parts.join("/");
  if (!rel.startsWith("trailer/assets/reference/") && !rel.startsWith("trailer/reference/") && !rel.startsWith("src/assets/brand/")) {
    throw new Error("Asset path not allowed");
  }
  return safeResolve(REPO_ROOT, rel);
}
