# Multi-Scene Video (Seedance 2.0)

How this repo uses `bytedance/seedance-2.0/image-to-video` to its full
capability set: multi-scene prompting (in-prompt cuts), start + end frame
control, native synced audio, 4-15s / `auto` durations, seeds, and chaining
beyond the 15s cap. The shared primitive is
`generateSceneSequence()` in `src/utils/falMedia.ts` (mirrored in the MineBTC
backend's `src/utils/falMedia.ts`).

## Why this beats the v1 mental model

The v1 workflow was one ~5s clip per shot, an ffmpeg stitch, and separate
stable-audio/TTS passes. Seedance 2.0 collapses that:

| v1 habit | 2.0 capability |
| --- | --- |
| 1 call per ~5s shot | 1 call per ≤15s SCENE-BLOCK with native in-prompt cuts |
| 1 keyframe per shot | 1 start frame per block (+1 optional end frame) — fewer keyframe generations |
| separate stable-audio SFX + mux | `generate_audio: true` — synced SFX/ambient/lip-sync, **no extra cost** |
| fixed duration | `"4".."15"` or `"auto"` (the model picks the natural runtime) |
| re-roll roulette | `seed` for reproducible takes |

Cuts are written directly into the prompt. fal's official example:
"…Cut scene to an octopus football game under the sea." Our compiled grammar
uses timestamped windows joined by the cut marker:

```
GLOBAL: <look / identity / sound block>
0.0-5.0s: <scene 1 direction>
5.0-8.0s — cut to — <scene 2 direction>
8.0-12.0s — cut to — <scene 3 direction>
```

## The primitive

```ts
import { generateSceneSequence } from "../src/utils/falMedia.js";

const { segments, master, totalSeconds } = await generateSceneSequence(
  [
    { direction: "the beast charges, aura swelling", refStartImage: preUrl, durationHint: 5 },
    { direction: "whiteout burst, silhouette readable inside the light", durationHint: 3 },
    { direction: "the evolved form lands its signature pose", refEndImage: evolvedUrl, durationHint: 4 },
  ],
  {
    totalDuration: 12,          // ≤15 → ONE call; >15 → auto-chained; or "auto"
    aspectRatio: "1:1",         // Seedance enum incl. 21:9
    resolution: "720p",         // 480p drafts / 720p / 1080p
    generateAudio: true,        // default FALSE — see audio policy below
    seed: 1234,                 // optional reproducible take
    globalDirection: "identity + look + SOUND block, stated once",
  },
);
```

- `scenes[0].refStartImage` is REQUIRED (i2v is start-frame anchored).
- `refEndImage` is honored on the scene that ENDS a call (one end frame per
  generation) — use it to land on exact canon (evolved art, product frame).
- `durationHint`s drive the cut timestamps; unhinted scenes split the leftover
  of `totalDuration` evenly.

### Chaining past 15s

Sequences longer than one generation are packed into ≤15s chunks. Call N+1's
`image_url` is the ffmpeg-extracted FINAL frame of call N's output (uploaded
to the assets bucket so fal can fetch it) — identity carries across the chain
because each call literally starts where the last one ended. A mid-sequence
scene with its own `refStartImage` always starts a fresh chunk: that is the
HARD-CUT escape hatch for style changes (e.g. cutting to product footage).
The result returns every segment plus a stitched master (`ffmpeg` required on
PATH only when chaining/stitching).

### When to use `"auto"` duration

Only for single-call sequences (≤15s, no mid-sequence re-anchors) where the
action has a natural length you don't want to dictate — one gag, one reveal,
one reaction. Never use `auto` for anything that must hit an editorial grid
(trailer blocks, ceremony windows, anything a score or VO is timed against):
you can't chain it and you can't cost it precisely up front.

## Audio policy

`generate_audio` is free on Seedance 2.0, but it is NOT always wanted:

- **Trailers / scored content → FALSE by default.** We score them at assembly;
  silent renders mix cleaner under music. The trailer production office marks
  each block (`Sequence.generateAudio`) — TRUE only where dialogue or a
  diegetic moment (gum pop, pickaxe ring) must be generated in-model.
- **Rituals / ceremonies → TRUE.** Synced impact SFX (the crack, the whiteout
  hit, the flare bloom) carry these moments and the sync is the whole point.

## Consumers

| Consumer | Shape |
| --- | --- |
| Evolution ceremony (`src/nft-pipeline/mutationContent.ts`) | ONE ~12s call: CHARGE/BURST/REVEAL as cuts, pre-evolution art = start frame, evolved art = end frame, `generateAudio: true`. Budget fallback: `NFT_CEREMONY_BUDGET_MODE=true` (or `budgetMode` per job) → legacy 3-keyframe chroma-strip APNG. |
| Lootbox ritual cinematic (`src/nft-pipeline/ritual.ts`) | Opt-in (`includeCinematic`): the staged acts become one generation with cuts; won beast's canon art = reveal end frame; `generateAudio: true`. |
| Trailer pipeline (`trailer/pipeline` + `trailer/generate/renderSequence.ts`) | The production-office pass plans scene-blocks ≤15s (breaks at location/time/cast/STYLE changes), per-block reference frames + per-block `generateAudio`; `TRAILER_VIDEO_SEED` pins takes. |
| Cycle summary (`src/nft-pipeline/cycleSummary.ts`) | Unchanged stitcher — now accepts MP4 ceremony clips alongside APNG strips. |

## Cost model (per-second)

Seedance 2.0 bills by generated seconds (resolution-dependent), so the unit of
spend is the SECOND, not the call. Conservative planning rates (env-overridable
in the backend's `contentCostModel.ts`):

| Resolution | $/s (planning) | 5s | 12s | 15s |
| --- | --- | --- | --- | --- |
| 480p | ~$0.07 | $0.35 | $0.84 | $1.05 |
| 720p | ~$0.13 | $0.65 | $1.56 | $1.95 |
| 1080p | ~$0.22 | $1.10 | $2.64 | $3.30 |

Fewer-longer calls don't change the per-second video bill much — the real
savings are upstream: one scene-block needs ONE start keyframe (≈$0.15 image
call) where three v1 shots needed three, native audio replaces stable-audio
SFX calls (≈$0.20 each), and there are fewer polls/uploads/stitch seams to
babysit. A 3-beat ceremony went from 3 keyframes + 1 strip + SFX to 1 video
call + 0-1 frames.

Draft cheap at 480p (`TRAILER_VIDEO_RES=480p`,
`NFT_CEREMONY_VIDEO_RESOLUTION=480p`), finalize at 720p/1080p.
