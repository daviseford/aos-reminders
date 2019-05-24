import React, { useState, useMemo } from 'react'

import Reminders from './info/reminders'
import { ArmyBuilder } from './input/army_builder'
import { PrintHeader, PrintFooter, PrintUnits } from './print/print'
import { SERAPHON } from 'meta/factions'
import { getArmy } from 'utils/getArmy'
import { RealmscapeFeatures } from 'army/malign_sorcery/realmscape_features'
import { SelectRealmscape } from './input/select_realmscape'
import Header from './page/header'
import Footer from './page/footer'

const App = () => {
  const [selections, setSelections] = useState({
    artifacts: [] as string[],
    battalions: [] as string[],
    traits: [] as string[],
    units: [] as string[],
  })
  const [factionName, setFactionName] = useState(SERAPHON)
  const [realmscape, setRealmscape] = useState('None')
  const army = useMemo(() => getArmy(factionName), [factionName])

  return (
    <div className="d-block">
      <Header setFactionName={setFactionName} factionName={factionName} />
      <PrintHeader factionName={factionName} />
      <PrintUnits selections={selections} />

      <SelectRealmscape setValue={setRealmscape} value={realmscape} items={RealmscapeFeatures.map(x => x.name)} />
      <ArmyBuilder army={army} setSelections={setSelections} />
      <Reminders army={army} factionName={factionName} selections={selections} realmscape={realmscape} />

      <PrintFooter />
      <Footer />
    </div>
  )
}

export default App
