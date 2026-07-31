import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { RedemptionError, RedemptionLogin, RedemptionSuccess } from 'components/page/redemption'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { logAccountAction } from 'utils/analytics'
import { useApiAccessToken } from 'utils/authToken'
import useLogin from 'utils/hooks/useLogin'
import { SubscriptionApi } from '../../api/subscriptionApi'

const Navbar = lazy(() => import('components/page/navbar'))

/**
 * The shortest code the form will submit — the same length the Redeem button used to appear at. The
 * API is the authority on what a real coupon looks like; this only keeps an obvious typo from
 * costing a round trip.
 */
const MIN_COUPON_LENGTH = 7

const Join = () => {
  const { isLoading, user } = useAuth0()
  const { getSubscription, isActive } = useSubscription()
  const { theme, isDark, setLightTheme } = useTheme()

  useEffect(() => {
    void getSubscription()
  }, [getSubscription])

  useEffect(() => {
    if (isDark) setLightTheme()
  }, [isDark, setLightTheme])

  if (isLoading) return <LoadingBody />
  if (isActive) return <AlreadySubscribed />

  return (
    <div className={`d-block ${theme.bgColor} ${theme.text}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>
      <div className={`container ${theme.bgColor} RedemptionContainer py-5`}>
        <div className="row justify-content-center">
          {/*
            A real .col inside a .row: RedemptionError renders a .row of contact links, and a row
            whose parent carries no gutter padding overhangs it by 15px a side.
          */}
          <div className="col RedemptionColumn text-center">
            {/*
              The page's only <h1> — /join rendered no heading at all — and it stays put across the
              login, form, success, and error views so the four states read as one page rather than
              four unrelated screens. Sized at h2, matching /subscribe's.
            */}
            <h1 className="h2 mb-3">Redeem your coupon</h1>
            {user ? <RedeemSection /> : <Login />}
          </div>
        </div>
      </div>
    </div>
  )
}

const Preamble = () => (
  <p className="lead">Congratulations! We&apos;ll help you redeem your coupon code ASAP!</p>
)

const RedeemSection = () => {
  const { user } = useAuth0()
  const getAccessToken = useApiAccessToken()
  const [couponId, setCouponId] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Pasted codes routinely carry a trailing space, which the API can only reject.
  const code = couponId.trim()
  // The email is the account key the API redeems against, so without one the button cannot work —
  // and an enabled button that silently does nothing is worse than a disabled one.
  const canRedeem = code.length >= MIN_COUPON_LENGTH && !!user?.email && !isRedeeming

  const handleRedeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canRedeem) return

    setIsRedeeming(true)
    try {
      const token = await getAccessToken()
      const { body } = await SubscriptionApi.redeemCoupon({ couponId: code }, token)
      if (body.error) {
        setError(body.error)
      } else {
        logAccountAction('coupon_redeemed')
        setError('')
        setSuccess(true)
      }
    } catch (caught) {
      console.error(caught)
      setError('An unknown error occurred.')
    } finally {
      setIsRedeeming(false)
    }
  }

  if (success) return <RedemptionSuccess />

  return (
    <>
      {/*
        Two sentences, two paragraphs. They were one paragraph split by a <br />, which `balance`
        treats as a single block and wraps worse than no balancing at all.
      */}
      <p className="lead mb-1">
        You&apos;re currently logged in as <strong>{user?.email || ''}</strong>.
      </p>
      <p className="lead">If you&apos;re ready to redeem your coupon code, just enter it below.</p>
      {/*
        A real <form>, so the phone keyboard's Go key submits. The field was a bare input with a
        placeholder standing in for its label, and pressing Enter did nothing.
      */}
      <form onSubmit={handleRedeem}>
        <div className="mb-3 RedemptionCodeField mx-auto">
          <label className="mb-1" htmlFor="coupon-code">
            Coupon code
          </label>
          <input
            // Mobile keyboards capitalise the first character, silently mangling the code.
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="form-control form-control-lg text-center"
            enterKeyHint="go"
            id="coupon-code"
            onChange={event => {
              setCouponId(event.target.value)
              // The error belongs to the code that produced it.
              setError('')
            }}
            placeholder="ABC_123"
            spellCheck={false}
            type="text"
            value={couponId}
          />
        </div>
        {/*
          Mounted and disabled rather than absent: the button used to appear only once the code was
          long enough, so a short code left the page with no visible way forward and nothing to
          explain why. Disabling it while the request is in flight stops a double redemption.
        */}
        <GenericButton className="btn btn-primary btn-lg" disabled={!canRedeem} type="submit">
          {isRedeeming ? (
            <>
              <span aria-hidden="true" className="spinner-border spinner-border-sm me-2" role="status" />
              Redeeming
            </>
          ) : (
            'Redeem'
          )}
        </GenericButton>
      </form>
      {error && <RedemptionError error={error} showButton={false} />}
    </>
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
