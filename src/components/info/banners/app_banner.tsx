import { CheckoutOutcomeBanner } from 'components/info/banners/checkout_outcome_banner'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { UpdateAvailable } from 'components/info/updateAvailable'
import { useCheckoutOutcome } from 'utils/checkoutOutcome'

/**
 * The rules-update note for the latest Rules Radar reconciliation (corpus 2026-09-10). Each
 * reconciliation that reaches production gets its own banner name so the note shows once to
 * everyone, including people who dismissed the previous one; keep the copy to a few sentences.
 */
const RulesUpdateBanner = () => (
  <NotificationBanner enableLog name="2026-09-rules-update-1" variant="info">
    <span>
      <strong>September update:</strong> Sons of Behemat points are updated from the new battletome battle
      profiles, with big drops across the mega-gargants. The new hero, units and second Spearhead will appear
      once their rules are published. Spotted a mistake? Let us know on{' '}
      <a href="https://discord.gg/2nt9Fxp" target="_blank" rel="noopener noreferrer">
        Discord
      </a>
      !
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
  return <UpdateAvailable fallback={<RulesUpdateBanner />} />
}

export default AppBanner
