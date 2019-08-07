import React from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import is from 'is_js'
import { getArmy } from 'utils/getArmy'
import { logPrintEvent } from 'utils/analytics'
import { factionNames, selections, army } from 'ducks'
import ReactTooltip from 'react-tooltip'
import { FaPlus } from 'react-icons/fa'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy } from 'types/army'
import { MdWarning } from 'react-icons/md'
import { IconContext } from 'react-icons'

const btnWrapperClass = `col-6 col-sm-4 col-md-4 col-lg-3 col-xl-3`
const btnClass = `btn btn-outline-dark btn-block`

interface IToolbarProps {
  allyFactionNames: TSupportedFaction[]
  factionName: TSupportedFaction
  resetAllySelection: (factionName: TSupportedFaction) => void
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
}

const ToolbarComponent = (props: IToolbarProps) => {
  const { factionName, allyFactionNames, resetAllySelection, updateAllyArmy } = props

  const handleAllyClick = e => {
    e.preventDefault()
    const newAllyFaction = without(SUPPORTED_FACTIONS, factionName, ...allyFactionNames)[0]
    resetAllySelection(newAllyFaction)
    updateAllyArmy({ factionName: newAllyFaction, Army: getArmy(newAllyFaction) as IArmy })
  }

  const handlePrint = e => {
    e.preventDefault()
    logPrintEvent(factionName)
    return window.print()
  }

  const PrintComponent = is.firefox() ? FirefoxPrintButton : PrintButton

  return (
    <div className="container d-print-none">
      <div className="row justify-content-center pt-3">
        <div className={btnWrapperClass}>
          <AddAllyButton setAllyClick={handleAllyClick} />
        </div>
        <div className={btnWrapperClass}>
          <PrintComponent handlePrint={handlePrint} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  factionName: factionNames.selectors.getFactionName(state),
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
})

const mapDispatchToProps = {
  resetAllySelection: selections.actions.resetAllySelection,
  updateAllyArmy: army.actions.updateAllyArmy,
  updateAllyUnits: selections.actions.updateAllyUnits,
}

export const Toolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolbarComponent)

interface IAddAllyButton {
  setAllyClick: (e: any) => void
}

const AddAllyButton = (props: IAddAllyButton) => {
  const { setAllyClick } = props
  return (
    <>
      <button className={`btn btn-block btn-outline-dark`} onClick={setAllyClick}>
        <FaPlus /> Add Ally
      </button>
    </>
  )
}

const PrintButton = (props: { handlePrint: (e: any) => void }) => {
  return (
    <button className={btnClass} onClick={props.handlePrint}>
      Print Page
    </button>
  )
}

const FirefoxPrintButton = (props: { handlePrint: (e: any) => void }) => {
  const tipProps = {
    'data-for': 'firefoxPrintWarning',
    'data-multiline': true,
    'data-tip': `Warning: Firefox is known to not correctly print this app.<br />Switch to Chrome, Edge, or Safari.`,
    'data-type': 'error',
  }
  return (
    <>
      <IconContext.Provider value={{ className: 'text-warning', size: '1.5em' }}>
        <button className={btnClass} onClick={props.handlePrint} {...tipProps}>
          <MdWarning /> Print Page
        </button>
      </IconContext.Provider>
      <ReactTooltip id={`firefoxPrintWarning`} />
    </>
  )
}
