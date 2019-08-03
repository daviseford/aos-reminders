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
  factionName: TSupportedFaction // parent
  allySelections: { [key: string]: IAllySelections } // state2Props
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Units: TUnits }) => void // dispatch2Props
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void // dispatch2Props
}

const AllyArmyBuilderComponent = (props: IAllyArmyBuilderProps) => {
  debugger
  const { factionName, allySelections, updateAllyArmy, updateAllyUnits } = props
  const { units = [] } = allySelections[factionName]

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
  allySelections: selections.selectors.getAllySelections(state),
})

const mapDispatchToProps = {
  updateAllyUnits: selections.actions.updateAllyUnits,
  updateAllyArmy: army.actions.updateAllyArmy,
}

export const AllyArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllyArmyBuilderComponent)
