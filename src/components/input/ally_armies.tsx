import { AllyArmyBuilder } from 'components/input/ally_army_builder'
import { selectors } from 'ducks'
import { without } from 'lodash'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

const AlliedArmies = () => {
  const allyFactionNames = useSelector(selectors.selectAllyFactionNames)
  const factionName = useSelector(selectors.selectFactionName)
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

export default AlliedArmies
