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
import { baselineMonthlyCost } from 'utils/plans'

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
      </div>
      {/*
        A full-bleed band, not a .row: a bare row's -15px margins overflowed the viewport by 15px and
        scrolled the whole page sideways. PricingPlans supplies its own .container.
      */}
      {/* py-4 below 576px: band padding above the prices is pure scroll cost on a phone. */}
      <div className={`py-4 py-sm-5 ${theme.sectionBand} ${theme.text}`}>
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
      {/*
        Directly under the plans. These three answer the questions the prices raise, so they belong
        where the prices end.

        The dark-mode demo video used to sit between them, which pushed all of this past 2,100px —
        beyond the point anyone who had just read the prices was still reading. It is removed for now
        and will come back later; `public/img/dark_mode1.mp4` is deliberately kept for that.
      */}
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
      {/*
        No logo. It was decorative — the masthead already identifies the product — and it had already
        been hidden on mobile for exactly that reason; on desktop it was ~150px of the screen that has
        to make the case, and in dark theme its white circle read as a rendering artifact. Removing it
        finishes the decision the mobile hiding started.
      */}
      {/* Rendered at h2 size so the page gains a top-level heading without a visual change. */}
      <h1 className="h2">Subscribe to AoS Reminders</h1>
      {/*
        The one-person fact leads the page. It is the product's strongest trust signal in a niche
        trained on hobbyist-made tools, and it colours how everything after it reads — the ask, the
        prices, and the plain look of the page itself. The old opening buried it below the fold.
      */}
      <p className="lead">
        <strong>AoS Reminders is built and run by one person</strong>, and subscriptions are what keep it
        running.
      </p>
      <p className="lead">
        Your army is saved in this browser, and only this browser. A subscription keeps it on your account
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
            <button
              type="button"
              className={`${theme.alertActionButton} mt-2`}
              onClick={() => void onRetry()}
            >
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
      {/*
        The free-and-stays-free note lives here rather than above the plans. It is the closing
        argument, not the offer, and every line above the prices is one the visitor has to scroll
        past before learning what this costs.

        The second paragraph follows the strongest finding in Wikimedia's published banner testing:
        concrete facts about the thing being supported outperform sentiment roughly threefold. Both
        facts here are anchored: the price ceiling is derived from plans.ts at render time, and the
        army count is pinned to the corpus by a test (accountRoutes.test.tsx), so neither can drift
        from the truth silently. Stating the *maximum* price is deliberate — "from $0.99" is the
        sales voice this product doesn't use. The one-person sentence itself lives in the intro now,
        above the fold.
      */}
      <p>
        Everything else is free, and stays free: the builder, importing, reminders, notes, hiding, reordering,
        and the PDF.
      </p>
      <p>
        No plan costs more than ${baselineMonthlyCost().toFixed(2)} a month, and subscriptions are what keep
        all 27 armies&apos; reminders free for everyone.
      </p>
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
