
Please document breaking changes here. This will make future migrations from v3 -> v4 easier.

## Codebase changes

- `/src/army/` -> `/src/factions`

## Army Properties

```diff
   Artifacts: TEntry[]
   Battalions: TEntry[]
+  BattleTraits: TEffects[] // Previously 'Abilities'
+  CommandAbilities: TEntry[] // Previously 'Commands'
+  CommandTraits: TEntry[] // Previously 'Traits'
   EndlessSpells: TEntry[]
+  Flavors: TEntry[] // Previously 'Allegiances'
+  FlavorType?: string // Previously 'AllegianceType'
   Game: TGameStructure
+  MountTraits: TEntry[] // New in v4: (previously part of 'Traits')
+  Prayers: TEntry[] // New in v4: (previously part of 'Spells')
   Scenery: TEntry[]
   Spells: TEntry[]
+  SubFaction: TEntry // New in v4: Metadata about this SubFaction
   Triumphs: TEntry[]
   Units: TEntry[]
```

## Army/Faction Names

- `SKAVEN` -> `SKAVENTIDE`

## Redux/state changes

```diff
state.factionName = {
  factionName,
+ subFactionName
}
```