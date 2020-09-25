import { useAuth0 } from '@auth0/auth0-react'
import config from 'auth_config.json'
import { LoadingHeader, OfflineHeader } from 'components/helpers/suspenseFallbacks'
import NavbarWrapper from 'components/page/navbar_wrapper'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { max } from 'lodash'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { navbarStyles } from 'theme/helperClasses'
import { logClick } from 'utils/analytics'
import { BASE_URL, ROUTES } from 'utils/env'
import useWindowSize from 'utils/hooks/useWindowSize'
import { LocalFavoriteFaction, LocalSavedArmies, LocalTheme, LocalUserName } from 'utils/localStore'
import openPopup from 'utils/openPopup'
import { SubscriptionPlans } from 'utils/plans'

const Navbar = () => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated, logout, isLoading, loginWithPopup } = useAuth0()
  const { isActive, subscriptionLoading } = useSubscription()
  const { isTinyMobile } = useWindowSize()
  const [loginPopupIsClosed, setLoginPopupIsClosed] = useState(false)

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

      const popup = openPopup()
      setLoginPopupIsClosed(false)

      // https://stackoverflow.com/a/48240128
      const timer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(timer)
          setLoginPopupIsClosed(true)
        }
      }, 1000)

      return loginWithPopup({}, { popup })
    }
  }

  if (isOffline) return <OfflineHeader />
  if ((isLoading && !loginPopupIsClosed) || subscriptionLoading) return <LoadingHeader />

  const discount = SubscriptionPlans.some(x => x.sale) ? max(SubscriptionPlans.map(x => x.discount_pct)) : 0

  return (
    <NavbarWrapper>
      {pathname !== ROUTES.HOME && (
        <Link to={ROUTES.HOME} className={navbarStyles.link} onClick={() => logClick('Navbar-Home')}>
          Home
        </Link>
      )}
      {pathname !== ROUTES.STATS && (
        <Link to={ROUTES.STATS} className={navbarStyles.link} onClick={() => logClick('Navbar-Stats')}>
          Stats
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
}

export default Navbar
