import { ValueType } from 'react-select/src/types'
import { TDropdownOption } from 'components/input/select'

type TWithSelectOne = (
  method: (value: string | null) => void
) => (selectValue: ValueType<TDropdownOption> | null) => void

export const withSelectOne: TWithSelectOne = method => selectValue => {
  if (!selectValue) return method(null)
  const { value } = selectValue as TDropdownOption
  method(value)
}

type TWithSelectOneWithPayload = (
  method: (payload: any) => void,
  key: string,
  payload?: object
) => (selectValue: ValueType<TDropdownOption> | null) => void

export const withSelectOneWithPayload: TWithSelectOneWithPayload = (
  method,
  key,
  payload = {}
) => selectValue => {
  if (!selectValue) return method(null)
  const { value } = selectValue as TDropdownOption
  method({ ...payload, [key]: value })
}

type TWithSelectMultiple = (
  method: (values: string[]) => void
) => (selectValues: ValueType<TDropdownOption>[]) => void

export const withSelectMultiple: TWithSelectMultiple = method => selectValues => {
  const values = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []
  method(values)
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

export interface IWithSelectMultipleWithFunctionArrayPayload {
  [key: string]: {
    [key: string]: {
      values: string[]
      updateFn: (payload: { values: string[]; type: string }) => void
    }
  }
}

type TWithSelectMultiWithUpdateFunction = (
  method: (payload: any) => void,
  payload: IWithSelectMultipleWithFunctionArrayPayload
) => (selectValues: ValueType<TDropdownOption>[]) => void

export const withSelectMultiWithUpdateFunction: TWithSelectMultiWithUpdateFunction = (
  method,
  payload
) => selectValues => {
  const values = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []

  Object.keys(payload).forEach(value => {
    if (values.includes(value)) {
      Object.keys(payload[value]).forEach(type => {
        const otherVals = payload[value][type].values
        const updateFn = payload[value][type].updateFn

        if (otherVals) {
          updateFn({ values: otherVals, type })
        }
      })
    }
  })

  method(values)
}
