---
title: Age of Sigmar 4 Domain and Data Pipeline - Plan
type: refactor
date: 2026-07-27
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
deepened: 2026-07-27
---

# Age of Sigmar 4 Domain and Data Pipeline - Plan

## Goal Capsule

Replace the AoS 3 rules model with an explainable AoS 4 domain model and a repeatable data
pipeline. Phase 1a establishes the game structure, abilities, attacks, selection graph, stable
identity, and reminder projection. Phase 1b acquires, normalizes, reconciles, validates, and
generates AoS 4 data from Games Workshop and Wahapedia.

Authority is ordered as follows:

1. The Product Contract in this plan.
2. Current Games Workshop publications and Warhammer Community downloads.
3. Wahapedia's AoS 4 exports as the coherent secondary data set.
4. Other approved community sources as gap-finding aids only.

Execution stops before any merge, production deployment, dependency-modernization program, or
publication of bulk source documents. Work branches target `aos4-migration`; the long-lived
integration PR remains a draft until the user authorizes launch.

## Product Contract

### Summary

AoS Reminders will model fourth-edition rules as stable domain entities rather than phase-indexed
strings. Source adapters will preserve raw facts and provenance, normalization will produce a
canonical catalog, and a separate projection will turn a selected army into ordered reminders.
AoS 3 compatibility is not a product requirement.

### Problem Frame

The current model duplicates timing across 156 literal phase values, identifies selections by
display name, identifies reminders from mutable wording, and stores faction content in fixed
category arrays. Those assumptions do not represent AoS 4's seven turn phases, reactions, passive
abilities, deployment abilities, usage limits, combat ordering, ability costs, or source revisions.
The static corpus also lacks a reproducible acquisition and reconciliation path.

### Actors

- A1. A player selects current AoS 4 content and receives reminders in rules-correct order.
- A2. A data curator retrieves current source data, reviews discrepancies, and regenerates the
  catalog without hand-editing generated output.
- A3. A maintainer traces a displayed fact to its source artifact, transformation, and override.

### Requirements

#### Game and ability structure

- R1. Represent the AoS 4 turn as seven ordered phases: Start of Turn, Hero, Movement, Shooting,
  Charge, Combat, and End of Turn.
- R2. Represent deployment, battle-round boundaries, battle start/end, passive effects, reactions,
  and combat priority without duplicating each timing window for five battle rounds.
- R3. Preserve ability declaration, reaction, and effect information as distinct fields when the
  source provides them.
- R4. Represent timing perspective, usage limit, actor scope, priority, and raw source wording so
  unknown timing can remain explicit rather than defaulting to a plausible phase.
- R5. Represent melee and ranged weapon profiles, attack keywords, and attack/damage sequence
  reminders without turning the product into a combat simulator.

#### Identity, composition, and provenance

- R6. Give every domain entity a stable identifier that does not change when display wording or
  source revisions change.
- R7. Track source records separately from canonical entities, including publisher, authority,
  publication, edition, version, language, rules context, dates, page/section locator, retrieval
  URL/time, and content checksum.
- R8. Preserve every conflict and transformation as reviewable data; the newest applicable official
  source wins over a secondary source.
- R9. Express faction membership, availability, mandatory inclusions, unlocks, and other
  relationships as identifier-based graph edges rather than fixed category fields or display names.

#### Reminder behavior and persistence

- R10. Derive reminders from selected canonical entities after selection resolution, and retain
  source links plus the selected entities that caused each reminder.
- R11. Use an ability identifier plus a semantic timing occurrence for reminder identity; wording
  changes may create a new revision but must not invalidate notes, hiding, or ordering by default.
- R12. Keep the existing reminder UI, notes, hiding, ordering, save/share, and offline infrastructure
  only where it can consume the new projection without preserving AoS 3 semantics.

#### Acquisition and data quality

- R13. Retrieve Wahapedia's published AoS 4 exports with a recorded manifest, conditional requests
  when supported, polite request pacing, and deterministic decoding of its pipe-delimited UTF-8
  format.
- R14. Discover current official AoS downloads through an isolated Games Workshop adapter with a
  page/browser fallback when the private JSON implementation is unavailable.
- R15. Normalize source HTML into safe structured or plain text and never pass downloaded HTML
  directly to React.
- R16. Generate explicit reports for missing joins, duplicate identifiers, invalid values,
  unclassified timing, unresolved conflicts, stale secondary data, and source coverage.
- R17. Produce byte-stable audit-catalog and runtime-projection output from the same source manifest
  and override set.
- R18. Keep routine tests offline by using small representative fixtures; live-source checks are
  explicit data-maintenance operations.
- R19. Attribute Wahapedia in any published feature that relies on its exports.

#### Cutover and scope discipline

- R20. Treat every AoS 3 rule and structural assumption as untrusted. After the representative
  proof and before bulk AoS 4 cohort promotion, cut over by resetting incompatible persistence and
  delete the old rule path rather than carrying compatibility code or parallel faction data
  forward.
- R21. Make only the UI and state changes needed to exercise and validate the new domain during
  Phase 1.
- R22. Defer broad dependency upgrades to Phase 2; a focused parser or command-runner dependency is
  allowed only when the standard library and existing packages cannot implement ingestion safely.
- R23. Do not commit bulk PDFs, raw downloaded corpora, or a new body of full verbatim rules text
  during Phase 1; commit manifests, compact fixtures, structured facts, overrides, and the
  application projection needed for reminders.
- R24. Extract reviewable facts from supported official PDFs with page/section locators, and route
  unsupported or ambiguous layouts to explicit curator review rather than inventing values.
- R25. Restrict acquisition to configured HTTPS hosts, bounded redirects and response sizes,
  checksum-addressed cache paths, and public network destinations.

### Key Flows

- F1. A curator acquires source artifacts, records immutable metadata and checksums, decodes source
  records, normalizes them, applies reviewed overrides, validates the result, and generates a
  deterministic catalog.
- F2. Reconciliation links a secondary record to a canonical entity, compares it with applicable
  official publications, selects the authoritative value, and retains the discrepancy.
- F3. A player selects content by stable identifier, the relationship graph resolves included
  content, and the reminder projector emits ordered phase/reaction/passive reminders with
  provenance.
- F4. A maintainer starts from a reminder identifier and traces it through the canonical ability and
  source record to the retrieved artifact and any override.

### Acceptance Examples

- AE1. Covers R1-R4 and R10: Given a reaction whose source says it may be used in the enemy Shooting
  phase after an enemy declares an ATTACK ability, projection places it in the Shooting phase,
  labels it as a reaction, preserves the trigger text, and does not treat it as the acting player's
  normal phase ability.
- AE2. Covers R4 and R16: Given a previously unseen timing phrase, normalization retains the exact
  phrase, classifies the timing as unknown, and fails the strict generation gate with a diagnostic
  that identifies the source record.
- AE3. Covers R7-R8: Given a Wahapedia record and a newer applicable official update with different
  wording, reconciliation selects the official revision and records both source values plus the
  decision.
- AE4. Covers R6 and R11: Given an ability wording correction with unchanged semantic identity, the
  ability revision checksum changes while its canonical and reminder identifiers remain stable.
- AE5. Covers R5: Given one MELEE and one RANGED weapon export for a warscroll, normalization retains
  their distinct profiles and keywords without calculating attacks or damage outcomes.
- AE6. Covers R9-R10: Given a unit that mandates another selectable ability, selecting the unit
  resolves the linked ability by identifier and emits its reminder without a name-based lookup.
- AE7. Covers R13, R17, and R18: Given the same checked source fixtures and override files, two
  generation runs produce identical output and make no network requests.
- AE8. Covers R7-R8: Given two official rules with the same subject but different battlepack,
  Spearhead, seasonal, Legends, or matched-play applicability, reconciliation retains both and
  selects only the rule applicable to the requested rules context.
- AE9. Covers R14 and R24: Given a supported born-digital official PDF, extraction produces
  page-addressable source facts; given an image-only or structurally ambiguous document, extraction
  emits a review diagnostic and no canonical value.
- AE10. Covers R25: Given a redirect to a loopback/private address or a response above the configured
  size limit, acquisition rejects it without writing bytes to the accepted cache.

### Success Criteria

- The representative fixture matrix covers all seven phases, passive abilities, reactions,
  deployment, a usage limit, a scoped limit, combat priority, melee and ranged weapons, a spell or
  prayer cost, multiple rules contexts, and an unknown timing phrase.
- Strict generation reports zero broken joins, duplicate canonical IDs, invalid references, silent
  conflicts, unsafe HTML, or unacknowledged unknown timing in release data.
- Every generated rule and weapon profile traces to at least one source record and artifact
  checksum plus an applicable rules context.
- Regenerating from an unchanged manifest and override set produces no Git diff.
- Existing lint, TypeScript, tests, and production build remain green at each integration slice.
- The final AoS 4 cutover contains no runtime dependency on `src/types/phases.ts`,
  `src/meta/game_structure.ts`, or the AoS 3 faction registry.

### Scope Boundaries

Phase 1 includes the canonical schema, source acquisition, source reconciliation, generated data,
selection resolution, reminder projection, a representative end-to-end slice, the complete
approved corpus, and clean cutover work.

For this plan, the approved corpus means every record in the accepted manifests for Wahapedia's
documented AoS 4 exports plus every official publication linked during reconciliation. Each record
must be normalized, ignored with a reviewed reason, or reported as unresolved. The audit catalog
retains structured profiles and every rules context present in those sources; the browser projection
ships current reminder-bearing content and source links allowed by R23.

Phase 1 does not include a full combat simulator, list-building legality engine, two-edition mode,
general framework modernization, visual redesign, deployment, or merging the integration PR.
Structured weapon/profile facts may be modeled, but publishing an expanded full-text rules archive
requires a later user decision. The conservative R23 boundary allows the pipeline and reminder
product to advance without making that decision implicitly.

### Dependencies and Sources

- Repository architecture and constraints: `AGENTS.md`.
- Current phase literals and display order: `src/types/phases.ts` and
  `src/meta/game_structure.ts`.
- Current projection and name-based identity:
  `src/utils/processGame.ts`, `src/utils/processReminders.ts`, and
  `src/utils/reminderUtils.ts`.
- Current selection and persisted-state boundaries:
  `src/types/selections.ts`, `src/ducks/selections.ts`, `src/store/index.tsx`, and
  `src/context/useSavedArmies.tsx`.
- [Official Warhammer Age of Sigmar downloads](https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/)
- [Official AoS 4 free-rules launch article](https://www.warhammer-community.com/en-gb/articles/kC5HtXzf/download-the-warhammer-age-of-sigmar-core-rules-battle-profiles-and-more-for-free/)
- [Official modular-rules overview](https://www.warhammer-community.com/en-gb/articles/g1vX5PnD/warhammer-age-of-sigmar-what-are-modular-rules-and-what-do-they-mean-for-you/)
- [Wahapedia AoS 4 data export](https://wahapedia.ru/aos4/the-rules/data-export/)
- [Wahapedia AoS 4 export specification](https://wahapedia.ru/aos4/Export%20Data%20Specs.xlsx)

## Planning Contract

### Key Technical Decisions

- KTD1. Build a source-neutral canonical domain between source records and UI projection.
  (session-settled: user-approved — chosen over using Wahapedia's export shape at runtime:
  Wahapedia is the coherent starting data set, while Games Workshop remains authoritative and
  source adapters must be replaceable.) This realizes R6-R10 and prevents source-specific fields
  from becoming permanent product constraints.
- KTD2. Model timing compositionally from a window, perspective, kind, priority, frequency, scope,
  and raw text instead of adding more literal phase strings. This realizes R1-R4 while keeping the
  seven turn phases data-driven and allowing unknown values.
- KTD3. Separate canonical identity from revision identity. Repository-controlled IDs use a typed
  namespace plus an opaque UUID allocated deterministically into a reviewed identity registry;
  source IDs are aliases and display names never mint or regenerate identity. Accepted mappings
  survive source-ID changes through overrides. Content checksums, adapter versions, and source
  versions identify revisions. This realizes R6-R8 and R11.
- KTD4. Replace fixed army category arrays with typed content entities and relationship edges.
  Selection state stores entity IDs, while catalog metadata determines presentation grouping.
  This realizes R9 and avoids another category-union rewrite when Games Workshop adds a content
  type.
- KTD5. Project reminders only after resolving the selected content graph. Projection may merge
  equivalent display items, but retains contributing entity IDs and gives each semantic timing
  occurrence a stable ID. This realizes R10-R12.
- KTD6. Develop the AoS 4 model beside the current runtime only until a representative vertical
  slice proves it, then remove the AoS 3 path before bulk cohort promotion. (session-settled:
  user-directed — chosen over compatibility migration or dual-edition support: a clean break allows
  legacy fixes and schemas to be deleted.) The temporary code separation is an implementation seam,
  not a product mode or permission for two corpora to evolve together.
- KTD7. Use explicit acquisition, decoding, normalization, reconciliation, override, validation,
  generation, and projection stages. Each stage consumes typed records and emits diagnostics rather
  than mutating source-shaped data in place. This realizes F1-F4.
- KTD8. Resolve precedence per field, applicable date, and rules context, not per provider. A newer
  official update overrides Wahapedia only for the affected field and matching context; unrelated
  fields and parallel contexts remain usable. Every discrepancy is retained. This realizes R7-R8,
  R16, and AE8.
- KTD9. Keep downloaded artifacts in a Git-ignored cache. Commit retrieval manifests, checksums,
  compact test fixtures, reviewed overrides, generated application data allowed by R23, and
  validation summaries. Cache files use checksum-derived paths rather than remote filenames. This
  realizes R13, R17-R18, R23, and R25.
- KTD10. Keep network access out of ordinary tests. Adapters receive an injectable fetch boundary
  and contract fixtures; explicit maintenance commands exercise live sources and write a candidate
  manifest for review. This realizes R13-R18.
- KTD11. Increment the Redux Persist and saved-army schema at cutover and reset incompatible local
  caches, reminder ordering, and selection state. This realizes R20 without encoding AoS 3 aliases
  in the new domain.
- KTD12. Use existing Node 20 APIs and `parse5` first. If robust delimiter handling or TypeScript
  command execution remains unsafe, add one focused dependency in the unit that proves the need
  and record it as the R22 exception.
- KTD13. Generate two deterministic products: a complete curator-facing audit catalog and a compact
  browser runtime projection. The runtime projection contains only fields needed for selection,
  reminders, display, and source links; it does not bundle retrieval artifacts, reconciliation
  evidence, or unused source columns. This realizes R12, R17, and R23 without repeating the current
  eager-bundle growth.
- KTD14. Treat every remote response and redirect as untrusted. Acquisition enforces configured
  HTTPS hosts, public destination addresses, redirect and byte limits, media-type expectations, and
  checksum verification before acceptance. This realizes R25.
- KTD15. Extract official facts through a supported-document decoder plus curator review, not
  through download discovery alone. Born-digital PDFs yield page-addressable candidate records;
  unsupported layouts stop at diagnostics and reviewed overrides. This realizes R14, R16, and R24.
- KTD16. Preserve the existing phase-first reminder hierarchy. Deployment and battle boundaries are
  ordered outside the seven turn phases; reactions appear in their triggering phase with a textual
  Reaction label and trigger; passive abilities have a distinct always-applicable group; combat
  priority is text plus ordering metadata rather than color alone. This realizes R1-R4 and R12.

### High-Level Technical Design

The diagram fixes boundaries and ownership; exact module names may move within the listed
directories when implementation reveals a better local fit.

```text
Games Workshop downloads        Wahapedia exports
            |                          |
            +---- source adapters -----+
                         |
                 acquisition artifacts
                + retrieval manifests
                         |
       source-specific decoders + PDF fact extraction
                         |
                canonical normalization
                         |
         official precedence + reviewed overrides
                         |
              validation and coverage reports
                         |
               complete AoS 4 audit catalog
                         |
                compact runtime projection
                         |
       selected IDs -> relationship resolution
                         |
                 reminder projection
                         |
          Redux/UI/save/share/PDF presentation
```

The domain has four principal layers:

1. Source artifacts and source records preserve what each provider supplied.
2. Canonical entities represent publications, rules contexts, factions, warscrolls, abilities,
   weapons, content groups, and relationship edges.
3. The audit catalog retains full normalization, reconciliation, and provenance evidence; the
   generated runtime projection carries the subset required by the browser.
4. A selected-army document stores stable entity IDs and instance metadata.
5. Reminder view models store semantic timing occurrences, contributing IDs, display text, and
   provenance links.

### System-Wide Impact

| Surface | Current coupling | Phase 1 target |
| --- | --- | --- |
| Timing | `TTurnWhen` union and static `Game` object | Seven phase definitions plus compositional timing |
| Rules | `TEntry`/`TEffects` arrays and boolean category tags | Canonical entities, typed metadata, and relations |
| Selection | Fixed `TSelectionTypes` arrays keyed by names | Selected entity IDs resolved through the catalog |
| Reminders | Pre-expanded `Game`, content hashes, name filtering | Post-selection projection with stable occurrence IDs |
| Persistence | Redux Persist v4 and AoS 3 saved-army shape | New schema version with intentional reset |
| Sources | Hand-entered modules and coarse `rule_sources` | Artifact, source record, canonical field, and override provenance |
| Bundle | Every supported faction eagerly bundled | Compact runtime projection separate from audit evidence |
| Imports | Alias-heavy AoS 3 parser options | AoS 4 adapters mapped directly to canonical entity IDs |
| UI/PDF | Phase-string assumptions | Ordered reminder view model with phase, reaction, and passive lanes |

### Assumptions and Constraints

- Node `v20.15.1`, Yarn Classic, React 17, Redux, Vite, and Vitest remain in place for Phase 1.
- The Games Workshop download catalog and document URLs can change without notice.
- Wahapedia export timestamps can lag visible page/source updates; `Last_update.csv` is one signal,
  not proof that all files changed atomically.
- Wahapedia timing and category fields are lossy hints. Raw timing text remains available, and
  strict output does not silently coerce unrecognized text.
- The initial checked fixtures use synthetic or minimal excerpts plus source metadata. R23 governs
  what larger generated artifacts may enter Git.
- Official PDF automation initially supports born-digital text layouts already handled by the
  repository's PDF tooling. Image-only, encrypted, or ambiguous documents require curator review.
- CI currently runs only for pull requests targeting `master`; migration sub-PRs therefore rely on
  local verification unless workflow triggers are updated in a separately reviewed change.

### Risks and Dependencies

| Risk | Consequence | Mitigation |
| --- | --- | --- |
| Official download implementation changes | Acquisition stops or misses a revision | Isolated contract adapter, page discovery fallback, and freshness diagnostics |
| Secondary data is newer in one field but stale in another | A whole-record overwrite publishes mixed authority | Field- and context-level reconciliation under KTD8 |
| PDF extraction returns plausible but misordered text | Incorrect official facts silently outrank secondary data | Page-addressable candidate records, layout diagnostics, and curator acceptance under KTD15 |
| Remote source is malicious or compromised | Maintainer network access, memory, or cache is abused | Host/address/redirect/size controls under KTD14 |
| Full provenance inflates the static application | Phase 1 becomes unusable before modernization | Separate audit catalog and runtime projection under KTD13 |
| Stable IDs are regenerated from wording | Notes and ordering break on routine updates | Reviewed ID registry and revision separation under KTD3 |
| Content publication exceeds the intended product boundary | Legal and product scope change without approval | Conservative committed-data boundary in R23 |
| Preference API rejects the new saved-army document | Save/share cannot complete in this repository alone | Verify the contract before U10; treat required backend work as an explicit external dependency |
| Sub-PRs do not receive hosted CI | Integration regressions rely on workstation checks | Mandatory local verification and a separately reviewed CI-trigger change if needed |

### Sequencing

Phase 1a comprises U1-U4. It establishes domain invariants and a synthetic reminder projection
without touching the production AoS 3 path. Phase 1b begins with U5-U7, then U8 proves a
representative end-to-end slice. U9 hardens candidate acquisition, generation gates, and the
dependency boundary. U10 performs the clean product cutover and removes AoS 3 before bulk entry.
U11 then expands the approved corpus through the AoS 4-only path and closes documentation.

## Implementation Units

| Unit | Title | Primary files | Depends on |
| --- | --- | --- | --- |
| U1 | Canonical AoS 4 domain primitives | `src/aos4/domain/` | — |
| U2 | Timing and ability normalization | `src/aos4/domain/timing.ts`, `src/aos4/normalize/` | U1 |
| U3 | Content graph and selection resolution | `src/aos4/domain/content.ts`, `src/aos4/select/` | U1 |
| U4 | Reminder projection and stable identity | `src/aos4/reminders/` | U1-U3 |
| U5 | Acquisition and manifest foundation | `src/aos4/data/` | U1 |
| U6 | Wahapedia adapter | `src/aos4/data/wahapedia/` | U5 |
| U7 | Official discovery, extraction, and reconciliation | `src/aos4/data/gamesWorkshop/`, `src/aos4/reconcile/` | U5-U6 |
| U8 | Representative vertical slice | `src/aos4/generated/`, existing builder/reminder seams | U1-U7 |
| U9 | Generation gates and legacy isolation | `data/aos4/`, `src/aos4/generate/`, `docs/data/` | U8 |
| U10 | Runtime cutover and AoS 3 removal | state, builder/reminders, old faction/import modules | U9 |
| U11 | Approved corpus expansion and final documentation | `data/aos4/`, `src/aos4/generated/`, `README.md` | U10 |

### U1. Canonical AoS 4 domain primitives

**Goal:** Define the stable vocabulary and invariants that every later adapter and projection uses.

**Requirements:** R1-R9 and R23-R24.

**Files:**

- Add `src/aos4/domain/identity.ts`.
- Add `src/aos4/domain/source.ts`.
- Add `src/aos4/domain/rulesContext.ts`.
- Add `src/aos4/domain/game.ts`.
- Add `src/aos4/domain/ability.ts`.
- Add `src/aos4/domain/weapon.ts`.
- Add `src/aos4/domain/content.ts`.
- Add `src/aos4/domain/index.ts`.
- Add `src/tests/aos4/domain.test.ts`.

**Approach:** Define branded or validated string identifiers, catalog schema metadata, revision
metadata, seven ordered phase definitions, compositional timing, rules contexts, ability sections,
usage limits, weapons, source locators, content entities, and graph edges. Keep source raw fields
out of these types. Use narrow literals for known values and explicit unknown variants where
upstream vocabularies are open.

**Test scenarios:**

- Construct a catalog fixture containing all seven phases and assert their stable order.
- Construct passive, reaction, deployment, scoped once-per-battle, melee, and ranged entities and
  assert their invariants.
- Preserve parallel standard, Spearhead, seasonal, and Legends rules contexts without collision.
- Reject duplicate entity IDs, dangling provenance references, and invalid phase identifiers.
- Accept an unknown source classification only when its raw value is retained.

**Verification:** The domain test passes, TypeScript accepts exhaustive handling of known variants,
and no production AoS 3 module imports from `src/aos4/domain/`.

### U2. Timing and ability normalization

**Goal:** Convert representative official and Wahapedia timing/ability text into canonical timing
without pretending lossy source fields are authoritative.

**Requirements:** R1-R5, R8, R15-R16, and AE1-AE2.

**Files:**

- Add `src/aos4/normalize/timing.ts`.
- Add `src/aos4/normalize/ability.ts`.
- Add `src/aos4/normalize/text.ts`.
- Add `src/aos4/normalize/diagnostics.ts`.
- Add `src/tests/aos4/timingNormalization.test.ts`.
- Add compact fixtures under `src/tests/fixtures/aos4/timing/`.

**Approach:** Parse timing into independent window, perspective, reaction, priority, frequency, and
scope fields. Prefer explicit source columns, then conservative text recognition. Retain raw timing
and HTML-derived text at every outcome. Treat unknown or conflicting classifications as diagnostics
that strict generation can reject.

**Test scenarios:**

- Normalize Your, Enemy, and Any phase variants for each turn phase.
- Normalize deployment, start/end battle round, passive, reaction, strike-first, and strike-last
  examples.
- Parse Once per Phase, Turn, Battle Round, and Battle, including Army scope.
- Sanitize supported inline markup and reject scripts, event attributes, and unsafe links.
- Preserve an unrecognized timing phrase as unknown and emit a source-addressable diagnostic.

**Verification:** Fixture tests prove AE1-AE2, the sanitizer never emits executable HTML, and every
normalization result includes the original source text.

### U3. Content graph and selection resolution

**Goal:** Replace name-based mandatory side effects with deterministic identifier-based graph
resolution.

**Requirements:** R6, R9, R20, and AE6.

**Files:**

- Add `src/aos4/select/catalog.ts`.
- Add `src/aos4/select/resolveSelection.ts`.
- Add `src/aos4/select/diagnostics.ts`.
- Add `src/tests/aos4/selectionGraph.test.ts`.

**Approach:** Index content by canonical ID and traverse typed relationships such as belongs-to,
offers, requires, includes, and excludes. Return the resolved entity set, causality paths, and
diagnostics. Detect cycles and conflicting edges rather than relying on reducer cleanup behavior.

**Test scenarios:**

- Resolve a faction, battle formation, warscroll, enhancement, and mandatory ability transitively.
- Preserve two same-named entities with different IDs and select the requested one only.
- Deduplicate repeated paths while retaining all causes.
- Report dangling edges, cycles, and include/exclude conflicts deterministically.

**Verification:** Tests prove AE6 and resolution output is independent of input insertion order.

### U4. Reminder projection and stable identity

**Goal:** Project a resolved AoS 4 selection into ordered reminders without the current `Game`
pre-expansion or wording-derived hashes.

**Requirements:** R1-R5, R10-R12, and AE1, AE4-AE6.

**Files:**

- Add `src/aos4/reminders/projectReminders.ts`.
- Add `src/aos4/reminders/orderReminders.ts`.
- Add `src/aos4/reminders/reminderIdentity.ts`.
- Add `src/aos4/reminders/types.ts`.
- Add `src/tests/aos4/reminderProjection.test.ts`.

**Approach:** Emit one reminder occurrence per semantic timing window from resolved abilities.
Order the seven phases from domain definitions and model passive/reaction/combat-priority lanes as
metadata within the applicable window. Merge display-equivalent reminders only after assigning
stable occurrence IDs and retaining all contributing entities.

**Test scenarios:**

- Project a synthetic selected army covering the complete representative timing matrix.
- Order active abilities, reactions, passive reminders, and combat priority consistently.
- Keep the same reminder ID after a wording-only revision and change it after a semantic timing
  change.
- Merge equivalent reminders from two units while retaining both causes and source references.
- Omit content not reached by the resolved selection graph.

**Verification:** Tests prove AE1 and AE4-AE6, and output has no dependency on `TTurnWhen` or `Game`.

### U5. Acquisition and manifest foundation

**Goal:** Retrieve source artifacts reproducibly without coupling network access to normalization.

**Requirements:** R7, R13-R18, R23, R25, AE7, and AE10.

**Files:**

- Add `src/aos4/data/http.ts`.
- Add `src/aos4/data/artifact.ts`.
- Add `src/aos4/data/manifest.ts`.
- Add `src/aos4/data/cache.ts`.
- Add `src/aos4/data/urlPolicy.ts`.
- Add `src/aos4/data/command.ts`.
- Add `src/tests/aos4/acquisition.test.ts`.
- Add compact HTTP fixtures under `src/tests/fixtures/aos4/http/`.
- Update `package.json` and `yarn.lock` only if KTD12's dependency threshold is met.

**Approach:** Inject fetch, clock, DNS/address validation, and cache boundaries. Apply KTD14 before
each request and redirect. Record request URL, redirect target, response validators, retrieval time,
byte length, media type, SHA-256 checksum, and adapter version. Cache bytes by checksum below
`.cache/aos4/`; write a reviewable candidate manifest separately from the currently accepted
manifest.

**Test scenarios:**

- Download a new fixture artifact and record complete manifest metadata.
- Revalidate an unchanged artifact with ETag or Last-Modified and retain its checksum.
- Detect a changed response at the same URL as a new revision.
- Handle redirect, timeout, non-success status, truncated body, and checksum mismatch without
  replacing the accepted artifact.
- Reject HTTP downgrade, unconfigured hosts, loopback/private destinations, redirect loops, excess
  redirects, unexpected media types, and responses above the configured size limit.
- Replay from cache with network disabled and produce the same decoded bytes.

**Verification:** Acquisition tests prove AE7 and AE10 without live network access and produce
deterministic manifest serialization.

### U6. Wahapedia export adapter

**Goal:** Decode the published AoS 4 export set into typed source records with referential
diagnostics.

**Requirements:** R7-R8, R13, R15-R19, and AE2, AE5, AE7.

**Files:**

- Add `src/aos4/data/wahapedia/exportCatalog.ts`.
- Add `src/aos4/data/wahapedia/delimited.ts`.
- Add `src/aos4/data/wahapedia/records.ts`.
- Add `src/aos4/data/wahapedia/decode.ts`.
- Add `src/aos4/data/wahapedia/normalize.ts`.
- Add `src/tests/aos4/wahapediaAdapter.test.ts`.
- Add minimal export fixtures under `src/tests/fixtures/aos4/wahapedia/`.

**Approach:** Define the expected export files and headers from the published specification. Decode
UTF-8 pipe-delimited records, textual booleans, optional fields, IDs, HTML fields, and source joins.
Use source phase/category columns as evidence, not canonical truth. Emit row-addressable diagnostics
for header drift, malformed rows, missing joins, polluted markers, and unknown vocabulary.

**Test scenarios:**

- Decode linked faction, source, warscroll, ability, weapon, keyword, organization, and faction
  ability fixtures.
- Preserve delimiters, line breaks, Unicode, and supported markup inside quoted fields.
- Normalize MELEE and RANGED weapons and keep faction-specific weapon abilities as source facts.
- Detect missing foreign keys, duplicate source IDs, changed headers, invalid booleans, and extra
  columns.
- Compare `Last_update.csv` with artifact retrieval and source dates without treating it as a
  global atomic version.

**Verification:** Tests prove AE2, AE5, and AE7; all fixture source records trace to an artifact and
line number.

### U7. Official discovery, extraction, and reconciliation

**Goal:** Discover authoritative publications and reconcile their facts with secondary records.

**Requirements:** R7-R8, R14, R16, R18, R24-R25, and AE3, AE8-AE10.

**Files:**

- Add `src/aos4/data/gamesWorkshop/downloadCatalog.ts`.
- Add `src/aos4/data/gamesWorkshop/pageDiscovery.ts`.
- Add `src/aos4/data/gamesWorkshop/pdfText.ts`.
- Add `src/aos4/data/gamesWorkshop/extractFacts.ts`.
- Add `src/aos4/data/gamesWorkshop/records.ts`.
- Add `src/aos4/reconcile/linkRecords.ts`.
- Add `src/aos4/reconcile/precedence.ts`.
- Add `src/aos4/reconcile/overrides.ts`.
- Add `src/aos4/reconcile/report.ts`.
- Add `src/tests/aos4/gamesWorkshopAdapter.test.ts`.
- Add `src/tests/aos4/officialDocumentExtraction.test.ts`.
- Add `src/tests/aos4/reconciliation.test.ts`.
- Add minimal fixtures under `src/tests/fixtures/aos4/games-workshop/`.

**Approach:** Isolate the observed private download search contract behind one adapter and use
download-page discovery as its fallback. Treat PDFs as versioned source artifacts, not mutable
URLs. Extract page-addressable candidate facts from supported text PDFs under KTD15 with page,
text-byte, and execution-time limits, and require review for ambiguous layouts. Link records
conservatively, choose values under KTD8, and store manual decisions as reviewed override entries
with reason, author, date, and cited source record IDs.

**Test scenarios:**

- Discover equivalent document metadata from private-API and page fixtures.
- Fall back when the private endpoint returns an error or incompatible shape.
- Identify a new PDF revision at a reused title or a changed versioned URL.
- Extract a known fact and page locator from a small born-digital PDF fixture.
- Emit a review diagnostic and no fact for image-only, encrypted, or ambiguous layout fixtures.
- Stop with a diagnostic when a PDF exceeds configured page, text-byte, or execution-time limits.
- Resolve a newer official field over Wahapedia while retaining both facts.
- Keep parallel contexts distinct and select the applicable fact for AE8.
- Leave ambiguous record links and equally applicable official conflicts unresolved.
- Reject an override that lacks a reason or references missing source records.

**Verification:** Tests prove AE3 and AE8-AE10; no adapter or extraction failure silently converts a
secondary fact into an official one.

### U8. Representative vertical slice

**Goal:** Prove that one current, representative content slice can travel from source fixtures to
the existing builder and reminder presentation.

**Requirements:** R1-R25 and F1-F4.

**Files:**

- Add reviewed fixture-derived content under `src/aos4/generated/representative/`.
- Add `src/aos4/generated/catalog.ts`.
- Add an AoS 4 selection-state seam under `src/aos4/state/`.
- Adapt the narrow builder/reminder entry points under `src/components/input/` and
  `src/components/info/`.
- Add `src/tests/aos4/representativeSlice.test.ts`.
- Add focused component tests if the existing harness can exercise the adapted entry points without
  broad framework changes.

**Approach:** Use Stormcast Eternals as the representative faction, supplemented by compact core
rules fixtures when a required timing or ability form is absent. The slice must exercise battle
traits, a battle formation, enhancements, lore or manifestation content, unit abilities, reactions,
weapons, and a current official update. Keep the old runtime reachable only as a development
fallback until this slice passes. Render through an adapter at the reminder view-model boundary,
not by converting canonical entities back into `TEntry` and `TEffects`. Apply KTD16 without
redesigning the page: preserve the phase hierarchy, show textual type/trigger labels, and keep new
meaning available to keyboard and screen-reader users without relying on color.

**Test scenarios:**

- Generate the representative catalog from accepted fixtures and overrides.
- Select its content by ID and verify all mandatory relationships and reminder timings.
- Trace every displayed reminder and weapon fact to source artifacts.
- Verify deployment, passive, reaction, and combat-priority placement and accessible labels.
- Hide, order, annotate, and print representative reminders using stable IDs.
- Serialize and deserialize the representative AoS 4 army document without invoking the production
  remote saved-army API.
- Verify offline reload uses generated data and cached application assets without source network
  access.

**Verification:** The slice passes source review, focused integration tests, browser smoke testing,
and the repository-wide verification contract.

### U9. Generation gates and legacy isolation

**Goal:** Make acquisition and generation repeatable and prove that AoS 4 cannot depend on the
untrusted AoS 3 graph before the clean cutover.

**Requirements:** R7-R19, R22-R25, and F1-F4.

**Files:**

- Add candidate manifests and explicit acceptance state under `data/aos4/manifests/`.
- Add the representative canonical/source identity registry under `data/aos4/identities/`.
- Add reviewed decisions under `data/aos4/overrides/`.
- Add non-verbatim validation summaries under `data/aos4/reports/`.
- Add deterministic audit/runtime serializers under `src/aos4/generate/`.
- Add `src/tests/aos4/catalogIntegrity.test.ts`.
- Add `src/tests/aos4/legacyIsolation.test.ts`.
- Add data-maintenance documentation under `docs/data/`.

**Approach:** Acquire the live export set as a review candidate without promoting it. Fail strict
generation when source records are unconsumed, unresolved, contradictory, unsafe, or unclassified.
Generate audit and runtime shapes separately under KTD13. Enforce an import boundary in which
`src/aos4/` cannot depend on the old application/rules graph, and freeze AoS 3 data changes.

**Test scenarios:**

- Acquire all documented exports plus explicit official PDF URLs into the checksum cache and replay
  them offline.
- Keep live source output marked candidate and unaccepted.
- Assert every generated entity has provenance and every source record is consumed, ignored with a
  reason, or reported.
- Regenerate the representative audit/runtime products twice and assert byte-identical output.
- Assert generated output contains no raw artifact bytes, unsafe HTML, or fields excluded by R23.
- Assert `src/aos4/` imports no AoS 3 application or rule module.

**Verification:** The representative catalog has zero unacknowledged errors, the live candidate
reports unresolved coverage without promotion, the legacy boundary passes, and repository-wide
verification passes.

### U10. Runtime cutover and AoS 3 removal

**Goal:** Make the validated AoS 4 catalog the only rule path on the migration branch and delete the
superseded AoS 3 implementation before bulk data entry.

**Requirements:** R10-R12 and R20-R23.

**Files:**

- Replace relevant state and saved-army types under `src/store/`, `src/ducks/`, and `src/types/`.
- Replace reminder and builder wiring under `src/utils/` and `src/components/`.
- Remove obsolete AoS 3 faction, generic-rule, phase, importer, alias, compatibility modules, and
  fixtures after their last imports disappear.
- Remove transitional adapters and development fallbacks introduced by U8-U10.
- Update tests to assert AoS 4 behavior only.

**Approach:** Bump persistence and remote saved-army schemas, clear incompatible local caches, and
switch runtime entry points to the AoS 4 catalog. Coordinate remote saved-army API schema changes
without deploying or merging the integration PR. Trace runtime imports, delete each superseded
subsystem rather than adapting it, and accept that the migration branch temporarily exposes only
the representative AoS 4 cohort.

**Test scenarios:**

- Start with AoS 3 persisted state and verify the app resets safely to a valid AoS 4 default.
- Load, save, update, share, and reload an AoS 4 army document with stable reminder preferences.
- Exercise representative builder, reminder, note, hide/order, PDF, offline, and source-trace flows.
- Search the runtime graph for AoS 3 phase literals, faction registries, aliases, temporary
  adapters, and dormant data modules.
- Verify legacy import controls and routes are absent until a dedicated AoS 4 importer is planned.

**Verification:** The AoS 4 path is the production default, clean-reset and save/share tests pass,
no AoS 3 rules path remains, and no production deployment or merge occurs without user approval.

### U11. Approved corpus expansion and final documentation

**Goal:** Expand the AoS 4-only runtime to the reviewed corpus without hand-editing generated files.

**Requirements:** R7-R19, R22-R25, and F1-F4.

**Files:**

- Add accepted manifests, identities, reviewed dispositions, and overrides under `data/aos4/`.
- Generate the complete audit catalog under `data/aos4/catalog/`.
- Generate the compact application projection under `src/aos4/generated/`.
- Update `README.md`, `docs/CONTRIBUTING.md`, and data attribution.
- Update repository tests to contain only current AoS 4 behavior.

**Approach:** Process sources in reviewable cohorts, beginning with core rules and Stormcast
Eternals before expanding by grand alliance or publication family. Detect source removals, renamed
IDs, category drift, stale secondary records, and duplicate canonical matches. Fail generation when
diagnostics exceed accepted overrides, and record product checksums in the accepted manifest.

**Test scenarios:**

- Validate all required export joins and official publication links for each accepted cohort.
- Regenerate twice from the accepted manifest and assert byte-identical output.
- Assert the runtime projection omits curator-only evidence and report its bundle contribution.
- Run the supported data-maintenance flow from documented inputs to deterministic outputs.
- Verify attribution and source links appear in the published reminder experience.

**Verification:** Every approved cohort passes strict integrity, documentation matches the supported
workflow, no parallel AoS 3 counterpart exists, and the complete repository verification contract
passes.

## Verification Contract

Each implementation unit runs its focused Vitest file first. Before a unit is committed or proposed
for integration, run:

```powershell
yarn lint
yarn tsc --noEmit
yarn test --run
yarn build
```

Data acquisition tests must pass with network access disabled. Live-source maintenance commands
write candidate artifacts and reports but never overwrite accepted manifests or generated output
without an explicit review step. The representative slice and cutover also require a browser smoke
test of builder selection, reminder ordering, notes, hiding, save/reload, and offline reload.

Release data has a strict validation gate:

- zero dangling references or duplicate canonical IDs
- zero unsafe HTML
- zero silent source conflicts
- zero unacknowledged unknown timing classifications
- complete provenance for every generated entity
- deterministic output from the accepted manifest and overrides

The integration branch remains deployable, but no Phase 1 verification command may push to
`master`, merge the integration PR, invalidate production caches, or alter production services.

## Definition of Done

- R1-R25 have passing coverage in their cited implementation units.
- F1-F4 work for the representative slice and for every accepted corpus cohort.
- All acceptance examples pass as automated tests or documented browser verification.
- Source manifests, overrides, generated data, and validation summaries are reproducible and
  reviewable under R23.
- Every displayed AoS 4 reminder traces to canonical content and source provenance.
- Persisted AoS 3 data resets safely and no AoS 3 rules path remains in production code.
- The repository-wide verification contract passes with no unexplained new warnings.
- Documentation explains acquisition, review, regeneration, source precedence, attribution, and
  the clean-cut persistence behavior.
- Experimental adapters, dead branches, temporary conversions back to `TEntry`/`TEffects`, and
  abandoned generated artifacts are removed.
- Migration changes are committed and proposed only against `aos4-migration`; launch remains an
  explicit user decision.

## Appendix

### Research Notes That Shape the Plan

- The current `TTurnWhen` union exports 156 literal timing values, including 120 round-specific
  duplicates and AoS 3 Battleshock timing. This makes KTD2 and U1-U2 load-bearing.
- `processGame` expands each effect into phase buckets before selection, while `processReminders`
  later filters by selected display names. U3-U4 reverse that order.
- Reminder IDs currently hash phase, name, and description. Notes, visibility, and ordering depend
  on those IDs, so KTD3 and KTD5 address an observed data-integrity problem rather than a cosmetic
  refactor.
- Wahapedia's `ability_phase` is a useful display hint but collapses Deployment and Start of Battle
  Round into Start of Turn in sampled exports. The free-form condition field also contains reaction
  triggers, embedded markup, and source markers. U2 and U6 therefore preserve raw timing and make
  uncertainty explicit.
- The Warhammer Community downloads page is a dynamic Next.js application. Its observed private
  search request returned an error during the 2026-07-27 research pass, which justifies U7's
  isolated adapter and fallback.
- The current CI pull-request trigger targets `master`, so a sub-PR to `aos4-migration` may not
  receive hosted CI. Local verification remains mandatory until that workflow gap is addressed.
