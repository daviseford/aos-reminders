# AGENTS.md

This file applies to the entire repository.

`CONCEPTS.md` at the repo root holds the shared domain vocabulary — entities, named processes,
and the faction / Army of Renown / battle-formation hierarchy — relevant when orienting to the
codebase or discussing how army-building concepts relate. `docs/solutions/` holds documented
solutions to past problems (bugs, architecture patterns, workflow learnings), organized by
category with YAML frontmatter (`module`, `tags`, `problem_type`) — relevant when implementing
or debugging in documented areas.

## Project purpose and current state

AoS Reminders turns an Age of Sigmar army configuration into phase-ordered reminders.

This is an Age of Sigmar fourth-edition codebase:

- the browser runtime uses the canonical model under `src/aos4/`
- the checked-in runtime is generated from the accepted `aos4-corpus-2026-08-25` snapshot
- importing, cloud armies, and army sharing are AoS 4-native: roster parsers in
  `src/importers/` (official app text, Listbot text and file upload, Sigdex text, New Recruit
  `.ros`/`.rosz`/`.json`), roster resolution in `src/aos4/import/`, and the Auth0-authorized cloud
  client in `src/api/armyApi.ts`
- an army document may opt into Legends units (`allowsLegends`); Legends applies as an overlay on
  the document's rules context during selection resolution
- unrecognized browser state is deleted and replaced with a schema-valid army document; it is never
  translated
- the 27 decoded factions that field units are selectable through one source-complete relationship
  graph; the 28th row, `Endless Spells`, is a Wahapedia container for universal manifestations
  rather than an army, and generation now offers nothing from it, so `armyFactions` has nothing
  left to exclude
- manifestations are a category of unit rather than an army: the five universal manifestation lores
  and their 18 warscrolls come off the `Endless Spells` container page and are offered by all 27
  armies instead of by the container, through the review's `universalFactionContent` gate
- the accepted corpus contains 1,296 warscrolls, 1,012 battle profiles, 5,074 abilities,
  2,269 weapons, 1,493 content groups, and 20,084 live source records
- the 75 Regiments of Renown on the accepted collection pages are classified
  `regiment-of-renown` content groups (reviewed `regimentsOfRenown` input), offered by exactly
  their inclusion factions with their regiment abilities and member warscrolls linked
  (issue #1858)
- current standard, General's Handbook 2026-27 (`Scourge of Aqshy`), Spearhead, Legends, and
  historical rules contexts isolate parallel and retired records; the browser defaults to the
  current 2026-27 seasonal context
- strict generation consumes every live record and separately dispositions 19,113 superseded
  records (the May 2026 bulk warscroll/faction-rule rows plus the seventeen index-era Ogor
  datasheets the July 2026 battletome rewrites replaced, issues #1850 and #1880) so none can
  leak into runtime
- all 1,350 extracted official battle-profile facts have an explicit disposition: 1,013 apply to
  runtime, 1 remains a profile-only gap, 289 remain structured references, and 47 are superseded
- the earlier candidate/cohort reports remain checked-in reconnaissance history, not current
  blockers

Do not confuse these version numbers:

- `package.json` reports the application version (`6.0.0`)
- “AoS 4” means the Games Workshop game edition released in 2024
- the army-document and catalog schema versions are independent internal contracts

## Non-negotiable constraints

- `src/aos4/` may depend only on its own modules, Node built-ins, and third-party packages.
  Application code may depend inward on `src/aos4/`; the domain layer must not depend outward.
- Keep source acquisition and reconciliation out of React components.
- Treat names as display text, never durable identity.
- Do not hand-edit generated catalog modules as a substitute for the acquisition/review/generation
  process.
- A push to `master` triggers production deployment. Never push or merge `master` without explicit
  user authorization.

`src/tests/aos4/architectureBoundaries.test.ts` enforces the domain dependency boundary.

## Product and interface continuity

The live application at `https://aosreminders.com/` is the visual and interaction baseline. The
community trusts that experience; data, dependency, and framework work does not authorize a
redesign.

- Preserve the established dark-blue masthead, typography, spacing, edit/play control, faction
  selector, teal selection cards, reminder cards, notes, hide/show behavior, responsive layout,
  print behavior, footer, and contact/disclaimer treatment.
- Preserve the account-facing shell: the signed-out `Subscribe`, `FAQ`, and `Log in` navigation;
  Auth0 hosted login; authenticated `Profile` and `Log out` navigation; subscription status and
  cancellation; and subscriber theme behavior.
- Compare UI changes directly against the live site at desktop and mobile widths before accepting
  them. Browser snapshots and tests should guard recognizable landmarks and account navigation.
- Treat any UI change the user did not explicitly ask for as a code smell. Structural, dependency,
  and framework work should leave navigation, authentication, subscription/profile flows, FAQ,
  footer, typography, spacing, responsive behavior, and interaction labels unchanged.
- An accessibility or correctness fix is not a licence to restyle. When a fix has a visible
  consequence, choose the variant that preserves the current appearance, state the delta explicitly,
  and let the user accept it. Prefer semantic and behavioral corrections that render identically.
- The expected exceptions are data-driven: phase names, content-group cards, selections, reminder
  text, and other fields whose source data or game structure genuinely changed. Reuse the
  established visual primitives for those exceptions.
- Bind the domain and army document to the established presentation with adapters/view models.
- Do not add a new visual language or broad reskin unless the user explicitly requests one.

The client sends the user's Auth0 bearer token for every subscription account operation, and for
the `https://api.aosreminders.com` audience on the army/share client. Preserve the familiar account
UI.

Subscription, billing, and payment-provider work belongs to the private
`aos-reminders-subscription-api` repository and is tracked in its issues. Do not open public issues,
add public notes, or record billing/authorization detail in this repository.

## Data correctness and the beta gate

The accepted `aos4-corpus-2026-08-25` snapshot is complete and machine-audited. The manifest, corpus
review, stable identity registry, complete audit catalog, compact runtime projection, and generation
report are checked in. The strict gate has no unresolved timing, dangling reference, unsafe HTML,
duplicate identity, silent source conflict, or unreviewed source diagnostic.

`data/aos4/certifications/beta.json` binds the accepted corpus to its complete machine review and
source inventory, and `yarn data:aos4:verify:beta` fails closed on stale checksums, uncovered
records, unresolved findings, or incomplete machine evidence. Rules reports from testers must be
reconciled against official sources through the normal candidate pipeline. See
`docs/data/aos4-accuracy-review.md`.

Data refreshes repeat the candidate-review-accept-generate workflow. Never replace the accepted
snapshot merely because a newer download decoded successfully. Review changed diagnostics, official
precedence, dispositions, identities, and generated checksums first. Avoid mixing dependency churn
into rules/data corrections unless a package blocks correct data work, the build, or safe operation.

## Package and codebase modernization

Modernization is ongoing. Capability restoration has delivered printing and PDF export
(`src/aos4/print/`, see `docs/printing.md`), importing, cloud armies, and sharing. The package track
has delivered Bootstrap 5.3/react-bootstrap 2, React 19, React Router 8, PWA support on
`vite-plugin-pwa` (`docs/pwa.md`, `docs/deployment.md`), the Vite, TypeScript, Sass, Stripe, and
react-dropzone upgrades, jsPDF 4/pdfjs-dist 6, and the removal of Redux and react-beautiful-dnd.

Standing constraints carried out of that work:

- `src/css/theme.scss` pins the Bootstrap 4.6 defaults the interface was built against. Those pins
  are part of the design system — see DESIGN.md, "The Parity Pin Rule".
- There is deliberately no `StrictMode` wrapper. The app has never had one, and adding it would
  double-invoke every effect.
- `src/bootstrap/router.tsx` holds the `createBrowserRouter` singleton. The Auth0 redirect callback
  navigates through it, and analytics page-view tracking subscribes to it, deduping on location key.

Remaining work, preserving the domain, generated-data contracts, beta gate, and familiar interface:

- tighten compiler and lint settings
- address bundle and deployment architecture

Keep framework upgrades separate from rules/data corrections where practical.

`jspdf` is confined to `src/aos4/print/pdf.ts` and `src/aos4/print/measure.ts`; `pdfjs-dist` is
confined to the Node-side official-PDF text extraction in
`src/aos4/data/gamesWorkshop/pdfText.ts` (legacy ESM build; `destroy()` lives on the loading task,
and pdf.js 6 rejects Node Buffers, so cached artifact bytes are copied into a plain `Uint8Array`
first). pdf.js 6 extracts letterspaced display headings without the fake spaces 2.4 inserted, so
official-evidence page checksums and two battle-profile ledger facts pinned to the old extraction no
longer reproduce: **the accepted snapshot needs a reviewed evidence refresh before
`data:aos4:generate:candidate` passes again.** That refresh is a corpus review decision, not part of
the dependency bump. `data:aos4:verify:beta` is unaffected because it checks checked-in products
rather than re-extracting.

The companion API services (`aos-reminders-rest-api`, `aos-reminders-subscription-api`) run on
`nodejs22.x`/Serverless v4/AWS SDK v3 with characterization tests and CI, and are deployed to dev
and prod. Both are private repositories that own their own issue trackers; do not track their work
here.

The subscription admin console's PWA support is `aos-reminders-admin#9`, scoped to a manifest and
icons with no service worker — that console renders live subscriber data, and browser caches are
origin-scoped rather than per-user, so a cached response would outlive its session.

## Branch and pull-request strategy

`master` is the primary development branch and the normal PR target.

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

### Pull-request descriptions

State what cohort, contract, or structural behavior changed; which sources and effective dates were
used; how conflicts and diagnostics were dispositioned; whether generated files changed and from
which accepted inputs; which verification commands passed; and any known coverage gaps. Say
explicitly whether a change affects production configuration or needs coordinated companion-service
work.

## Source-of-truth policy

Use this precedence:

1. Games Workshop publications and official Warhammer Community downloads are authoritative.
2. Wahapedia AoS 4 exports and bounded faction pages, and commit-pinned BSData catalogues, are
   co-equal preferred secondary sources (BSData was raised from fallback to peer secondary on
   2026-08-18, #1757). Neither overrides official material.
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

A quiet official-first rules radar watches the official, Wahapedia, and BSData sentinels and
reports material source changes through a managed GitHub issue. The two secondaries rank equally:
BSData was raised from fallback to peer secondary on 2026-08-18 (#1757). An alarm is handled per
`docs/data/aos4-rules-radar-alarm.md`.

### Roster import sources

Importing accepts official Warhammer app text, Listbot 4.0 text or file upload, Sigdex text, and
New Recruit `.ros`/`.rosz`/`.json` rosters. These are roster inputs, never rules authorities: they resolve
against accepted stable IDs (`src/aos4/import/`) and must not create or override canonical rule
facts. Roster bracket suffixes such as New Recruit's `[LEGENDS]` are provenance, not identity; the
per-selection `Legends` category drives context handling. The checked-in New Recruit fixture
corpus (`src/tests/fixtures/aos4/import/new-recruit/`) is byte-pinned, captured from opted-in
accounts, and self-checking — all three formats must decode identically, and import fails closed
on malformed files, never on illegal armies. Generated source-derived import corpora belong under
the ignored `data/aos4/import-corpus/` tree (`yarn corpus:listbot`), not in git.

The checked-in tournament corpus (`src/tests/fixtures/aos4/import/tournament/`) is the exception,
and is kept because it cannot be regenerated: 357 rosters captured verbatim from public 2025–2026
event coverage, byte-pinned by manifest checksum. It tests the exports players actually send —
blank roster names, prose in the name field, footers from sixty-odd app versions — rather than the
ones we know how to make, and it carries no per-list goldens. See its README before adding to it.

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

`src/aos4/data/wahapedia/exportCatalog.ts` enumerates the 13 current export files; treat it as the
list rather than restating it here.

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
`yarn data:aos4:certify:prepare`, and `yarn data:aos4:verify:beta` for the beta gate. After
accepting a new certification, run `yarn data:aos4:certify:prune` to list the certification
directories that fell out of the live beta chain (`--apply` stages their deletion with `git rm`).

Git history is the archive. Do not keep copied “reference” files in the working tree.

## Development conventions

- Use Node `v22.23.2` from `.nvmrc` and Yarn Classic with the committed lockfile. CI workflows and
  the companion APIs (`nodejs22.x`) also run Node 22.
- TypeScript is strict; `noImplicitAny` is still disabled and remains to be tightened.
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

**Reinstall from scratch after crossing the React 17/Bootstrap 4 boundary.** Switching between
branches either side of the package upgrades can leave a stale nested `@types/react`, which
produces `TS2786` JSX errors in files nobody touched. The code is fine and CI is green when this
happens — do not "fix" those errors, and verify against a clean install before trusting any
baseline error count. Diagnosis and fix:
[docs/solutions/workflow-learnings/stale-nested-types-react-after-package-track.md](./docs/solutions/workflow-learnings/stale-nested-types-react-after-package-track.md).

Run:

```powershell
yarn lint
yarn tsc --noEmit
yarn build
yarn test --run
```

Build before test: `src/tests/pwaBuild.test.ts` asserts on the generated service worker and manifest
in `dist/`, which is gitignored. `prepush` and CI use this order for the same reason — see
[docs/pwa.md](./docs/pwa.md).

Focused examples:

```powershell
yarn vitest run src/tests/aos4/architectureBoundaries.test.ts
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
2. For a data refresh, run the candidate-review-accept-generate workflow above: acquire without
   changing accepted output, review changed cohorts against current official publications,
   disposition every changed diagnostic, update the accepted manifest/review inputs, and regenerate
   without hand-editing products.
3. Run deterministic generation, catalog integrity, provenance, selection, reminder, browser, and
   production-build checks.
4. Repeat the checksum-bound machine review and update the beta-readiness pointer. A prior result is
   never inherited by a changed corpus.
5. Reconcile beta-tester rules reports against official sources and add regression coverage for
   confirmed corrections.
