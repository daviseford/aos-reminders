/*
 * Emergency rollback worker.
 *
 * This file is never registered by the app and is not part of the build output.
 * It is deployed by hand, over the top of `/service-worker.js`, to un-ship a bad
 * service worker -- see "Rolling back the service worker" in docs/deployment.md.
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
      const names = await caches.keys()
      await Promise.all(names.map(name => caches.delete(name)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach(client => client.navigate(client.url))
    })()
  )
})

// No fetch handler: with none registered, navigations go straight to the
// network even before the unregister lands.
