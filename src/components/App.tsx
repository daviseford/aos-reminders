import React, { useState, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import Reminders from './info/reminders'
import { ArmyBuilder, AllyArmyBuilder } from './input/army_builder'
import { PrintHeader, PrintFooterComponent, PrintUnitsComponent } from './print/print'
import { TSupportedFaction } from 'meta/factions'
import { getArmy } from 'utils/getArmy'
import Header from './page/header'
import Footer from './page/footer'
import { logFactionSwitch } from 'utils/analytics'
import { ValueType } from 'react-select/lib/types'
import { TDropdownOption } from './input/select'
import Toolbar from './input/toolbar'
import { IArmy } from 'types/army'
import { factionNames } from 'ducks'

const App = props => {
  const { factionName, allyFactionName } = props
  const [selections, setSelections] = useState({
    artifacts: [] as string[],
    battalions: [] as string[],
    traits: [] as string[],
    units: [] as string[],
  })
  const [allySelections, setAllySelections] = useState({
    units: [] as string[],
  })
  const [realmscape, setRealmscape] = useState('None')
  const army = useMemo(() => getArmy(factionName), [factionName])
  const allyArmy = useMemo(() => getArmy(allyFactionName as TSupportedFaction), [allyFactionName])

  const handleSetRealmscape = (selectValue: ValueType<TDropdownOption>) => {
    const { value } = selectValue as TDropdownOption
    setRealmscape(value)
  }

  // Reset the state when factionName is switched
  useEffect(() => {
    setSelections({ artifacts: [], battalions: [], traits: [], units: [] })
    setRealmscape('None')
    logFactionSwitch(factionName)
  }, [factionName])

  // Reset the ally state when allyFactionName is switched
  useEffect(() => {
    setAllySelections({ units: [] })
  }, [allyFactionName])

  return (
    <div className="d-block">
      <Header />
      <PrintHeader />
      <PrintUnitsComponent selections={selections} allySelections={allySelections} realmscape={realmscape} />

      <ArmyBuilder
        army={army as IArmy}
        realmscape={realmscape}
        selections={selections}
        setRealmscape={handleSetRealmscape}
        setSelections={setSelections}
      />

      {allyArmy && (
        <AllyArmyBuilder army={allyArmy as IArmy} selections={allySelections} setSelections={setAllySelections} />
      )}

      <Toolbar />

      <Reminders
        army={army as IArmy}
        selections={selections}
        allyArmy={allyArmy as IArmy}
        allySelections={allySelections}
      />

      <PrintFooterComponent />
      <Footer />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  factionName: factionNames.selectors.getFactionName(state),
  allyFactionName: factionNames.selectors.getAllyFactionName(state),
})

const mapDispatchToProps = {
  // setAllyFactionName: factionNames.actions.setAllyFactionName,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
