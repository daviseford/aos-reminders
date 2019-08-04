import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { PrintFooterComponent, PrintHeader } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'
import { factionNames, selections } from 'ducks'
import { logFactionSwitch } from 'utils/analytics'
import { TSupportedFaction } from 'meta/factions'
import { AlliedArmies } from './input/ally_armies'

interface IAppProps {
  factionName: TSupportedFaction
  resetSelections: () => void
}

const App = (props: IAppProps) => {
  const { factionName, resetSelections } = props

  // Reset the store when factionName is switched
  useEffect(() => {
    resetSelections()
    logFactionSwitch(factionName)
  }, [factionName, resetSelections])

  return (
    <div className="d-block">
      <Header />

      <PrintHeader />

      <ArmyBuilder />

      <AlliedArmies />

      <Toolbar />

      <Reminders />

      <PrintFooterComponent />
      <FooterComponent />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
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
