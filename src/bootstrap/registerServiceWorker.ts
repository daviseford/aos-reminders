import { registerSW } from 'virtual:pwa-register'
import {
  SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY,
  SERVICE_WORKER_ROLLBACK_QUERY_PARAM,
} from './serviceWorkerProtocol'

export type { RegisterSWOptions } from 'virtual:pwa-register'

/*
 * A standalone PWA left open at a game table never performs a full navigation, so it would otherwise
 * never notice a new build within a session. An hourly registration.update() closes that window.
 * Under `registerType: 'autoUpdate'` a found update activates on its own and every controlled tab
 * reloads, so the poll is the whole update path.
 */
const UPDATE_POLL_INTERVAL_MS = 60 * 60 * 1000

type RegisterServiceWorker = typeof registerSW

interface ServiceWorkerRegistrationDependencies {
  register: RegisterServiceWorker
  reload: () => void
  setPollInterval: (callback: () => Promise<void>, intervalMs: number) => unknown
}

interface RollbackRegistrationDependencies {
  search: string
  sessionStorage: Pick<Storage, 'getItem' | 'setItem'>
}

export const shouldDisableServiceWorkerRegistration = ({
  search,
  sessionStorage,
}: RollbackRegistrationDependencies) => {
  try {
    if (new URLSearchParams(search).get(SERVICE_WORKER_ROLLBACK_QUERY_PARAM) === '1') {
      sessionStorage.setItem(SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY, '1')
    }

    return sessionStorage.getItem(SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY) === '1'
  } catch {
    /*
     * Storage can be unavailable in hardened/private contexts. The query marker still has to stop
     * the immediate unregister/navigate/register loop even if the per-session persistence fails.
     */
    return new URLSearchParams(search).get(SERVICE_WORKER_ROLLBACK_QUERY_PARAM) === '1'
  }
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
  let reloadStarted = false

  const reloadOnce = () => {
    if (reloadStarted) return
    reloadStarted = true
    dependencies.reload()
  }

  dependencies.register({
    /*
     * In autoUpdate mode the plugin's register module fires this from workbox-window's `activated`
     * event when the activating worker is an update (or an external takeover, e.g. the rollback
     * worker). Every controlled tab gets the event, so every tab reloads onto the claimed build;
     * no old client remains paired with caches that the new worker has already pruned.
     */
    onNeedReload: reloadOnce,
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
}

const registrationIsDisabledForRollback = () => {
  if (typeof window === 'undefined') return true

  try {
    return shouldDisableServiceWorkerRegistration({
      search: window.location.search,
      sessionStorage: window.sessionStorage,
    })
  } catch {
    // Accessing the sessionStorage object itself can throw before the pure guard receives it.
    return new URLSearchParams(window.location.search).get(SERVICE_WORKER_ROLLBACK_QUERY_PARAM) === '1'
  }
}

if (!registrationIsDisabledForRollback()) {
  createServiceWorkerRegistrationController({
    register: registerSW,
    reload: () => window.location.reload(),
    setPollInterval: (callback, intervalMs) => setInterval(callback, intervalMs),
  })
}
