import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import './army_builder.css'
import { CardComponent } from 'components/info/card'
import { IArmy } from 'types/army'
import { getArmy } from 'utils/getArmy'
import { selections, factionNames, army } from 'ducks'
import { withSelectMultiple } from 'utils/withSelect'
import { IAllySelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'

interface IAllyArmyBuilderProps {
  allyFactionName: TSupportedFaction | null
  selections: IAllySelections
  updateAllyUnits: (values: string[]) => void
  updateAllyArmy: (army: IArmy | null) => void
}

const AllyArmyBuilderComponent = (props: IAllyArmyBuilderProps) => {
  const { allyFactionName, updateAllyUnits, selections, updateAllyArmy } = props
  const { units } = selections

  const allyArmy = useMemo(() => getArmy(allyFactionName), [allyFactionName])
  const handleUnits = withSelectMultiple(updateAllyUnits)

  useEffect(() => {
    updateAllyArmy(allyArmy)
  }, [allyArmy, updateAllyArmy])

  if (!allyArmy) return <></>

  return (
    <div className="container d-print-none">
      <div className="row border border-dark pb-3">
        <div className="col card-group mx-auto">
          <CardComponent
            items={sortBy(allyArmy.Units, 'name')}
            values={units}
            type={'Allied Unit'}
            setValues={handleUnits}
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  allyFactionName: factionNames.selectors.getAllyFactionName(state),
  selections: selections.selectors.getAllySelections(state),
})

const mapDispatchToProps = {
  updateAllyUnits: selections.actions.updateAllyUnits,
  updateAllyArmy: army.actions.updateAllyArmy,
}

export const AllyArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllyArmyBuilderComponent)
