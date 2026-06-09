export const WORDS_PER_SECOND = 2.3;

export interface DialogueQualityLine {
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

export interface DialogueQualityReport {
  lineCount: number;
  totalWords: number;
  avgWords: number;
  flaggedCount: number;
  score: number;
  spokenSeconds: number;
  availableSeconds: number;
  occupancyPct: number;
  lines: DialogueQualityLine[];
}

export const BANNED_PITCH_PHRASES = [
  "revolutionary",
  "cutting-edge",
  "cutting edge",
  "game-changing",
  "game changer",
  "seamless",
  "unlock the",
  "empower",
  "isn't just a",
  "is not just a",
  "next-generation",
  "next generation",
  "ecosystem of",
  "paradigm",
  "best-in-class",
  "world-class",
  "supercharge",
  "skyrocket",
];

export const BANNED_DIALOGUE_PATTERNS: Array<[RegExp, string]> = [
  [/^\s*(slow|sealed|yield|faster|mine|locked|gone|dead)\s*[.!?]?\s*$/i, "single-word prop label"],
  [/\bno yield\b/i, "mechanic phrase: no yield"],
  [/\bno pulse\b/i, "mechanic phrase: no pulse"],
  [/\bscreensaver\b/i, "try-hard tech joke: screensaver"],
  [/\bvelvet rope\b/i, "launch metaphor smell: velvet rope"],
  [/\bfounder'?s table\b/i, "launch metaphor smell: founder's table"],
  [/\bpick up a pickaxe\b/i, "tutorial phrase: pick up a pickaxe"],
  [/\bearn the signal\b/i, "abstract trailer phrase: earn the signal"],
  [/\beverything that replaced something broken\b/i, "inspirational thesis line"],
  [/\bstarted with one room\b/i, "inspirational thesis line"],
  [/\bbefore anyone asked\b/i, "inspirational thesis line"],
  [/\bsomething broken\b/i, "abstract thesis phrase: something broken"],
  [/\bfair launch\b/i, "mechanic phrase: fair launch"],
  [/\bpre[- ]?mine\b/i, "mechanic phrase: pre-mine"],
  [/\binsiders?\b/i, "mechanic phrase: insiders"],
  [/\bemissions?\b/i, "mechanic phrase: emissions"],
  [/\b4[- ]?hour\b/i, "mechanic phrase: 4-hour"],
  [/\bleaderboard\b/i, "UI/mechanic phrase: leaderboard"],
  [/\bmine your destiny\b/i, "generic mining slogan"],
];

export const NAMED_EMOTION_PATTERN =
  /\b(i'?m|i am|we'?re|we are)\s+(scared|afraid|terrified|worried|nervous|excited|sad|angry|happy)\b/i;

export function normalizeForDialogue(text: string): string {
  return String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function dialogueWords(text: string): string[] {
  const normalized = normalizeForDialogue(text);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}

export function minDialogueWordsForSlot(seconds: number): number {
  if (seconds < 3) return 0;
  if (seconds < 5) return 4;
  return Math.ceil(Math.max(0, seconds - 1.4) * WORDS_PER_SECOND * 0.62);
}

export function maxDialogueWordsForSlot(seconds: number): number {
  if (seconds < 3) return 9;
  return Math.max(8, Math.ceil(Math.max(1, seconds - 0.4) * WORDS_PER_SECOND * 0.9));
}

export function estimateSpeechSeconds(wordCount: number): number {
  return wordCount / WORDS_PER_SECOND + 0.5;
}

export function dialogueSmells(line: string): string[] {
  const normalized = normalizeForDialogue(line);
  const flags: string[] = [];
  for (const phrase of BANNED_PITCH_PHRASES) {
    if (normalized.includes(normalizeForDialogue(phrase))) flags.push(`pitch-deck smell: ${phrase}`);
  }
  for (const [pattern, reason] of BANNED_DIALOGUE_PATTERNS) {
    if (pattern.test(line)) flags.push(reason);
  }
  if (NAMED_EMOTION_PATTERN.test(line)) flags.push("named emotion; show it with behavior");
  return Array.from(new Set(flags));
}

export function analyzeDialogueLine(input: {
  sequence: number | string;
  shot: number | string;
  speaker?: string;
  line?: string;
  delivery?: string;
  seconds?: number;
  deliberateSilence?: boolean;
}): DialogueQualityLine {
  const text = String(input.line || "");
  const seconds = Math.max(0, Number(input.seconds || 0));
  const wordCount = dialogueWords(text).length;
  const minWords = minDialogueWordsForSlot(seconds);
  const maxWords = maxDialogueWordsForSlot(seconds);
  const estimatedSeconds = estimateSpeechSeconds(wordCount);
  const occupancyPct = seconds > 0 ? Math.round((estimatedSeconds / seconds) * 100) : 0;
  const flags = dialogueSmells(text);
  if (wordCount > 0 && wordCount < minWords && !input.deliberateSilence) {
    flags.push(`too short for ${seconds.toFixed(1)}s slot`);
  }
  if (wordCount > maxWords) {
    flags.push(`too dense for ${seconds.toFixed(1)}s slot`);
  }
  if (estimatedSeconds > seconds + 0.5) {
    flags.push(`may not fit ${seconds.toFixed(1)}s slot`);
  }
  if (wordCount > 0 && !input.delivery?.trim()) {
    flags.push("missing delivery note");
  }
  return {
    sequence: input.sequence,
    shot: input.shot,
    speaker: String(input.speaker || ""),
    line: text,
    delivery: input.delivery,
    seconds,
    wordCount,
    minWords,
    maxWords,
    estimatedSeconds: Number(estimatedSeconds.toFixed(1)),
    occupancyPct,
    flags: Array.from(new Set(flags)),
  };
}

const DELIBERATE_SILENCE =
  /\b(silence|silent|no words|wordless|cut off|cuts? off|interrupted|unfinished|stops mid|holds?|pause|beat|stare|look|reaction|deadpan)\b/i;

function isDeliberatelySparse(shot: any): boolean {
  const text = [
    shot?.action || "",
    shot?.performance || "",
    shot?.sound || "",
    ...(shot?.dialogue || []).flatMap((d: any) => [d?.delivery || "", d?.line || ""]),
  ].join(" ");
  return DELIBERATE_SILENCE.test(text);
}

export function analyzeScreenplayDialogue(screenplay: any): DialogueQualityReport {
  const lines: DialogueQualityLine[] = [];
  for (const seq of screenplay?.sequences || []) {
    for (const shot of seq?.shots || []) {
      const seconds = Math.max(0, Number(shot?.endSec || 0) - Number(shot?.startSec || 0));
      for (const dialogue of shot?.dialogue || []) {
        const line = analyzeDialogueLine({
          sequence: seq?.n,
          shot: shot?.n,
          speaker: dialogue?.speaker,
          line: dialogue?.line,
          delivery: dialogue?.delivery,
          seconds,
          deliberateSilence: isDeliberatelySparse(shot),
        });
        if (line.wordCount > 0) lines.push(line);
      }
    }
  }
  const totalWords = lines.reduce((sum, line) => sum + line.wordCount, 0);
  const flagged = lines.filter((line) => line.flags.length > 0);
  const spokenSeconds = lines.reduce((sum, line) => sum + line.estimatedSeconds, 0);
  const availableSeconds = lines.reduce((sum, line) => sum + line.seconds, 0);
  const severePenalty = flagged.reduce((sum, line) => sum + Math.min(18, line.flags.length * 7), 0);
  const score = lines.length ? Math.max(0, Math.round(100 - severePenalty / lines.length)) : 100;
  return {
    lineCount: lines.length,
    totalWords,
    avgWords: lines.length ? Number((totalWords / lines.length).toFixed(1)) : 0,
    flaggedCount: flagged.length,
    score,
    spokenSeconds: Number(spokenSeconds.toFixed(1)),
    availableSeconds: Number(availableSeconds.toFixed(1)),
    occupancyPct: availableSeconds > 0 ? Math.round((spokenSeconds / availableSeconds) * 100) : 0,
    lines,
  };
}
