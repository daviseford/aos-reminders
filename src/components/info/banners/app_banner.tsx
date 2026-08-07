import { CheckoutOutcomeBanner } from 'components/info/banners/checkout_outcome_banner'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { UpdateAvailable } from 'components/info/updateAvailable'
import { useCheckoutOutcome } from 'utils/checkoutOutcome'

const WelcomeBanner = () => (
  <NotificationBanner enableLog name="2026-aos4-welcome-back-lists" variant="info">
    <span>
      <strong>Welcome back!</strong> AoS Reminders is being updated to the latest and greatest. We now support
      importing Sigdex, Storm Forge, Listbot, and New Recruit lists!
    </span>
  </NotificationBanner>
)

/**
 * The home screen's single banner slot, directly under the masthead.
 *
 * A waiting update takes the slot over rather than adding a second banner above the masthead: of the
 * two only the update is actionable, and stacking them put two alerts on screen at once.
 *
 * A return from checkout outranks both. It reports something that just happened to the visitor's
 * money, it cannot be recovered once dismissed, and it is the reason this screen was loaded at all —
 * where the other two will still be true on the next visit.
 */
const AppBanner = () => {
  const outcome = useCheckoutOutcome()
  if (outcome) return <CheckoutOutcomeBanner />
  return <UpdateAvailable fallback={<WelcomeBanner />} />
}

export default AppBanner
