---
title: Command Point Cost Reminder Tags - Plan
type: feat
date: 2026-08-03
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
issue: 1856
---

# Command Point Cost Reminder Tags

Issue: [#1856](https://github.com/daviseford/aos-reminders/issues/1856)

## Goal Capsule

Show a compact `N CP` tag on a reminder when using that command ability costs command points. The
fact must come from the accepted AoS 4 source corpus, survive the canonical data and reminder
projection layers, and appear consistently on screen and in print/PDF output.

The reported Sylvaneth case currently cannot be fixed in presentation alone. Wahapedia renders the
cost in a numeric `.abCommandPointsN` badge, but the HTML adapter only recognizes textual
`Spell (N)` and `Prayer (N)` headers. The same numeric badge is also used for spell and prayer target
numbers, so the adapter must classify it with structured ability keywords rather than assuming every
badge represents command points.

## Product Contract

### Problem

Some faction commands consume command points, but their reminder cards do not show the cost. A
player has to remember that cost or rediscover it elsewhere while playing. The canonical model
already supports `AbilityCost`, including command points, but most accepted HTML records never
populate it and the reminder view model does not expose it.

### Requirements

- **R1 — Decode structured source cost.** For an accepted Wahapedia ability, read a positive integer
  from the numeric cost badge in the ability's own header row. Classify it as `spell` when the
  immediate ability keyword strip contains `SPELL`, as `prayer` when it contains `PRAYER`, and as
  `command-points` otherwise. Preserve the existing textual `Spell (N)` / `Prayer (N)` fallback.
- **R2 — Fail closed on ambiguous input.** Do not emit a cost from a missing, malformed, zero, or
  conflicting badge. A conflict leaves the existing cost fields empty; it does not invent a new
  adapter diagnostic contract for this feature. Do not infer costs from ability prose or names. Keep
  parsing scoped to the ability row so tooltip/template duplicates cannot leak in. Synthetic and
  future malformed input may decode without a cost, but an unclassified numeric badge in the
  accepted corpus is a certification blocker.
- **R3 — Preserve canonical provenance.** Flow the decoded `pointsType` and `points` through the
  existing source record, reconciliation, and generator path into `Ability.cost`. Regenerate the
  accepted audit catalog and compact runtime products; never edit generated JSON by hand.
- **R4 — Preserve reminder identity.** Carry `AbilityCost` on `ProjectedReminder`. Include normalized
  cost in display equivalence so identical-looking occurrences with equal costs may merge, while
  occurrences with different costs cannot silently collapse into one reminder.
- **R5 — Render command costs only.** For `cost.kind === 'command-points'`, place a semantic cost tag
  before attribution, keyword, and timing tags. Its label is `N CP`; its explanation is
  `Costs N command point to use.` or `Costs N command points to use.` Spell, prayer, faction-resource,
  absent, and unknown costs do not get a CP tag in this feature.
- **R6 — Keep renderers aligned.** The same structured tag must work through the generic reminder-tag
  component, browser print, and PDF export. Add a distinct `cost` tone to web and print palettes,
  preserving the existing chip size, touch explanation, theme behavior, and print layout.
- **R7 — Prove complete badge coverage and the reported data.** Inventory every numeric cost badge
  attached to an in-scope accepted ability and give each exactly one command, spell, or prayer
  disposition. Any malformed, conflicting, or unclassified accepted badge blocks certification.
  The corpus assertions must include at least one real Sylvaneth 1-CP command and one real 2-CP
  command, while a real numeric spell badge remains a spell cost and does not become a CP tag.

### Acceptance Examples

- **AE1 — Sylvaneth 1 CP:** a selected reminder backed by a Sylvaneth command whose source badge is
  `1` renders `1 CP`, and its accessible label contains `Costs 1 command point to use.`
- **AE2 — Multiple command points:** a command with a source badge of `2` renders `2 CP` and uses the
  plural description.
- **AE3 — Spell badge:** an ability with a badge of `7` and the `SPELL` keyword generates
  `{ kind: 'spell', value: 7 }` and renders no CP tag.
- **AE4 — No cost:** an ordinary ability with no valid cost evidence keeps `cost` undefined and
  renders no cost tag.
- **AE5 — Deduplication:** two otherwise display-equivalent occurrences with equal costs merge; two
  with different costs remain distinct.
- **AE6 — Cross-renderer order:** `N CP` is the first tag on the reminder in the browser model and is
  present in the same order in browser print and PDF models.
- **AE7 — Complete accepted-badge inventory:** the review output accounts for every numeric badge on
  an accepted parsed ability; the accepted revision cannot certify with an unresolved badge.

### Scope Boundaries

- No army-points total, list validation, command-point tracker, resource spending, or remaining-CP
  state.
- No new importer behavior, runtime source fetch, provider, API, account, subscription, or sharing
  change.
- No spell-casting-value or prayer-chanting-value tag in this issue; those costs are carried only to
  keep the domain path correct.
- No faction-resource tag unless separately requested and designed.
- No broad reminder-card restyle. The feature reuses the existing tag interaction and layout.
- No source acquisition change. It re-decodes the already accepted immutable HTML artifacts.
- A missing badge remains “no source-backed cost displayed,” not a claim that the ability is free.
  This issue does not infer an unknown-cost state for abilities whose source provides no badge.

### Key Technical Decisions

- **KTD1 — Structural extraction, semantic classification.** Locate the badge from the same DOM row
  as the parsed ability header and read its numeric text. Use the adapter's immediate keyword strip
  to distinguish spell/prayer target numbers from command-point costs. Textual header evidence stays
  as a fallback for provider variants that lack the badge. Before writing generated products,
  inventory the full accepted badge-bearing cohort to establish that spell, prayer, and command are
  exhaustive for this snapshot; the default-to-command rule is valid only under that reviewed
  provider invariant and must be re-checked on future accepted refreshes.
- **KTD2 — Conflict handling.** Badge and textual evidence may corroborate one another. If both are
  present but disagree on kind or value, omit the cost instead of choosing one silently. The parser
  has no cost-conflict diagnostic contract today, and adding one would widen this focused feature;
  adapter tests make the fail-closed behavior explicit.
- **KTD3 — Cost is display-significant.** Add `cost?: AbilityCost` to the projected reminder and
  serialize a complete deterministic cost key: kind and value for spell, prayer, and command-point
  costs; kind, normalized resource name, and value for faction-resource costs. This avoids an
  arbitrary “first occurrence wins” merge and requires no new mutable reminder identity scheme.
- **KTD4 — A dedicated semantic tone.** Add `cost` to the tag-tone contracts. It names the game
  resource facet rather than borrowing `usage`, whose dashed outline explicitly means a usage
  constraint. Use a quiet, readable treatment in both subscriber themes and outline ink in print.
- **KTD5 — Presentation consumes structure only.** The view layer checks `reminder.cost.kind`; no
  component parses rules text, source HTML, or labels. `ReminderTags` and print document construction
  remain generic consumers.
- **KTD6 — Certification compares cost semantics.** Extend source-fidelity review so a source record
  carrying `pointsType`/`points` evidence must match the generated `Ability.cost` kind and value
  exactly. A missing generated cost, partial source evidence, invalid value, or kind/value mismatch
  fails the comparison; a record with no cost evidence does not invent an absence assertion.

## Planning Contract

### Current Path

```text
accepted Wahapedia HTML
  -> src/aos4/data/wahapediaHtml/parse.ts
  -> WahapediaHtmlAbilityRecord.pointsType / points
  -> src/aos4/generate/corpus.ts abilityCost(...)
  -> Ability.cost
  -> src/aos4/reminders/projectReminders.ts
  -> ProjectedReminder.cost
  -> src/aos4/view/reminders.ts cost tag
  -> ReminderTags + browser print + PDF
```

The middle generator mapping already understands `spell`, `prayer`, and `command`; the missing
pieces are badge decoding, reminder projection, tag presentation, and regenerated accepted data.

### Constraints

- Respect the `src/aos4/` inward-only dependency boundary and stable-ID contracts.
- Use the accepted candidate/review/generation workflow for every source-derived file.
- Preserve all existing reminder tag labels, order within their current families, themes, touch
  behavior, responsive layout, browser print behavior, and PDF layout.
- Run the beta verification gate for the accepted revision.
- Build before the full test run because the PWA tests inspect `dist/`.

### Risks and Mitigations

- **Shared badge class:** a naive parser would turn casting values into CP costs. Pin command, spell,
  prayer, malformed, and conflicting examples in adapter tests before regenerating.
- **Tooltip duplicates:** global badge queries can duplicate or misassociate costs. Query only from
  the ability's scoped DOM row and retain existing body/header filtering.
- **Silent reminder merging:** the projector currently keys on name, text, and timing. Add cost to
  the key and test both equal- and unequal-cost cases.
- **Generated-data blast radius:** re-decoding the accepted corpus may update many records. Review
  the generated diff and campaign inventory for cost-only changes and reject unrelated churn.
- **Misleading absence:** once CP tags exist, a player may read an untagged command as free. Require
  complete disposition of every source badge and describe tags as positive source-backed costs;
  never synthesize a free/zero or unknown cost from badge absence.
- **Theme/print drift:** an incomplete tone union breaks one renderer or produces an unstyled chip.
  Keep tone maps exhaustive and test every browser/print tone.
- **Certification staleness:** regeneration invalidates the current machine certificate. Prepare a
  new review workspace/campaign, reuse only still-valid prior machine evidence through the supported
  command, prepare a new certification, repoint `beta.json`, and verify it fails closed.

## Implementation Units

### U1 — Decode Numeric Cost Badges

**Files**

- `src/aos4/data/wahapediaHtml/parse.ts`
- `src/tests/aos4/wahapediaHtmlAdapter.test.ts`

**Work**

1. Add a small parser for a positive numeric badge scoped to the current ability row.
2. Reuse the parsed immediate keyword strip to classify `SPELL` and `PRAYER`; otherwise emit
   `Command`/the exact generator-recognized command type.
3. Reconcile badge and existing textual header evidence. Equal evidence is accepted; conflicts and
   malformed values produce no cost, with that fail-closed result pinned directly by adapter tests.
4. Extend adapter fixtures for 1 CP, 2 CP, spell, prayer, textual fallback, duplicate tooltip,
   malformed, and conflicting evidence.

**Exit evidence**

- Adapter tests prove exact `pointsType` and `points` records for all supported classifications.
- No broad DOM query is used and no prose parsing is introduced.

### U2 — Regenerate and Re-certify the Accepted Corpus

**Files**

- `src/aos4/review/adversarialReview.ts`
- `src/tests/aos4/adversarialReview.test.ts`

**Files produced by the supported workflow**

- `data/aos4/catalog/catalog.json`
- `data/aos4/catalog/official-battle-profiles.json` only if the generator deterministically changes it
- `data/aos4/identities/corpus.json` only if the generator deterministically changes it
- `src/aos4/generated/corpus/*.json`
- `data/aos4/reports/*` and the new review/certification artifacts required by the beta gate
- `data/aos4/certifications/beta.json`

**Work**

1. Extend `abilitySourceFidelityChecks` to derive the expected structured cost from source
   `pointsType`/`points` and compare it exactly with generated `Ability.cost`. Add positive and
   negative tests for command, spell, prayer, missing generated cost, partial/invalid source evidence,
   and kind/value mismatch.
2. Run candidate generation against the accepted immutable artifacts and inspect the in-memory diff.
3. Run the explicit candidate write workflow only after the parser and focused tests pass.
4. Produce a complete accepted-badge inventory and assert every in-scope numeric badge has exactly
   one command/spell/prayer disposition. Assert the regenerated catalog contains canonical
   command-point costs for a named Sylvaneth ability and a real 2-CP ability, plus a spell badge
   classified as a spell.
5. Prepare and run the machine/adversarial review campaign for the new accepted projection, reusing
   prior certification evidence only through the review command's supported option.
6. Prepare the new certification, update the beta pointer, and run the fail-closed beta verifier.

**Exit evidence**

- Generated source/runtime diffs are deterministic and limited to new structured costs, their
  checksums/counts, and required review evidence; no accepted numeric badge is unresolved.
- Adversarial review fails when source cost evidence and generated `Ability.cost` disagree.
- `yarn data:aos4:generate:candidate` and `yarn data:aos4:verify:beta` pass from the checked-in tree.

### U3 — Project Costs Without Losing or Merging Them

**Files**

- `src/aos4/reminders/types.ts`
- `src/aos4/reminders/projectReminders.ts`
- `src/tests/aos4/reminderProjection.test.ts`
- a focused accepted-corpus reminder-cost test under `src/tests/aos4/`

**Work**

1. Add `cost?: AbilityCost` to `ProjectedReminder` and copy it from the canonical ability.
2. Add a stable cost segment, including an explicit absent value, to the display key. Include the
   normalized resource name for `faction-resource` so equal numeric values for different resources
   remain distinct.
3. Preserve cost during reminder merging; equal keys guarantee equal cost.
4. Test absent/equal/different costs, equal-valued faction-resource costs with different resource
   names, and the accepted Sylvaneth/2-CP/spell examples.

**Exit evidence**

- Projection retains the exact structured cost.
- Different costs never merge, while equal costs keep existing deduplication behavior.

### U4 — Add the Command-Point Tag Across Renderers

**Files**

- `src/aos4/view/reminders.ts`
- `src/tests/aos4/reminderCostTags.test.ts` (or the nearest focused view-model test)
- a focused rendered reminder-tag test under `src/tests/aos4/` or the nearest Home presentation test
- `src/aos4/print/types.ts`
- `src/aos4/print/presets.ts`
- `src/tests/aos4/printTags.test.ts`
- `src/css/index.scss`
- `DESIGN.md`

**Work**

1. Add a `costTag` helper that returns only a structured command-point tag with singular/plural
   description.
2. Put it before source, provenance, keyword, and timing tags, and include its description in the
   reminder's accessible label.
3. Add the semantic `cost` tone to view/print contracts, both theme palettes, browser-print fallback,
   and PDF preset ink.
4. Update the design-system chip vocabulary and exhaustive tag-tone tests.
5. Confirm no feature-specific branch is needed in `ReminderTags`, print document construction, or
   PDF rendering.
6. Render a CP-bearing reminder and assert that its tag remains a native focusable button, exposes
   an accessible name containing `N CP` and the singular/plural explanation, toggles the existing
   inline explanation and `aria-expanded` with Enter/Space as well as click/tap, and preserves the
   existing visible focus treatment.

**Exit evidence**

- View-model tests pin label, tone, description, accessible text, exclusions, and first position.
- A rendered component test pins the actual button semantics and keyboard/touch explanation state.
- Browser and print tone tests are exhaustive and tag layout measurements remain unchanged.

## Verification Contract

### Automated

Run focused tests while implementing:

```powershell
yarn vitest run src/tests/aos4/wahapediaHtmlAdapter.test.ts
yarn vitest run src/tests/aos4/reminderProjection.test.ts
yarn vitest run src/tests/aos4/reminderCostTags.test.ts
yarn vitest run src/tests/aos4/printTags.test.ts
```

Run data integrity checks after regeneration and certification:

```powershell
yarn data:aos4:generate:candidate
yarn data:aos4:verify:beta
```

Run the full repository gate in its required order:

```powershell
yarn lint
yarn tsc --noEmit
yarn build
yarn test --run
```

### Browser and Print QA

- Start the app and inspect `/` at a desktop viewport and a narrow mobile viewport.
- Select a path that exposes the accepted Sylvaneth command fixture and confirm `1 CP` is the first
  tag, is visibly focusable, opens the existing explanation on click/tap and Enter/Space with
  `aria-expanded` tracking the state, and does not disturb wrapping or card controls.
- Inspect a 2-CP command and a numeric spell badge; only the command abilities show CP tags.
- Compare light and subscriber dark themes for legible borders/text with unchanged chip geometry.
- Open browser print preview and export both standard and compact PDFs. Confirm the CP tag is present,
  ordered, unfilled, readable, and does not overlap the title or other tags.
- Compare desktop/mobile landmarks and reminder-card interaction with the live site; no unrelated
  visual delta is accepted.

### Review Gates

- Review the parser, generated diff, reminder equivalence, accessibility, and cross-renderer tone
  exhaustiveness for correctness.
- Run a second full-diff review after fixes, covering regressions, tests, repository standards, and
  generated-data integrity.
- Open a draft PR to `master`, link `#1856`, and wait for GitHub checks. Do not merge.

## Definition of Done

- Issue #1856 contains a link or full copy of this implementation-ready plan for a future agent.
- Accepted source records decode command/spell/prayer badges correctly and generated canonical
  abilities contain the appropriate structured costs.
- Command abilities show an accessible, first-position `N CP` tag on screen, browser print, and PDF;
  other cost kinds do not show a CP tag.
- Reminder projection cannot merge different costs.
- Accepted Sylvaneth, 2-CP, and spell-badge regressions are pinned by tests.
- Candidate generation, beta verification, lint, typecheck, build, and the full test suite pass.
- Two code-review passes are clean after applied fixes.
- A draft PR targeting `master` is open with the issue and verification evidence attached; it is not
  merged.
