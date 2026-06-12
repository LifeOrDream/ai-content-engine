# The MineBTC World Bible

**Single source of truth for the Mining Wars canon.** The typed version every
pipeline imports is [`src/world/bible.ts`](src/world/bible.ts). This document is
the human-readable companion: the decision log for every name conflict, the
rivalry map, the style elevation ladder, and the per-country one-pagers.

If a name, palette, voice, or lore line is not in the bible, it is not canon.

---

## Why this exists

Before 2026-06, the canon was forked three ways:

1. `trailer/world/countryCastRegistry.ts` — the show cast (Rex Goldpaw Sterling, Volkov Frostline, …)
2. `src/prompts/factions/*.prompts.ts` — the NFT faction prompts (General George Woofington III, Grand Master Long Wei, …)
3. `DESIGN.md` + the `minebtc-artwork` skill — the shipped docs/marketing art (Marshal Viktor Volkov, Shogun Hachiko IX, …)

Ten of twelve countries had two different leaders depending on which file you
read, and USA's Rex was a Golden Retriever in the renderer but a husky pilot in
the script-pass canon. Every conflict is now resolved below; the losers are
retired or absorbed as aliases.

---

## Decision log — leader name conflicts

One decision per country. "Retired" names must never appear on a new surface;
"absorbed" names live on as aliases of the winner.

| # | Country | Candidates (source) | Decision | Reasoning |
|---|---------|---------------------|----------|-----------|
| 0 | USA | **Rex Goldpaw Sterling** (registry/show) · General George Woofington III (prompts) · Commander Rex (fixtures) | **Rex "Goldpaw" Sterling** — Woofington retired; "Commander Rex" absorbed as alias | Rex carries the shipped show, the locked reference art on disk, and the fixtures; Woofington never appeared on a rendered surface. |
| 0b | USA (breed) | Golden Retriever commander (renderer + registry + locked refs) · Siberian Husky NASA pilot (old castCanon) | **Golden Retriever commander** | The husky-pilot identity was a duplicate of USA's own lieutenant Nova Howl; the locked reference images on disk are a retriever. |
| 1 | China | Minister Long (registry) · Master Long (castCanon) · **Grand Master Long Wei** (prompts) | **Grand Master Long Wei**, called "Master Long" — "Minister Long" absorbed as alias | Keeps the prompt-file lineage AND the show alias; "Minister" undersold a faction leader. |
| 2 | Russia | Volkov Frostline (registry) · **Marshal Viktor Volkov** (prompts + artwork skill + shipped docs art) | **Marshal Viktor "Frostline" Volkov** — both names merged | Both names shipped publicly; the merge keeps docs-art captions valid and upgrades "Frostline" to a callsign. |
| 3 | India | **Raja Coverdrive** (registry/show) · Guru Bhairava (prompts) | **Raja Coverdrive** — Bhairava retired (usable later as Raja's retired mentor) | Raja is the show's underdog heart with a locked design; Bhairava was an unused archetype. |
| 4 | Japan | **Shogun Hachiko IX** (prompts + skill + shipped docs art) · *(registry had no leader)* | **Shogun Hachiko IX** — new full dramatic profile authored (`japan_shogun_hachiko`) | Not a true conflict: the registry simply lacked Japan's leader; Hachiko already shipped in docs art. Kiro Cutline stays his chosen-blade lieutenant. |
| 5 | South Korea | **Jin Seoulflash** (registry) · Chaebol Chairman Kim Jinhashbeast (prompts) | **Jin Seoulflash** — Kim Jinhashbeast retired | "Jinhashbeast" was a find-and-replace mangled name; the chaebol-broker role survives in lieutenant Director Parkbite. |
| 6 | Iran | **Rostam Gate** (registry) · Ayatollah Bark-hamenei (prompts) | **Rostam Gate** — Bark-hamenei permanently retired | Real-leader pun violates the standing safety canon (no real politicians, ever); Rostam carries Shahnameh-hero weight. |
| 7 | UK | Sir Pound Sterling (registry) · Sir Barkington the Third (prompts) | **Sir Reginald "Pound" Barkington III** — both names merged | The merge keeps both lineages and removes the surname collision with Rex Goldpaw **Sterling**. |
| 8 | North Korea | **Marshal Bonepaw** (registry + castCanon) · Supreme General Kim Il-Bark (prompts) | **Marshal Bonepaw** — Kim Il-Bark permanently retired | Real-leader pun violates the safety canon; Bonepaw is already the show's comic heel. |
| 9 | France | **Madame Mint** (registry) · Comte Louis de Woofbourg (prompts) | **Madame Mint** — Woofbourg retired (usable later as an old-money ancestor) | The couture-treasury tyrant is specific and modern; the Comte was a generic aristocrat pun. |
| 10 | Brazil | **Sol Caramelo** (registry) · Senhor Caramelo (prompts) | **Sol Caramelo** — "Senhor Caramelo" absorbed as honorific alias; he inherits the *Supreme Malandro* title | Same caramelo vira-lata archetype on both sides; Sol has the richer dramatic sheet — fold, don't fork. |
| 11 | Israel | **Mira Lock** (registry) · General Barkowitz (prompts) | **Mira Lock** — Barkowitz retired; she inherits the *DDF Director* title | Barkowitz was a one-line generic pun; Mira has a full dramatic sheet and the commander lane. |

---

## The Council of Twelve

| ID | Country | Leader | Breed | Title | Lieutenants |
|----|---------|--------|-------|-------|-------------|
| 0 | USA | Rex "Goldpaw" Sterling | Golden Retriever | Supreme Commander of the American HashBeast Forces | Chairman Biscuit · Nova Howl · Pip Circuit |
| 1 | China | Grand Master Long Wei | Chow Chow | Supreme Dragon of the Eastern Network | Mei Spark · Bao Silence · Lian Ghostport |
| 2 | Russia | Marshal Viktor "Frostline" Volkov | Siberian Husky | Supreme Commissar of the Eastern HashBeast Territories | Count Rublefang · Misha Snowblind · Anya Northstar |
| 3 | India | Raja Coverdrive | Rajapalayam | Captain of the Subcontinent Mining XI | Chai Alpha · Jugaad Byte · Tara Snowbell |
| 4 | Japan | Shogun Hachiko IX | Akita Inu | Eternal Guardian of the Rising Sun Mining Syndicate | Kiro Cutline · Boss Akamatsu · Momo Broadcast · Goro Kaijuwatch |
| 5 | South Korea | Jin Seoulflash | Jindo | Idol Captain of the Hallyu Mining Crew | Nari Queue · Director Parkbite · Yuna Wire |
| 6 | Iran | Rostam Gate | Sarabi Mastiff | Gatekeeper of the Persian Vaults | Darya Verse · Saffron Ledger · Nilo Mirage |
| 7 | UK | Sir Reginald "Pound" Barkington III | English Bulldog | Lord Chancellor of the Royal HashBeast Privy Council & Crown Bookie | Lady Crumpet · Agent Woolf · Pint Rocket |
| 8 | North Korea | Marshal Bonepaw | Dark Pungsan | Eternal Chairman of the Revolutionary HashBeast Committee | Comrade Button · Choir Frost · Paektu Static |
| 9 | France | Madame Mint | French Bulldog | Grande Couturière of the European Treasury | Professor Croissant · Fleur Flash · Luc Barricade |
| 10 | Brazil | Sol Caramelo | Caramelo Vira-Lata | Supreme Malandro of the South American Network | Dona Vaulta · Luma Loop · Mato Verde |
| 11 | Israel | Mira Lock | Israel Pointer | Director of the $degenBTC Defence Forces (DDF) | Yalla Zero · Shuk Ember · Negev Bloom |

Every leader and lieutenant has a full dramatic sheet (mask, hidden want, flaw,
voice, comedy/suspense loops, action-wow, power style, taboos) in
`COUNTRY_CHARACTER_PROFILES` inside `src/world/bible.ts`.

---

## Rivalry map

Every country has at least one rival. Primary rivalries drive season arcs;
secondary rivalries feed B-plots. The pairs are designed so that each one is a
*doctrine clash*, not just a flag clash.

```
USA ←──primary──→ China        (hype doctrine vs patience doctrine)
USA ←─secondary─→ Russia       (the menace that keeps Rex honest)
USA ←─secondary─→ Israel       (the cyber trust feud: Nova vs Yalla Zero)
China ←secondary→ Japan        (precision vs replication: Kiro vs Mei)
Russia ←secondary→ UK          (the quiet war: Woolf decodes, Misha listens)
India ←─primary──→ UK          (the bookie never gives India fair odds)
India ←secondary─→ Brazil      (the comeback crown: Raja vs Sol)
Japan ←─primary──→ South Korea (the broadcast war: Momo vs Jin)
South Korea ←primary→ North Korea (the divided mirror: voluntary vs commanded unison)
North Korea ←secondary→ UK    (Woolf wants Button's testimony)
Iran ←──primary──→ Israel      (the desert signal duel: mirage vs drone lattice)
Iran ←─secondary─→ UK          (Saffron Ledger bills Woolf for the suspicion tea)
UK ←───primary──→ France       (the eternal cross-channel taste war)
France ←secondary→ Brazil      (couture discipline vs carnival engineering)
```

Why each primary is dramatically sound:

- **USA–China** — the superpower mirror. Rex sells inevitability, Long Wei
  schedules it. Either doctrine winning humiliates the other on camera.
- **India–UK** — history as a betting slip. Raja's comeback arcs exist to make
  Sir Pound tear up the odds on live broadcast; the colony out-bats the bookie.
- **Japan–South Korea** — the broadcast war. Two production machines fighting
  for the same global audience with opposite tools: cuteness vs choreography.
- **South Korea–North Korea** — the divided mirror. The same synchronization
  instinct, opposite consent. Choir Frost cannot command what Jin earns.
- **Iran–Israel** — the desert signal duel, kept strictly game-world: Mira's
  drone lattice can map everything except Nilo's mirages. Two ancient networks
  playing chess across the same sand; never real-conflict references.
- **UK–France** — old money vs old style. Sir Pound prices beauty; Madame Mint
  refuses to believe beauty has a price.

---

## Style elevation ladder

Three rungs, one identity. Typed version: `STYLE_ELEVATION_LADDER`.

| Rung | Name | Surfaces | Contract |
|------|------|----------|----------|
| 1 | **Pixel Sprite** | NFT mint assets (full_body/dp), state loops (mining/win/lose/power), mutation transitions, in-game sprites | Chunky retro pixel art, hard outlines, flat fills, magenta-keyed strips, game-card readability |
| 2 | **Arcade-Cel Key Art** | Trailers, show keyframes, Hashiden chapter covers + recap panels, social cards, docs heroes | High-res 2D arcade-cel with pixel-art DNA, bold outlines, cel shading, premium bright key-art light |
| 3 | **Cinematic Portrait** | Optional mint cinematic PFP (`includeCinematic`), posters, deck splash, season key visuals | Pixar/DreamWorks-grade semi-realistic render with faction environment; same character, same gear |

**Ladder rules:**

1. A surface never borrows a higher rung for routine content — sprites stay
   sprites; the cinematic rung is earned (big moments, posters, season art).
2. Going up a rung may add lighting, materials, and depth — it may NOT change
   breed, markings, gear lineage, or silhouette.
3. Every character carries **identity anchors** (in the bible per leader, in
   `visualDesign` per lieutenant): *markings* (fur/face), *gear lineage*
   (signature equipment that persists across evolutions), and *silhouette*
   (the one-glance read). A viewer who owns the pixel sprite must instantly
   recognize the same beast in a trailer frame and on a movie poster.
4. Never on any rung: readable text in image, flag-print clothing, real
   politicians, photoreal fur on rungs 1-2, identity drift on rung 3.

---

## Base types ("forms are fluid")

The body-plan layer ABOVE breed. Typed version: `src/world/baseTypes.ts`;
engine docs: `docs/base-types.md`.

| Base type | Availability | One-glance read |
|-----------|--------------|-----------------|
| **Canine** | Genesis default — every minted beast | The classic HashBeast dog; 48 per-country breeds |
| **Primate** | Lootbox / rebirth only | Long-armed climb-and-swing acrobat (Macaque, Capuchin, Gibbon, Gorilla) |
| **Amphibian** | Lootbox / rebirth only | Springy low-slung wide-mouthed meme-frog (Tree Frog, Bullfrog, Axolotl, Toad) |
| **Feline** | Lootbox / rebirth only | Silent-precision cat-ninja (Shadow Cat, Siamese, Maine Coon, Sand Cat) |

**Base-type rules:**

1. Canine is canon for genesis and for the entire show cast (the Council of
   Twelve and all lieutenants are dogs). Non-canine forms exist only through
   the lootbox/rebirth path — the game backend grants them, never the engine.
2. Country style modulates the base type: a Brazil primate (carnival blaze,
   capoeira-flow swings) reads nothing like a Japan primate (onsen-macaque
   calm, tech-ronin layers). Per-country skins live in the typed registry.
3. Every hard canon rule holds on every base type: no flags as clothing, no
   readable text in images, identity anchors survive the style ladder, and
   every render passes the Gemini identity gate — which states the body plan
   and rejects a beast that drifts back into reading as a dog.

---

## Quick reference

| Country | Palette (primary/secondary/accent/glow) | Voice | Mining tool (muggle) |
|---------|------------------------------------------|-------|----------------------|
| USA | `#B22234` `#3C3B6E` `#FFFFFF` `#FFD700` | bold American, brash hype-man | star-spangled power-drill |
| China | `#DE2910` `#FFDE00` `#000000` `#FF4500` | Mandarin-accented, wuxia calm | jade-handled pickaxe |
| Russia | `#D52B1E` `#0039A6` `#FFFFFF` `#8B4513` | deep Russian, stoic gravel | heavy iron sledge-pick |
| India | `#FF9933` `#138808` `#000080` `#FFD700` | Indian English, fast and proud | gilded chakra-pick |
| Japan | `#BC002D` `#FFFFFF` `#000000` `#FFB7C5` | Japanese, disciplined honor | katana-forged pick |
| South Korea | `#CD2E3A` `#0047A0` `#FFFFFF` `#FF69B4` | Korean, idol-bright | hi-tech laser-drill |
| Iran | `#239F40` `#DA0000` `#FFFFFF` `#FFD700` | Persian, regal poetic | ornate scimitar-pick |
| UK | `#012169` `#C8102E` `#FFFFFF` `#FFD700` | posh British, dry wit | polished gentleman's pick |
| North Korea | `#ED1C27` `#024FA2` `#FFFFFF` `#FF0000` | stern Korean, bombastic | stamped state-issue pickaxe |
| France | `#002395` `#FFFFFF` `#ED2939` `#FFD700` | French, suave disdain | artisan engraved pick |
| Brazil | `#009C3B` `#FFDF00` `#002776` `#FFD700` | Brazilian, warm rhythmic | carnival-painted pickaxe |
| Israel | `#0038B8` `#FFFFFF` `#0038B8` `#FFD700` | Israeli, sharp blunt | precision tech-pick |

Each country also carries 3 location cards (`faction_hq` / `ordinary_life` /
`luxury_landscape`) in the bible; the deep shot-level art direction for those
locations stays in `trailer/world/locationRegistry.ts`.

---

## Progression grammar (`src/world/progression.ts`)

The canonical 8-stage growth ladder (DNA evolution 0-7):

**Pup · Initiate · Operative · Veteran · Elite · Commander · Legend · Ascended**

Each stage carries aura escalation tokens (size, color temperature, particle
density, ground effect). Each stage STEP has one canonical ceremony name —
never rename on any surface:

| To stage | Ceremony |
|----------|----------|
| 1 Initiate | The First Spark |
| 2 Operative | The Tool Bond |
| 3 Veteran | The Scar Ceremony |
| 4 Elite | The Crown of Sparks |
| 5 Commander | The Banner Rising |
| 6 Legend | The Myth Forging |
| 7 Ascended | The Ascension |

Evolution renders as a 3-beat ceremony — **CHARGE → BURST → REVEAL**
(anticipation / whiteout-morph / signature-pose + aura-settle) — modulated by
the country's powerStyle grammar (USA gold ticker-ribbons, China jade rings,
Russia frost pressure…). Performance bands (`pup` 0-1, `soldier` 2-3, `elite`
4-5, `ascendant` 6-7) rewrite state-loop acting: Pups over-celebrate with
oversized tools; Ascended beasts barely acknowledge victory.

Every country × lane (wizard/muggle) owns **named techniques** (e.g. USA
wizard "Ticker-Ribbon Time-Stop", Russia muggle "Sledge Winter") in
`TECHNIQUES` — names live on text surfaces and debut records only, NEVER
inside generated images; image prompts use only the visual grammar.

---

## Who imports what

| Consumer | Pulls from the bible |
|----------|----------------------|
| `src/prompts/factions/*.prompts.ts` | full faction identity via `legacyFactionBlock(id)` — leader, lore, palette, visual identity |
| `src/nft-pipeline/voice.ts` | `FACTION_VOICE_HINTS`, leader catchphrase previews, country codes |
| `src/nft-pipeline/stateAnimations.ts` | `MINING_TOOL_BY_CODE`, country names/codes; stage performance + named techniques via `progression.ts` |
| `src/nft-pipeline/mintAssets.ts` | `FACTION_CINEMATIC_ENVIRONMENTS` (ladder rung 3), country codes |
| `src/nft-pipeline/mutationContent.ts` | country names; evolution ceremony + techniques via `progression.ts` |
| `src/nft-pipeline/moments.ts` | rivalry map (`rivals` edges), country names; performance bands via `progression.ts` |
| `src/content-engine/fixtures.ts` | USA leader name + catchphrase |
| `trailer/style/castCanon.ts` | `CAST_CANON` (re-export) |
| `trailer/world/countryCastRegistry.ts` | `COUNTRY_CHARACTER_PROFILES` (re-export) |
| `trailer/generate/cast.ts` | show-cast looks, gear, voices (render config stays local) |
| `~/.claude/skills/minebtc-artwork` | roster section points here |

## Editing rules

1. Change names/lore/palettes **only** in `src/world/bible.ts`, then update
   this file's tables and the artwork skill's roster pointer.
2. Never resurrect a retired name on a new surface.
3. New characters get a full `CountryCharacterProfile` (mask, want, flaw,
   loops, taboos) — no name-only characters.
4. Safety canon is non-negotiable: no real politicians or real-leader puns, no
   flags as clothing, no readable text in generated images, no ethnicity as
   the joke. Satire targets institutions and faction behavior.
