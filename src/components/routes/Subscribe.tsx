import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import SubscriptionRecoveryButton from 'components/helpers/subscriptionRecoveryButton'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Contact from 'components/page/contact'
import { Disclaimer } from 'components/page/footer'
import { PricingPlans } from 'components/payment/pricingPlans'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { lazy, Suspense, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'

const Navbar = lazy(() => import('components/page/navbar'))

/*
 * The intro and the feature list are one text column, so they share a measure and a left edge. They
 * previously used different widths (col-lg-8 vs col-lg-5) inside different wrappers, which left the
 * two prose blocks starting 236px apart on a 1440px screen.
 */
const contentClass = 'col-12 col-lg-8 col-xl-8 mx-auto'
/*
 * pt-4 below 576px, pt-5 above. On a phone the whole first screen was preamble — logo, heading,
 * lead, bullets — and the first price did not appear until roughly 1,135px down. Every fixed unit
 * above the plans is paid for by the visitor who has to scroll past it to find out what this costs.
 */
const headerClass = `${contentClass} pt-4 pt-sm-5`

const Subscribe = () => {
  const { isLoading } = useAuth0()
  const { isSubscribed, isActive, getSubscription, subscriptionError, subscriptionLoading } =
    useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    void getSubscription()
  }, [getSubscription])

  if (isLoading) return <LoadingBody />
  if (isSubscribed && isActive) return <AlreadySubscribed />

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>
      <PaywallNotice />
      <Intro />
      <div className={`${theme.bgColor} ${theme.text}`}>
        <CurrentFeatures />
        <DemoVideo />
      </div>
      <div className={`py-4 py-sm-5 ${theme.sectionBand} ${theme.text}`}>
        {subscriptionLoading ? (
          <CheckingSubscription />
        ) : subscriptionError ? (
          <SubscriptionUnavailable error={subscriptionError} />
        ) : (
          <PricingPlans />
        )}
      </div>
      <MoreQuestions />
      <div className={`container ${theme.bgColor} ${theme.text} text-center py-4`}>
        <Contact size="small" />
        <Disclaimer />
      </div>
    </div>
  )
}

/**
 * Names the control that sent the visitor here.
 *
 * `useSubscriberAction` used to navigate to this page silently, so the highest-intent moment in the
 * funnel — pressing a gated button — arrived at a page headed "Support AoS Reminders" for reasons it
 * never stated. The feature name travels in the navigation state; arriving any other way renders
 * nothing, so this never speculates about why someone is here.
 */
const PaywallNotice = () => {
  const { state } = useLocation()
  const featureName = (state as { featureName?: string } | null)?.featureName
  if (!featureName) return null

  return (
    <div className="container pt-4">
      <div className="row justify-content-center">
        <div className={contentClass}>
          {/* Announced: it is the reason the route changed, and it is absent on a direct visit. */}
          <div className="alert alert-info mb-0" role="alert">
            <strong>{featureName}</strong> needs a subscription. Here is what one includes.
          </div>
        </div>
      </div>
    </div>
  )
}

const Intro = () => {
  const { theme } = useTheme()

  return (
    <div className={`${headerClass} ${theme.text}`}>
      <h1 className="h2">Subscribe to AoS Reminders</h1>
      <p className="lead">
        <strong>AoS Reminders is built and run by one person</strong>, Davis. It costs money to host this
        website, and it takes a lot of time to keep it up to date. Subscriptions help keep the site running.
      </p>
      <p className="lead">
        In free mode, your army is saved locally in your browser. A subscription keeps it in the cloud
        instead, so it follows you to the table and survives a lost phone.
      </p>
    </div>
  )
}

/*
 * Written to match the FAQ's answers, which were consistently more concrete than this page's. "Create
 * read-only army links" became the sharing sentence the FAQ already used, because what the recipient
 * can actually do — take their own copy — is the part worth paying for.
 */
const CurrentFeatures = () => (
  <div className={`${contentClass} mt-3`}>
    <ul className="lead">
      <li>
        <strong>My Armies</strong>: save, load, rename, update, and delete your AoS 4 armies, on every device
        you sign in on.
      </li>
      <li>
        <strong>Share Army</strong>: send a link a friend can open to take their own copy of your list.
      </li>
      <li>
        <strong>Dark theme</strong>: stored against your account, so it follows you too.
      </li>
    </ul>

    <p>
      Everything else is free, and stays free: the builder, importing, reminders, notes, hiding, reordering,
      and the PDF.
    </p>
  </div>
)

/*
 * The #1761 demo reel: a 33-second silent tour of importing, reminders, cloud saves, sharing, and the
 * light and dark themes. It sits under the feature list it illustrates, so it reads before the plans.
 *
 * Nothing downloads until the visitor presses play: preload="none" leaves only the poster (a frame of
 * the reel's own title card, ~50 KB) on the first load, and the service worker precaches only the
 * built js/css/html, so the ~5.9 MB clip never enters the offline cache. The width and height
 * attributes reserve the 16:9 box before the poster arrives. No autoplay or loop: the visitor starts
 * it, which also leaves reduced-motion preferences alone. The clip is silent, so there is no audio
 * to caption; the figcaption says what it shows.
 *
 * The dated file name is the cache buster: public files are served with a one-day max-age and no
 * content hash (docs/deployment.md), so a new cut needs a new name, not an overwrite.
 */
const DEMO_VIDEO_SRC = '/img/subscribe-demo-2026-10.mp4'
const DEMO_VIDEO_POSTER = '/img/subscribe-demo-2026-10-poster.jpg'

const DemoVideo = () => (
  <div className={`${contentClass} pb-4`}>
    <figure className="mb-0">
      <video
        className="d-block w-100 h-auto rounded"
        controls
        preload="none"
        playsInline
        poster={DEMO_VIDEO_POSTER}
        width={1920}
        height={1080}
        aria-label="AoS Reminders demo video"
        aria-describedby="subscribe-demo-description"
      >
        <source src={DEMO_VIDEO_SRC} type="video/mp4" />
      </video>
      <figcaption id="subscribe-demo-description" className="small mt-2">
        A 33-second tour with no sound: importing a list, reminders phase by phase, saving an army to the
        cloud, sharing it with a friend, and the light and dark themes.
      </figcaption>
    </figure>
  </div>
)

/**
 * Stands in for the plans while the account's subscription is still being looked up. Mirrors the
 * wording and the role="status" announcement /profile already uses for the same wait.
 */
const CheckingSubscription = () => (
  <div className="container text-center" role="status">
    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
    Checking your subscription&hellip;
  </div>
)

/**
 * Stands in for the plans when the lookup failed. Buying is withheld rather than offered on a guess:
 * the one thing this page must not do is sell a second subscription to someone who already has one.
 */
const SubscriptionUnavailable = ({ error }: { error: string }) => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-xl-8">
          <div className="alert alert-warning text-center mb-0" role="alert">
            {error}
            <br />
            <SubscriptionRecoveryButton origin="Subscribe" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The FAQ answers every objection this page raises — what a subscription includes, how to cancel,
 * whether card details are stored — and this page linked to none of it. Gift subscriptions get a
 * pointer for the same reason: they are real, they are cheaper per period, and nothing outside
 * /profile has ever mentioned them.
 */
const MoreQuestions = () => {
  const { theme } = useTheme()

  return (
    <div className={`container ${theme.bgColor} ${theme.text} text-center pt-4`}>
      {/*
        FaqLink on both: Action Blue was tuned for white backgrounds and measures 3.29:1 on Midnight
        Slate, under the 4.5:1 floor. FaqLink is the incumbent answer for links on themed surfaces —
        inherit the theme's text colour and let the underline mark the link.
      */}
      <p className="mb-0">
        <small>
          Already subscribed? You can buy gift subscriptions for friends from your{' '}
          <Link className="FaqLink" to={ROUTES.PROFILE} onClick={() => logClick('Subscribe-GiftPointer')}>
            Profile
          </Link>
          .
        </small>
      </p>
    </div>
  )
}

export default Subscribe
