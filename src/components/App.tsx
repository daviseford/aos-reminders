import React, { useEffect, lazy, Suspense } from 'react'
import { LoadingBody } from 'components/helpers/suspenseFallbacks'
import { ROUTES } from 'utils/env'

// Auth
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { handleCheckout, handleArmyLink } from 'utils/handleQueryParams'

// Lazy loading routes (takes advantage of code splitting)
const Home = lazy(() => import('components/routes/Home'))
const Profile = lazy(() => import('components/routes/Profile'))
const Subscribe = lazy(() => import('components/routes/Subscribe'))
const Redeem = lazy(() => import('components/routes/Redeem'))

const App = () => {
  useEffect(() => {
    handleCheckout() // Post-checkout handling
    handleArmyLink() // Load army from link
  }, [])

  return (
    <div className={`d-block`}>
      <BrowserRouter>
        <Suspense fallback={<LoadingBody />}>
          <Switch>
            <Route path={ROUTES.HOME} exact component={Home} />
            <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
            <Route path={ROUTES.SUBSCRIBE} component={Subscribe} />
            <Route path={ROUTES.REDEEM} component={Redeem} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
