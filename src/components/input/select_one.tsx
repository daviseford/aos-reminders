import React, { useState } from 'react'
import Select from 'react-select'

import { titleCase } from 'utils/titleCase'
import { ActionMeta, ValueType } from 'react-select/lib/types'

export type TDropdownOption = { value: string; label: string }
export type TSelectOneSetValueFn = (value: ValueType<TDropdownOption>, action: ActionMeta) => void
export type TSelectMultiSetValueFn = (value: ValueType<TDropdownOption>[], action: ActionMeta) => void

interface ISelectOneProps {
  isClearable?: boolean
  items: string[]
  setValue: TSelectOneSetValueFn
  hasDefault?: boolean
}

export const SelectOne = (props: ISelectOneProps) => {
  const { items, setValue, isClearable = false, hasDefault = false } = props
  const options = convertToOptions(items)
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

interface ISelectMultiProps {
  isClearable?: boolean
  items: string[]
  setValues: TSelectMultiSetValueFn
  hasDefault?: boolean
}
export const SelectMulti = (props: ISelectMultiProps) => {
  const { items, setValues, isClearable = false, hasDefault = false } = props
  const options = convertToOptions(items)
  return (
    <>
      <Select
        // value={}
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

const convertToOptions = (items: string[]): TDropdownOption[] => {
  return items.map(i => ({ value: i, label: titleCase(i) }))
}
