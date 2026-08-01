# AoS Reminders

AoS Reminders turns an Age of Sigmar army configuration into phase-ordered reminders.

## Version 6 and Age of Sigmar fourth edition

Version 6.0.0 is the clean cutover to Age of Sigmar fourth edition. The release was assembled in
[PR #1717](https://github.com/daviseford/aos-reminders/pull/1717) and merged to `master` on
2026-07-31; `master` is the primary development and production branch, and every push to it
deploys the site.

The release provides:

- an AoS 4 canonical domain model for timing, abilities, weapons, warscrolls, battle profiles,
  relationships, rules contexts, and provenance
- safe Games Workshop and Wahapedia acquisition adapters
- deterministic reconciliation, identity, audit, and runtime-generation tools
- an accepted, source-traceable corpus covering 27 playable armies plus the universal Endless
  Spells source container: 1,286 warscrolls, 1,002 battle profiles, 4,898 abilities, 2,260 weapons,
  and 1,409 content groups
- explicit current-standard, General's Handbook 2026-27 (`Scourge of Aqshy`), Spearhead, Legends,
  and historical rules contexts so parallel or retired records cannot leak into the current
  builder
- an official battle-profile ledger that dispositions all 1,350 extracted GW facts and keeps 12
  profile-only gaps visible without inventing missing warscroll rules
- a responsive AoS 4 builder/reminder screen with notes, hiding, focus mode, printing/PDF export,
  and local persistence
- official-app, Listbot, and New Recruit `.ros`/`.rosz`/`.json` roster imports
- Auth0-native cloud armies and opaque sharing, pending the coordinated production API rollout
- Bootstrap 5.3, React 19, maintained drag-and-drop, production-only GA4, and a quiet rules-source
  radar while broader Phase 2 modernization continues
- a hard clean cut: no AoS 3 rules, state, importers, or compatibility behavior remain

| Program stage | Status |
| --- | --- |
| Phase 1: AoS 4 data and domain | Complete and machine-verified for beta use |
| Phase 2: capabilities and modernization | Capability restoration delivered; modernization underway |
| Version 6 production launch | Release candidate; see [the release runbook](docs/release.md) |

The Phase 1 beta gate binds the accepted `aos4-corpus-2026-07-30` revision to a complete automated
review of 79,598 results across 39,799 source/generated pairs, with zero live findings and zero
`cannot-verify` outcomes. Run `yarn data:aos4:verify:beta` to verify the committed evidence without
network or cache access. Future beta reports and source updates reopen only the affected data
through the candidate pipeline; they do not restart the completed migration.

Phase 2 continues after this release while the accepted AoS 4 data contracts remain stable. The
Auth0 subscription and private army/share implementations are prepared in launch-hardening PRs,
but their production rollout and live negative checks remain tracked in
[#1720](https://github.com/daviseford/aos-reminders/issues/1720) and
[#1804](https://github.com/daviseford/aos-reminders/issues/1804). Do not describe either production
gate as complete until those checks pass.

## Sources

Games Workshop publications are authoritative. Wahapedia's AoS 4 exports and bounded current
faction pages provide the coherent secondary dataset used for discovery and coverage.

- [Official Age of Sigmar downloads](https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/)
- [Wahapedia AoS 4 data export](https://wahapedia.ru/aos4/the-rules/data-export/)

Accepted data retains immutable artifact and record checksums, source locators, dates, rules
contexts, and transformation evidence. The runtime does not fetch source data.

## Development

Use Node `v22.23.2` and Yarn Classic.

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
yarn data:aos4:verify:beta
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

Read [AGENTS.md](AGENTS.md) for the current Phase 2 scope and migration constraints. The
[Phase 1 plan](docs/plans/2026-07-27-001-refactor-aos4-domain-and-data-pipeline-plan.md) remains the
completed requirements and decision history.

## Companion repositories

- [REST API](https://github.com/daviseford/aos-reminders-rest-api)
- [Subscription API](https://github.com/daviseford/aos-reminders-subscription-api)
- [Subscription admin console](https://github.com/daviseford/aos-reminders-admin)

These companion repositories are private.

## Pull requests and deployment

Normal pull requests target `master` unless a new integration branch is explicitly established.
Every push to `master` builds and deploys the production site to S3/CloudFront, so merging or
pushing it requires explicit project-owner authorization.

See [the release runbook](docs/release.md) for production gates and post-deploy validation, and
[CONTRIBUTING.md](docs/CONTRIBUTING.md) for the normal contribution workflow.

## Community

- [Discord](https://discord.gg/2nt9Fxp)
- [GitHub issues](https://github.com/daviseford/aos-reminders/issues)

AoS Reminders is an unofficial fan-made project and is not endorsed or sanctioned by Games
Workshop.
