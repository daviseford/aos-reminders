import { TSupportedFaction } from 'meta/factions'
import { ISelections } from './selections'
import { TRealms } from './realmscapes'
import { TAllySelectionStore } from './store'

export interface ISavedArmy {
  armyName: string
  factionName: TSupportedFaction
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
}

export interface ISavedArmyFromApi {
  id: string
  userName: string
  armyName: string
  factionName: TSupportedFaction
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
  /**
   * Unix time (milliseconds)
   */
  createdAt: number
  /**
   * Unix time (milliseconds)
   */
  updatedAt: number
}
