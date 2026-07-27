# Contributing to the AoS 4 migration

AoS Reminders is undergoing a clean fourth-edition migration. Read the root
[AGENTS.md](../AGENTS.md) and the active
[Phase 1 plan](plans/2026-07-27-001-refactor-aos4-domain-and-data-pipeline-plan.md) first.

## Branching

- Base migration work on the latest `origin/aos4-migration`.
- Target migration pull requests at `aos4-migration`.
- Never push or merge `master`; it is the production deployment branch.
- Keep rules/data corrections separate from Phase 2 package modernization where practical.

## Data contributions

Do not add hand-authored faction modules or copy AoS 3 structures from Git history.

Games Workshop sources are authoritative. Wahapedia AoS 4 exports are the preferred coherent
secondary source. A data change should include:

- source artifact metadata and SHA-256 checksum
- source-record locator/checksum
- applicable rules context and source dates
- a normalized canonical fact
- any reconciliation conflict or reviewed override
- a stable identity-registry update when a new canonical entity is accepted
- deterministic audit/runtime generation
- tests for the behavior or provider contract

Downloaded raw source bodies belong in the ignored `.cache/aos4/` tree, not Git. Do not commit bulk
PDFs or full raw rule text.

Follow [the data-maintenance runbook](data/aos4-maintenance.md). Candidate acquisition is review
input and cannot promote itself into runtime:

```bash
yarn data:aos4:candidate --output <new-directory>
```

Use accepted-manifest offline replay for reproducible investigation:

```bash
yarn data:aos4:candidate \
  --accepted-manifest <manifest-path> \
  --offline \
  --output <new-directory>
```

## Code contributions

- Keep canonical and pipeline code under `src/aos4/`.
- `src/aos4/` must not import application modules outside that directory.
- Use stable canonical IDs for relationships, state, and reminder identity.
- Preserve unknown provider values as diagnostics instead of coercing them.
- Keep network and Node-only code out of React/runtime modules.
- Never render downloaded HTML directly.
- Do not restore retired Redux, faction, phase, saved-army, or importer modules.

The legacy-isolation test guards these boundaries.

## Tests

Routine tests must be deterministic and offline. Use small representative fixtures rather than live
network calls or complete copyrighted documents.

Run:

```bash
yarn lint
yarn tsc --noEmit
yarn test --run
yarn build
```

Add focused coverage for:

- source decoder contract changes
- unsafe or malformed HTML/text
- unknown timing and weapon values
- missing or duplicate joins
- stale secondary data
- conflicting official and secondary facts
- reviewed overrides and source dispositions
- stable identity and byte-deterministic generation
- selection causes, reminder order, persistence, and source traceability

Avoid assertions that fail only because Games Workshop changed wording. Assert normalized
semantics, relationships, provenance, and diagnostics.

## Pull-request descriptions

Explain:

- what cohort, contract, or structural behavior changed
- which sources and effective dates were used
- how conflicts and diagnostics were dispositioned
- whether generated files changed and from which accepted inputs
- which verification commands passed
- known coverage gaps

Do not mark the long-lived integration PR ready or merge it without explicit project-owner
authorization.
