import React, { useState, Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { getArmy } from 'utils/getArmy/getArmy'
import { useSubscription } from 'context/useSubscription'
import { selections, army, selectors } from 'ducks'
import { FallbackBtn } from 'components/helpers/suspenseFallbacks'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy } from 'types/army'
import { IStore } from 'types/store'

const AddAllyButton = lazy(() => import(/* webpackChunkName: 'add_ally_btn' */ './add_ally_btn'))
const DownloadPDFButton = lazy(() => import(/* webpackChunkName: 'pdfButton' */ 'components/print/pdfButton'))
const ImportArmyButton = lazy(() => import(/* webpackChunkName: 'import_army_btn' */ './import_army_btn'))
const ImportContainer = lazy(() =>
  import(/* webpackChunkName: 'drop_container' */ '../importPdf/drop_container')
)
const SaveArmyBtn = lazy(() => import(/* webpackChunkName: 'save_army_btn' */ '../savedArmies/save_army_btn'))
const ShowSavedArmies = lazy(() =>
  import(/* webpackChunkName: 'saved_armies' */ '../savedArmies/saved_armies')
)
const ShowSavedArmiesBtn = lazy(() =>
  import(/* webpackChunkName: 'show_saved_armies_btn' */ '../savedArmies/show_saved_armies_btn')
)

const btnWrapperClass = `col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-2 px-2 px-sm-3 pb-2`

interface IToolbarProps {
  allyFactionNames: TSupportedFaction[]
  factionName: TSupportedFaction
  resetAllySelection: (factionName: TSupportedFaction) => void
  updateAllyArmy: (payload: { factionName: TSupportedFaction; Army: IArmy }) => void
  updateAllyUnits: (payload: { factionName: TSupportedFaction; units: TUnits }) => void
}

const ToolbarComponent = (props: IToolbarProps) => {
  const { factionName, allyFactionNames, resetAllySelection, updateAllyArmy } = props
  const { isSubscribed } = useSubscription()

  const [isShowingSavedArmies, setIsShowingSavedArmies] = useState(false)
  const [isShowingImport, setIsShowingWarscrollImport] = useState(false)

  const showSavedArmies = () => setIsShowingSavedArmies(true)
  const hideSavedArmies = () => setIsShowingSavedArmies(false)

  const showImportArmy = () => setIsShowingWarscrollImport(true)
  const hideImportArmy = () => setIsShowingWarscrollImport(false)

  const handleAllyClick = e => {
    e.preventDefault()
    const newAllyFaction = without(SUPPORTED_FACTIONS, factionName, ...allyFactionNames)[0]
    resetAllySelection(newAllyFaction)
    updateAllyArmy({ factionName: newAllyFaction, Army: getArmy(newAllyFaction) as IArmy })
  }

  return (
    <div className="container d-print-none">
      <div className="row justify-content-center pt-3 mx-xl-5 px-xl-5">
        <div className={btnWrapperClass}>
          <Suspense fallback={<FallbackBtn />}>
            <AddAllyButton setAllyClick={handleAllyClick} />
          </Suspense>
        </div>
        <div className={btnWrapperClass}>
          <Suspense fallback={<FallbackBtn />}>
            <DownloadPDFButton />
          </Suspense>
        </div>
        <div className={btnWrapperClass}>
          <Suspense fallback={<FallbackBtn />}>
            <SaveArmyBtn showSavedArmies={showSavedArmies} />
          </Suspense>
        </div>
        <div className={btnWrapperClass}>
          <Suspense fallback={<FallbackBtn />}>
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
        <div className={btnWrapperClass} hidden={!isSubscribed}>
          <Suspense fallback={<></>}>
            <ShowSavedArmiesBtn
              isShowingSavedArmies={isShowingSavedArmies}
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

      <div hidden={!isShowingSavedArmies}>
        <Suspense fallback={<></>}>
          <ShowSavedArmies />
        </Suspense>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  factionName: selectors.getFactionName(state),
  allyFactionNames: selectors.getAllyFactionNames(state),
})

const mapDispatchToProps = {
  resetAllySelection: selections.actions.resetAllySelection,
  updateAllyArmy: army.actions.updateAllyArmy,
  updateAllyUnits: selections.actions.updateAllyUnits,
}

const Toolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolbarComponent)

export default Toolbar
