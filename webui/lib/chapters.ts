import "server-only";
import fs from "node:fs";
import path from "node:path";
import { OUT_DIR, safeResolve } from "./contentEngine";

/**
 * Read-only views over the chapter→video corpus written by the engine at
 * trailer/out/chapters/<warId>/{source,<version>}/. Paths are derived from the
 * webui's already-resolved OUT_DIR (not the engine module's __dirname) so this
 * is safe under Next's bundler.
 */
export const CHAPTERS_DIR = path.join(OUT_DIR, "chapters");

const VERSION_RE = /^[0-9A-Za-z._-]{1,80}$/;
const ARTIFACT_EXT = new Set([
  ".mp4", ".mov", ".webm", ".json", ".md", ".srt", ".vtt", ".ass", ".txt", ".png", ".jpg", ".jpeg", ".webp",
]);

export interface ChapterVersionView {
  version: string;
  title: string | null;
  mode: string;
  gitSha: string | null;
  keySource: string | null;
  costUsd: number | null;
  createdAt: string | null;
  fromVersion: string | null;
  hasVideo: boolean;
  videoFile: string | null;
  hasScenes: boolean;
}

export interface ChapterSummary {
  warId: number;
  versionCount: number;
  latestVersion: string | null;
  latestVideoFile: string | null;
  updatedAt: string;
}

export interface ChapterDetail {
  warId: number;
  hasSource: boolean;
  source: { gitSha: string | null; archivedAt: string | null; winnerFactionId: number | null } | null;
  versions: ChapterVersionView[];
}

function safeWarId(warId: number | string): number {
  const n = Number(warId);
  if (!Number.isInteger(n) || n < 0) throw new Error("Bad warId");
  return n;
}

function chapterDir(warId: number): string {
  return path.join(CHAPTERS_DIR, String(warId));
}

function safeStatDir(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

/** Prefer the captioned master, then the clean master, then the silent export. */
function pickVideo(dir: string): string | null {
  for (const f of ["final_captioned.mp4", "final.mp4", "final_silent.mp4"]) {
    if (fs.existsSync(path.join(dir, f))) return f;
  }
  return null;
}

function versionView(warId: number, version: string): ChapterVersionView {
  const dir = path.join(chapterDir(warId), version);
  const manifest = readJson<any>(path.join(dir, "replay-manifest.json"));
  const runManifest = readJson<any>(path.join(dir, "run-manifest.json"));
  const videoFile = pickVideo(dir);
  const cost =
    typeof manifest?.costUsd === "number"
      ? manifest.costUsd
      : typeof runManifest?.costEstimate?.estimatedUsd === "number"
        ? runManifest.costEstimate.estimatedUsd
        : null;
  return {
    version,
    title: runManifest?.title ?? null,
    mode: manifest?.mode ?? "produce",
    gitSha: manifest?.gitSha ?? runManifest?.gitCommit ?? null,
    keySource: manifest?.keySource ?? null,
    costUsd: cost,
    createdAt: manifest?.createdAt ?? null,
    fromVersion: manifest?.fromVersion ?? null,
    hasVideo: Boolean(videoFile),
    videoFile,
    hasScenes: fs.existsSync(path.join(dir, "scenes.json")),
  };
}

/** Versions of a chapter, oldest→newest (version names are timestamp-prefixed). */
export function listChapterVersionViews(warId: number): ChapterVersionView[] {
  const root = chapterDir(warId);
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter((d) => d !== "source" && VERSION_RE.test(d) && safeStatDir(path.join(root, d)))
    .sort()
    .map((v) => versionView(warId, v));
}

export function listChapterSummaries(): ChapterSummary[] {
  if (!fs.existsSync(CHAPTERS_DIR)) return [];
  return fs
    .readdirSync(CHAPTERS_DIR)
    .filter((d) => /^\d+$/.test(d) && safeStatDir(path.join(CHAPTERS_DIR, d)))
    .map((d) => Number(d))
    .sort((a, b) => b - a)
    .map((warId) => {
      const versions = listChapterVersionViews(warId);
      const latest = versions[versions.length - 1] || null;
      let updatedAt = new Date(0).toISOString();
      try {
        updatedAt = fs.statSync(chapterDir(warId)).mtime.toISOString();
      } catch {
        /* keep epoch */
      }
      return {
        warId,
        versionCount: versions.length,
        latestVersion: latest?.version ?? null,
        latestVideoFile: latest?.videoFile ?? null,
        updatedAt,
      };
    });
}

export function getChapterDetail(warId: number | string): ChapterDetail {
  const id = safeWarId(warId);
  const root = chapterDir(id);
  const sourceJson = readJson<any>(path.join(root, "source", "input.json"));
  return {
    warId: id,
    hasSource: Boolean(sourceJson),
    source: sourceJson
      ? {
          gitSha: sourceJson.gitSha ?? null,
          archivedAt: sourceJson.archivedAt ?? null,
          winnerFactionId:
            typeof sourceJson?.facts?.winnerFactionId === "number" ? sourceJson.facts.winnerFactionId : null,
        }
      : null,
    versions: listChapterVersionViews(id),
  };
}

/** Path-safe resolver for a file inside a specific chapter version directory. */
export function getChapterArtifactPath(warId: number | string, version: string, parts: string[]): string {
  const id = safeWarId(warId);
  if (!VERSION_RE.test(version)) throw new Error("Bad version id");
  const rel = parts.map((p) => decodeURIComponent(p)).join("/");
  if (!rel || rel.includes("..")) throw new Error("Bad artifact path");
  if (!ARTIFACT_EXT.has(path.extname(rel).toLowerCase())) throw new Error("Artifact type not allowed");
  const versionRoot = safeResolve(chapterDir(id), version);
  return safeResolve(versionRoot, rel);
}
