import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { AllyArmyBuilder } from 'components/input/ally_army_builder'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { PrintHeader, PrintFooterComponent, PrintUnits } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'
import { factionNames, selections } from 'ducks'
import { logFactionSwitch, logAllyFaction } from 'utils/analytics'
import { TSupportedFaction } from 'meta/factions'
import { IAllySelections, ISelections } from 'types/selections'

interface IAppProps {
  factionName: TSupportedFaction
  selections: ISelections
  resetSelections: () => void
}

const App = (props: IAppProps) => {
  const { factionName, resetSelections } = props

  // Reset the store when factionName is switched
  useEffect(() => {
    resetSelections()
    logFactionSwitch(factionName)
  }, [factionName, resetSelections])

  // Reset the ally store when allyFactionName is switched
  // useEffect(() => {
  //   resetAllySelections()
  //   allyFactionName && logAllyFaction(allyFactionName)
  // }, [allyFactionName, resetAllySelections])

  return (
    <div className="d-block">
      <Header />
      <PrintHeader />
      <PrintUnits />

      <ArmyBuilder />

      <AllyArmyBuilder />

      <Toolbar />

      <Reminders />

      <PrintFooterComponent />
      <FooterComponent />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  allyFactionName: factionNames.selectors.getAllyFactionName(state),
  allySelections: selections.selectors.getAllySelections(state),
  factionName: factionNames.selectors.getFactionName(state),
  selections: selections.selectors.getSelections(state),
})

const mapDispatchToProps = {
  resetAllySelections: selections.actions.resetAllySelections,
  resetSelections: selections.actions.resetSelections,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
