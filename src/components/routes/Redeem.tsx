import React, { useEffect, lazy, Suspense, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import qs from 'qs'
import { SubscriptionApi } from 'api/subscriptionApi'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { logPageView, logClick, logEvent } from 'utils/analytics'
import { LocalRedemptionKey } from 'utils/localStore'
import { LoadingHeader, LoadingBody } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { RedemptionError, RedemptionLogin, RedemptionSuccess } from 'components/page/redemption'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { IUser } from 'types/user'

const Navbar = lazy(() => import('components/page/navbar'))

/**
 * This Route is used for coupon code redemption
 */
const Redeem: React.FC = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()
  const { getSubscription, isActive } = useSubscription()
  const { theme, isDark, setLightTheme } = useTheme()

  const containerClass = `container ${theme.bgColor} d-flex flex-column align-items-center justify-content-center LoadingContainer`

  useEffect(() => {
    logPageView()
    setLocalRedemptionKey()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (isDark) setLightTheme()
  if (loading) return <LoadingBody />
  if (isActive) return <AlreadySubscribed />

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={containerClass}>
        <div className="col text-center">
          {!user && <Login />}
          {user && <RedeemSection />}
        </div>
      </div>
    </div>
  )
}

const Preamble = () => (
  <p>Congratulations! One of your friends has decided that you deserve a subscription to AoS Reminders!</p>
)

const getRedemptionInfo = (): { giftId: string; userId: string } | null => {
  const redeemInfo = LocalRedemptionKey.get()
  if (redeemInfo && redeemInfo.giftId) return redeemInfo

  const { redeem, referrer } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })

  if (redeem && referrer) {
    return { giftId: redeem, userId: referrer }
  }

  return null
}

const RedeemSection = () => {
  const { user }: { user: IUser } = useAuth0()
  const redeemInfo = getRedemptionInfo()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!redeemInfo && success) return <RedemptionSuccess />
  if (!redeemInfo && error) return <RedemptionError error={error} showButton={true} />
  if (!redeemInfo) return <NoKeyFound />

  const { giftId, userId } = redeemInfo

  const handleClickRedeem = async e => {
    try {
      e.preventDefault()
      const { body } = await SubscriptionApi.redeemGift({ giftId, userId, userName: user.email })
      LocalRedemptionKey.clear()
      if (body.error) return setError(body.error)
      if (body.success) {
        setSuccess(true)
        logEvent(`Redeemed-Gift`)
      }
    } catch (err) {
      console.error(err)
      setError('An unknown error occurred.')
    }
  }

  return (
    <div>
      {!error && !success && <Preamble />}
      {!error && !success && (
        <p>
          You're currently logged in as <strong>{user.email}</strong>. If you're ready to redeem this gifted
          subscription, click the button below!
        </p>
      )}

      {!error && !success && (
        <GenericButton className={`btn btn-primary btn-lg`} onClick={handleClickRedeem}>
          Redeem
        </GenericButton>
      )}

      {success && <RedemptionSuccess />}
      {error && <RedemptionError error={error} showButton={true} />}
    </div>
  )
}

const NoKeyFound = () => (
  <p>We couldn't locate a subscription id. You may have arrived here via a malformed link.</p>
)

const setLocalRedemptionKey = () => {
  const { redeem, referrer } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })
  if (redeem && referrer) {
    LocalRedemptionKey.set(redeem, referrer)
  }
}
const Login = () => {
  const { loginWithRedirect } = useAuth0()

  const handleClick = e => {
    e.preventDefault()
    setLocalRedemptionKey()
    logClick('Login-Before-Redeem')
    return loginWithRedirect({ redirect_uri: window.location.href })
  }

  return (
    <RedemptionLogin handleClick={handleClick}>
      <Preamble />
    </RedemptionLogin>
  )
}

export default Redeem
