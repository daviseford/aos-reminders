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
 * Skip-waiting activates the new worker for *every* client on this origin, so without this flag each
 * open tab reloads itself when any one of them accepts -- including a tab whose user had just
 * dismissed the prompt. That is exactly the mid-session interruption `registerType: 'prompt'` was
 * chosen to avoid, so the reload is scoped to the client that asked for it. The others keep running
 * and pick the new build up on their next navigation.
 */
let acceptedHere = false

/*
 * Registered through the vanilla entry point rather than `virtual:pwa-register/react`. The React hook
 * registers twice under StrictMode (vite-pwa/vite-plugin-pwa#925, still open) and is not tested
 * against React 19 upstream; this keeps registration out of the component tree entirely.
 */
const updateServiceWorker = registerSW({
  onNeedRefresh: announceNewContent,
  onNeedReload: async () => {
    if (acceptedHere) window.location.reload()
  },
  onRegisteredSW: (_swUrl, registration) => {
    if (!registration) return

    setInterval(async () => {
      if (registration.installing) return

      try {
        /*
         * `update()` fetches and byte-compares the worker script itself, and the deploy serves it
         * `max-age=0, must-revalidate`, so it cannot come from the HTTP cache. The pre-flight fetch
         * the plugin's docs suggest would just be a second round trip to the same URL each hour, per
         * open tab, and would not catch the failure that actually bit this app before -- a worker
         * path answering 200 with the SPA's HTML.
         *
         * No `navigator.onLine` guard either: it reports whether an interface is up, not whether the
         * origin is reachable, and a false negative would skip the check for a full hour. A genuinely
         * offline `update()` costs one rejected fetch, which the catch already absorbs.
         */
        await registration.update()
      } catch {
        // Offline or the check failed. The next tick retries.
      }
    }, UPDATE_POLL_INTERVAL_MS)
  },
})

/**
 * Applies a waiting update: posts SKIP_WAITING and reloads *this* client once the new worker takes
 * control. Under `registerType: 'prompt'` nothing else triggers that, so a reload only ever follows
 * an explicit accept in the tab the user is looking at.
 */
export const applyWaitingUpdate = () => {
  acceptedHere = true
  void updateServiceWorker()
}
