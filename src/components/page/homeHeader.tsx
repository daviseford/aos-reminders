import React, { Suspense, lazy, useEffect } from 'react'
import Switch from 'react-switch'
import { connect } from 'react-redux'
import { factionNames, selections, selectors, realmscape } from 'ducks'
import { useTheme } from 'context/useTheme'
import { useSavedArmies } from 'context/useSavedArmies'
import { useAppStatus } from 'context/useAppStatus'
import { centerContentClass } from 'theme/helperClasses'
import { withSelectOne } from 'utils/withSelect'
import { logFactionSwitch } from 'utils/analytics'
import { componentWithSize } from 'utils/mapSizesToProps'
import { titleCase } from 'utils/textUtils'
import { getArmyLink } from 'utils/handleQueryParams'
import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import { SelectOne } from 'components/input/select'
import { LinkNewTab } from 'components/helpers/link'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { IStore } from 'types/store'

const Navbar = lazy(() => import('./navbar'))

export const Header = () => {
  const { theme } = useTheme()
  return (
    <div className={theme.headerColor}>
      <Suspense fallback={<LoadingHeader />}>
        <Navbar />
      </Suspense>
      <Jumbotron />
    </div>
  )
}

interface IJumbotronProps {
  factionName: TSupportedFaction
  hasSelections: boolean
  isMobile: boolean
  resetAllySelections: () => void
  resetRealmscapeStore: () => void
  resetSelections: () => void
  setFactionName: (value: string | null) => void
}

const JumbotronComponent: React.FC<IJumbotronProps> = props => {
  const {
    factionName,
    hasSelections,
    isMobile,
    resetAllySelections,
    resetRealmscapeStore,
    resetSelections,
    setFactionName,
  } = props
  const { isOnline, isGameMode } = useAppStatus()
  const { setLoadedArmy, getFavoriteFaction, favoriteFaction, loadedArmy } = useSavedArmies()
  const { theme } = useTheme()

  // Get our user's favorite faction from localStorage/API
  useEffect(() => {
    getFavoriteFaction()
  }, [getFavoriteFaction])

  // Set our favorite faction
  useEffect(() => {
    if (favoriteFaction && !hasSelections && getArmyLink() === null) {
      setFactionName(favoriteFaction)
    }
    // Don't want to refresh this on hasSelections, so we need to ignore that piece of state
    // eslint-disable-next-line
  }, [favoriteFaction, setFactionName])

  const setValue = withSelectOne((value: string | null) => {
    setLoadedArmy(null)
    resetSelections()
    resetRealmscapeStore()
    resetAllySelections()
    if (isOnline) logFactionSwitch(value)
    setFactionName(value)
  })

  const jumboClass = `jumbotron jumbotron-fluid text-center ${theme.headerColor} d-print-none mb-0 pt-4 ${
    isMobile ? `pb-2` : `pb-3`
  }`

  return (
    <div className={jumboClass}>
      <div className="container">
        <h1 className="display-5 text-white">Age of Sigmar Reminders</h1>
        <p className="mt-3 mb-1 d-none d-sm-block text-white">
          By Davis E. Ford -{' '}
          <LinkNewTab className="text-white" href="//daviseford.com" label={'Davis E. Ford website'}>
            daviseford.com
          </LinkNewTab>
        </p>
        <ToggleGameMode />
        {isGameMode ? (
          <div className={`pt-1 pb-0 justify-content-center`}>
            <h2 className="display-5 text-white">
              {loadedArmy ? loadedArmy.armyName : titleCase(factionName)}
            </h2>
          </div>
        ) : (
          <>
            <span className="text-white">Select your army to get started:</span>
            <div className={`d-flex pt-3 pb-2 justify-content-center`}>
              <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-left">
                <SelectOne
                  value={titleCase(factionName)}
                  items={SUPPORTED_FACTIONS}
                  setValue={setValue}
                  hasDefault={true}
                  toTitle={true}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const ToggleGameMode = () => {
  const { theme } = useTheme()
  const { isGameMode, toggleGameMode } = useAppStatus()

  const spanClass = `align-self-center pb-2`

  return (
    <div className={`${centerContentClass} ${theme.text}`}>
      <div className={`d-inline-flex flex-row`}>
        <span className={`${spanClass} mr-2 ${isGameMode ? `` : `font-weight-bold`}`}>Edit</span>
        <label htmlFor="visual-theme-switch" className="mb-0">
          <Switch
            onChange={toggleGameMode}
            checked={isGameMode}
            onColor="#1C7595"
            onHandleColor="#E9ECEF"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={80}
            className="react-switch"
            id="visual-theme-switch"
          />
        </label>
        <span className={`${spanClass} ml-2 ${isGameMode ? `font-weight-bold` : ``}`}>Play</span>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => {
  return {
    ...ownProps,
    factionName: selectors.getFactionName(state),
    hasSelections: selectors.hasSelections(state),
  }
}

const mapDispatchToProps = {
  resetAllySelections: selections.actions.resetAllySelections,
  resetRealmscapeStore: realmscape.actions.resetRealmscapeStore,
  resetSelections: selections.actions.resetSelections,
  setFactionName: factionNames.actions.setFactionName,
}

const Jumbotron = connect(mapStateToProps, mapDispatchToProps)(componentWithSize(JumbotronComponent))
