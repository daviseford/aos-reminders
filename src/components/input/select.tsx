import React, { useCallback } from 'react'
import Select from 'react-select'
import { ActionMeta, ValueType } from 'react-select/src/types'
import { useTheme } from 'context/useTheme'
import { logIndividualSelection } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'

export type TDropdownOption = { value: string; label: string }
export type TSelectOneSetValueFn = (value: ValueType<TDropdownOption>, action: ActionMeta<any>) => void
export type TSelectMultiSetValueFn = (value: ValueType<TDropdownOption>[], action: ActionMeta<any>) => void

interface ISelectOneProps {
  hasDefault?: boolean
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

  const onChange = useCallback(
    (...args) => {
      if (log && args[1].action === 'select-option' && args[0].value) {
        logIndividualSelection(log.title, args[0].value, log.label)
      }
      setValue(args[0], args[1])
    },
    [log, setValue]
  )

  const selectProps: { [key: string]: any } = {
    defaultValue: hasDefault ? options[0] : null,
    isClearable,
    isDisabled,
    isSearchable: true,
    onChange,
    options,
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

const convertToOptions = (items: string[] = [], toTitle: boolean = true): TDropdownOption[] => {
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

  const handleChange = useCallback(
    (...args) => {
      if (log && args[1].action === 'select-option' && args[1].option.value) {
        logIndividualSelection(log.title, args[1].option.value, log.label)
      }
      setValues(args[0], args[1])
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
        onChange={handleChange as TSelectOneSetValueFn}
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
