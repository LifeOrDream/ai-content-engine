/**
 * Shared input shapes for the NFT pipeline jobs.
 *
 * The engine never reads game state: every job receives a self-contained
 * snapshot of the beast (canonical asset URLs, DNA, personality) built by the
 * caller. Loading/persisting that snapshot is the backend's job.
 */

export interface NftBeastPersonality {
  archetype?: string;
  tone?: string;
  motivation?: string;
  catchphrase?: string;
}

/** Self-contained beast snapshot passed into animation/mutation jobs. */
export interface NftBeastInput {
  mint: string;
  name?: string;
  /** 256-bit DNA hex; used to resolve faction/breed/type/evolution for prompts. */
  dna?: string;
  /** Faction id 0-11 — fallback when DNA is absent or undecodable. */
  factionId?: number;
  /** Canonical art the generation grounds on (identity source of truth). */
  assetUrls?: { fullBody?: string; dp?: string };
  /** Storage-relative folder all artifacts are keyed under, e.g. "usa/army/region_3/<mint>". */
  storagePath?: string;
  personality?: NftBeastPersonality;
  bio?: string;
  /**
   * Optional pre-built owner/profile context block (the backend owns user
   * data; when it wants owner flavor in the motion it passes the prompt block
   * ready-made).
   */
  ownerProfileBlock?: string;
  multiplier?: number;
  evolutionStage?: number;
  breedValue?: number;
  breedName?: string;
}
