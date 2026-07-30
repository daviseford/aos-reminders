import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import Contact from 'components/page/contact'
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
    <div className={`d-block ${theme.bgColor} ${theme.text}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>
      <div className={`container ${theme.bgColor} RedemptionContainer py-5`}>
        <div className="row justify-content-center">
          {/*
            A real .col inside a .row: the error and missing-link states render a .row of contact
            links, and a row whose parent carries no gutter padding overhangs it by 15px a side.
          */}
          <div className="col RedemptionColumn text-center">
            {/*
              The page's only <h1> — /redeem rendered no heading at all — and it stays put across the
              login, confirm, success, error, and missing-link views so they read as one page rather
              than five unrelated screens. Sized at h2, matching /subscribe's.
            */}
            <h1 className="h2 mb-3">Redeem your gift</h1>
            {user ? <RedeemSection /> : <Login />}
          </div>
        </div>
      </div>
    </div>
  )
}

const Preamble = () => (
  <p className="lead">
    Congratulations! One of your friends has decided that you deserve a subscription to AoS Reminders!
  </p>
)

/*
 * A dead end in the incumbent: the message named the problem and offered nothing to do about it.
 * The contact row is the same recovery the error path already gives.
 */
const MissingRedemption = () => (
  <>
    <p className="lead">
      We couldn&apos;t locate a subscription id. You may have arrived here via a malformed link.
    </p>
    <div className="row text-center pt-2 pb-3">
      <div className="col">
        <Contact size="small" />
      </div>
    </div>
  </>
)

const RedeemSection = () => {
  const { user } = useAuth0()
  /*
   * Captured once. It used to be re-read on every render while handleRedeem cleared the cache
   * mid-flow, so what the page believed it was holding depended on when it last re-rendered — and a
   * response carrying neither `error` nor `success` could land the user on "malformed link" after a
   * gift had already been spent.
   */
  const [redemption] = useState(queryRedemption)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // The email is the account key the API redeems against, so without one the button cannot work.
  const canRedeem = !!redemption && !!user?.email && !isRedeeming

  const handleRedeem = async (event: React.MouseEvent) => {
    event.preventDefault()
    const userName = user?.email
    if (!canRedeem || !redemption || !userName) return

    setIsRedeeming(true)
    try {
      const { body } = await SubscriptionApi.redeemGift({
        giftId: redemption.giftId,
        userId: redemption.userId,
        userName,
      })
      if (body.error) {
        setError(body.error)
      } else if (body.success) {
        // Cleared only once the gift is actually spent. Clearing on failure too used to throw away
        // the one copy of the id whenever the link's query string was no longer in the address bar.
        RedemptionStorage.clear()
        logEvent('Redeemed-Gift')
        setSuccess(true)
      } else {
        // A response that confirms nothing is a failure, not a silent no-op.
        setError('An unknown error occurred.')
      }
    } catch (caught) {
      console.error(caught)
      setError('An unknown error occurred.')
    } finally {
      setIsRedeeming(false)
    }
  }

  if (!redemption) return <MissingRedemption />
  if (success) return <RedemptionSuccess />
  if (error) return <RedemptionError error={error} showButton />

  return (
    <>
      <Preamble />
      {/*
        Two sentences, two paragraphs. They were one paragraph split by a <br />, which `balance`
        treats as a single block and wraps worse than no balancing at all.
      */}
      <p className="lead mb-1">
        You&apos;re currently logged in as <strong>{user?.email}</strong>.
      </p>
      <p className="lead">If you&apos;re ready to redeem this gifted subscription, click the button below!</p>
      {/* Disabled while the request is in flight, so a second click cannot spend the gift twice. */}
      <GenericButton className="btn btn-primary btn-lg" disabled={!canRedeem} onClick={handleRedeem}>
        {isRedeeming ? (
          <>
            <span aria-hidden="true" className="spinner-border spinner-border-sm me-2" role="status" />
            Redeeming
          </>
        ) : (
          'Redeem'
        )}
      </GenericButton>
    </>
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
