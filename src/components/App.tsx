import React, { useEffect } from 'react'
import { logPageView } from 'utils/analytics'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { PrintFooterComponent, PrintArmy } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'
import { AlliedArmies } from './input/ally_armies'

const App = () => {
  useEffect(() => {
    logPageView()
  }, [])

  return (
    <div className="d-block">
      <Header />

      <ArmyBuilder />

      <AlliedArmies />

      <Toolbar />

      <Reminders />

      <PrintArmy />

      <PrintFooterComponent />

      <FooterComponent />
    </div>
  )
}

export default App
