import React, { useState } from 'react'
import './App.css'
import Reminders from './info/reminders'
import * as SeraphonArmy from '../army/seraphon/index'
import { SERAPHON } from 'meta/factions'
import { ArmyBuilder } from './input/select_army'

const App = () => {
  const [selections, setSelections] = useState({
    units: [] as string[],
    artifacts: [] as string[],
    battalions: [] as string[],
  })

  return (
    <div className="App">
      <header className="App-header">
        <h1>Age of Sigmar Reminders</h1>
        <p className="App-header-p">
          By Davis E. Ford -{' '}
          <a href="daviseford.com" target="_blank" className="text-light">
            daviseford.com
          </a>
        </p>
        <p className="App-header-p">
          Right now, this tool offers personalized gameplay reminders for Seraphon.
          <br />
          Other armies may be added if there is demand.
        </p>
      </header>
      <ArmyBuilder army={SeraphonArmy} setSelections={setSelections} />
      <Reminders factionName={SERAPHON} selections={selections} />
    </div>
  )
}

export default App
