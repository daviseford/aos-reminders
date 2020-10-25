import { useAuth0 } from '@auth0/auth0-react'
import { SubscriptionApi } from 'api/subscriptionApi'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { RedemptionError, RedemptionLogin, RedemptionSuccess } from 'components/page/redemption'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { isString } from 'lodash'
import qs from 'qs'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { logEvent, logPageView } from 'utils/analytics'
import useLogin from 'utils/hooks/useLogin'
import { LocalRedemptionKey } from 'utils/localStore'

const Navbar = lazy(() => import(/* webpackChunkName: "Navbar" */ 'components/page/navbar'))

/**
 * This Route is used for coupon code redemption
 */
const Redeem = () => {
  const { isLoading, user } = useAuth0()
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
  if (isLoading) return <LoadingBody />
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

  if (redeem && referrer && isString(redeem) && isString(referrer)) {
    return { giftId: redeem, userId: referrer }
  }

  return null
}

const RedeemSection = () => {
  const { user } = useAuth0()
  const redeemInfo = getRedemptionInfo()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!redeemInfo && success) return <RedemptionSuccess />
  if (!redeemInfo && error) return <RedemptionError error={error} showButton={true} />
  if (!redeemInfo) return <NoKeyFound />

  const { giftId, userId } = redeemInfo

  const handleClickRedeem = async (e: React.MouseEvent) => {
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
          You're currently logged in as <strong>{user.email}</strong>.
          <br />
          If you're ready to redeem this gifted subscription, click the button below!
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
  if (redeem && referrer && isString(redeem) && isString(referrer)) {
    LocalRedemptionKey.set(redeem, referrer)
  }
}
const Login = () => {
  const { login } = useLogin({ origin: 'Before-Redeem' })

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setLocalRedemptionKey()
    login()
  }

  return (
    <RedemptionLogin handleClick={handleClick}>
      <Preamble />
    </RedemptionLogin>
  )
}

export default Redeem
