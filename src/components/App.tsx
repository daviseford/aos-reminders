import React, { useEffect, lazy, Suspense } from 'react'
import { LoadingBody } from 'components/helpers/suspenseFallbacks'
import { ROUTES } from 'utils/env'

// Auth
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { handleCheckout, handleArmyLink } from 'utils/handleQueryParams'

// Lazy loading routes (takes advantage of code splitting)
const Home = lazy(() => import('components/routes/Home'))
const Join = lazy(() => import('components/routes/Join'))
const Profile = lazy(() => import('components/routes/Profile'))
const Redeem = lazy(() => import('components/routes/Redeem'))
const Stats = lazy(() => import('components/routes/Stats'))
const Subscribe = lazy(() => import('components/routes/Subscribe'))

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
            {/* Main page of the app */}
            <Route path={ROUTES.HOME} exact component={Home} />

            {/* Coupon redemption */}
            <Route path={ROUTES.JOIN} component={Join} />

            {/* Gift subscription redemption */}
            <Route path={ROUTES.REDEEM} component={Redeem} />

            {/* Subscribe page */}
            <Route path={ROUTES.SUBSCRIBE} component={Subscribe} />

            {/* Stats page */}
            <Route path={ROUTES.STATS} component={Stats} />

            {/* Profile page */}
            <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
