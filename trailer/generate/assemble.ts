/**
 * Assemble the finished scene clips into the final trailer:
 *   concat scenes → mix music bed under → brand badge → append the approved CTA
 *   end-card (with the video's countdown burned on) → final.mp4.
 *
 * Reuses the backend's brandVideo + buildEndCardClip (which itself reuses the
 * approved CONTENT_ENDCARD_URL). Best-effort: any optional step that fails is
 * skipped, never fatal.
 */
import "dotenv/config";
import { concat, mixMusicBed, loudnormalize, probeDuration, replaceAudio, trimClip, W, H } from "./ffmpeg.js";
import { brandVideo } from "../../src/utils/videoBrand.js";
import { buildEndCardClip } from "../../src/services/showrunner/endCard.service.js";
import type { MusicTrack } from "./musicTrack.js";

const MUSIC_VOL = Number(process.env.TRAILER_MUSIC_VOLUME || 0.16);
const BRAND = process.env.TRAILER_BRAND !== "false";
const END_CARD = process.env.TRAILER_END_CARD !== "false";
const LOUDNORM = process.env.TRAILER_LOUDNORM !== "false";

export async function assembleTrailer(
  scenes: Buffer[],
  opts: { countdown: string; musicBed?: Buffer | null; appendEndCard?: boolean; endCardSeconds?: number },
): Promise<Buffer | null> {
  const clips = scenes.filter((b) => b && b.length > 0);
  if (clips.length === 0) return null;

  // 1. append the CTA end-card (with this video's countdown) as the last "scene"
  if (END_CARD && opts.appendEndCard !== false) {
    try {
      const countdown = opts.countdown && opts.countdown !== "00:00:00" ? opts.countdown : "";
      const endCard = await buildEndCardClip(W, H, null, countdown
        ? { cta1: "THE MINING BEGINS IN", cta2: countdown, cta3: "MINEBTC.FUN", seconds: opts.endCardSeconds }
        : { seconds: opts.endCardSeconds });
      if (endCard) {
        clips.push(endCard);
      }
    } catch { /* ship without it */ }
  }

  // 2. concat everything
  let master = await concat(clips);

  // 3. music bed under the whole thing (ducked) — resolved once by the caller
  try {
    if (opts.musicBed) master = await mixMusicBed(master, opts.musicBed, MUSIC_VOL);
  } catch { /* no bed */ }

  // 4. brand badge (top-center, clear of UI safe zone)
  if (BRAND) {
    try { master = await brandVideo(master); } catch { /* keep unbranded */ }
  }

  // 5. loudness normalize to streaming target (-14 LUFS) — quiet videos die in feeds
  if (LOUDNORM) {
    try { master = await loudnormalize(master); } catch { /* ship un-normalized */ }
  }

  return master;
}

/**
 * TRACK-FIRST assembly (anthem / vibe-edit genres): the song leads, the cuts
 * follow. Each clip is trimmed so its cut lands ON a beat of the track's beat
 * grid, the native audio is replaced wholesale by the track, then end card /
 * brand / loudnorm as usual. Returns the master plus each clip's TRIMMED
 * duration so the caption layer can time itself to the real cuts.
 */
export async function assembleTrackFirst(
  clips: Buffer[],
  track: MusicTrack,
  opts: { countdown: string; appendEndCard?: boolean; endCardSeconds?: number },
): Promise<{ master: Buffer; clipSeconds: number[] } | null> {
  const usable = clips.filter((b) => b && b.length > 0);
  if (usable.length === 0 || !track?.buffer?.length) return null;
  const beats = track.beats.filter((b) => b > 0.2);
  if (beats.length < 4) return null;

  // Choose cut points: spread the clips across the track so cuts land on
  // beats. Per clip, snap its natural length DOWN to the nearest beat
  // boundary relative to the running timeline (min 0.8s per clip).
  const trimmed: Buffer[] = [];
  const clipSeconds: number[] = [];
  let timeline = 0;
  for (const clip of usable) {
    const natural = (await probeDuration(clip)) || 4;
    const targetEnd = timeline + natural;
    // largest beat ≤ targetEnd that leaves ≥0.8s for this clip
    let cut = targetEnd;
    for (let i = beats.length - 1; i >= 0; i--) {
      if (beats[i] <= targetEnd + 0.04 && beats[i] - timeline >= 0.8) { cut = beats[i]; break; }
    }
    const dur = Math.max(0.8, cut - timeline);
    try {
      trimmed.push(Math.abs(dur - natural) < 0.05 ? clip : await trimClip(clip, dur));
      clipSeconds.push(Math.min(dur, natural));
    } catch {
      trimmed.push(clip);
      clipSeconds.push(natural);
    }
    timeline += clipSeconds[clipSeconds.length - 1];
  }

  let master = await concat(trimmed);
  try { master = await replaceAudio(master, track.buffer); } catch { /* keep native audio */ }

  // end card rides AFTER the beat-cut body (its own silence under the brand)
  if (END_CARD && opts.appendEndCard !== false) {
    try {
      const countdown = opts.countdown && opts.countdown !== "00:00:00" ? opts.countdown : "";
      const endCard = await buildEndCardClip(W, H, null, countdown
        ? { cta1: "THE MINING BEGINS IN", cta2: countdown, cta3: "MINEBTC.FUN", seconds: opts.endCardSeconds }
        : { seconds: opts.endCardSeconds });
      if (endCard) master = await concat([master, endCard]);
    } catch { /* ship without it */ }
  }
  if (BRAND) {
    try { master = await brandVideo(master); } catch { /* keep unbranded */ }
  }
  if (LOUDNORM) {
    try { master = await loudnormalize(master); } catch { /* ship un-normalized */ }
  }
  return { master, clipSeconds };
}
