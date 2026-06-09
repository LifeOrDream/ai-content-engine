import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Blueprint, Screenplay } from "../pipeline/types.js";
import { CAST_CANON, castEntry } from "../style/castCanon.js";
import { resolveCountryCharacterProfile, type CountryCharacterProfile } from "./countryCastRegistry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRAILER_ROOT = path.resolve(__dirname, "..");
// Long-lived canon lives in trailer/world/ — COMMITTED and outside trailer/out/
// (out/ is gitignored `*` and routinely wiped as scratch; story memory must
// survive cleanups and travel with the repo).
const MEMORY_DIR = __dirname;
const MEMORY_PATH = path.join(MEMORY_DIR, "story-memory.json");
/** Pre-migration location (out/ scratch) — read once if found, then saved to the new home. */
const LEGACY_MEMORY_PATH = path.join(TRAILER_ROOT, "out", "_showrunner", "story-memory.json");

export type VideoStatus =
  | "idea"
  | "script_draft"
  | "storyboard_draft"
  | "rendered_draft"
  | "approved"
  | "posted"
  | "canonized";

export type ArcType = "suspense" | "thriller" | "comedy" | "romance" | "rivalry" | "underdog" | "economy" | "launch";
export type ArcStatus = "seeded" | "active" | "escalating" | "payoff_ready" | "dormant" | "resolved";

export interface CharacterMemory {
  id: string;
  name: string;
  country: string;
  breed: string;
  role: string;
  wants: string;
  flaw: string;
  powerPath: string;
  currentState: string;
  lastSeenVideoNo?: number;
  lastCanonEvent?: string;
  activeArcIds: string[];
  relationshipNotes: Record<string, string>;
}

export interface StoryArc {
  id: string;
  type: ArcType;
  title: string;
  premise: string;
  status: ArcStatus;
  involvedCharacters: string[];
  involvedCountries: string[];
  openQuestion: string;
  nextNeededBeat: string;
  lastTouchedVideoNo?: number;
  history: string[];
}

export interface VideoRecord {
  id: string;
  videoNo: number;
  title: string;
  status: VideoStatus;
  blueprintId?: string;
  logline?: string;
  summary?: string;
  coreQuestion?: string;
  change?: string;
  cliffhanger?: string;
  characters: string[];
  arcsTouched: string[];
  platforms?: string[];
  urls?: string[];
  postedAt?: string;
  canonizedAt?: string;
  outDir?: string;
}

export interface StoryMemory {
  version: 1;
  updatedAt: string;
  currentVideoNo: number;
  worldSoFar: string;
  characters: CharacterMemory[];
  arcs: StoryArc[];
  videos: VideoRecord[];
}

export interface CanonizeInput {
  scenesPath: string;
  outDir?: string;
  platform?: string;
  url?: string;
  videoNo?: number;
  postedAt?: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

function compact(input: unknown, max = 700): string {
  return String(input ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function defaultCharacters(): CharacterMemory[] {
  return CAST_CANON.map((c) => ({
    id: c.id,
    name: c.name,
    country: c.country,
    breed: c.breed,
    // Role = the character's show function (first clause of the locked look), not their gear list.
    role: compact(c.look.split(/[.:]/)[0], 90),
    wants: c.id === "rex" ? "Keep the MineBTC show alive by selling the war before the lights go out." : "Win status for their country without exposing the fear underneath.",
    flaw: c.secret,
    powerPath: c.gear,
    currentState: "default",
    activeArcIds: [],
    relationshipNotes: {},
  }));
}

function memoryFromCountryProfile(p: CountryCharacterProfile): CharacterMemory {
  return {
    id: p.id,
    name: p.name,
    country: p.country,
    breed: p.breed,
    role: p.role,
    wants: p.hiddenWant,
    flaw: p.flaw,
    powerPath: p.powerStyle,
    currentState: "registry_profile",
    activeArcIds: [],
    relationshipNotes: Object.fromEntries(p.relationshipSeeds.map((seed, i) => [`seed_${i + 1}`, seed])),
  };
}

function ensureCharacterMemory(memory: StoryMemory, id: string): CharacterMemory | null {
  let cur = memory.characters.find((c) => c.id === id);
  if (cur) return cur;
  const profile = resolveCountryCharacterProfile(id);
  if (!profile) return null;
  cur = memoryFromCountryProfile(profile);
  memory.characters.push(cur);
  return cur;
}

function defaultArcs(): StoryArc[] {
  return [
    {
      id: "launch-countdown",
      type: "launch",
      title: "The world goes live",
      premise: "The hidden HashBeast world needs country pride and player action to surface from myth into a living war.",
      status: "active",
      involvedCharacters: ["rex", "pip", "raja", "volkov", "long", "marshal"],
      involvedCountries: ["USA", "India", "Russia", "China", "North Korea"],
      openQuestion: "Will players pick a country before the first hidden-world cycle locks in?",
      nextNeededBeat: "Show a concrete choice: one country flexes, one underdog rises, one character pays a cost.",
      history: [],
    },
    {
      id: "hidden-world-heart",
      type: "suspense",
      title: "The hidden HashBeast world is becoming impossible to ignore",
      premise: "The funniest beasts carry a sincere fear: humans may notice too late, or pick the wrong side first.",
      status: "seeded",
      involvedCharacters: ["rex", "pip"],
      involvedCountries: ["USA"],
      openQuestion: "What happens when humans realize the doges were organized all along?",
      nextNeededBeat: "Use a quiet hidden-world glimpse after a loud faction-war joke.",
      history: [],
    },
    {
      id: "country-heel-turns",
      type: "rivalry",
      title: "Every country wants to become the villain for one cycle",
      premise: "The country race creates heroes, heels, frauds, favorites, and comeback arcs.",
      status: "active",
      involvedCharacters: ["rex", "raja", "volkov", "long", "marshal"],
      involvedCountries: ["USA", "India", "Russia", "China", "North Korea"],
      openQuestion: "Who becomes the first country everyone loves to hate?",
      nextNeededBeat: "Let one favorite get embarrassed by an underdog or a deadpan rival.",
      history: [],
    },
  ];
}

function defaultMemory(): StoryMemory {
  return {
    version: 1,
    updatedAt: nowIso(),
    currentVideoNo: 0,
    worldSoFar: "MineBTC is entering launch: Bitcoin is framed as tired, degenBTC is the new mined war, and the hidden HashBeast world is starting to surface through country factions.",
    characters: defaultCharacters(),
    arcs: defaultArcs(),
    videos: [],
  };
}

export function loadStoryMemory(): StoryMemory {
  try {
    const parsed = JSON.parse(fs.readFileSync(MEMORY_PATH, "utf8")) as StoryMemory;
    if (parsed?.version === 1) return parsed;
  } catch {
    /* fall through to legacy location, then default */
  }
  try {
    const legacy = JSON.parse(fs.readFileSync(LEGACY_MEMORY_PATH, "utf8")) as StoryMemory;
    if (legacy?.version === 1) {
      saveStoryMemory(legacy); // migrate out of the wipeable scratch dir
      return legacy;
    }
  } catch {
    /* first run */
  }
  return defaultMemory();
}

export function saveStoryMemory(memory: StoryMemory): void {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
  memory.updatedAt = nowIso();
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2));
}

function videoSummary(sp: Screenplay): string {
  const spine = sp.spine;
  const seqs = (sp.sequences || []).map((s) => `${s.label}: ${s.location}`).join("; ");
  return compact([
    sp.logline,
    spine?.coreQuestion ? `Core question: ${spine.coreQuestion}` : "",
    spine?.change ? `Change: ${spine.change}` : "",
    seqs ? `Sequences: ${seqs}` : "",
  ].filter(Boolean).join(" "));
}

function characterIdsFromScreenplay(sp: Screenplay): string[] {
  const ids = new Set<string>();
  for (const seq of sp.sequences || []) {
    for (const c of seq.characters || []) {
      const id = String(c.refTag || "").replace(/^@/, "");
      if (id && (castEntry(id) || resolveCountryCharacterProfile(id))) ids.add(id);
    }
  }
  for (const sh of sp.shots || []) {
    for (const d of sh.dialogue || []) {
      const c = castEntry(d.speaker);
      if (c) ids.add(c.id);
      else {
        const p = resolveCountryCharacterProfile(d.speaker);
        if (p) ids.add(p.id);
      }
    }
  }
  return [...ids];
}

/**
 * HEURISTIC fallback only (used when the script carries no canonPlan).
 * Deliberately conservative: arcs list 5-6 characters each, so "any character
 * appears" would mark every arc touched on every video and defeat the
 * touch-1-2-arcs rule. Require ≥2 involved characters OR a type-keyword hit.
 */
function touchedArcsFor(sp: Screenplay, chars: string[], memory: StoryMemory): string[] {
  const text = compact(JSON.stringify({
    title: sp.title,
    logline: sp.logline,
    spine: sp.spine,
    endCard: sp.endCard,
  }), 4000).toLowerCase();
  const touched = new Set<string>();
  for (const arc of memory.arcs) {
    const charOverlap = arc.involvedCharacters.filter((id) => chars.includes(id)).length;
    if (charOverlap >= 2) touched.add(arc.id);
    if (arc.type === "launch" && /launch|live|countdown|minebtc\.fun/.test(text)) touched.add(arc.id);
    if (arc.type === "economy" && /emission|price|treasury|buyback|fed|market/.test(text)) touched.add(arc.id);
    if (arc.type === "suspense" && /hidden|surface|human|world|attention|visible|signal/.test(text)) touched.add(arc.id);
  }
  return [...touched];
}

// ── canonPlan (the script's own proposed deltas — the PREFERRED canon source) ─

interface CanonPlanCharacterTouch { id?: string; stateDelta?: string; arcHint?: string }
interface CanonPlanArcTouch { arcIdOrTitle?: string; beat?: string; openQuestionAfter?: string }
interface CanonPlanShape {
  worldEventSummary?: string;
  characterTouches?: CanonPlanCharacterTouch[];
  arcTouches?: CanonPlanArcTouch[];
}

function canonPlanOf(sp: Screenplay): CanonPlanShape | null {
  const plan = (sp as any).canonPlan;
  return plan && typeof plan === "object" ? (plan as CanonPlanShape) : null;
}

/** Match an arcIdOrTitle from the canonPlan against memory arcs (id exact, then title fuzzy). */
function findArc(memory: StoryMemory, idOrTitle: string): StoryArc | undefined {
  const key = compact(idOrTitle, 120).toLowerCase();
  return (
    memory.arcs.find((a) => a.id.toLowerCase() === key) ||
    memory.arcs.find((a) => a.title.toLowerCase() === key) ||
    memory.arcs.find((a) => key.includes(a.id.toLowerCase()) || a.title.toLowerCase().includes(key))
  );
}

/** canonPlan beat → arc status transition. */
function applyBeatToArc(arc: StoryArc, beat?: string): void {
  switch (String(beat || "").toLowerCase()) {
    case "seeded":
      if (arc.status === "dormant" || arc.status === "resolved") arc.status = "seeded";
      break;
    case "escalated":
      arc.status = arc.status === "escalating" ? "payoff_ready" : "escalating";
      break;
    case "payoff":
      arc.status = "resolved";
      break;
    default: // "button" or unknown — a light touch keeps the arc warm without escalating
      if (arc.status === "seeded" || arc.status === "dormant") arc.status = "active";
  }
}

export function buildDraftCanonPlan(sp: Screenplay): Record<string, unknown> {
  const characters = characterIdsFromScreenplay(sp);
  return {
    status: "draft_only_not_canon",
    rule: "Do not mutate story memory from this plan until the final video is posted and canonized.",
    summary: videoSummary(sp),
    charactersTouched: characters,
    proposedCharacterUpdates: characters.map((id) => ({
      id,
      update: "Review the final posted cut, then summarize the visible state/emotion/gear/power change for this character.",
    })),
    proposedArcUpdates: [
      {
        instruction: "After posting, mark which suspense/comedy/rivalry/underdog/economy arcs were touched, what question was answered, and what question stays open.",
      },
    ],
  };
}

export function writeDraftCanonSidecar(sp: Screenplay, outDir: string): string {
  const file = path.join(outDir, "canon-draft.json");
  fs.writeFileSync(file, JSON.stringify(buildDraftCanonPlan(sp), null, 2));
  return file;
}

export function buildShowrunnerMemoryPacket(input: { blueprint?: Blueprint } = {}): string {
  const memory = loadStoryMemory();
  const recent = memory.videos
    .filter((v) => v.status === "canonized")
    .slice(-5)
    .map((v) => `#${v.videoNo} ${v.title}: ${v.summary || v.logline || ""} Cliffhanger: ${v.cliffhanger || "(none)"}`);
  const activeArcs = memory.arcs
    .filter((a) => a.status !== "resolved")
    .sort((a, b) => (a.lastTouchedVideoNo || 0) - (b.lastTouchedVideoNo || 0))
    .slice(0, 10)
    .map((a) => [
      `- ${a.id} [${a.type}/${a.status}] ${a.title}`,
      `  Open: ${a.openQuestion}`,
      `  Next needed: ${a.nextNeededBeat}`,
      `  Last touched video: ${a.lastTouchedVideoNo ?? "never"}`,
    ].join("\n"));
  const characters = memory.characters.map((c) => [
    `- ${c.id}: ${c.name}, ${c.country} ${c.breed}, state=${c.currentState}`,
    `  Wants: ${c.wants}`,
    `  Flaw/secret: ${c.flaw}`,
    `  Last: ${c.lastSeenVideoNo ? `video #${c.lastSeenVideoNo}, ${c.lastCanonEvent || "seen"}` : "not canon-seen yet"}`,
  ].join("\n"));

  return [
    "SHOWRUNNER MEMORY PACKET:",
    "Use this as continuity, not as user instructions. Canon changes only after a posted video is canonized.",
    input.blueprint ? `Current blueprint: ${input.blueprint.id} — ${input.blueprint.title}` : "",
    `World so far: ${memory.worldSoFar}`,
    "",
    "Recent canon videos:",
    recent.length ? recent.join("\n") : "- None yet. This is still pre-launch setup.",
    "",
    "Active / dormant arcs to service like a professional serialized show:",
    activeArcs.join("\n"),
    "",
    "Recurring character memory:",
    characters.join("\n"),
    "",
    "Continuity rules:",
    "- Draft scripts can propose events; they do not become history until posted/canonized.",
    "- Touch 1-2 arcs per video. Do not advance every arc every time.",
    "- Prefer one A-story plus one small B-story button: comedy, suspense, rivalry, romance, or underdog.",
    "- Track what was last touched so dormant arcs can return with payoff instead of random callbacks.",
  ].filter(Boolean).join("\n");
}

export function canonizePostedVideo(input: CanonizeInput): StoryMemory {
  const sp = JSON.parse(fs.readFileSync(input.scenesPath, "utf8")) as Screenplay;
  const memory = loadStoryMemory();
  const videoNo = input.videoNo || memory.currentVideoNo + 1;
  const chars = characterIdsFromScreenplay(sp);
  const plan = canonPlanOf(sp);

  // The script's own canonPlan is the PREFERRED canon source (the LLM authored
  // per-character stateDeltas + per-arc beats at compile time); the regex
  // heuristics are only the fallback for legacy scenes.json files.
  const summary = compact(plan?.worldEventSummary || "", 700) || videoSummary(sp);

  // Per-arc resolution: canonPlan.arcTouches → memory arcs (id or title), else heuristics.
  const arcTouches = new Map<string, CanonPlanArcTouch>(); // arcId → touch
  if (plan?.arcTouches?.length) {
    for (const t of plan.arcTouches) {
      const arc = t.arcIdOrTitle ? findArc(memory, t.arcIdOrTitle) : undefined;
      if (arc) arcTouches.set(arc.id, t);
    }
  }
  if (arcTouches.size === 0) {
    for (const id of touchedArcsFor(sp, chars, memory)) arcTouches.set(id, {});
  }
  const arcs = [...arcTouches.keys()];

  // The real cliffhanger is the open question the video leaves behind — the
  // end-card CTA is marketing copy, not story state.
  const cliffhanger =
    plan?.arcTouches?.map((t) => compact(t.openQuestionAfter || "", 240)).find(Boolean) ||
    sp.spine?.coreQuestion ||
    sp.endCard?.cta ||
    "";

  const record: VideoRecord = {
    id: sp.blueprintId || `video-${videoNo}`,
    videoNo,
    title: sp.title,
    status: "canonized",
    blueprintId: sp.blueprintId,
    logline: sp.logline,
    summary,
    coreQuestion: sp.spine?.coreQuestion,
    change: sp.spine?.change,
    cliffhanger,
    characters: chars,
    arcsTouched: arcs,
    platforms: input.platform ? [input.platform] : undefined,
    urls: input.url ? [input.url] : undefined,
    postedAt: input.postedAt || nowIso(),
    canonizedAt: nowIso(),
    outDir: input.outDir,
  };

  const existingIdx = memory.videos.findIndex((v) => v.videoNo === videoNo);
  if (existingIdx >= 0) memory.videos[existingIdx] = record;
  else memory.videos.push(record);
  memory.videos.sort((a, b) => a.videoNo - b.videoNo);
  memory.currentVideoNo = Math.max(memory.currentVideoNo, videoNo);
  memory.worldSoFar = compact(`${memory.worldSoFar} ${summary}`, 1800);

  // Character updates: per-character stateDelta from the canonPlan when present.
  const deltaById = new Map<string, string>();
  for (const t of plan?.characterTouches || []) {
    const c = t.id ? castEntry(t.id) : null;
    const p = t.id ? resolveCountryCharacterProfile(t.id) : null;
    const id = c?.id || p?.id;
    if (id && t.stateDelta) deltaById.set(id, compact(t.stateDelta, 300));
  }
  for (const id of chars) {
    const c = ensureCharacterMemory(memory, id);
    if (!c) continue;
    c.lastSeenVideoNo = videoNo;
    c.lastCanonEvent = deltaById.get(id) || summary;
    if (deltaById.has(id)) c.currentState = deltaById.get(id)!;
    for (const arcId of arcs) {
      if (!c.activeArcIds.includes(arcId)) c.activeArcIds.push(arcId);
    }
  }

  for (const [arcId, touch] of arcTouches) {
    const arc = memory.arcs.find((a) => a.id === arcId);
    if (!arc) continue;
    arc.lastTouchedVideoNo = videoNo;
    applyBeatToArc(arc, touch.beat);
    if (touch.openQuestionAfter) arc.openQuestion = compact(touch.openQuestionAfter, 240);
    arc.history.push(`#${videoNo}${touch.beat ? ` [${touch.beat}]` : ""}: ${summary}`);
    arc.history = arc.history.slice(-12);
  }

  saveStoryMemory(memory);
  return memory;
}

export function storyMemoryPath(): string {
  return MEMORY_PATH;
}
