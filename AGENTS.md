# AGENTS.md

Guidance for AI coding agents working in this repo.

## Boundaries

- Keep creative engine logic portable and backend-free.
- Do not add MineBTC production DB, wallet, admin, posting, or private backend dependencies here.
- Provider adapters may call external services, but prompt/story/canon logic should stay independent of provider SDKs when possible.
- Never read or print `.env` values unless the user explicitly asks for a redacted check.

## Good Default Workflow

1. Read `README.md`, `CONTRIBUTING.md`, and the relevant docs file.
2. For prompt/media changes, run `npm run demo:fixture`.
3. For TypeScript changes, run `npm run typecheck`.
4. Include media proof or fixture proof in PR notes.

## Style

- Prefer small focused changes.
- Keep docs and examples runnable without paid API keys when possible.
- Treat generated videos/images as proof artifacts, not source files.
- Keep secrets, signed URLs, and private production outputs out of git.

## Prompt Work

- Improve measurable output quality, not just wording.
- Preserve character identity when reference images are attached.
- Avoid generic cinematic language that weakens the MineBTC/HashBeast visual identity.
- Add or update fixtures when changing reusable prompt behavior.
