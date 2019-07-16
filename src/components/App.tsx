import React, { useState, useMemo, useEffect } from 'react'
import Reminders from './info/reminders'
import { ArmyBuilder } from './input/army_builder'
import { PrintHeader, PrintFooter, PrintUnits } from './print/print'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { getArmy } from 'utils/getArmy'
import Header from './page/header'
import Footer from './page/footer'
import { logFactionSwitch, logPageView } from 'utils/analytics'
import { ValueType } from 'react-select/lib/types'
import { TDropdownOption } from './input/select'
import Toolbar from './input/toolbar'

const App = () => {
  logPageView()
  const [selections, setSelections] = useState({
    artifacts: [] as string[],
    battalions: [] as string[],
    traits: [] as string[],
    units: [] as string[],
  })
  const [factionName, setFactionName] = useState(SUPPORTED_FACTIONS[0])
  const [realmscape, setRealmscape] = useState('None')
  const army = useMemo(() => getArmy(factionName), [factionName])

  const useSetFactionName = (selectValue: ValueType<TDropdownOption>, action) => {
    const { value } = selectValue as TDropdownOption
    setRealmscape(value)
  }

  // Reset the state when factionName is switched
  useEffect(() => {
    setSelections({ artifacts: [], battalions: [], traits: [], units: [] })
    setRealmscape('None')
    logFactionSwitch(factionName)
  }, [factionName])

  return (
    <div className="d-block">
      <Header setFactionName={setFactionName} factionName={factionName} />
      <PrintHeader factionName={factionName} />
      <PrintUnits selections={selections} realmscape={realmscape} />

      <ArmyBuilder
        army={army}
        realmscape={realmscape}
        selections={selections}
        setRealmscape={useSetFactionName}
        setSelections={setSelections}
      />

      <Toolbar />

      <Reminders army={army} factionName={factionName} selections={selections} realmscape={realmscape} />

      <PrintFooter />
      <Footer />
    </div>
  )
}

export default App
