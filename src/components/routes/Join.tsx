import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { RedemptionError, RedemptionLogin, RedemptionSuccess } from 'components/page/redemption'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { logEvent, logPageView } from 'utils/analytics'
import useLogin from 'utils/hooks/useLogin'
import { SubscriptionApi } from '../../api/subscriptionApi'

const Navbar = lazy(() => import('components/page/navbar'))

const Join = () => {
  const { isLoading, user } = useAuth0()
  const { getSubscription, isActive } = useSubscription()
  const { theme, isDark, setLightTheme } = useTheme()

  useEffect(() => {
    logPageView()
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

const Preamble = () => <p>Congratulations! We&apos;ll help you redeem your coupon code ASAP!</p>

const RedeemSection = () => {
  const { user } = useAuth0()
  const [couponId, setCouponId] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!couponId && success) return <RedemptionSuccess />
  if (!couponId && error) return <RedemptionError error={error} showButton={false} />

  const handleRedeem = async (event: React.MouseEvent) => {
    event.preventDefault()
    const userName = user?.email
    if (!couponId || !userName) return

    try {
      const { body } = await SubscriptionApi.redeemCoupon({ couponId, userName })
      if (body.error) {
        setError(body.error)
      } else {
        logEvent('Redeemed-Coupon')
        setError('')
        setSuccess(true)
      }
    } catch (caught) {
      console.error(caught)
      setError('An unknown error occurred.')
    }
  }

  return (
    <div>
      {!success && (
        <p>
          You&apos;re currently logged in as <strong>{user?.email || ''}</strong>.
          <br />
          <br />
          If you&apos;re ready to redeem your coupon code, just enter it below.
        </p>
      )}
      {!success && (
        <div className="row justify-content-center pb-3">
          <div className="col col-md-6 col-xl-3">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="ABC_123"
              onChange={event => setCouponId(event.target.value || null)}
            />
          </div>
        </div>
      )}
      {!success && couponId && couponId.length >= 7 && (
        <GenericButton className="btn btn-primary btn-lg" onClick={handleRedeem}>
          Redeem
        </GenericButton>
      )}
      {success && <RedemptionSuccess />}
      {error && <RedemptionError error={error} showButton={false} />}
    </div>
  )
}

const Login = () => {
  const { login } = useLogin({ origin: 'Before-Coupon' })
  return (
    <RedemptionLogin handleClick={login}>
      <Preamble />
    </RedemptionLogin>
  )
}

export default Join
