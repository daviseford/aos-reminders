import React, { useState, Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { without } from 'lodash-es'
import { getArmy } from 'utils/getArmy/getArmy'
import { logClick } from 'utils/analytics'
import { useSubscription } from 'context/useSubscription'
import { selections, army, selectors } from 'ducks'
import { FaPlus, FaFileImport } from 'react-icons/fa'
import { FallbackBtn } from 'components/helpers/suspenseFallbacks'
import { SaveArmyBtn } from './savedArmies/save_army_btn'
import { btnContentWrapper, btnDarkBlock } from 'theme/helperClasses'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { TUnits, IArmy } from 'types/army'
import { IStore } from 'types/store'

const ImportContainer = lazy(() =>
  import(/* webpackChunkName: 'drop_container' */ 'components/input/importPdf/drop_container')
)
const DownloadPDFButton = lazy(() => import(/* webpackChunkName: 'pdfButton' */ 'components/print/pdfButton'))
const ShowSavedArmiesBtn = lazy(() =>
  import(/* webpackChunkName: 'show_saved_armies_btn' */ './savedArmies/show_saved_armies_btn')
)
const ShowSavedArmies = lazy(() =>
  import(/* webpackChunkName: 'saved_armies' */ './savedArmies/saved_armies')
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

  const handleAllyClick = async e => {
    e.preventDefault()
    const newAllyFaction = without(SUPPORTED_FACTIONS, factionName, ...allyFactionNames)[0]
    resetAllySelection(newAllyFaction)
    const Army = (await getArmy(newAllyFaction)) as IArmy
    updateAllyArmy({ factionName: newAllyFaction, Army })
  }

  return (
    <div className="container d-print-none">
      <div className="row justify-content-center pt-3 mx-xl-5 px-xl-5">
        <div className={btnWrapperClass}>
          <AddAllyButton setAllyClick={handleAllyClick} />
        </div>
        <div className={btnWrapperClass}>
          <Suspense fallback={<FallbackBtn />}>
            <DownloadPDFButton />
          </Suspense>
        </div>
        <div className={btnWrapperClass}>
          <SaveArmyBtn showSavedArmies={showSavedArmies} />
        </div>
        <div className={btnWrapperClass}>
          <ImportArmyButton
            show={showImportArmy}
            hide={hideImportArmy}
            isShowing={isShowingImport}
            // TODO: Enable after a couple weeks from now (9/9/19)
            // isSubscribed={isSubscribed}
            isSubscribed={true}
          />
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

export const Toolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolbarComponent)

interface IAddAllyButton {
  setAllyClick: (e: any) => void
}

const AddAllyButton = (props: IAddAllyButton) => {
  const { setAllyClick } = props
  return (
    <>
      <button className={`btn btn-block btn-outline-dark`} onClick={setAllyClick}>
        <div className={btnContentWrapper}>
          <FaPlus className="mr-2" /> Add Ally
        </div>
      </button>
    </>
  )
}

const ImportArmyButton = (props: {
  isSubscribed: boolean
  isShowing: boolean
  show: () => void
  hide: () => void
}) => {
  const { show, hide, isShowing, isSubscribed } = props

  const handleClick = e => {
    e.preventDefault()
    isShowing ? hide() : show()
  }

  const btnTxt = isShowing ? `Hide Import` : `Import List`

  return isSubscribed ? (
    <button className={btnDarkBlock} onClick={handleClick}>
      <div className={btnContentWrapper}>
        <FaFileImport className="mr-2" /> {btnTxt}
      </div>
    </button>
  ) : (
    <Link to="/subscribe" className={btnDarkBlock} onClick={() => logClick('Import-Subscribe')}>
      <div className={btnContentWrapper}>
        <FaFileImport className="mr-2" /> Import List
      </div>
    </Link>
  )
}
