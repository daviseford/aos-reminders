import React, { Fragment } from 'react'

import { titleCase } from 'utils/titleCase'

interface ISelectOneProps {
  setValue: (value: string) => any
  value: string
  items: string[]
  titleFormat?: boolean
}

export const SelectOne = (props: ISelectOneProps) => {
  return (
    <div className="row w-50 mx-auto pb-3 d-block">
      <Select {...props} />
    </div>
  )
}

const Select = (props: ISelectOneProps) => {
  const { titleFormat = true, value, setValue, items } = props
  return (
    <Fragment>
      <select value={value} className="custom-select" onChange={e => setValue(e.target.value)}>
        <option value={value} key={`faction-${value}`}>
          {titleFormat ? titleCase(value) : value}
        </option>
        {items.map((name, i) => {
          if (value === name) return null // Prevent showing duplicates
          return (
            <option value={name} key={`value-${i}`}>
              {titleFormat ? titleCase(name) : name}
            </option>
          )
        })}
      </select>
    </Fragment>
  )
}
