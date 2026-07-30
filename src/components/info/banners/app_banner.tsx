import { NotificationBanner } from 'components/info/banners/notification_banner'

const AppBanner = () => {
  return (
    <NotificationBanner enableLog name="2026-aos4-welcome-back" variant="info">
      <span>
        <strong>Welcome back!</strong> AoS Reminders is being updated to the latest and greatest. Please
        excuse any bugs as we get the kinks sorted out. We&apos;re so glad to see you back!
      </span>
    </NotificationBanner>
  )
}

export default AppBanner
