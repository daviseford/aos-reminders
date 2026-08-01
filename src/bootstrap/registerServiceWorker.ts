import { registerSW } from 'virtual:pwa-register'

/*
 * A standalone PWA left open at a game table never performs a full navigation, so it would otherwise
 * never notice a new build within a session. An hourly registration.update() closes that window --
 * and it is also what brings the update banner back after a user dismisses it, since dismissal is
 * component-local and deliberately does not discard the waiting worker.
 */
const UPDATE_POLL_INTERVAL_MS = 60 * 60 * 1000

export interface RegisterSWOptions {
  onNeedRefresh?: () => void
  onNeedReload?: () => void
  onRegisteredSW?: (swUrl: string, registration?: ServiceWorkerRegistration) => void
}

type RegisterServiceWorker = (options: RegisterSWOptions) => (reloadPage?: boolean) => Promise<void>

interface ServiceWorkerRegistrationDependencies {
  announceNewContent: () => void
  register: RegisterServiceWorker
  reload: () => void
  setPollInterval: (callback: () => Promise<void>, intervalMs: number) => unknown
}

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
 */
export const createServiceWorkerRegistrationController = (
  dependencies: ServiceWorkerRegistrationDependencies
) => {
  let registration: ServiceWorkerRegistration | undefined

  const updateServiceWorker = dependencies.register({
    onNeedRefresh: dependencies.announceNewContent,
    /*
     * In prompt mode vite-plugin-pwa attaches this callback to `controlling` only after a waiting
     * worker has raised onNeedRefresh. The worker still cannot take control until a tab explicitly
     * posts SKIP_WAITING, so clientsClaim does not create an unsolicited reload. Once one tab does
     * accept, every tab that saw that waiting worker reloads onto the claimed build; no old client
     * remains paired with caches that the new worker has already pruned.
     */
    onNeedReload: dependencies.reload,
    onRegisteredSW: (_swUrl, registered) => {
      registration = registered
      if (!registration) return

      dependencies.setPollInterval(async () => {
        if (registration?.installing) return

        try {
          /*
           * `update()` fetches and byte-compares the worker script itself, and the deploy serves it
           * `max-age=0, must-revalidate`, so it cannot come from the HTTP cache. The pre-flight fetch
           * the plugin's docs suggest would just be a second round trip to the same URL each hour,
           * per open tab, and would not catch the failure that actually bit this app before -- a
           * worker path answering 200 with the SPA's HTML.
           *
           * No `navigator.onLine` guard either: it reports whether an interface is up, not whether
           * the origin is reachable, and a false negative would skip the check for a full hour. A
           * genuinely offline `update()` costs one rejected fetch, which the catch already absorbs.
           */
          await registration?.update()
        } catch {
          // Offline or the check failed. The next tick retries.
        }
      }, UPDATE_POLL_INTERVAL_MS)
    },
  })

  return {
    applyWaitingUpdate: () => {
      /*
       * Another tab may already have activated the worker while this tab's banner was still visible.
       * Posting SKIP_WAITING with no waiting worker is a no-op, so reload immediately instead of
       * leaving the control disabled until its UI timeout. This controller keeps no acceptance flag:
       * stale state can therefore never make an unrelated later update reload unexpectedly.
       */
      if (registration && !registration.waiting) {
        dependencies.reload()
        return
      }

      void updateServiceWorker()
    },
  }
}

const serviceWorkerRegistrationController = createServiceWorkerRegistrationController({
  announceNewContent,
  register: registerSW,
  reload: () => window.location.reload(),
  setPollInterval: (callback, intervalMs) => setInterval(callback, intervalMs),
})

/**
 * Applies a waiting update. The claimed worker reloads every controlled tab so all clients and
 * caches move to the same build. Under `registerType: 'prompt'`, the worker still waits until one tab
 * explicitly accepts it.
 */
export const applyWaitingUpdate = () => {
  serviceWorkerRegistrationController.applyWaitingUpdate()
}
