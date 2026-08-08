import { NotificationBanner } from 'components/info/banners/notification_banner'
import { Link } from 'react-router'
import { logClick } from 'utils/analytics'
import { clearCheckoutOutcome, useCheckoutOutcome } from 'utils/checkoutOutcome'
import { ROUTES } from 'utils/env'

/**
 * What the buyer sees on returning from a hosted checkout.
 *
 * Stripe returns to `/` for a subscription and to `/profile` for a gift, and both the success and the
 * cancel return used to render a page identical to the one an abandoned checkout produces — so the
 * money moment ended in silence, at exactly the point the buyer most needs evidence.
 *
 * The copy claims only what the return itself proves. Reaching the success URL means Stripe took the
 * payment; it does not mean the subscription webhook has landed yet, so this points at the Profile
 * screen that reports the real status rather than asserting the features are already on.
 *
 * Not persisted: this is a one-time report of something that just happened, and a dismissal
 * remembered in localStorage would suppress the confirmation of the *next* purchase.
 */
export const CheckoutOutcomeBanner = () => {
  const outcome = useCheckoutOutcome()
  if (!outcome) return null

  const variant = outcome.kind === 'canceled' ? 'info' : 'success'

  return (
    <NotificationBanner
      closeLabel="Close checkout message"
      name="checkout-outcome"
      onClose={clearCheckoutOutcome}
      persistClose={false}
      variant={variant}
    >
      <span>
        {outcome.kind === 'subscribed' && (
          <>
            <strong>Payment received.</strong> Thanks for subscribing. Activation can take a few moments —
            your{' '}
            {/*
              alert-link, Bootstrap's own treatment for links inside alerts: plain Action Blue on the
              tinted alert-success background measures ~3.8:1, under the 4.5:1 floor.
            */}
            <Link
              className="alert-link"
              to={ROUTES.PROFILE}
              onClick={() => logClick('CheckoutBanner-Profile')}
            >
              Profile
            </Link>{' '}
            shows the current status.
          </>
        )}
        {outcome.kind === 'gifted' && (
          <>
            <strong>Payment received.</strong>{' '}
            {outcome.quantity > 1
              ? `Your ${outcome.quantity} gift subscriptions are ready to send — copy a link below.`
              : 'Your gift subscription is ready to send — copy its link below.'}
          </>
        )}
        {outcome.kind === 'canceled' && (
          <>
            <strong>Checkout canceled.</strong> You have not been charged.
          </>
        )}
      </span>
    </NotificationBanner>
  )
}
