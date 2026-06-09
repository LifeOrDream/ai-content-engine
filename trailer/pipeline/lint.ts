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

function extractSpeakerFragments(line: string): string[] {
  if (!/^\s*[A-Z][A-Za-z .'"-]{0,30}:\s*/.test(line)) return [];
  return Array.from(line.matchAll(/"([^"]+)"/g)).map((m) => m[1]).filter(Boolean);
}

/** Lint a TEXT pass output (passes 1-4). `maxSeqSec` enables sequence-duration checks on the direct pass. */
export function lintText(passId: string, text: string, bp: Blueprint, maxSeqSec?: number): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const n = norm(text);
  const keeperNorms = extractKeeperLines(bp.body).map(norm);
  const isKeeperish = (line: string) => {
    const ln = norm(line);
    return keeperNorms.some((k) => ln.includes(k) || k.includes(ln));
  };

  // SPINE must survive every text pass — the FIELDS are load-bearing; the literal header word is cosmetic.
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

  // Anti-slop lexicon + named emotions + word budget on dialogue lines.
  // Keeper lines are exempt from budget (they're protected verbatim, whatever their length).
  const lines = extractDialogueLines(text);
  for (const line of lines) {
    const ln = norm(line);
    for (const banned of BANNED_PITCH_PHRASES) {
      if (ln.includes(norm(banned))) warnings.push(`pitch-deck smell in line: "${line}" (${banned})`);
    }
    for (const [pattern, reason] of BANNED_DIALOGUE_PATTERNS) {
      if (pattern.test(line) && !isKeeperish(line)) errors.push(`bad dialogue smell (${reason}): "${line}"`);
    }
    if (NAMED_EMOTION_PATTERN.test(line)) warnings.push(`named emotion (show, don't say): "${line}"`);
    if (passId !== "engagement" && words(line).length > MAX_LINE_WORDS && !isKeeperish(line)) {
      warnings.push(`single dialogue chunk may be too long (${words(line).length} words): "${line}"`);
    }
  }

  // Pass-specific structure.
  if (passId === "engagement") {
    const nonKeeper = lines.filter((l) => !isKeeperish(l));
    if (nonKeeper.length > 0) {
      warnings.push(`engagement pass wrote ${nonKeeper.length} non-keeper dialogue line(s) — it must emit [intent:] placeholders only`);
    }
  }
  if (passId === "direct") {
    const seqs = (text.match(/^\s*SEQUENCE\s+\d+/gm) || []).length;
    if (seqs === 0) errors.push("direct pass produced no SEQUENCE blocks");
    // Sequence duration hard cap (one Seedance generation each) — over-cap is unrenderable.
    if (maxSeqSec) {
      for (const m of text.matchAll(/^\s*SEQUENCE\s+(\d+)[^\n]*?—\s*(\d+(?:\.\d+)?)s\s*$/gm)) {
        if (Number(m[2]) > maxSeqSec) errors.push(`SEQUENCE ${m[1]} is ${m[2]}s — hard cap is ${maxSeqSec}s (one Seedance generation); it must be split`);
      }
      for (const m of text.matchAll(/^\s*SHOT\s+(\d+)\s*—\s*(\d+(?:\.\d+)?)s?-(\d+(?:\.\d+)?)s/gm)) {
        if (Number(m[3]) > maxSeqSec) errors.push(`SHOT ${m[1]} ends at ${m[3]}s — beyond the ${maxSeqSec}s sequence cap (shot times restart at 0 per sequence)`);
      }
    }
    if (INTERNAL_CODE.test(text)) warnings.push("internal grammar codes leaked into the directed script (must be plain film English)");
    for (const m of text.matchAll(/^\s*SHOT\s+(\d+)\s*—\s*(\d+(?:\.\d+)?):(\d\d)-(\d+(?:\.\d+)?):(\d\d)s?\s*\n([\s\S]*?)(?=^\s*(?:SHOT\s+\d+|SEQUENCE\s+\d+)|$(?![\s\S]))/gm)) {
      const shotNo = m[1];
      const start = Number(m[2]) * 60 + Number(m[3]);
      const end = Number(m[4]) * 60 + Number(m[5]);
      const len = end - start;
      const fragments = m[6].split("\n").flatMap(extractSpeakerFragments);
      const spokenWords = words(fragments.join(" ")).length;
      if (spokenWords > 0) {
        const fit = spokenWords / WORDS_PER_SECOND + 0.5;
        if (fit > len + 0.5) errors.push(`SHOT ${shotNo}: directed dialogue (~${fit.toFixed(1)}s) won't fit the ${len.toFixed(1)}s slot`);
        const minWords = minDialogueWordsForSlot(len);
        if (spokenWords < minWords && !DELIBERATE_SILENCE.test(m[6])) warnings.push(`SHOT ${shotNo}: directed dialogue may be sparse for ${len.toFixed(1)}s slot (${spokenWords} words; target at least ${minWords}, or mark deliberate silence/reaction)`);
      }
    }
    for (const m of text.matchAll(/^\s*CHARACTERS:\s*(.+)$/gm)) {
      // Count by @refTags (descriptions contain commas — splitting on them false-positives).
      const tags = m[1].match(/@[a-z0-9_]+/gi) || [];
      const count = tags.length > 0 ? new Set(tags.map((t) => t.toLowerCase())).size : (/^\s*none\b/i.test(m[1]) ? 0 : 1);
      if (count > MAX_SEQ_CHARS) warnings.push(`sequence has ${count} characters (max ${MAX_SEQ_CHARS}): "${m[1].trim().slice(0, 80)}"`);
    }
  }

  return { errors, warnings };
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
