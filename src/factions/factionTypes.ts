import { TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'

export type TItemKey = TSelectionTypes | 'allied_units'

export interface IItemDescription {
  available?: Partial<Record<TItemKey, Record<string, { effects: TEffects[] }>[]>>
  mandatory?: Partial<Record<TItemKey, Record<string, { effects: TEffects[] }>[]>>
  effects: TEffects[]
}

export type TItemDescriptions = Record<string, IItemDescription>
