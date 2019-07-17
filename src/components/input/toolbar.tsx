import React, { useState, Fragment } from 'react'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { SelectOne, TDropdownOption } from './select'
import { ValueType } from 'react-select/lib/types'

interface IToolbarProps {
  setAllyValue: IAddAlly['setValue']
}

const Toolbar = (props: IToolbarProps) => {
  const { setAllyValue } = props
  return (
    <div className="row">
      <div className="col">
        <AddAlly setValue={setAllyValue} />
      </div>
    </div>
  )
}

export default Toolbar

interface IAddAlly {
  setValue: (selectValue: ValueType<TDropdownOption>) => void
}

const AddAlly = (props: IAddAlly) => {
  const { setValue } = props
  const [checked, setChecked] = useState(false)

  const handleCheckClick = e => {
    const newVal = !checked
    setChecked(newVal)
    if (!newVal) setValue({ value: '' } as TDropdownOption)
  }

  return (
    <Fragment>
      <div className="col">
        <input type="checkbox" aria-label="Checkbox for following text input" onClick={handleCheckClick} />
        {`  `}
        {!checked ? `Add ` : null}
        {`Ally `}
      </div>
      <div className="col-3" hidden={!checked}>
        <SelectOne items={SUPPORTED_FACTIONS} setValue={setValue} hasDefault={true} toTitle={true} />
      </div>
    </Fragment>
  )
}
