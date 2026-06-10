/**
 * Artifact storage port for the NFT pipeline.
 *
 * Per docs/architecture.md, persistence is a BACKEND responsibility — the
 * engine produces media and must not own game-state writes. This module keeps
 * that boundary honest: every generated asset flows through an ArtifactStore.
 *
 * - `S3ArtifactStore` (optional, env-driven): uploads under the configured
 *   assets bucket/prefix and returns a public CDN URL — the same layout the
 *   MineBTC backend reads (`hashbeast-assets/<storagePath>/<file>`).
 * - `InlineArtifactStore` (default when S3 is not configured): returns the
 *   bytes base64-inline in the job result so a backend (or a contributor
 *   without AWS keys) can persist them however it likes.
 *
 * Selection: `NFT_ARTIFACT_STORE=s3|inline`, defaulting to `s3` when both an
 * assets bucket and AWS credentials/role are plausibly present, else `inline`.
 */
import { uploadBufferToS3 } from "../utils/falMedia.js";
import { getHashBeastAssetBucketName } from "../utils/hashbeastAssetBucket.js";

/** One generated media artifact in a job result. */
export interface NftArtifact {
  /** Semantic kind: "full_body" | "dp" | "cinematic" | "mining" | "win" | "lose" | "power" | "transition" | "dialogue_audio" | "cycle_summary". */
  kind: string;
  /** Storage-relative key (no bucket prefix), e.g. "<storagePath>/dp.png". */
  key: string;
  contentType: string;
  /** Public URL when a real store handled the bytes. */
  url?: string;
  /** Base64 bytes when no real store is configured (inline mode). */
  base64?: string;
  /** Generation provenance (model slug + provider request id) when known. */
  model?: string;
  requestId?: string;
}

export interface ArtifactStore {
  readonly mode: "s3" | "inline";
  /** Persist bytes under `relativeKey`; returns url (s3) or base64 (inline). */
  put(
    relativeKey: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<{ url?: string; base64?: string }>;
}

export class S3ArtifactStore implements ArtifactStore {
  readonly mode = "s3" as const;
  async put(relativeKey: string, buffer: Buffer, contentType: string) {
    const url = await uploadBufferToS3(relativeKey, buffer, contentType);
    return { url };
  }
}

export class InlineArtifactStore implements ArtifactStore {
  readonly mode = "inline" as const;
  async put(_relativeKey: string, buffer: Buffer, _contentType: string) {
    return { base64: buffer.toString("base64") };
  }
}

let defaultStore: ArtifactStore | null = null;

export function getDefaultArtifactStore(): ArtifactStore {
  if (defaultStore) return defaultStore;
  const explicit = (process.env.NFT_ARTIFACT_STORE || "").toLowerCase();
  if (explicit === "s3") defaultStore = new S3ArtifactStore();
  else if (explicit === "inline") defaultStore = new InlineArtifactStore();
  else {
    // Auto: S3 only when an assets bucket is configured (credentials are
    // resolved by the AWS SDK default chain — env keys, profile, or role).
    defaultStore = getHashBeastAssetBucketName()
      ? new S3ArtifactStore()
      : new InlineArtifactStore();
  }
  return defaultStore;
}

/** Test/embedding hook: override the default store (pass null to reset). */
export function setDefaultArtifactStore(store: ArtifactStore | null): void {
  defaultStore = store;
}

/** Persist a buffer through `store` and wrap it as a typed NftArtifact. */
export async function storeArtifact(
  store: ArtifactStore,
  artifact: {
    kind: string;
    key: string;
    buffer: Buffer;
    contentType: string;
    model?: string;
    requestId?: string;
  },
): Promise<NftArtifact> {
  const placed = await store.put(artifact.key, artifact.buffer, artifact.contentType);
  return {
    kind: artifact.kind,
    key: artifact.key,
    contentType: artifact.contentType,
    url: placed.url,
    base64: placed.base64,
    model: artifact.model,
    requestId: artifact.requestId,
  };
}
