/**
 * MINT MOMENT — the "joined the war" intro panel (Phase D1).
 *
 * When a fresh HashBeast finishes minting, this job renders ONE cheap intro
 * panel (the recruit arriving at its country's bible location, 1K, identity-
 * gated) plus one intro dialogue line via the normal dialogue path. The panel
 * becomes the beast's first timeline artifact and feeds the cycle chapter's
 * CAST section ("character intros").
 *
 * Runs as the `nft.mint_intro` job kind. Stays in the backend: the budget
 * gate that decides whether this job is dispatched at all (gate it exactly
 * like nft.mutation_content), the `minted` timeline row, DDB persistence and
 * socket emission.
 *
 * Canon rules enforced here:
 *   - arcade-cel rung (style ladder rung 2 — chapter/panel surfaces)
 *   - NO readable text inside the image (prompt-level rule)
 *   - never flags as clothing — national identity via costume style + palette
 *   - Gemini identity gate against the beast's canonical DP
 */
import { logger } from "../utils/logger.js";
import {
  generateImageEdit,
  validateSameCharacter,
} from "../utils/falMedia.js";
import { countryBible, styleRung, type LocationCard } from "../world/bible.js";
import {
  baseTypeMascotPhrase,
  baseTypeRenderNoun,
  safeBaseType,
} from "../world/baseTypes.js";
import { beastMemoryPromptBlock, type BeastMemorySnapshot } from "./beastMemory.js";
import { writeAndVoiceFromPrompt, type DialogueResult } from "./mutationContent.js";
import type { NftBeastInput } from "./types.js";
import {
  getDefaultArtifactStore,
  storeArtifact,
  type ArtifactStore,
  type NftArtifact,
} from "./artifacts.js";

const MAX_PANEL_ATTEMPTS = 2;

export interface NftMintIntroInput {
  beast: NftBeastInput;
  /** War cycle the beast joined (timeline + storage key attribution). */
  warId: number;
  /** Optional memory snapshot (usually empty at mint — supported for reborns). */
  memory?: BeastMemorySnapshot;
  /** Pre-resolved voice id (skip lazy voice design). */
  voiceId?: string;
  /** Skip the panel render (dialogue-only ultra-cheap path). */
  skipPanel?: boolean;
}

export interface NftMintIntroResult {
  mint: string;
  warId: number;
  /** The "joined the war" intro panel still, when rendered + gated. */
  panel?: NftArtifact;
  /** The intro line (voiced when the voice path succeeds). */
  introLine?: DialogueResult;
  /** Location card the panel staged (name travels in text surfaces only). */
  locationName?: string;
  artifacts: NftArtifact[];
}

/** The bible location an intro panel stages — the country's HQ when it exists. */
export function pickIntroLocation(factionId: number): LocationCard | null {
  const bible = countryBible(factionId);
  if (!bible || bible.locations.length === 0) return null;
  return (
    bible.locations.find((l) => l.mode === "faction_hq") || bible.locations[0]
  );
}

/**
 * The intro panel prompt — bible location + palette, arcade-cel rung,
 * identity anchored to the attached reference. Pure (unit-testable).
 */
export function buildMintIntroPanelPrompt(
  beast: NftBeastInput,
  location: LocationCard,
  factionId: number,
): string {
  const bible = countryBible(factionId);
  const rung = styleRung("arcade_cel");
  const nation = bible?.country || `Faction ${factionId}`;
  const colors = bible?.colors;
  const baseType = safeBaseType(beast.baseType);
  const baseTypeLine =
    baseType === "canine"
      ? ""
      : `The character is an anthropomorphic ${baseTypeRenderNoun(baseType)} — keep it unmistakably that base type, never a dog.`;
  return [
    `A single dramatic manga-style intro panel: THIS EXACT character (attached reference — keep its identity, breed, markings, colors, and gear lineage precisely) arriving for its first day of the mining war at ${location.name} — ${location.hook}`,
    baseTypeLine,
    `It stands at the threshold taking the place in: chest out, fresh-recruit energy, gear still spotless, eyes wide at the scale of the operation. One or two background silhouettes of veteran beasts at work, never competing for focus.`,
    colors
      ? `Palette discipline: ${nation} faction colors — primary ${colors.primary}, secondary ${colors.secondary}, accent ${colors.accent}, glow ${colors.glow}. National identity comes from costume style and palette only.`
      : "",
    rung.styleContract,
    `${rung.never} No readable text, lettering, numbers, signage, logos, or UI anywhere in the image. Never render any country flag as clothing, headwear, or fabric on a character.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** The intro dialogue prompt — "joined the war" directive via the dialogue path. */
export function buildMintIntroDialoguePrompt(
  beast: NftBeastInput,
  location: LocationCard | null,
  memory?: BeastMemorySnapshot,
): string {
  const nation =
    countryBible(beast.factionId ?? 0)?.country || `Faction ${beast.factionId ?? 0}`;
  const p = beast.personality || {};
  return [
    `You are the in-game announcer/voice of a ${nation} HashBeast (a stylized ${baseTypeMascotPhrase(safeBaseType(beast.baseType))}) in a comedic country-vs-country crypto mining war.`,
    `Write ONE short spoken line (max 14 words) the beast shouts the moment it JOINS THE WAR — its very first day${location ? ` at ${location.name}` : ""}: fresh-recruit swagger covering rookie nerves, announcing itself to the whole front.`,
    p.archetype || p.tone
      ? `Its personality: ${[p.archetype, p.tone, p.motivation].filter(Boolean).join(", ")}.`
      : "",
    beastMemoryPromptBlock(memory),
    `Make it punchy, trash-talky, patriotic, country-vs-country energy. May include ONE short native-language word. Output ONLY the line, no quotes, no narration.`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Produce the mint-moment bundle: intro panel (identity-gated) + intro line.
 * Best-effort sub-steps — a failed panel never kills the line and vice versa;
 * only a beast with no canonical art at all fails the job.
 */
export async function generateMintIntro(
  input: NftMintIntroInput,
  opts: { store?: ArtifactStore } = {},
): Promise<NftMintIntroResult> {
  const store = opts.store || getDefaultArtifactStore();
  const beast = input.beast;
  const factionId = beast.factionId ?? 0;
  const location = pickIntroLocation(factionId);
  const artifacts: NftArtifact[] = [];
  const result: NftMintIntroResult = {
    mint: beast.mint,
    warId: input.warId,
    locationName: location?.name,
    artifacts,
  };

  const refUrl = beast.assetUrls?.fullBody || beast.assetUrls?.dp;
  const gateRef = beast.assetUrls?.dp || refUrl;
  if (!refUrl) {
    throw new Error(
      "mint_intro: beast has no canonical art (assetUrls.fullBody/dp) — run nft.mint_assets first",
    );
  }

  // 1. Intro panel (cheap: ONE 1K image), Gemini identity gate, one retry.
  if (!input.skipPanel && location) {
    const prompt = buildMintIntroPanelPrompt(beast, location, factionId);
    for (let attempt = 1; attempt <= MAX_PANEL_ATTEMPTS; attempt++) {
      try {
        const panel = await generateImageEdit(prompt, refUrl, {
          aspectRatio: "16:9",
          resolution: "1K",
        });
        const check = await validateSameCharacter(gateRef!, panel.url, {
          characterNoun: baseTypeRenderNoun(safeBaseType(beast.baseType)),
        });
        if (!check.ok && attempt < MAX_PANEL_ATTEMPTS) {
          logger.warning(
            `mint_intro: identity gate failed (${check.reason}) — retrying panel`,
          );
          continue;
        }
        if (!check.ok) {
          logger.warning(
            `mint_intro: identity gate soft-fail after ${attempt} attempts (${check.reason}) — keeping panel`,
          );
        }
        const stored = await storeArtifact(store, {
          kind: "intro_panel",
          key: `${beast.storagePath || `misc/${beast.mint}`}/intro/joined-war-${input.warId}.png`,
          buffer: panel.buffer,
          contentType: "image/png",
          model: panel.model,
          requestId: panel.requestId,
        });
        result.panel = stored;
        artifacts.push(stored);
        break;
      } catch (e: any) {
        logger.warning(
          `mint_intro: panel attempt ${attempt} failed: ${e?.message || e}`,
        );
      }
    }
  }

  // 2. Intro line via the normal dialogue path (voiced when possible).
  const dlg = await writeAndVoiceFromPrompt(
    beast,
    buildMintIntroDialoguePrompt(beast, location, input.memory),
    "jackpot",
    { store, voiceId: input.voiceId, artifactTag: "intro" },
  );
  if (dlg) {
    result.introLine = dlg;
    if (dlg.audio) artifacts.push(dlg.audio);
  }

  logger.success(
    `🎬 mint intro for ${String(beast.mint).slice(0, 8)}… panel=${result.panel ? "y" : "n"} line="${dlg?.line || ""}"`,
  );
  return result;
}
