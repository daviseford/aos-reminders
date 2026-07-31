/*
 * Emergency rollback worker.
 *
 * This file is never registered by the app. It is copied into the build output
 * like any other `public/` asset and published inert at its own path; nothing
 * fetches it there. To un-ship a bad service worker you promote it by hand over
 * the top of `/service-worker.js` -- see "Rolling back the service worker" in
 * docs/deployment.md. It is excluded from the precache so a broken worker cannot
 * pin a stale copy of its own escape hatch.
 *
 * A service worker persists on clients until it is explicitly replaced or
 * unregistered, so a broken one cannot be fixed by redeploying the app alone.
 * Uploading this file to the worker's own path replaces it: clients pick it up
 * on their next update check, drop every cache, unregister, and fall back to
 * plain network delivery.
 *
 * It takes control immediately -- skipWaiting plus clients.claim -- because a
 * rollback that waits for every tab to close is not a rollback.
 */

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // Claim first: skipWaiting alone only takes over clients that already had a controller, and a
      // rollback that leaves some windows behind is not a rollback.
      await self.clients.claim()

      const names = await caches.keys()
      await Promise.all(names.map(name => caches.delete(name).catch(() => {})))
      await self.registration.unregister()

      // includeUncontrolled so a window loaded before this worker took over is reloaded too.
      // navigate() rejects for a client this worker no longer controls, which the unregister above
      // makes likely -- swallow it rather than raising inside the escape hatch.
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      await Promise.all(clients.map(client => client.navigate(client.url).catch(() => {})))
    })()
  )
})

// No fetch handler: with none registered, navigations go straight to the
// network even before the unregister lands.
