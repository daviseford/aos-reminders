import { VisibilityToggle } from 'components/info/visibilityToggle'
import { SelectMulti, SelectOne, TDropdownOption } from 'components/input/select'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { armyActions, selectionActions, selectors, visibilityActions } from 'ducks'
import { sortBy } from 'lodash'
import { TSupportedFaction } from 'meta/factions'
import React, { useCallback, useEffect, useMemo } from 'react'
import { IconContext } from 'react-icons'
import { FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { ValueType } from 'react-select/src/types'
import { TBattalions, TUnits } from 'types/army'
import { IAllySelections } from 'types/selections'
import { logAllyFaction } from 'utils/analytics'
import { useGetArmy } from 'utils/hooks/useGetArmy'
import { titleCase } from 'utils/textUtils'
import { withSelectMultipleWithPayload, withSelectOne } from 'utils/withSelect'

const { deleteAllyArmy, switchAllyArmy, updateAllyArmy } = armyActions
const { deleteAllySelection, resetAllySelection, updateAllyBattalions, updateAllyUnits } = selectionActions
const { deleteAlly: hideAlly, addAlly: showAlly } = visibilityActions

interface IAllyArmyBuilderProps {
  allyFactionName: TSupportedFaction
  allySelectOptions: TSupportedFaction[]
}

export const AllyArmyBuilder = ({ allyFactionName, allySelectOptions }: IAllyArmyBuilderProps) => {
  const dispatch = useDispatch()
  const allySelections = useSelector(selectors.selectAllySelections)
  const factionName = useSelector(selectors.selectFactionName)
  const visibleAllies = useSelector(selectors.selectAllies)

  const { isOnline } = useAppStatus()

  const { units = [], battalions = [] } = allySelections[allyFactionName] as IAllySelections

  const allyArmy = useGetArmy(allyFactionName)

  const handleUnits = withSelectMultipleWithPayload(updateAllyUnits, 'units', {
    factionName: allyFactionName,
  })

  const handleBattalions = withSelectMultipleWithPayload(updateAllyBattalions, 'battalions', {
    factionName: allyFactionName,
  })

  const handleSetAllyFactionName = withSelectOne((value: string | null) => {
    const next = value as TSupportedFaction
    dispatch(deleteAllySelection(allyFactionName))
    dispatch(hideAlly(allyFactionName))
    dispatch(resetAllySelection(next))
    if (isOnline) logAllyFaction(next)
    dispatch(switchAllyArmy({ prev: allyFactionName, next }))
    dispatch(showAlly(next))
  })

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dispatch(deleteAllySelection(allyFactionName))
      dispatch(deleteAllyArmy(allyFactionName))
      dispatch(hideAlly(allyFactionName))
    },
    [allyFactionName, dispatch]
  )

  useEffect(() => {
    dispatch(updateAllyArmy({ factionName: allyFactionName, Army: allyArmy }))
  }, [allyArmy, allyFactionName, dispatch])

  const isVisible = useMemo(() => !!visibleAllies.find(a => a === allyFactionName), [
    allyFactionName,
    visibleAllies,
  ])

  // Show ally when first clicked
  useEffect(() => {
    dispatch(showAlly(allyFactionName))
  }, [allyFactionName, dispatch])

  const setVisibility = useCallback(
    () => dispatch(isVisible ? hideAlly(allyFactionName) : showAlly(allyFactionName)),
    [isVisible, allyFactionName, dispatch]
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

interface IAllyCardProps {
  allyFactionName: TSupportedFaction
  allySelectOptions: TSupportedFaction[]
  battalionItems: TBattalions
  battalionValues: string[]
  factionName: TSupportedFaction
  handleClose: (e: React.MouseEvent) => void
  isVisible: boolean
  setAllyFactionName: (selectValue: ValueType<TDropdownOption>) => void
  setBattalions: (selectValues: ValueType<TDropdownOption>[]) => void
  setUnits: (selectValues: ValueType<TDropdownOption>[]) => void
  setVisibility: () => {
    payload: string
    type: string
  }
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
