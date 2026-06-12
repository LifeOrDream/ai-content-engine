---
id: 06-the-other-moonshot
title: THE OTHER MOONSHOT
genre: story
aspect: 9:16
targetSeconds: 42
minSeconds: 42
countdown: 00:00:00
cta: minebtc.fun · JULY 10
logline: A dead-straight aerospace launch film cracks open — the astronaut is the Korea Jindo, the fuel is being mined by twelve dog nations, and the text card says it plainly — SpaceX IPO'd the rocket; we're IPO-ing the fuel.
cast: Korea Jindo (real game character), USA Golden Retriever (real game character), twelve country beasts
---

# Blueprint 06 — THE OTHER MOONSHOT (founder-approved, LOCKED)

The founder signed off this script VERBATIM. This blueprint is NOT rough story
clay for the writers-room passes — it is the locked shot list the production
renders exactly as written. No rewrites, no line doctoring, no alternate hooks.

## APPROVED SCRIPT (verbatim — these exact words, no rewrites)

- 0:00-0:05 black -> launch gantry in fog, strobes, dead-straight aerospace look. Mission control VO (calm, procedural): "T-minus ten."
- 0:05-0:10 slow push on the rocket, low rumble building. Control VO: "Flight, we are go for the moonshot."
- 0:10-0:15 astronaut helmet fills frame, orange bitcoin sun reflected in visor; visor clears: it is the KOREA JINDO (real game character), chewing gum, gum pop. No line — the pop is the joke.
- 0:15-0:20 smash cut: twelve country beasts mining in a frenzy, raw dBTC becoming glowing fuel cells loaded toward the pad. Control VO: "Fuel status?" USA shiba, mid-swing, not looking up: "Mining it."
- 0:20-0:25 beasts gathered under a giant stock ticker; music cuts to silence. Composited text card (use the real text/end-card machinery, NOT generated-in-image text): "SPACEX IPO'D THE ROCKET." (beat) "WE'RE IPO-ING THE FUEL."
- 0:25-0:33 rapid game montage: arena board, 60s countdown, win FX, evolution burst — REAL PRODUCT FOOTAGE preferred: capture screen recordings/screenshots from the live frontend (npm run dev in mdogeWifBtcFE with the dummy FX harness in hooks/config.ts flipped on for capture, ALWAYS reverted after; or use generated keyframes of the real UI as fallback). VO, plain speech, fast: "Pick your country. Bet SOL. Sixty seconds a round. Win, your beast mines degenBTC — and the war writes a show with your character in it." Captions mirror the beats.
- 0:33-0:38 the rocket lifts; one beast watches from the dig site, then goes back to swinging. VO, dry: "Ten years of 'to the moon.' Somebody had to build the dogs."
- 0:38-0:42 end card, single pickaxe strike ringing like a bell: minebtc.fun · JULY 10 + the Hashiden mark (mdogeWifBtcFE/public/assets/brand/hashiden/hashiden-mark.webp).

## CASTING CORRECTIONS LOCKED BY THE APPROVED SCRIPT

- The astronaut is the KOREA JINDO — the real game character from the live
  southkorea GIF — not Rex, not any cast-sheet character. No line; the gum pop
  is the joke.
- "USA shiba" is a script direction; it RENDERS as the real USA game character
  (golden retriever). NO generic shibas — off-model renders get regenerated.
- The SpaceX/IPO beat is a COMPOSITED TEXT CARD over silence, not spoken
  dialogue.
- The 0:25-0:33 explainer is spoken VO, plain speech, fast — the mechanic words
  ("Pick your country. Bet SOL. Sixty seconds a round...") are the approved VO,
  with captions mirroring the beats.
- The closer VO is: "Ten years of 'to the moon.' Somebody had to build the
  dogs."

## NON-NEGOTIABLE GROUNDING (founder, standing)

Every character keyframe is generated via nano-banana-2/edit WITH real
reference images, checked into `trailer/reference/moonshot/`:

- `asset:moonshot/chars/{southkorea,usa,japan,china,russia,india,uk,brazil,iran,israel,northkorea,france}.png`
  — clean frames extracted from the live game character GIFs at
  `https://assets.minebtc.fun/frontend/gameAssets/chars/<country>.gif?v=2`.
- `asset:moonshot/minted/hashbeast1_usa_golden_retriever.png` and
  `asset:moonshot/minted/hashbeast3_southkorea_white_jindo.png` — the real
  minted portraits resolved from
  `https://assets.minebtc.fun/hashbeasts/3RcBXFng5minophzhYdMNNaePnpdDCpq1hAHRYwnihs3.json`
  and `…/6Gy8SGiFLnGGu8HiH19FC5kTWa9DueZ6K4Fm8RXuiuj6.json` -> `.image`
  (byte-verified against the live CDN).

Hard rules:
- NO generic shibas — off-model renders get regenerated.
- No flags as clothing (planted flags fine).
- No readable text inside GENERATED frames — composited text via the branding
  utilities only. The rocket is a generic commercial launch vehicle, no livery,
  no real logos or wordmarks in any frame.
- FAL key stays in env — never printed.

## PIPELINE (locked)

keyframes (nano-banana-2/edit, refs attached) -> Seedance i2v per shot (5s
shots, 720p, 9:16 master; 16:9 second pass ONLY if budget remains) -> VO via
the MiniMax TTS path (calm procedural mission-control voice for control lines;
dry gravelly for the shiba line + closer; if TTS keys absent, ship with music +
captions and FLAG that VO needs a take) -> music via stable-audio (cinematic
launch suspense 0:00-0:20, hard cut to silence 0:20-0:25, electric arcade
0:25-0:38, single bell-strike 0:38) -> stitch + brand + end card via the
existing ffmpeg/videoBrand/endCard utilities. BUDGET CAP: ~$20 fal total;
prefer reusing keyframes across adjacent shots.

Production runner: `npx tsx trailer/generate/moonshot.ts` (resumable; artifacts
cache under `trailer/out/06-the-other-moonshot/`, outputs gitignored as usual).
