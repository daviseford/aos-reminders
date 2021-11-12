import { LoadingBody } from 'components/helpers/suspenseFallbacks'
import ProtectedRoute from 'components/page/privateRoute'
import React, { lazy, Suspense, useEffect } from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import { ROUTES } from 'utils/env'
import { handleArmyLink, handleStripeCheckout } from 'utils/handleQueryParams'
import history from 'utils/history'

// Lazy loading routes (takes advantage of code splitting)
const Faq = lazy(() => import('components/routes/Faq'))
const Home = lazy(() => import('components/routes/Home'))
const Join = lazy(() => import('components/routes/Join'))
const Profile = lazy(() => import('components/routes/Profile'))
const Redeem = lazy(() => import('components/routes/Redeem'))
const Stats = lazy(() => import('components/routes/Stats'))
const Subscribe = lazy(() => import('components/routes/Subscribe'))

const App = () => {
  useEffect(() => {
    handleStripeCheckout() // Post-Stripe-checkout handling
    handleArmyLink() // Load army from link
  }, [])

  return (
    <div className={`d-block`}>
      <Router history={history}>
        <Suspense fallback={<LoadingBody />}>
          <Routes>
            {/* Main page of the app */}
            <Route path={ROUTES.HOME}>
              <Home />
            </Route>

            {/* Help/FAQ */}
            <Route path={ROUTES.FAQ}>
              <Faq />
            </Route>

            {/* Coupon redemption */}
            <Route path={ROUTES.JOIN}>
              <Join />
            </Route>

            {/* Gift subscription redemption */}
            <Route path={ROUTES.REDEEM}>
              <Redeem />
            </Route>

            {/* Subscribe page */}
            <Route path={ROUTES.SUBSCRIBE}>
              <Subscribe />
            </Route>

            {/* Stats page */}
            <Route path={ROUTES.STATS}>
              <Stats />
            </Route>

            {/* Profile page */}
            <ProtectedRoute path={ROUTES.PROFILE} component={Profile} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
