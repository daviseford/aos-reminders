import React, { useEffect } from 'react'
import { logPageView } from 'utils/analytics'
import { AlliedArmies } from 'components/input/ally_armies'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { PrintFooterComponent, PrintArmy } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'

// Auth
import { useAuth0 } from 'react-auth0-wrapper'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { Profile } from 'components/user/profile'
import { Checkout } from './payment/checkout'

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
        <Switch>
          <Route path="/" exact component={Main} />
          <PrivateRoute path="/profile" component={Profile} />
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

      <Checkout />

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
