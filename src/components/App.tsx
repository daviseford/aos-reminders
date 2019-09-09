import React from 'react'
import { Home } from 'components/routes/Home'

// Auth
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { Profile } from 'components/routes/Profile'
import { Subscribe } from 'components/routes/Subscribe'

const App = () => {
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
