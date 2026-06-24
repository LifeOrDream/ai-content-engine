/**
 * CHAPTER ARCHIVE + VERSIONING — the replay corpus for Hashiden chapter videos.
 *
 * Every chapter the engine produces leaves an immutable input snapshot under
 * `source/`, and every production OR replay lands in its own version directory
 * so re-runs NEVER overwrite a prior video (the old final.mp4 stays for A/B):
 *
 *   trailer/out/chapters/<warId>/
 *     source/input.json                # the raw ChapterCycleFacts + gitSha (replay input)
 *     <version>/                       # version = "<timestamp>-<gitShortSha>"
 *       blueprint.md  scenes.json  final.mp4  run-manifest.json  replay-manifest.json
 *
 * This is the layer the CLIs (produce_chapter / replay_chapter) and the
 * `chapter.produce` job build on. It owns NO render logic — just the filesystem
 * contract for the corpus.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ChapterCycleFacts } from "../../src/content-engine/chapterWriter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "out");
const CHAPTERS = path.join(OUT, "chapters");

export type ReplayMode = "produce" | "full" | "render-only";

export interface ChapterSource {
  facts: ChapterCycleFacts;
  /** Code version that first produced this chapter (12-char git sha or "nogit"). */
  gitSha: string;
  archivedAt: string;
}

export interface ReplayManifest {
  warId: number;
  version: string;
  gitSha: string;
  mode: ReplayMode;
  /** For render-only: the version whose scenes.json was frozen and re-rendered. */
  fromVersion?: string | null;
  /** "user" (operator's own fal key) | "env" (server key) | "none" — never the key itself. */
  keySource?: string;
  costUsd?: number | null;
  /** Final video path, relative to the version dir. */
  videoPath?: string | null;
  createdAt: string;
}

/** 12-char git sha of the working tree, or "nogit" when unavailable. */
export function gitShortSha(): string {
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim() || "nogit";
  } catch {
    return "nogit";
  }
}

export function chapterDir(warId: number): string {
  return path.join(CHAPTERS, String(warId));
}

export function sourceDir(warId: number): string {
  return path.join(chapterDir(warId), "source");
}

export function versionDir(warId: number, version: string): string {
  return path.join(chapterDir(warId), version);
}

/** Snapshot the cycle facts as the immutable replay input for this chapter. */
export function archiveChapterSource(
  warId: number,
  payload: { facts: ChapterCycleFacts; gitSha: string },
): string {
  const dir = sourceDir(warId);
  fs.mkdirSync(dir, { recursive: true });
  const source: ChapterSource = {
    facts: payload.facts,
    gitSha: payload.gitSha,
    archivedAt: new Date().toISOString(),
  };
  const file = path.join(dir, "input.json");
  fs.writeFileSync(file, JSON.stringify(source, null, 2), "utf8");
  return file;
}

/** Load the archived input for a chapter (throws if it was never produced). */
export function loadChapterSource(warId: number): ChapterSource {
  const file = path.join(sourceDir(warId), "input.json");
  if (!fs.existsSync(file)) {
    throw new Error(
      `No archived source for chapter ${warId} (${file}). Produce it once before replaying.`,
    );
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as ChapterSource;
}

/** Make a fresh, timestamped version directory for a production or replay. */
export function newVersionDir(warId: number, gitSha: string): { version: string; dir: string } {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const version = `${ts}-${gitSha}`;
  const dir = versionDir(warId, version);
  fs.mkdirSync(dir, { recursive: true });
  return { version, dir };
}

export function writeReplayManifest(dir: string, manifest: ReplayManifest): void {
  fs.writeFileSync(path.join(dir, "replay-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
}

export function readReplayManifest(dir: string): ReplayManifest | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, "replay-manifest.json"), "utf8")) as ReplayManifest;
  } catch {
    return null;
  }
}

/** All archived chapter warIds, ascending. */
export function listChapters(): number[] {
  if (!fs.existsSync(CHAPTERS)) return [];
  return fs
    .readdirSync(CHAPTERS)
    .filter((d) => /^\d+$/.test(d) && fs.statSync(path.join(CHAPTERS, d)).isDirectory())
    .map((d) => Number(d))
    .sort((a, b) => a - b);
}

export interface ChapterVersionInfo {
  version: string;
  dir: string;
  manifest: ReplayManifest | null;
  hasVideo: boolean;
  hasScenes: boolean;
}

/** Versions of a chapter, oldest→newest (version names are timestamp-prefixed). */
export function listChapterVersions(warId: number): ChapterVersionInfo[] {
  const root = chapterDir(warId);
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter((d) => d !== "source" && fs.statSync(path.join(root, d)).isDirectory())
    .sort()
    .map((version) => {
      const dir = versionDir(warId, version);
      return {
        version,
        dir,
        manifest: readReplayManifest(dir),
        hasVideo:
          fs.existsSync(path.join(dir, "final.mp4")) ||
          fs.existsSync(path.join(dir, "final_captioned.mp4")),
        hasScenes: fs.existsSync(path.join(dir, "scenes.json")),
      };
    });
}

/** The most recent version name for a chapter, or null. */
export function latestVersion(warId: number): string | null {
  const versions = listChapterVersions(warId);
  return versions.length ? versions[versions.length - 1].version : null;
}

/** Best-effort compute estimate from a version's run manifest. */
export function readRunCostUsd(dir: string): number | null {
  try {
    const m = JSON.parse(fs.readFileSync(path.join(dir, "run-manifest.json"), "utf8"));
    const usd = m?.costEstimate?.estimatedUsd;
    return typeof usd === "number" ? usd : null;
  } catch {
    return null;
  }
}
