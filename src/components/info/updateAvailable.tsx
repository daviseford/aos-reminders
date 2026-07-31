import { useAppStatus } from 'context/useAppStatus'
import { useEffect, useRef, useState } from 'react'
import { applyWaitingUpdate } from '../../bootstrap/registerServiceWorker'

/*
 * How long a dismissal lasts.
 *
 * Not "for this session": an installed PWA on a phone is suspended rather than closed, so the next
 * natural load can be weeks away, and the waiting worker only activates once every tab is gone. A
 * bounded dismissal means someone who taps the wrong thing is not stranded on an old build.
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

  const handleDismiss = () => {
    setIsDismissed(true)
    // Local state only. NotificationBanner's localStorage dismissal is keyed by name, which would
    // suppress every future build's prompt after a single close.
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
    <div className="alert alert-info text-center fade show d-flex my-0 d-print-none" role="alert">
      <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-wrap gap-2">
        <span>A new version of AoS Reminders is available.</span>
        <button
          type="button"
          className="btn btn-sm btn-primary flex-shrink-0"
          onClick={handleApply}
          disabled={isApplying}
        >
          {isApplying ? 'Reloading...' : 'Reload'}
        </button>
      </div>
      {/*
        flex-shrink-0 keeps the 24px hit box intact -- without it the banner text squeezes the close
        button's 1em width below the WCAG 2.5.8 floor. Same fix as notification_banner.tsx.
      */}
      <button
        type="button"
        className="btn-close align-self-start ms-2 flex-shrink-0"
        aria-label="Dismiss update notification"
        onClick={handleDismiss}
        disabled={isApplying}
      />
    </div>
  )
}
