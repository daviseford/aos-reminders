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
  isDisabled?: boolean
  items: string[]
  setValue: TSelectOneSetValueFn
  toTitle?: boolean
  value?: string | null
}

export const SelectOne = (props: ISelectOneProps) => {
  const {
    items,
    setValue,
    isClearable = false,
    isDisabled = false,
    hasDefault = false,
    toTitle = false,
    value = null,
  } = props
  const options = convertToOptions(items, toTitle)
  const controlledValue = value ? convertToOptions([value], false)[0] : value

  const selectProps: { [key: string]: any } = {
    defaultValue: hasDefault ? options[0] : null,
    isClearable,
    isDisabled,
    isSearchable: true,
    onChange: setValue,
    options,
  }

  if (controlledValue !== undefined) {
    selectProps.value = controlledValue
  }
  return (
    <>
      <Select
        {...selectProps}
        className="text-white"
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            ...darkColors,
          },
        })}
      />
    </>
  )
}

const darkColors = {
  /*
   * multiValue(remove)/color:hover
   */
  //  danger: 'var(--danger)',

  /*
   * multiValue(remove)/backgroundColor(focused)
   * multiValue(remove)/backgroundColor:hover
   */
  //  dangerLight: 'var(--danger-light)',

  /*
   * control/backgroundColor
   * menu/backgroundColor
   * option/color(selected)
   */
  neutral0: 'black',

  /*
   * control/backgroundColor(disabled)
   */
  //  neutral5: 'var(--neutral-5)',

  /*
   * control/borderColor(disabled)
   * multiValue/backgroundColor
   * indicators(separator)/backgroundColor(disabled)
   */
  neutral10: 'grey',

  /*
   * control/borderColor
   * option/color(disabled)
   * indicators/color
   * indicators(separator)/backgroundColor
   * indicators(loading)/color
   */
  neutral20: 'grey',

  /*
   * control/borderColor(focused)
   * control/borderColor:hover
   */
  neutral30: 'var(--neutral-30)',

  /*
   * menu(notice)/color
   * singleValue/color(disabled)
   * indicators/color:hover
   */
  neutral40: 'var(--neutral-40)',

  /*
   * placeholder/color
   */
  neutral50: 'white',

  /*
   * indicators/color(focused)
   * indicators(loading)/color(focused)
   */
  neutral60: 'var(--neutral-60)',

  neutral70: 'var(--neutral-70)',

  /*
   * input/color
   * multiValue(label)/color
   * singleValue/color
   * indicators/color(focused)
   * indicators/color:hover(focused)
   */
  neutral80: 'white',

  // neutral90: 'white',

  /*
   * control/boxShadow(focused)
   * control/borderColor(focused)
   * control/borderColor:hover(focused)
   * option/backgroundColor(selected)
   * option/backgroundColor:active(selected)
   */
  primary: 'white',

  /*
   * option/backgroundColor(focused)
   */
  primary25: 'grey',

  /*
   * option/backgroundColor:active
   */
  primary50: 'var(--primary-50)',

  primary75: 'var(--primary-75)',
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
        className="text-white"
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            ...darkColors,
          },
        })}
      />
    </>
  )
}

// const stockColors = {
//   /*
//    * multiValue(remove)/color:hover
//    */
//   danger: 'var(--danger)',

//   /*
//    * multiValue(remove)/backgroundColor(focused)
//    * multiValue(remove)/backgroundColor:hover
//    */
//   dangerLight: 'var(--danger-light)',

//   /*
//    * control/backgroundColor
//    * menu/backgroundColor
//    * option/color(selected)
//    */
//   neutral0: 'var(--neutral-0)',

//   /*
//    * control/backgroundColor(disabled)
//    */
//   neutral5: 'var(--neutral-5)',

//   /*
//    * control/borderColor(disabled)
//    * multiValue/backgroundColor
//    * indicators(separator)/backgroundColor(disabled)
//    */
//   neutral10: 'var(--neutral-10)',

//   /*
//    * control/borderColor
//    * option/color(disabled)
//    * indicators/color
//    * indicators(separator)/backgroundColor
//    * indicators(loading)/color
//    */
//   neutral20: 'var(--neutral-20)',

//   /*
//    * control/borderColor(focused)
//    * control/borderColor:hover
//    */
//   neutral30: 'var(--neutral-30)',

//   /*
//    * menu(notice)/color
//    * singleValue/color(disabled)
//    * indicators/color:hover
//    */
//   neutral40: 'var(--neutral-40)',

//   /*
//    * placeholder/color
//    */
//   neutral50: 'var(--neutral-50)',

//   /*
//    * indicators/color(focused)
//    * indicators(loading)/color(focused)
//    */
//   neutral60: 'var(--neutral-60)',

//   neutral70: 'var(--neutral-70)',

//   /*
//    * input/color
//    * multiValue(label)/color
//    * singleValue/color
//    * indicators/color(focused)
//    * indicators/color:hover(focused)
//    */
//   neutral80: 'var(--neutral-80)',

//   neutral90: 'var(--neutral-90)',

//   /*
//    * control/boxShadow(focused)
//    * control/borderColor(focused)
//    * control/borderColor:hover(focused)
//    * option/backgroundColor(selected)
//    * option/backgroundColor:active(selected)
//    */
//   primary: 'var(--primary)',

//   /*
//    * option/backgroundColor(focused)
//    */
//   primary25: 'var(--primary-25)',

//   /*
//    * option/backgroundColor:active
//    */
//   primary50: 'var(--primary-50)',

//   primary75: 'var(--primary-75)',
// }
