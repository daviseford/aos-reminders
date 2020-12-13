
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
- `LEGIONS_OF_GRIEF` -> `LEGION_OF_GRIEF`

- `BIG_WAAAGH | IRONJAWZ | BONESPLITTERZ` -> Now subfactions of `ORRUK_WARCLANS`
- `GRAND_HOST_OF_NAGASH | LEGION_OF_BLOOD | LEGION_OF_SACRAMENT | LEGION_OF_NIGHT | SOULBLIGHT` -> Now subfactions of `LEGIONS_OF_NAGASH`
- `TAMURKHANS_HORDE` -> Now a subfaction of `NURGLE`

## Redux/state changes

```diff
state.factionName = {
  factionName,
+ subFactionName
}
```