import React, { useEffect } from 'react'
import { Home } from 'components/Home'

// Auth
import { useAuth0 } from 'react-auth0-wrapper'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from 'components/page/privateRoute'
import { Profile } from 'components/user/profile'

const App = () => {
  const { loading } = useAuth0()

  useEffect(() => {
    if (!loading) console.log('yo rendering app')
  })

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
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
