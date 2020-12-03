import { TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'

export type TObjWithEffects = object & { effects: TEffects[] }
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

// export type TSubFactionKeys = TSelectionTypes

// export type TSubFactionEntry = {
//   available?: TParentEffectsObjWithEffects[]
//   mandatory?: TParentEffectsObjWithEffects[]
// }

export type TSubFaction = {
  available?: Partial<Record<TSelectionTypes, TParentEffectsObjWithEffects[]>>
  mandatory?: Partial<Record<TSelectionTypes, TParentEffectsObjWithEffects[]>>
} & {
  effects: TEffects[]
}

export type TSubFactions = Record<string, TSubFaction>
