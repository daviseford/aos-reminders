import React, { useCallback } from 'react'
import Select from 'react-select'
import { ActionMeta, ValueType } from 'react-select/src/types'
import { useTheme } from 'context/useTheme'
import { logIndividualSelection } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'

export type TDropdownOption = { value: string; label: string }
export type TSelectOneSetValueFn = (value: ValueType<TDropdownOption>, action: ActionMeta) => void
export type TSelectMultiSetValueFn = (value: ValueType<TDropdownOption>[], action: ActionMeta) => void

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
    items,
    setValue,
    hasDefault = false,
    isClearable = false,
    isDisabled = false,
    log = { enable: false },
    toTitle = false,
    value = null,
  } = props
  const { theme } = useTheme()
  const options = convertToOptions(items, toTitle)
  const controlledValue = value ? convertToOptions([value], false)[0] : value

  const onChange = useCallback(
    (...args) => {
      if (log.enable && log.trait && args[1].action === 'select-option' && args[0].value) {
        logIndividualSelection(log.trait, args[0].value)
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

type TLogOpts = {
  enable: boolean
  trait?: string
}

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
    items,
    log = { enable: false },
    setValues,
    isClearable = false,
    hasDefault = false,
    toTitle = false,
    values,
  } = props
  const { theme } = useTheme()
  const options = convertToOptions(items, toTitle)
  const selectValues = convertToOptions(values, toTitle)

  const handleChange = useCallback(
    (...args) => {
      if (log.enable && log.trait && args[1].action === 'select-option' && args[1].option.value) {
        logIndividualSelection(log.trait, args[1].option.value)
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
