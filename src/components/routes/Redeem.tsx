import React, { useEffect, lazy, Suspense, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { FaRegFrown, FaRegSmileBeam } from 'react-icons/fa'
import qs from 'qs'
import { useTheme } from 'context/useTheme'
import { useSavedArmies } from 'context/useSavedArmies'
import { SubscriptionApi } from 'api/subscriptionApi'
import { logPageView, logClick, logEvent } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import { LocalRedemptionKey } from 'utils/localStore'
import { LoadingHeader, LoadingBody } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { ContactComponent } from 'components/page/contact'
import { IUser } from 'types/user'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'

const Navbar = lazy(() => import('components/page/navbar'))

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
          {!user && <LoginSection />}
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
  const localInfo = LocalRedemptionKey.get()
  if (localInfo && localInfo.giftId) return localInfo

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

  if (!redeemInfo && success) return <Success />
  if (!redeemInfo && error) return <Error error={error} />
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

      {success && <Success />}
      {error && <Error error={error} />}
    </div>
  )
}

const NoKeyFound = () => (
  <p>We couldn't locate a subscription id. You may have arrived here via a malformed link.</p>
)

const Success = () => {
  const handleClickSuccess = () => {
    window.location.replace(ROUTES.PROFILE)
  }

  return (
    <>
      <h5>Woohoo! You're all set!</h5>

      <h2>
        <FaRegSmileBeam />
      </h2>

      <GenericButton className={`btn btn-success btn-lg`} onClick={handleClickSuccess}>
        Take me to my Profile!
      </GenericButton>
    </>
  )
}

const Error = ({ error }: { error: string }) => {
  return (
    <>
      <GenericButton className={`btn btn-danger btn-lg`} disabled>
        Error!
        <FaRegFrown className="ml-2" />
      </GenericButton>

      <p className="pt-3">We're sorry. There was an error redeeming your subscription.</p>
      <p>
        <code>{error}</code>
      </p>
      <p>If you continue to receive this error, please get in contact with us using the links below.</p>

      <div className="row text-center pt-2 pb-3">
        <div className="col">
          <ContactComponent size="small" />
        </div>
      </div>
    </>
  )
}

const setLocalRedemptionKey = () => {
  const { redeem, referrer } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })
  if (redeem && referrer) {
    LocalRedemptionKey.set(redeem, referrer)
  }
}
const LoginSection = () => {
  const { handleLogin } = useSavedArmies()

  const handleClick = e => {
    e.preventDefault()
    setLocalRedemptionKey()
    logClick('Login-Before-Redeem')
    return handleLogin({ redirect_uri: window.location.href })
  }

  return (
    <div>
      <Preamble />
      <p>
        First, you're going to need to create an account and log in. Once you've done that, we'll set your
        subscription up!
      </p>
      <GenericButton className={`btn btn-primary btn-lg`} onClick={handleClick}>
        Log In / Sign Up
      </GenericButton>
    </div>
  )
}

export default Redeem
