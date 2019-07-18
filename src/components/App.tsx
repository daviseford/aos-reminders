import React, { useState, useMemo, useEffect } from 'react'
import Reminders from './info/reminders'
import { ArmyBuilder, AllyArmyBuilder } from './input/army_builder'
import { PrintHeader, PrintFooter, PrintUnits } from './print/print'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { getArmy } from 'utils/getArmy'
import Header from './page/header'
import Footer from './page/footer'
import { logFactionSwitch, logPageView } from 'utils/analytics'
import { ValueType } from 'react-select/lib/types'
import { TDropdownOption } from './input/select'
import Toolbar from './input/toolbar'
import { IArmy } from 'types/army'

const App = () => {
  logPageView()
  const [selections, setSelections] = useState({
    artifacts: [] as string[],
    battalions: [] as string[],
    traits: [] as string[],
    units: [] as string[],
  })
  const [allySelections, setAllySelections] = useState({
    units: [] as string[],
  })
  const [factionName, setFactionName] = useState(SUPPORTED_FACTIONS[0])
  const [allyFactionName, setAllyFactionName] = useState('')
  const [realmscape, setRealmscape] = useState('None')
  const army = useMemo(() => getArmy(factionName), [factionName])
  const allyArmy = useMemo(() => {
    return allyFactionName ? getArmy(allyFactionName as TSupportedFaction) : null
  }, [allyFactionName])

  const handleSetRealmscape = (selectValue: ValueType<TDropdownOption>, action) => {
    const { value } = selectValue as TDropdownOption
    setRealmscape(value)
  }

  const handleSetAllyName = (selectValue: ValueType<TDropdownOption>) => {
    const { value } = selectValue as TDropdownOption
    setAllyFactionName(value)
  }

  // Reset the state when factionName is switched
  useEffect(() => {
    setSelections({ artifacts: [], battalions: [], traits: [], units: [] })
    setAllySelections({ units: [] })
    setRealmscape('None')
    setAllyFactionName('')
    logFactionSwitch(factionName)
  }, [factionName])

  // Reset the ally state when allyFactionName is switched
  useEffect(() => {
    setAllySelections({ units: [] })
  }, [allyFactionName, selections])

  return (
    <div className="d-block">
      <Header setFactionName={setFactionName} factionName={factionName} />
      <PrintHeader factionName={factionName} />
      <PrintUnits selections={selections} allySelections={allySelections} realmscape={realmscape} />

      <ArmyBuilder
        army={army}
        realmscape={realmscape}
        selections={selections}
        setRealmscape={handleSetRealmscape}
        setSelections={setSelections}
      />

      {allyFactionName && (
        <AllyArmyBuilder army={allyArmy as IArmy} selections={allySelections} setSelections={setAllySelections} />
      )}

      <Toolbar setAllyValue={handleSetAllyName} factionName={factionName} />

      <Reminders
        army={army}
        factionName={factionName}
        selections={selections}
        realmscape={realmscape}
        allyArmy={allyArmy as IArmy}
        allySelections={allySelections}
      />

      <PrintFooter />
      <Footer />
    </div>
  )
}

export default App
