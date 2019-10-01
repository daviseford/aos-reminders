import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import { getArmy } from 'utils/getArmy/getArmy'
import { titleCase } from 'utils/textUtils'
import { logAllyFaction } from 'utils/analytics'
import { withSelectMultipleWithPayload, withSelectOne } from 'utils/withSelect'
import { selections, army, visibility, selectors } from 'ducks'
import { IconContext } from 'react-icons'
import { TDropdownOption, SelectMulti, SelectOne } from './select'
import { TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy } from 'types/army'
import { ValueType } from 'react-select/src/types'
import { IStore, TAllySelectionStore } from 'types/store'
import { FaTrashAlt } from 'react-icons/fa'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import { IAllySelections } from 'types/selections'

interface IAllyArmyBuilderProps {
  allyFactionName: TSupportedFaction // parent
  allySelections: TAllySelectionStore // state2Props
  allySelectOptions: TSupportedFaction[] // parent
  deleteAllyArmy: (factionName: TSupportedFaction) => void // dispatch2Props
  deleteAllySelection: (factionName: TSupportedFaction) => void // dispatch2Props
  hideAlly: (value: string) => void // dispatch2Props
  resetAllySelection: (factionName: TSupportedFaction) => void // dispatch2Props
  showAlly: (value: string) => void // dispatch2Props
  switchAllyArmy: (payload: { next: TSupportedFaction; prev: TSupportedFaction }) => void // dispatch2Props
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void // dispatch2Props
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void // dispatch2Props
  visibleAllies: string[] // state2Props
}

const AllyArmyBuilderComponent = (props: IAllyArmyBuilderProps) => {
  const {
    allyFactionName,
    allySelections,
    allySelectOptions,
    deleteAllyArmy,
    deleteAllySelection,
    hideAlly,
    resetAllySelection,
    showAlly,
    switchAllyArmy,
    updateAllyArmy,
    updateAllyUnits,
    visibleAllies,
  } = props

  const { units = [] } = allySelections[allyFactionName] as IAllySelections

  const allyArmy = useMemo(() => getArmy(allyFactionName), [allyFactionName]) as IArmy

  const handleUnits = withSelectMultipleWithPayload(updateAllyUnits, 'units', {
    factionName: allyFactionName,
  })

  const handleSetAllyFactionName = withSelectOne((value: string | null) => {
    const next = value as TSupportedFaction
    deleteAllySelection(allyFactionName)
    hideAlly(allyFactionName)
    resetAllySelection(next)
    logAllyFaction(next)
    switchAllyArmy({ prev: allyFactionName, next })
    showAlly(next)
  })

  const handleClose = useCallback(
    e => {
      e.preventDefault()
      deleteAllySelection(allyFactionName)
      deleteAllyArmy(allyFactionName)
      hideAlly(allyFactionName)
    },
    [allyFactionName, deleteAllyArmy, deleteAllySelection, hideAlly]
  )

  useEffect(() => {
    updateAllyArmy({ factionName: allyFactionName, Army: allyArmy })
  }, [allyArmy, updateAllyArmy, allyFactionName])

  const isVisible = useMemo(() => !!visibleAllies.find(a => a === allyFactionName), [
    allyFactionName,
    visibleAllies,
  ])

  // Show ally when first clicked
  useEffect(() => {
    showAlly(allyFactionName)
  }, [allyFactionName, showAlly])

  const setVisibility = useCallback(
    () => (isVisible ? hideAlly(allyFactionName) : showAlly(allyFactionName)),
    [isVisible, hideAlly, showAlly, allyFactionName]
  )

  return (
    <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 pb-2">
      <AllyCardComponent
        allyFactionName={allyFactionName}
        allySelectOptions={allySelectOptions}
        handleClose={handleClose}
        items={sortBy(allyArmy.Units, 'name')}
        setAllyFactionName={handleSetAllyFactionName}
        setValues={handleUnits}
        type={`Units`}
        values={units}
        isVisible={isVisible}
        setVisibility={setVisibility}
      />
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  allyFactionNames: selectors.getAllyFactionNames(state),
  allySelections: selectors.getAllySelections(state),
  visibleAllies: selectors.getAllies(state),
})

const mapDispatchToProps = {
  deleteAllyArmy: army.actions.deleteAllyArmy,
  deleteAllySelection: selections.actions.deleteAllySelection,
  hideAlly: visibility.actions.deleteAlly,
  resetAllySelection: selections.actions.resetAllySelection,
  showAlly: visibility.actions.addAlly,
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
  isVisible: boolean
  items: TUnits
  setAllyFactionName: (selectValue: ValueType<TDropdownOption>) => void
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
  setVisibility: () => void
  type: string
  values: string[]
}

const AllyCardComponent = (props: IAllyCardProps) => {
  const {
    allyFactionName,
    allySelectOptions,
    handleClose,
    isVisible,
    items,
    setAllyFactionName,
    setValues,
    setVisibility,
    type,
    values,
  } = props
  const selectItems = items.map(({ name }) => name)
  const selectClass = `flex-grow-1 ${!isVisible ? `text-center text-white` : ``}`
  const headerClass = `card-header bg-secondary pt-1 pb-2`

  return (
    <div className="card">
      <div className={headerClass}>
        <div className="row d-flex justify-content-center align-items-center pt-2 px-2">
          <div className="pr-2">
            <IconContext.Provider value={{ size: '1.25em', className: 'text-light' }}>
              <FaTrashAlt onClick={handleClose} />
            </IconContext.Provider>
          </div>
          <div className={selectClass}>
            {isVisible ? (
              <AddAllySelect
                allyFactionName={allyFactionName}
                items={allySelectOptions}
                setAllyFactionName={setAllyFactionName}
              />
            ) : (
              <h5 className="CardHeaderTitle">Ally: {titleCase(allyFactionName)}</h5>
            )}
          </div>
          <div className="pl-3">
            <VisibilityToggle
              isVisible={isVisible}
              setVisibility={setVisibility}
              className={`text-light`}
              type={'minus'}
            />
          </div>
        </div>
      </div>
      <div className={`card-body py-3 ${isVisible ? `` : `d-none`}`}>
        <h4 className="text-center">Allied {type}</h4>
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
