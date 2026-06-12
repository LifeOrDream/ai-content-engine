# MineBTC AI Content Engine Docs

Start here if you are trying to understand or contribute to the open-source engine.

## Read In This Order

1. [Architecture](architecture.md)
2. [NFT Asset Pipeline](nft-pipeline.md)
3. [Base Types](base-types.md)
4. [Media Proof and Evals](evals-and-media-proof.md)
5. [World Packs](world-packs.md)
6. [Provider Adapters](provider-adapters.md)
7. [Trailer Pipeline](../trailer/README.md)
8. [Contributing](../CONTRIBUTING.md)

## Contributor Promise

You should be able to improve the engine without access to MineBTC production secrets.

The no-key path is:

```bash
npm install
npm run demo:fixture
```

Live media generation requires provider keys and should always include proof artifacts in the PR.
