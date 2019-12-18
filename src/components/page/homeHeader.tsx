import React, { Suspense, lazy, useEffect } from 'react'
import { connect } from 'react-redux'
import { factionNames, selections, selectors, realmscape } from 'ducks'
import { useTheme } from 'context/useTheme'
import { useSavedArmies } from 'context/useSavedArmies'
import { useAppStatus } from 'context/useAppStatus'
import { withSelectOne } from 'utils/withSelect'
import { logFactionSwitch } from 'utils/analytics'
import { componentWithSize } from 'utils/mapSizesToProps'
import { titleCase } from 'utils/textUtils'
import { getArmyLink } from 'utils/handleQueryParams'
import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import { SelectOne } from 'components/input/select'
import { LinkNewTab } from 'components/helpers/link'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'

const Navbar = lazy(() => import('./navbar'))

export const Header = props => {
  const { isGameMode } = props
  const { theme } = useTheme()
  return (
    <div className={theme.headerColor}>
      <Suspense fallback={<LoadingHeader />}>
        <Navbar />
      </Suspense>
      <Jumbotron isGameMode={isGameMode} />
    </div>
  )
}

interface IJumbotronProps {
  factionName: TSupportedFaction
  hasSelections: boolean
  isGameMode: boolean
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
    isGameMode,
    isMobile,
    resetAllySelections,
    resetRealmscapeStore,
    resetSelections,
    setFactionName,
  } = props
  const { isOnline } = useAppStatus()
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
        {isGameMode ? (
          <div className={`d-flex pt-3 pb-2 justify-content-center`}>
            <h2 className="display-6 text-white">{titleCase(factionName)}</h2>
            {loadedArmy && <h3 className={theme.textSecondary}>{loadedArmy.armyName}</h3>}
          </div>
        ) : (
          <div>
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
          </div>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
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
