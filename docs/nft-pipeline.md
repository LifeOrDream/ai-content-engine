# NFT Asset Pipeline

The NFT asset pipeline turns HashBeast game events into collectible media: mint art, living-sprite state loops, mutation clips, and cycle recaps. It lives in `src/nft-pipeline/` and runs as the `nft.*` job kinds on the service worker (or by importing the functions directly).

The boundary follows [architecture.md](architecture.md): the engine generates media and hands artifacts to a storage port. The backend gates budget BEFORE enqueueing, persists results (DB rows, NFT metadata JSON, CDN invalidation), tracks per-cycle memory, and emits sockets — the engine never touches game state.

## Artifacts and the storage port

Every job returns `artifacts: NftArtifact[]`:

```ts
interface NftArtifact {
  kind: string;        // "full_body" | "dp" | "cinematic" | "mining" | "win" | "lose"
                       // | "power" | "transition" | "moment" | "dialogue_audio" | "cycle_summary"
  key: string;         // storage-relative key, e.g. "<storagePath>/dp.png"
  contentType: string;
  url?: string;        // set when the S3 store handled the bytes
  base64?: string;     // set in inline mode (no store configured)
  model?: string;      // generation provenance
  requestId?: string;
}
```

Persistence is a port (`ArtifactStore` in `src/nft-pipeline/artifacts.ts`):

- **S3 adapter** (`NFT_ARTIFACT_STORE=s3`, or auto when an assets bucket is configured): uploads under `hashbeast-assets/<key>` and returns the public CDN URL — the exact layout a game backend reads.
- **Inline** (`NFT_ARTIFACT_STORE=inline`, the no-keys default): returns base64 bytes in the job result so the caller persists them itself. Caveat: results travel through Redis — fine for images/APNGs, but configure a real store for production volume and for cycle-summary MP4s.

No bucket names, hostnames, or credentials are hardcoded; everything comes from `.env` (see `.env.example`).

## Job kinds

### 1. `nft.mint_assets` — mint art

DNA → prompt grammar → validated character art.

- **Input** (`NftMintAssetsInput`): `mint`, `dna` (256-bit hex), `factionId`, `categoryValue`, `regionValue`, optional `referenceImageUrl` (breed base-body style anchor), optional `includeCinematic`, optional `baseType` (`"canine"` default; `"primate" | "amphibian" | "feline"` for lootbox/rebirth beasts — strict-validated against `HASHBEAST_BASE_TYPE_ALLOWLIST`, see [base-types.md](base-types.md)).
- **Pipeline**: decode DNA → resolve faction × category × region × breed traits → build the full-body prompt from the faction grammar (`src/prompts/`) → generate `full_body.png` (3:4) style-locked to the breed reference → **Gemini identity gate** (posture / pixel style / facing direction) with up to `NFT_MINT_MAX_RETRIES` regens → generate `dp.png` (1:1) from the full body → Gemini same-character gate → optional `cinematic.png` PFP portrait (non-blocking).
- **Output** (`NftMintAssetsResult`): `storagePath` (`<faction>/<category>/<region>/<mint>`), artifacts, per-image validation summaries (attempts/passed/reason), and the exact prompt packet for reproducibility.
- **Progress**: emits `{ step, percent, message }` via BullMQ `job.updateProgress` (`generating_full_body` → `uploading` → `generating_dp` → … → `completed`) so the backend can drive its mint-progress UX.
- **References**: the breed base-body sprites are deployment assets. Pass `referenceImageUrl` per job, or configure `HASHBEAST_BASE_BODIES_DIR` / `HASHBEAST_BASE_BODIES_BASE_URL` (filenames in `BREED_BASE_BODIES`; non-canine base types resolve `basetypes/<baseType>/<breed>.png` under the same roots).

### 2. `nft.state_animations` — living-sprite state loops

The chroma-strip method, used for the website's per-NFT mining / win / lose loops.

- **Input** (`NftStateAnimationsInput`): `beast` (self-contained snapshot: mint, dna, canonical `assetUrls`, `storagePath`, personality, optional `baseType` — see [base-types.md](base-types.md)), optional `states` subset, optional `includePower` + `traitIndex`, optional `knownTechniques` (backend-owned debut memory), optional `arc` (emotional-arc directive, see below).
- **Output**: transparent looping APNG artifacts under `<storagePath>/animations/<state>.png` plus `produced[]`. With `includePower`, the result also carries `techniqueUsed { name, isDebut? }` — the named country × lane move the power clip rendered (`isDebut` only when `knownTechniques` was passed).

#### The chroma-strip APNG method

1. Ask the image model for ONE wide 16:9 image containing a horizontal strip of `HASHBEAST_ANIM_FRAMES` (default 5) keyframes of the SAME character on flat magenta (`#FF00FF`) — grounded on the beast's canonical full body + DP as reference images.
2. **Identity gate**: Gemini `validateSameCharacter` compares the strip to the DP; up to 2 attempts, otherwise the loop is skipped (best-effort, never fails the job).
3. **Deterministic assembly** (`scripts/assemble_anim.py`, called via `src/utils/animationAssembly.ts`): slice the strip into equal cells → flood-fill border-connected background of ANY color (robust even when the model ignores magenta) + kill stray magenta → drop edge-bleed blobs while keeping legit detached props (the dBTC block) → union-bbox tight crop for stable framing → place on a square canvas (default 512px, char fills ~94%) → save an optimized APNG with per-frame `disposal=BACKGROUND` + `blend=SOURCE` (frames replace, never accumulate) → optional boomerang for a seamless ping-pong loop.

Why APNG and not animated WebP: ffmpeg's libwebp encoder has no frame-disposal control, so transparent frames stack over each other. APNG disposal semantics make each frame cleanly replace the last.

Variety rules: mining actions are flavored per country (each faction has its own mining tool) and by wizard vs muggle (wizards mine with arcane energy, NO pickaxe); a compact personality directive (archetype / tone / motivation / catchphrase + optional owner block) drives the body language.

#### Stage-aware performance (progression grammar)

The beast's evolution stage (DNA `evolution` 0-7, snapshot fallback) selects a performance band from `src/world/progression.ts` — `pup` (0-1), `soldier` (2-3), `elite` (4-5), `ascendant` (6-7) — that rewrites the acting in every loop: a Pup wrestles a comically oversized tool and over-celebrates; an Ascended barely moves and barely acknowledges victory; losses scale puppy-despair → wounded-commander pride.

Power clips render the beast's **named country × lane technique** (`techniqueFor` in `src/world/progression.ts`, picked deterministically by faction × wizard/muggle × traitIndex). The technique NAME never enters image prompts (text-free rule) — only its visual grammar; the name travels in `techniqueUsed` on the job result.

#### Emotional arc (optional, higher stages only)

`arc: "starts dejected, spots the dBTC vein, ends determined"` threads a frame-by-frame emotional-arc directive into the strips — gated to stage >= 4 (`emotionalArcDirective`); silently ignored for lower-stage beasts.

### 3. `nft.mutation_content` — mutation event content

Per-event transition clip + voiced in-character dialogue line.

- **Input** (`NftMutationContentInput`): `beast`, `kind: "visual" | "power" | "evolution"`, optional `traitIndex`, `newTraitName`, `newStage`, `fromStage` (ceremony from-stage; defaults to `newStage - 1` / DNA stage), `previousLine` (dialogue continuity — cycle memory is backend-owned), `voiceId`, `gameState` (now the full typed `MomentContext` — streaks, rank deltas, roll vs threshold, rival id), `refreshAssets`, `regenerateStateLoops`, `knownTechniques` (debut memory), `budgetMode` (evolution: force the chroma-strip ceremony instead of the Seedance video).
- **Policy** (ported from production):
  - `visual` → transition + dialogue; canonical-art regen deferred to cycle end (`refreshAssets: true` opts into an immediate single-trait DP refresh, identity-gated).
  - `power` → transition + dialogue; the transition renders the beast's NAMED country × lane technique (visual grammar only — the name never enters image prompts); result carries `powerSlot` (1-5) and `techniqueUsed { name, isDebut? }`.
  - `evolution` → full regen FIRST (new full body anchored to the evolution-level base body + new DP, then fresh state loops) so the transition uses the evolved look, then transition + dialogue. The evolution transition is the **3-beat ceremony** — CHARGE (anticipation) → BURST (whiteout morph, identity-readable silhouette held inside the light) → REVEAL (signature pose + aura settle) — from `src/world/progression.ts`, with per-transition canon (The First Spark … The Ascension), stage aura escalation tokens, silhouette-change notes, and country aura flavor (USA gold ticker-ribbons, China jade rings, Russia frost pressure…). It renders as **ONE Seedance 2.0 multi-scene generation** (~12s MP4, `NFT_CEREMONY_VIDEO_SECS`/`_RESOLUTION`/`_ASPECT`): the three beats are in-prompt cuts, the PRE-evolution canonical art is the start frame, the evolved canonical art is the `end_image_url`, and `generate_audio` carries the synced whiteout impact — identity anchored by construction on both ends (see [video-scenes.md](video-scenes.md)). **Budget mode** (`budgetMode: true` per job or `NFT_CEREMONY_BUDGET_MODE=true`) — and any video failure — falls back to the legacy 3-keyframe chroma-strip APNG choreography, where the whole strip passes the Gemini identity gate.
- **Dialogue**: one ≤14-word trash-talk line written by the configured LLM with personality + game-state + previous-line continuity, then voiced with the shared per-(faction × breed × stage-band) MiniMax voice (TTS persisted through the artifact store as `dialogue_audio`). When `gameState.rivalFactionId` is one of the beast country's world-bible rivals, the prompt injects the canon rivalry edge so the line references the rivalry. If this job designed a NEW voice, the result includes `voiceProfile` — persist it backend-side (`setVoiceRegistry` can plug in a durable registry; MiniMax expires unused voice ids after ~7 days).
- **Output** (`NftMutationContentResult`): `transition`, `dialogue { line, soundId, audio? }`, `refreshedAssets`, `stateLoops`, `powerSlot`, `techniqueUsed`, plus the flat `artifacts[]`.

### 4. `nft.moment_content` — extended game-moment content

Dialogue (and optionally an identity-gated reaction clip) for the moment vocabulary beyond mutations: `first_win`, `win_streak` (n ≥ 3), `clutch_comeback`, `near_miss`, `humiliated_by_rival`, `revenge_win`, `mvp_coronation`, `chapter_cliffhanger`, `lootbox_near_miss`, `lootbox_jackpot` (plus the mutation-mapped `mutated`/`powered`/`evolved`). Grammar lives in `src/nft-pipeline/moments.ts` — every moment has a DISTINCT dialogue directive + body-language token set.

- **Input** (`NftMomentContentInput`): `beast`, optional explicit `moment`, `context` (typed `MomentContext`: `won`/`winType`, streak fields `winStreak`/`maxWinStreak`/`totalWins`, rank deltas `rankBefore`/`rankAfter`, lootbox `rollValue` vs `thresholdBps` — roll UNDER threshold wins, `rivalFactionId`/`lastLossToFactionId`, `isFinalRound`, `mvp`), `previousLine`, `voiceId`, `includeClip` (default false — the cheap dialogue-only path).
- **Derivation**: when `moment` is omitted, `deriveMoment(context)` picks the most dramatic applicable moment with deterministic precedence (lootbox outcomes > coronation > revenge > first win > streak > comeback > rival humiliation > near miss > cliffhanger). The job throws if nothing is derivable.
- **Field provenance**: the context fields map onto the game backend's `user:round_claim_settled` payload (`won`, `win_type`, `streak.current/max/total_wins`, `winning_faction_id`) and the `lootbox:roll_won/_missed` payloads (`roll_value`, `threshold_bps`). Rank deltas come from backend cycle memory.
- **Rivalry continuity** (C3): when `context.rivalFactionId` is a world-bible rival of the beast's country, the prompt injects the canon rivalry edge and the line must reference it; `previousLine` threads cycle continuity as usual.
- **Output** (`NftMomentContentResult`): `moment`, `dialogue { line, soundId, audio? }`, optional `clip` (looping APNG under `<storagePath>/gameplay/moment-<type>-<ts>.png`), `artifacts[]`.
- **Budget**: gate dispatch in the backend EXACTLY like `nft.mutation_content` (contentEconomics) — derivation is free, but dialogue costs an LLM+TTS call and `includeClip` costs an image generation.

### 5. `nft.cycle_summary` — per-beast cycle recap

- **Input** (`NftCycleSummaryInput`): `beast { mint, storagePath? }`, `warId`, and the cycle's transition `clips` in chronological order (the backend's cycle memory decides what belongs).
- **Pipeline**: each clip — APNG (chroma-strip transitions) or MP4 (Seedance ceremony videos) — is normalized with ffmpeg (`fps`/`scale`/`pad` to a square canvas on the console background) and concatenated into one `summary.mp4` (faststart). Per-segment failures are tolerated.
- **Output** (`NftCycleSummaryResult`): the `cycle_summary` artifact under `<storagePath>/cycles/<warId>/summary.mp4`, `clipCount`, `segmentsUsed`.

### 6. `nft.mint_intro` — the "joined the war" mint moment

One cheap identity-gated intro panel (the recruit arriving at its country's bible location, 1K, arcade-cel rung) plus one voiced intro line. Budget-gate dispatch exactly like `nft.mutation_content`. See [story-engine.md](story-engine.md).

### Story memory in job payloads

`nft.mutation_content`, `nft.moment_content`, and `nft.mint_intro` accept an optional `memory: BeastMemorySnapshot` — the backend-assembled per-beast story memory (epithets, technique debuts, rivalry ledger, recent lines, biggest moments). The contract, the epithet trigger rules, and the chapter job kinds (`chapter.write`, `chapter.canonize`) are documented in [story-engine.md](story-engine.md).

## Host requirements

| Tool | Needed by | Notes |
| --- | --- | --- |
| `python3` + Pillow + numpy + scipy | `scripts/assemble_anim.py` (state loops, transitions) | `pip install pillow numpy scipy`; override interpreter with `HASHBEAST_ANIM_PYTHON`, script path with `HASHBEAST_ANIM_ASSEMBLER` |
| `ffmpeg` | `nft.cycle_summary`; `generateSceneSequence` chaining/stitching (>15s sequences) | must be on PATH |
| fal.ai key | all generation | `FAL_API_KEY` |
| Gemini key | identity gates | `GEMINI_KEY` (optional — gates soft-accept without it) |

## What stays in the game backend

- Queue enqueue, idempotency keys, retry/DLQ policy, and the economics/budget gate that decides whether a job is dispatched at all.
- DDB persistence (`asset_urls`, animation URLs, cycle-history rows) and Metaplex metadata JSON rewrites + CDN invalidation.
- Socket emission (`hashbeast:mint_progress`, `hashbeast:update_ready`, `hashbeast:gameplay_animation`, `hashbeast:cycle_summary`) — map them from job progress/results.
- Redis per-cycle clip memory and durable voice-id storage.
- Telegram/social notifications.

## Direct use (no queue)

Everything is exported from the package root:

```ts
import {
  generateMintAssets,
  generateStateAnimations,
  generateMutationContent,
  generateMomentContent,
  generateCycleSummary,
  InlineArtifactStore,
} from "@lifeordream/ai-content-engine";

const result = await generateMintAssets(
  { mint, dna, factionId, categoryValue, regionValue, referenceImageUrl },
  { store: new InlineArtifactStore(), onProgress: console.log },
);
```
