import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { TDropdownOption } from 'components/input/select'
import { ValueType } from 'react-select/src/types'
import { store } from 'store'
import { TEntryProperties } from 'types/data'
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
  method: ActionCreatorWithPayload<any, string>,
  key: string,
  payload?: Record<string, any>
) => (selectValues: ValueType<TDropdownOption>[]) => void

/**
 * This dispatches for you, no need to do it yourself
 *
 * @param method
 * @param key
 * @param payload
 */
export const withSelectMultipleWithPayload: TWithSelectMultipleWithPayload = (
  method,
  key,
  payload = {}
) => selectValues => {
  const { dispatch } = store
  const values = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []
  dispatch(method({ ...payload, [key]: values }))
}

export type TSideEffectTypes = Extract<
  TEntryProperties,
  'spell' | 'artifact' | 'command_trait' | 'command_ability'
>

export interface IWithSelectMultipleWithSideEffectsPayload {
  [key: string]: {
    [key in TSideEffectTypes]?: {
      values: string[]
    }
  }
}

type TWithSelectMultiWithSideEffects = (
  method: ActionCreatorWithPayload<string[], string>,
  payload: IWithSelectMultipleWithSideEffectsPayload,
  updateFn: ActionCreatorWithPayload<
    {
      value: string
      values: string[]
      slice: TEntryProperties
    },
    string
  >,
  label: string,
  army: any
) => (selectValues: ValueType<TDropdownOption>[]) => void

/**
 * This dispatches for you, no need to do it yourself
 *
 * @param method
 * @param payload
 * @param updateFn
 * @param label
 */
export const withSelectMultiWithSideEffects: TWithSelectMultiWithSideEffects = (
  method,
  payload,
  updateFn,
  label,
  army
) => selectValues => {
  const { dispatch } = store
  const values = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []

  Object.keys(payload).forEach(value => {
    if (values.includes(value)) {
      Object.keys(payload[value]).forEach(slice => {
        const sideEffectVals = payload[value][slice].values

        if (sideEffectVals) {
          dispatch(updateFn({ value, values: sideEffectVals, slice: slice as TEntryProperties }))
          const trait = titleCase(slice)

          // Log each value to GA
          sideEffectVals.forEach((val: string) => {
            logIndividualSelection(trait, val, label)
          })
        }
      })
    }
  })

  dispatch(method(values))
}
