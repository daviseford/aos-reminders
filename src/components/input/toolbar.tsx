import React, { useState, useMemo } from 'react'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { SelectOne, TDropdownOption } from './select'
import { ValueType } from 'react-select/lib/types'
import { logPrintEvent } from 'utils/analytics'
import { without } from 'lodash'

const btnClass = `col-xs-6 col-sm-4 col-lg-3 col-xl-3`
const selectClass = `col-xs-12 col-sm-8 col-lg-5 col-xl-4`

interface IToolbarProps {
  setAllyValue: IAddAllySelect['setAllyValue']
  factionName: TSupportedFaction
}

const Toolbar = (props: IToolbarProps) => {
  const { setAllyValue, factionName } = props
  const [hasAlly, setHasAlly] = useState(false)
  const allyFactionPossibilities = useMemo(() => without(SUPPORTED_FACTIONS, factionName), [factionName])

  const handleAllyClick = e => {
    e.preventDefault()
    const newVal = !hasAlly
    setHasAlly(newVal)
    if (!newVal) {
      setAllyValue({ value: '' } as TDropdownOption)
    }
  }

  return (
    <div className="container d-print-none">
      <div className="row justify-content-center pt-2" hidden={!hasAlly}>
        <div className={selectClass}>
          <AddAllySelect setAllyValue={setAllyValue} items={allyFactionPossibilities} />
        </div>
      </div>

      <div className="row justify-content-center pt-3">
        <div className={btnClass}>
          <AddAllyButton setAllyClick={handleAllyClick} hasAlly={hasAlly} />
        </div>
        <div className={btnClass}>
          <PrintButton factionName={factionName} />
        </div>
      </div>
    </div>
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
      <button className={`btn btn-block btn-${hasAlly ? `danger` : `outline-dark`}`} onClick={setAllyClick}>
        {hasAlly ? `Remove` : `Add`} Ally
      </button>
    </>
  )
}

interface IAddAllySelect {
  setAllyValue: (selectValue: ValueType<TDropdownOption>) => void
  items: TSupportedFaction[]
}

const AddAllySelect = (props: IAddAllySelect) => {
  const { setAllyValue, items } = props
  return (
    <>
      <SelectOne items={items} setValue={setAllyValue} hasDefault={true} toTitle={true} />
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
      <button className="btn btn-outline-dark btn-block" onClick={handlePrint}>
        Print Page
      </button>
    </>
  )
}
