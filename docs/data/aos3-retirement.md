# AoS 3 retirement policy

AoS 3 is an untrusted legacy implementation, not a compatibility target or a source for AoS 4.
The migration must not leave two rule models evolving beside one another.

## Immediate boundary

The old production application remains runnable only until the migration branch performs its
clean cutover. During that interval:

- freeze AoS 3 rule data and source-specific corrections
- never enter AoS 4 data into `src/factions/`, `src/generic_rules/`, old phase structures, or legacy
  importer alias tables
- never infer AoS 4 semantics from an AoS 3 name, category, timing, mandatory-selection side
  effect, or reminder hash
- keep imports directed from application seams into `src/aos4/`; `src/aos4/` must not import the
  legacy application graph

`src/tests/aos4/legacyIsolation.test.ts` enforces that dependency direction.

## Clean-cut gate

The representative Stormcast slice proves the replacement pipeline but is not permission to grow
a second permanent corpus. Before accepting and entering bulk AoS 4 cohorts:

1. Make the AoS 4 army document, catalog, selection graph, and reminder projection the only runtime
   rule path on the migration branch.
2. Reset incompatible persisted state instead of translating AoS 3 selections or reminder hashes.
3. Remove the old static faction and generic-rule corpus.
4. Remove the old phase model, name-based selection side effects, mutable-wording reminder
   identity, temporary faction adapter, and rule-processing utilities after their last runtime
   imports disappear.
5. Remove legacy importer corrections and fixtures. A future AoS 4 importer must resolve against
   stable canonical IDs and current sources.
6. Prove with repository search, TypeScript, tests, and the production build that no dormant AoS 3
   rules path remains.

The migration branch may be temporarily useful for only the representative AoS 4 cohort while this
happens. That incomplete state is deliberate and is never merged to production.

## Deletion inventory

These locations are deletion targets, not migration inputs:

| Legacy area | Examples | Replacement |
| --- | --- | --- |
| Static rules | `src/factions/`, `src/generic_rules/` | Accepted AoS 4 catalog and runtime projection |
| Faction composition | `src/factions/factionTypes.ts`, `factionClass.ts`, `temporaryAdapter.ts` | Canonical entities and stable-ID relationships |
| Timing and reminders | `src/types/phases.ts`, `processGame.ts`, `processReminders.ts`, `reminderUtils.ts` | AoS 4 windows and stable reminder projection |
| Selection effects | `getSideEffects.ts`, `withSelect.ts`, name-keyed Redux selections | Stable-ID selection graph and AoS 4 army document |
| Import corrections | `src/utils/import/options.ts` and legacy format adapters | A separately planned AoS 4 canonical-ID importer |
| Legacy persistence | Redux Persist v4 state and old saved-army types | Clean-reset AoS 4 persistence schema |

Reusable UI, authentication, subscriptions, offline shell, notes, hiding/reordering, printing, and
save/share infrastructure may survive only when they no longer encode AoS 3 rule assumptions.

## Retention exceptions

Any legacy file retained after the clean cutover needs a written entry in this document containing:

- the exact file or module
- the non-rules capability it still provides
- the owner of its replacement
- the concrete deletion condition

There are currently no approved post-cutover exceptions.
