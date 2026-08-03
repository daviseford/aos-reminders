# PWA install and offline support

AoS Reminders is installable and works offline after one online visit. This
page covers how that is put together and, more importantly, what has to be
checked by hand.

## Shape

| Piece | Where |
|---|---|
| Web app manifest | `public/site.webmanifest`, linked from `index.html` |
| Icons | `public/android-chrome-{192,512}.png`, `public/maskable-icon-512x512.png` |
| Worker config | `vite.config.mts` (`VitePWA`, `generateSW`) |
| Activation extras | generated `sw-extras-<content-hash>.js` — see the `service-worker-extras` plugin in `vite.config.mts` |
| Registration | `src/bootstrap/registerServiceWorker.ts` |
| Update flow | `registerType: 'autoUpdate'` in `vite.config.mts`; no user-facing prompt |
| Emergency rollback | `public/rollback-service-worker.js` — see docs/deployment.md |
| Build assertions | `src/tests/pwaBuild.test.ts` |

The worker is named `service-worker.js`, not the plugin's default `sw.js`.
Clients that still hold the pre-Vite CRA registration poll that exact path, so
keeping the name is what takes those registrations over rather than orphaning
them. **Do not rename it.**

Updates are automatic (`registerType: 'autoUpdate'`). A newly installed worker
calls `skipWaiting()` itself, claims every controlled tab, and the plugin's
register module reloads each tab onto the new build — no banner, no prompt. The
reload is safe mid-session because all army state persists to localStorage; it
costs scroll position at most.

The generated catalog chunk is excluded from the precache and served by a
`CacheFirst` runtime route instead. It is 11.6 MiB against Workbox's 2 MiB
ceiling, and precaching it would download the whole catalog before the worker
could activate — the worst case on exactly the bad venue wifi that makes offline
support worth having.

The immutable `sw-extras-<content-hash>.js` warms the current build's URL **on `install`**, so taking an update
never leaves a user one online fetch short of working army data. Install is the
right event because it is the only one that can be refused: a rejected `install`
aborts the update and leaves the client on its previous worker, which still has
its own catalog cached and still works offline. Warming on `activate` would
commit the client to a build it cannot run offline, because activation cannot be
refused. A failed warm therefore means "this update did not land", and the hourly
poll retries.

`activate` keeps only cheap, fault-tolerant work — pruning the catalog cache to
the current build and deleting the CRA-era `images` cache. Nothing slow belongs
there: activation holds fetch events until `waitUntil` settles, and the page
reloads the moment the worker takes control, so a download on that path would
leave the reload on a blank screen.

## What CI checks

`src/tests/pwaBuild.test.ts` asserts manifest fields, icon existence, worker
location, precache contents, the catalog exclusion, the single immutable extras
import, the catalog response gate, client claiming, and that no API origin
appears in the worker. It reads `dist/`, so **CI builds before it tests** and
`prepush` does the same.

## What CI cannot check

**There is no maintained tool that answers "is this installable" in CI.**
Lighthouse removed its PWA category in 12.0.0 and no current release carries an
installability or maskable-icon audit. Treat the list below as the real gate.

### Installability

1. `yarn build && npx vite preview --port 4173`
2. Open `http://127.0.0.1:4173/` in Chrome (localhost counts as a secure context)
3. DevTools → Application → Manifest. Expect no installability errors, and check
   the maskable icon preview in the masked shape rather than trusting the file.
4. Confirm the install affordance appears in the omnibox.

### Offline

The honest version of this test is to kill the origin, not to tick "offline" in
DevTools:

1. Load the app once online and wait for the worker to activate and take control.
   `clientsClaim` claims the current page.
2. Stop the preview server.
3. Reload. The shell should render, the faction selector should populate, and
   `fetch('/assets/aos4-catalog-data-*.js')` should return 200 from cache.

### Automatic update

1. Build, load, and reload so a worker is controlling.
2. Change something the build hashes (any source file), rebuild.
3. Call `registration.update()` — this is what the hourly poll does.
4. The new worker installs, warms the catalog, activates, and every open
   controlled tab reloads itself onto the new build. No banner should appear.

### Cache contents

Application → Cache Storage should hold exactly two caches:
`workbox-precache-v2-<origin>/` and `aos4-catalog`. If anything else appears —
particularly a response from Auth0, the army API, or the subscription API — that
is a defect: caches are origin-scoped, not per-user, and outlive a session.

### iOS

Add to Home Screen on a real device, confirm the standalone launch and icon,
then re-check after several days. Whether current iOS still evicts
script-writable storage for infrequently opened home-screen web apps could not be
confirmed against an Apple or WebKit source, so it is worth watching. A cold
cache must degrade to "needs one online load", never to a broken app.

## Gotchas

- **`autoUpdate`, not `prompt`.** The app reloads itself onto a new build the
  moment the updated worker activates — mid-session if the hourly poll lands
  then. That trade-off is deliberate: all army state persists to localStorage,
  so the reload costs scroll position at most. Do not reintroduce a waiting
  prompt without an explicit product decision.
- **Legacy clients lag.** A client still controlled by the pre-Vite CRA worker
  runs no current code and is served a stale shell. The replacement worker's
  `skipWaiting` + `clientsClaim` takes it over as soon as the update lands;
  until then it cannot be reached by anything this build does.
- **Two writers, one cache.** `sw-extras-<content-hash>.js` owns the
  `aos4-catalog` cache and
  prunes it. Do not add an `ExpirationPlugin` to the runtime route as well;
  writing to a Workbox-managed cache directly corrupts its bookkeeping.
