import { useTheme } from 'context/useTheme'
import React, { useCallback } from 'react'
import Select from 'react-select'
import { ActionMeta, ValueType } from 'react-select/src/types'
import { logIndividualSelection } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'

export interface IDropdownOption {
  value: string
  label: string
}
type TSelectOneValueType = ValueType<IDropdownOption, false>
type TSelectMultiValueType = ValueType<IDropdownOption, true>

export type TSelectOneSetValueFn = (value: TSelectOneValueType, action: ActionMeta<IDropdownOption>) => void
export type TSelectMultiSetValueFn = (
  values: TSelectMultiValueType,
  action: ActionMeta<IDropdownOption>
) => void

export type TFilterOptionFn = (option: { label: string; value: string }, inputValue: string) => boolean

interface ISelectOneProps {
  hasDefault?: boolean
  filterOption?: TFilterOptionFn
  isClearable?: boolean
  isDisabled?: boolean
  items: string[]
  setValue: TSelectOneSetValueFn
  toTitle?: boolean
  value?: string | null
  log?: TLogOpts
}

export const SelectOne = (props: ISelectOneProps) => {
  const {
    hasDefault = false,
    filterOption = null,
    isClearable = false,
    isDisabled = false,
    items,
    log = null,
    setValue,
    toTitle = false,
    value = null,
  } = props
  const { theme } = useTheme()
  const options = convertToOptions(items, toTitle)
  const controlledValue = value ? convertToOptions([value], false)[0] : value

  const onChange: TSelectOneSetValueFn = useCallback(
    (value, action) => {
      if (log && action.action === 'select-option' && value?.value) {
        logIndividualSelection(log.title, value.value, log.label)
      }
      setValue(value, action)
    },
    [log, setValue]
  )

  const selectProps: Record<string, any> = {
    defaultValue: hasDefault ? options[0] : null,
    isClearable,
    isDisabled,
    isMulti: false,
    isSearchable: true,
    onChange,
    options,
  }

  if (filterOption !== null) {
    selectProps.filterOption = filterOption
  }

  if (controlledValue !== undefined) {
    selectProps.value = controlledValue
  }
  return (
    <>
      <Select
        {...selectProps}
        // Apply styling via theme context
        className={theme.text}
        theme={defaultTheme => ({
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            ...theme.selectTheme,
          },
        })}
      />
    </>
  )
}

export const convertToOptions = (items: string[] = [], toTitle: boolean = true): IDropdownOption[] => {
  return items.map(i => ({ value: i, label: toTitle ? titleCase(i) : i }))
}

type TLogOpts = { title: string; label: string } | null

interface ISelectMultiProps {
  hasDefault?: boolean
  isClearable?: boolean
  items: string[]
  setValues: TSelectMultiSetValueFn
  toTitle?: boolean
  values: string[]
  log?: TLogOpts
}

export const SelectMulti = (props: ISelectMultiProps) => {
  const {
    hasDefault = false,
    isClearable = false,
    items,
    log = null,
    setValues,
    toTitle = false,
    values,
  } = props
  const { theme } = useTheme()
  const options = convertToOptions(items, toTitle)
  const selectValues = convertToOptions(values, toTitle)

  const handleChange: TSelectMultiSetValueFn = useCallback(
    (value, action) => {
      if (log && action.action === 'select-option' && action?.option?.value) {
        logIndividualSelection(log.title, action.option.value, log.label)
      }
      setValues(value, action)
    },
    [log, setValues]
  )

  return (
    <>
      <Select
        value={selectValues}
        defaultValue={hasDefault ? options[0] : null}
        closeMenuOnSelect={false}
        isClearable={isClearable}
        isMulti={true}
        isSearchable={true}
        onChange={handleChange}
        options={options}
        // Apply styling via theme context
        className={theme.text}
        theme={defaultTheme => ({
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            ...theme.selectTheme,
          },
        })}
      />
    </>
  )
}
