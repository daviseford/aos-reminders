# Contributing to AoS Reminders

AoS Reminders version 6 is the clean fourth-edition cutover. Its data-and-domain phase is complete,
capability restoration has delivered printing, importing, cloud armies, and sharing, and Phase 2
package modernization continues. Read the root [AGENTS.md](../AGENTS.md) for current scope and
constraints. The
[Phase 1 plan](plans/2026-07-27-001-refactor-aos4-domain-and-data-pipeline-plan.md) is retained as
completed requirements and decision history.

The accepted corpus is machine-verified for beta use. Beta reports do not justify direct edits to
generated data: confirm each report against current official sources, correct the candidate
pipeline, add regression coverage, and produce a new checksum-bound certification.

## Branching

- Base ordinary work on `origin/master` and target pull requests at `master` unless a new
  integration branch is explicitly established. The retired `aos4-migration` integration branch
  merged into `master` with release PR #1717; do not base new work on it.
- Never push `master` directly. A merge or push to `master` deploys production and requires explicit
  project-owner authorization.
- Keep rules/data corrections separate from Phase 2 package modernization where practical.

## Data contributions

Do not add hand-authored faction modules or copy AoS 3 structures from Git history.

Games Workshop sources are authoritative. Wahapedia AoS 4 exports and bounded current faction
pages are the preferred coherent secondary sources. A data change should include:

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
yarn data:aos4:candidate \
  --wahapedia-pages-file <reviewed-json-url-list> \
  --official-urls-file <reviewed-json-url-list> \
  --output <new-directory>
```

Use accepted-manifest offline replay for reproducible investigation:

```bash
yarn data:aos4:candidate \
  --accepted-manifest <manifest-path> \
  --faction <Wahapedia-faction-id> \
  --offline \
  --output <new-directory>
```

Use `--wahapedia-page` for explicitly reviewed faction collection/root pages and `--faction` to
create a bounded, non-verbatim review inventory before proposing a faction cohort. A report marked
`blocked` must not be promoted.

The current accepted snapshot is generated with:

```bash
yarn data:aos4:generate
```

That command is a no-write drift check. It verifies cached artifact checksums, reviewed official
PDF page checksums, the identity registry, catalog integrity, and every generated product. After an
accepted manifest/review change, use `yarn data:aos4:generate:write`, inspect the complete diff, and
then run the no-write command again. Never edit generated corpus JSON by hand.

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
yarn data:aos4:generate
yarn data:aos4:verify:beta
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

State whether a change affects production configuration or requires coordinated companion-service
work. Do not merge a production-targeting PR without explicit project-owner authorization.
