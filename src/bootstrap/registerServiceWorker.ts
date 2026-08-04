import { registerSW } from 'virtual:pwa-register'
import {
  SERVICE_WORKER_ACTIVATION_MESSAGE,
  SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY,
  SERVICE_WORKER_ROLLBACK_QUERY_PARAM,
  SERVICE_WORKER_UPDATE_ACCEPTANCE_MAX_AGE_MS,
  SERVICE_WORKER_UPDATE_ACCEPTED_STORAGE_KEY,
} from './serviceWorkerProtocol'

export type { RegisterSWOptions } from 'virtual:pwa-register'

/*
 * A standalone PWA left open at a game table never performs a full navigation, so it would otherwise
 * never notice a new build within a session. An hourly registration.update() closes that window --
 * and it is also what brings the update banner back after a user dismisses it, since dismissal is
 * component-local and deliberately does not discard the waiting worker.
 */
const UPDATE_POLL_INTERVAL_MS = 60 * 60 * 1000

/*
 * How long an accepted update has to take control before the accept escalates.
 *
 * Two of these elapse between the click and an unconditional reload: one before the activation
 * message is retried, one before the tab reloads without it. Activation normally claims the tab in
 * well under a second, so this is not a timing budget -- it is the deadline after which the accept
 * is honoured some other way. Long enough that a cold worker start on a phone finishes first, short
 * enough that the control does not sit on "Reloading..." waiting for something that is not coming.
 */
export const ACTIVATION_TIMEOUT_MS = 5 * 1000

type RegisterServiceWorker = typeof registerSW

interface ServiceWorkerRegistrationDependencies {
  announceNewContent: () => void
  listenForControllerChange: (callback: () => void) => void
  listenForWorkerStateChange: (worker: ServiceWorker, callback: () => void) => void
  markUpdateAccepted: () => void
  register: RegisterServiceWorker
  reload: () => void
  setActivationTimeout: (callback: () => void, delayMs: number) => unknown
  setPollInterval: (callback: () => Promise<void>, intervalMs: number) => unknown
  wasUpdateAccepted: () => boolean
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

const markUpdateAccepted = () => {
  try {
    localStorage.setItem(SERVICE_WORKER_UPDATE_ACCEPTED_STORAGE_KEY, String(Date.now()))
  } catch {
    // onNeedReload still reloads tabs that observed the waiting worker when storage is unavailable.
  }
}

const wasUpdateAccepted = () => {
  try {
    const acceptedAt = Number(localStorage.getItem(SERVICE_WORKER_UPDATE_ACCEPTED_STORAGE_KEY))
    const age = Date.now() - acceptedAt
    return (
      Number.isFinite(acceptedAt) &&
      acceptedAt > 0 &&
      age >= 0 &&
      age <= SERVICE_WORKER_UPDATE_ACCEPTANCE_MAX_AGE_MS
    )
  } catch {
    return false
  }
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
  let reloadStarted = false

  const reloadOnce = () => {
    if (reloadStarted) return
    reloadStarted = true
    dependencies.reload()
  }

  /*
   * Unlike vite-plugin-pwa's `controlling` callback, this listener is installed even when this tab
   * opened after another tab accepted the update. The short-lived origin-wide marker distinguishes
   * that requested takeover from an unrelated controller change.
   */
  dependencies.listenForControllerChange(() => {
    if (dependencies.wasUpdateAccepted()) reloadOnce()
  })

  dependencies.register({
    onNeedRefresh: dependencies.announceNewContent,
    /*
     * In prompt mode vite-plugin-pwa attaches this callback to `controlling` only after a waiting
     * worker has raised onNeedRefresh. The worker still cannot take control until a tab explicitly
     * posts the private activation message, so clientsClaim does not create an unsolicited reload.
     * Once one tab does accept, every tab that saw that waiting worker reloads onto the claimed
     * build; no old client remains paired with caches that the new worker has already pruned.
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

  /*
   * Asks one waiting worker to take over.
   *
   * `controllerchange` is the signal this is expected to come back on, but it only fires if the
   * worker's claim actually reaches this client. Watching the worker's own state as well means an
   * activation that never claims this tab still reloads it.
   */
  const requestActivation = (waiting: ServiceWorker) => {
    dependencies.markUpdateAccepted()
    dependencies.listenForWorkerStateChange(waiting, () => {
      if (waiting.state === 'activated') reloadOnce()
    })
    waiting.postMessage({ type: SERVICE_WORKER_ACTIVATION_MESSAGE })
  }

  return {
    applyWaitingUpdate: () => {
      /*
       * Nothing of ours to activate. Either another tab already activated the worker while this
       * tab's banner was still up, or this tab never got a registration at all -- `register()` waits
       * for the window `load` event before it resolves, registration can fail outright, and
       * `announceNewContent` broadcasts to every tab on the origin, so a tab can be showing the
       * prompt on the strength of another tab's waiting worker.
       *
       * Reload either way. This used to `return` in the no-registration case, leaving the control
       * reading "Reloading..." with nothing behind it and no path out.
       */
      if (!registration?.waiting) {
        reloadOnce()
        return
      }

      requestActivation(registration.waiting)

      dependencies.setActivationTimeout(() => {
        /*
         * Nothing took control inside the window. A worker that has been waiting more than a few
         * seconds has been terminated for idleness, so the first message had to cold-start it before
         * it could be handled; ask again now that it is warm. This is a mitigation, not a diagnosis
         * -- observed in production on 2026-08-04, where a tab posted the activation message to a
         * worker that had been waiting thirteen minutes and never saw a controller change.
         */
        if (registration?.waiting) requestActivation(registration.waiting)

        /*
         * And reload regardless when the second window closes. The user asked for a reload, the army
         * document is already persisted, and a page that comes back still on the old build is far
         * better than a control that says "Reloading..." forever.
         */
        dependencies.setActivationTimeout(reloadOnce, ACTIVATION_TIMEOUT_MS)
      }, ACTIVATION_TIMEOUT_MS)
    },
  }
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

const serviceWorkerRegistrationController = !registrationIsDisabledForRollback()
  ? createServiceWorkerRegistrationController({
      announceNewContent,
      listenForControllerChange: callback =>
        navigator.serviceWorker?.addEventListener('controllerchange', callback),
      listenForWorkerStateChange: (worker, callback) => worker.addEventListener('statechange', callback),
      markUpdateAccepted,
      register: registerSW,
      reload: () => window.location.reload(),
      setActivationTimeout: (callback, delayMs) => setTimeout(callback, delayMs),
      setPollInterval: (callback, intervalMs) => setInterval(callback, intervalMs),
      wasUpdateAccepted,
    })
  : undefined

/**
 * Applies a waiting update. The claimed worker reloads every controlled tab so all clients and
 * caches move to the same build. Under `registerType: 'prompt'`, the worker still waits until one tab
 * explicitly accepts it.
 */
export const applyWaitingUpdate = () => {
  serviceWorkerRegistrationController?.applyWaitingUpdate()
}
