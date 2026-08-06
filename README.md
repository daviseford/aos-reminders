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
- Auth0-native cloud armies and opaque sharing
- Bootstrap 5.3, React 19, maintained drag-and-drop, production-only GA4, and a quiet rules-source
  radar, with package modernization continuing

| Area | Status |
| --- | --- |
| AoS 4 data and domain | Complete and machine-verified |
| Capabilities | Printing, importing, cloud armies, and sharing delivered |
| Package modernization | Underway |

The beta gate binds the accepted `aos4-corpus-2026-08-03` revision to a complete automated
review of 81,956 results across 40,982 source/generated pairs, with zero live findings and zero
`cannot-verify` outcomes. Run `yarn data:aos4:verify:beta` to verify the committed evidence without
network or cache access. Future reports and source updates reopen only the affected data through the
candidate pipeline.

Package modernization continues while the accepted data contracts remain stable.

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

Read [AGENTS.md](AGENTS.md) for current scope and constraints.

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
[AGENTS.md](AGENTS.md) for the contribution workflow and repository constraints.

## Community

- [Discord](https://discord.gg/2nt9Fxp)
- [GitHub issues](https://github.com/daviseford/aos-reminders/issues)

AoS Reminders is an unofficial fan-made project and is not endorsed or sanctioned by Games
Workshop.
