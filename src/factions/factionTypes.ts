import { TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'

export interface IObjWithEffects extends Object {
  effects: TEffects[]
}
export type TParentEffectsObjWithEffects = Record<string, IObjWithEffects>

export type TItemKey = TSelectionTypes | 'allied_units'

export interface IItemDescription {
  available?: Partial<Record<TItemKey, TParentEffectsObjWithEffects[]>>
  mandatory?: Partial<Record<TItemKey, TParentEffectsObjWithEffects[]>>
  effects: TEffects[]
}

export type TItemDescriptions = Record<string, IItemDescription>
