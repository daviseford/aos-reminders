import React, { useEffect } from 'react'
import { Home } from 'components/routes/Home'

// Auth
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { Profile } from 'components/routes/Profile'
import { Subscribe } from 'components/routes/Subscribe'
import { logEvent } from 'utils/analytics'

const handleCheckout = () => {
  if (window.location.search.includes('subscribed=true')) {
    logEvent('Checkout-Subscribed')
    window.history.replaceState({}, document.title, window.location.pathname)
  } else if (window.location.search.includes('canceled=true')) {
    logEvent('Checkout-Canceled')
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

const App = () => {
  useEffect(() => handleCheckout(), []) // Post-checkout handling

  return (
    <div className="d-block">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/subscribe" component={Subscribe} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
