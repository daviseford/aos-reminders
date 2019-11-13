import React, { useEffect, lazy, Suspense } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { logPageView, logClick } from 'utils/analytics'
import { LoadingHeader, LoadingBody } from 'components/helpers/suspenseFallbacks'
import { IUser } from 'types/user'
import { useSavedArmies } from 'context/useSavedArmies'
import { LocalRedemptionKey } from 'utils/localStore'
import qs from 'qs'
import GenericButton from 'components/input/generic_button'
import { SubscriptionApi } from 'api/subscriptionApi'

const Navbar = lazy(() => import('components/page/navbar'))

const Redeem: React.FC = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()
  const { getSubscription, isActive } = useSubscription()
  const { theme } = useTheme()

  const containerClass = `container ${theme.bgColor} d-flex flex-column align-items-center justify-content-center LoadingContainer`

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading) return <LoadingBody />
  if (isActive) return <p>You are already subscribed!</p>

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={containerClass}>
        <div className="col text-center">
          <p>
            Congratulations! One of your friends has decided that you deserve a subscription to AoS Reminders!
          </p>
          {!user && <LoginSection />}
          {user && <RedeemSection />}
        </div>
      </div>
    </div>
  )
}

const RedeemSection = () => {
  const { user }: { user: IUser } = useAuth0()
  const redeemInfo = LocalRedemptionKey.get()

  if (!redeemInfo) return null

  const { giftId, userId } = redeemInfo

  const handleClick = e => {
    e.preventDefault()
    console.log('redeem')
    SubscriptionApi.redeemGift({ giftId, userId })
  }

  return (
    <div>
      <p>
        You're currently logged in as <strong>{user.email}</strong>. If you're ready to redeem this gifted
        subscription, click the button below!
      </p>
      <GenericButton className={`btn btn-primary btn-lg`} onClick={handleClick}>
        Redeem
      </GenericButton>
    </div>
  )
}

const LoginSection = () => {
  const { handleLogin } = useSavedArmies()

  const handleClick = e => {
    e.preventDefault()
    const { redeem, referrer } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })
    LocalRedemptionKey.set(redeem, referrer)
    logClick('Redeem-CreateAccount')
    return handleLogin({ redirect_uri: window.location.href })
  }

  return (
    <div>
      <p>
        First, you're going to need to create an account and log in. Once you've done that, we'll set your
        subscription up!
      </p>
      <GenericButton className={`btn btn-primary btn-lg`} onClick={handleClick}>
        Create An Account
      </GenericButton>
    </div>
  )
}

export default Redeem
