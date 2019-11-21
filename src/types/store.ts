import { IArmy, TAllyArmies } from 'types/army'
import { TSupportedFaction } from 'meta/factions'
import { ISelections, IAllySelections } from 'types/selections'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { TSideEffectTypes } from 'utils/withSelect'

export interface IArmyStore {
  army: IArmy
  allyArmies: TAllyArmies
}

export interface IFactionNameStore {
  factionName: TSupportedFaction
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
  realmscape: IRealmscapeStore
  selections: ISelectionStore
  visibility: IVisibilityStore
}
