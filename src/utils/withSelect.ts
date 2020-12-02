import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { TSelectMultiValueType, TSelectOneValueType } from 'components/input/select'
import { store } from 'store'
import { TEntryProperties } from 'types/data'
import { logIndividualSelection } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'

type TWithSelectOne = (
  method: (value: string | null) => void
) => (selectValue: TSelectOneValueType | null) => void

export const withSelectOne: TWithSelectOne = method => selectValue => {
  return method(selectValue?.value || null)
}

type TWithSelectMultipleWithPayload = (
  method: ActionCreatorWithPayload<any, string>,
  key: string,
  payload?: Record<string, any>
) => (selectValues: TSelectMultiValueType) => void

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
  const values = selectValues?.map(x => x.value) || []
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
  label: string
) => (selectValues: TSelectMultiValueType) => void

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
  label
) => selectValues => {
  const { dispatch } = store
  const values = selectValues?.map(x => x.value) || []

  debugger

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
