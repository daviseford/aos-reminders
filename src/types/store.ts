import { IArmy, TAllyArmies } from './army'
import { TSupportedFaction } from 'meta/factions'
import { ISelections, IAllySelections } from './selections'
import { TPhases, TTurnWhen } from './phases'

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

type TAllySelectionStore = { [key in TSupportedFaction]?: IAllySelections }

export interface ISelectionStore {
  selections: ISelections
  allySelections: TAllySelectionStore
}

export interface IVisibilityStore {
  cards: TTurnWhen[]
  reminders: string[]
  selectors: string[]
}

export interface IStore {
  army: IArmyStore
  factionName: IFactionNameStore
  realmscape: IRealmscapeStore
  selections: ISelectionStore
  visibility: IVisibilityStore
}
