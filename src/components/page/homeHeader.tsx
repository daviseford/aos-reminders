import { LinkNewTab } from 'components/helpers/link'
import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import { SelectOne } from 'components/input/select'
import ToggleGameMode from 'components/input/toggle_game_mode'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { factionNamesActions, realmscapeActions, selectionActions, selectors } from 'ducks'
import { PRIMARY_FACTIONS } from 'meta/factions'
import React, { lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logFactionSwitch, resetAnalyticsStore } from 'utils/analytics'
import { getArmyLink } from 'utils/handleQueryParams'
import useWindowSize from 'utils/hooks/useWindowSize'
import { titleCase } from 'utils/textUtils'
import { withSelectOne } from 'utils/withSelect'

const Navbar = lazy(() => import('./navbar'))

const { resetAllySelections, resetSelections } = selectionActions
const { resetRealmscapeStore } = realmscapeActions
const { setFactionName } = factionNamesActions

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

const Jumbotron: React.FC = () => {
  const dispatch = useDispatch()
  const { isOnline, isGameMode } = useAppStatus()
  const { setLoadedArmy, getFavoriteFaction, favoriteFaction, loadedArmy } = useSavedArmies()
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()

  const factionName = useSelector(selectors.getFactionName)
  const hasSelections = useSelector(selectors.hasSelections)

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
    dispatch(resetSelections())
    dispatch(resetRealmscapeStore())
    dispatch(resetAllySelections())
    resetAnalyticsStore()
    if (isOnline) logFactionSwitch(value)
    dispatch(setFactionName(value))
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
                  items={PRIMARY_FACTIONS}
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
