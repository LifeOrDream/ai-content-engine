/**
 * Word-timed karaoke captions — the highest-ROI packaging layer we ship.
 * Most social viewers watch MUTED: without word-level captions the dialogue
 * (the thing the writers room sweats over) simply doesn't exist for them.
 *
 * Timing is DETERMINISTIC, derived from the script plus the ACTUAL rendered
 * clip durations: scripted durations and rendered clips differ (the renderer
 * rounds/clamps, Seedance isn't frame-exact), so global offsets accumulate
 * from the measured length of each clip actually in the concat, and the
 * within-sequence shot times scale by (actual / scripted). Words spread
 * across each spoken window proportionally to their length at ~2.3 words/sec
 * — within ~±0.3s of the generated speech, zero model calls. (A forced-
 * alignment upgrade can swap in later behind the same cue shape.)
 *
 * Output: an .ass subtitle track (libass \kf karaoke fill) in one of two
 * style presets, burned onto the master by ffmpeg. Three text layers, three
 * bands: bait overlays top, fact captions lower third, karaoke at the very
 * bottom — below the fact-caption box (which spans ~y862-944 at 1080p).
 */
import type { OverlayCue, Screenplay, Sequence } from "../pipeline/types.js";

const WORDS_PER_SECOND = 2.3;
const SPEECH_LEAD_SEC = 0.3; // speech rarely starts on the cut
const LINE_GAP_SEC = 0.25;
const MAX_WORDS_PER_PAGE = 4; // punch style shows few words at a time

export interface WordCue {
  word: string;
  start: number; // global seconds in the assembled master
  end: number;
  speaker: string;
}

/** One clip that actually made it into the concat, with its measured length. */
export interface IncludedClip {
  seq: Sequence;
  /** Probed duration of the rendered clip; falls back to scripted durationSec. */
  seconds?: number;
}

/**
 * Build word cues for the EXACT clips being assembled, in concat order.
 * Sequences not in `included` get no cues; actual durations drive offsets.
 * When `includeCaptions` is set (track-first genres: anthem/edit), shots with
 * no dialogue but an ON-SCREEN caption contribute cues from the caption text
 * — that's how anthem LYRIC/CHANT lines become karaoke over the track.
 */
export function buildWordCues(included: IncludedClip[], opts: { includeCaptions?: boolean } = {}): WordCue[] {
  const cues: WordCue[] = [];
  let offset = 0;
  for (const { seq, seconds } of included) {
    const scripted = Math.max(0.1, Number(seq.durationSec || 0));
    const actual = seconds && seconds > 0 ? seconds : scripted;
    const ratio = actual / scripted;
    for (const shot of seq.shots || []) {
      let lines = (shot.dialogue || []).filter((d) => d.line?.trim());
      if (lines.length === 0 && opts.includeCaptions && shot.caption?.trim()) {
        lines = [{ speaker: "", line: shot.caption.trim(), delivery: "" }];
      }
      if (lines.length === 0) continue;
      const windowStart = offset + (Number(shot.startSec || 0) * ratio) + SPEECH_LEAD_SEC;
      const windowEnd = offset + (Number(shot.endSec || 0) * ratio) - 0.1;
      const window = Math.max(0.5, windowEnd - windowStart);

      // Natural duration of all lines at speech rate (+ gaps); compress to fit.
      const lineWords = lines.map((d) => d.line.trim().split(/\s+/).filter(Boolean));
      const natural =
        lineWords.reduce((s, w) => s + w.length / WORDS_PER_SECOND, 0) +
        LINE_GAP_SEC * (lines.length - 1);
      const scale = natural > window ? window / natural : 1;

      let t = windowStart;
      for (let li = 0; li < lines.length; li++) {
        const wordsArr = lineWords[li];
        const lineDur = (wordsArr.length / WORDS_PER_SECOND) * scale;
        const weights = wordsArr.map((w) => w.replace(/[^\p{L}\p{N}']/gu, "").length + 1.5);
        const weightSum = weights.reduce((a, b) => a + b, 0) || 1;
        let wt = t;
        for (let wi = 0; wi < wordsArr.length; wi++) {
          const dur = (weights[wi] / weightSum) * lineDur;
          cues.push({ word: wordsArr[wi], start: wt, end: wt + dur, speaker: lines[li].speaker || "" });
          wt += dur;
        }
        t += lineDur + LINE_GAP_SEC * scale;
      }
    }
    offset += actual;
  }
  return cues;
}

/**
 * Remap overlay cues (authored on the SCRIPTED global timeline over the full
 * renderable list) onto the ACTUAL assembled timeline. Overlays anchored in a
 * sequence that didn't make the concat are dropped.
 */
export function remapOverlays(
  overlays: OverlayCue[],
  renderable: Sequence[],
  included: IncludedClip[],
): OverlayCue[] {
  if (!overlays?.length) return [];
  // scripted prefix offsets per renderable sequence
  const scriptedStart = new Map<number, { start: number; len: number }>();
  let s = 0;
  for (const seq of renderable) {
    const len = Math.max(0.1, Number(seq.durationSec || 0));
    scriptedStart.set(seq.n, { start: s, len });
    s += len;
  }
  // actual prefix offsets per included sequence
  const actualStart = new Map<number, { start: number; len: number }>();
  let a = 0;
  for (const { seq, seconds } of included) {
    const scripted = Math.max(0.1, Number(seq.durationSec || 0));
    const len = seconds && seconds > 0 ? seconds : scripted;
    actualStart.set(seq.n, { start: a, len });
    a += len;
  }
  const mapTime = (t: number): number | null => {
    // find the renderable sequence whose scripted window contains t
    for (const seq of renderable) {
      const sc = scriptedStart.get(seq.n)!;
      if (t >= sc.start && t < sc.start + sc.len + 0.001) {
        const ac = actualStart.get(seq.n);
        if (!ac) return null; // sequence not in the concat — drop
        return ac.start + ((t - sc.start) / sc.len) * ac.len;
      }
    }
    return null;
  };
  const out: OverlayCue[] = [];
  for (const o of overlays) {
    const at = mapTime(Number(o.atSec));
    if (at == null) continue;
    const until = mapTime(Number(o.untilSec));
    out.push({ ...o, atSec: at, untilSec: until == null ? Math.min(at + 3, a) : Math.min(until, a) });
  }
  return out;
}

export type CaptionStyle = "punch" | "clean";

/** Group word cues into caption pages (a page = one on-screen caption event). */
function paginate(cues: WordCue[], maxWords: number): WordCue[][] {
  const pages: WordCue[][] = [];
  let page: WordCue[] = [];
  for (const cue of cues) {
    const newSpeaker = page.length > 0 && page[page.length - 1].speaker !== cue.speaker;
    const gap = page.length > 0 && cue.start - page[page.length - 1].end > 0.6;
    if (page.length >= maxWords || newSpeaker || gap) {
      if (page.length) pages.push(page);
      page = [];
    }
    page.push(cue);
  }
  if (page.length) pages.push(page);
  return pages;
}

function assTime(sec: number): string {
  const cs = Math.max(0, Math.round(sec * 100));
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const c = cs % 100;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
}

function assEscape(text: string): string {
  return text.replace(/\\/g, "").replace(/[{}]/g, "").replace(/\n/g, " ");
}

/**
 * Render word cues as an ASS karaoke track (libass \kf fill). Two presets:
 *   punch — big bold bottom-center pages of ≤4 words, bitcoin-orange fill
 *   clean — bottom sentence captions, white fill, subtler
 * Both bands sit BELOW the fact-caption box (bottom of box ≈ y944 at 1080p).
 */
export function toAss(cues: WordCue[], style: CaptionStyle = "punch", playResX = 1920, playResY = 1080): string {
  // ASS colors are &HAABBGGRR. Bitcoin orange #F7931A → BGR 1A93F7.
  // MarginV keeps the glyph top below the fact-caption box (y≈944 @1080p):
  // punch 63px font needs MarginV ≤ 73 → 0.060*H = 65; clean 45px → 0.055*H.
  const styles =
    style === "punch"
      ? `Style: Karaoke,DejaVu Sans,${Math.round(playResY * 0.058)},&H001A93F7,&H00FFFFFF,&H00101010,&H96000000,-1,0,0,0,100,100,1,0,1,${Math.round(playResY * 0.0045)},0,2,60,60,${Math.round(playResY * 0.06)},1`
      : `Style: Karaoke,DejaVu Sans,${Math.round(playResY * 0.042)},&H00FFFFFF,&H00B9B9B9,&H00101010,&H96000000,-1,0,0,0,100,100,0,0,1,${Math.round(playResY * 0.0035)},0,2,60,60,${Math.round(playResY * 0.055)},1`;

  const pages = paginate(cues, style === "punch" ? MAX_WORDS_PER_PAGE : 9);
  const events = pages.map((page, pi) => {
    const start = page[0].start;
    // Never overlap the next page — libass stacks simultaneous events, which
    // flickers a second caption line at every mid-sentence page boundary.
    const nextStart = pages[pi + 1]?.[0]?.start ?? Infinity;
    const end = Math.min(page[page.length - 1].end + 0.08, nextStart);
    const body = page
      .map((cue) => `{\\kf${Math.max(1, Math.round((cue.end - cue.start) * 100))}}${assEscape(cue.word)}`)
      .join(" ");
    return `Dialogue: 0,${assTime(start)},${assTime(end)},Karaoke,,0,0,0,${body}`;
  });

  return [
    "[Script Info]",
    "ScriptType: v4.00+",
    `PlayResX: ${playResX}`,
    `PlayResY: ${playResY}`,
    "WrapStyle: 2",
    "ScaledBorderAndShadow: yes",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    styles,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Text",
    ...events,
    "",
  ].join("\n");
}

/** Word-grouped SRT (page-level) — richer than the line-level manifest sidecar. */
export function toWordSrt(cues: WordCue[]): string {
  const pages = paginate(cues, 7);
  const t = (sec: number) => {
    const ms = Math.max(0, Math.round(sec * 1000));
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const r = ms % 1000;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(r).padStart(3, "0")}`;
  };
  return pages
    .map((page, i) =>
      [String(i + 1), `${t(page[0].start)} --> ${t(page[page.length - 1].end)}`, page.map((c) => c.word).join(" "), ""].join("\n"),
    )
    .join("\n");
}

/** The renderable sequence order used at assembly (mirrors generate.ts's end-card filter). */
export function renderableSequences(screenplay: Screenplay, renderScriptedEndCard: boolean): Sequence[] {
  const all = [...(screenplay.sequences || [])].sort((a, b) => a.n - b.n);
  if (renderScriptedEndCard) return all;
  const isEndCard = (seq: Sequence) =>
    /end[_ -]?card/i.test(seq.label || "") || (seq.shots || []).some((shot) => shot.beat === "end_card");
  return all.filter((seq) => !isEndCard(seq));
}
