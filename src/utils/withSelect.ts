import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { TSelectMultiSetValueFn, TSelectOneSetValueFn } from 'components/input/select'
import { selectionActions } from 'ducks'
import { store } from 'store'
import { TSelectionTypes } from 'types/selections'
import { logIndividualSelection } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'

type TWithSelectOne = (method: (value: string | null) => void) => TSelectOneSetValueFn

export const withSelectOne: TWithSelectOne = method => selectValue => {
  return method(selectValue?.value || null)
}

type TWithSelectMultipleWithPayload = (
  method: ActionCreatorWithPayload<any, string>,
  key: string,
  payload?: Record<string, any>
) => TSelectMultiSetValueFn

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

export interface ISideEffectsPayload {
  [key: string]: {
    [key in TSelectionTypes]?: {
      values: string[]
    }
  }
}

type TWithSelectMultiWithSideEffects = (
  method: ActionCreatorWithPayload<string[], string>,
  payload: ISideEffectsPayload,
  label: string
) => TSelectMultiSetValueFn

/**
 * This dispatches for you, no need to do it yourself
 *
 * @param method
 * @param payload
 * @param label
 */
export const withSelectMultiWithSideEffects: TWithSelectMultiWithSideEffects = (method, payload, label) => (
  selectValues,
  { action }
) => {
  const { dispatch } = store
  const values = selectValues?.map(x => x.value) || []

  // Set the given value for the dropdown
  dispatch(method(values))

  // Don't add side effects if we're just removing values from the dropdown
  if (action === 'remove-value') return

  // Handle side effects
  Object.keys(payload).forEach(value => {
    if (values.includes(value)) {
      Object.keys(payload[value]).forEach(_slice => {
        const sideEffectVals: string[] = payload[value][_slice].values

        if (sideEffectVals) {
          dispatch(
            selectionActions.addToSelections({
              value,
              values: sideEffectVals,
              slice: _slice as TSelectionTypes,
            })
          )

          const trait = titleCase(_slice)

          // Log each value to GA
          sideEffectVals.forEach((val: string) => {
            logIndividualSelection(trait, val, label)
          })
        }
      })
    }
  })
}

export const handleSelectOneSideEffects = (payload: ISideEffectsPayload) => {
  const { dispatch } = store

  // Handle side effects
  Object.keys(payload).forEach(_key => {
    Object.keys(payload[_key]).forEach(_slice => {
      const sideEffectVals: string[] = payload[_key][_slice].values

      if (sideEffectVals) {
        dispatch(
          selectionActions.addToSelections({
            value: _key,
            values: sideEffectVals,
            slice: _slice as TSelectionTypes,
          })
        )
      }
    })
  })
}
