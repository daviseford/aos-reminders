# AGENTS.md

This file applies to the entire repository.

## Project purpose and current state

AoS Reminders turns an Age of Sigmar army configuration into phase-ordered reminders.

The migration branch is now an Age of Sigmar fourth-edition-only workbench:

- the browser runtime uses the canonical model under `src/aos4/`
- the checked-in catalog is a deliberately small Stormcast Eternals representative cohort
- the AoS 3 faction corpus, rule utilities, Redux state, saved-army schema, importers, and fixtures
  have been removed
- old browser state is deleted and replaced with a schema-valid AoS 4 document; it is never
  translated
- full-corpus candidate acquisition exists, but candidate output is not accepted runtime data
- all 28 factions have non-verbatim cohort inventories; 16 are reviewable and 12 retain automated
  blockers, while the runtime remains the representative slice
- package upgrades and broader framework modernization remain Phase 2 work

Do not confuse these version numbers:

- `package.json` reports the application version (`5.2.9`)
- “AoS 4” means the Games Workshop game edition released in 2024
- the AoS 4 army-document and catalog schema versions are independent internal contracts

## Non-negotiable migration constraints

- Treat AoS 4 as a hard cutover. Do not recreate an AoS 3 compatibility path or dual-mode app.
- No AoS 3 rule, timing, phase, category, alias, importer correction, fixture, or data shape is
  evidence for an AoS 4 fact or design decision.
- Do not restore deleted AoS 3 modules to make a feature convenient. Implement the feature against
  stable AoS 4 IDs and current sources.
- `src/aos4/` may depend only on its own modules, Node built-ins, and third-party packages.
  Application code may depend inward on `src/aos4/`; the domain layer must not depend outward.
- Keep source acquisition and reconciliation out of React components.
- Treat names as display text, never durable identity.
- Do not hand-edit generated catalog modules as a substitute for the acquisition/review/generation
  process.
- A temporarily incomplete AoS 4-only app is preferable to parallel live rule models.
- A push to `master` triggers production deployment. Never push or merge `master` without explicit
  user authorization.

`src/tests/aos4/legacyIsolation.test.ts` enforces the AoS 4 dependency boundary and the physical
absence of retired paths.

## Product and interface continuity

The live application at `https://aosreminders.com/` is the visual and interaction baseline. The
community trusts that experience; an AoS 4 data/domain migration does not authorize a redesign.

- Preserve the established dark-blue masthead, typography, spacing, edit/play control, faction
  selector, teal selection cards, reminder cards, notes, hide/show behavior, responsive layout,
  print behavior, footer, and contact/disclaimer treatment.
- Preserve the account-facing shell: the signed-out `Subscribe`, `FAQ`, and `Log in` navigation;
  Auth0 hosted login; authenticated `Profile` and `Log out` navigation; subscription status and
  cancellation; and subscriber theme behavior.
- Compare UI changes directly against the live site at desktop and mobile widths before accepting
  them. Browser snapshots and tests should guard recognizable landmarks and account navigation.
- Treat every visible UI delta as a code smell during Phase 1. Structural work should leave
  navigation, authentication, subscription/profile flows, FAQ, footer, typography, spacing,
  responsive behavior, and interaction labels unchanged.
- The expected exceptions are data-driven: AoS 4 phase names, content-group cards, selections,
  reminder text, and other fields whose source data or game structure genuinely changed. Reuse the
  established visual primitives for those exceptions.
- Bind the AoS 4 domain and army document to the established presentation with adapters/view
  models. Do not restore AoS 3 rules, Redux, importers, or saved-army data merely to reuse the UI.
- Remove or rewrite stale AoS 3 copy and feature claims while retaining the surrounding visual
  hierarchy and interaction pattern.
- Do not add a migration-workbench aesthetic, new visual language, or broad reskin unless the user
  explicitly requests one.

The restored subscription API is a migration-only compatibility risk: its shared browser key is
public and its account operations are not authorized with the user's Auth0 token. An
Auth0-protected route is not API authorization. Production launch is blocked until the backend
verifies Auth0 bearer tokens, derives account ownership server-side, rejects cross-account access,
rotates the shared key, and passes negative authorization tests. Preserve the familiar account UI
while this work is explicitly tracked; do not describe the current API as secure.

## Migration program

### Phase 1: data and domain correctness

Phase 1 has two parts:

1. Structural correctness: canonical phases/windows, abilities, reactions, usage limits, weapons,
   warscrolls, profiles, relationships, selection, reminders, state, and the minimal runtime.
2. Data retrieval and entry: safe acquisition, source-specific decoding, reconciliation, review,
   stable identities, generation, and coverage/freshness reporting.

The representative vertical slice and AoS 4 runtime cutover are complete. The next body of work is
reviewed corpus expansion through the AoS 4-only pipeline. Do not promote the live candidate
snapshot wholesale: resolve or explicitly disposition its diagnostics and review a bounded cohort.
The current candidate has one unresolved timing pending formal official-source reconciliation, one
reviewed phase-independent active timing, 177 reported disagreements with the non-canonical
`ability_phase` metadata, 13 contradictory reaction flags, and two missing Regiment of Renown
faction joins.

Avoid dependency churn during Phase 1 unless a package blocks correct data work, the build, or safe
operation.

### Phase 2: package and codebase modernization

After the AoS 4 domain and data pipeline stabilize:

- upgrade React, Vite, TypeScript, Sass, PWA tooling, and supporting packages
- remove packages made unused by the AoS 3 retirement
- replace obsolete or unmaintained libraries
- finish CRA-to-Vite/PWA cleanup
- tighten compiler and lint settings
- redesign API/auth/subscription/save/share capabilities against AoS 4 contracts as needed
- address bundle and deployment architecture
- rebuild capabilities the cutover removed against AoS 4 contracts, starting with printing and PDF
  export (`src/aos4/print/`, documented in `docs/printing.md`)

Keep framework migration separate from rules/data corrections where practical.

The jsPDF upgrade (`1.5.3`, using APIs removed in 2.x) is outstanding Phase 2 work. It is now
confined to `src/aos4/print/pdf.ts`.

## Branch and pull-request strategy

Use `aos4-migration` as the long-lived integration branch.

- The integration branch has a draft PR to `master` named
  `AoS Reminders version 4 migration (work in progress)`.
- Never merge that integration PR until the user explicitly authorizes launch.
- Base migration work on the latest `origin/aos4-migration`.
- Target migration sub-PRs at `aos4-migration`, not `master`.
- Local commits and pushes to migration branches are authorized.
- Merging PRs, pushing `master`, deploying, or changing production services requires explicit
  direction.

## Source-of-truth policy

Use this precedence:

1. Games Workshop publications and official Warhammer Community downloads are authoritative.
2. Wahapedia AoS 4 exports are the preferred coherent discovery and coverage source.
3. Other community sources may identify gaps but may not silently override official material.

When sources disagree, preserve the discrepancy. Resolve it in favor of the newest applicable
official publication, or leave it unresolved for review.

Every accepted fact must be traceable to:

- publisher and authority classification
- publication/edition/version/language
- publication and effective dates when known
- retrieval timestamp and source URL
- immutable content checksum
- source-record locator and checksum
- transformation or manual-override rationale
- applicable rules context

Acquisition bytes, normalized facts, accepted domain entities, and reminder projections are
separate layers. Never make a PDF/HTML/CSV provider shape the application’s permanent model.

### Games Workshop

Start official discovery at:

`https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/`

The downloads UI and private JSON endpoints may change. Keep endpoint knowledge inside the adapter,
test its contract, and retain official-page/PDF fallback discovery. Versioned PDFs on
`assets.warhammer-community.com` are accepted by the acquisition allowlist.

Official documents supersede earlier material. Preserve version/effective-date history instead of
silently mutating provenance.

### Wahapedia

Prefer the published export to presentation-page scraping:

`https://wahapedia.ru/aos4/the-rules/data-export/`

Current export files:

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

The files are UTF-8, pipe-delimited, and use string IDs and textual booleans. Descriptive fields may
contain HTML. Normalize to safe text; never pass downloaded HTML directly to React.

Preserve “Powered by Wahapedia” attribution for published features derived from the exports.
Re-check `robots.txt`, rate-limit requests, cache immutable bytes, and prefer offline replay during
development.

### Content boundary

The representative runtime commits short curated reminder summaries, profiles, points, and weapon
characteristics with source references. It does not commit bulk third-party PDFs or full raw rule
bodies. Test fixtures and unknown-authority artifacts must never supply player-facing runtime
content; generation integrity rejects them. Do not broaden that publication boundary without an
explicit decision.

## AoS 4 architecture

### Canonical domain

`src/aos4/domain/` defines:

- stable branded canonical IDs
- seven ordered turn phases plus battle/deployment/round/phase-independent/triggered-reaction/
  always/unknown windows; round boundaries may carry a specific positive battle-round number
- active, reaction, and passive ability timings
- perspective, combat priority, and scoped usage limits
- declare/trigger/effect text
- weapons and structured keywords
- factions, content groups, warscrolls, battle profiles, publications, and relationships
- rules contexts, source artifacts, source records, and field-level references
- catalog validation

Unknown source values are retained explicitly for review. Do not coerce them into a nearby known
enum merely to make generation pass.

An active timing with a valid usage limit but no named phase uses the `phase-independent` window.
Wahapedia's lossy `ability_phase` field is review evidence only and must never create a canonical
timing. A missing or unclassifiable condition stays blocked until formal reconciliation links the
applicable official and secondary source records, their exact checksums, and the rules context.

### Normalization, selection, and reminders

- `src/aos4/normalize/` converts provider text/HTML and raw timing into safe canonical facts plus
  diagnostics.
- `src/aos4/select/` resolves explicit stable-ID selections through relationship edges and records
  causes/diagnostics.
- `src/aos4/reminders/` projects selected abilities to stable reminder occurrences and orders them
  by window, priority, lane, perspective, name, and ID.
- `src/aos4/view/` creates builder/reminder view models. It contains no React or browser storage.

Reminder IDs derive from canonical ability identity and semantic timing, not mutable wording.

### State and runtime

- `src/aos4/state/armyDocument.ts` owns schema-versioned serialization, validation, selections,
  notes, hiding, and ordering preferences.
- `src/aos4/runtime/armyStorage.ts` owns the versioned browser key
  `aos-reminders:aos4:army:v1`.
- Loading removes `persist:root`, `loadedArmy`, `reminderOrder`, and `savedArmies` without parsing
  them.
- Invalid or incompatible AoS 4 documents reset to a clean representative document.
- `src/components/routes/Home.tsx` is the live game screen and consumes generated data through AoS 4
  view models.
- `/faq`, `/subscribe`, and the protected `/profile` route preserve the established non-rules
  account experience.
- `src/main.tsx` mounts Auth0, subscription, and theme providers around the AoS 4 application.

Runtime code must not fetch source data. It loads checked-in generated artifacts only.

### Acquisition and reconciliation

- `src/aos4/data/` provides HTTPS-only allowlisted acquisition with DNS/public-IP checks, redirect,
  timeout, size, media-type, and content-encoding limits.
- Immutable artifacts are cached by SHA-256 and recorded in manifests.
- Wahapedia records retain the exact decoded row, row locator, stable source-record ID, and SHA-256
  record checksum before normalization.
- Official and Wahapedia adapters decode provider shapes without turning them into domain entities.
- `src/aos4/reconcile/` links facts conservatively, applies explicit reviewed overrides, and records
  conflicts/diagnostics.
- `src/aos4/generate/` validates source consumption, identity stability, and catalog integrity, then
  emits deterministic audit/runtime products.
- `src/aos4/generated/` is the checked-in representative output consumed by the app.
- `data/aos4/` stores identity registries, manifests, reviewed overrides, and reports—not downloaded
  source bodies.

Candidate acquisition:

```powershell
yarn data:aos4:candidate `
  --official-search "rules section heading" `
  --faction <Wahapedia-faction-id> `
  --output <new-directory>
```

The command never accepts data into runtime and refuses to overwrite an output directory. Use
repeatable `--faction` arguments for bounded, non-verbatim cohort inventories and
`--official-search` arguments for page locators without page text. Use
`--accepted-manifest <path> --offline` for deterministic replay. A cohort marked `blocked` must not
be promoted. Raw artifacts belong under the ignored `.cache/aos4/` tree.

## Retired architecture

The following must remain absent:

- `src/factions/`, `src/generic_rules/`, `src/meta/`
- `src/ducks/`, `src/store/`, Redux Persist state
- old army/data/phase/selection/saved-army types
- `processGame`, `processReminders`, `reminderUtils`, `getSideEffects`, `withSelect`
- Azyr, Battlescribe, Warscroll Builder, and old Warhammer App importers
- name/typo/deprecation lookup tables and historical importer fixtures
- old saved-army, import, and PDF logic; the established visual components may be adapted to AoS 4

Git history is the archive. Do not keep copied “reference” files in the working tree.

## Development conventions

- Use Node `v20.15.1` from `.nvmrc` and Yarn Classic with the committed lockfile.
- TypeScript is strict; `noImplicitAny` is still disabled pending Phase 2.
- Prettier uses two spaces, no semicolons, single quotes, 110 columns, and ES5 trailing commas.
- Prefer `satisfies` for static dictionaries so keys stay narrow while values are checked.
- Keep network logic, Node-only modules, and source bytes out of the browser bundle.
- Never edit `build/` or `dist/`.
- Preserve unrelated user changes in a dirty worktree.

## Verification

Install:

```powershell
yarn install --frozen-lockfile
```

Run:

```powershell
yarn lint
yarn tsc --noEmit
yarn test --run
yarn build
```

Focused examples:

```powershell
yarn vitest run src/tests/aos4/legacyIsolation.test.ts
yarn vitest run src/tests/aos4/representativeSlice.test.ts
```

Tests use small repository fixtures and must not depend on live source availability. Add contract
tests for provider changes and reconciliation tests for conflicts, stale secondary data, missing
joins, duplicate identities, unsafe HTML, and source precedence.

After touching acquisition or generation, also replay an accepted manifest offline and compare
deterministic output. Live candidate retrieval is a deliberate network operation, not a routine
unit-test prerequisite.

## Current working sequence

1. Keep the AoS 4-only runtime and retirement boundary green.
2. Re-run candidate acquisition when freshness evidence requires it.
3. Select a bounded cohort for review.
4. Resolve or disposition its diagnostics.
5. verify official facts directly.
6. allocate stable identities through the registry.
7. generate audit and runtime output from the same accepted inputs.
8. run catalog integrity, provenance, selection, reminder, browser, and build checks.
9. commit and push only to the migration work branch/PR.
10. Repeat by cohort; do not accept the entire secondary-source corpus mechanically.
