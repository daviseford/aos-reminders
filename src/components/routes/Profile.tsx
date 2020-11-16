import { useAuth0 } from '@auth0/auth0-react'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { SelectOne } from 'components/input/select'
import { CancelPaypalSubscriptionModal } from 'components/modals/paypal_cancellation_modal'
import { CancelStripeSubscriptionModal } from 'components/modals/stripe_cancellation_modal'
import Contact from 'components/page/contact'
import { GiftSubscriptions } from 'components/payment/giftSubscriptions'
import { useSavedArmies } from 'context/useSavedArmies'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { DateTime } from 'luxon'
import { PRIMARY_FACTIONS } from 'meta/factions'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { FaGift, FaPaypal, FaSearchDollar } from 'react-icons/fa'
import { MdCheckCircle, MdNotInterested } from 'react-icons/md'
import { Link } from 'react-router-dom'
import Switch from 'react-switch'
import { centerContentClass } from 'theme/helperClasses'
import { logClick, logPageView } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import { titleCase } from 'utils/textUtils'
import { withSelectOne } from 'utils/withSelect'

const Navbar = lazy(() => import('components/page/navbar'))

const Profile = () => {
  const { isLoading, user } = useAuth0()
  const { getSubscription } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (isLoading || !user) return <LoadingBody />

  const userCardWrapperClass = `col-12 col-md-8 col-lg-6 col-xl-6`

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={`container ${theme.bgColor} px-0`}>
        <div className="row d-flex justify-content-center">
          <div className={userCardWrapperClass}>
            <UserCard />
          </div>
        </div>
      </div>

      <GiftSubscriptions />
    </div>
  )
}

export default Profile

const UserCard = () => {
  const { isSubscribed, subscription } = useSubscription()
  const { theme } = useTheme()

  return (
    <div className={`col py-4 ${theme.text} text-center`}>
      <h1 className="text-center">Your Profile</h1>
      <FavoriteArmySelect />
      <ToggleTheme />
      <SubscriptionInfo />
      {isSubscribed && subscription.subscriptionStatus !== 'temporary_grant' && <RecurringPaymentInfo />}
      <EmailVerified />
      <Help />
    </div>
  )
}

const FavoriteArmySelect = () => {
  const { isActive } = useSubscription()
  const { favoriteFaction, updateFavoriteFaction, getFavoriteFaction } = useSavedArmies()
  const { theme } = useTheme()

  useEffect(() => {
    if (!isActive) return
    getFavoriteFaction()
  }, [getFavoriteFaction, isActive])

  const colClass = `col-12${isActive ? ` col-sm-10 col-md-8 col-lg-8 col-xxl-5 text-left` : ``}`

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>
          <div className={centerContentClass}>Favorite Faction</div>
        </h4>
      </div>

      <div className={theme.cardBody}>
        <div className={`d-flex justify-content-center`}>
          <div className={colClass}>
            {isActive ? (
              <SelectOne
                value={favoriteFaction ? titleCase(favoriteFaction) : null}
                items={PRIMARY_FACTIONS}
                setValue={withSelectOne(updateFavoriteFaction)}
                hasDefault={true}
                toTitle={true}
              />
            ) : (
              <div className="alert alert-info text-center mt-3" role="alert">
                <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick('SubscribeFavoriteFaction')}>
                  Subscribe now
                </Link>{' '}
                to save your favorite faction!
                <br />
                <small>
                  No more scrolling through the long list of armies when you visit - your favorite is
                  automatically loaded!
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CancelBtn = () => {
  const { isActive, isCanceled, createdByPaypal } = useSubscription()
  const { isLight } = useTheme()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (!isActive || isCanceled) return <></>

  const btnClass = `btn btn-sm btn${isLight ? `-outline-` : `-`}danger`

  const ModelComponent = createdByPaypal ? CancelPaypalSubscriptionModal : CancelStripeSubscriptionModal

  return (
    <>
      <GenericButton className={btnClass} onClick={openModal}>
        Cancel Subscription
      </GenericButton>
      {modalIsOpen && <ModelComponent modalIsOpen={modalIsOpen} closeModal={closeModal} />}
    </>
  )
}

const SubscriptionInfo = () => {
  const {
    hasActiveGrant,
    hasExpiredGrant,
    isActive,
    isPending,
    isSubscribed,
    subscription,
  } = useSubscription()
  const { theme } = useTheme()

  if (hasActiveGrant) return <TemporaryGrantComponent />

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>
          <div className={centerContentClass}>
            Subscription Status:{' '}
            {isActive ? (
              <MdCheckCircle className="text-success ml-2" />
            ) : (
              <MdNotInterested className="text-danger ml-2" />
            )}
          </div>
        </h4>
      </div>

      {isActive && !hasExpiredGrant && (
        <div className={theme.cardBody}>
          <h5 className="lead">
            Subscription Start:{' '}
            {DateTime.fromSeconds(subscription.subscriptionStart as number).toLocaleString(DateTime.DATE_MED)}
          </h5>
          <h5 className="lead">
            Subscription End:{' '}
            {DateTime.fromSeconds(subscription.subscriptionStart as number)
              .plus({
                [`${subscription.planInterval}s`]: subscription.planIntervalCount,
              })
              .toLocaleString(DateTime.DATE_MED)}
          </h5>
          {subscription.createdBy &&
            (subscription.createdBy === 'paypal' || subscription.createdBy === 'stripe') && (
              <h5 className="lead">Payment Method: {titleCase(subscription.createdBy)}</h5>
            )}
        </div>
      )}
      {isSubscribed && !isActive && !isPending && !hasExpiredGrant && (
        <div className={theme.cardBody}>
          <SubscriptionExpired />
        </div>
      )}
    </div>
  )
}

const TemporaryGrantComponent = () => {
  const { subscription } = useSubscription()
  const { theme } = useTheme()

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>
          <div className={centerContentClass}>
            Subscription Status: <FaSearchDollar className="text-warning ml-2" />
          </div>
        </h4>
      </div>

      <div className={theme.cardBody}>
        <div className={`${centerContentClass} row`}>
          <div className="col-12">
            <h1>
              <FaPaypal className="text-info ml-2 align-self-center" />
            </h1>
          </div>
          <div className="col-12">
            <h5 className="text-warning">Currently verifying payment via Paypal.</h5>
          </div>
        </div>

        <h5 className="lead">
          Subscription Start:{' '}
          {DateTime.fromSeconds(subscription.subscriptionStart as number).toLocaleString(DateTime.DATE_MED)}
        </h5>
        <h5 className="lead">
          Subscription End:{' '}
          {DateTime.fromSeconds(subscription.subscriptionStart as number)
            .plus({
              [`${subscription.planInterval}s`]: subscription.planIntervalCount,
            })
            .toLocaleString(DateTime.DATE_MED)}
        </h5>
        <h5 className="lead">Payment Method: Paypal</h5>
      </div>
    </div>
  )
}

const RecurringPaymentInfo = () => {
  const { isActive, isCanceled, isGifted } = useSubscription()
  const { theme } = useTheme()
  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>
          <div className={centerContentClass}>
            Recurring Payment:{' '}
            {isActive && !isCanceled ? (
              <MdCheckCircle className="text-success ml-2" />
            ) : (
              <MdNotInterested className="text-danger ml-2" />
            )}
          </div>
        </h4>
      </div>
      {isActive && !isCanceled && (
        <div className={theme.cardBody}>
          <CancelBtn />
        </div>
      )}
      {isGifted && (
        <div className={theme.cardBody}>
          <FaGift className="mr-2" />
          You were gifted this subscription!
          <FaGift className="ml-2" />
          <br />
          You may purchase a recurring subscription at the end of this period.
        </div>
      )}
    </div>
  )
}

const EmailVerified = () => {
  const { user } = useAuth0()
  const { theme } = useTheme()
  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>
          <div className={centerContentClass}>User Email:</div>
        </h4>
      </div>
      <div className={theme.cardBody}>
        <h5 className="lead">{user.email}</h5>
      </div>
    </div>
  )
}

const Help = () => {
  const { theme } = useTheme()
  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>Contact Us</h4>
      </div>
      <div className={theme.cardBody}>
        <Contact size="normal" />
      </div>
    </div>
  )
}

const ToggleTheme = () => {
  const { isActive } = useSubscription()
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>Visual Theme: {isDark ? 'Dark' : 'Light'}</h4>
      </div>
      <div className={`${theme.cardBody} ${centerContentClass} pb-0`}>
        {isActive && (
          <label htmlFor="visual-theme-switch">
            <Switch
              onChange={toggleTheme}
              checked={isDark}
              onColor="#1C7595"
              onHandleColor="#E9ECEF"
              handleDiameter={36}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={26}
              width={80}
              className="react-switch"
              id="visual-theme-switch"
            />
          </label>
        )}
        {!isActive && (
          <div className="alert alert-info text-center mt-3" role="alert">
            <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick('SubscribeDarkTheme')}>
              Subscribe now
            </Link>{' '}
            to use dark theme!
          </div>
        )}
      </div>
    </div>
  )
}

const SubscriptionExpired = () => (
  <div className="mt-2">
    <div className="alert alert-danger text-center" role="alert">
      <strong>Your subscription has expired!</strong>
      <br />
      <Link
        to={ROUTES.SUBSCRIBE}
        className={`btn btn-md btn-success mt-2`}
        onClick={() => logClick('Resubscribe')}
      >
        Resubscribe now!
      </Link>
    </div>
  </div>
)
