import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { BASE_URL } from 'utils/env'
import config from 'auth_config.json'

export const NavBar: React.FC<{}> = () => {
  const { isAuthenticated, loginWithRedirect, logout, loading } = useAuth0()
  const { isSubscribed, subscriptionLoading } = useSubscription()
  const { pathname } = window.location

  const styles = {
    btn: `btn btn btn-outline-light btn-sm mx-2`,
    header: `ThemeDarkBg pt-2 d-print-none d-flex justify-content-center align-items-center`,
    link: `font-weight-bold text-light mx-2`,
  }
  const loginBtnText = !isAuthenticated ? `Log in` : `Log out`

  const handleLogin = () => {
    if (isAuthenticated) {
      return logout({ client_id: config.clientId, returnTo: BASE_URL })
    } else {
      return loginWithRedirect()
    }
  }

  if (loading || subscriptionLoading) {
    return <header className={styles.header}></header>
  }

  return (
    <header className={styles.header}>
      <div className="flex-grow-1"></div>
      <div>
        {isAuthenticated && (
          <>
            {pathname !== '/' && (
              <Link to="/" className={styles.link}>
                Home
              </Link>
            )}
            {pathname !== '/profile' && (
              <Link to="/profile" className={styles.link}>
                Profile
              </Link>
            )}
          </>
        )}
        {!isSubscribed && pathname !== '/subscribe' && (
          <Link to="/subscribe" className={styles.link}>
            Subscribe
          </Link>
        )}

        <button className={styles.btn} onClick={handleLogin}>
          {loginBtnText}
        </button>
      </div>
    </header>
  )
}
