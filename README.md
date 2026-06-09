# minebtc-ai-content-engine

Open-source MineBTC AI content engine for HashBeast story state, prompt grammar, trailer scripts, and video-generation pipelines.

This repo is the extracted creative/runtime surface from the MineBTC backend. It is meant to be worked on independently, with the production backend later calling it through clean adapters instead of carrying all prompt and trailer logic inline.

## What Is Here

- `src/content-engine/` - reusable prompt and screenplay primitives for event-driven HashBeast content.
- `trailer/` - launch trailer script pipeline, reference asset registry, country cast/location boards, and FAL/Seedance render orchestration.
- `src/utils/falMedia.ts` - local media adapter for FAL, S3 uploads, Gemini validation, TTS, music, SFX, and lip-sync.
- `src/services/telegram.service.ts` - optional local Telegram delivery for preview clips.

## Local Setup

```bash
npm install
cp .env.example .env
npm run typecheck
```

The real `.env` has been copied locally for this workspace, but `.env` and generated media outputs are ignored by git.

## Common Commands

```bash
# Generate / iterate script passes for trailer 01
npm run trailer:script -- 01

# Render the final trailer from trailer/out/<id>/scenes.json
npm run trailer:generate -- 01

# Canonize a posted video into story memory
npm run trailer:canonize -- 01 --platform x --url https://x.com/... --video-no 1
```
