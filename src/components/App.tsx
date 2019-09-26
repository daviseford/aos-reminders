import React, { useEffect, lazy, Suspense } from 'react'
import Home from 'components/routes/Home'
import { Loading } from 'components/page/loading'

// Auth
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import qs from 'qs'
import { logEvent, logSubscription } from 'utils/analytics'

const handleCheckout = () => {
  const { subscribed = false, canceled = false, plan = '' } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })

  if (subscribed) {
    logEvent(`Checkout-Subscribed-${plan}`)
    logSubscription(plan)
  }
  if (canceled) logEvent(`Checkout-Canceled-${plan}`)

  if (subscribed || canceled) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

// Lazy loading routes (takes advantage of code splitting)
const Profile = lazy(() => import('components/routes/Profile'))
const Subscribe = lazy(() => import('components/routes/Subscribe'))

const App = () => {
  useEffect(() => handleCheckout(), []) // Post-checkout handling

  return (
    <div className="d-block">
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/profile" component={Profile} />
            <Route path="/subscribe" component={Subscribe} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
