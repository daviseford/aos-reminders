import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useAppStatus } from 'context/useAppStatus'
import { useEffect, useRef, useState } from 'react'
import { applyWaitingUpdate } from '../../bootstrap/registerServiceWorker'

/*
 * How long a dismissal lasts.
 *
 * Not "for this session", and deliberately not NotificationBanner's persisted dismissal: an
 * installed PWA on a phone is suspended rather than closed, so the next natural load can be weeks
 * away, and the waiting worker only activates once every tab is gone. A bounded dismissal means
 * someone who taps the wrong thing is not stranded on an old build.
 */
const DISMISS_DURATION_MS = 60 * 60 * 1000

interface IUpdateAvailableProps {
  /** Injected in tests. Defaults to the real registration's skip-waiting call. */
  onApply?: () => void
}

/**
 * Prompts the user to reload onto a waiting service worker.
 *
 * `hasNewContent` has existed on the app-status context since the CRA worker, but nothing has ever
 * rendered it -- the "you will be given an option in the UI" comment in the old entry point was
 * aspirational. This is that option.
 */
export const UpdateAvailable = ({ onApply = applyWaitingUpdate }: IUpdateAvailableProps) => {
  const { hasNewContent } = useAppStatus()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(dismissTimer.current), [])

  // Unmounting on dismiss is what lets the banner come back: NotificationBanner's own `isOn` latches
  // off, so a remount is the only way to re-show it.
  const handleDismiss = () => {
    setIsDismissed(true)
    dismissTimer.current = setTimeout(() => setIsDismissed(false), DISMISS_DURATION_MS)
  }

  const handleApply = () => {
    // The page reloads out from under this component once the new worker takes control, but the
    // interval before that is long enough to tap twice.
    if (isApplying) return
    setIsApplying(true)
    onApply()
  }

  if (!hasNewContent || isDismissed) return null

  return (
    <NotificationBanner
      closeLabel="Dismiss update notification"
      name="app-update"
      onClose={handleDismiss}
      persistClose={false}
      variant="info"
    >
      <span>A new version of AoS Reminders is available.</span>
      <button
        type="button"
        className="btn btn-sm btn-primary flex-shrink-0 ms-2"
        onClick={handleApply}
        disabled={isApplying}
      >
        {isApplying ? 'Reloading...' : 'Reload'}
      </button>
    </NotificationBanner>
  )
}
