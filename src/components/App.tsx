import React from 'react'
import './App.css'
import Reminders from './info/reminders'
import * as SeraphonArmy from '../army/seraphon/index'
import { ISelections } from 'types/selections'
import { SERAPHON } from 'meta/factions'
import { ArmyBuilder } from './input/select_army'

const { Units, Artifacts, Battalions } = SeraphonArmy

const sampleSelections: ISelections = {
  units: [Units.ENGINE_OF_THE_GODS.name, Units.RIPPERDACTYLS.name, Units.LORD_KROAK.name],
  artifacts: [Artifacts.PRISM_OF_AMYNTOK.name],
  battalions: [Battalions.SHADOWSTRIKE_STARHOST.name],
}

const App: React.FC = () => {
  // TODO: Have ArmyBuilder update `selections` for real-time reminders!
  return (
    <div className="App">
      <header className="App-header">
        <h2>Age of Sigmar Reminders</h2>
      </header>
      <ArmyBuilder army={SeraphonArmy} />
      <Reminders factionName={SERAPHON} selections={sampleSelections} />
    </div>
  )
}

export default App
