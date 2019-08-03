import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import './army_builder.css'
import { getArmy } from 'utils/getArmy'
import { selections, army } from 'ducks'
import { withSelectMultipleWithPayload } from 'utils/withSelect'
import { IAllySelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy, TBattalions, TArtifacts, TCommandTraits } from 'types/army'
import { titleCase } from 'utils/titleCase'
import { ValueType } from 'react-select/lib/types'
import { TDropdownOption, SelectMulti } from './select'

interface IAllyArmyBuilderProps {
  allyFactionName: TSupportedFaction // parent
  allySelections: { [key: string]: IAllySelections } // state2Props
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void // dispatch2Props
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void // dispatch2Props
}

const AllyArmyBuilderComponent = (props: IAllyArmyBuilderProps) => {
  const { allyFactionName, allySelections, updateAllyArmy, updateAllyUnits } = props
  const { units = [] } = allySelections[allyFactionName]

  const allyArmy = useMemo(() => getArmy(allyFactionName), [allyFactionName]) as IArmy
  const handleUnits = withSelectMultipleWithPayload(updateAllyUnits, 'units', { factionName: allyFactionName })

  useEffect(() => {
    updateAllyArmy({ factionName: allyFactionName, Army: allyArmy })
  }, [allyArmy, updateAllyArmy, allyFactionName])

  return (
    <div className="col card-group border border-dark mx-auto">
      <AllyCardComponent
        allyFactionName={allyFactionName}
        items={sortBy(allyArmy.Units, 'name')}
        values={units}
        type={`Unit`}
        setValues={handleUnits}
      />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  allySelections: selections.selectors.getAllySelections(state),
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
})

const mapDispatchToProps = {
  updateAllyUnits: selections.actions.updateAllyUnits,
  updateAllyArmy: army.actions.updateAllyArmy,
}

export const AllyArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllyArmyBuilderComponent)

interface IAllyCardProps {
  allyFactionName: TSupportedFaction
  values: string[]
  type: string
  items: TUnits | TBattalions | TArtifacts | TCommandTraits
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
}

export const AllyCardComponent = (props: IAllyCardProps) => {
  const { items, type, setValues, values, allyFactionName } = props
  const selectItems = items.map(x => x.name)
  return (
    <div className="card">
      <div className="card-header">{titleCase(allyFactionName)}</div>
      <div className="card-body">
        <h4 className="text-center">Add {type}s</h4>
        <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
      </div>
    </div>
  )
}
