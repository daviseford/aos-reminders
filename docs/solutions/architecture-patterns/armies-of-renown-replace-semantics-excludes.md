---
title: "Replacement semantics for Armies of Renown: excludes edges, two-pass selection, and granted-content surfacing"
date: 2026-08-01
category: architecture-patterns
module: aos4-corpus
problem_type: architecture_pattern
component: service_object
severity: high
applies_when:
  - "Modeling official content that REPLACES other content (not adds to it) in the AoS4 entity/relationship corpus"
  - "Adding a new relationship kind to the generator and deciding its rules-context scoping"
  - "Surfacing auto-granted (included, never offered) content in the builder UI"
  - "Tempted to rename generated entities for display context (the grounding auditor will reject it)"
  - "Adding a top-level army variant choice (Armies of Renown, or a future analogous mechanic)"
symptoms:
  - "AoR battle traits stacked with regular faction battle traits in reminders (#1833) — illegal in play"
  - "Army of Renown rendered as an ad-hoc name-slugged content-group card instead of a top-level army choice"
  - "Cross-context excludes edges silently vanished because relationship contexts were the intersection of endpoint contexts"
root_cause: logic_error
resolution_type: code_fix
related_components:
  - "src/aos4/generate/corpus.ts"
  - "src/aos4/select/resolveSelection.ts"
  - "src/aos4/view/builder.ts"
  - "src/components/page/homeHeader.tsx"
  - "src/components/input/army_builder.tsx"
  - "data/aos4/reviews/corpus-2026-08-18.json"
tags: [army-of-renown, excludes-relationship, two-pass-selection, rules-context-scoping, replacement-semantics, grounding-audit, corpus-generation, subfaction-modeling]
---

# Replacement semantics for Armies of Renown: `excludes` edges, two-pass selection, and granted-content surfacing

## Context

Armies of Renown (AoR) are official AoS4 army variants whose rule text is "use the faction rules on these pages instead of the [faction] rules" plus a roster restriction — a **replacement**, not an addition. The corpus originally flattened each of the 12 official AoRs into an ad-hoc name-slugged content-group card (the legacy shape is documented at src/aos4/import/armiesOfRenown.ts:9-13: a container whose `groupType` is the army's slug, e.g. `da-kings-gitz`). Two consequences:

- **GitHub issue #1833**: selecting AoR content STACKED its battle traits with the regular faction battle traits in the reminders — illegal in play, because the corpus had no way to express "this content replaces that content."
- The AoR read as just another card among the faction's content groups instead of a top-level army choice.

The fix (issue #1834, PR #1835 — open/unmerged as of this writing — snapshot revision aos4-corpus-2026-08-01e) was owner-directed to mirror the AoS 3 faction→sub-faction pattern. The pre-cutover AoS 3 app was checked out from git history (b9791cb6~1) into a worktree and run live as the UX reference: its sub-faction dropdown sat under the faction select, and allegiance battle traits auto-populated reminders with no category card.

Several first attempts failed in instructive ways (detailed in Examples):

1. **Offer-not-include wiring**: making the root *offer* its enhancement subgroups left them clustered under an army-slug card — a duplicative "The Roving Maw" card next to the masthead dropdown. Owner rejected it. The correct semantic is that picking the army **grants** its whole rules set.
2. **Vanishing cross-context `excludes` edges**: `contextualRelationships` in src/aos4/generate/corpus.ts assigns each relationship the INTERSECTION of its endpoints' `rulesContextIds` and DROPS relationships with no shared context (corpus.ts:2098-2102). An exclusion from a current-context AoR root to a historical/demoted group silently disappeared, so the builder's Legends/historical overlays still offered the replaced content.
3. **Qualified display renames rejected by the grounding auditor**: renaming granted subgroups (e.g. "Trugg's Troggherd Battle Traits") produced 12+ major findings from the independent adversarial auditor — `unsupportedSourceValue` in src/aos4/review/adversarialReview.ts:203-224 does comparable-text equality between generated names and source records. Reverted.
4. **Invisible granted content**: `createAos4BuilderViewModel`'s options only cover explicit selections plus `availableIds` — included-but-never-offered entities never appear; and src/components/input/army_builder.tsx filtered options to warscroll/content-group kinds, dropping ability chips even after the view emitted them.

## Guidance

When official content **replaces** other content rather than adding to it, model the replacement in the relationship graph — never by flattening, renaming, or ad-hoc grouping.

**1. Classification lives in the review file.** The `armiesOfRenown` array in data/aos4/reviews/corpus-2026-08-18.json names each AoR root by faction-group source record and must cite official evidence — generation validates that each entry targets an existing group, has a reason, and has `officialSourceRecordIds` (corpus.ts:1975-2001).

**2. Generation (src/aos4/generate/corpus.ts):**
- The classified root's `groupType` becomes `'army-of-renown'` (corpus.ts:1945); the faction *offers* the root — it is the top-level choice, never auto-included (corpus.ts:1964-1972).
- The root auto-INCLUDES every subgroup — picking the army grants the whole rules set (corpus.ts:2026-2030); abilities sitting directly on the root are likewise included (corpus.ts:2222-2228).
- Subgroups keep their **real** rules category as `groupType` (`spell-lore`, `heroic-trait`, …) and their exact source names — "the army context is carried by the relationship graph", not the name (comment at corpus.ts:2010-2013).
- `excludes` edges go from each root to every regular faction rules-choice group; the replaced set is `ARMY_OF_RENOWN_REPLACED_GROUP_TYPES` = battle-trait, battle-formation, heroic-trait, artefact-of-power, spell-lore, prayer-lore, monstrous-traits, big-names (corpus.ts:558-567, emission at corpus.ts:2246-2252). Universal manifestation lores and general rules modules are army-agnostic and remain (comment at corpus.ts:552-557).
- **`excludes` relationships carry the UNION of endpoint contexts**, unlike every other kind (intersection); see the before/after in Examples (corpus.ts:2363-2384).

**3. Selection (src/aos4/select/resolveSelection.ts): two-pass resolution.** Pass 1 resolves normally; any `excludes` edge whose source is then selected suppresses its target for pass 2 — the target and everything reachable only through it disappear from selected and available (a suppressed entity is unreachable: "not offered, not auto-included", resolveSelection.ts:201-202). An EXPLICIT selection of an excluded target is never silently suppressed — it stays selected and surfaces as an `excluded-selection` diagnostic (resolveSelection.ts:252-284).

**4. View (src/aos4/view/builder.ts):** granted content never reaches `availableIds`, so the view walks `selection.causes` from explicit `army-of-renown` roots and emits each granted ability as a selected chip in its parent's real category card (builder.ts:141-172; `ABILITY_CHIP_CATEGORIES` = artefact-of-power, heroic-trait, prayer-lore, spell-lore at builder.ts:41 — renamed and broadened since this learning was written: the same set now also serves imported-roster enhancement chips, #1827; names title-cased via `chipCase`, builder.ts:43-55). Battle traits stay reminder-only, like every army's battle traits. src/components/input/army_builder.tsx admits ability-kind options with a groupType and filters out the `army-of-renown` root itself — the masthead dropdown owns it (army_builder.tsx:170-176). src/components/page/homeHeader.tsx renders the AoR dropdown directly under the faction select, only for factions that have one (homeHeader.tsx:153-181).

**5. Importer (src/aos4/import/armiesOfRenown.ts):** the structural army index recognises classified roots first-class (`container.groupType === 'army-of-renown'`) before falling back to the legacy slug heuristic for Regiments of Renown and similar (armiesOfRenown.ts:162-169).

## Why This Matters

- **Correctness in play**: without replacement semantics, the app told players to apply two mutually exclusive battle-trait sets simultaneously (#1833). Rules replacement is a first-class game mechanic; the data model must express it or reminders are wrong.
- **The intersection default is a silent dropper.** Context-scoping relationships by endpoint intersection is right for containment ("this include exists where both sides exist") but wrong for exclusion — a replacement must apply wherever *either* endpoint can appear, or historical/Legends overlays resurrect the replaced content. Any future cross-context relationship kind needs the same scrutiny.
- **Generated names must stay source-faithful.** The adversarial grounding auditor (adversarialReview.ts:203-224) enforces comparable-text equality between generated names and source records. Display-context renames will be rejected wholesale; disambiguation belongs in the relationship graph and the view layer, not in entity names.
- **Granted ≠ offered has UI consequences.** Anything reachable only via `includes` is invisible to option-building code that iterates explicit + available IDs. Surfacing granted content requires walking `causes` — and every downstream kind filter (army_builder.tsx:173-176) must admit the new option kind or the chips silently vanish.
- **Pattern precedent**: this mirrors the AoS 3 faction→sub-faction UX, so it is the established shape for any future "pick a variant that swaps the rules set" mechanic.

## When to Apply

- Adding or reclassifying an Army of Renown (or any official variant that replaces faction rules): review entry in data/aos4/reviews/corpus-*.json `armiesOfRenown`, citing official evidence.
- Introducing a new relationship kind in corpus generation: decide explicitly whether its `rulesContextIds` should be endpoint intersection (containment-like) or union (replacement/exclusion-like) — corpus.ts:2363-2384 is the seam.
- Any bug where mutually exclusive rule sets both appear in reminders: check for missing `excludes` edges, then check the two-pass suppression in resolveSelection.ts.
- Surfacing auto-included content in the builder: extend the causes walk in builder.ts and verify the option kind survives army_builder.tsx's filter.
- Tempted to rename a generated entity for display context: don't — the grounding auditor compares names to source records exactly (comparable-text). Carry context in relationships or view logic.

## Examples

### The excludes union-of-contexts fix (corpus.ts contextualRelationships)

Before — every relationship got the intersection, and no-shared-context relationships were dropped, which deleted exclusions targeting historical/demoted groups:

```ts
const contextualRelationships = relationships.flatMap(relationship => {
  const from = entityById.get(relationship.from)
  const to = entityById.get(relationship.to)
  if (!from || !to) return [relationship]
  const toContextIds = new Set(to.rulesContextIds)
  const sharedContextIds = from.rulesContextIds.filter(id => toContextIds.has(id))
  return sharedContextIds.length
    ? [{ ...relationship, rulesContextIds: uniqueSorted(sharedContextIds) }]
    : []   // <-- an excludes edge to a historical group vanished here
})
```

After (corpus.ts:2363-2384) — `excludes` carries the union, everything else keeps the intersection:

```ts
if (relationship.kind === 'excludes') {
  // A replacement crosses contexts: the builder's Legends/historical overlays let a
  // current-context army see other contexts' content, so an Army of Renown's exclusion stays
  // applicable wherever either endpoint exists — an intersection would silently drop the
  // exclusion of exactly the overlay content it must suppress.
  return [
    {
      ...relationship,
      rulesContextIds: uniqueSorted([...from.rulesContextIds, ...to.rulesContextIds]),
    },
  ]
}
// (all other kinds: intersection, dropped when empty)
```

### The two-pass suppression shape (resolveSelection.ts:252-267; annotated excerpt)

```ts
// Pass 1 resolves without suppression; any `excludes` edge whose source is then selected
// suppresses its target for pass 2. Suppression models replacement (an Army of Renown replaces
// the faction's regular rules): the target and anything reachable only through it disappear
// from selection and availability. An explicit selection is never silently suppressed — it
// stays selected and the conflict surfaces as a diagnostic instead.
const firstPass = runPass(new Set())
const explicitIdSet = new Set(input.explicitIds)
const suppressedIds = new Set<CanonicalId>()
applicableRelationships
  .filter(relationship => relationship.kind === 'excludes')
  .forEach(relationship => {
    if (!firstPass.selectedIds.has(relationship.from)) return
    if (explicitIdSet.has(relationship.to)) return // never silently drop an explicit pick
    suppressedIds.add(relationship.to)
  })
const finalPass = suppressedIds.size ? runPass(suppressedIds) : firstPass
```

Inside `runPass`, suppression makes the target unreachable in every direction (resolveSelection.ts:201-202): `if (suppressedIds.has(target.id)) return` — not offered, not auto-included. Explicitly selected excluded targets survive and produce an `excluded-selection` error diagnostic (resolveSelection.ts:271-284).

### Failure modes preserved

- **Stacking bug (#1833)**: no `excludes` edges → AoR battle traits + faction battle traits both in reminders. Regression-covered in src/tests/aos4/armiesOfRenown.test.ts:120-301 (classification, per-faction replacement, granted chips, the #1833 regression, and the explicit-pick diagnostic).
- **Offer-not-include**: root offering subgroups reproduced the rejected army-slug card UX; the accepted shape is root includes subgroups (corpus.ts:2026-2030) and the masthead dropdown is the only place the army itself appears (army_builder.tsx:175 filters `groupType !== 'army-of-renown'`).
- **Auditor-rejected renames**: "Trugg's Troggherd Battle Traits"-style qualified names → 12+ major `secondary.source-*` findings from `unsupportedSourceValue` (adversarialReview.ts:203-224). Names stay exactly the source's heading (corpus.ts:2021, comment at 2010-2013).
- **Invisible granted chips**: builder options derive from explicit + available IDs only; granted (included) abilities needed the causes walk (builder.ts:154-171) AND the army_builder.tsx kind filter widened to `option.kind === 'ability' && Boolean(option.groupType)` (army_builder.tsx:174-175) before anything rendered.

### Verification of the accepted solution

Deterministic regeneration (`yarn data:aos4:generate:candidate` byte-for-byte), full adversarial campaign 39,981 pairs / 79,962 pass / 0 findings / 0 cannot-verify, beta gate green, 1,219 tests passing, browser-verified against the live AoS 3 reference app run from git history. Shipped via issue #1834 / PR #1835 (open at time of writing), fixing #1833.

## Extension: source-marked classification and the secondary-provisional tier (#1844, corpus-2026-08-01f)

The classification scaled from the 12 seasonal armies to all 60 source-classified Armies of
Renown. Two durable discoveries:

- **The secondary source classifies AoRs machine-readably.** Every current battletome/seasonal
  AoR section on a Wahapedia faction page carries `<div class="h2_ArmyOfRenown">Army of
  Renown</div>` immediately before its `<h2>`; the White Dwarf (Legends) sections instead open
  with the replace-rules sentence naming the army an Army of Renown (some but not all carry the
  `#Armies-of-Renown` anchor link — match the text, not the link). The decoder captures this as a
  derived `armyOfRenown` flag on the faction-group record, deliberately OUTSIDE the hashed record
  value (`recordChecksum = sha256(JSON.stringify(value))` in wahapediaHtml/parse.ts), so record
  identity never churns.
- **Classification is now fail-closed in both directions** (corpus.ts): a source-marked group
  without a reviewed `armiesOfRenown` entry is an `unclassified-army-of-renown` error — a new
  battletome AoR appearing on a faction page stops generation until reviewed, so the "bogus
  title-cased card offering piecemeal picks" bug class (#1844) cannot recur silently — and an
  entry targeting an unmarked group is an `invalid-review` error (typo/stale-pin guard).
- **`CorpusArmyOfRenown.evidenceTier`**: `official` (default, requires cited official naming
  records) or `secondary-provisional` (classifies on the source's own marking when no free
  accepted official document names the army; cited official records remain corroboration).
  This Classification Evidence Tier was introduced under the then-current three-tier source
  policy (owner ruling 2026-08-01, #1812), which was superseded on 2026-08-18 by #1757 — a
  two-tier hierarchy with BSData as a co-equal peer secondary. **The tier itself is unaffected
  and still live**: it is orthogonal to the retired source-tier "Provisional Content" (see
  CONCEPTS.md, "Classification Evidence Tier", and the flagged ambiguity distinguishing the two
  senses of "provisional"). The "three-tier" wording survives in corpus.ts and in accepted
  review entries as legacy vocabulary pending a schema flattening. The Rules Updates FAQ compendium turned out to name many
  battletome AoRs with explicit `ARMY OF RENOWN, <NAME>` errata headings — when hunting official
  naming evidence, sweep the full text of ALL cached official PDFs, not just the obvious
  document.
- **Name collisions are real**: Sylvaneth has both a regular battle formation and an AoR named
  "Lords of the Clan" (Battle Profiles p24's 0-point battle-formation row is the former, not AoR
  evidence), and the same army can be a root on several faction pages (Big Waaagh! on Ironjawz +
  Kruleboyz; The Duardin Ascendant on Kharadron Overlords + Cities of Sigmar + Fyreslayers).
  Resolve roots by (faction, name) or by offer edges, never by name alone.

## Related

- GitHub #1834 — feat: Armies of Renown as a top-level choice under the faction selector (the feature this documents; PR #1835)
- GitHub #1833 — fix: Army of Renown content stacks with the regular faction rules it replaces (the bug the pattern fixes)
- GitHub #1844 — battletome/Legends AoRs decoded as bogus builder cards; closed by the source-marked classification extension above (PR #1848)
- GitHub #1783 (closed) — prior corpus-generation bug that lost Army of Renown formation groups; background context
- GitHub #1828 / #1812 — adjacent Ogor battletome/supplement content intake (then-current provisional BSData fallback tier and provisional watch; that fallback tier was superseded 2026-08-18 by #1757, which raised BSData to a co-equal peer secondary — see src/aos4/radar/provisionalWatch.ts:16-20)
- docs/plans/2026-08-01-001-feat-armies-of-renown-plan.md — the implementation plan for this work
- docs/plans/2026-08-01-003-feat-battletome-aor-classification-plan.md — the #1844 extension plan
