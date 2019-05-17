import React from 'react'
import './App.css'
import Reminders from './info/reminders'
import * as SeraphonArmy from '../army/seraphon/index'
import { ISelections } from 'types/selections';
import { SERAPHON } from 'meta/factions';

const { Units, Artifacts, Battalions } = SeraphonArmy

const sampleSelections: ISelections = {
  units: [Units.ENGINE_OF_THE_GODS.name, Units.RIPPERDACTYLS.name, Units.LORD_KROAK.name],
  artifacts: [Artifacts.PRISM_OF_AMYNTOK.name],
  battalions: [Battalions.SHADOWSTRIKE_STARHOST.name],
}

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Reminders army={SERAPHON} selections={sampleSelections} />
      </header>
    </div>
  )
}

export default App
