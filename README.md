# ContractSpec Labs Starter

This repository is a **template/starter** used to scaffold:
- **Design-partner pilots** (external teams)
- **Internal experiments** (new features, new surfaces, new generators)

It’s intentionally built to be **fast to clone, safe to share, and easy to throw away** once the learning is extracted.

## Why this exists

Most “pilots” die because setup is slow, expectations are fuzzy, and the work accidentally turns into bespoke consulting.

This starter forces a consistent approach:
- start from a contract/spec (even imperfect)
- generate useful outputs quickly
- validate assumptions early
- keep the scope small and measurable

## What this starter is for

- Turning an API reference (OpenAPI, ReadMe-backed OpenAPI, existing schema docs) into **typed frontend leverage**
- Producing **stable developer experience artifacts** (types, clients, docs surfaces, mockability)
- Running **non-invasive contract checks** to detect drift between “what docs say” and “what the API does” (when a safe endpoint is available)
- Building a tiny demo slice that proves value without needing access to production or internal repos

## What this starter is NOT

- Not a backend rewrite.
- Not a mandate on architecture, frameworks, or infra.
- Not a long-term SDK commitment.
- Not a place to dump partner secrets, production data, or private code.

## Design-partner mode

This starter is optimized for partners with minimal bandwidth:
- we keep asks tiny (a contract/spec + auth constraints + 1–2 key endpoints / user journeys)
- we do the heavy lifting asynchronously
- we treat the output as disposable unless it proves value

### Success looks like
- A meaningful UI/feature slice ships faster with fewer regressions
- Contract changes propagate cleanly (typed breakages are explicit, not silent)
- Drift becomes visible early (optional validation), instead of becoming a late-stage surprise

## Contract philosophy

- The contract is the **source of truth** (even if the first version is incomplete).
- Generated outputs are **derived artifacts** and should be reproducible.
- Guardrails matter: the point is not “generate more code,” it’s **reduce ambiguity and prevent drift**.

## Security and privacy

- Keep this repo **private by default** for design partners.
- Never commit tokens, credentials, customer data, or internal URLs that shouldn’t leak.
- Use sanitized examples for demos and screenshots.
- If anything needs to become public later, do it by extracting a clean, generic subset into a separate repository.

## Maintainers & ownership

This repo is maintained by the ContractSpec team as a starter template.
Partner-specific work should remain scoped, documented, and easy to archive.

If we extract reusable tooling from a pilot, it should move to a dedicated repo with a clear OSS/commercial license.
