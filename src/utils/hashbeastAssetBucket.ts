const LEGACY_DEPLOYMENT_BUCKET_RE = /api-deployments/i;

export function getHashBeastAssetBucketName(): string {
  const explicit =
    process.env.HASHBEAST_ASSETS_BUCKET ||
    process.env.ASSETS_BUCKET_NAME ||
    process.env.NFT_ASSETS_BUCKET;

  if (explicit) return explicit;

  const bucketName = process.env.BUCKET_NAME || "";
  if (LEGACY_DEPLOYMENT_BUCKET_RE.test(bucketName)) {
    return "minebtc-assets-prod";
  }

  return bucketName;
}
