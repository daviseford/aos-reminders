import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { SelectOne, TDropdownOption } from './select'
import { ValueType } from 'react-select/lib/types'
import { logPrintEvent, logAllyFaction } from 'utils/analytics'
import { factionNames } from 'ducks'

const btnClass = `col-xs-6 col-sm-4 col-lg-3 col-xl-3`
const selectClass = `col-xs-12 col-sm-8 col-lg-5 col-xl-4`

interface IToolbarProps {
  setAllyFactionName: IAddAllySelect['setAllyFactionName']
  factionName: TSupportedFaction
}

const ToolbarComponent = (props: IToolbarProps) => {
  const { setAllyFactionName, factionName } = props
  const [hasAlly, setHasAlly] = useState(false)
  const allyFactionPossibilities = useMemo(() => without(SUPPORTED_FACTIONS, factionName), [factionName])

  const handleAllyClick = e => {
    e.preventDefault()
    const newVal = !hasAlly
    setHasAlly(newVal)
    if (!newVal) {
      setAllyFactionName(null)
    }
  }

  return (
    <div className="container d-print-none">
      <div className="row justify-content-center pt-2" hidden={!hasAlly}>
        <div className={selectClass}>
          <AddAllySelect setAllyFactionName={setAllyFactionName} items={allyFactionPossibilities} />
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

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  factionName: factionNames.selectors.getFactionName(state),
})

const mapDispatchToProps = {
  setAllyFactionName: factionNames.actions.setAllyFactionName,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolbarComponent)

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
  setAllyFactionName: (value: string | null) => void
  items: TSupportedFaction[]
}

const AddAllySelect = (props: IAddAllySelect) => {
  const { setAllyFactionName, items } = props

  const handleSetAllyName = (selectValue: ValueType<TDropdownOption>) => {
    const { value } = selectValue as TDropdownOption
    logAllyFaction(value as TSupportedFaction)
    setAllyFactionName(value)
  }
  return (
    <>
      <SelectOne items={items} setValue={handleSetAllyName} hasDefault={true} toTitle={true} />
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
