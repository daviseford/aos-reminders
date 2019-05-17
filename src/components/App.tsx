import React from 'react'
import './App.css'
import Reminders from './info/reminders'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Reminders army={'SERAPHON'} />
      </header>
    </div>
  )
}

export default App
