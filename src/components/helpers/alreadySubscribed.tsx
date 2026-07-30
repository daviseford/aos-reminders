import Navbar from 'components/page/navbar'
import { useTheme } from 'context/useTheme'
import { Link } from 'react-router-dom'
import { logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'

/**
 * Shown on /subscribe, /join, and /redeem when the visitor already has an active subscription.
 *
 * It is never a post-purchase confirmation: Stripe's success URL returns to `/` and gift purchases
 * return to /profile, so the only way to reach this screen is to arrive at one of those three pages
 * already subscribed. The old copy — "You are now subscribed :) Thanks!" — claimed the visit had
 * just done something, which was wrong in every path that can render it.
 */
const AlreadySubscribed = () => {
  const { theme } = useTheme()

  return (
    <div className={`d-block ${theme.bgColor} ${theme.text}`}>
      <div className={`py-2 ${theme.headerColor}`}>
        <Navbar />
      </div>
      {/*
        The .row used to sit outside any .container, so its -15px gutters ran the page 15px wider
        than the viewport and scrolled it sideways at every width — the exact failure DESIGN.md
        names under Layout.
      */}
      <div className={`container ${theme.bgColor} RedemptionContainer py-5`}>
        <div className="row justify-content-center">
          <div className="col RedemptionColumn text-center">
            {/* Announced: it replaces the loading screen, so it is not present at first render. */}
            <div role="status">
              <h1 className="h2 mb-3">You&apos;re already subscribed</h1>
              <p className="lead">Thanks for supporting AoS Reminders.</p>
            </div>
            {/*
              The screen used to redirect home 1000ms after mount — a full-page
              window.location.replace on a hard timer, too short to read the sentence and impossible
              to cancel (WCAG 2.2.1). This is the destination that timer was guessing at, named for
              what the visitor came here to find out.
            */}
            <Link
              className={`${theme.genericButton} btn-lg`}
              onClick={() => logClick('AlreadySubscribed-Profile')}
              to={ROUTES.PROFILE}
            >
              Manage my subscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlreadySubscribed
