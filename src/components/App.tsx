import React, { useEffect } from 'react'
import { logPageView } from 'utils/analytics'
import { AlliedArmies } from 'components/input/ally_armies'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { NavBar } from 'components/page/navbar'
import { PrintFooterComponent, PrintArmy } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'
import { useAuth0 } from 'react-auth0-wrapper'

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Profile } from 'components/user/profile'

const App = () => {
  useEffect(() => {
    logPageView()
  }, [])

  const { loading } = useAuth0()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="d-block">
      <BrowserRouter>
        <NavBar />

        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

const Main = () => {
  useEffect(() => {
    logPageView()
  }, [])

  return (
    <>
      <Header />

      <ArmyBuilder />

      <AlliedArmies />

      <Toolbar />

      <Reminders />

      <PrintArmy />

      <PrintFooterComponent />

      <FooterComponent />
    </>
  )
}

export default App
