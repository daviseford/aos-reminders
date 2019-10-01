import React from 'react'
import Select from 'react-select'

import { titleCase } from 'utils/textUtils'
import { ActionMeta, ValueType } from 'react-select/src/types'

export type TDropdownOption = { value: string; label: string }
export type TSelectOneSetValueFn = (value: ValueType<TDropdownOption>, action: ActionMeta) => void
export type TSelectMultiSetValueFn = (value: ValueType<TDropdownOption>[], action: ActionMeta) => void

interface ISelectOneProps {
  hasDefault?: boolean
  isClearable?: boolean
  items: string[]
  setValue: TSelectOneSetValueFn
  toTitle?: boolean
  value?: string | null
}

export const SelectOne = (props: ISelectOneProps) => {
  const { items, setValue, isClearable = false, hasDefault = false, toTitle = false, value = null } = props
  const options = convertToOptions(items, toTitle)
  const controlledValue = value ? convertToOptions([value], false)[0] : value

  const selectProps: { [key: string]: any } = {
    defaultValue: hasDefault ? options[0] : null,
    isClearable: isClearable,
    isSearchable: true,
    onChange: setValue,
    options: options,
  }

  if (controlledValue !== undefined) {
    selectProps.value = controlledValue
  }
  return (
    <>
      <Select {...selectProps} />
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
        closeMenuOnSelect={false}
        isClearable={isClearable}
        isMulti={true}
        isSearchable={true}
        onChange={setValues as TSelectOneSetValueFn}
        options={options}
      />
    </>
  )
}
