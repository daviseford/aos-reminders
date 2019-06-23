import React from 'react'
import Select from 'react-select'

import { titleCase } from 'utils/titleCase'
import { ActionMeta, ValueType } from 'react-select/lib/types'

export type TDropdownOption = { value: string; label: string }
export type TSelectOneSetValueFn = (value: ValueType<TDropdownOption>, action: ActionMeta) => void
export type TSelectMultiSetValueFn = (value: ValueType<TDropdownOption>[], action: ActionMeta) => void

interface ISelectOneProps {
  hasDefault?: boolean
  isClearable?: boolean
  items: string[]
  setValue: TSelectOneSetValueFn
  toTitle?: boolean
}

export const SelectOne = (props: ISelectOneProps) => {
  const { items, setValue, isClearable = false, hasDefault = false, toTitle = false } = props
  const options = convertToOptions(items, toTitle)
  return (
    <>
      <Select
        defaultValue={hasDefault ? options[0] : null}
        isClearable={isClearable}
        isSearchable={true}
        onChange={setValue}
        options={options}
      />
    </>
  )
}

const convertToOptions = (items: string[] = [], toTitle: boolean = true): TDropdownOption[] => {
  return items.map(i => ({ value: i, label: toTitle ? titleCase(i) : i }))
}

interface ISelectMultiProps {
  hasDefault?: boolean
  isClearable?: boolean
  items: string[]
  setValues: TSelectMultiSetValueFn
  toTitle?: boolean
  values: string[]
}

export const SelectMulti = (props: ISelectMultiProps) => {
  const { items, setValues, isClearable = false, hasDefault = false, toTitle = false, values } = props
  const options = convertToOptions(items, toTitle)
  const selectValues = convertToOptions(values, toTitle)
  return (
    <>
      <Select
        value={selectValues}
        defaultValue={hasDefault ? options[0] : null}
        isClearable={isClearable}
        isMulti={true}
        isSearchable={true}
        onChange={setValues as TSelectOneSetValueFn}
        options={options}
      />
    </>
  )
}
