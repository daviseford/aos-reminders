import { LocalStoredArmy } from 'utils/localStore'
import { logClick } from 'utils/analytics'

export const installNewWorker = async (reload = false) => {
  try {
    const nav = navigator || window.navigator

    if (nav && nav.serviceWorker) {
      const waitingServiceWorker = await nav.serviceWorker.ready

      if (waitingServiceWorker.waiting) {
        if (reload) logClick('ReloadContentButton')
        if (reload) LocalStoredArmy.set() // Save anything we're working on
        waitingServiceWorker.waiting.postMessage({ type: 'SKIP_WAITING' })
        if (reload) window.location.reload()
      }
    }
  } catch (err) {
    console.error(err)
  }
}
