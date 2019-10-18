import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { BASE_URL } from 'utils/env'
import config from 'auth_config.json'
import { logClick } from 'utils/analytics'
import { navbarStyles } from 'theme/helperClasses'
import { LoadingHeader, OfflineHeader } from 'components/helpers/suspenseFallbacks'
import { LocalUserName, LocalStoredArmy, LocalFavoriteFaction, LocalSavedArmies } from 'utils/localStore'
import { useSavedArmies } from 'context/useSavedArmies'
import { useAppStatus } from 'context/useAppStatus'
import NavbarWrapper from './navbar_wrapper'

const Navbar: React.FC = () => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated, logout, loading } = useAuth0()
  const { isSubscribed, isActive, subscriptionLoading } = useSubscription()
  const { handleLogin } = useSavedArmies()
  const { pathname } = window.location
  const loginBtnText = !isAuthenticated ? `Log in` : `Log out`

  const handleLoginBtn = () => {
    if (isAuthenticated) {
      logClick('Navbar-Logout')
      LocalFavoriteFaction.clear() // Get rid of any existing local favoriteFaction value
      LocalUserName.clear() // Get rid of stored user info
      LocalStoredArmy.clear() // Remove stored army (saved for post-login redirect) if it exists
      LocalSavedArmies.clear() // Remove any saved armies that we've fetched from the API
      return logout({ client_id: config.clientId, returnTo: BASE_URL })
    } else {
      logClick('Navbar-Login')
      return handleLogin()
    }
  }

  if (isOffline) return <OfflineHeader />
  if (loading || subscriptionLoading) return <LoadingHeader />

  return (
    <NavbarWrapper>
      {pathname !== '/' && (
        <Link to="/" className={navbarStyles.link} onClick={() => logClick('Navbar-Home')}>
          Home
        </Link>
      )}
      {isAuthenticated && pathname !== '/profile' && (
        <Link to="/profile" className={navbarStyles.link} onClick={() => logClick('Navbar-Profile')}>
          Profile
        </Link>
      )}
      {(!isSubscribed || (isSubscribed && !isActive)) && pathname !== '/subscribe' && (
        <Link to="/subscribe" className={navbarStyles.link} onClick={() => logClick('Navbar-Subscribe')}>
          Subscribe
        </Link>
      )}

      <button className={navbarStyles.btn} onClick={handleLoginBtn}>
        {loginBtnText}
      </button>
    </NavbarWrapper>
  )
}

export default Navbar
