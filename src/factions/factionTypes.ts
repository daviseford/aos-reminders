import { TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'

export type TObjWithEffects = object & { effects: TEffects[] }
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

export type TItemKey = TSelectionTypes | 'allied_units'

export type TItemDescription = {
  available?: Partial<Record<TItemKey, TParentEffectsObjWithEffects[]>>
  mandatory?: Partial<Record<TItemKey, TParentEffectsObjWithEffects[]>>
  effects: TEffects[]
}

export type TItemDescriptions = Record<string, TItemDescription>
