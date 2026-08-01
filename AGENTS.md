# AGENTS.md

This file applies to the entire repository.

## Project purpose and current state

AoS Reminders turns an Age of Sigmar army configuration into phase-ordered reminders.

Version 6 is now an Age of Sigmar fourth-edition-only codebase:

- the browser runtime uses the canonical model under `src/aos4/`
- the checked-in runtime is generated from the accepted `aos4-corpus-2026-07-30` snapshot
- the AoS 3 faction corpus, rule utilities, Redux state, saved-army schema, importers, and fixtures
  have been removed
- importing, cloud armies, and army sharing are rebuilt as AoS 4-native features: roster parsers in
  `src/importers/` (official app text, Listbot text and file upload, Sigdex text, New Recruit
  `.ros`/`.rosz`/`.json`), roster resolution in `src/aos4/import/`, and the Auth0-authorized cloud
  client in `src/api/armyApi.ts`
- an army document may opt into Legends units (`allowsLegends`); Legends applies as an overlay on
  the document's rules context during selection resolution
- old browser state is deleted and replaced with a schema-valid AoS 4 document; it is never
  translated
- the 27 decoded factions that field units are selectable through one source-complete relationship
  graph; the 28th row, `Endless Spells`, is a Wahapedia container for universal manifestations
  rather than an army, and generation now offers nothing from it, so `armyFactions` has nothing
  left to exclude
- manifestations are a category of unit rather than an army: the five universal manifestation lores
  and their 18 warscrolls come off the `Endless Spells` container page and are offered by all 27
  armies instead of by the container, through the review's `universalFactionContent` gate
- the accepted corpus contains 1,286 warscrolls, 1,002 battle profiles, 4,898 abilities,
  2,260 weapons, 1,409 content groups, and 19,126 live source records
- current standard, General's Handbook 2026-27 (`Scourge of Aqshy`), Spearhead, Legends, and
  historical rules contexts isolate parallel and retired records; the browser defaults to the
  current 2026-27 seasonal context
- strict generation consumes every live record and separately dispositions 18,897 superseded
  May 2026 bulk warscroll/faction-rule records so none can leak into runtime
- all 1,350 extracted official battle-profile facts have an explicit disposition: 928 apply to
  runtime, 12 remain profile-only gaps, 363 remain structured references, and 47 are superseded
- the earlier candidate/cohort reports remain checked-in reconnaissance history, not current
  blockers
- Phase 1 is complete and machine-verified for beta use; Phase 2 is underway — capability
  restoration has delivered printing/PDF export and importing/cloud armies/sharing, while package
  upgrades and broader framework modernization remain pending

Do not confuse these version numbers:

- `package.json` reports the application version (`6.0.0`)
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

`src/tests/aos4/legacyIsolation.test.ts` enforces the AoS 4 dependency boundary, the physical
absence of retired AoS 3 paths, and an explicit allowlist of the AoS 4 presentation shell (print,
import, sharing, and cloud-army modules).

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
- Treat any UI change the user did not explicitly ask for as a code smell. This applies in every
  phase, not only Phase 1, and it does not relax as Phase 2 modernization work begins. Structural,
  dependency, and framework work should leave navigation, authentication, subscription/profile flows,
  FAQ, footer, typography, spacing, responsive behavior, and interaction labels unchanged.
- An accessibility or correctness fix is not a licence to restyle. When a fix has a visible
  consequence, choose the variant that preserves the current appearance, state the delta explicitly,
  and let the user accept it. Prefer semantic and behavioral corrections that render identically.
- The expected exceptions are data-driven: AoS 4 phase names, content-group cards, selections,
  reminder text, and other fields whose source data or game structure genuinely changed. Reuse the
  established visual primitives for those exceptions.
- Bind the AoS 4 domain and army document to the established presentation with adapters/view
  models. Do not restore AoS 3 rules, Redux, importers, or saved-army data merely to reuse the UI.
- Remove or rewrite stale AoS 3 copy and feature claims while retaining the surrounding visual
  hierarchy and interaction pattern.
- Do not add a migration-workbench aesthetic, new visual language, or broad reskin unless the user
  explicitly requests one.

The Version 6 launch-hardening client retires the shared browser key and sends the user's
Auth0 bearer token for every subscription account operation. Production remains blocked until the
companion subscription change in `aos-reminders-subscription-api#17` is reviewed, deployed, and
live-verified: it must derive account ownership from verified claims, reject cross-account access,
verify and deduplicate provider callbacks, review the private-repository credential history, and
pass the negative authorization matrix. The repository history is not evidence of public credential
exposure; rotate a credential only when access history, policy, or other evidence requires it.
Preserve the familiar account UI while this work is tracked in issue #1720; do not describe the
production subscription API as secure before those checks pass. The army/share client likewise
sends the bearer token for the `https://api.aosreminders.com` audience; its private collection
hardening and production rollout remain tracked in `aos-reminders-rest-api#11` and issue #1804.

## Migration program

### Phase 1: data and domain correctness

Phase 1 has two parts:

1. Structural correctness: canonical phases/windows, abilities, reactions, usage limits, weapons,
   warscrolls, profiles, relationships, selection, reminders, state, and the minimal runtime.
2. Data retrieval and entry: safe acquisition, source-specific decoding, reconciliation, review,
   stable identities, generation, and coverage/freshness reporting.

The structural and machine-audit work is complete for the accepted
`aos4-corpus-2026-07-30` snapshot. The manifest, corpus review, stable identity registry, complete
audit catalog, compact runtime projection, and generation report are checked in. The strict gate
has no unresolved timing, dangling reference, unsafe HTML, duplicate identity, silent source
conflict, or unreviewed source diagnostic.

Phase 1 is machine-verified for beta use. `data/aos4/certifications/beta.json` binds the accepted
corpus to its complete machine review and source inventory, and `yarn data:aos4:verify:beta` fails
closed on stale checksums, uncovered records, unresolved findings, or incomplete machine evidence.
Phase 2 may proceed after that beta gate passes. Rules reports from beta testers must be reconciled
against official sources through the normal candidate pipeline. See
`docs/data/aos4-accuracy-review.md`.

Future data refreshes repeat Phase 1b's candidate-review-accept-generate workflow. Never replace the
accepted snapshot merely because a newer download decoded successfully. Review changed diagnostics,
official precedence, dispositions, identities, and generated checksums first.

For future Phase 1 data refreshes, avoid mixing dependency churn into rules/data corrections unless
a package blocks correct data work, the build, or safe operation.

### Phase 2: package and codebase modernization

Phase 2 is underway. Its capability-restoration track (plan `2026-07-29-001`) has delivered
printing and PDF export (`src/aos4/print/`, documented in `docs/printing.md`) and importing, cloud
armies, and sharing. Its package track has begun: Bootstrap is on 5.3 and react-bootstrap on 2.x
(issue #1176), migrated for visual parity — `src/css/theme.scss` pins the Bootstrap 4.6 defaults the
interface was built against, and those pins are part of the design system (see DESIGN.md, "The
Parity Pin Rule"). React is on 19 (issue #1770): `createRoot`, and deliberately no `StrictMode`
wrapper — the app has never had one, and adding it would double-invoke every effect. Vite,
TypeScript, Sass, PWA tooling, Stripe, and react-dropzone remain pending. Checked-in plans live
under `docs/plans/`. Preserve the completed AoS 4 domain, generated-data contracts, beta gate, and
familiar interface while working through:

- upgrade Vite, TypeScript, Sass, PWA tooling, and the remaining supporting packages
- remove packages made unused by the AoS 3 retirement (the four Redux packages are gone)
- replace obsolete or unmaintained libraries (react-beautiful-dnd -> @hello-pangea/dnd is done)
- finish CRA-to-Vite/PWA cleanup
- tighten compiler and lint settings
- redesign API/auth/subscription capabilities against AoS 4 contracts as needed (save and share
  are delivered)
- address bundle and deployment architecture
- rebuild the remaining capabilities the cutover removed against AoS 4 contracts, following the
  pattern set by printing and importing

Keep framework migration separate from rules/data corrections where practical.

The jsPDF upgrade (`1.5.3`, using APIs removed in 2.x) is outstanding Phase 2 work. It is now
confined to `src/aos4/print/pdf.ts` and `src/aos4/print/measure.ts`.

The companion API services (`aos-reminders-rest-api`, `aos-reminders-subscription-api`) run on
`nodejs22.x`/Serverless v4/AWS SDK v3 with characterization tests and CI (plan
`2026-07-28-002`, units U2/U3). Issue #1727 completed authenticated CI `serverless package` gates,
dev verification, and the dev/prod runtime deploys. The later AoS 4-native army/share service in
`aos-reminders-rest-api#10` is dev-validated; its private-read/production hardening merged in
`aos-reminders-rest-api#11` but still needs the coordinated production deployment and frontend API
configuration tracked in issue #1804. Subscription authorization and verified webhook handling
merged in `aos-reminders-subscription-api#17` but remain a production gate under issue #1720. Live
real-money Stripe and PayPal verification after the Version 6 frontend deploy remains tracked in
issue #1731, and the full production smoke/operational handoff is issue #1805.

## Branch and pull-request strategy

`master` is the primary development branch and the normal PR target. The Version 6 release
(PR #1717, `AoS Reminders 6.0.0 — Age of Sigmar fourth-edition release`) merged the retired
`aos4-migration` integration branch into `master` on 2026-07-31; do not base new work on
`aos4-migration` or target PRs at it.

- Base normal work on the latest `origin/master` and target PRs at `master` unless the user
  explicitly establishes another integration branch.
- Local commits and pushes to non-`master` branches are authorized.
- A push to `master` triggers production deployment. Merging PRs, pushing `master`, deploying, or
  changing production services requires explicit direction.

### Issue tracking

All issue tracking for this repository lives in GitHub Issues on `daviseford/aos-reminders`.

- "Ticket" and "issue" always mean a GitHub issue here. They never mean Linear, Jira, or any other
  tracker, including when a global or user-level instruction describes a workflow for one.
- Open issues with `gh issue create`, and reference them by number (for example `#1754`) in commit
  messages and PR descriptions.

## Source-of-truth policy

Use this precedence:

1. Games Workshop publications and official Warhammer Community downloads are authoritative.
2. Wahapedia AoS 4 exports and bounded faction pages are the preferred coherent discovery and
   coverage sources.
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

A quiet official-first rules radar (official and Wahapedia sentinels plus a lower-authority BSData
observer) is planned but not implemented; see
`docs/plans/2026-07-29-003-feat-quiet-official-rules-radar-plan.md`.

### Roster import sources

Importing accepts official Warhammer app text, Listbot 4.0 text or file upload, Sigdex text, and
New Recruit `.ros`/`.rosz`/`.json` rosters. These are roster inputs, never rules authorities: they resolve
against accepted stable IDs (`src/aos4/import/`) and must not create or override canonical rule
facts. Roster bracket suffixes such as New Recruit's `[LEGENDS]` are provenance, not identity; the
per-selection `Legends` category drives context handling. The checked-in New Recruit fixture
corpus (`src/tests/fixtures/aos4/import/new-recruit/`) is byte-pinned, captured from opted-in
accounts, and self-checking — all three formats must decode identically, and import fails closed
on malformed files, never on illegal armies. Full source-derived import corpora belong under the
ignored `data/aos4/import-corpus/` tree (`yarn corpus:listbot`), not in git.

### Games Workshop

Start official discovery at:

`https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/`

The downloads UI and private JSON endpoints may change. Keep endpoint knowledge inside the adapter,
test its contract, and retain official-page/PDF fallback discovery. Versioned PDFs on
`assets.warhammer-community.com` are accepted by the acquisition allowlist.

Official documents supersede earlier material. Preserve version/effective-date history instead of
silently mutating provenance.

### Wahapedia

Start with the published export:

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

Exports can lag the public AoS 4 faction pages. The accepted corpus keeps the 13 exports for
stable faction/publication identities and audit provenance, but supersedes every bulk warscroll
and faction-rule row with reviewed current HTML from 27 faction warscroll collections, 28 faction
roots, and 17 current rules pages. Use only the bounded `wahapedia-html/1` adapter and explicit
`--wahapedia-page`/`--wahapedia-pages-file` inputs; do not add ad hoc React-side scraping.

There are 28 roots but only 27 collections because Wahapedia publishes no `warscrolls.html` for
`Endless Spells`; that root carries all 18 of its warscrolls itself. A faction root therefore
contributes only its Spearhead warscrolls when a collection accompanies it and every datasheet when
none does — never a page-name special case.

Preserve “Powered by Wahapedia” attribution for published features derived from the exports.
Re-check `robots.txt`, rate-limit requests, cache immutable bytes, and prefer offline replay during
development.

### Content boundary

The accepted runtime commits normalized structured rule facts, profiles, points, weapon
characteristics, and compact provenance needed by the reminder product. The audit catalog retains
the corresponding structured facts and full review provenance. It does not commit bulk PDFs, raw
exports, extracted page text, or other raw source bodies. Test fixtures and unknown-authority
artifacts must never supply player-facing runtime content; generation integrity rejects them.

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

Battle profiles use numeric points only when their rules context defines points. Spearhead profiles
retain `pointsStatus: "not-applicable"`; never invent a zero-point value.

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
- `src/aos4/import/` resolves imported roster labels to stable selections through normalized
  labels and reviewed aliases (`labelAliases.ts`); provider parsers live outside the domain in
  `src/importers/`.
- `src/aos4/reminders/` projects selected abilities to stable reminder occurrences and orders them
  by window, priority, lane, perspective, name, and ID.
- `src/aos4/view/` creates builder/reminder view models. It contains no React or browser storage.

Reminder IDs derive from canonical ability identity and semantic timing, not mutable wording.

### State and runtime

- `src/aos4/state/armyDocument.ts` owns schema-versioned serialization, validation, selections,
  notes, hiding, ordering preferences, and the optional `allowsLegends` opt-in.
- `src/aos4/runtime/armyStorage.ts` owns the versioned browser key
  `aos-reminders:aos4:army:v1`.
- `src/api/armyApi.ts` is the cloud army and sharing client. It calls `VITE_ARMY_API_URL` with the
  user's Auth0 bearer token (`src/utils/authToken.ts`); `src/context/useArmyCollection.tsx`
  exposes the collection to the import, sharing, and saved-armies modals.
- `src/utils/shareLink.ts` owns the sessionStorage key `aos-reminders:aos4:pending-share`;
  `src/main.tsx` captures incoming share links and `Home` consumes them.
- Loading removes `persist:root`, `loadedArmy`, `reminderOrder`, and `savedArmies` without parsing
  them.
- Invalid or incompatible AoS 4 documents reset to a clean Stormcast Eternals document in the
  current accepted rules context.
- The runtime contains current-standard, current-seasonal, Spearhead, Legends, and historical
  facts. The current UI uses the accepted default 2026-27 seasonal context. Context applicability
  is retained on source records, entities, and relationships. A document that sets `allowsLegends`
  resolves Legends records as an overlay on its selected context.
- `src/components/routes/Home.tsx` is the live game screen and consumes generated data through AoS 4
  view models.
- `/faq`, `/subscribe`, `/join`, `/redeem`, and the protected `/profile` route preserve the
  established non-rules account experience.
- `src/main.tsx` mounts Auth0, app-status, subscription, army-collection, and theme providers
  around the AoS 4 application.

Runtime code must not fetch rules source data. It loads checked-in generated artifacts only; the
army and subscription APIs carry user account data, never rule facts.

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
- `src/aos4/review/` implements the machine review, adversarial review, and certification pipeline
  behind the `data:aos4:review:*`, `data:aos4:certify*`, and `data:aos4:verify:beta` commands.
- `src/aos4/generated/corpus/` is the compact checked-in output consumed by the app.
- `src/aos4/generated/representative/` remains only as the small offline contract fixture.
- `data/aos4/` stores identity registries, manifests, reviewed overrides, and reports—not downloaded
  source bodies.

Candidate acquisition:

```powershell
yarn data:aos4:candidate `
  --wahapedia-pages-file <reviewed-json-url-list> `
  --official-urls-file <reviewed-json-url-list> `
  --official-search "rules section heading" `
  --faction <Wahapedia-faction-id> `
  --output <new-directory>
```

The command never accepts data into runtime and refuses to overwrite an output directory. Use
repeatable `--wahapedia-page`/`--faction` arguments for bounded current-page and non-verbatim
cohort inventories, and `--official-search` arguments for page locators without page text. Use
`--accepted-manifest <path> --offline` for deterministic replay. A cohort marked `blocked` must not
be promoted. Raw artifacts belong under the ignored `.cache/aos4/` tree. Use
`yarn data:aos4:inventory*` and `yarn data:aos4:discover-official` to observe sources without
accepting anything.

Accepted generation:

```powershell
yarn data:aos4:generate:candidate
```

This verifies every accepted artifact checksum from the local cache, re-extracts reviewed official
PDF page records, rebuilds the catalog, official battle-profile ledger, and runtime projection in
memory, and fails if any checked-in product differs. Normal `yarn data:aos4:generate` additionally
requires a passing `beta.json` machine-readiness pointer; use `yarn data:aos4:generate:write` only
for the explicit candidate workflow after updating accepted manifest and review inputs. Never hand-edit
`data/aos4/catalog/catalog.json`,
`data/aos4/catalog/official-battle-profiles.json`, `data/aos4/identities/corpus.json`, or
`src/aos4/generated/corpus/*.json`.

Accuracy review is a separate fail-closed layer:

- full packets and source excerpts stay under `.cache/aos4/review/`
- machine results cannot accept or mutate data
- blind interpretations must be saved before generated-value comparison
- machine review must cover every record, faction/context stratum, and high-risk cohort
- beta feedback that identifies a possible rules mistake must be checked against official sources
  and corrected through a new candidate; never patch generated runtime data directly

Use `yarn data:aos4:review:prepare`, `yarn data:aos4:review:adversarial`,
`yarn data:aos4:certify:prepare`, and `yarn data:aos4:verify:beta` for the beta gate.

## Retired architecture

The AoS 3 implementations below must remain absent. The features themselves are not retired:
printing, importing, cloud armies, and sharing have AoS 4-native replacements at new paths, and
`src/tests/aos4/legacyIsolation.test.ts` allowlists exactly those modules. Rebuild remaining
capabilities the same way; never revive the AoS 3 code paths:

- `src/factions/`, `src/generic_rules/`, `src/meta/`
- `src/ducks/`, `src/store/`, Redux Persist state
- old army/data/phase/selection/saved-army types
- `processGame`, `processReminders`, `reminderUtils`, `getSideEffects`, `withSelect`
- the AoS 3 Azyr, Battlescribe, Warscroll Builder, and Warhammer App importers
- AoS 3 name/typo/deprecation lookup tables and historical importer fixtures
  (`src/aos4/import/labelAliases.ts` is the reviewed AoS 4 import alias table, not a revival)
- AoS 3 saved-army, import, and PDF logic; the established visual components may be adapted to
  AoS 4

Git history is the archive. Do not keep copied “reference” files in the working tree.

## Development conventions

- Use Node `v22.23.2` from `.nvmrc` and Yarn Classic with the committed lockfile. CI workflows and
  the companion APIs (`nodejs22.x`) also run Node 22.
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

**Reinstall from scratch after crossing the React 17/Bootstrap 4 boundary.** Branches that predate
the Phase 2 package track resolve a different dependency tree, and Yarn Classic does not always
prune the nested copies it no longer needs. The failure this produces is a stale
`react-bootstrap/node_modules/@types/react` at 17.x sitting under a top-level 19.x: `tsc` then
resolves react-bootstrap's *and* react-icons' JSX types through React 17's namespace and reports a
handful of `TS2786 ... is not a valid JSX element type` errors in files nobody touched — typically
`src/components/info/reminders.tsx` and `src/components/helpers/link.tsx`.

Nothing is wrong with the code when this happens. `yarn.lock` carries a single `@types/react`, and
`package.json` already pins it through `resolutions`, so CI installs clean and compiles with zero
errors. Only the local tree is poisoned. Confirm with:

```powershell
Get-ChildItem -Recurse -Path node_modules -Filter package.json |
  Where-Object { $_.FullName -match '@types\\react\\package.json$' }
```

More than one hit means the tree is stale; `rm -rf node_modules` and reinstall. Do not "fix" the
reported type errors — verify against a clean install before believing any baseline error count,
and before treating pre-existing errors as something a branch inherited.

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
yarn vitest run src/tests/aos4/importNewRecruitCorpus.test.ts
yarn data:aos4:generate:candidate
yarn data:aos4:verify:beta
```

Always run `yarn data:aos4:verify:beta` for the accepted revision.

Tests use small repository fixtures and must not depend on live source availability. Add contract
tests for provider changes and reconciliation tests for conflicts, stale secondary data, missing
joins, duplicate identities, unsafe HTML, and source precedence.

The New Recruit import fixture corpus is self-checking; never hand-edit captured roster bytes.
Capture new lists per `src/tests/fixtures/aos4/import/new-recruit/CAPTURE.md`, ingest with
`yarn fixtures:new-recruit:ingest`, and regenerate the manifest with `yarn fixtures:new-recruit`.

After touching acquisition or generation, also replay an accepted manifest offline and compare
deterministic output. Live candidate retrieval is a deliberate network operation, not a routine
unit-test prerequisite.

## Current working sequence

1. Keep the accepted AoS 4 corpus, runtime, UI continuity, and retirement boundary green.
2. For a data refresh, acquire a new candidate without changing accepted output.
3. Review changed cohorts and current official publications.
4. Resolve or disposition every changed diagnostic and preserve official precedence.
5. Update the accepted manifest/review inputs and regenerate; do not hand-edit products.
6. Run deterministic generation, catalog integrity, provenance, selection, reminder, browser, and
   production-build checks.
7. Repeat the checksum-bound machine review and update the beta-readiness pointer; a prior result
   is never inherited by a changed corpus.
8. Use normal PRs targeting `master`; never push `master` directly without explicit
   authorization.
9. Reconcile beta-tester rules reports against official sources and add regression coverage for
   confirmed corrections.
