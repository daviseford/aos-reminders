import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import { getArmy } from 'utils/getArmy'
import { titleCase } from 'utils/titleCase'
import { logAllyFaction } from 'utils/analytics'
import { withSelectMultipleWithPayload, withSelectOne } from 'utils/withSelect'
import './army_builder.css'
import { selections, army } from 'ducks'
import { IconContext } from 'react-icons'
import { FaRegWindowClose } from 'react-icons/fa'
import { TDropdownOption, SelectMulti, SelectOne } from './select'
import { TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy } from 'types/army'
import { IAllySelections } from 'types/selections'
import { ValueType } from 'react-select/lib/types'

interface IAllyArmyBuilderProps {
  allyFactionName: TSupportedFaction // parent
  allySelections: { [key: string]: IAllySelections } // state2Props
  allySelectOptions: TSupportedFaction[] // parent
  deleteAllyArmy: (factionName: TSupportedFaction) => void // dispatch2Props
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
    allySelectOptions,
    deleteAllyArmy,
    deleteAllySelection,
    resetAllySelection,
    switchAllyArmy,
    updateAllyArmy,
    updateAllyUnits,
  } = props
  const { units = [] } = allySelections[allyFactionName]

  const allyArmy = useMemo(() => getArmy(allyFactionName), [allyFactionName]) as IArmy

  const handleUnits = withSelectMultipleWithPayload(updateAllyUnits, 'units', {
    factionName: allyFactionName,
  })

  const handleSetAllyFactionName = withSelectOne((value: string | null) => {
    const next = value as TSupportedFaction
    deleteAllySelection(allyFactionName)
    resetAllySelection(next)
    logAllyFaction(next)
    switchAllyArmy({ prev: allyFactionName, next })
  })

  const handleClose = useCallback(
    e => {
      e.preventDefault()
      deleteAllySelection(allyFactionName)
      deleteAllyArmy(allyFactionName)
    },
    [allyFactionName, deleteAllyArmy, deleteAllySelection]
  )

  useEffect(() => {
    updateAllyArmy({ factionName: allyFactionName, Army: allyArmy })
  }, [allyArmy, updateAllyArmy, allyFactionName])

  return (
    <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 pb-2">
      <AllyCardComponent
        allyFactionName={allyFactionName}
        allySelectOptions={allySelectOptions}
        handleClose={handleClose}
        items={sortBy(allyArmy.Units, 'name')}
        setAllyFactionName={handleSetAllyFactionName}
        setValues={handleUnits}
        type={`Unit`}
        values={units}
      />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
  allySelections: selections.selectors.getAllySelections(state),
})

const mapDispatchToProps = {
  deleteAllyArmy: army.actions.deleteAllyArmy,
  deleteAllySelection: selections.actions.deleteAllySelection,
  resetAllySelection: selections.actions.resetAllySelection,
  switchAllyArmy: army.actions.switchAllyArmy,
  updateAllyArmy: army.actions.updateAllyArmy,
  updateAllyUnits: selections.actions.updateAllyUnits,
}

export const AllyArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(AllyArmyBuilderComponent)

interface IAllyCardProps {
  allyFactionName: TSupportedFaction
  allySelectOptions: TSupportedFaction[]
  handleClose: (e: any) => void
  items: TUnits
  setAllyFactionName: (selectValue: ValueType<TDropdownOption>) => void
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
  type: string
  values: string[]
}

const AllyCardComponent = (props: IAllyCardProps) => {
  const {
    items,
    type,
    setValues,
    values,
    setAllyFactionName,
    allySelectOptions,
    allyFactionName,
    handleClose,
  } = props
  const selectItems = items.map(x => x.name)

  return (
    <div className="card">
      <div className="card-header bg-secondary">
        <div className="row d-flex justify-content-center align-items-center pt-2 px-2">
          <div className="flex-grow-1">
            <AddAllySelect
              allyFactionName={allyFactionName}
              items={allySelectOptions}
              setAllyFactionName={setAllyFactionName}
            />
          </div>
          <div className="pl-3">
            <IconContext.Provider value={{ size: '1.3em', className: 'text-light' }}>
              <FaRegWindowClose onClick={handleClose} />
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div className="card-body">
        <h4 className="text-center">Add {type}s</h4>
        <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
      </div>
    </div>
  )
}

interface IAddAllySelect {
  allyFactionName: TSupportedFaction
  items: TSupportedFaction[]
  setAllyFactionName: (selectValue: ValueType<TDropdownOption>) => void
}

const AddAllySelect = (props: IAddAllySelect) => {
  const { setAllyFactionName, items, allyFactionName } = props
  return (
    <>
      <SelectOne
        hasDefault={true}
        items={items}
        setValue={setAllyFactionName}
        toTitle={true}
        value={titleCase(allyFactionName)}
      />
    </>
  )
}
