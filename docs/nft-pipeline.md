# NFT Asset Pipeline

The NFT asset pipeline turns HashBeast game events into collectible media: mint art, living-sprite state loops, mutation clips, and cycle recaps. It lives in `src/nft-pipeline/` and runs as the `nft.*` job kinds on the service worker (or by importing the functions directly).

The boundary follows [architecture.md](architecture.md): the engine generates media and hands artifacts to a storage port. The backend gates budget BEFORE enqueueing, persists results (DB rows, NFT metadata JSON, CDN invalidation), tracks per-cycle memory, and emits sockets — the engine never touches game state.

## Artifacts and the storage port

Every job returns `artifacts: NftArtifact[]`:

```ts
interface NftArtifact {
  kind: string;        // "full_body" | "dp" | "cinematic" | "mining" | "win" | "lose"
                       // | "power" | "transition" | "dialogue_audio" | "cycle_summary"
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

- **Input** (`NftMintAssetsInput`): `mint`, `dna` (256-bit hex), `factionId`, `categoryValue`, `regionValue`, optional `referenceImageUrl` (breed base-body style anchor), optional `includeCinematic`.
- **Pipeline**: decode DNA → resolve faction × category × region × breed traits → build the full-body prompt from the faction grammar (`src/prompts/`) → generate `full_body.png` (3:4) style-locked to the breed reference → **Gemini identity gate** (posture / pixel style / facing direction) with up to `NFT_MINT_MAX_RETRIES` regens → generate `dp.png` (1:1) from the full body → Gemini same-character gate → optional `cinematic.png` PFP portrait (non-blocking).
- **Output** (`NftMintAssetsResult`): `storagePath` (`<faction>/<category>/<region>/<mint>`), artifacts, per-image validation summaries (attempts/passed/reason), and the exact prompt packet for reproducibility.
- **Progress**: emits `{ step, percent, message }` via BullMQ `job.updateProgress` (`generating_full_body` → `uploading` → `generating_dp` → … → `completed`) so the backend can drive its mint-progress UX.
- **References**: the breed base-body sprites are deployment assets. Pass `referenceImageUrl` per job, or configure `HASHBEAST_BASE_BODIES_DIR` / `HASHBEAST_BASE_BODIES_BASE_URL` (filenames in `BREED_BASE_BODIES`).

### 2. `nft.state_animations` — living-sprite state loops

The chroma-strip method, used for the website's per-NFT mining / win / lose loops.

- **Input** (`NftStateAnimationsInput`): `beast` (self-contained snapshot: mint, dna, canonical `assetUrls`, `storagePath`, personality), optional `states` subset, optional `includePower` + `traitIndex`.
- **Output**: transparent looping APNG artifacts under `<storagePath>/animations/<state>.png` plus `produced[]`.

#### The chroma-strip APNG method

1. Ask the image model for ONE wide 16:9 image containing a horizontal strip of `HASHBEAST_ANIM_FRAMES` (default 5) keyframes of the SAME character on flat magenta (`#FF00FF`) — grounded on the beast's canonical full body + DP as reference images.
2. **Identity gate**: Gemini `validateSameCharacter` compares the strip to the DP; up to 2 attempts, otherwise the loop is skipped (best-effort, never fails the job).
3. **Deterministic assembly** (`scripts/assemble_anim.py`, called via `src/utils/animationAssembly.ts`): slice the strip into equal cells → flood-fill border-connected background of ANY color (robust even when the model ignores magenta) + kill stray magenta → drop edge-bleed blobs while keeping legit detached props (the ore block) → union-bbox tight crop for stable framing → place on a square canvas (default 512px, char fills ~94%) → save an optimized APNG with per-frame `disposal=BACKGROUND` + `blend=SOURCE` (frames replace, never accumulate) → optional boomerang for a seamless ping-pong loop.

Why APNG and not animated WebP: ffmpeg's libwebp encoder has no frame-disposal control, so transparent frames stack over each other. APNG disposal semantics make each frame cleanly replace the last.

Variety rules: mining actions are flavored per country (each faction has its own mining tool) and by wizard vs muggle (wizards mine with arcane energy, NO pickaxe); a compact personality directive (archetype / tone / motivation / catchphrase + optional owner block) drives the body language.

### 3. `nft.mutation_content` — mutation event content

Per-event transition clip + voiced in-character dialogue line.

- **Input** (`NftMutationContentInput`): `beast`, `kind: "visual" | "power" | "evolution"`, optional `traitIndex`, `newTraitName`, `newStage`, `previousLine` (dialogue continuity — cycle memory is backend-owned), `voiceId`, `gameState`, `refreshAssets`, `regenerateStateLoops`.
- **Policy** (ported from production):
  - `visual` → transition + dialogue; canonical-art regen deferred to cycle end (`refreshAssets: true` opts into an immediate single-trait DP refresh, identity-gated).
  - `power` → transition + dialogue; result carries `powerSlot` (1-5) so the caller stores the clip per slot.
  - `evolution` → full regen FIRST (new full body anchored to the evolution-level base body + new DP, then fresh state loops) so the transition uses the evolved look, then transition + dialogue.
- **Dialogue**: one ≤14-word trash-talk line written by the configured LLM with personality + game-state + previous-line continuity, then voiced with the shared per-(faction × breed × stage-band) MiniMax voice (TTS persisted through the artifact store as `dialogue_audio`). If this job designed a NEW voice, the result includes `voiceProfile` — persist it backend-side (`setVoiceRegistry` can plug in a durable registry; MiniMax expires unused voice ids after ~7 days).
- **Output** (`NftMutationContentResult`): `transition`, `dialogue { line, soundId, audio? }`, `refreshedAssets`, `stateLoops`, `powerSlot`, plus the flat `artifacts[]`.

### 4. `nft.cycle_summary` — per-beast cycle recap

- **Input** (`NftCycleSummaryInput`): `beast { mint, storagePath? }`, `warId`, and the cycle's transition `clips` in chronological order (the backend's cycle memory decides what belongs).
- **Pipeline**: each APNG clip is normalized with ffmpeg (`fps`/`scale`/`pad` to a square canvas on the console background) and concatenated into one `summary.mp4` (faststart). Per-segment failures are tolerated.
- **Output** (`NftCycleSummaryResult`): the `cycle_summary` artifact under `<storagePath>/cycles/<warId>/summary.mp4`, `clipCount`, `segmentsUsed`.

## Host requirements

| Tool | Needed by | Notes |
| --- | --- | --- |
| `python3` + Pillow + numpy + scipy | `scripts/assemble_anim.py` (state loops, transitions) | `pip install pillow numpy scipy`; override interpreter with `HASHBEAST_ANIM_PYTHON`, script path with `HASHBEAST_ANIM_ASSEMBLER` |
| `ffmpeg` | `nft.cycle_summary` | must be on PATH |
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
  generateCycleSummary,
  InlineArtifactStore,
} from "@lifeordream/ai-content-engine";

const result = await generateMintAssets(
  { mint, dna, factionId, categoryValue, regionValue, referenceImageUrl },
  { store: new InlineArtifactStore(), onProgress: console.log },
);
```
