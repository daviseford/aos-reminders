import React, { useState, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import Reminders from './info/reminders'
import { ArmyBuilder, AllyArmyBuilder } from './input/army_builder'
import { PrintHeader, PrintFooterComponent, PrintUnits } from './print/print'
import { TSupportedFaction } from 'meta/factions'
import { getArmy } from 'utils/getArmy'
import Header from './page/header'
import Footer from './page/footer'
import { logFactionSwitch, logAllyFaction } from 'utils/analytics'
import Toolbar from './input/toolbar'
import { IArmy } from 'types/army'
import { factionNames, selections, realmscape } from 'ducks'

const App = props => {
  const { allyFactionName, factionName, resetAllySelections, resetRealmscape, resetSelections } = props
  const army = useMemo(() => getArmy(factionName), [factionName])
  const allyArmy = useMemo(() => getArmy(allyFactionName as TSupportedFaction), [allyFactionName])

  // Reset the store when factionName is switched
  useEffect(() => {
    resetSelections()
    resetRealmscape()
    logFactionSwitch(factionName)
  }, [factionName])

  // Reset the ally store when allyFactionName is switched
  useEffect(() => {
    resetAllySelections()
    allyFactionName && logAllyFaction(allyFactionName)
  }, [allyFactionName])

  return (
    <div className="d-block">
      <Header />
      <PrintHeader />
      <PrintUnits />

      <ArmyBuilder army={army as IArmy} />

      {allyArmy && <AllyArmyBuilder army={allyArmy as IArmy} />}

      <Toolbar />

      <Reminders army={army as IArmy} allyArmy={allyArmy as IArmy} />

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
