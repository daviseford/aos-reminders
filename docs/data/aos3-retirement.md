# AoS 3 retirement record

AoS 3 is an untrusted historical implementation, not a compatibility target or a source for AoS 4.
The migration branch completed its clean runtime cutover on 2026-07-27.

## Result

- `src/main.tsx` mounts only the theme provider and AoS 4 application.
- `src/components/routes/Home.tsx` reads the generated AoS 4 catalog through AoS 4 view models.
- Browser persistence accepts only the schema-versioned AoS 4 army document.
- Old browser keys are deleted without parsing or translation.
- The static faction/generic-rule corpus, Redux graph, phase model, selection side effects, reminder
  hashes, importers, old UI, and historical fixtures are absent.
- 1,116 tracked legacy files were removed in the retirement change.
- `src/tests/aos4/legacyIsolation.test.ts` enforces both dependency direction and physical absence.
- TypeScript, AoS 4 tests, and the production build are the clean-cut gate.

The representative Stormcast cohort is intentionally the only accepted runtime cohort immediately
after cutover. Full-corpus candidate artifacts remain review input, not live data.

## Persistence reset

The only browser document key is:

`aos-reminders:aos4:army:v1`

On load, the runtime removes:

- `persist:root`
- `loadedArmy`
- `reminderOrder`
- `savedArmies`

It does not deserialize, map, or infer anything from those values. An invalid current document also
resets to a clean AoS 4 representative document.

## Deleted architecture

| Retired area | Deleted examples | AoS 4 replacement |
| --- | --- | --- |
| Static rules | `src/factions/`, `src/generic_rules/` | Accepted generated catalog |
| Composition | faction classes, metatags, temporary adapter, registries | Canonical entities and relationships |
| Timing | `types/phases.ts`, `game_structure.ts`, `processGame.ts` | Canonical windows and timings |
| Selection | name-keyed Redux slices, `getSideEffects.ts`, `withSelect.ts` | Stable-ID relationship resolver |
| Reminders | `processReminders.ts`, wording hashes, old reminder UI | Stable occurrences and AoS 4 view model |
| Persistence | Redux Persist v4 and old saved-army types | AoS 4 army-document schema |
| Import | Azyr, Battlescribe, Warscroll Builder, old app parsers and correction maps | Future canonical-ID import flow |
| Fixtures | historical PDF/JSON/HTML/text import corpus | Small source-contract AoS 4 fixtures |
| Product UI | old builder, profile, saved-army, import, PDF, and subscription routes | Minimal AoS 4 migration workbench |

Git history is the archive. No copied reference implementation remains in the working tree.

## Reintroduction policy

There are no approved post-cutover legacy exceptions.

Do not restore a deleted file to accelerate new work. If a non-rules capability is needed again:

1. define its AoS 4 contract
2. implement it against canonical IDs and the AoS 4 army document
3. add current-source and behavior tests
4. avoid copying old aliases, corrections, phase assumptions, or storage shapes

Any proposed exception requires an exact file/module, a non-rules justification, an owner, and a
concrete deletion condition before it enters the repository.
