export const installNewWorker = async () => {
  try {
    if (window.navigator && window.navigator.serviceWorker) {
      const waitingServiceWorker = await window.navigator.serviceWorker.ready

      if (waitingServiceWorker.waiting) {
        waitingServiceWorker.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    }
  } catch (err) {
    console.error(err)
  }
}
