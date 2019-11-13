import React, { useEffect, lazy, Suspense, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { FaRegFrown } from 'react-icons/fa'
import qs from 'qs'
import { useTheme } from 'context/useTheme'
import { useSavedArmies } from 'context/useSavedArmies'
import { SubscriptionApi } from 'api/subscriptionApi'
import { logPageView, logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import { LocalRedemptionKey } from 'utils/localStore'
import { LoadingHeader, LoadingBody } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { ContactComponent } from 'components/page/contact'
import { IUser } from 'types/user'

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
  const [error, setError] = useState(false)

  if (!redeemInfo) return null

  const { giftId, userId } = redeemInfo

  const handleClickRedeem = async e => {
    try {
      e.preventDefault()
      const { body } = await SubscriptionApi.redeemGift({ giftId, userId, userName: user.email })
      if (body.success) setSuccess(true)
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  const handleClickSuccess = () => {
    window.location.replace(ROUTES.PROFILE)
  }

  return (
    <div>
      <p>
        You're currently logged in as <strong>{user.email}</strong>. If you're ready to redeem this gifted
        subscription, click the button below!
      </p>
      {success && (
        <GenericButton className={`btn btn-success btn-lg`} onClick={handleClickSuccess}>
          Done! Take me to my Profile!
        </GenericButton>
      )}

      {!error && !success && (
        <GenericButton className={`btn btn-primary btn-lg`} onClick={handleClickRedeem}>
          Redeem
        </GenericButton>
      )}

      {error && (
        <GenericButton className={`btn btn-danger btn-lg`}>
          Error!
          <FaRegFrown className="ml-2" />
        </GenericButton>
      )}
      {error && (
        <>
          <p className="pt-3">We're sorry. There was an error redeeming your subscription.</p>
          <p>If you continue to receive this error, please get in contact with us using the links below.</p>
        </>
      )}
      {error && (
        <div className="row text-center pt-2 pb-3">
          <div className="col">
            <ContactComponent size="small" />
          </div>
        </div>
      )}
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
