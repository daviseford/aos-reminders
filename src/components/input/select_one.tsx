import React from 'react'
import Select from 'react-select'

import { titleCase } from 'utils/titleCase'
import { ActionMeta, ValueType } from 'react-select/lib/types'

export type TDropdownOption = { value: string; label: string }
export type TSelectSetValueFn = (value: ValueType<TDropdownOption>, action: ActionMeta) => void
interface ISelectOneProps {
  setValue: TSelectSetValueFn
  value: string
  items: string[]
}

export const SelectOne = (props: ISelectOneProps) => {
  const { items, setValue } = props
  const options = convertToOptions(items)
  return (
    <div className="row w-50 mx-auto pb-3 d-block text-dark">
      <Select options={options} onChange={setValue} defaultValue={options[0]} isSearchable={true} isClearable={false} />
    </div>
  )
}

const convertToOptions = (items: string[]): TDropdownOption[] => {
  return items.map(i => ({ value: i, label: titleCase(i) }))
}
