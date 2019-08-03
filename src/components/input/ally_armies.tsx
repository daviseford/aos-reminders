import React from 'react'
import { connect } from 'react-redux'
import { factionNames, selections, army } from 'ducks'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { without } from 'lodash'
import { AllyArmyBuilder } from './ally_army_builder'
import { TUnits, IArmy } from 'types/army'
import { getArmy } from 'utils/getArmy'

interface IAlliedArmiesProps {
  allyFactionNames: TSupportedFaction[]
  factionName: TSupportedFaction
  resetAllySelection: (factionName: TSupportedFaction) => void
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
}

const AlliedArmiesComponent = (props: IAlliedArmiesProps) => (
  <div className="container d-print-none">
    <div className="row">
      {props.allyFactionNames.map(allyFactionName => (
        <AllyArmyBuilder allyFactionName={allyFactionName} />
      ))}
    </div>
  </div>
)

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

export const AlliedArmies = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlliedArmiesComponent)
