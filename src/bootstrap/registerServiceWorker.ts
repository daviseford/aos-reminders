import { registerSW } from 'virtual:pwa-register'

/*
 * A standalone PWA left open at a game table never performs a full navigation, so it would otherwise
 * never notice a new build within a session. An hourly registration.update() closes that window --
 * and it is also what brings the update banner back after a user dismisses it, since dismissal is
 * component-local and deliberately does not discard the waiting worker.
 */
const UPDATE_POLL_INTERVAL_MS = 60 * 60 * 1000

/*
 * Feeds the update signal `context/useAppStatus` already listens for. The BroadcastChannel reaches
 * other tabs; the window event covers the same tab and browsers where the channel is unavailable.
 * Both were built for the CRA worker and left dangling when it stopped working.
 */
const announceNewContent = () => {
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('app-update')
    channel.postMessage('App has updated.')
    channel.close()
  }
  window.dispatchEvent(new Event('hasNewContent'))
}

/*
 * Registered through the vanilla entry point rather than `virtual:pwa-register/react`. The React hook
 * registers twice under StrictMode (vite-pwa/vite-plugin-pwa#925, still open) and is not tested
 * against React 19 upstream; this keeps registration out of the component tree entirely.
 *
 * Calling this is what applies a waiting update: it posts SKIP_WAITING, and the plugin reloads the
 * page once the new worker takes control. Under `registerType: 'prompt'` nothing else can trigger
 * that, so the reload only ever follows an explicit user accept.
 */
export const applyWaitingUpdate = registerSW({
  onNeedRefresh: announceNewContent,
  onRegisteredSW: (swUrl, registration) => {
    if (!registration) return

    setInterval(async () => {
      if (registration.installing || !navigator.onLine) return

      try {
        // Ask the network directly: a cached 200 would make a stale worker look current.
        const response = await fetch(swUrl, { cache: 'no-store' })
        if (response.status === 200) await registration.update()
      } catch {
        // Offline or the check failed. The next tick retries.
      }
    }, UPDATE_POLL_INTERVAL_MS)
  },
})
