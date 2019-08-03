import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import './army_builder.css'
import { CardComponent } from 'components/info/card'
import { getArmy } from 'utils/getArmy'
import { selections, army } from 'ducks'
import { withSelectMultipleWithPayload } from 'utils/withSelect'
import { IAllySelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy } from 'types/army'

interface IAllyArmyBuilderProps {
  factionName: TSupportedFaction
  selections: { [key: string]: IAllySelections }
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Units: TUnits }) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
}

const AllyArmyBuilderComponent = (props: IAllyArmyBuilderProps) => {
  const { factionName, selections, updateAllyArmy, updateAllyUnits } = props
  const { units } = selections[factionName]

  const allyArmy = useMemo(() => getArmy(factionName), [factionName]) as IArmy
  const handleUnits = withSelectMultipleWithPayload(updateAllyUnits, 'units', { factionName })

  useEffect(() => {
    updateAllyArmy({ factionName, Units: allyArmy.Units })
  }, [allyArmy, updateAllyArmy])

  return (
    <div className="container d-print-none">
      <div className="row border border-dark pb-3">
        <div className="col card-group mx-auto">
          {factionName}
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
