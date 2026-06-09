# Media Proof and Evals

Prompt changes are not useful unless they improve real outputs. This repo treats media proof as a first-class contribution artifact.

## Minimum Proof For Prompt Or Video Changes

Every PR that changes prompts, style, scripts, media adapters, or world-pack definitions should include:

- Behavior addressed.
- Exact command or generation route.
- Prompt packet or fixture used.
- Before/after frame or clip when available.
- Model/provider used.
- Cost estimate if live generation ran.
- What was not tested.

## Quality Scorecard

Use a 1-5 score for each category:

| Category | What To Check |
| --- | --- |
| Character consistency | Breed, silhouette, outfit family, gear, expression, and role stay stable. |
| Brand fit | Looks like premium bright HashBeast show art, not generic 3D/anime/crypto ad. |
| Dialogue | Character voice, stakes, rhythm, and subtext feel like a show, not a pitch deck. |
| Motion | Camera, body acting, power effects, and shot timing fit the scene. |
| Story continuity | Uses canon memory and advances arcs without contradiction. |
| Platform fit | Works in intended aspect ratio and keeps action center-safe. |
| Artifact risk | Notes text glitches, extra limbs, muddy grade, identity drift, lip-sync issues. |

## No-Key Eval Path

```bash
npm run demo:fixture
```

This validates prompt-packet construction without calling paid providers.

## Future Eval Targets

- `eval:script`: lint screenplay structure, dialogue length, banned phrases, and story continuity.
- `eval:keyframe`: lint keyframe prompt requirements and reference ordering.
- `eval:media-manifest`: validate generated media metadata, refs, cost, duration, and scorecard completeness.
- `eval:regression-pack`: compare known fixtures against expected prompt and quality constraints.
