import { useAuth0 } from '@auth0/auth0-react'
import { SubscriptionApi } from 'api/subscriptionApi'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { RedemptionError, RedemptionLogin, RedemptionSuccess } from 'components/page/redemption'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { logEvent, logPageView } from 'utils/analytics'
import useLogin from 'utils/hooks/useLogin'

const Navbar = lazy(() => import('components/page/navbar'))

/**
 * This Route is used for coupon code redemption
 */
const Join = () => {
  const { isLoading, user } = useAuth0()
  const { getSubscription, isActive } = useSubscription()
  const { theme, isDark, setLightTheme } = useTheme()

  const containerClass = `container ${theme.bgColor} d-flex flex-column align-items-center justify-content-center LoadingContainer`

  useEffect(() => {
    logPageView()
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

const Preamble = () => <p>Congratulations! We'll help you redeem your coupon code ASAP!</p>

const RedeemSection = () => {
  const { user } = useAuth0()
  const [couponId, setCouponId] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!couponId && success) return <RedemptionSuccess />
  if (!couponId && error) return <RedemptionError error={error} showButton={false} />

  const handleChange = e => {
    const val = e.target.value
    setCouponId(val || null)
  }

  const handleClickRedeem = async e => {
    try {
      e.preventDefault()
      if (!couponId) return
      const { body } = await SubscriptionApi.redeemCoupon({ couponId, userName: user.email })
      if (body.error) {
        setError(body.error)
      } else {
        logEvent(`Redeemed-Coupon`)
        setError('')
        setSuccess(true)
      }
    } catch (err) {
      console.error(err)
      return setError('An unknown error occurred.')
    }
  }

  return (
    <div>
      {!success && (
        <p>
          You're currently logged in as <strong>{user.email}</strong>.
          <br />
          <br />
          If you're ready to redeem your coupon code, just enter it below.
        </p>
      )}

      {!success && (
        <div className={`row justify-content-center pb-3`}>
          <div className={`col col-md-6 col-xl-3`}>
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="ABC_123"
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {!success && couponId && couponId.length >= 7 && (
        <GenericButton className={`btn btn-primary btn-lg`} onClick={handleClickRedeem}>
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
