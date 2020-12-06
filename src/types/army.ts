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
  Prayers: TEntry[] // New in v4: (previously part of 'Spells')
  Scenery: TEntry[]
  Spells: TEntry[]
  SubFaction: TEntry // New in v4: Metadata about this SubFaction
  Triumphs: TEntry[]
  Units: TEntry[]
}

export type TAllyArmies = Record<string, IArmy>
export type TInitialArmy = Partial<IArmy> & { AlliedUnits?: TEntry[] }
export type TCollection = Omit<IArmy, 'BattleTraits' | 'Game' | 'FlavorType' | 'SubFaction'>

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
