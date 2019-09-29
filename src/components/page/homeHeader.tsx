import React, { Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import { withSelectOne } from 'utils/withSelect'
import { logFactionSwitch } from 'utils/analytics'
import { factionNames, selections, selectors, realmscape } from 'ducks'
import { SelectOne } from 'components/input/select'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { componentWithSize } from 'utils/mapSizesToProps'
import { titleCase } from 'utils/textUtils'
import { EmptyHeader } from 'components/helpers/suspenseFallbacks'
import { useSavedArmies } from 'context/useSavedArmies'

const Navbar = lazy(() => import(/* webpackChunkName: 'Navbar' */ './navbar'))

export const Header = () => {
  return (
    <div className="ThemeDarkBg">
      <Suspense fallback={<EmptyHeader />}>
        <Navbar />
      </Suspense>
      <Jumbotron />
    </div>
  )
}

interface IJumbotronProps {
  isMobile: boolean
  factionName: TSupportedFaction
  resetSelections: () => void
  resetRealmscapeStore: () => void
  resetAllySelections: () => void
  setFactionName: (value: string | null) => void
}

const JumbotronComponent: React.FC<IJumbotronProps> = props => {
  const {
    resetAllySelections,
    resetSelections,
    resetRealmscapeStore,
    setFactionName,
    isMobile,
    factionName,
  } = props
  const { setLoadedArmy } = useSavedArmies()

  const setValue = withSelectOne((value: string | null) => {
    setLoadedArmy(null)
    resetSelections()
    resetRealmscapeStore()
    resetAllySelections()
    logFactionSwitch(value)
    setFactionName(value)
  })

  const jumboClass = `jumbotron jumbotron-fluid text-center ThemeDarkBg text-white d-print-none mb-0 pt-4 ${
    isMobile ? `pb-2` : `pb-3`
  }`

  return (
    <div className={jumboClass}>
      <div className="container">
        <h1 className="display-5">Age of Sigmar Reminders</h1>
        <p className="mt-3 mb-1">
          By Davis E. Ford -{' '}
          <a className="text-white" href="https://daviseford.com" target="_blank" rel="noopener noreferrer">
            daviseford.com
          </a>
        </p>
        <span>This tool offers gameplay reminders for:</span>
        <div className={`d-flex pt-3 pb-2 justify-content-center`}>
          <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-dark text-left">
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
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    factionName: selectors.getFactionName(state),
  }
}

const mapDispatchToProps = {
  resetAllySelections: selections.actions.resetAllySelections,
  resetRealmscapeStore: realmscape.actions.resetRealmscapeStore,
  resetSelections: selections.actions.resetSelections,
  setFactionName: factionNames.actions.setFactionName,
}

const Jumbotron = connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithSize(JumbotronComponent))
