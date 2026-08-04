import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useAppStatus } from 'context/useAppStatus'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { applyWaitingUpdate } from '../../bootstrap/registerServiceWorker'

/*
 * How long a dismissal lasts.
 *
 * Not "for this session", and deliberately not NotificationBanner's persisted dismissal: an
 * installed PWA on a phone is suspended rather than closed, so the next natural load can be weeks
 * away, and the waiting worker only activates once every tab is gone. A bounded dismissal means
 * someone who taps the wrong thing is not stranded on an old build.
 */
export const DISMISS_DURATION_MS = 60 * 60 * 1000

/*
 * How long the accept control stays in its pending state before it re-enables.
 *
 * `applyWaitingUpdate` now always ends in a reload, and it reaches that unconditionally after two
 * ACTIVATION_TIMEOUT_MS windows, so this has to outlast both -- otherwise the control flips back to
 * "Reload" in the moment before the page goes. It still matters where there is no controller to
 * reach at all -- registration disabled for a rollback, or workbox-window never loaded -- because
 * without it the button would sit disabled for the life of the page with no way to retry.
 */
export const APPLY_TIMEOUT_MS = 15 * 1000

interface IUpdateAvailableProps {
  /**
   * Rendered in this component's place whenever no update is being offered. Lets one banner slot
   * carry both this prompt and whatever the host would otherwise show there.
   */
  fallback?: ReactNode
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
export const UpdateAvailable = ({ fallback = null, onApply = applyWaitingUpdate }: IUpdateAvailableProps) => {
  const { hasNewContent } = useAppStatus()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const applyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  /*
   * A ref, not `isApplying`. Two taps inside one React batch both read the same render's state, so a
   * state-based guard sees `false` twice and posts SKIP_WAITING twice; a ref updates synchronously.
   * `isApplying` still drives the disabled/pending UI, which is a separate concern.
   */
  const hasApplied = useRef(false)

  useEffect(
    () => () => {
      clearTimeout(dismissTimer.current)
      clearTimeout(applyTimer.current)
    },
    []
  )

  // Unmounting on dismiss is what lets the banner come back: NotificationBanner's own `isOn` latches
  // off, so a remount is the only way to re-show it.
  const handleDismiss = () => {
    setIsDismissed(true)
    dismissTimer.current = setTimeout(() => setIsDismissed(false), DISMISS_DURATION_MS)
  }

  const handleApply = () => {
    // The page reloads out from under this component once the new worker takes control, but the
    // interval before that is long enough to tap twice.
    if (hasApplied.current) return
    hasApplied.current = true
    setIsApplying(true)
    // If the reload never arrives, re-enable rather than stranding the user on a dead control.
    applyTimer.current = setTimeout(() => {
      hasApplied.current = false
      setIsApplying(false)
    }, APPLY_TIMEOUT_MS)
    onApply()
  }

  if (!hasNewContent || isDismissed) return <>{fallback}</>

  return (
    <NotificationBanner
      closeLabel="Dismiss update notification"
      name="app-update"
      onClose={handleDismiss}
      persistClose={false}
      variant="info"
    >
      <span>A new version of AoS Reminders is available.</span>
      {/*
        Outline, not filled. DESIGN.md reserves `btn-primary` for the control that commits money or
        an account; reloading onto a new build is reversible.
      */}
      <button
        type="button"
        className="btn btn-sm btn-outline-primary flex-shrink-0 ms-2"
        onClick={handleApply}
        disabled={isApplying}
      >
        {isApplying ? 'Reloading...' : 'Reload'}
      </button>
    </NotificationBanner>
  )
}
