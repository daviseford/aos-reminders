---
title: Classify the Battletome and Legends Armies of Renown - Plan
type: feat
date: 2026-08-01
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
issue: 1844
---

# Classify the Battletome and Legends Armies of Renown - Plan

## Goal Capsule

- **Objective:** Give every battletome and Legends Army of Renown the reviewed `armiesOfRenown`
  classification so it becomes a top-level army choice with replace semantics (the #1834/#1835
  pattern), retiring the interim builder triage from PR #1846 and closing #1844.
- **Authority order:** Official GW naming evidence where free accepted documents carry it
  (Battle Profiles July 2026, Rules Updates July 2026); the accepted Wahapedia faction pages'
  own machine-readable classification (`div.h2_ArmyOfRenown` marker / `#Armies-of-Renown` intro
  link with replace-rules wording) as reviewed secondary evidence with provisional marking where
  official naming does not exist — an extension of the standing three-tier source policy
  (owner ruling 2026-08-01, #1812); repository constraints (AGENTS.md); issue #1844.
- **Execution profile:** Decoder captures the source marker (outside the hashed record value, so
  record identity is unchanged); generation validates reviewed entries against the marker in both
  directions (fail closed); new review revision `corpus-2026-08-01f` on the unchanged
  `accepted-2026-08-01d` manifest; full recertification.
- **Stop conditions:** Do not merge or deploy without explicit direction. Do not implement
  per-AoR roster/unit restriction or import mapping (deferred per #1834). Do not reclassify
  Regiments of Renown or Spearhead wrappers — only faction-page groups the source marks as
  Armies of Renown.
- **Tail ownership:** One PR targeting `master`, based on PR #1846's branch
  (`worktree-manifestation-category`), with lint/tsc/tests/build and the checksum-bound campaign
  green.

## Why this is now unblocked (vs. the issue's assessment)

1. **The artifact cache exists here.** `.cache/aos4/artifacts` holds all 244 accepted artifacts;
   `yarn data:aos4:generate:candidate` verified the accepted 08-01e snapshot byte-for-byte in
   ~110s on this machine.
2. **Official evidence is better than the issue recorded.** A full-text sweep of all 157 cached
   official PDFs found free official Army of Renown naming for ~12 packages (see table), including
   explicit `ARMY OF RENOWN, <NAME>` errata headers in the accepted Rules Updates compendium.
3. **The secondary source is machine-readably explicit.** Every current battletome AoR section on
   the accepted faction pages carries `<div class="h2_ArmyOfRenown">Army of Renown</div>`
   immediately before its heading (the 12 already-classified seasonal AoRs carry it too); the six
   Legends/White Dwarf AoRs carry the intro sentence "you can choose for it to be a[n] X
   [Army of Renown](#Armies-of-Renown). If you do so, use the faction rules on these pages
   instead …". Classification can therefore be validated against the source instead of trusting
   review entries blindly.

## Requirements

**Decoder (secondary classification capture)**

- R1. `parseWahapediaFactionHtml` marks a decoded faction-group record `armyOfRenown: true` when
  its heading is immediately preceded by `div.h2_ArmyOfRenown`, or its section intro links to the
  core-rules `#Armies-of-Renown` anchor. The flag lives OUTSIDE the checksummed record value —
  record identity and checksums are unchanged. The flag threads through the HTML merge into
  `dataset.factionAbilityTypes`.

**Review schema and validation (generation)**

- R2. `CorpusArmyOfRenown` gains `evidenceTier?: 'official' | 'secondary-provisional'`
  (default `'official'`). `official` entries keep the existing rule (non-empty
  `officialSourceRecordIds`). `secondary-provisional` entries may cite corroborating official
  records but are not required to; they must state the policy basis in `reason`.
- R3. Fail-closed cross-checks, both directions:
  - every reviewed entry (either tier) must target a decoded faction-group the source marks as
    an Army of Renown — a typo'd or stale entry is an `invalid-review` error;
  - every source-marked faction-group without a reviewed entry is an error diagnostic — a new
    battletome AoR appearing on Wahapedia fails generation until reviewed, making the #1844 bug
    class impossible to reintroduce silently.
- R4. Existing rewiring applies unchanged per classified root: `groupType: 'army-of-renown'`,
  faction offers the root, root auto-includes subgroups, `excludes` edges to the faction's
  replaceable groups (union-of-contexts), two-pass suppression in selection.

**Review data (new revision `corpus-2026-08-01f`, manifest unchanged)**

- R5. Add reviewed `armiesOfRenown` entries for every unclassified source-marked root
  (~47 records across 21 factions: ~41 current battletome + 6 Legends/White Dwarf, including
  Big Waaagh! on both the Ironjawz and Kruleboyz pages and The Duardin Ascendant on both the
  Kharadron Overlords and Cities of Sigmar pages). Official naming evidence cited where free
  accepted documents carry it:

  | Army | Official evidence |
  | --- | --- |
  | The Iron March | Battle Profiles p3 ("…can only be taken in an Iron March Army of Renown") |
  | Allies of the Free Cities | Battle Profiles p3-4 |
  | Legion of the First Prince | Battle Profiles p38 + Rules Updates p4, p69 |
  | Big Waaagh! (both roots) | Rules Updates p12 ("the Big Waaagh! Army of Renown") |
  | Pyrofane Cult | Rules Updates p37 ("the Pyrofane Cult Army of Renown in White Dwarf issue 514") |
  | Droggz's Gitmob | Rules Updates p48 (`ARMY OF RENOWN, DROGGZ'S GITMOB` header) |
  | Pioneer Outpost | Rules Updates p56 (`ARMY OF RENOWN, PIONEER OUTPOST` header) |
  | The Magnate's Crew | Rules Updates p56 (`ARMY OF RENOWN, THE MAGNATE'S CREW` header) |
  | Taar's Grand Forgehost | Rules Updates p6, p53 ("a Taar's Grand Forgehost army") |
  | Soulpod Guardians | Rules Updates p73-74 ("the Soulpod Guardians Army of Renown") |
  | Gorechosen Champions | Rules Updates p39 (errata within the army's section) |
  | The Baleful Lords | Rules Updates p39 (errata within the army's section) |

  All remaining packages are `secondary-provisional`. The Lords of the Clan entry preserves the
  official discrepancy: Battle Profiles p24 lists it under TYPE `Battle Formation`
  (Battletome: Sylvaneth, 0 points) while the accepted secondary transcription is an explicit
  replace-rules Army of Renown; the classification follows the transcription and records the
  official row.
- R6. Extend the Rules Updates `officialDocuments` entry's `sourceRecords` with the newly cited
  pages (4, 6, 12, 48, 53, 56, 69, 73, 74; checksums from the deterministic extraction).
  Battle Profiles pages 3-73 are already accepted records.
- R7. Legends/White Dwarf AoRs (Astral Templars, Petrifex Elite, Ironsunz, The Duardin
  Ascendant ×2, Pyrofane Cult) decode in the `legends` context; their roots ride the existing
  overlay machinery, and the `excludes` union-of-contexts rule already keeps their replacement
  applicable across contexts.

**UI**

- R8. The masthead Army of Renown dropdown includes overlay roots grouped under the established
  `Legends` group header (the #1815 pattern already used by the builder card dropdowns);
  currently `Home.tsx` filters overlay AoRs out entirely. Selecting one drives the derived
  overlay flags exactly like any other Legends selection. No other visual change.
- R9. Remove the interim `UNCLASSIFIED_ARMY_PACKAGE_GROUP_TYPES` triage set from
  `src/aos4/view/builder.ts` (every entry is dead once the roots are typed `army-of-renown`)
  and replace `armyPackageTriage.test.ts` with regression coverage that no builder card ever
  renders a group whose type is a package slug.

**Verification**

- R10. `yarn data:aos4:generate:write` + `generate:candidate` deterministic; campaign
  (`review:prepare`, `certify:full`) green; `beta.json` re-pointed; `verify:beta` green;
  lint/tsc/build/full tests green; docs updated (`aos4-maintenance.md` revision lineage,
  AGENTS.md snapshot references, solutions-doc addendum).
- R11. Regression coverage: classification count pinned; a battletome AoR (e.g. The Eternal
  Nightmare) replaces its faction's regular groups and never co-fires battle traits; a Legends
  AoR appears only under the Legends group header and resolves in the overlay; a faction with
  no AoR renders no dropdown; the marker cross-check diagnostics fire on a fabricated
  unclassified marker fixture.

## Acceptance Criteria

- AC1. No builder card is offered for any of the 44 package group types; each package is instead
  its faction's Army of Renown dropdown entry with replace semantics.
- AC2. Selecting The Eternal Nightmare (Nighthaunt) suppresses the faction's regular
  battle-trait/formation/enhancement/lore cards and auto-applies the army's battle traits;
  deselecting restores the regular set exactly.
- AC3. Astral Templars is offered to Stormcast under `Legends` in the dropdown; picking it derives
  the Legends overlay flag and suppresses current-context regular groups.
- AC4. A source-marked group without a reviewed entry fails generation with a specific diagnostic.
- AC5. Full pipeline green per R10.
