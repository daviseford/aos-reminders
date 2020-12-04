import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { TSelectMultiValueType, TSelectOneValueType } from 'components/input/select'
import { selectionActions } from 'ducks'
import { store } from 'store'
import { TSelectionTypes } from 'types/selections'
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

export interface IWithSelectMultipleWithSideEffectsPayload {
  [key: string]: {
    [key in TSelectionTypes]?: {
      values: string[]
    }
  }
}

type TWithSelectOneWithSideEffects = (payload: IWithSelectMultipleWithSideEffectsPayload) => void

type TWithSelectMultiWithSideEffects = (
  method: ActionCreatorWithPayload<string[], string>,
  payload: IWithSelectMultipleWithSideEffectsPayload,
  label: string,
  parentSlice: TSelectionTypes
) => (selectValues: TSelectMultiValueType) => void

/**
 * This dispatches for you, no need to do it yourself
 *
 * @param method
 * @param payload
 * @param label
 * @param parentSlice
 */
export const withSelectMultiWithSideEffects: TWithSelectMultiWithSideEffects = (
  method,
  payload,
  label,
  parentSlice
) => selectValues => {
  const { dispatch } = store
  const values = selectValues?.map(x => x.value) || []
  let sideEffectDropdownValues: string[] = []

  // Handle side effects
  Object.keys(payload).forEach(value => {
    if (values.includes(value)) {
      Object.keys(payload[value]).forEach(_slice => {
        const sideEffectVals: string[] = payload[value][_slice].values

        if (sideEffectVals) {
          if (_slice === parentSlice) {
            // e.g. if a battalion has another battalion as mandatory side effect
            // We will just use this when we update the dropdown later
            sideEffectDropdownValues = sideEffectDropdownValues.concat(sideEffectVals)
          } else {
            // Otherwise go ahead and update the dropdown for other types of values
            dispatch(
              selectionActions.addToSelections({
                value,
                values: sideEffectVals,
                slice: _slice as TSelectionTypes,
              })
            )
          }
          const trait = titleCase(_slice)

          // Log each value to GA
          sideEffectVals.forEach((val: string) => {
            logIndividualSelection(trait, val, label)
          })
        }
      })
    }
  })

  // And set the given value for the dropdown
  dispatch(method([...sideEffectDropdownValues, ...values]))
}

export const handleSelectOneSideEffects: TWithSelectOneWithSideEffects = payload => {
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
