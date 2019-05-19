import React, { useState } from 'react'

import Reminders from './info/reminders'
import * as SeraphonArmy from '../army/seraphon/index'
import { SERAPHON } from 'meta/factions'
import { ArmyBuilder } from './input/army_builder'
import { PrintHeader, PrintFooter, PrintUnits } from './print/print'

const App = () => {
  // const [factionName, setFactionName] = useState(SERAPHON)
  const [selections, setSelections] = useState({
    units: [] as string[],
    artifacts: [] as string[],
    battalions: [] as string[],
  })

  return (
    <div className="d-block">
      <Header />
      <PrintHeader factionName={SERAPHON} />
      <PrintUnits selections={selections} />

      <ArmyBuilder army={SeraphonArmy} setSelections={setSelections} />
      <Reminders factionName={SERAPHON} selections={selections} />

      <PrintFooter />
    </div>
  )
}

/**
 * Don't worry, it's hidden when printing
 */
const Header = () => {
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
        <p>
          Right now, this tool offers personalized gameplay reminders for Seraphon.
          <br />
          Other armies may be added if there is demand.
        </p>
      </div>
    </div>
  )
}

export default App
