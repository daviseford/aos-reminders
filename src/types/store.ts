import { IArmy, TAllyArmies } from './army'
import { TSupportedFaction } from 'meta/factions'
import { ISelections, IAllySelections } from './selections'
import { ISavedArmyFromApi } from './savedArmy'

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
  savedArmies: TSavedArmiesStore
  selections: ISelectionStore
  visibility: IVisibilityStore
}
