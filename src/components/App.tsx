import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { PrintFooterComponent, PrintArmy } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'
import { factionNames, selections } from 'ducks'
import { logPageView } from 'utils/analytics'
import { TSupportedFaction } from 'meta/factions'
import { AlliedArmies } from './input/ally_armies'
import { IStore } from 'types/store'

interface IAppProps {
  factionName: TSupportedFaction
  resetSelections: () => void
}

const App = (props: IAppProps) => {
  useEffect(() => {
    logPageView()
  }, [])

  return (
    <div className="d-block">
      <Header />

      <ArmyBuilder />

      <AlliedArmies />

      <Toolbar />

      <Reminders />

      <PrintArmy />

      <PrintFooterComponent />

      <FooterComponent />
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  factionName: factionNames.selectors.getFactionName(state),
})

const mapDispatchToProps = {
  resetSelections: selections.actions.resetSelections,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
