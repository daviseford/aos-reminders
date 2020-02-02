import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import { IconContext } from 'react-icons'
import { FaTrashAlt } from 'react-icons/fa'
import { ValueType } from 'react-select/src/types'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { selections, army, visibility, selectors } from 'ducks'
import { getArmy } from 'utils/getArmy/getArmy'
import { titleCase } from 'utils/textUtils'
import { logAllyFaction } from 'utils/analytics'
import { withSelectMultipleWithPayload, withSelectOne } from 'utils/withSelect'
import { TDropdownOption, SelectMulti, SelectOne } from 'components/input/select'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import { TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy, TBattalions } from 'types/army'
import { IAllySelections } from 'types/selections'
import { IStore, TAllySelectionStore } from 'types/store'

interface IAllyArmyBuilderProps {
  allyFactionName: TSupportedFaction // parent
  allySelections: TAllySelectionStore // state2Props
  allySelectOptions: TSupportedFaction[] // parent
  deleteAllyArmy: (factionName: TSupportedFaction) => void // dispatch2Props
  deleteAllySelection: (factionName: TSupportedFaction) => void // dispatch2Props
  factionName: TSupportedFaction // state2Props
  hideAlly: (value: string) => void // dispatch2Props
  resetAllySelection: (factionName: TSupportedFaction) => void // dispatch2Props
  showAlly: (value: string) => void // dispatch2Props
  switchAllyArmy: (payload: { next: TSupportedFaction; prev: TSupportedFaction }) => void // dispatch2Props
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void // dispatch2Props
  updateAllyBattalions: (payload: { factionName: TSupportedFaction; battalions: TBattalions }) => void // dispatch2Props
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
    factionName,
    hideAlly,
    resetAllySelection,
    showAlly,
    switchAllyArmy,
    updateAllyArmy,
    updateAllyBattalions,
    updateAllyUnits,
    visibleAllies,
  } = props

  const { isOnline } = useAppStatus()

  const { units = [], battalions = [] } = allySelections[allyFactionName] as IAllySelections

  const allyArmy = useMemo(() => getArmy(allyFactionName), [allyFactionName]) as IArmy

  const handleUnits = withSelectMultipleWithPayload(updateAllyUnits, 'units', {
    factionName: allyFactionName,
  })

  const handleBattalions = withSelectMultipleWithPayload(updateAllyBattalions, 'battalions', {
    factionName: allyFactionName,
  })

  const handleSetAllyFactionName = withSelectOne((value: string | null) => {
    const next = value as TSupportedFaction
    deleteAllySelection(allyFactionName)
    hideAlly(allyFactionName)
    resetAllySelection(next)
    if (isOnline) logAllyFaction(next)
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
        battalionItems={sortBy(allyArmy.Battalions, 'name')}
        battalionValues={battalions}
        factionName={factionName}
        handleClose={handleClose}
        isVisible={isVisible}
        setAllyFactionName={handleSetAllyFactionName}
        setBattalions={handleBattalions}
        setUnits={handleUnits}
        setVisibility={setVisibility}
        unitItems={sortBy(allyArmy.Units, 'name')}
        unitValues={units}
      />
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  allyFactionNames: selectors.getAllyFactionNames(state),
  allySelections: selectors.getAllySelections(state),
  factionName: selectors.getFactionName(state),
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
  updateAllyBattalions: selections.actions.updateAllyBattalions,
  updateAllyUnits: selections.actions.updateAllyUnits,
}

export const AllyArmyBuilder = connect(mapStateToProps, mapDispatchToProps)(AllyArmyBuilderComponent)

interface IAllyCardProps {
  allyFactionName: TSupportedFaction
  allySelectOptions: TSupportedFaction[]
  battalionItems: TBattalions
  battalionValues: string[]
  factionName: TSupportedFaction
  handleClose: (e: any) => void
  isVisible: boolean
  setAllyFactionName: (selectValue: ValueType<TDropdownOption>) => void
  setBattalions: (selectValues: ValueType<TDropdownOption>[]) => void
  setUnits: (selectValues: ValueType<TDropdownOption>[]) => void
  setVisibility: () => void
  unitItems: TUnits
  unitValues: string[]
}

const AllyCardComponent = (props: IAllyCardProps) => {
  const {
    allyFactionName,
    allySelectOptions,
    battalionItems,
    battalionValues,
    factionName,
    handleClose,
    isVisible,
    setAllyFactionName,
    setBattalions,
    setUnits,
    setVisibility,
    unitItems,
    unitValues,
  } = props
  const { theme } = useTheme()

  const selectBattalionItems = battalionItems.map(({ name }) => name)
  const selectUnitItems = unitItems.map(({ name }) => name)
  const selectClass = `flex-grow-1 ${!isVisible ? `text-center` : ``}`
  const headerClass = `card-header bg-secondary pt-1 pb-2`

  return (
    <div className={theme.card}>
      <div className={headerClass}>
        <div className="row d-flex justify-content-center align-items-center pt-2 px-2">
          <div className="pr-2">
            <IconContext.Provider value={{ size: '1.25em', className: `text-white` }}>
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
              <h5 className={`CardHeaderTitle text-white`}>Ally: {titleCase(allyFactionName)}</h5>
            )}
          </div>
          <div className="pl-3">
            <VisibilityToggle
              isVisible={isVisible}
              setVisibility={setVisibility}
              className={`text-white`}
              type={'minus'}
            />
          </div>
        </div>
      </div>
      <div className={`${theme.cardBody} py-3 ${isVisible ? `` : `d-none`}`}>
        <h5 className={`text-center ${theme.text}`}>Allied Units</h5>
        <SelectMulti
          values={unitValues}
          items={selectUnitItems}
          setValues={setUnits}
          isClearable={true}
          log={{ title: 'AlliedUnits', label: factionName }}
        />
        <h5 className={`text-center ${theme.text} mt-2`}>Allied Battalions</h5>
        <SelectMulti
          values={battalionValues}
          items={selectBattalionItems}
          setValues={setBattalions}
          isClearable={true}
          log={{ title: 'AlliedBattalions', label: factionName }}
        />
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
