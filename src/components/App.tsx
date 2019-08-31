import React from 'react'
import { Home } from 'components/routes/Home'

// Auth
import { useAuth0 } from 'react-auth0-wrapper'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { Profile } from 'components/routes/Profile'
import { Subscribe } from './routes/Suscribe'

const App = () => {
  const { loading } = useAuth0()

  if (loading) {
    // TODO improve this
    return <div>Loading...</div>
  }

  return (
    <div className="d-block">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/subscribe" component={Subscribe} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
