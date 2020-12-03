import { TSupportedFaction } from 'meta/factions'
import { TGameStructure } from 'meta/game_structure'
import { TEffects, TEntry } from 'types/data'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { TSelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'

export interface IArmy {
  Artifacts: TEntry[]
  Battalions: TEntry[]
  BattleTraits: TEffects[] // Previously 'Abilities'
  CommandAbilities: TEntry[] // Previously 'Commands'
  CommandTraits: TEntry[] // Previously 'Traits'
  EndlessSpells: TEntry[]
  Flavors: TEntry[] // Previously 'Allegiances'
  FlavorType?: string // Previously 'AllegianceType'
  Game: TGameStructure
  Prayers: TEntry[]
  Scenery: TEntry[]
  Spells: TEntry[]
  Triumphs: TEntry[]
  Units: TEntry[]
}

export type TAllyArmies = Record<string, IArmy>
export type TInitialArmy = Partial<IArmy> & { AlliedUnits?: TEntry[] }
export type TCollection = Pick<
  IArmy,
  'Artifacts' | 'Battalions' | 'CommandTraits' | 'CommandAbilities' | 'Prayers' | 'Spells'
>

export interface ICurrentArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  factionName: TSupportedFaction
  subFactionName: string
  origin_realm: TOriginRealms | null
  realmscape_feature: string | null
  realmscape: TBattleRealms | null
  selections: TSelections
}
