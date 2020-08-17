import React, { useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { Route } from 'react-router-dom'

export const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0()

  useEffect(() => {
    if (loading || isAuthenticated) {
      return
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      })
    }
    fn()
  }, [loading, isAuthenticated, loginWithRedirect, path])

  const render = props => (isAuthenticated === true ? <Component {...props} /> : null)

  return <Route path={path} render={render} {...rest} />
}
