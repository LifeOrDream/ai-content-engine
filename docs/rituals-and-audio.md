# Casino Rituals + Audio Identity (Phase F)

The casino moments of Mining Wars — lootbox rolls, claim-time mutation rolls,
evolutions — resolve to **staged rituals**, not toasts. This doc covers the
ritual job kinds, the rarity light language they draw from, and the audio
identity spec that gives every moment an ownable sound.

## Job kinds

| Kind | Input | Result | Cost |
| --- | --- | --- | --- |
| `ritual.lootbox_reveal` | `RitualLootboxRevealInput` (roll_value, threshold_bps, factionId, rarity/revealStage, optional beast + `includeDialogue`) | `RitualContentResult` (staged ritual + optional voiced line) | FREE by default; `includeDialogue` adds LLM + TTS |
| `ritual.claim_roll` | `RitualClaimRollInput` (result: visual/power/evolution/none, factionId, newStage, optional beast + `includeDialogue`) | `RitualContentResult` | FREE by default; `includeDialogue` adds LLM + TTS |
| `audio.identity_cue` | `{ cueId }` from `ALL_AUDIO_CUE_IDS` | `AudioIdentityCueResult` (fal url + meta) | one stable-audio call |

Rules, same as every content job:

- **Budget gate before dispatch.** The backend reserves the estimated cost
  through its content-budget gate (`tryReserve`) BEFORE adding the job, exactly
  like `nft.mutation_content`. Ritual definitions are deterministic and free —
  only the opt-in dialogue and the audio cue generation cost money.
- **Flag gates.** `audio.identity_cue` refuses to generate unless
  `AUDIO_IDENTITY_GENERATION_ENABLED=true` — cues are generated **once**,
  stored, and referenced by id. Never mass-generate the catalog.
- **Identity gate.** These jobs never render the character. Any beast imagery
  for a ritual moment rides `nft.moment_content`, which keeps the Gemini
  identity gate on every character render.
- **No readable text in images** still applies to any prompt these definitions
  feed into; ritual `title`/`caption` strings are UI copy, never image text.

## Staged rituals (src/nft-pipeline/ritual.ts)

Every ritual is a `StagedRitual`: ordered `acts`, each with a stable `act` id,
a pacing hint (`durationMs`), visual `staging`, `lightLanguage`, a
`soundCueId` and a `fallbackSoundId` from the FE's existing mapping.

| Ritual | Acts |
| --- | --- |
| Lootbox WIN | `anticipation_shake → crack → rarity_flare → reveal` |
| Lootbox NEAR-MISS | `anticipation_shake → lock_strain → dim_resolve` |
| Lootbox distant miss | `anticipation_shake → dim_resolve` (no false-hope theater) |
| Claim roll (hit) | `charge_roll → roll_hit` |
| Claim roll (no hit) | `charge_roll → roll_settle` |
| Evolution | `charge → burst → reveal` (the canonical 3-beat ceremony) |

The **near-miss** is its own dramatic beat: `lock_strain` stages "the lock
almost turned" with the actual `roll_value` vs `threshold_bps` margin (roll
UNDER threshold wins, same classifier as the moment grammar). A distant miss
deliberately skips it — teasing a player who wasn't close is bad theater.

`npm run demo:rituals` prints the win / near-miss / evolution definitions and
fails if they ever collapse into the same shape; `npm run test:grammar` holds
the distinctness, margin-dramatization, and lexicon guarantees.

## Rarity light language (bible module)

Rarity color/particle grammar lives in **the bible**
(`src/world/bible.ts` → `RARITY_TIERS`), so a tier reads identically on every
surface — lootbox flares, claim ceremonies, marketplace cards, chapter
callouts:

| Tier | Name | Hue family |
| --- | --- | --- |
| common | Surface Dust | worn steel / paper-white |
| uncommon | Live Conduit | signal cyan |
| rare | Deep Vein | royal violet |
| epic | Motherlode | molten bitcoin gold |
| mythic | Genesis Seam | prismatic white-gold |

`rarityTierForStage()` maps the 8-stage ladder onto the 5 tiers
(0-1 / 2-3 / 4-5 / 6 / 7). Each tier carries `colorLanguage`,
`particleLanguage`, `crackLight`, `revealFlare`, and a `fanfareTier`
(minor/major/mythic) the audio identity maps to a fanfare cue.

## Audio identity (src/world/audioIdentity.ts)

Four cue families, all generated through the existing stable-audio path
(`falMedia.generateMusic` / `generateSfx`, default `fal-ai/stable-audio`):

1. **Country leitmotifs** (12, `leitmotif_<code>`, 8s) — national identity via
   instrumentation and rhythm, never anthem quotes, always instrumental.
2. **Evolution stings** (`evolution_sting_<band>`) — escalate with the B3
   performance bands: pup toy-chime → soldier brass hit → elite orchestral
   shockwave → ascendant serene swell.
3. **Story themes** — `chapter_settled_theme` (24s) and `losing_streak_motif`
   (the drought sound that makes the comeback land harder).
4. **Ritual SFX** — anticipation/crack/fanfares(minor/major/mythic)/near-miss
   for lootboxes, anticipation/resolve-win/resolve-miss for claim rolls.

**soundId wiring:** the FE's existing SFX ids are `"mutation"` and
`"jackpot"`. Every cue carries `fallbackSoundId` from that set and
`legacyPlayableSoundId()` resolves any id (new or legacy) to something
playable today — new ids extend the existing mapping without breaking it.

**Path validation:** `npx tsx scripts/acceptance_audio_identity.ts` generates
at most 2 cues (key from env, never printed; `FAL_AUDIO_TIMEOUT_MS` widens the
queue wait). The full catalog ships later through the budget-gated
`audio.identity_cue` job — never in bulk from a script.
