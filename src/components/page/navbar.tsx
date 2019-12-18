import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { FaDice } from 'react-icons/fa'
import { max } from 'lodash'
import config from 'auth_config.json'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { navbarStyles } from 'theme/helperClasses'
import { BASE_URL, ROUTES } from 'utils/env'
import { logClick } from 'utils/analytics'
import { LocalFavoriteFaction, LocalSavedArmies, LocalTheme, LocalUserName } from 'utils/localStore'
import { componentWithSize } from 'utils/mapSizesToProps'
import { LoadingHeader, OfflineHeader } from 'components/helpers/suspenseFallbacks'
import { SubscriptionPlans } from 'utils/plans'
import NavbarWrapper from 'components/page/navbar_wrapper'

const Navbar: React.FC = componentWithSize(({ isTinyMobile = false }) => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated, logout, loading, loginWithRedirect } = useAuth0()
  const { isActive, subscriptionLoading } = useSubscription()
  const { pathname } = window.location
  const loginBtnText = !isAuthenticated ? `Log in` : `Log out`

  const handleLoginBtn = () => {
    if (isAuthenticated) {
      logClick('Navbar-Logout')
      LocalFavoriteFaction.clear() // Get rid of any existing local favoriteFaction value
      LocalUserName.clear() // Get rid of stored user info
      LocalSavedArmies.clear() // Remove any saved armies that we've fetched from the API
      LocalTheme.clear() // Revert back to default theme settings
      return logout({ client_id: config.clientId, returnTo: BASE_URL })
    } else {
      logClick('Navbar-Login')
      return loginWithRedirect()
    }
  }

  if (isOffline) return <OfflineHeader />
  if (loading || subscriptionLoading) return <LoadingHeader />

  const discount = SubscriptionPlans.some(x => x.sale) ? max(SubscriptionPlans.map(x => x.discount_pct)) : 0

  return (
    <NavbarWrapper>
      {pathname !== ROUTES.HOME && (
        <Link to={ROUTES.HOME} className={navbarStyles.link} onClick={() => logClick('Navbar-Home')}>
          Home
        </Link>
      )}
      {pathname === ROUTES.HOME && (
        <Link to={ROUTES.GAMEMODE} className={navbarStyles.link} onClick={() => logClick('Navbar-Game-Mode')}>
          <FaDice className="mr-2" />
          Play!
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
          {!!discount && !isTinyMobile && (
            <span className="ml-1 badge badge-pill badge-danger">{discount}% off!</span>
          )}
        </Link>
      )}

      <button className={navbarStyles.btn} onClick={handleLoginBtn}>
        {loginBtnText}
      </button>
    </NavbarWrapper>
  )
})

export default Navbar
