import React, { useState } from 'react'
import { connect } from 'react-redux'
import { factionNames, selections } from 'ducks'
import { SelectOne } from './select'
import { logPrintEvent } from 'utils/analytics'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { withSelectOne } from 'utils/withSelect'
import { without } from 'lodash'
import { AllyArmyBuilder } from './ally_army_builder'
import { TUnits } from 'types/army'

const btnClass = `col-6 col-sm-4 col-md-4 col-lg-3 col-xl-3`
const selectClass = `col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4`

interface IToolbarProps {
  addAllyFactionName: (factionName: TSupportedFaction) => void
  allyFactionNames: TSupportedFaction[]
  factionName: TSupportedFaction
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
}

const ToolbarComponent = (props: IToolbarProps) => {
  const { addAllyFactionName, factionName, allyFactionNames, updateAllyUnits } = props

  const handleAllyClick = e => {
    e.preventDefault()
    const newAllyFaction = without(SUPPORTED_FACTIONS, ...allyFactionNames)[0]
    updateAllyUnits({ factionName: newAllyFaction, units: [] })
    addAllyFactionName(newAllyFaction)
  }

  return (
    <div className="container d-print-none">
      <div className="row">
        <div className="col">
          {allyFactionNames.map(factionName => (
            <AllyArmyBuilder factionName={factionName} />
          ))}
        </div>
      </div>

      {/* <div className="row justify-content-center pt-2" >
        <div className={selectClass}>
          <AddAllySelect setAllyFactionName={setAllyFactionName} items={SUPPORTED_FACTIONS} />
        </div>
      </div> */}

      <div className="row justify-content-center pt-3">
        <div className={btnClass}>
          <AddAllyButton setAllyClick={handleAllyClick} />
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
  allyFactionNames: factionNames.selectors.getAllyFactionNames(state),
})

const mapDispatchToProps = {
  addAllyFactionName: factionNames.actions.addAllyFactionName,
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
        + Add Ally
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
  const handleSetAllyName = withSelectOne(setAllyFactionName)

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
