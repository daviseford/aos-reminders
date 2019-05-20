import React, { useState, useMemo } from 'react'

import Reminders from './info/reminders'
import { ArmyBuilder } from './input/army_builder'
import { SelectFaction } from './input/select_faction'
import { PrintHeader, PrintFooter, PrintUnits } from './print/print'
import { SERAPHON } from 'meta/factions'
import { getArmy } from 'utils/getArmy'

const App = () => {
  const [selections, setSelections] = useState({
    units: [] as string[],
    artifacts: [] as string[],
    battalions: [] as string[],
  })
  const [factionName, setFactionName] = useState(SERAPHON)
  const army = useMemo(() => getArmy(factionName), [factionName])

  return (
    <div className="d-block">
      <Header setFactionName={setFactionName} factionName={factionName} />
      <PrintHeader factionName={factionName} />
      <PrintUnits selections={selections} />

      <ArmyBuilder army={army} setSelections={setSelections} />
      <Reminders army={army} factionName={factionName} selections={selections} />

      <PrintFooter />
    </div>
  )
}

/**
 * Don't worry, it's hidden when printing
 */
const Header = ({ setFactionName, factionName }) => {
  return (
    <div className="jumbotron jumbotron-fluid text-center bg-dark text-white d-print-none">
      <div className="container">
        <h1 className="display-4">Age of Sigmar Reminders</h1>
        <p className="lead mt-3">
          By Davis E. Ford -{' '}
          <a href="https://daviseford.com" target="_blank" rel="noopener noreferrer">
            daviseford.com
          </a>
        </p>

        <SelectFaction setFactionName={setFactionName} factionName={factionName} />

        <p>
          Right now, this tool offers personalized gameplay reminders for Seraphon and Gloomspite Gitz.
          <br />
          Other armies may be added if there is demand.
        </p>
      </div>
    </div>
  )
}

export default App
