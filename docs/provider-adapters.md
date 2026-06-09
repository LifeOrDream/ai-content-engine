# Provider Adapters

The engine should not hardcode one model vendor as the only path. Providers are adapters around a stable creative contract.

## Provider Types

- LLM/script provider: screenplay, dialogue, scene JSON, prompt refinement.
- Image provider: keyframe and storyboard image generation/editing.
- Video provider: image-to-video generation with motion/audio prompts.
- Speech provider: character voice design and line generation.
- Music/SFX provider: beds, stings, impacts, risers, and ambience.
- Lip-sync provider: mouth/face timing for character close-ups.
- Storage provider: local files, S3/R2, or another artifact store.
- Delivery provider: Telegram, Discord, web preview, or internal review queue.

## Adapter Rule

Provider code should translate between engine contracts and vendor APIs. It should not own story logic, brand grammar, country lore, or character canon.

## Contribution Ideas

- Add a new image/video provider adapter.
- Improve retry and error classification.
- Add dry-run mode that writes request payloads without sending them.
- Add cost estimation before live generation.
- Add proof manifests that record model, request id, input refs, output urls, and scorecard.

## Secrets

Provider keys must live in `.env` or secret managers. Never commit keys, signed URLs, raw production exports, or paid provider request logs containing private tokens.
