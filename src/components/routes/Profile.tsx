import { useAuth0 } from '@auth0/auth0-react'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import { CancelPaypalSubscriptionModal } from 'components/modals/paypal_cancellation_modal'
import { CancelStripeSubscriptionModal } from 'components/modals/stripe_cancellation_modal'
import Contact from 'components/page/contact'
import { Disclaimer } from 'components/page/footer'
import { GiftSubscriptions } from 'components/payment/giftSubscriptions'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { DateTime } from 'luxon'
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { FaGift, FaPaypal, FaSearchDollar } from 'react-icons/fa'
import { MdCheckCircle, MdNotInterested } from 'react-icons/md'
import { Link } from 'react-router'
import Switch from 'react-switch'
import { centerContentClass } from 'theme/helperClasses'
import { logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import { titleCase } from 'utils/textUtils'

const Navbar = lazy(() => import('components/page/navbar'))

const Profile = () => {
  const { isLoading, user } = useAuth0()
  const { getSubscription } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    void getSubscription()
  }, [getSubscription])

  if (isLoading || !user) return <LoadingBody />

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>
      {/*
        No `px-0`. The container's gutter padding is what absorbs the .row's -15px margins; stripping
        it ran the row 15px wider than the viewport and scrolled this page sideways at 390, 375, 335
        and 320 — the exact failure DESIGN.md names under Layout, on the account screen, in the
        one-handed phone scene. /redeem, /join and AlreadySubscribed all use the plain container; this
        is that pattern. Visible delta: the card column gains the standard 15px side gutter it should
        always have had, rather than touching the screen edge.
      */}
      <div className={`container ${theme.bgColor}`}>
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-6">
            <UserCard />
          </div>
        </div>
      </div>
      <GiftSubscriptions />
      {/* PRODUCT.md requires the Games Workshop disclaimer on every page; this route had none. */}
      <div className={`container ${theme.bgColor} ${theme.text} pb-4`}>
        <Disclaimer />
      </div>
    </div>
  )
}

const UserCard = () => {
  const { isSubscribed, subscription } = useSubscription()
  const { theme } = useTheme()

  return (
    <div className={`col py-4 ${theme.text} text-center`}>
      <h1 className="text-center">Your Profile</h1>
      <ToggleTheme />
      <SubscriptionInfo />
      {isSubscribed && subscription.subscriptionStatus !== 'temporary_grant' && <RecurringPaymentInfo />}
      <EmailVerified />
      <Help />
    </div>
  )
}

const CancelBtn = () => {
  const { isActive, isCanceled, createdByPaypal } = useSubscription()
  const { isLight } = useTheme()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  if (!isActive || isCanceled) return null

  const ModalComponent = createdByPaypal ? CancelPaypalSubscriptionModal : CancelStripeSubscriptionModal

  return (
    <>
      <GenericButton
        className={`btn btn-sm btn${isLight ? '-outline-' : '-'}danger`}
        onClick={() => setModalIsOpen(true)}
      >
        Cancel Subscription
      </GenericButton>
      {modalIsOpen && <ModalComponent modalIsOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)} />}
    </>
  )
}

/*
 * The status icons used to be the only thing that answered "am I subscribed?". They carry no text,
 * so the accessibility tree read `heading "Subscription Status:"` with the answer missing, and the
 * meaning was left to colour alone. The icon is decorative now; the word beside it is the value.
 */
const CardTitle = ({ icon, label, title }: { icon?: ReactNode; label?: string; title: string }) => (
  <h2 className="CardHeaderTitle">
    {icon ? (
      /*
       * The label and its icon wrap as one unit. Left to itself the flex row treats each text node
       * as a separate item and breaks mid-phrase on a phone, stranding the icon between the two
       * halves — "Subscription / Status: (icon) Not / subscribed".
       */
      <span className={`${centerContentClass} flex-wrap`}>
        <span>{title}</span>
        <span className="text-nowrap">
          {icon}
          {label}
        </span>
      </span>
    ) : (
      title
    )}
  </h2>
)

const SubscriptionStatusTitle = () => {
  const { isActive, isPending, subscriptionError, subscriptionLoading } = useSubscription()

  // Neither a tick nor a cross is true yet, and a cross reads as a definitive "no".
  if (subscriptionLoading || subscriptionError) return <CardTitle title="Subscription Status:" />

  if (isPending) {
    return (
      <CardTitle
        title="Subscription Status:"
        icon={<FaSearchDollar className="text-warning mx-2" aria-hidden="true" />}
        label="Pending"
      />
    )
  }

  return isActive ? (
    <CardTitle
      title="Subscription Status:"
      icon={<MdCheckCircle className="text-success mx-2" aria-hidden="true" />}
      label="Active"
    />
  ) : (
    <CardTitle
      title="Subscription Status:"
      icon={<MdNotInterested className="text-danger mx-2" aria-hidden="true" />}
      label="Not subscribed"
    />
  )
}

const SubscriptionPeriod = () => {
  const { subscription } = useSubscription()
  const { subscriptionStart, planInterval, planIntervalCount } = subscription
  if (typeof subscriptionStart !== 'number') return null

  const hasEnd = typeof planInterval === 'string' && typeof planIntervalCount === 'number'

  /* mb-2 keeps the run of lines at the spacing the <h5>s these replaced had. */
  return (
    <>
      <p className="lead mb-2">
        Subscription Start: {DateTime.fromSeconds(subscriptionStart).toLocaleString(DateTime.DATE_MED)}
      </p>
      {hasEnd && (
        <p className="lead mb-2">
          Subscription End:{' '}
          {DateTime.fromSeconds(subscriptionStart)
            .plus({ [`${planInterval}s`]: planIntervalCount })
            .toLocaleString(DateTime.DATE_MED)}
        </p>
      )}
    </>
  )
}

/*
 * `subscriptionLoading` and `subscriptionError` are both produced by the subscription context and
 * were read by nothing here, so an in-flight or failed lookup rendered as a settled "not
 * subscribed" — a subscriber on a bad venue connection was told they had no subscription.
 */
const SubscriptionInfoBody = () => {
  const {
    getSubscription,
    hasExpiredGrant,
    isActive,
    isPending,
    isSubscribed,
    subscription,
    subscriptionError,
    subscriptionLoading,
  } = useSubscription()
  const { theme } = useTheme()

  if (subscriptionLoading) {
    return (
      <p className={`lead mb-0 ${centerContentClass}`} role="status">
        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
        Checking your subscription&hellip;
      </p>
    )
  }

  if (subscriptionError) {
    return (
      <div className="alert alert-warning mb-0 text-center" role="alert">
        {subscriptionError}
        <br />
        <button
          type="button"
          className={`${theme.secondaryButton} mt-2`}
          onClick={() => void getSubscription()}
        >
          Check again
        </button>
      </div>
    )
  }

  if (isActive && !hasExpiredGrant) {
    const paidBy = subscription.createdBy
    const showsPayment = paidBy === 'paypal' || paidBy === 'stripe'
    const showsPeriod = typeof subscription.subscriptionStart === 'number'

    // An active subscription the API returned without dates or a payment method still has to say so.
    if (!showsPeriod && !showsPayment) return <p className="lead mb-0">Your subscription is active.</p>

    return (
      <>
        <SubscriptionPeriod />
        {showsPayment && <p className="lead mb-0">Payment Method: {titleCase(paidBy)}</p>}
      </>
    )
  }

  if (isSubscribed && !isActive && !isPending && !hasExpiredGrant) return <SubscriptionExpired />

  if (isPending) return <p className="lead mb-0">Your subscription is pending activation.</p>

  /* A dead end in the incumbent: it named the state and offered nothing to do about it. */
  return (
    <>
      <p className="lead mb-2">You do not have an active subscription.</p>
      <Link
        to={ROUTES.SUBSCRIBE}
        className={theme.genericButton}
        onClick={() => logClick('Profile-Subscribe')}
      >
        See what a subscription includes
      </Link>
    </>
  )
}

const SubscriptionInfo = () => {
  const { hasActiveGrant } = useSubscription()
  const { theme } = useTheme()

  if (hasActiveGrant) return <TemporaryGrantComponent />

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <SubscriptionStatusTitle />
      </div>
      <div className={theme.cardBody}>
        <SubscriptionInfoBody />
      </div>
    </div>
  )
}

const TemporaryGrantComponent = () => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <CardTitle
          title="Subscription Status:"
          icon={<FaSearchDollar className="text-warning mx-2" aria-hidden="true" />}
          label="Verifying"
        />
      </div>
      <div className={theme.cardBody}>
        <div className={`${centerContentClass} row`}>
          <div className="col-12">
            <p className="h1">
              <FaPaypal className="text-info align-self-center" aria-hidden="true" />
            </p>
          </div>
          <div className="col-12">
            <p className="lead text-warning">Currently verifying payment via Paypal.</p>
          </div>
        </div>
        <SubscriptionPeriod />
        <p className="lead mb-0">Payment Method: Paypal</p>
      </div>
    </div>
  )
}

const RecurringPaymentInfo = () => {
  const { isActive, isCanceled, isGifted } = useSubscription()
  const { theme } = useTheme()
  const isRenewing = isActive && !isCanceled

  /*
   * An expired subscription has no recurring payment left to describe, and the status card above
   * already reports the expiry. Rendering the header alone would leave a truncated card.
   */
  if (!isRenewing && !isCanceled && !isGifted) return null

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        {isRenewing ? (
          <CardTitle
            title="Recurring Payment:"
            icon={<MdCheckCircle className="text-success mx-2" aria-hidden="true" />}
            label="On"
          />
        ) : (
          <CardTitle
            title="Recurring Payment:"
            icon={<MdNotInterested className="text-danger mx-2" aria-hidden="true" />}
            label="Off"
          />
        )}
      </div>
      <div className={theme.cardBody}>
        {isRenewing && <CancelBtn />}
        {/* Matches the promise the cancellation modal makes, so the two cannot drift apart. */}
        {isCanceled && (
          <p className="mb-0">
            You&apos;ll still have access to everything until your current subscription expires.
          </p>
        )}
        {isGifted && (
          <>
            <FaGift className="me-2" aria-hidden="true" />
            You were gifted this subscription!
            <FaGift className="ms-2" aria-hidden="true" />
            <br />
            You may purchase a recurring subscription at the end of this period.
          </>
        )}
      </div>
    </div>
  )
}

const EmailVerified = () => {
  const { user } = useAuth0()
  const { theme } = useTheme()
  if (!user?.email) return null

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <CardTitle title="User Email:" />
      </div>
      <div className={theme.cardBody}>
        {/* Long addresses have nowhere to wrap on a phone without an explicit break opportunity. */}
        <p className="lead mb-0 text-break">{user.email}</p>
      </div>
    </div>
  )
}

const Help = () => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <CardTitle title="Contact Us" />
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
        <CardTitle title={`Visual Theme: ${isDark ? 'Dark' : 'Light'}`} />
      </div>
      <div className={`${theme.cardBody} ${centerContentClass} pb-0`}>
        {isActive && (
          /*
           * The wrapping <label> carried no text, so the switch had no accessible name at all. The
           * card header states the current value; the control needs to state what it switches.
           */
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
            aria-label="Dark theme"
          />
        )}
        {/* Standing guidance, present at first render — not an outcome worth announcing on load. */}
        {!isActive && (
          <div className="alert alert-info text-center mt-3">
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
  /* `btn-md` was a dead class — Bootstrap 4.6 ships only btn-sm and btn-lg, so this was default size. */
  <div className="alert alert-danger text-center mb-0" role="alert">
    <strong>Your subscription has expired!</strong>
    <br />
    <Link to={ROUTES.SUBSCRIBE} className="btn btn-success mt-2" onClick={() => logClick('Resubscribe')}>
      Resubscribe now!
    </Link>
  </div>
)

export default Profile
