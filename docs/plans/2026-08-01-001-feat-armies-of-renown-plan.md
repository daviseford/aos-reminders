---
title: Armies of Renown as a Top-Level Choice - Plan
type: feat
date: 2026-08-01
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
issue: 1834
---

# Armies of Renown as a Top-Level Choice - Plan

## Goal Capsule

- **Objective:** Model Armies of Renown as what they officially are — a top-level army choice that
  *replaces* the faction's regular rules — surfaced as a dropdown under the faction selector (the
  AoS 3 faction → sub-faction pattern, reborn AoS 4-native), and fix the correctness bug where AoR
  content stacks with the regular battle traits it replaces (#1833).
- **Authority order:** The official July 2026 *Armies of Renown* download (accepted artifact
  `240af53b…`, 24 pages, 12 AoRs) is authoritative for which AoRs exist and what they replace;
  repository constraints (AGENTS.md); issues #1833/#1834; the AoS 3 implementation
  (`b9791cb6~1:src/components/page/homeHeader.tsx`) as UX pattern reference only — no AoS 3 module
  returns.
- **Execution profile:** Reviewed data classification + deterministic generation + selection
  semantics + one new masthead dropdown using the established select primitive. No army-document
  schema change. New corpus revision with full recertification.
- **Stop conditions:** Do not deploy or merge without explicit direction. Do not implement roster
  restriction (units allowed per AoR), import mapping, or reclassification of non-AoR ad-hoc
  sections (Big Waaagh!, Regiments-of-Renown sections, …) — deferred per #1834.
- **Tail ownership:** One PR targeting `master` with lint/tsc/tests/build and the checksum-bound
  campaign green.

## Product Contract

### Summary

The corpus flattens each Wahapedia faction-page Army of Renown section into an ad-hoc name-slugged
content-group card. Nothing models "use the faction rules on these pages instead of the
[faction] rules", so the builder offers AoR content alongside the regular content and reminders can
mix both battle-trait sets — illegal in play. This plan classifies the 12 official AoRs through the
review pipeline, gives the selection graph replace semantics via the existing (currently unused)
`excludes` relationship kind, and surfaces the choice as an Army of Renown dropdown under the
faction selector.

### Actors

- A1. A player fielding a regular faction army — sees no change.
- A2. A player fielding an Army of Renown — picks it directly under their faction and gets only the
  legal rules set.

### Requirements

**Reviewed classification (data)**

- R1. A reviewed `armiesOfRenown` input names the 12 official AoRs by their faction-group source
  record, citing the official document's page records (all 24 pages of `240af53b…` become reviewed
  official source records).
- R2. Generation gives each classified root `groupType: 'army-of-renown'` and fails closed when a
  reviewed entry stops matching exactly one faction ability-type group.

**Replace semantics (selection graph)**

- R3. Generation rewires classified AoRs: the faction offers only the AoR root; the root
  auto-includes its `Battle Traits` subgroup and offers its other subgroups; the faction's direct
  offers of AoR subgroups are removed.
- R4. Generation emits `excludes` edges from each AoR root to the faction's replaced regular
  groups — every faction content group whose `groupType` is one of `battle-trait`,
  `battle-formation`, `heroic-trait`, `artefact-of-power`, `spell-lore`, `prayer-lore`,
  `monstrous-traits`, `big-names` (seasonal variants included). Sibling AoR roots of the same
  faction are kept mutually exclusive by the single-select dropdown rather than by `excludes`
  edges, so the dropdown can keep listing the alternatives while one is active.
- R5. `resolveSelection` gains suppression semantics for `excludes`: when the source of an
  `excludes` edge is selected, the target and everything reachable only through it disappear from
  the selected and available sets (two-pass resolution). An *explicit* selection of an excluded
  target stays a diagnostic. Reminders follow the selection, fixing #1833.

**Top-level choice (UI)**

- R6. A masthead dropdown under the faction selector — label `Army of Renown`, options `None` plus
  the faction's classified AoR roots — rendered only when the faction has at least one. Selecting
  writes the root's canonical ID into `explicitSelectionIds`; switching removes the previous root
  and any explicit selections that are no longer available (the AoS 3 cleanup behavior).
- R7. No army-document schema change: persistence, cloud armies, and sharing carry the AoR as an
  ordinary explicit selection.

**Verification**

- R8. New corpus revision generated deterministically, full checksum-bound campaign, beta gate
  re-pointed and green; docs updated.
- R9. Regression coverage: the #1833 repro (regular and AoR battle traits never co-fire), replace
  semantics per AoR, sibling exclusivity, builder dropdown wiring, and unchanged behavior for a
  faction without an AoR.

### The 12 classified Armies of Renown

| Faction | Army of Renown | Official pages |
| --- | --- | --- |
| Daughters of Khaine | The Croneseer's Pariahs | 1-2 |
| Fyreslayers | Lofnir Drothkeepers | 3-4 |
| Kharadron Overlords | Grundstok Expeditionary Force | 5-6 |
| Sylvaneth | The Evergreen Hunt | 7-8 |
| Stormcast Eternals | Draconith Skywing | 9-10 |
| Slaves to Darkness | The Swords of Chaos | 11-12 |
| Slaves to Darkness | Tribes of the Snow Peaks | 13-14 |
| Soulblight Gravelords | Scions of Nulahmia | 15-16 |
| Gloomspite Gitz | Trugg's Troggherd | 17-18 |
| Ogor Mawtribes | The Roving Maw | 19-20 |
| Ironjawz | Krazogg's Grunta Stampede | 21-22 |
| Sons of Behemat | King Brodd's Stomp | 23-24 |

## Units of Work

- **U1 — Official evidence + reviewed classification.** Extend the `Armies of Renown`
  `officialDocuments` entry to all 24 page records (extracted checksums). Add
  `armiesOfRenown: Array<{ sourceRecordId, officialSourceRecordIds, reason }>` to the review
  schema and the 12 entries to a new review revision.
- **U2 — Generation.** In `buildAos4Corpus`: root `groupType` override; subgroup offer/include
  rewiring (Battle Traits auto-include, other subgroups offered by root, faction offers pruned);
  `excludes` edges per R4; validation per R2.
- **U3 — Selection.** Two-pass `resolveSelection` with `excludes` suppression per R5; diagnostics
  preserved for explicit conflicts.
- **U4 — View + UI.** Builder view model exposes the faction's AoR options; masthead
  `ArmyOfRenownSelect` under the faction select (established `Select` primitive, AoS 3 layout);
  switch cleanup.
- **U5 — Data revision.** Regenerate (no new artifacts — the official PDF is already accepted),
  campaign, `beta.json` re-point, verify.
- **U6 — Tests + docs.** Per R9; update pinned counts, `aos4-maintenance.md`,
  `aos4-accuracy-review.md`.

## Acceptance Criteria

- AC1. Selecting Ogor Mawtribes → The Roving Maw yields reminders containing Driven by Starvation
  and none of Trampling Charge / Feast on Flesh / Ravenous Brutes; deselecting restores the
  regular set exactly (#1833 closed by test).
- AC2. Each of the 12 AoRs is offered only through the dropdown of its own faction; sibling AoRs
  (Slaves to Darkness) are mutually exclusive.
- AC3. While an AoR is active, no regular battle-formation/trait/artefact/lore/monstrous/big-name
  card of that faction is offered; manifestation lores and general rules modules remain.
- AC4. A faction without an AoR renders no dropdown and resolves byte-identically to today.
- AC5. `yarn data:aos4:generate:candidate` deterministic; campaign 0 findings / 0 cannot-verify;
  `yarn data:aos4:verify:beta` green; full repo verification green.
