import React, { useEffect, lazy, Suspense } from 'react'
import Home from 'components/routes/Home'
import { Loading } from 'components/page/loading'

// Auth
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { handleCheckout } from 'utils/handleCheckout'

// Lazy loading routes (takes advantage of code splitting)
const Profile = lazy(() => import(/* webpackChunkName: 'Profile' */ 'components/routes/Profile'))
const Subscribe = lazy(() => import(/* webpackChunkName: 'Subscribe' */ 'components/routes/Subscribe'))

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
