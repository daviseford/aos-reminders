import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'

/**
 * TODO: https://github.com/auth0/auth0-react#protect-a-route
 * https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app
 * @param param0
 */
export const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      })
    }
    fn()
  }, [isLoading, isAuthenticated, loginWithRedirect, path])

  const render = props => (isAuthenticated === true ? <Component {...props} /> : null)

  return <Route path={path} render={render} {...rest} />
}

// import { withAuthenticationRequired } from '@auth0/auth0-react';

// const PrivateRoute = () => <div>Private</div>;

// export default withAuthenticationRequired(PrivateRoute, {
//   // Show a message while the user waits to be redirected to the login page.
//   onRedirecting: () => <div>Redirecting you to the login page...</div>,
// });
