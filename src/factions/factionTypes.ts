import { TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'

export interface TObjWithEffects extends Object {
  effects: TEffects[]
}
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

export type TItemKey = TSelectionTypes | 'allied_units'

export interface TItemDescription {
  available?: Partial<Record<TItemKey, TParentEffectsObjWithEffects[]>>
  mandatory?: Partial<Record<TItemKey, TParentEffectsObjWithEffects[]>>
  effects: TEffects[]
}

export type TItemDescriptions = Record<string, TItemDescription>
