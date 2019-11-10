import { IArmy, TAllyArmies } from './army'
import { TSupportedFaction } from 'meta/factions'
import { ISelections, IAllySelections } from './selections'
import { ISavedArmyFromApi } from './savedArmy'
import { TSideEffectTypes } from 'utils/withSelect'
import { TOrigins } from 'types/realmscapes'

export interface IArmyStore {
  army: IArmy
  allyArmies: TAllyArmies
}

export interface IFactionNameStore {
  factionName: TSupportedFaction
}

export interface IFactionOriginStore {
  factionOrigin: TOrigins
}

export interface IRealmscapeStore {
  realmscape: string | null
  realmscape_feature: string | null
}

export type TSavedArmiesStore = ISavedArmyFromApi[]

export type TAllySelectionStore = { [key in TSupportedFaction]?: IAllySelections }

export interface ISelectionStore {
  selections: ISelections
  allySelections: TAllySelectionStore
  sideEffects: {
    [key: string]: {
      // Hermdar Lodge
      [key in TSideEffectTypes]: string[] // artifacts // ['Tyrant Slayer']
    }
  }
}

export interface IVisibilityStore {
  allies: string[]
  when: string[]
  reminders: string[]
  selectors: string[]
}

export interface IStore {
  army: IArmyStore
  factionNames: IFactionNameStore
  factionOrigins: IFactionOriginStore
  realmscape: IRealmscapeStore
  selections: ISelectionStore
  visibility: IVisibilityStore
}
