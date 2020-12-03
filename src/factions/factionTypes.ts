import { TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'

export type TObjWithEffects = object & { effects: TEffects[] }
export type TParentEffectsObjWithEffects = Record<string, TObjWithEffects>

export type TItemDescription = {
  available?: Partial<Record<TSelectionTypes, TParentEffectsObjWithEffects[]>>
  mandatory?: Partial<Record<TSelectionTypes, TParentEffectsObjWithEffects[]>>
} & {
  effects: TEffects[]
}

export type TItemDescriptions = Record<string, TItemDescription>
