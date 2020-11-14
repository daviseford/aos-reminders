import { TSupportedFaction } from 'meta/factions'
import { IArmy, TAllyArmies } from 'types/army'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { IAllySelections, ISelections } from 'types/selections'
import { TSideEffectTypes } from 'utils/withSelect'
import { INote } from './notes'

export interface IArmyStore {
  army: IArmy
  allyArmies: TAllyArmies
}

export interface IFactionNameStore {
  factionName: TSupportedFaction
}

export interface INotesStore {
  notes: INote[]
}

export interface IRealmscapeStore {
  origin_realm: TOriginRealms | null
  realmscape: TBattleRealms | null
  realmscape_feature: string | null
}

export type TAllySelectionStore = { [key in TSupportedFaction]?: IAllySelections }

export interface ISelectionStore {
  selections: ISelections
  allySelections: TAllySelectionStore
  sideEffects: Record<
    string, // Hermdar Lodge
    Record<TSideEffectTypes, string[]> // artifacts // ['Tyrant Slayer']
  >
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
  notes: INotesStore
  realmscape: IRealmscapeStore
  selections: ISelectionStore
  visibility: IVisibilityStore
}
