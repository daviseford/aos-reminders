# AoS Reminders

AoS Reminders turns an Age of Sigmar army configuration into phase-ordered reminders.

## AoS 4 migration status

The repository is being revived as a clean Age of Sigmar fourth-edition application. Migration work
is isolated behind the long-lived `aos4-migration` branch and its draft pull request; `master`
remains the production branch.

The migration workbench currently provides:

- an AoS 4 canonical domain model for timing, abilities, weapons, warscrolls, battle profiles,
  relationships, rules contexts, and provenance
- safe Games Workshop and Wahapedia acquisition adapters
- deterministic reconciliation, identity, audit, and runtime-generation tools
- an accepted, source-traceable corpus covering all 28 decoded factions, 1,268 warscrolls,
  1,002 battle profiles, 4,260 abilities, and 2,247 weapons
- explicit current-standard, General's Handbook 2026-27 (`Scourge of Aqshy`), Spearhead, Legends,
  and historical rules contexts so parallel or retired records cannot leak into the current
  builder
- an official battle-profile ledger that dispositions all 1,350 extracted GW facts and keeps 12
  profile-only gaps visible without inventing missing warscroll rules
- a responsive AoS 4 builder/reminder screen with notes, hiding, focus mode, printing, and local
  persistence
- a hard clean cut: no AoS 3 rules, state, importers, or compatibility behavior remain

Phase 1's game structure and accepted data pipeline are complete for the pinned 2026-07-27
snapshot. This is not launch authorization: do not deploy or merge the migration PR to `master`
until the migration is explicitly approved.

## Sources

Games Workshop publications are authoritative. Wahapedia's AoS 4 exports and bounded current
faction pages provide the coherent secondary dataset used for discovery and coverage.

- [Official Age of Sigmar downloads](https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/)
- [Wahapedia AoS 4 data export](https://wahapedia.ru/aos4/the-rules/data-export/)

Accepted data retains immutable artifact and record checksums, source locators, dates, rules
contexts, and transformation evidence. The runtime does not fetch source data.

## Development

Use Node `v20.15.1` and Yarn Classic.

```bash
yarn install --frozen-lockfile
yarn start
```

Vite serves the application at `http://localhost:5173` by default.

Verification:

```bash
yarn lint
yarn tsc --noEmit
yarn test --run
yarn build
```

Full candidate acquisition is a deliberate network operation:

```bash
yarn data:aos4:candidate --output <new-directory>
```

Candidate output is never accepted automatically. See [AoS 4 data maintenance](docs/data/aos4-maintenance.md)
for acquisition, offline replay, review, override, identity, and generation policy.

Verify the accepted snapshot and every generated checksum from the local artifact cache:

```bash
yarn data:aos4:generate
```

## Architecture

The AoS 4 implementation lives under `src/aos4/`:

- `domain/` — canonical contracts and validation
- `normalize/` — safe text and timing normalization
- `data/` — source acquisition and provider adapters
- `reconcile/` — fact linking, precedence, conflicts, and overrides
- `select/` — stable-ID relationship resolution
- `reminders/` — stable reminder projection and ordering
- `state/` and `runtime/` — versioned army documents and browser persistence
- `view/` — pure builder/reminder presentation models
- `generate/` and `generated/` — deterministic accepted outputs

Read [AGENTS.md](AGENTS.md) before changing the migration and
[the Phase 1 plan](docs/plans/2026-07-27-001-refactor-aos4-domain-and-data-pipeline-plan.md) for
requirements and sequencing.

## Pull requests and deployment

Migration PRs target `aos4-migration`, never `master`. Every push to `master` builds and deploys the
production site to S3/CloudFront.

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for the current contribution workflow.

## Community

- [Discord](https://discord.gg/2nt9Fxp)
- [GitHub issues](https://github.com/daviseford/aos-reminders/issues)

AoS Reminders is an unofficial fan-made project and is not endorsed or sanctioned by Games
Workshop.
