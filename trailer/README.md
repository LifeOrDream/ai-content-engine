# Trailer Script Pipeline (testbed)

A multi-pass **screenplay + sequence generator** for the degenBTC launch trailers. Turns a rough story blueprint into a production-ready Seedance package: locked story/dialogue, director annotations, timeline prompts, start/end frame plans, country reference assets, and draft canon metadata.

This is a **standalone testbed** (run with `tsx`) and is included in repo typecheck/build so contributor changes fail fast. The point: dial in script quality + scene shape here, then promote the multi-pass approach into the service worker and backend adapters.

## Why phased (and how v2 collapsed 6 calls into 2)

One prompt asking for "a crypto trailer script" reaches for the most statistically *trailer-ish* phrases → on-the-nose, pitch-deck dialogue. Good scripts are *layered*: structure, then intent, then words, then subtext, then the audio/visual split. v1 made each layer its own LLM call (6 calls); v2 keeps every layer as an **explicit internal phase** inside two Opus-4.8 calls — same craft, ~3x fewer calls, and fewer full-document round trips to lose keeper lines in. A deterministic lint still checks every promise after each call, and a targeted **self-heal** call fixes violations without re-running the pipeline (worst case 3-4 calls; normal case 2).

## The 2 passes (`pipeline/passes.ts`)

| # | Pass | Job |
|---|---|---|
| 1 | **script** | THE WRITERS ROOM — internal phases: dopamine-ladder beat sheet (LOOP bookkeeping) → intent + dialogue in cast voices with internal auditions → line-doctor polish (subtext, spoken-time, table-read, screen/mouth split). Outputs the LOCKED script + 3 hook / 3 cliffhanger CANDIDATES + the OVERLAYS plan (bait/CTA text track). Genre-aware (`genre:` frontmatter — story / skit / faceoff / lore / recap / anthem / edit / loop; see `style/genres.ts`). |
| 2 | **produce** | THE PRODUCTION OFFICE — directs the locked script into ≤15s Seedance sequences (timing math, plain film English, signature moments), compiles each into a Seedance 2.0 timeline prompt, AND plans every start/end frame + the video-wide LOOK + the poster rule (seq 1's start frame doubles as the thumbnail) — one strict `scenes.json`. Dialogue is carried VERBATIM (machine-checked). |

Every run injects the series bible, cinematic production grammar, country reference asset registry, country character registry, country location/storyboard registry, and canonized showrunner memory packet. Drafts can propose continuity changes, but only `canonize.ts` applies them after posting.

## Layout

```
trailer/
  blueprints/
    00-series-bible.md      ← canon + cast VOICE PROFILES + craft + style (injected into every pass)
    01..07-*.md             ← the 7 launch videos as ROUGH story clay (beats + intent + grounding seeds)
  pipeline/
    types.ts                ← Blueprint / Shot / Screenplay types
    llm.ts                  ← model-swappable LLM caller (default anthropic/claude-opus-4.8 via fal; TRAILER_LLM_MODEL to change)
    passes.ts               ← the 2 passes (the craft IP)
    run.ts                  ← CLI runner
    canonize.ts             ← post-publish canon memory update
  world/
    assetRegistry.ts        ← country/reference board refs for frame generation
    countryCastRegistry.ts  ← 48 country-grounded fictional character profiles + engagement loops
    locationRegistry.ts     ← 36 country-grounded storyboard/location cards + micro-details
    storyMemory.ts          ← post-gated story memory + arc tracking
    story-memory.json       ← canon memory applied only after a posted video is canonized
  out/<id>/
    01-script.md, 02-produce.md
    scenes.json             ← FINAL Seedance-ready sequence list
    canon-draft.json        ← draft-only continuity proposal
    run-manifest.json       ← stage timeline, refs, artifacts, cost estimate, FAL request IDs
    subtitles.srt/.vtt      ← YouTube/WebVTT subtitle exports
    subtitles.ass/.words.srt← word-timed karaoke caption track (burned onto final_captioned.mp4)
```

## Run

```bash
# both passes for one video (2 LLM calls)
npx tsx trailer/pipeline/run.ts 01

# re-run just the production office after hand-editing 01-script.md
npx tsx trailer/pipeline/run.ts 01 --only produce

# choose model/provider (default: anthropic/claude-opus-4.8 via fal)
TRAILER_LLM_MODEL=anthropic/claude-sonnet-4.6 npx tsx trailer/pipeline/run.ts 01
TRAILER_LLM_PROVIDER=gemini TRAILER_LLM_MODEL=gemini-2.5-pro npx tsx trailer/pipeline/run.ts 01
```

Each pass writes `out/<id>/NN-<pass>.md` so you can read the script get better stage by stage and **finalize by hand** at any point (edit a `NN-*.md`, then `--from N+1` to continue from your edit). The final `scenes.json` is the Seedance-ready shot list.

Each run also updates `out/<id>/run-manifest.json`. The manifest records pass stages, generated subtitle exports, reference assets, rough cost estimates, generated frame/video artifacts, and FAL request IDs once renders begin. This is the audit trail the WebUI reads.

## The 7 launch videos (countdown-driven)

01 Bitcoin is dying (24h) → 02 America always wins (18h) → 03 War room (12h) → 04 Will you remember us (6h) → 05 Counted us out (3h) → 06 Whose side are you on (0:30) → 07 It's live (0:00).

## Generate the video (`generate/`)

Renders a `scenes.json` into the final trailer. Current mode is **sequence mode**: each sequence generates a reference-anchored start frame, optional end frame, one Seedance timeline clip with native cuts/audio, timed caption overlays, and normalized 16:9 output.

```bash
# full auto: render every scene, then assemble out/<id>/final.mp4
npx tsx trailer/generate/run.ts 01

# scene-by-scene with approval (pushes each scene to Telegram, waits for you)
npx tsx trailer/generate/run.ts 01 --approve --tg

npx tsx trailer/generate/run.ts 01 --from 3       # resume from scene 3
npx tsx trailer/generate/run.ts 01 --only 5 --regen   # re-render just scene 5
npx tsx trailer/generate/run.ts 01 --only 5 --regen --no-assemble   # cheapest one-clip iteration
```

The **boolean** you asked for: `--approve` (or `TRAILER_APPROVE_PER_SCENE=true`) → after each sequence it waits on `[enter]=approve · r=regenerate · s=stop`; without it, it renders all sequences and assembles the full video. Either way sequences are saved to `out/<id>/sequences/seq_NN.mp4` (resumable — a re-run reuses existing clips unless `--regen` is passed).

The local WebUI (`npm run webui`) exposes the same commands with two job modes: script passes and production render. Use “Only sequence” for cheap clip-by-clip review, then full render + assemble once the frames/dialogue are approved.

## Canonize after posting

Drafts do not update story memory. After a video is actually posted, canonize it:

```bash
npx tsx trailer/pipeline/canonize.ts 01 --platform x --url https://x.com/... --video-no 1
```

This updates `trailer/world/story-memory.json`, including recent canon videos, active arcs, character last-seen state, and the memory packet injected into future script runs.

**Module map:**
| File | Job |
|---|---|
| `generate/cast.ts` | The recurring characters (Rex/Long/…). Builds each ONCE: a locked **reference image** (generated by editing a real game showcase beast → stays on-model) + a **designed voice** → cached in `trailer/cast/`. |
| `generate/renderScene.ts` | One scene → complete clip: cast-grounded keyframe (nano-banana) → Seedance i2v → per-character voiced dialogue → **lip-sync** (hero close-ups) or mux → SFX → 1080p + burned caption. No-character shots → mood-tinted plate. |
| `generate/audio.ts` | Per-character TTS (each character's voice), SFX + music-bed resolution (pluggable source). |
| `generate/assemble.ts` | Concat scenes → music bed (ducked) → brand badge → approved CTA end-card + countdown → `final.mp4`. |
| `generate/generate.ts` | Orchestrator (per-scene loop, approval gate, resume) · `run.ts` CLI · `ffmpeg.ts` helpers. |

**Grounding:** character shots are generated by **editing the cast's locked reference images** (so every beast is consistent + on-model across shots and videos). Reuses the backend's fal helpers + `brandVideo` + the approved end-card — i.e. this testbed's render path is the same code the automated pipeline will use.

**One-time setup** the first run does automatically: generates the 6 character reference sheets + designs their voices (cached, ~$4 total, reused forever).

**Quality knobs (env):** `TRAILER_VIDEO_RES` (1080p|720p) · `TRAILER_IMAGE_RES` (2K|1K) · `TRAILER_LIPSYNC` (false to disable) · `TRAILER_MUSIC_URL` (the bed) · drop SFX files in `trailer/assets/sfx/`.

> Per-video cost ≈ $11–13 (1080p + lip-sync), ~$16–18 with regen iteration; full 7-video series ≈ $120–140. Flows through the same fal key as the backend.
