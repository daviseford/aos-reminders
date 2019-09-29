import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { selectors } from 'ducks'
import { AllyArmyBuilder } from './ally_army_builder'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'
import { IStore } from 'types/store'

interface IAlliedArmiesProps {
  allyFactionNames: TSupportedFaction[]
  factionName: TSupportedFaction
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
  factionName: selectors.getFactionName(state),
  allyFactionNames: selectors.getAllyFactionNames(state),
})

const AlliedArmies = connect(
  mapStateToProps,
  null
)(AlliedArmiesComponent)

export default AlliedArmies
