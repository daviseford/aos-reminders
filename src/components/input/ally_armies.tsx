import { AllyArmyBuilder } from 'components/input/ally_army_builder'
import { selectors } from 'ducks'
import { without } from 'lodash'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
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
  factionName: selectors.selectFactionName(state),
  allyFactionNames: selectors.getAllyFactionNames(state),
})

const AlliedArmies = connect(mapStateToProps, null)(AlliedArmiesComponent)

export default AlliedArmies
