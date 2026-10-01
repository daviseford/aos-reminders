import { CheckoutOutcomeBanner } from 'components/info/banners/checkout_outcome_banner'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useCheckoutOutcome } from 'utils/checkoutOutcome'

/**
 * The rules-update note for the latest Rules Radar reconciliation (corpus 2026-10-01). Each
 * reconciliation that reaches production gets its own banner name so the note shows once to
 * everyone, including people who dismissed the previous one; keep the copy to a few sentences.
 */
const RulesUpdateBanner = () => (
  <NotificationBanner enableLog name="2026-09-rules-update-5" variant="info">
    <span>The latest September errata has been added.</span>
  </NotificationBanner>
)

/**
 * The home screen's single banner slot, directly under the masthead. A waiting update no longer
 * competes for it: updates install behind a modal mounted in `App` (#2046).
 *
 * A return from checkout outranks the rules note. It reports something that just happened to the
 * visitor's money, it cannot be recovered once dismissed, and it is the reason this screen was loaded
 * at all — where the rules note will still be true on the next visit.
 */
const AppBanner = () => {
  const outcome = useCheckoutOutcome()
  if (outcome) return <CheckoutOutcomeBanner />
  return <RulesUpdateBanner />
}

export default AppBanner
