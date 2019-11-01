import React, { useEffect, lazy, Suspense } from 'react'
import { LoadingBody } from './helpers/suspenseFallbacks'

// Auth
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { handleCheckout } from 'utils/handleCheckout'
import { loadArmyFromLocalStore } from 'utils/loadArmyFromLocalStore'
import { ROUTES } from 'utils/env'
import { useTheme } from 'context/useTheme'

// Lazy loading routes (takes advantage of code splitting)
const Home = lazy(() => import(/* webpackChunkName: 'Home' */ 'components/routes/Home'))
const Profile = lazy(() => import(/* webpackChunkName: 'Profile' */ 'components/routes/Profile'))
const Subscribe = lazy(() => import(/* webpackChunkName: 'Subscribe' */ 'components/routes/Subscribe'))

const App = () => {
  const { theme } = useTheme()

  useEffect(() => {
    handleCheckout() // Post-checkout handling
    loadArmyFromLocalStore() // Load an army from the localStore (after redirect)
  }, [])

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <BrowserRouter>
        <Suspense fallback={<LoadingBody />}>
          <Switch>
            <Route path={ROUTES.HOME} exact component={Home} />
            <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
            <Route path={ROUTES.SUBSCRIBE} component={Subscribe} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
