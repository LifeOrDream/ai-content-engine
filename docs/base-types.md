# Base Types — the body-plan layer above breed ("forms are fluid")

The Mining Wars grammar historically hardcoded one body plan: the anthropomorphic bipedal dog (12 countries × 4 canine breeds = 48 breeds). Phase E introduces a **base-type layer above breed** in `src/world/baseTypes.ts`:

| Base type | Status | Movement grammar | Voice timbre |
| --- | --- | --- | --- |
| `canine` | **Genesis default** — every existing beast | Pack-fighter: planted stances, charging sprints, tail/ear signals | unchanged (legacy) |
| `primate` | Lootbox/rebirth only | Climb-and-swing: brachiation arcs, knuckle-walk lopes, vertical takeoffs, one-arm hangs | hooting/chattering, chest-thump emphasis |
| `amphibian` | Lootbox/rebirth only | Springy low-slung: coiled crouches, long-jump launches, sticky-pad wall clings | croaky resonance, ribbit undertones |
| `feline` | Lootbox/rebirth only | Silent-precision: low stalks, coiled stillness, explosive pounces, soundless landings | sly purr, sharp hiss on insults |

Each non-canine base type carries:

- **Silhouette language** — injected into image prompts so the body plan reads instantly ("arms visibly longer than legs", "powerful coiled haunches", "digitigrade soft-paw stance"). Amphibians remap fur-color traits to skin tone/pattern.
- **Movement grammar** — injected into animation strips and transition prompts (`baseTypeMotionDirective`).
- **Voice timbre modifier** — appended to MiniMax voice-design prompts (`buildVoiceDesignPrompt`). Non-canine voices get their own keyspace (`<baseType>:<faction>:<breed>:<band>`); canine keys keep the legacy format so no existing voice re-designs.
- **Per-country skinning rules** — 12 entries per base type. The country style from the world bible modulates the base type: a Brazil primate (carnival blaze, capoeira-flow swings) reads nothing like a Japan primate (onsen-macaque calm, tech-ronin layers). Hard canon holds at every base type: **never flags as clothing** — national identity via costume style + palette only; no readable text in images.
- **A starter breed pack** — 4 breeds, indexed by the same DNA breed bits (0-3) canine uses:
  - primate: Macaque, Capuchin, Gibbon, Gorilla
  - amphibian: Tree Frog, Bullfrog, Axolotl, Toad
  - feline: Shadow Cat, Siamese, Maine Coon, Sand Cat

  Canine keeps the full 48-breed per-country registry (`src/prompts/breeds.prompts.ts`). Breed resolution is unified through `getBreedForBaseType(baseType, factionId, breedValue)`.

## Gating: who gets a non-canine form

**Availability is a game-economy gate, not an engine feature.** Genesis HashBeasts are canine. Non-canine base types enter the game only through the **lootbox / rebirth path** — the backend decides which beast earned which form and simply passes it in job inputs:

- `nft.mint_assets` input gains `baseType?: string` (default `"canine"`). Validation is **strict**: unknown values or values outside the deployment allowlist **throw**, so a backend bug can never silently mint the wrong body plan.
- Beast snapshots (`NftBeastInput` — used by `nft.state_animations`, `nft.mutation_content`, `nft.moment_content`, `nft.mint_intro`, asset refresh) gain `baseType?: string`. Validation is **best-effort** (`safeBaseType`): junk falls back to canine — a bad snapshot field never kills a content job for an existing beast.
- The deployment allowlist is env-controlled: `HASHBEAST_BASE_TYPE_ALLOWLIST` (comma-separated; default `canine,primate,amphibian,feline`). A deployment that has not shipped the lootbox/rebirth path runs `HASHBEAST_BASE_TYPE_ALLOWLIST=canine`. Canine is always allowed.

**Budget**: `baseType` adds **zero new job kinds and zero extra generations** — it only changes prompt content of existing jobs, so the existing contentEconomics budget gates apply unchanged. Gate dispatch exactly as before.

## Identity gates are base-type aware

Every character render keeps its Gemini identity gate, and every gate prompt now states the body plan:

- Mint gates (`src/nft-pipeline/identity.ts` → `comparisonPrompt(type, baseType)`): non-canine gates add an explicit check — "IMAGE 2 clearly reads as a *cat / primate / frog-like amphibian* — if it reads as a dog instead, answer NO". This pushes back against the model's dog prior from the legacy grammar.
- Animation/panel/refresh gates (`validateSameCharacter(ref, cand, { characterNoun })` in `src/utils/falMedia.ts`): callers pass the beast's base-type noun so "same character" also means "same kind of creature".

## Reference base bodies

Canine mint references keep the legacy layout (`BREED_BASE_BODIES`, per-country files). Non-canine breeds resolve `basetypes/<baseType>/<breed>.png` (e.g. `basetypes/feline/shadow_cat.png`) under the same `HASHBEAST_BASE_BODIES_DIR` / `HASHBEAST_BASE_BODIES_BASE_URL` roots, or pass `referenceImageUrl` per job. Evolution-level base bodies exist for the canine layout only — non-canine beasts evolve anchored purely on their own current art (`refreshEvolutionAssets`).

## API surface

```ts
import { worldBaseTypes } from "@lifeordream/ai-content-engine";

worldBaseTypes.BASE_TYPE_IDS;                       // ["canine","primate","amphibian","feline"]
worldBaseTypes.normalizeBaseType(input);            // strict (jobs) — throws on unknown/blocked
worldBaseTypes.safeBaseType(input);                 // best-effort (snapshots) — junk → canine
worldBaseTypes.baseTypeRenderBlock(id, factionId);  // image-prompt block ("" for canine)
worldBaseTypes.baseTypeMotionDirective(id);         // animation directive ("" for canine)
worldBaseTypes.baseTypeMascotPhrase(id);            // "dog-warrior mascot" | "cat-ninja mascot" …
worldBaseTypes.baseTypeRenderNoun(id);              // identity-gate noun
worldBaseTypes.getBreedForBaseType(id, factionId, breedValue);
```

**Canine stays byte-identical**: every injection helper returns `""` for canine and `buildHashBeastPrompt(...)` output is unchanged with or without an explicit `baseType` (asserted in `scripts/test_grammar.ts`, section "E · base types").

## Show canon

The Hashiden show cast (world bible leaders + lieutenants) remains canine canon — show-level prompts (`screenplay.ts`, `directorGrammar.ts`, scene scripts) keep their dog-warrior wording. Per-beast surfaces (mint art, state loops, mutation/moment/intro dialogue, voices) follow the beast's `baseType`.

## Acceptance set (Phase E)

One cheap 1K mint-art-style set generated via fal (`scripts/acceptance_base_types.ts`), saved as small webp under `docs/examples/base-types/`: a primate and a feline beast each rendered in Brazil and Japan, plus one announcer dialogue line per base type. Verified visually: both base types read on-model (clearly not dogs) and the two countries stay style-distinct on the same base type.

| | Brazil | Japan |
| --- | --- | --- |
| **Primate** (Macaque) | ![primate brazil](examples/base-types/primate_brazil.webp) | ![primate japan](examples/base-types/primate_japan.webp) |
| **Feline** (Shadow Cat) | ![feline brazil](examples/base-types/feline_brazil.webp) | ![feline japan](examples/base-types/feline_japan.webp) |

Sample announcer lines (lexicon-lint clean):

- primate / Brazil: *"Caralho! Watch me climb — nobody keeps Brasil off that top spot!"*
- feline / Japan: *"Ikuze. Japan sharpens the blade. Watch your rank disappear."*

Generation note baked into the script: the image model's prior turns "Brazil + colorful bandana" (headwear trait 3) into a flag print, which violates the never-flags-as-clothing rule — the acceptance cases pin Brazil to the Favela Cap trait, and the prompt carries explicit no-flag / blank-talisman constraints. In production the Gemini identity gates + bounded retries are the backstop.
