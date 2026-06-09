import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRAILER_ROOT = path.resolve(__dirname, "..");
const REFERENCE_ROOT = path.join(TRAILER_ROOT, "reference");
const MANIFEST_PATH = path.join(REFERENCE_ROOT, "country_boards_manifest.json");
const USA_PACK_PATH = path.join(REFERENCE_ROOT, "usa", "usa_reference_pack.json");

export type CountryBoardKind =
  | "characterBoard"
  | "environmentBoard"
  | "landscapeLuxuryEnvironmentBoard";

export interface CountryBoardEntry {
  country: string;
  factionId: number;
  breedCanon: string[];
  characterBoard: string;
  environmentBoard: string;
  landscapeLuxuryEnvironmentBoard: string;
}

export interface CountryBoardsManifest {
  version: number;
  purpose: string;
  styleDirection: string;
  countries: CountryBoardEntry[];
}

export interface ResolvedReferenceAsset {
  ref: string;
  kind: CountryBoardKind | "asset";
  country?: string;
  label: string;
  absolutePath: string;
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

function countryKey(input: string): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeBoardKind(input: string): CountryBoardKind | null {
  const key = countryKey(input);
  if (["character", "characters", "character_board", "characterboard"].includes(key)) return "characterBoard";
  if (["environment", "env", "environment_board", "environmentboard"].includes(key)) return "environmentBoard";
  if ([
    "landscape",
    "luxury",
    "landscape_luxury",
    "landscape_luxury_environment",
    "landscape_luxury_environment_board",
    "landscapeluxuryenvironmentboard",
  ].includes(key)) return "landscapeLuxuryEnvironmentBoard";
  return null;
}

export function loadCountryBoardsManifest(): CountryBoardsManifest {
  const manifest = readJson<CountryBoardsManifest>(MANIFEST_PATH);
  if (!manifest?.countries?.length) {
    throw new Error(`country boards manifest missing or empty: ${MANIFEST_PATH}`);
  }
  return manifest;
}

export function listCountryBoardEntries(): CountryBoardEntry[] {
  return loadCountryBoardsManifest().countries;
}

export function resolveCountryBoardRef(ref: string): ResolvedReferenceAsset | null {
  const m = /^country:([a-z0-9 _-]+):([a-zA-Z0-9_-]+)$/i.exec(String(ref || "").trim());
  if (!m) return null;
  const kind = normalizeBoardKind(m[2]);
  if (!kind) return null;
  const wanted = countryKey(m[1]);
  const entry = listCountryBoardEntries().find((c) => countryKey(c.country) === wanted);
  if (!entry) return null;
  const rel = entry[kind];
  const absolutePath = path.join(REFERENCE_ROOT, rel);
  return {
    ref,
    kind,
    country: entry.country,
    label: `${entry.country} ${kind}`,
    absolutePath,
  };
}

export function resolveLooseAssetRef(ref: string): ResolvedReferenceAsset | null {
  const raw = String(ref || "").trim();
  const m = /^asset:(.+)$/i.exec(raw);
  if (!m) return null;
  const rel = m[1].replace(/^\/+/, "");
  const absolutePath = path.resolve(REFERENCE_ROOT, rel);
  if (!absolutePath.startsWith(REFERENCE_ROOT + path.sep)) return null;
  return {
    ref,
    kind: "asset",
    label: rel,
    absolutePath,
  };
}

export function resolveReferenceAsset(ref: string): ResolvedReferenceAsset | null {
  return resolveCountryBoardRef(ref) || resolveLooseAssetRef(ref);
}

export function isReferenceAssetRef(ref: string): boolean {
  const resolved = resolveReferenceAsset(ref);
  return !!resolved && fs.existsSync(resolved.absolutePath);
}

export function loadReferenceAssetBuffers(ref: string): Buffer[] {
  const resolved = resolveReferenceAsset(ref);
  if (!resolved) return [];
  if (!fs.existsSync(resolved.absolutePath)) {
    throw new Error(`reference asset ${ref} points to missing file: ${resolved.absolutePath}`);
  }
  return [fs.readFileSync(resolved.absolutePath)];
}

export function buildReferenceAssetPromptBlock(): string {
  let manifest: CountryBoardsManifest;
  try {
    manifest = loadCountryBoardsManifest();
  } catch {
    return "";
  }
  const lines = manifest.countries.map((entry) => {
    const country = countryKey(entry.country);
    return [
      `- ${entry.country}: breeds ${entry.breedCanon.join(", ")}.`,
      `  refs: country:${country}:characterBoard, country:${country}:environmentBoard, country:${country}:landscapeLuxuryEnvironmentBoard`,
    ].join("\n");
  });
  const usa = readJson<any>(USA_PACK_PATH);
  const usaSpecific = usa?.characters?.length
    ? [
        "",
        "USA detailed refs are also available as asset:<path> for specific characters/environments:",
        ...usa.characters.map((c: any) => `- asset:usa/${c.path} (${c.breed}, ${c.role})`),
        ...usa.environments.map((e: any) => `- asset:usa/${e.path} (${e.use})`),
      ].join("\n")
    : "";

  return [
    "COUNTRY REFERENCE ASSET REGISTRY:",
    "Frame refs can include country board refs in addition to @cast/state refs and env:seqN.startFrame chains.",
    "Use these refs when a sequence needs country-specific character silhouettes, set design, luxury landscape energy, or a faction lineup.",
    "Do not overuse them: 1-2 country refs per frame is usually enough, because the image model has an 8-ref practical cap.",
    ...lines,
    usaSpecific,
  ].filter(Boolean).join("\n");
}

export function suggestCountryBoardRefs(text: string): string[] {
  const haystack = ` ${countryKey(text).replace(/_/g, " ")} `;
  const refs: string[] = [];
  for (const entry of listCountryBoardEntries()) {
    const key = countryKey(entry.country);
    const tokens = key.split("_").filter(Boolean);
    const match = tokens.length > 1 ? tokens.every((t) => haystack.includes(` ${t} `)) : haystack.includes(` ${key} `);
    if (match) {
      refs.push(`country:${key}:characterBoard`, `country:${key}:environmentBoard`);
    }
  }
  return refs;
}

