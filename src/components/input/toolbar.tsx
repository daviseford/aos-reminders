import React, { useState } from 'react'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { SelectOne, TDropdownOption } from './select'
import { ValueType } from 'react-select/lib/types'
import { logPrintEvent } from 'utils/analytics'

interface IToolbarProps {
  setAllyValue: IAddAllySelect['setAllyValue']
  factionName: TSupportedFaction
}

const Toolbar = (props: IToolbarProps) => {
  const { setAllyValue } = props
  const [hasAlly, setHasAlly] = useState(false)

  const handleAllyClick = e => {
    e.preventDefault()
    const newVal = !hasAlly
    setHasAlly(newVal)
    if (!newVal) setAllyValue({ value: '' } as TDropdownOption)
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <PrintButton factionName={props.factionName} />
        </div>
        <div className="col">
          <AddAllyButton setAllyClick={handleAllyClick} hasAlly={hasAlly} />
        </div>
      </div>
      <div className="row" hidden={!hasAlly}>
        <div className="col">
          <AddAllySelect setAllyValue={setAllyValue} />
        </div>
      </div>
    </>
  )
}

export default Toolbar

interface IAddAllyButton {
  setAllyClick: (e: any) => void
  hasAlly: boolean
}

const AddAllyButton = (props: IAddAllyButton) => {
  const { hasAlly, setAllyClick } = props
  return (
    <>
      <div className="col">
        <button
          className={`btn btn-block ${hasAlly ? `btn-outline-danger` : `btn-outline-dark`}`}
          onClick={setAllyClick}
        >
          {hasAlly ? 'Remove' : 'Add'} Ally
        </button>
      </div>
    </>
  )
}

interface IAddAllySelect {
  setAllyValue: (selectValue: ValueType<TDropdownOption>) => void
}

const AddAllySelect = (props: IAddAllySelect) => {
  const { setAllyValue } = props
  return (
    <>
      <SelectOne items={SUPPORTED_FACTIONS} setValue={setAllyValue} hasDefault={true} toTitle={true} />
    </>
  )
}
const PrintButton = (props: { factionName: TSupportedFaction }) => {
  const handlePrint = e => {
    e.preventDefault()
    logPrintEvent(props.factionName)
    return window.print()
  }
  return (
    <>
      <div className="col">
        <button className="btn btn-outline-dark btn-block" onClick={handlePrint}>
          Print Page
        </button>
      </div>
    </>
  )
}
