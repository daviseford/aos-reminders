import React, { useEffect, lazy, Suspense, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { SubscriptionApi } from 'api/subscriptionApi'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { logPageView, logClick, logEvent } from 'utils/analytics'
import { LocalCouponKey } from 'utils/localStore'
import { LoadingHeader, LoadingBody } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { RedemptionError, RedemptionLogin, RedemptionSuccess } from 'components/page/redemption'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { IUser } from 'types/user'

const Navbar = lazy(() => import('components/page/navbar'))

/**
 * This Route is used for coupon code redemption
 */
const Join: React.FC = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()
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

const Preamble = () => <p>Congratulations!</p>

const RedeemSection = () => {
  const { user }: { user: IUser } = useAuth0()
  const [couponId, setCouponId] = useState<string | null>(LocalCouponKey.get() || null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!couponId && success) return <RedemptionSuccess />
  if (!couponId && error) return <RedemptionError error={error} />
  if (!couponId) return <NoKeyFound />

  const handleClickRedeem = async e => {
    try {
      e.preventDefault()
      const { body } = await SubscriptionApi.redeemCoupon({ couponId, userName: user.email })
      LocalCouponKey.clear()
      if (body.error) return setError(body.error)
      if (body.success) {
        setSuccess(true)
        logEvent(`Redeemed-Coupon`)
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
          You're currently logged in as <strong>{user.email}</strong>. If you're ready to redeem this coupon
          code, click the button below!
        </p>
      )}

      {!error && !success && (
        <GenericButton className={`btn btn-primary btn-lg`} onClick={handleClickRedeem}>
          Redeem
        </GenericButton>
      )}

      {success && <RedemptionSuccess />}
      {error && <RedemptionError error={error} />}
    </div>
  )
}

const Login = () => {
  const { loginWithRedirect } = useAuth0()

  const handleClick = e => {
    e.preventDefault()
    LocalCouponKey.get()
    logClick('Login-Before-Coupon')
    return loginWithRedirect({ redirect_uri: window.location.href })
  }

  return (
    <RedemptionLogin handleClick={handleClick}>
      <Preamble />
    </RedemptionLogin>
  )
}

export default Join
