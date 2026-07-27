# AGENTS.md

This file applies to the entire repository.

## Project purpose and current state

AoS Reminders is a client-side application that turns an Age of Sigmar army configuration into a phase-ordered set of reminders. It is a React 17, TypeScript, Vite, Redux, and Redux Persist single-page application with a large statically bundled rules corpus.

The checked-in rules and domain model target Age of Sigmar third edition. The repository was retired in July 2024, immediately after fourth edition launched. The next major body of work is a clean migration to Age of Sigmar fourth edition.

Do not confuse these version numbers:

- `package.json` currently reports AoS Reminders `5.2.9`.
- `docs/WHATS_NEW_IN_V4.md` describes the application's own 2020 v4 data-model rewrite.
- "AoS 4" or "fourth edition" in new work means the Games Workshop game edition released in 2024.

## Revival constraints

- Treat AoS 4 as a hard cutover. Do not preserve AoS 3 behavior merely for compatibility.
- Do not build an AoS 3/AoS 4 dual-mode application unless the user explicitly changes direction.
- Persisted Redux state, saved-army schemas, old imports, reminder hashes, and other AoS 3 data do not require compatibility migrations. They may be reset or replaced as part of an approved plan.
- Legacy parser exceptions, typo maps, deprecated-selection maps, old faction aliases, and source-specific fixes may be deleted when their replacement is ready. Do not carry them into a new design by default.
- Preserve reusable product infrastructure where it still earns its keep: reminder presentation, offline behavior, notes, hiding/reordering, save/share flows, and import UX are separate decisions from preserving AoS 3 rules behavior.
- A push to `master` triggers both CI and the production S3/CloudFront deployment. Treat remote `master` as production.

### AoS 3 quarantine and retirement

- Treat every AoS 3 rule, phase, category, alias, importer correction, and data-shape assumption as untrusted legacy behavior. It is not evidence for an AoS 4 fact or schema decision.
- Keep `src/aos4/` dependency-isolated. AoS 4 source code may depend on its own modules, Node built-ins, and third-party libraries, but must not import the old faction, generic-rule, phase, state, type, importer, or reminder-processing modules. Reusable UI and application infrastructure may depend on the AoS 4 boundary, not the reverse.
- Freeze the AoS 3 corpus while the replacement is built. Do not “temporarily” add AoS 4 facts to old faction modules or patch old rules so that new data appears to work.
- The representative cohort is allowed only as a pipeline proof. Before bulk AoS 4 cohort promotion or data entry, cut the migration branch to the AoS 4 runtime and remove the superseded AoS 3 rules corpus and structural utilities. A temporarily incomplete AoS 4-only migration branch is preferable to parallel live rule models.
- Do not leave migrated factions or rules represented in both models. Delete each superseded AoS 3 counterpart in the same cutover tranche that makes its AoS 4 replacement authoritative.
- Track any legacy code retained after cutover as an explicit, bounded infrastructure exception with an owner and deletion condition. “Might still be useful” is not a retention reason.

## Migration program

The revival is intentionally sequenced into two broad phases.

### Phase 1: data and domain correctness

Do this first:

- acquire AoS 4 data from Games Workshop, Wahapedia, and any approved supplementary sources
- preserve source provenance, dates, versions, and reconciliation decisions
- design the canonical AoS 4 schema
- normalize the data into that schema
- replace the AoS 3 timing/phase model and update reminder-generation utilities
- make the minimum UI, state, import, and build changes needed to exercise the new model
- validate faction and core rules against authoritative sources
- establish repeatable completeness, freshness, and conflict checks

The goal is correct, explainable AoS 4 data and behavior. Avoid opportunistic dependency churn during this phase unless a package blocks data work, the build, or safe operation. Record any deliberate exception.

### Phase 2: package and codebase modernization

After the AoS 4 domain model and data pipeline have stabilized:

- upgrade React, Redux, React Router, Vite, TypeScript, and supporting packages
- replace obsolete or unmaintained libraries
- finish the CRA-to-Vite/PWA cleanup
- tighten types and remove dead compatibility code
- modernize tests, state management, API boundaries, and build/deployment configuration
- address performance and bundle architecture with the new data shape in hand

Keep modernization changes behaviorally separate where practical. Do not make reviewers distinguish a rules correction from a framework migration in the same undifferentiated diff.

## Branch and pull-request strategy

Use `aos4-migration` as the long-lived integration branch.

- The integration branch has a draft pull request to `master` titled `AoS Reminders version 4 migration (work in progress)`.
- Never merge that integration PR until the user explicitly authorizes the grand launch.
- Base every migration work branch on the latest `origin/aos4-migration`, not `master`.
- Target migration sub-PRs at `aos4-migration`. Merging a sub-PR should update the long-lived integration PR automatically.
- Do not target ordinary migration PRs directly at `master`.
- Keep the integration branch mergeable and its draft PR description current enough to act as the program-level status page.
- Package/dependency modernization belongs in the same integration program, but should normally begin only after the data/domain phase.
- Local commits, pushes to migration branches, and migration PRs are authorized. Merging PRs, pushing to `master`, deploying, or changing production services still requires explicit user direction.

## Source-of-truth policy

Use this precedence order for rules data:

1. Games Workshop publications and official Warhammer Community downloads are authoritative.
2. Wahapedia's AoS 4 exports are the preferred coherent discovery, normalization, and coverage source.
3. Other community sources may identify gaps but must not silently override an official source.

When sources disagree, preserve the discrepancy and resolve it in favor of the newest applicable official publication. Do not silently overwrite one source with another.

Every normalized rule should eventually retain provenance sufficient to answer:

- What source supplied this value?
- Is the source official or secondary?
- What publication, edition, version, language, and publication/effective date apply?
- When was it retrieved?
- What source URL and content checksum were used?
- Was the value transformed or manually corrected, and why?

Prefer a pipeline with distinct acquisition, normalized-domain, and reminder-projection layers. Do not make downloaded HTML/PDF/CSV shapes the application's permanent domain model.

### Games Workshop

The official starting point is:

`https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/`

The downloads page is a Next.js application whose download list is loaded dynamically. As observed on 2026-07-27, its frontend queried a Warhammer Community production search API and linked versioned PDFs on `assets.warhammer-community.com`. Treat any private JSON endpoint as an unstable implementation detail: isolate it behind an adapter, test its response contract, and retain a browser/page-discovery fallback.

Official documents can supersede earlier documents. Model source precedence and effective dates explicitly rather than editing old facts in place without history.

Do not commit bulk third-party PDFs, scans, or raw copyrighted rules text until the repository's storage and publication policy has been explicitly decided.

### Wahapedia

Prefer Wahapedia's published data export over scraping presentation HTML:

`https://wahapedia.ru/aos4/the-rules/data-export/`

The export specification is:

`https://wahapedia.ru/aos4/Export%20Data%20Specs.xlsx`

The currently documented AoS 4 exports are:

- `Factions.csv`
- `Source.csv`
- `Warscrolls.csv`
- `Warscrolls_abilities.csv`
- `Warscrolls_weapons.csv`
- `Warscrolls_keywords.csv`
- `Warscrolls_bases.csv`
- `Warscrolls_organisation.csv`
- `Warscrolls_RoRfactions.csv`
- `Faction_ability_types.csv`
- `Faction_ability_subtypes.csv`
- `Faction_abilities.csv`
- `Last_update.csv`

They are hosted directly below `https://wahapedia.ru/aos4/`. The files use UTF-8, `|` delimiters, string IDs, textual `true`/`false` booleans, and may contain HTML in description-like fields. Never pass that HTML directly to React; normalize or sanitize it first.

Wahapedia says these exports are intended for research and related interfaces and recommends attribution such as "powered by Wahapedia." Preserve attribution in any future published feature that relies on the exports.

Always inspect `Last_update.csv`, HTTP metadata where available, and source-level dates before importing. Do not assume that every export and visible page changed atomically. In the 2026-07-27 research snapshot, visible site histories were newer than the timestamp returned by `Last_update.csv`.

Wahapedia's `Source.csv` includes source IDs, edition/version data, dates, and official errata/source links. Use those fields to reconcile against Games Workshop, but verify the official target directly.

As of 2026-07-27, `robots.txt` allowed the public `/aos4/` path and advertised an AoS 4 sitemap. Re-check before automated crawling. Cache downloads, use conditional requests where possible, rate-limit politely, and do not crawl faction HTML when the export contains the required data.

Wahapedia itself acknowledges legal uncertainty around the underlying material. It is a useful secondary data set, not a substitute for a content/licensing decision or for official verification.

### Historical content boundary

The current `README.md` explicitly rejects unit stats and points to avoid replacing battletomes. The new direction includes official warscroll and rules discovery, but the exact scope for profiles, points, weapons, and full rules text has not yet been decided. Surface that decision during planning; do not silently broaden the published content boundary.

## Architecture map

### Runtime entry and application shell

- `src/main.tsx` mounts the app and composes Redux, Redux Persist, Auth0, subscription, saved-army, app-status, and theme providers.
- `src/components/App.tsx` defines lazy-loaded React Router v5 routes.
- `src/components/routes/Home.tsx` assembles the faction builder, ally builder, toolbar, reminders, printing, and footer.
- `src/components/page/homeHeader.tsx` owns faction/subfaction switching and selection resets.
- `src/components/input/army_builder.tsx` renders the selection cards produced by `useGetArmyBuilderCards`.
- `src/components/info/reminders.tsx` and `reminder.tsx` render phase groups, visibility controls, notes, source links, and drag ordering.

The app is a PWA descended from Create React App. `src/service-worker.ts` and `src/serviceWorkerRegistration.ts` still contain CRA-era assumptions even though the build moved to Vite.

### Rules corpus and faction composition

- `src/factions/` contains the static faction rules. A faction is split into modules such as units, battle traits, artifacts, command traits, spells, prayers, scenery, and subfactions.
- `src/generic_rules/` contains rules shared across factions.
- `src/meta/factions.ts` defines supported faction identifiers.
- `src/meta/faction_list.ts` eagerly imports every supported faction and is the runtime registry. A directory under `src/factions/` is not necessarily a supported primary faction.
- `src/factions/factionTypes.ts` defines the current compositional shape: entries have `effects`, plus optional `available` and `mandatory` child collections.
- `src/factions/metatagger.ts` supplies `tagAs`, `keyPicker`, `keyOmitter`, and `pickEffects`.
- `src/factions/factionClass.ts` creates subfaction armies and an aggregate army.
- `src/factions/temporaryAdapter.ts` converts dictionary-shaped faction data into the array-heavy `IArmy` model. Despite its name, it is central production code.
- `src/factions/sample/` is the contributor template, but compare it with a recently maintained faction before copying it.

Subfactions describe the catalogs available to that choice. A selected unit, flavor, battalion, or other entry can recursively make other selections mandatory. This relationship powers automatic selection side effects.

### Army and reminder data flow

The central flow is:

`faction modules -> Faction/temporaryAdapter -> getArmy -> processGame -> Redux selections -> processReminders -> reminder UI`

Key files:

- `src/utils/getArmy/getArmy.ts` chooses a subfaction or aggregate army, adds generic/grand-alliance content, and builds the phase-indexed game structure.
- `src/utils/getArmy/getCollection.ts` discovers legacy tagged effects and preferred `mandatory` relationships.
- `src/utils/getArmy/modify.ts` merges generic, faction, allied, and discovered entries and tags selection categories.
- `src/utils/processGame.ts` expands every entry effect into one action per `when` value.
- `src/utils/getSideEffects.ts` recursively finds mandatory selections.
- `src/utils/withSelect.ts` dispatches parent selections and their automatic side effects.
- `src/utils/processReminders.ts` filters the precomputed game structure by selected names, adds faction/subfaction/realmscape effects, merges identical rules, and orders phases.
- `src/utils/reminderUtils.ts` hashes phase, name, and description into reminder IDs.

Current identity is heavily name-based. Reminder IDs also change whenever wording or timing changes; notes, visibility, and stored ordering depend on those IDs. AoS 4 should prefer stable source/domain identifiers.

### State and persistence

- `src/store/index.tsx` creates the Redux store and persists it to local storage.
- `src/store/initialAppState.ts` defines the full default state.
- `src/ducks/` contains Redux Toolkit slices for army data, names, selections, notes, realmscape, and visibility.
- `src/ducks/selections.ts` contains non-trivial cleanup logic for automatic side effects.
- `src/context/useSavedArmies.tsx` coordinates local cache, remote saved armies, reminder ordering, and change detection.
- `src/utils/localStore.ts` contains local-storage wrappers.
- `src/types/savedArmy.ts` and `src/utils/loadArmy/` define the saved-army boundary.

Redux Persist is currently version 4 and wipes pre-v4 application state. The AoS 4 cutover may deliberately bump/reset persistence instead of migrating AoS 3 selections.

### Importers

Legacy army-list importers live under:

- `src/utils/warscroll/` for Warscroll Builder JSON/PDF
- `src/utils/azyr/` for Azyr PDF
- `src/utils/battlescribe/` for Battlescribe HTML
- `src/utils/warhammer_app/` for Warhammer App text
- `src/utils/import/` for shared normalization, aliasing, side effects, warnings, and error handling
- `src/components/input/importPdf/` for file detection and browser-side PDF extraction

`src/utils/import/options.ts` is intentionally full of historical aliases, typo maps, ambiguous names, ignored values, and deprecated selections. It is not a good foundation for a clean AoS 4 canonical model.

Be aware that browser import failures can be uploaded to the preference API when the app is online. Use repository fixtures or confirmed non-sensitive data during development.

### APIs, subscriptions, and deployment

- `src/api/preferenceApi.ts` talks to the separate saved-army/preference backend.
- `src/api/subscriptionApi.ts` talks to the separate subscription backend.
- `src/auth_config.json` configures Auth0.
- `src/utils/env.ts` contains legacy environment detection, public payment identifiers, routes, and API-related constants.
- Backend repositories referenced by `README.md` are private and are not part of this workspace.
- `.github/workflows/nodejs.yml` runs install, lint, tests, and build for `master` and pull requests.
- `.github/workflows/deploy.yml` deploys every pushed `master` build to S3 and invalidates CloudFront.

Do not exercise payment, subscription, destructive preference, or production deployment flows as part of rules migration verification.

## Why AoS 4 does not fit the current model

The current `TEffects` shape is essentially `name + desc + when + optional category flags + rule sources`. The current `TTurnWhen` model hard-codes an AoS 3 sequence with hero, movement, shooting, charge, combat, and battleshock phases, plus synthetic save/ward/wound buckets and round-specific variants.

AoS 4 data needs a more expressive ability model. Wahapedia's export demonstrates fields and distinctions such as:

- battle formations and heroic traits
- manifestation lores
- passive and deployment abilities
- start-of-turn and end-of-turn timing
- "Your" versus "Any" phase
- reactions, including defensive reactions
- declare/effect structure and targets
- once-per-turn, once-per-round, once-per-battle, and army-wide scopes
- ability and warscroll keywords
- spell, prayer, command, and faction-resource costs
- regiment options, Regiments of Renown, and Armies of Renown
- source/version metadata
- Legends, supplements, seasonal content, and Spearhead

Do not encode these distinctions as more boolean flags or an ever-larger phase enum without first designing the AoS 4 domain model. Keep exact source timing text available even when also normalizing it for sorting.

The following current structures are cross-cutting and will need coordinated replacement or deliberate adaptation:

- selection unions and lookups in `src/types/selections.ts` and `src/types/data.ts`
- `IArmy` in `src/types/army.ts`
- phase constants and `Game` in `src/types/phases.ts` and `src/meta/game_structure.ts`
- initial Redux state and selection reducers
- faction composition and registry
- builder card construction
- `processGame`, side effects, and `processReminders`
- saved/share schemas
- all legacy importers and their fixtures
- PDF output and reminder ordering/hashing

## Development conventions

- Use the Node version in `.nvmrc` (`v20.15.1`) and Yarn Classic with the committed `yarn.lock`.
- TypeScript has `strict` enabled, but `noImplicitAny` is explicitly disabled.
- Imports use Vite/TypeScript aliases such as `components`, `ducks`, `factions`, `generic_rules`, `meta`, `store`, `types`, and `utils`.
- Prettier uses two spaces, no semicolons, single quotes, a 110-character print width, and ES5 trailing commas.
- Prefer `satisfies` on static data dictionaries so keys remain narrow while shapes are checked.
- Do not edit generated `build/`, `dist/`, or spreadsheet exports.
- Keep source acquisition/network logic out of React components.
- Treat names as display text, not durable identifiers, in new code.
- Do not introduce a second compatibility representation of AoS 3 inside the new AoS 4 types.

## Commands and verification

Install:

```powershell
yarn install --frozen-lockfile
```

Run the Vite development server:

```powershell
yarn start
```

Vite defaults to `http://localhost:5173`; the `README.md` still says port 3000 from the CRA era. Verify any Auth0, redirect, and `BASE_URL` behavior when working on browser integrations.

Safe non-mutating checks:

```powershell
yarn lint
yarn tsc --noEmit
yarn test --run
yarn build
```

Use `--run` for a one-shot local Vitest run; plain `yarn test` is watch-oriented outside CI. Run a focused test with:

```powershell
yarn vitest run src/tests/processReminders.test.ts
```

Baseline observed on 2026-07-27:

- ESLint passed.
- TypeScript passed.
- 23 Vitest files passed with 494 tests.
- The Vite production build passed.
- The production bundle emitted large-chunk warnings; the main application chunk was about 2.19 MB minified (550 KB gzip), reflecting the eagerly bundled rules corpus.

Mutation warnings:

- `yarn clean` rewrites faction and generic-rule files to normalize punctuation and wording, then exits non-zero if it changed anything.
- `yarn format` rewrites matching source files across the repository.
- `yarn prepush` runs clean, format, lint fixes, TypeScript, and tests; do not use it as a harmless read-only check.
- `yarn xlsx`/`yarn xlsx:win` write spreadsheet exports.
- `yarn verify`/`yarn verify:win` use `ts-node-dev --respawn` and are interactive/long-running.

Inspect the diff after any corpus-wide command. Never mix accidental bulk normalization with a rules or architecture change.

## Testing guidance

- Much of the test tree is historical import fixture data. There are 23 current test files plus hundreds of PDF, JSON, HTML, and text fixtures.
- Existing core coverage exercises faction lookup/composition, mandatory collections, reminder generation, Redux unit side effects, and all four legacy import families.
- Follow `docs/CONTRIBUTING.md`: avoid tests that fail only because official wording changed. Test relationships, normalization, timing classification, provenance, and reminder projection.
- For source ingestion, keep small representative fixtures and contract tests. Do not make routine tests depend on live Wahapedia or Games Workshop availability.
- Add explicit reconciliation tests for conflicting versions, stale secondary data, missing joins, duplicate names, HTML sanitization, and source precedence.
- A clean cutover permits replacing AoS 3 tests and fixtures. Delete obsolete coverage when the corresponding feature is intentionally removed; do not keep tests green by preserving unwanted compatibility code.

## Working approach for the migration

Before bulk data entry:

1. Inventory the AoS 4 concepts and decide the canonical domain schema.
2. Decide the legal/content boundary for full text, warscroll profiles, weapons, and points.
3. Define official-source discovery and immutable provenance records.
4. Define Wahapedia import adapters and freshness/reconciliation checks.
5. Build a thin vertical slice for one representative faction, including reminders and tests.
6. Validate the slice against current official documents.
7. Cut the migration branch to the AoS 4 runtime and delete the AoS 3 rules path.
8. Only then automate or parallelize the rest of the faction corpus.

Choose a representative faction that exercises battle traits, a battle formation, heroic traits, artefacts, spell/prayer or manifestation lore, unit abilities, reactions, and current source updates. Do not begin with hundreds of mechanical conversions that merely recreate the AoS 3 shape.
