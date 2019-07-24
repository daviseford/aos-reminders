import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import RemindersComponent from './info/reminders'
import { ArmyBuilder, AllyArmyBuilder } from './input/army_builder'
import { PrintHeader, PrintFooterComponent, PrintUnits } from './print/print'
import Header from './page/header'
import Footer from './page/footer'
import { logFactionSwitch, logAllyFaction } from 'utils/analytics'
import Toolbar from './input/toolbar'
import { factionNames, selections, realmscape } from 'ducks'

const App = props => {
  const { allyFactionName, factionName, resetAllySelections, resetRealmscape, resetSelections } = props

  // Reset the store when factionName is switched
  useEffect(() => {
    resetSelections()
    resetRealmscape()
    logFactionSwitch(factionName)
  }, [factionName, resetRealmscape, resetSelections])

  // Reset the ally store when allyFactionName is switched
  useEffect(() => {
    resetAllySelections()
    allyFactionName && logAllyFaction(allyFactionName)
  }, [allyFactionName, resetAllySelections])

  return (
    <div className="d-block">
      <Header />
      <PrintHeader />
      <PrintUnits />

      <ArmyBuilder />

      <AllyArmyBuilder />

      <Toolbar />

      <RemindersComponent />

      <PrintFooterComponent />
      <Footer />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  allyFactionName: factionNames.selectors.getAllyFactionName(state),
  allySelections: selections.selectors.getAllySelections(state),
  factionName: factionNames.selectors.getFactionName(state),
  selections: selections.selectors.getSelections(state),
})

const mapDispatchToProps = {
  resetAllySelections: selections.actions.resetAllySelections,
  resetRealmscape: realmscape.actions.resetRealmscape,
  resetSelections: selections.actions.resetSelections,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
