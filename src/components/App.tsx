import React, { useEffect, lazy, Suspense } from 'react'
import { Loading } from 'components/page/loading'

// Auth
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import qs from 'qs'
import { logEvent } from 'utils/analytics'

const handleCheckout = () => {
  const { code = false, subscribed = false, canceled = false, plan = '' } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })

  if (subscribed) logEvent(`Checkout-Subscribed-${plan}`)
  if (canceled) logEvent(`Checkout-Canceled-${plan}`)
  if (!!code) logEvent(`CreatedAccount`)

  if (subscribed || canceled || !!code) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

// Lazy loading routes (takes advantage of code splitting)
const Home = lazy(() => import('components/routes/Home'))
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
