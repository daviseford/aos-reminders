import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { BASE_URL } from 'utils/env'
import config from 'auth_config.json'
import { logClick } from 'utils/analytics'
import { headerClass } from 'theme/helperClasses'
import { EmptyHeader } from 'components/helpers/suspenseFallbacks'
import { setLocalFavorite, clearStoredArmy } from 'utils/localStore'
import { useSavedArmies } from 'context/useSavedArmies'

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, loading } = useAuth0()
  const { isSubscribed, isActive, subscriptionLoading } = useSubscription()
  const { handleLogin } = useSavedArmies()
  const { pathname } = window.location

  const styles = {
    btn: `btn btn btn-outline-light btn-sm mx-2`,
    link: `font-weight-bold text-light mx-2`,
  }
  const loginBtnText = !isAuthenticated ? `Log in` : `Log out`

  const handleLoginBtn = () => {
    if (isAuthenticated) {
      logClick('Navbar-Logout')
      setLocalFavorite(null) // Get rid of any existing local favoriteFaction value
      clearStoredArmy() // Remove stored army from redirect if it exists
      return logout({ client_id: config.clientId, returnTo: BASE_URL })
    } else {
      logClick('Navbar-Login')
      return handleLogin()
    }
  }

  if (loading || subscriptionLoading) return <EmptyHeader />

  return (
    <header className={headerClass}>
      <div className="flex-grow-1"></div>
      <div>
        {pathname !== '/' && (
          <Link to="/" className={styles.link} onClick={() => logClick('Navbar-Home')}>
            Home
          </Link>
        )}
        {isAuthenticated && pathname !== '/profile' && (
          <Link to="/profile" className={styles.link} onClick={() => logClick('Navbar-Profile')}>
            Profile
          </Link>
        )}
        {(!isSubscribed || (isSubscribed && !isActive)) && pathname !== '/subscribe' && (
          <Link to="/subscribe" className={styles.link} onClick={() => logClick('Navbar-Subscribe')}>
            Subscribe
          </Link>
        )}

        <button className={styles.btn} onClick={handleLoginBtn}>
          {loginBtnText}
        </button>
      </div>
    </header>
  )
}

export default Navbar
