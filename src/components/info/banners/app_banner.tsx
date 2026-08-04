import { NotificationBanner } from 'components/info/banners/notification_banner'
import { UpdateAvailable } from 'components/info/updateAvailable'

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
 */
const AppBanner = () => <UpdateAvailable fallback={<WelcomeBanner />} />

export default AppBanner
