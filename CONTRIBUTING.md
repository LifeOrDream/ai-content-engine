# Contributing

Thanks for helping improve the MineBTC AI Content Engine.

The goal is not only to make MineBTC trailers better. The broader goal is to build an open, inspectable AI showrunner pipeline for game-native characters, story memory, and generated media.

## Good First Contributions

- Improve a prompt block with proof.
- Add or refine a fixture.
- Add a quality check or lint rule.
- Improve a country/world-pack character or location card.
- Document a provider setup.
- Add a small provider adapter seam.
- File a high-quality issue with a prompt packet and media proof.

## Local Setup

```bash
npm install
npm run typecheck
npm run demo:fixture
```

Live media generation is optional and requires keys in `.env`.

## Pull Request Expectations

Keep PRs focused. One prompt family, one adapter, one doc area, or one world-pack change is easier to review than a large mixed update.

For prompt, media, script, character, or style changes, include media proof:

- Behavior addressed.
- Real environment or fixture tested.
- Exact command run.
- Prompt packet or fixture input.
- Before/after output if available.
- Quality scorecard.
- What was not tested.

Typecheck and demo proof:

```bash
npm run typecheck
npm run demo:fixture
```

## AI-Assisted PRs

AI-assisted PRs are welcome. Please say so in the PR body, include the prompt/session context when useful, and confirm you understand the changed code or prompt behavior.

## What We Usually Do Not Want

- Refactor-only PRs without a concrete improvement.
- Huge lore dumps that do not improve generation quality.
- Generic "cinematic" prompts that remove the MineBTC visual identity.
- Provider logs, API keys, production secrets, or private generated assets.
- One-off outputs without the prompt packet needed to reproduce them.

## Maintainer Review Focus

Reviewers should look for:

- Better media quality, not just prettier words.
- Character consistency across generated outputs.
- Clear service boundaries between backend state and creative engine logic.
- Prompt changes that are measurable through fixtures or proof artifacts.
- Safe handling of secrets and generated media.
