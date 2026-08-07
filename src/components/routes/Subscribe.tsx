import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
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
const headerClass = `${contentClass} pt-5`

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
      </div>
      {/*
        A full-bleed band, not a .row: a bare row's -15px margins overflowed the viewport by 15px and
        scrolled the whole page sideways. PricingPlans supplies its own .container.
      */}
      <div className={`py-5 ${theme.sectionBand} ${theme.text}`}>
        {/*
          Nothing here used to read subscriptionLoading or subscriptionError, so an account whose
          lookup was still in flight — or had failed — was shown three live buy buttons. A subscriber
          on a bad venue connection could be charged a second time for what they already have. The
          plans appear only once the answer is known to be "not subscribed".
        */}
        {subscriptionLoading ? (
          <CheckingSubscription />
        ) : subscriptionError ? (
          <SubscriptionUnavailable error={subscriptionError} onRetry={getSubscription} />
        ) : (
          <PricingPlans />
        )}
      </div>
      <ExamplesRow />
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
      {/* height reserves the box before the image loads; the intrinsic ratio is 919x843. */}
      <img
        alt=""
        aria-hidden="true"
        className="d-block mx-auto mb-4 img-fluid rounded-circle bg-white"
        height="110"
        src="/img/logo_medium_padding.png"
        width="120"
      />
      {/* Rendered at h2 size so the page gains a top-level heading without a visual change. */}
      <h1 className="h2">Subscribe to AoS Reminders</h1>
      {/*
        Leads with what the subscription does rather than with an appeal for support. The old opening
        — "those who wish to support AoS Reminders" — framed a hard paywall as a tip jar, and left the
        three features it actually unlocks unsold. The support line survives, at the end, where it
        reads as context rather than as the offer.
      */}
      <p className="lead">
        Your army is saved in this browser, and only this browser. A subscription keeps it on your account
        instead, so it follows you to the phone in your hand at the table — and survives losing that phone.
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
        <strong>My Armies</strong> — save, load, rename, update, and delete your AoS 4 armies, on every device
        you sign in on.
      </li>
      <li>
        <strong>Share Army</strong> — send a link a friend can open to take their own copy of your list.
      </li>
      <li>
        <strong>Dark theme</strong> — stored against your account, so it follows you too.
      </li>
    </ul>
    <p>
      Everything else — the builder, importing, reminders, notes, hiding, reordering, and the PDF — is free,
      and stays free. Subscribing is what keeps it that way.
    </p>
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
const SubscriptionUnavailable = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  const { theme } = useTheme()

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-xl-8">
          <div className="alert alert-warning text-center mb-0" role="alert">
            {error}
            <br />
            We have not shown the plans, in case you are already subscribed.
            <br />
            <button type="button" className={`${theme.secondaryButton} mt-2`} onClick={() => void onRetry()}>
              Check again
            </button>
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
      <p className="mb-1">
        <Link to={`${ROUTES.FAQ}#what-subscription-includes`} onClick={() => logClick('Subscribe-Faq')}>
          More about subscriptions in the FAQ
        </Link>
      </p>
      <p className="mb-0">
        <small>
          Already subscribed? You can buy gift subscriptions for friends from your{' '}
          <Link to={ROUTES.PROFILE} onClick={() => logClick('Subscribe-GiftPointer')}>
            Profile
          </Link>
          .
        </small>
      </p>
    </div>
  )
}

/*
 * The only visual proof of a paid feature anywhere in the funnel. It used to render below 576px only,
 * so desktop got an empty section band and saw nothing at all — this now shows at every width.
 *
 * It stays *below* the plans rather than above them. Tried above, and a 550px-tall portrait video
 * became the centre of the page and pushed all three prices under the fold: proof that costs the
 * offer its position is a bad trade. Here it backs up the dark-theme line for anyone still deciding.
 */
const ExamplesRow = () => {
  const { theme } = useTheme()

  return (
    <div className={`py-5 px-3 ${theme.sectionBand} ${theme.text} text-center`}>
      <DemoVideo videoUrl="/img/dark_mode1.mp4" description="Dark Mode" label="Demo-DarkMode" />
    </div>
  )
}

interface DemoVideoProps {
  videoUrl: string
  description: string
  label: string
}

/**
 * The demo loops, so it needs a way to stop it (WCAG 2.2.2). The native controls provide that, and
 * their fullscreen button covers what the old wrapping link to the raw file was standing in for — a
 * link around the video would have swallowed every click the controls need.
 *
 * There is no .webm asset in public/img; the old `video/webm` source pointed at this same .mp4, and
 * the poster was a 1.8MB gif fronting an 862KB video. Both are gone.
 */
const DemoVideo = ({ videoUrl, description, label }: DemoVideoProps) => {
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <figure className="figure">
      {/* muted + playsInline are required for autoplay on iOS Safari and Android Chrome. */}
      <video
        aria-label={`${description} demo`}
        autoPlay={!prefersReducedMotion}
        className="figure-img img-fluid rounded img-thumbnail"
        controls
        height="550"
        loop
        muted
        onClick={() => logClick(label)}
        playsInline
        preload="metadata"
        width="320"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <figcaption className="figure-caption text-center">
        <strong>{description}</strong>
      </figcaption>
    </figure>
  )
}

export default Subscribe
