import { TDropdownOption } from 'components/input/select'
import { ValueType } from 'react-select/src/types'
import { store } from 'store'
import { logIndividualSelection } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'

type TWithSelectOne = (
  method: (value: string | null) => void
) => (selectValue: ValueType<TDropdownOption> | null) => void

export const withSelectOne: TWithSelectOne = method => selectValue => {
  if (!selectValue) return method(null)
  const { value } = selectValue as TDropdownOption
  method(value)
}

type TWithSelectMultipleWithPayload = (
  method: (payload: any) => void,
  key: string,
  payload?: object
) => (selectValues: ValueType<TDropdownOption>[]) => void

export const withSelectMultipleWithPayload: TWithSelectMultipleWithPayload = (
  method,
  key,
  payload = {}
) => selectValues => {
  const values = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []
  method({ ...payload, [key]: values })
}

export type TSideEffectTypes = 'spells' | 'artifacts' | 'traits' | 'commands'

export interface IWithSelectMultipleWithSideEffectsPayload {
  [key: string]: {
    [key in TSideEffectTypes]?: {
      values: string[]
    }
  }
}

type TWithSelectMultiWithSideEffects = (
  method: (payload: any) => void,
  payload: IWithSelectMultipleWithSideEffectsPayload,
  updateFn: (payload: { value: string; values: string[]; slice: string }) => void,
  label: string
) => (selectValues: ValueType<TDropdownOption>[]) => void

export const withSelectMultiWithSideEffects: TWithSelectMultiWithSideEffects = (
  method,
  payload,
  updateFn,
  label
) => selectValues => {
  const { dispatch } = store
  const values = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []

  Object.keys(payload).forEach(value => {
    if (values.includes(value)) {
      Object.keys(payload[value]).forEach(slice => {
        const sideEffectVals = payload[value][slice].values

        if (sideEffectVals) {
          dispatch(updateFn({ value, values: sideEffectVals, slice }))
          const trait = titleCase(slice)

          // Log each value to GA
          sideEffectVals.forEach((val: string) => {
            logIndividualSelection(trait, val, label)
          })
        }
      })
    }
  })

  method(values)
}
