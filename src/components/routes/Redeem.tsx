import { useAuth0 } from '@auth0/auth0-react'
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
import { RedemptionStorage } from 'utils/redemptionStorage'
import { SubscriptionApi } from '../../api/subscriptionApi'

const Navbar = lazy(() => import('components/page/navbar'))

const queryRedemption = (): { giftId: string; userId: string } | null => {
  const cached = RedemptionStorage.get()
  if (cached) return cached

  const { redeem, referrer } = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  return isString(redeem) && isString(referrer) ? { giftId: redeem, userId: referrer } : null
}

const cacheQueryRedemption = () => {
  const { redeem, referrer } = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  if (isString(redeem) && isString(referrer)) RedemptionStorage.set(redeem, referrer)
}

const Redeem = () => {
  const { isLoading, user } = useAuth0()
  const { getSubscription, isActive } = useSubscription()
  const { theme, isDark, setLightTheme } = useTheme()

  useEffect(() => {
    logPageView()
    cacheQueryRedemption()
  }, [])

  useEffect(() => {
    void getSubscription()
  }, [getSubscription])

  useEffect(() => {
    if (isDark) setLightTheme()
  }, [isDark, setLightTheme])

  if (isLoading) return <LoadingBody />
  if (isActive) return <AlreadySubscribed />

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>
      <div
        className={`container ${theme.bgColor} d-flex flex-column align-items-center justify-content-center LoadingContainer`}
      >
        <div className="col text-center">{user ? <RedeemSection /> : <Login />}</div>
      </div>
    </div>
  )
}

const Preamble = () => (
  <p>Congratulations! One of your friends has decided that you deserve a subscription to AoS Reminders!</p>
)

const RedeemSection = () => {
  const { user } = useAuth0()
  const redemption = queryRedemption()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!redemption && success) return <RedemptionSuccess />
  if (!redemption && error) return <RedemptionError error={error} showButton />
  if (!redemption) {
    return <p>We couldn&apos;t locate a subscription id. You may have arrived here via a malformed link.</p>
  }

  const handleRedeem = async (event: React.MouseEvent) => {
    event.preventDefault()
    const userName = user?.email
    if (!userName) return

    try {
      const { body } = await SubscriptionApi.redeemGift({
        giftId: redemption.giftId,
        userId: redemption.userId,
        userName,
      })
      RedemptionStorage.clear()
      if (body.error) return setError(body.error)
      if (body.success) {
        setSuccess(true)
        logEvent('Redeemed-Gift')
      }
    } catch (caught) {
      console.error(caught)
      setError('An unknown error occurred.')
    }
  }

  return (
    <div>
      {!error && !success && <Preamble />}
      {!error && !success && (
        <p>
          You&apos;re currently logged in as <strong>{user?.email}</strong>.
          <br />
          If you&apos;re ready to redeem this gifted subscription, click the button below!
        </p>
      )}
      {!error && !success && (
        <GenericButton className="btn btn-primary btn-lg" onClick={handleRedeem}>
          Redeem
        </GenericButton>
      )}
      {success && <RedemptionSuccess />}
      {error && <RedemptionError error={error} showButton />}
    </div>
  )
}

const Login = () => {
  const { login } = useLogin({ origin: 'Before-Redeem' })

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    cacheQueryRedemption()
    void login(event)
  }

  return (
    <RedemptionLogin handleClick={handleClick}>
      <Preamble />
    </RedemptionLogin>
  )
}

export default Redeem
