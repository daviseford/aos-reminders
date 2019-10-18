import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { BASE_URL, ROUTES } from 'utils/env'
import config from 'auth_config.json'
import { logClick } from 'utils/analytics'
import { navbarStyles } from 'theme/helperClasses'
import { LoadingHeader, OfflineHeader } from 'components/helpers/suspenseFallbacks'
import { LocalUserName, LocalStoredArmy, LocalFavoriteFaction, LocalSavedArmies } from 'utils/localStore'
import { useSavedArmies } from 'context/useSavedArmies'
import { useAppStatus } from 'context/useAppStatus'
import NavbarWrapper from './navbar_wrapper'
import SupportPlans from 'components/payment/plans'
import { max } from 'lodash'

const Navbar: React.FC = () => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated, logout, loading } = useAuth0()
  const { isActive, subscriptionLoading } = useSubscription()
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

  const discount = SupportPlans.some(x => x.sale) ? max(SupportPlans.map(x => x.discount_pct)) : 0

  return (
    <NavbarWrapper>
      {pathname !== ROUTES.HOME && (
        <Link to={ROUTES.HOME} className={navbarStyles.link} onClick={() => logClick('Navbar-Home')}>
          Home
        </Link>
      )}
      {isAuthenticated && pathname !== ROUTES.PROFILE && (
        <Link to={ROUTES.PROFILE} className={navbarStyles.link} onClick={() => logClick('Navbar-Profile')}>
          Profile
        </Link>
      )}
      {!isActive && pathname !== ROUTES.SUBSCRIBE && (
        <Link
          to={ROUTES.SUBSCRIBE}
          className={navbarStyles.link}
          onClick={() => logClick('Navbar-Subscribe')}
        >
          Subscribe
          {!!discount && <span className="ml-1 badge badge-pill badge-danger">{discount}% off!</span>}
        </Link>
      )}

      <button className={navbarStyles.btn} onClick={handleLoginBtn}>
        {loginBtnText}
      </button>
    </NavbarWrapper>
  )
}

export default Navbar
