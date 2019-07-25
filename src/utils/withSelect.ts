import { ValueType } from 'react-select/lib/types'
import { TDropdownOption } from 'components/input/select'

type TWithSelectOne = (method: (value: string) => void) => (selectValue: ValueType<TDropdownOption>) => void

export const withSelectOne: TWithSelectOne = method => selectValue => {
  const { value } = selectValue as TDropdownOption
  method(value)
}

type TWithSelectMultiple = (method: (values: string[]) => void) => (selectValues: ValueType<TDropdownOption>[]) => void

export const withSelectMultiple: TWithSelectMultiple = method => selectValues => {
  const values = selectValues ? (selectValues as TDropdownOption[]).map(x => x.value) : []
  method(values)
}
