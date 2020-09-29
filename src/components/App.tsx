import { LoadingBody } from 'components/helpers/suspenseFallbacks'
import ProtectedRoute from 'components/page/privateRoute'
import React, { lazy, Suspense, useEffect } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { ROUTES } from 'utils/env'
import { handleArmyLink, handleStripeCheckout } from 'utils/handleQueryParams'
import history from 'utils/history'

// Lazy loading routes (takes advantage of code splitting)
const Home = lazy(() => import(/* webpackChunkName: "Home" */ 'components/routes/Home'))
const Join = lazy(() => import(/* webpackChunkName: "Join" */ 'components/routes/Join'))
const Profile = lazy(() => import(/* webpackChunkName: "Profile" */ 'components/routes/Profile'))
const Redeem = lazy(() => import(/* webpackChunkName: "Redeem" */ 'components/routes/Redeem'))
const Stats = lazy(() => import(/* webpackChunkName: "Stats" */ 'components/routes/Stats'))
const Subscribe = lazy(() => import(/* webpackChunkName: "Subscribe" */ 'components/routes/Subscribe'))

const App = () => {
  useEffect(() => {
    handleStripeCheckout() // Post-Stripe-checkout handling
    handleArmyLink() // Load army from link
  }, [])

  return (
    <div className={`d-block`}>
      <Router history={history}>
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
            <ProtectedRoute path={ROUTES.PROFILE} component={Profile} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
