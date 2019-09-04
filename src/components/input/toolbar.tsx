import React, { useState } from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import is from 'is_js'
import { getArmy } from 'utils/getArmy'
import { logPrintEvent } from 'utils/analytics'
import { factionNames, selections, army } from 'ducks'
import ReactTooltip from 'react-tooltip'
import { FaPlus, FaPrint } from 'react-icons/fa'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { MdWarning } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { TUnits, IArmy } from 'types/army'
import { IStore } from 'types/store'
import { SaveLoadArmies } from './savedArmies'
import { SaveArmyBtn } from './savedArmies/save_army_btn'
import { ShowSavedArmiesBtn } from './savedArmies/show_saved_armies_btn'
import { useSubscription } from 'context/useSubscription'

const btnWrapperClass = `col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 pb-2`
const btnClass = `btn btn-outline-dark btn-block`
const btnContentWrapper = `d-flex align-items-center justify-content-center`

interface IToolbarProps {
  allyFactionNames: TSupportedFaction[]
  factionName: TSupportedFaction
  resetAllySelection: (factionName: TSupportedFaction) => void
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
}

const ToolbarComponent = (props: IToolbarProps) => {
  const { factionName, allyFactionNames, resetAllySelection, updateAllyArmy } = props
  const { isSubscribed } = useSubscription()

  const [isShowingSavedArmies, setIsShowingSavedArmies] = useState(false)
  const showSavedArmies = () => setIsShowingSavedArmies(true)
  const hideSavedArmies = () => setIsShowingSavedArmies(false)

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

  const PrintComponent = is.firefox() ? PrintWarningButton : PrintButton

  const savedArmyBtnWrapperClass = `${
    isSubscribed ? `col-6` : `col-12`
  } col-sm-6 col-md-6 col-lg-3 col-xl-3 pb-2`

  return (
    <div className="container d-print-none">
      <div className="row justify-content-center pt-3">
        <div className={btnWrapperClass}>
          <AddAllyButton setAllyClick={handleAllyClick} />
        </div>
        <div className={btnWrapperClass}>
          <PrintComponent handlePrint={handlePrint} />
        </div>
        <div className={savedArmyBtnWrapperClass}>
          <SaveArmyBtn showSavedArmies={showSavedArmies} />
        </div>
        <div className={btnWrapperClass} hidden={!isSubscribed}>
          <ShowSavedArmiesBtn
            isShowingSavedArmies={isShowingSavedArmies}
            hideSavedArmies={hideSavedArmies}
            showSavedArmies={showSavedArmies}
          />
        </div>
      </div>

      <div hidden={!isShowingSavedArmies}>
        <SaveLoadArmies />
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
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
        <div className={btnContentWrapper}>
          <FaPlus className="mr-2" /> Add Ally
        </div>
      </button>
    </>
  )
}

const PrintButton = (props: { handlePrint: (e: any) => void }) => {
  return (
    <button className={btnClass} onClick={props.handlePrint}>
      <div className={btnContentWrapper}>
        <FaPrint className="mr-2" /> Print Page
      </div>
    </button>
  )
}

interface IBrowser {
  name: string
  is: boolean
  warning: string
}

const PrintWarningButton = (props: { handlePrint: (e: any) => void }) => {
  const browsers: IBrowser[] = [
    { name: 'Firefox', is: is.firefox(), warning: `not correctly print this page` },
  ]
  const { name, warning } = browsers.find(b => b.is) as IBrowser
  const tipProps = {
    'data-for': 'printWarningButton',
    'data-multiline': true,
    'data-tip': `Warning: ${name} is known to ${warning}.<br />Switch to Chrome or Safari.`,
    'data-type': 'error',
  }

  return (
    <>
      <IconContext.Provider value={{ className: 'text-warning', size: '1.5em' }}>
        <button className={btnClass} onClick={props.handlePrint} {...tipProps}>
          <div className={btnContentWrapper}>
            <MdWarning className="mr-2" /> Print Page
          </div>
        </button>
      </IconContext.Provider>
      <ReactTooltip id={`printWarningButton`} />
    </>
  )
}
