/**
 * Deterministic lint for the trailer script pipeline. Every quality rule the
 * prompts ask for is a promise; this file is the check. Runs after each pass
 * in run.ts — warnings print, errors throw (TRAILER_LINT=warn downgrades
 * errors to warnings; TRAILER_LINT=off disables).
 *
 * Zero LLM calls — pure string/JSON checks.
 */
import { castEntry } from "../style/castCanon.js";
import type { Blueprint, Screenplay } from "./types.js";
import { isReferenceAssetRef } from "../world/assetRegistry.js";
import { resolveCountryCharacterProfile } from "../world/countryCastRegistry.js";
import {
  BANNED_DIALOGUE_PATTERNS,
  BANNED_PITCH_PHRASES,
  NAMED_EMOTION_PATTERN,
  WORDS_PER_SECOND,
  dialogueWords,
  minDialogueWordsForSlot,
  normalizeForDialogue,
} from "../../src/content-engine/dialogueQuality.js";

export interface LintResult {
  errors: string[];
  warnings: string[];
}

const MAX_LINE_WORDS = 34; // one cinematic speech chunk; density checks below block tiny barks
const MAX_SEQ_CHARS = 3;

const norm = normalizeForDialogue;
const words = dialogueWords;

/** Motion words that don't belong in a STILL frame prompt. */
const MOTION_WORDS = [
  "begins to", "starts to", "starting to", "is about to", "about to",
  "walks toward", "walking toward", "runs toward", "running toward",
  "slowly turns", "camera pushes", "camera pans", "zooms in", "zooming",
];

/** Internal grammar codes that must never reach a Seedance/keyframe prompt. */
const INTERNAL_CODE = /\b(?:M[LAMCTRXPS]\d|MPAL\d|MPT-[A-D]|ME\d|MR\d)\b/;
const DELIBERATE_SILENCE = /\b(silence|silent|no words|wordless|cut off|cuts? off|interrupted|unfinished|stops mid|holds?|pause|beat|stare|look|reaction|deadpan)\b/i;

function isDeliberatelySparse(sh: { action?: string; performance?: string; sound?: string; dialogue?: Array<{ delivery?: string; line?: string }> }): boolean {
  const text = [
    sh.action || "",
    sh.performance || "",
    sh.sound || "",
    ...(sh.dialogue || []).flatMap((d) => [d.delivery || "", d.line || ""]),
  ].join(" ");
  return DELIBERATE_SILENCE.test(text);
}

/** Extract keeper lines from a blueprint body: quoted strings on lines mentioning "protect". */
export function extractKeeperLines(blueprintBody: string): string[] {
  const keepers: string[] = [];
  for (const line of blueprintBody.split("\n")) {
    if (!/protect/i.test(line)) continue;
    for (const m of line.matchAll(/"([^"]{8,})"/g)) keepers.push(m[1]);
  }
  return keepers;
}

/** Pull spoken dialogue lines out of a working/directed script (CHARACTER: "line"). */
function extractDialogueLines(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(/^\s*[A-Z][A-Za-z .'"-]{0,30}:\s*"([^"]+)"/gm)) out.push(m[1]);
  return out;
}

/**
 * The script's SHOT-block body — everything from the first SHOT line on.
 * The header (SPINE / CANDIDATES / OVERLAYS) must NOT feed the dialogue
 * extractor: `OVERLAY: "…"`/`HOOK A: "…"` match the speaker pattern, which
 * made the overlay-duplication check a tautology and linted unused
 * candidates as spoken lines.
 */
function shotBody(text: string): string {
  const m = /^\s*SHOT\s+\d+/m.exec(text);
  return m ? text.slice(m.index) : text;
}

function extractSpeakerFragments(line: string): string[] {
  if (!/^\s*[A-Z][A-Za-z .'"-]{0,30}:\s*/.test(line)) return [];
  return Array.from(line.matchAll(/"([^"]+)"/g)).map((m) => m[1]).filter(Boolean);
}

/** Lint a TEXT pass output (the writers-room `script` pass). */
export function lintText(passId: string, text: string, bp: Blueprint, _maxSeqSec?: number): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const n = norm(text);
  const keeperNorms = extractKeeperLines(bp.body).map(norm);
  const isKeeperish = (line: string) => {
    const ln = norm(line);
    return keeperNorms.some((k) => ln.includes(k) || k.includes(ln));
  };

  // SPINE must survive — the FIELDS are load-bearing; the literal header word is cosmetic.
  const spineFieldsMissing = ["CORE QUESTION", "CHANGE", "STAKES"].filter((f) => !text.includes(`${f}:`));
  for (const f of spineFieldsMissing) errors.push(`SPINE field missing: ${f}`);
  if (spineFieldsMissing.length === 0 && !/^\s*SPINE\b/m.test(text)) {
    warnings.push("literal SPINE header line missing (fields present — cosmetic)");
  }

  // Every shot needs a LOOP line.
  const shots = (text.match(/^\s*SHOT\s+\d+/gm) || []).length;
  const loops = (text.match(/^\s*LOOP:/gm) || []).length;
  if (shots === 0) errors.push("no SHOT blocks found");
  if (loops < shots) warnings.push(`LOOP lines (${loops}) < SHOT blocks (${shots}) — loop bookkeeping is leaking`);

  // Keeper lines must survive (normalized substring).
  for (const keeper of extractKeeperLines(bp.body)) {
    if (!n.includes(norm(keeper))) errors.push(`keeper line lost: "${keeper}"`);
  }

  // Anti-slop lexicon + named emotions + word budget on SPOKEN dialogue lines
  // (the SHOT-block body only — header CANDIDATES/OVERLAYS are not speech).
  // Keeper lines are exempt from budget (they're protected verbatim, whatever their length).
  const body = shotBody(text);
  const lines = extractDialogueLines(body);
  for (const line of lines) {
    const ln = norm(line);
    for (const banned of BANNED_PITCH_PHRASES) {
      if (ln.includes(norm(banned))) warnings.push(`pitch-deck smell in line: "${line}" (${banned})`);
    }
    for (const [pattern, reason] of BANNED_DIALOGUE_PATTERNS) {
      if (pattern.test(line) && !isKeeperish(line)) errors.push(`bad dialogue smell (${reason}): "${line}"`);
    }
    if (NAMED_EMOTION_PATTERN.test(line)) warnings.push(`named emotion (show, don't say): "${line}"`);
    if (words(line).length > MAX_LINE_WORDS && !isKeeperish(line)) {
      warnings.push(`single dialogue chunk may be too long (${words(line).length} words): "${line}"`);
    }
  }

  // Writers-room structure: CANDIDATES (3 hooks + 3 cliffhangers) + OVERLAYS discipline.
  if (passId === "script") {
    const hookCands = (text.match(/^\s*HOOK [A-C]:/gm) || []).length;
    const cliffCands = (text.match(/^\s*CLIFFHANGER [A-C]:/gm) || []).length;
    if (hookCands < 3) warnings.push(`CANDIDATES block has ${hookCands}/3 hook candidates`);
    if (cliffCands < 3) warnings.push(`CANDIDATES block has ${cliffCands}/3 cliffhanger candidates`);
    // Candidates are prospective dialogue: banned-lexicon problems are worth
    // surfacing, but as warnings — an unused candidate must not fail the pass.
    for (const m of text.matchAll(/^\s*(?:HOOK|CLIFFHANGER) [A-C]:\s*"([^"]+)"/gm)) {
      for (const [pattern, reason] of BANNED_DIALOGUE_PATTERNS) {
        if (pattern.test(m[1])) warnings.push(`candidate has dialogue smell (${reason}): "${m[1]}"`);
      }
    }
    const overlayLines = Array.from(text.matchAll(/^\s*OVERLAY:\s*"([^"]+)"/gm)).map((m) => m[1]);
    if (overlayLines.length > 2) warnings.push(`${overlayLines.length} overlays — max is 2 (restraint is the rule)`);
    for (const o of overlayLines) {
      if (words(o).length > 8) warnings.push(`overlay too long (${words(o).length} words, max 8): "${o}"`);
      if (lines.some((l) => norm(l) === norm(o))) warnings.push(`overlay duplicates a dialogue line: "${o}"`);
    }
    if (INTERNAL_CODE.test(text)) warnings.push("internal grammar codes leaked into the locked script");
  }

  return { errors, warnings };
}

/** Lint the screenplay's overlay track (engagement-bait text, global timestamps). */
export function lintOverlays(sp: Screenplay): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const overlays = sp.overlays || [];
  const total = Number(sp.totalSeconds) || 0;
  if (overlays.length > 2) errors.push(`overlays: ${overlays.length} entries — max 2`);
  for (const [i, o] of overlays.entries()) {
    const tag = `overlay ${i + 1}`;
    if (!o.text?.trim()) { errors.push(`${tag}: empty text`); continue; }
    if (words(o.text).length > 8) warnings.push(`${tag}: too long (${words(o.text).length} words, max 8): "${o.text}"`);
    if (!(Number(o.untilSec) > Number(o.atSec))) errors.push(`${tag}: untilSec must be > atSec`);
    if (Number(o.untilSec) - Number(o.atSec) < 1.5) warnings.push(`${tag}: window under 1.5s — too quick to read`);
    if (total > 0 && Number(o.atSec) > total) errors.push(`${tag}: atSec ${o.atSec}s is beyond the ~${total}s runtime`);
    if (total > 0 && Number(o.untilSec) > total + 2) warnings.push(`${tag}: untilSec ${o.untilSec}s runs past the ~${total}s runtime`);
    if (!["bait", "cta"].includes(String(o.style))) warnings.push(`${tag}: style should be bait|cta (got "${o.style}")`);
    // Must never duplicate a spoken line or a fact caption.
    const on = norm(o.text);
    for (const seq of sp.sequences || []) {
      for (const sh of seq.shots || []) {
        if (sh.caption && norm(sh.caption) === on) warnings.push(`${tag}: duplicates a fact caption ("${o.text}")`);
        for (const d of sh.dialogue || []) {
          if (d.line && norm(d.line) === on) warnings.push(`${tag}: duplicates a dialogue line ("${o.text}")`);
        }
      }
    }
  }
  return { errors, warnings };
}

/** Merge lint results (utility for callers that combine several lints). */
export function collectLintIssues(...results: LintResult[]): LintResult {
  return {
    errors: results.flatMap((r) => r.errors),
    warnings: results.flatMap((r) => r.warnings),
  };
}

/** Lint the compiled screenplay (pass 5 output) against the directed script. */
export function lintScreenplay(sp: Screenplay, directedText: string, maxSeqSec: number): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const directedNorm = norm(directedText);

  if (!sp.sequences?.length) {
    errors.push("no sequences[]");
    return { errors, warnings };
  }

  for (const seq of sp.sequences) {
    const tag = `seq ${seq.n}`;
    if (!(Number(seq.durationSec) > 0)) errors.push(`${tag}: bad durationSec`);
    if (Number(seq.durationSec) > maxSeqSec + 0.01) errors.push(`${tag}: durationSec ${seq.durationSec}s > hard cap ${maxSeqSec}s — unrenderable in one generation`);
    if ((seq.characters || []).length > MAX_SEQ_CHARS) warnings.push(`${tag}: ${seq.characters.length} characters (max ${MAX_SEQ_CHARS})`);
    for (const c of seq.characters || []) {
      if (!/^@[a-z0-9_]+$/.test(c.refTag || "")) warnings.push(`${tag}: bad refTag "${c.refTag}" for ${c.name}`);
      else if (!castEntry(c.refTag.slice(1)) && !resolveCountryCharacterProfile(c.refTag)) warnings.push(`${tag}: refTag ${c.refTag} not in cast canon or country registry (ensemble character? needs a reference sheet)`);
    }
    if (!seq.timelinePrompt?.trim()) errors.push(`${tag}: missing timelinePrompt`);
    else if (INTERNAL_CODE.test(seq.timelinePrompt)) errors.push(`${tag}: internal grammar codes leaked into timelinePrompt`);

    let prevEnd = 0;
    for (const sh of seq.shots || []) {
      const stag = `${tag} shot ${sh.n}`;
      const len = Number(sh.endSec) - Number(sh.startSec);
      if (!(len > 0)) errors.push(`${stag}: endSec must be > startSec`);
      if (Number(sh.startSec) < prevEnd - 0.01) warnings.push(`${stag}: overlaps previous shot`);
      prevEnd = Number(sh.endSec);
      const spoken = (sh.dialogue || []).map((d) => d.line).join(" ");
      if (spoken) {
        const spokenWords = words(spoken).length;
        const fit = spokenWords / WORDS_PER_SECOND + 0.5;
        if (fit > len + 0.5) errors.push(`${stag}: dialogue (~${fit.toFixed(1)}s) won't fit the ${len.toFixed(1)}s slot`);
        const minWords = minDialogueWordsForSlot(len);
        if (spokenWords < minWords && !isDeliberatelySparse(sh)) {
          errors.push(`${stag}: dialogue too sparse for ${len.toFixed(1)}s slot (${spokenWords} words; target at least ${minWords}, or shorten the shot / mark it as deliberate silence)`);
        }
        // Verbatim carry: every spoken line must exist in the directed script.
        for (const d of sh.dialogue || []) {
          for (const [pattern, reason] of BANNED_DIALOGUE_PATTERNS) {
            if (pattern.test(d.line || "")) errors.push(`${stag}: bad dialogue smell (${reason}) — "${d.line}"`);
          }
          if (d.line && !directedNorm.includes(norm(d.line))) {
            errors.push(`${stag}: dialogue NOT verbatim — "${d.line}"`);
          }
        }
        // Caption must not duplicate the mouth.
        if (sh.caption && norm(sh.caption).length > 0) {
          const cw = new Set(words(sh.caption));
          const overlap = words(spoken).filter((w) => w.length > 3 && cw.has(w)).length;
          if (cw.size > 0 && overlap >= Math.max(2, cw.size - 1)) {
            warnings.push(`${stag}: caption duplicates the spoken line ("${sh.caption}")`);
          }
        }
      }
    }
    if (Math.abs(prevEnd - Number(seq.durationSec)) > 1.5) {
      warnings.push(`${tag}: last shot ends at ${prevEnd}s but durationSec is ${seq.durationSec}s`);
    }
  }
  return { errors, warnings };
}

/** Lint the frames pass output against the screenplay. */
export function lintFrames(parsed: any, sp: Screenplay): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seqNs = new Set((sp.sequences || []).map((q) => Number(q.n)));

  for (const q of parsed?.sequences || []) {
    const tag = `seq ${q.n}`;
    const frames: Array<[string, any]> = [["startFrame", q.startFrame]];
    if (q.endFrame) frames.push(["endFrame", q.endFrame]);
    for (const [kind, f] of frames) {
      if (!f?.prompt?.trim()) {
        if (kind === "startFrame") errors.push(`${tag}: missing startFrame.prompt`);
        continue;
      }
      const fp = String(f.prompt).toLowerCase();
      for (const mw of MOTION_WORDS) {
        if (fp.includes(mw)) warnings.push(`${tag} ${kind}: motion word in still prompt ("${mw}")`);
      }
      if (INTERNAL_CODE.test(f.prompt)) warnings.push(`${tag} ${kind}: internal grammar codes in frame prompt`);
      for (const ref of f.refs || []) {
        const envMatch = /^env:seq(\d+)\.(startFrame|endFrame)$/.exec(ref);
        if (envMatch) {
          const refN = Number(envMatch[1]);
          if (!seqNs.has(refN)) warnings.push(`${tag} ${kind}: env ref to unknown sequence ${refN}`);
          else if (refN >= Number(q.n)) warnings.push(`${tag} ${kind}: env ref must point to an EARLIER sequence (got seq ${refN})`);
        } else if (/^(country:|asset:)/.test(ref)) {
          if (!isReferenceAssetRef(ref)) warnings.push(`${tag} ${kind}: reference asset missing or invalid "${ref}"`);
        } else {
          const m = /^@([a-z0-9_]+)(?::([a-z0-9_-]+))?$/.exec(ref);
          if (!m) warnings.push(`${tag} ${kind}: bad ref format "${ref}"`);
          else if (!castEntry(m[1]) && !resolveCountryCharacterProfile(m[1])) warnings.push(`${tag} ${kind}: ref ${ref} not in cast canon or country registry`);
        }
      }
    }
    if (q.endFrame && !["bridge", "handoff"].includes(String(q.endFrame.reason))) {
      warnings.push(`${tag}: endFrame.reason should be bridge|handoff (got "${q.endFrame.reason}")`);
    }
  }
  return { errors, warnings };
}

/** Print + enforce a lint result. TRAILER_LINT=off disables; =warn downgrades errors. */
export function applyLint(label: string, res: LintResult): void {
  const mode = (process.env.TRAILER_LINT || "strict").toLowerCase();
  if (mode === "off") return;
  for (const w of res.warnings) console.log(`      ⚠ lint(${label}): ${w}`);
  if (res.errors.length > 0) {
    for (const e of res.errors) console.log(`      ✗ lint(${label}): ${e}`);
    if (mode !== "warn") throw new Error(`lint failed (${label}): ${res.errors[0]}${res.errors.length > 1 ? ` (+${res.errors.length - 1} more)` : ""}`);
  }
}
