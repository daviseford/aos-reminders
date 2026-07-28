import { useAuth0 } from '@auth0/auth0-react'
import { LoadingHeader, OfflineHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import NavbarWrapper from 'components/page/navbar_wrapper'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { max } from 'lodash'
import { Link } from 'react-router-dom'
import { navbarStyles } from 'theme/helperClasses'
import { logClick } from 'utils/analytics'
import { BASE_URL, ROUTES } from 'utils/env'
import useLogin from 'utils/hooks/useLogin'
import useWindowSize from 'utils/hooks/useWindowSize'
import { SubscriptionPlans } from 'utils/plans'
import config from '../../auth_config.json'

const Navbar = () => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated, logout } = useAuth0()
  const { login, isLoggingIn } = useLogin({ origin: 'Navbar' })
  const { isActive, subscriptionError, subscriptionLoading } = useSubscription()
  const { isTinyMobile } = useWindowSize()
  const { pathname } = window.location
  const loginBtnText = !isAuthenticated ? 'Log in' : 'Log out'

  const handleLoginBtn = () => {
    if (isAuthenticated) {
      logClick('Navbar-Logout')
      localStorage.removeItem('theme')
      return logout({ clientId: config.clientId, logoutParams: { returnTo: BASE_URL } })
    }
    return login()
  }

  if (isOffline) return <OfflineHeader />
  if (isLoggingIn || subscriptionLoading) return <LoadingHeader />

  const discount = SubscriptionPlans.some(plan => plan.sale)
    ? max(SubscriptionPlans.map(plan => plan.discount_pct || 0))
    : 0

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
      {!isActive && !subscriptionError && pathname !== ROUTES.SUBSCRIBE && (
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
      {pathname !== ROUTES.FAQ && (
        <Link to={ROUTES.FAQ} className={navbarStyles.link} onClick={() => logClick('Navbar-Faq')}>
          FAQ
        </Link>
      )}
      <GenericButton className={navbarStyles.btn} onClick={handleLoginBtn}>
        {loginBtnText}
      </GenericButton>
    </NavbarWrapper>
  )
}

export default Navbar
