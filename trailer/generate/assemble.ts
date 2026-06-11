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
import { concat, mixMusicBed, loudnormalize, W, H } from "./ffmpeg.js";
import { brandVideo } from "../../src/utils/videoBrand.js";
import { buildEndCardClip } from "../../src/services/showrunner/endCard.service.js";

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
