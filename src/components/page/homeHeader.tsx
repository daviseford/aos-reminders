import React, { Suspense, lazy, useEffect } from 'react'
import { connect } from 'react-redux'
import { withSelectOne } from 'utils/withSelect'
import { logFactionSwitch } from 'utils/analytics'
import { factionNames, factionOrigins, selections, selectors, realmscape } from 'ducks'
import { SelectOne } from 'components/input/select'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { componentWithSize } from 'utils/mapSizesToProps'
import { titleCase } from 'utils/textUtils'
import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import { useSavedArmies } from 'context/useSavedArmies'
import { LinkNewTab } from 'components/helpers/link'
import { LocalStoredArmy } from 'utils/localStore'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { getArmyLink } from 'utils/handleQueryParams'
import { TOrigins, SUPPORTED_FACTION_ORIGINS } from 'types/realmscapes'

const Navbar = lazy(() => import(/* webpackChunkName: 'Navbar' */ './navbar'))

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
  factionOrigin: TOrigins
  hasSelections: boolean
  isMobile: boolean
  resetAllySelections: () => void
  resetRealmscapeStore: () => void
  resetSelections: () => void
  setFactionName: (value: string | null) => void
  setFactionOrigin: (value: string | null) => void
}

const JumbotronComponent: React.FC<IJumbotronProps> = props => {
  const {
    factionName,
    factionOrigin,
    hasSelections,
    isMobile,
    resetAllySelections,
    resetRealmscapeStore,
    resetSelections,
    setFactionName,
    setFactionOrigin,
  } = props
  const { isOnline } = useAppStatus()
  const { setLoadedArmy, getFavoriteFaction, favoriteFaction } = useSavedArmies()
  const { theme } = useTheme()

  // Get our user's favorite faction from localStorage/API
  useEffect(() => {
    getFavoriteFaction()
  }, [getFavoriteFaction])

  // Set our favorite faction
  useEffect(() => {
    if (favoriteFaction && !LocalStoredArmy.exists() && !hasSelections && getArmyLink() === null) {
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

  const setOrigin = withSelectOne((value: string | null) => {
    console.log('setOrigin called....')
    setFactionOrigin(value)
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
        <span className="text-white">Select your army and realm of origin (optional) to get started:</span>
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
          <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-left">
            <SelectOne
              value={titleCase(factionOrigin)}
              items={SUPPORTED_FACTION_ORIGINS}
              setValue={setOrigin}
              hasDefault={true}
              toTitle={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    factionName: selectors.getFactionName(state),
    factionOrigin: selectors.getFactionOrigin(state),
    hasSelections: selectors.hasSelections(state),
  }
}

const mapDispatchToProps = {
  resetAllySelections: selections.actions.resetAllySelections,
  resetRealmscapeStore: realmscape.actions.resetRealmscapeStore,
  resetSelections: selections.actions.resetSelections,
  setFactionName: factionNames.actions.setFactionName,
  setFactionOrigin: factionOrigins.actions.setFactionOrigin,
}

const Jumbotron = connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithSize(JumbotronComponent))
