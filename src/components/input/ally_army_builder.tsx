import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import './army_builder.css'
import { getArmy } from 'utils/getArmy'
import { selections, army } from 'ducks'
import { withSelectMultipleWithPayload, withSelectOneWithPayload } from 'utils/withSelect'
import { IAllySelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy, TBattalions, TArtifacts, TCommandTraits } from 'types/army'
import { ValueType } from 'react-select/lib/types'
import { TDropdownOption, SelectMulti, SelectOne } from './select'

interface IAllyArmyBuilderProps {
  allyFactionName: TSupportedFaction // parent
  allySelections: { [key: string]: IAllySelections } // state2Props
  allySelectOptions: TSupportedFaction[] // parent
  deleteAllySelection: (factionName: TSupportedFaction) => void // dispatch2Props
  resetAllySelection: (factionName: TSupportedFaction) => void // dispatch2Props
  switchAllyArmy: (payload: { next: TSupportedFaction; prev: TSupportedFaction }) => void // dispatch2Props
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void // dispatch2Props
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void // dispatch2Props
}

const AllyArmyBuilderComponent = (props: IAllyArmyBuilderProps) => {
  const {
    allyFactionName,
    allySelections,
    updateAllyArmy,
    switchAllyArmy,
    deleteAllySelection,
    resetAllySelection,
    allySelectOptions,
    updateAllyUnits,
  } = props
  const { units = [] } = allySelections[allyFactionName]

  const allyArmy = useMemo(() => getArmy(allyFactionName), [allyFactionName]) as IArmy

  const handleUnits = withSelectMultipleWithPayload(updateAllyUnits, 'units', { factionName: allyFactionName })

  const setAllyName = withSelectOneWithPayload(switchAllyArmy, 'next', { prev: allyFactionName })
  const handleSetAllyFactionName = useCallback(
    (payload: ValueType<TDropdownOption>) => {
      const { value } = payload as TDropdownOption
      deleteAllySelection(allyFactionName)
      resetAllySelection(value as TSupportedFaction)
      setAllyName(payload)
    },
    [allyFactionName, setAllyName, deleteAllySelection, resetAllySelection]
  )

  useEffect(() => {
    updateAllyArmy({ factionName: allyFactionName, Army: allyArmy })
  }, [allyArmy, updateAllyArmy, allyFactionName])

  return (
    <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 pb-2">
      <AllyCardComponent
        items={sortBy(allyArmy.Units, 'name')}
        values={units}
        type={`Unit`}
        setValues={handleUnits}
        setAllyFactionName={handleSetAllyFactionName}
        allySelectOptions={allySelectOptions}
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
  switchAllyArmy: army.actions.switchAllyArmy,
  deleteAllySelection: selections.actions.deleteAllySelection,
  resetAllySelection: selections.actions.resetAllySelection,
}

export const AllyArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllyArmyBuilderComponent)

const selectClass = `col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4`

interface IAllyCardProps {
  allySelectOptions: TSupportedFaction[]
  values: string[]
  type: string
  items: TUnits | TBattalions | TArtifacts | TCommandTraits
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
  setAllyFactionName: (selectValue: ValueType<TDropdownOption>) => void
}

export const AllyCardComponent = (props: IAllyCardProps) => {
  const { items, type, setValues, values, setAllyFactionName, allySelectOptions } = props
  const selectItems = items.map(x => x.name)

  return (
    <div className="card">
      <div className="card-header">
        {/* <div className="row justify-content-center pt-2"> */}
        <div className={selectClass}>
          <AddAllySelect setAllyFactionName={setAllyFactionName} items={allySelectOptions} />
        </div>
        {/* </div> */}
      </div>
      <div className="card-body">
        <h4 className="text-center">Add {type}s</h4>
        <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
      </div>
    </div>
  )
}

interface IAddAllySelect {
  setAllyFactionName: (selectValue: ValueType<TDropdownOption>) => void
  items: TSupportedFaction[]
}

const AddAllySelect = (props: IAddAllySelect) => {
  const { setAllyFactionName, items } = props
  return (
    <>
      <SelectOne items={items} setValue={setAllyFactionName} hasDefault={true} toTitle={true} />
    </>
  )
}
