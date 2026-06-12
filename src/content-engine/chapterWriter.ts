/**
 * CHAPTER WRITER — the writers-room-lite pass for Hashiden chapters (Phase D2).
 *
 * One settled war cycle in → one chapter anatomy out:
 *
 *   COVER          title + a cover-art prompt staged on the WINNING country's
 *                  bible location card (arcade-cel rung, text-free)
 *   RECAP          3-5 beats with character callouts; beat 1 PAYS OFF the
 *                  previous chapter's cliffhanger when one exists
 *   CAST           the beasts that earned screen time (MVPs, big mutations,
 *                  fresh recruits with their intro lines), owner callsigns
 *   COMPUTE LEDGER cost passthrough (what this cycle's content spend was)
 *   CLIFFHANGER    one line, PERSISTED — the next chapter must pay it off
 *
 * Everything in this module is PURE (prompt builders, deterministic fallback,
 * lint) — the LLM call + retry + fallback orchestration lives in the service
 * processor (`chapter.write` job kind), same split as write_screenplay. The
 * caller (game backend) budget-gates dispatch exactly like other content jobs
 * and owns persistence/GraphQL.
 *
 * Canon rules: banned lexicon enforced on every text field (dialogueSmells);
 * the cover prompt forbids readable text and flag-print clothing.
 */
import { countryBible, styleRung, type LocationCard } from "../world/bible.js";
import {
  BANNED_PITCH_PHRASES,
  dialogueSmells,
} from "./dialogueQuality.js";

// ─────────────────────────────────────────────────────────────────────────────
// Contract
// ─────────────────────────────────────────────────────────────────────────────

export interface ChapterMvpFact {
  factionId: number;
  /** Owner display callsign (never a raw wallet). */
  ownerCallsign?: string;
  mint?: string;
  beastName?: string;
}

export interface ChapterMutationFact {
  mint: string;
  beastName?: string;
  factionId?: number;
  kind: "evolution" | "visual" | "power";
  newStage?: number;
  /** Named technique the power clip rendered (B4), when known. */
  techniqueName?: string;
}

export interface ChapterJackpotFact {
  roundId?: number;
  factionId?: number;
  potLamports?: string;
}

export interface ChapterMintIntroFact {
  mint: string;
  beastName?: string;
  factionId?: number;
  /** The "joined the war" line from the nft.mint_intro job. */
  introLine?: string;
}

/** The settled cycle's indexed events, assembled by the backend. */
export interface ChapterCycleFacts {
  warId: number;
  winnerFactionId: number;
  /** 1-based final ranks per faction id (index = faction id). */
  finalRanks?: number[];
  /** Signed rank swings per faction id (positive = climbed). */
  rankDeltas?: number[];
  mvps?: ChapterMvpFact[];
  biggestMutations?: ChapterMutationFact[];
  jackpots?: ChapterJackpotFact[];
  mintIntros?: ChapterMintIntroFact[];
  computeSpentUsd?: number;
  /** The PREVIOUS chapter's persisted cliffhanger — beat 1 pays it off. */
  previousCliffhanger?: string;
  /** Optional rolling series memory line. */
  storySoFar?: string;
}

export interface ChapterRecapBeat {
  beat: string;
  /** Cast/character names this beat calls out. */
  callouts: string[];
}

export interface ChapterCastMember {
  mint?: string;
  name: string;
  factionId?: number;
  ownerCallsign?: string;
  role: "mvp" | "evolved" | "mutated" | "technique_debut" | "minted" | "jackpot";
  /** The member's line in this chapter (mint intros carry their intro line). */
  line?: string;
}

export interface ChapterAnatomy {
  warId: number;
  title: string;
  /** Cover-art prompt (winning country's bible location, text-free). */
  coverPrompt: string;
  /** The location card the cover stages (text surfaces only). */
  coverLocationName?: string;
  recap: ChapterRecapBeat[];
  cast: ChapterCastMember[];
  computeLedger: { computeSpentUsd: number; note: string };
  cliffhanger: string;
  source: "llm" | "fallback";
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function chapterCountryName(factionId: number): string {
  return countryBible(factionId)?.country || `Faction ${factionId}`;
}

function clean(text: unknown, max = 280): string {
  return String(text ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** The runner-up faction id from finalRanks (rank 2), or -1. */
export function runnerUpFactionId(facts: ChapterCycleFacts): number {
  const ranks = facts.finalRanks || [];
  for (let fid = 0; fid < ranks.length; fid++) {
    if (ranks[fid] === 2) return fid;
  }
  return -1;
}

/** The faction with the biggest positive rank swing, or -1. */
export function biggestClimberFactionId(facts: ChapterCycleFacts): number {
  const deltas = facts.rankDeltas || [];
  let best = -1;
  let bestDelta = 0;
  for (let fid = 0; fid < deltas.length; fid++) {
    if ((deltas[fid] || 0) > bestDelta) {
      bestDelta = deltas[fid];
      best = fid;
    }
  }
  return best;
}

/** The bible location a chapter cover stages — the winner's HQ when it exists. */
export function pickCoverLocation(winnerFactionId: number): LocationCard | null {
  const bible = countryBible(winnerFactionId);
  if (!bible || bible.locations.length === 0) return null;
  return (
    bible.locations.find((l) => l.mode === "faction_hq") ||
    bible.locations.find((l) => l.mode === "luxury_landscape") ||
    bible.locations[0]
  );
}

/**
 * COVER: the cover-art prompt, staged on the winning country's bible location
 * card with its palette, arcade-cel rung (the chapter-cover surface). Pure;
 * never contains readable-text instructions or flag-print clothing.
 */
export function buildChapterCoverPrompt(
  winnerFactionId: number,
  opts: { mood?: string } = {},
): { prompt: string; locationName?: string } {
  const bible = countryBible(winnerFactionId);
  const rung = styleRung("arcade_cel");
  const location = pickCoverLocation(winnerFactionId);
  const nation = bible?.country || `Faction ${winnerFactionId}`;
  const colors = bible?.colors;
  const prompt = [
    `Manga chapter cover composition: the victorious ${nation} war effort at ${location ? `${location.name} — ${location.hook}` : "its mining stronghold"}`,
    `${opts.mood || "Triumphant end-of-cycle energy"}: the winning country's beasts mid-celebration in the foreground, rivals small and scheming at the edges, the mining operation glowing behind them. One clear focal character with a readable face; the frame must survive as a thumbnail.`,
    colors
      ? `Palette discipline: ${nation} faction colors — primary ${colors.primary}, secondary ${colors.secondary}, accent ${colors.accent}, glow ${colors.glow}. National identity comes from costume style and palette only.`
      : "",
    rung.styleContract,
    `${rung.never} No readable text, lettering, numbers, signage, logos, or UI anywhere in the image (the chapter title is typeset separately, never painted in). Never render any country flag as clothing, headwear, or fabric on a character.`,
  ]
    .filter(Boolean)
    .join("\n\n");
  return { prompt, locationName: location?.name };
}

/** CAST: beasts that earned screen time this cycle, deterministic order. */
export function buildChapterCast(facts: ChapterCycleFacts): ChapterCastMember[] {
  const cast: ChapterCastMember[] = [];
  const seen = new Set<string>();
  const push = (m: ChapterCastMember) => {
    const key = `${m.mint || m.name}:${m.role}`;
    if (seen.has(key) || cast.length >= 12) return;
    seen.add(key);
    cast.push(m);
  };
  for (const mvp of facts.mvps || []) {
    push({
      mint: mvp.mint,
      name: mvp.beastName || mvp.ownerCallsign || `${chapterCountryName(mvp.factionId)} MVP`,
      factionId: mvp.factionId,
      ownerCallsign: mvp.ownerCallsign,
      role: "mvp",
    });
  }
  for (const mut of facts.biggestMutations || []) {
    push({
      mint: mut.mint,
      name: mut.beastName || `HashBeast ${mut.mint.slice(0, 6)}…`,
      factionId: mut.factionId,
      role:
        mut.kind === "evolution"
          ? "evolved"
          : mut.techniqueName
            ? "technique_debut"
            : "mutated",
    });
  }
  for (const intro of facts.mintIntros || []) {
    push({
      mint: intro.mint,
      name: intro.beastName || `HashBeast ${intro.mint.slice(0, 6)}…`,
      factionId: intro.factionId,
      role: "minted",
      line: intro.introLine,
    });
  }
  return cast;
}

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic fallback (and the structural spine the LLM pass fills in)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The deterministic chapter anatomy — used when the LLM path is disabled,
 * unavailable, or fails the banned-lexicon lint twice. Beat 1 ALWAYS pays off
 * the previous chapter's cliffhanger when one exists, so serialization holds
 * even on the zero-spend path.
 */
export function buildChapterAnatomyFallback(
  facts: ChapterCycleFacts,
): ChapterAnatomy {
  const winner = chapterCountryName(facts.winnerFactionId);
  const cover = buildChapterCoverPrompt(facts.winnerFactionId);
  const cast = buildChapterCast(facts);
  const recap: ChapterRecapBeat[] = [];

  if (facts.previousCliffhanger) {
    recap.push({
      beat: `Last chapter left it hanging: "${clean(facts.previousCliffhanger, 200)}" This cycle answered — ${winner} settled it on the front line.`,
      callouts: [winner],
    });
  }
  const climber = biggestClimberFactionId(facts);
  if (climber >= 0 && climber !== facts.winnerFactionId) {
    recap.push({
      beat: `${chapterCountryName(climber)} made the loudest climb of the cycle — ${facts.rankDeltas?.[climber]} places in one war.`,
      callouts: [chapterCountryName(climber)],
    });
  }
  const winnerMvp = (facts.mvps || []).find(
    (m) => m.factionId === facts.winnerFactionId,
  );
  if (winnerMvp) {
    const who = winnerMvp.beastName || winnerMvp.ownerCallsign || `${winner}'s MVP`;
    recap.push({
      beat: `${who} carried ${winner} through the closing rounds and took the country's crown for the cycle.`,
      callouts: [who],
    });
  }
  const bigMut = (facts.biggestMutations || [])[0];
  if (bigMut) {
    const who = bigMut.beastName || `HashBeast ${bigMut.mint.slice(0, 6)}…`;
    recap.push({
      beat:
        bigMut.kind === "evolution"
          ? `${who} came back changed — stage ${bigMut.newStage ?? "?"}, and nobody laughed twice.`
          : bigMut.techniqueName
            ? `${who} debuted ${bigMut.techniqueName} mid-war and the room went quiet.`
            : `${who} mutated mid-battle and wore the new look like it planned it.`,
      callouts: [who],
    });
  }
  if ((facts.jackpots || []).length > 0) {
    recap.push({
      beat: `The dice gods picked a side too — ${facts.jackpots!.length} jackpot${facts.jackpots!.length > 1 ? "s" : ""} hit before the cycle closed.`,
      callouts: [],
    });
  }
  if ((facts.mintIntros || []).length > 0) {
    const first = facts.mintIntros![0];
    const who = first.beastName || `HashBeast ${first.mint.slice(0, 6)}…`;
    recap.push({
      beat: `${facts.mintIntros!.length === 1 ? `A fresh recruit walked in: ${who} joined the ${chapterCountryName(first.factionId ?? facts.winnerFactionId)} front` : `${facts.mintIntros!.length} fresh recruits walked into the war, ${who} loudest among them`}${first.introLine ? ` — "${clean(first.introLine, 100)}"` : "."}`,
      callouts: [who],
    });
  }
  if (recap.length < 3) {
    recap.push({
      beat: `${winner} took the cycle and made sure every rival saw it happen.`,
      callouts: [winner],
    });
  }
  if (recap.length < 3) {
    recap.push({
      beat: `the ranks reset, the dBTC keeps glowing, and nobody in the dens is sleeping tonight.`,
      callouts: [],
    });
  }

  const runnerUp = runnerUpFactionId(facts);
  const cliffhanger =
    runnerUp >= 0
      ? `${chapterCountryName(runnerUp)} finished one step behind and is already plotting — can ${winner} hold the crown when the next war opens?`
      : `${winner} wears the crown for now — who is hungry enough to take it next cycle?`;

  return {
    warId: facts.warId,
    title: `Chapter ${facts.warId}: ${winner} Takes the Cycle`,
    coverPrompt: cover.prompt,
    coverLocationName: cover.locationName,
    recap: recap.slice(0, 5),
    cast,
    computeLedger: {
      computeSpentUsd: Math.round((facts.computeSpentUsd || 0) * 100) / 100,
      note: "Compute spent producing this cycle's content (passthrough from the spend ledger).",
    },
    cliffhanger,
    source: "fallback",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Writers-room-lite prompt (the LLM pass) + lint
// ─────────────────────────────────────────────────────────────────────────────

/** Chapter-text lexicon: dialogue smells + chapter-surface banned tokens. */
export function chapterTextSmells(text: string): string[] {
  const flags = dialogueSmells(text);
  // Chapter copy must also avoid stale product language banned across surfaces.
  for (const phrase of ["prediction market", "oracle", "geopolitical risk", "apy", "dividend"]) {
    if (String(text || "").toLowerCase().includes(phrase)) {
      flags.push(`stale product language: ${phrase}`);
    }
  }
  return flags;
}

/** Lint every text field of an anatomy. Empty array = clean. */
export function lintChapterAnatomy(
  anatomy: Pick<ChapterAnatomy, "title" | "recap" | "cliffhanger">,
): string[] {
  const flags: string[] = [];
  for (const f of chapterTextSmells(anatomy.title)) flags.push(`title: ${f}`);
  anatomy.recap.forEach((b, i) => {
    for (const f of chapterTextSmells(b.beat)) flags.push(`recap[${i}]: ${f}`);
  });
  for (const f of chapterTextSmells(anatomy.cliffhanger)) {
    flags.push(`cliffhanger: ${f}`);
  }
  return flags;
}

/**
 * The writers-room-lite prompt: one call covering the beat sheet + line-doctor
 * duties for a chapter's text (title, recap beats, cliffhanger). The cover
 * prompt and cast stay deterministic (canon-built, never LLM-invented).
 */
export function buildChapterWriterPrompt(facts: ChapterCycleFacts): string {
  const winner = chapterCountryName(facts.winnerFactionId);
  const factLines: string[] = [`Winner of war cycle ${facts.warId}: ${winner}.`];
  const runnerUp = runnerUpFactionId(facts);
  if (runnerUp >= 0) factLines.push(`Runner-up: ${chapterCountryName(runnerUp)}.`);
  const climber = biggestClimberFactionId(facts);
  if (climber >= 0) {
    factLines.push(
      `Biggest rank swing: ${chapterCountryName(climber)} climbed ${facts.rankDeltas?.[climber]} places.`,
    );
  }
  for (const mvp of facts.mvps || []) {
    factLines.push(
      `Country MVP — ${chapterCountryName(mvp.factionId)}: ${mvp.beastName || mvp.ownerCallsign || "(unnamed)"}${mvp.ownerCallsign ? ` (owner callsign ${mvp.ownerCallsign})` : ""}.`,
    );
  }
  for (const mut of facts.biggestMutations || []) {
    factLines.push(
      `Big ${mut.kind}: ${mut.beastName || mut.mint.slice(0, 6)}${mut.kind === "evolution" ? ` reached stage ${mut.newStage ?? "?"}` : ""}${mut.techniqueName ? ` debuting "${mut.techniqueName}"` : ""}.`,
    );
  }
  for (const j of facts.jackpots || []) {
    factLines.push(`Jackpot hit${j.factionId != null ? ` on the ${chapterCountryName(j.factionId)} lane` : ""}.`);
  }
  for (const intro of facts.mintIntros || []) {
    factLines.push(
      `Fresh recruit: ${intro.beastName || intro.mint.slice(0, 6)} joined ${chapterCountryName(intro.factionId ?? facts.winnerFactionId)}${intro.introLine ? ` with the intro line "${intro.introLine}"` : ""}.`,
    );
  }

  return [
    `You are the editor of HASHIDEN, the serialized manga of a country-vs-country HashBeast mining war. Write the chapter front-matter for war cycle ${facts.warId}. Work like a writers room: beat sheet first (internally), then line-doctor every sentence — concrete, physical, character-first; zero marketing language.`,
    facts.storySoFar ? `STORY SO FAR: ${clean(facts.storySoFar, 600)}` : "",
    facts.previousCliffhanger
      ? `PREVIOUS CHAPTER'S CLIFFHANGER (an open loop you MUST pay off): "${clean(facts.previousCliffhanger, 240)}". Recap beat 1 must visibly answer or twist this exact question — quote or paraphrase it so readers feel the payoff.`
      : "",
    `THE CYCLE'S INDEXED FACTS (story clay — never contradict them, never invent results):\n${factLines.map((l) => `- ${l}`).join("\n")}`,
    `LOOP DUTY: the chapter closes on ONE new open question (the cliffhanger). It must be a NEW question — never the payoff withheld, never a repeat of the previous cliffhanger.`,
    `BANNED LEXICON (a machine lint rejects any output containing these): ${BANNED_PITCH_PHRASES.join(", ")}, "fair launch", "pre-mine", "insiders", "emissions", "yield", "leaderboard", "4-hour", "prediction market", "oracle", "geopolitical risk", "APY", "dividend". Game events become story beats with named characters, not mechanics talk.`,
    `Write STRICT JSON only (no markdown):
{
  "title": "punchy manga chapter title, <= 8 words, no quotes inside",
  "recap": [
    { "beat": "one concrete sentence, <= 30 words, names who did what", "callouts": ["character or country names this beat features"] }
  ],
  "cliffhanger": "one open-loop line teasing the next chapter, <= 25 words"
}
recap has 3 to 5 beats. ${facts.previousCliffhanger ? "Beat 1 pays off the previous cliffhanger." : "Beat 1 is the cycle's loudest moment."}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Merge an LLM front-matter draft onto the deterministic spine (cover, cast,
 * ledger stay canon-built). Returns null when the draft is structurally bad.
 */
export function mergeChapterDraft(
  facts: ChapterCycleFacts,
  draft: { title?: unknown; recap?: unknown; cliffhanger?: unknown } | null,
): ChapterAnatomy | null {
  if (!draft || typeof draft !== "object") return null;
  const title = clean(draft.title, 120);
  const cliffhanger = clean(draft.cliffhanger, 240);
  const beats: ChapterRecapBeat[] = Array.isArray(draft.recap)
    ? (draft.recap as any[])
        .map((b) => ({
          beat: clean(b?.beat, 300),
          callouts: Array.isArray(b?.callouts)
            ? (b.callouts as any[]).map((c) => clean(c, 60)).filter(Boolean)
            : [],
        }))
        .filter((b) => b.beat)
    : [];
  if (!title || !cliffhanger || beats.length < 3) return null;
  const spine = buildChapterAnatomyFallback(facts);
  return {
    ...spine,
    title,
    recap: beats.slice(0, 5),
    cliffhanger,
    source: "llm",
  };
}
