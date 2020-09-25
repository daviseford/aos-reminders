import { LoadingBtn } from 'components/helpers/suspenseFallbacks'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useSubscription } from 'context/useSubscription'
import { army, realmscape, selections, selectors } from 'ducks'
import { without } from 'lodash'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import React, { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { IArmy, TUnits } from 'types/army'
import { ISavedArmy } from 'types/savedArmy'
import { IStore } from 'types/store'
import { logClick } from 'utils/analytics'
import { armyHasEntries } from 'utils/armyUtils'
import { getArmy } from 'utils/getArmy/getArmy'

const AddAllyButton = lazy(() => import('./add_ally_btn'))
const ClearArmyButton = lazy(() => import('./clear_army_btn'))
const DownloadPDFButton = lazy(() => import('components/print/pdfButton'))
const ImportArmyButton = lazy(() => import('./import_army_btn'))
const ImportContainer = lazy(() => import('../importPdf/drop_container'))
const ResetChangesBtn = lazy(() => import('../savedArmies/reset_changes_btn'))
const SaveArmyBtn = lazy(() => import('../savedArmies/save_army_btn'))
const ShareArmyBtn = lazy(() => import('../shareArmy/share_army_btn'))
const ShowSavedArmies = lazy(() => import('../savedArmies/saved_armies'))
const ShowSavedArmiesBtn = lazy(() => import('../savedArmies/show_saved_armies_btn'))
const UpdateArmyBtn = lazy(() => import('../savedArmies/update_army_btn'))

const btnWrapperClass = `col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-2 px-2 px-sm-3 pb-2`

interface IToolbarProps {
  allyFactionNames: TSupportedFaction[]
  currentArmy: ISavedArmy
  factionName: TSupportedFaction
  resetAllySelection: (factionName: TSupportedFaction) => void
  resetAllySelections: () => void
  resetRealmscapeStore: () => void
  resetSelections: () => void
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
}

const ToolbarComponent = (props: IToolbarProps) => {
  const {
    allyFactionNames,
    currentArmy,
    factionName,
    resetAllySelection,
    resetAllySelections,
    resetRealmscapeStore,
    resetSelections,
    updateAllyArmy,
  } = props
  const { isGameMode, isOnline } = useAppStatus()
  const { loadedArmy, armyHasChanges, setLoadedArmy } = useSavedArmies()
  const { isSubscribed, isActive } = useSubscription()
  const [isShowingSavedArmies, setIsShowingSavedArmies] = useState({ edit: false, game: false })
  const [isShowingImport, setIsShowingWarscrollImport] = useState(false)
  const currentViewMode = isGameMode ? 'game' : 'edit'

  const { hasChanges, changedKeys } = useMemo(() => armyHasChanges(currentArmy), [
    currentArmy,
    armyHasChanges,
  ])

  const hasEntries = useMemo(() => armyHasEntries(currentArmy), [currentArmy])

  const showOrHideSavedArmies = (show: boolean) => {
    setIsShowingSavedArmies(s => ({ ...s, [currentViewMode]: show }))
  }

  const showSavedArmies = () => showOrHideSavedArmies(true)
  const hideSavedArmies = () => showOrHideSavedArmies(false)

  const showImportArmy = () => setIsShowingWarscrollImport(true)
  const hideImportArmy = () => setIsShowingWarscrollImport(false)

  const handleAllyClick = useCallback(
    e => {
      e.preventDefault()
      const newAllyFaction = without(SUPPORTED_FACTIONS, factionName, ...allyFactionNames)[0]
      resetAllySelection(newAllyFaction)
      updateAllyArmy({ factionName: newAllyFaction, Army: getArmy(newAllyFaction) as IArmy })
    },
    [factionName, allyFactionNames, resetAllySelection, updateAllyArmy]
  )

  const clearArmyClick = useCallback(
    e => {
      e.preventDefault()
      resetAllySelections()
      resetRealmscapeStore()
      resetSelections()
      logClick('ClearArmy')
      setLoadedArmy(null)
    },
    [resetAllySelections, resetRealmscapeStore, resetSelections, setLoadedArmy]
  )

  if (isGameMode) return <></>

  return (
    <div className="container d-print-none">
      <div className={`row justify-content-center pt-3 mx-xl-5 px-xl-5`}>
        <div className={btnWrapperClass}>
          <Suspense fallback={<LoadingBtn />}>
            <ClearArmyButton clearArmyClick={clearArmyClick} />
          </Suspense>
        </div>
        <div className={btnWrapperClass}>
          <Suspense fallback={<LoadingBtn />}>
            <AddAllyButton setAllyClick={handleAllyClick} />
          </Suspense>
        </div>
        <div className={btnWrapperClass}>
          <Suspense fallback={<LoadingBtn />}>
            <DownloadPDFButton />
          </Suspense>
        </div>
        {isOnline && loadedArmy && hasChanges && (
          <>
            <div className={btnWrapperClass}>
              <UpdateArmyBtn
                currentArmy={{ ...currentArmy, ...loadedArmy }}
                changedKeys={changedKeys}
                id={loadedArmy.id}
              />
            </div>
            <div className={btnWrapperClass}>
              <ResetChangesBtn />
            </div>
          </>
        )}
        <div className={btnWrapperClass} hidden={!hasEntries}>
          <Suspense fallback={<LoadingBtn />}>
            <SaveArmyBtn showSavedArmies={showSavedArmies} />
          </Suspense>
        </div>
        <div className={btnWrapperClass}>
          <Suspense fallback={<LoadingBtn />}>
            <ImportArmyButton
              show={showImportArmy}
              hide={hideImportArmy}
              isShowing={isShowingImport}
              // TODO: Enable after a couple weeks from now (9/9/19)
              // isSubscribed={isSubscribed}
              isSubscribed={true}
            />
          </Suspense>
        </div>
        <div className={btnWrapperClass} hidden={!hasEntries}>
          <Suspense fallback={<LoadingBtn />}>
            <ShareArmyBtn />
          </Suspense>
        </div>
        <div className={btnWrapperClass} hidden={isOnline && (!isSubscribed || !isActive)}>
          <Suspense fallback={<></>}>
            <ShowSavedArmiesBtn
              isShowingSavedArmies={isShowingSavedArmies[currentViewMode]}
              hideSavedArmies={hideSavedArmies}
              showSavedArmies={showSavedArmies}
            />
          </Suspense>
        </div>
      </div>

      <div hidden={!isShowingImport}>
        <Suspense fallback={<></>}>
          <ImportContainer />
        </Suspense>
      </div>

      <div hidden={!isShowingSavedArmies[currentViewMode]}>
        <Suspense fallback={<></>}>
          <ShowSavedArmies />
        </Suspense>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  allyFactionNames: selectors.getAllyFactionNames(state),
  currentArmy: selectors.getCurrentArmy(state),
  factionName: selectors.selectFactionName(state),
})

const mapDispatchToProps = {
  resetAllySelection: selections.actions.resetAllySelection,
  resetAllySelections: selections.actions.resetAllySelections,
  resetRealmscapeStore: realmscape.actions.resetRealmscapeStore,
  resetSelections: selections.actions.resetSelections,
  updateAllyArmy: army.actions.updateAllyArmy,
  updateAllyUnits: selections.actions.updateAllyUnits,
}

const Toolbar = connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent)

export default Toolbar
