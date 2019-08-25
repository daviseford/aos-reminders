import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { factionNames, selections, army } from 'ducks'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import { AllyArmyBuilder } from './ally_army_builder'
import { TUnits, IArmy } from 'types/army'
import { IStore } from 'types/store'

interface IAlliedArmiesProps {
  allyFactionNames: TSupportedFaction[]
  factionName: TSupportedFaction
  resetAllySelection: (factionName: TSupportedFaction) => void
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
}

const AlliedArmiesComponent = (props: IAlliedArmiesProps) => {
  const { factionName, allyFactionNames } = props
  const allySelectOptions = useMemo(() => without(SUPPORTED_FACTIONS, factionName), [factionName])

  return (
    <div className="container d-print-none">
      <div className="row d-flex justify-content-center">
        {allyFactionNames.map(allyFactionName => (
          <AllyArmyBuilder
            allyFactionName={allyFactionName}
            allySelectOptions={allySelectOptions}
            key={allyFactionName}
          />
        ))}
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

export const AlliedArmies = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlliedArmiesComponent)
