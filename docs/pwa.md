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
| Update install | `src/components/info/installingUpdate.tsx`, mounted once in `src/components/App.tsx` for every route |
| Emergency rollback | `public/rollback-service-worker.js` — see docs/deployment.md |
| Build assertions | `src/tests/pwaBuild.test.ts` |

The worker is named `service-worker.js`, not the plugin's default `sw.js`.
Clients that still hold the pre-Vite CRA registration poll that exact path, so
keeping the name is what takes those registrations over rather than orphaning
them. **Do not rename it.**

The generated worker accepts only the versioned activation message in
`src/bootstrap/serviceWorkerProtocol.ts`, not Workbox's generic `SKIP_WAITING` token. This keeps
pre-Vite CRA tabs from activating the replacement worker before the new app has shown its
"Installing updates" modal. Once a tab asks, a short-lived origin-wide marker plus an unconditional
`controllerchange` listener reloads every controlled tab, including one opened after the install
began but before activation.

## How an update lands

Updates install automatically, with no prompt and no click (#2046):

1. The hourly `registration.update()` (or a fresh load) finds a new worker, which installs and
   waits. The registration announces it with the `hasNewContent` window event and on the
   `app-update` `BroadcastChannel`, so **every open tab on the origin** hears it, not just the one
   whose poll found it.
2. In each tab, `InstallingUpdate` opens a modal reading "Installing updates, one moment". It has no
   close button, and Escape and backdrop clicks do nothing: it is open exactly while
   `hasNewContent` is true, and only a reload ends that. Its overlay carries
   `INSTALLING_UPDATE_Z_INDEX` (2000). react-modal appends this modal's portal when the app
   mounts, so without it any Save/Import/Print/Share/checkout modal opened later would paint over
   the install, as would the loading splash (1050) and Bootstrap's layers (up to 1090). A test reads
   `src/css/index.scss` and fails if anything there is pinned higher.
3. Once the modal has rendered, its effect calls `applyWaitingUpdate`. Starting activation there,
   rather than inside the registration callback, is what keeps a tab from reloading before it has
   said why. Each tab posts the private activation message itself. The generated handler only calls
   `skipWaiting()`, so duplicate posts from several tabs are harmless, and a tab never starts a
   second install of its own.
4. The worker takes control and every tab reloads onto the new build. See "Every install ends in a
   reload" under Gotchas for the deadlines.

**Nothing defers this.** An update installs and reloads regardless of what the player is doing: an
open save, import, share, print or checkout modal, or a half-typed field. The army document, notes
and ordering are persisted to `localStorage` on every change and survive the reload. Anything else
not yet submitted (a save-army name, an import paste, a checkout in progress) is lost. That is the
accepted cost of automatic updates, not a defect. Do not add a "wait until the user finishes" branch.

The generated corpus ships as **two** chunks, both excluded from the precache and
served by one `CacheFirst` runtime route. `aos4-catalog-data` is the catalog the
reminders surface renders from (~6.4 MiB); `aos4-catalog-data-sources` is the
source records behind each reminder's source menu (~7.1 MiB), fetched the first
time a player opens one. Both are far above Workbox's 2 MiB ceiling, and
precaching either would download it before the worker could activate — the worst
case on exactly the bad venue wifi that makes offline support worth having.

The second name extends the first deliberately: the precache glob, the
runtime-cache route, and the build assertions all match on the
`aos4-catalog-data` prefix, so one naming choice covers both.

The immutable `sw-extras-<content-hash>.js` warms the **catalog** URL on
`install`, so taking an update never leaves a user one online fetch short of
working army data. Install is the right event because it is the only one that can
be refused: a rejected `install` aborts the update and leaves the client on its
previous worker, which still has its own catalog cached and still works offline.
Warming on `activate` would commit the client to a build it cannot run offline,
because activation cannot be refused. A failed warm therefore means "this update
did not land", and the hourly poll retries.

The **source records** warm on `install` too, but under a *caught* `waitUntil`:
the lifetime extension stops the browser terminating the worker mid-fetch (a
fire-and-forget warm could be killed silently, and install never re-fires for
that build), while the catch keeps best-effort data from aborting an update the
catalog warm survived. Blocking the whole update on data most sessions never
open would widen the abort surface out of proportion to what it protects. A
failed warm just means the first source menu fetches over the network; the
`CacheFirst` route still populates the cache on that first real use.

`activate` keeps only cheap, fault-tolerant work — pruning the catalog cache to
the current build's two URLs and deleting the CRA-era `images` cache. Nothing
slow belongs there: activation holds fetch events until `waitUntil` settles, and
the page reloads the moment the worker takes control, so a download on that path
would leave the reload on a blank screen.

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
   `clientsClaim` claims the current page; prompt mode still prevents an update
   worker from activating until the app asks for it.
2. Stop the preview server.
3. Reload. The shell should render, the faction selector should populate, and
   `fetch('/assets/aos4-catalog-data-*.js')` should return 200 from cache.

### Automatic update

1. Build, `npx vite preview --port 4173`, and open the app in **two** tabs (one on
   home, one on `/faq`). Reload each once so a worker is controlling.
2. In the home tab, open Save Army or Import Army and type something into it.
   Leave that modal open.
3. Change something the build hashes (rendered copy or `index.html`) and rebuild.
   The preview server serves the new `dist/` without a restart.
4. In either tab's console, run
   `(await navigator.serviceWorker.getRegistration()).update()`. This is what the
   hourly poll does.
5. With **no interaction at all**, both tabs should show the "Installing updates,
   one moment" modal over whatever was on screen, including the open Save/Import
   modal. There is no close button, and Escape and clicking the dark backdrop do
   nothing.
6. Within a few seconds both tabs reload onto the new build (check the changed
   copy). The army in progress is intact; the text typed in step 2 is gone, as
   intended.
7. Backgrounded tabs: on a phone with the app installed, background it, deploy a
   build to a non-production stage, wait for the hourly poll or reopen after more
   than an hour, and note whether the modal is visible before the reload. A tab
   the browser froze can receive the announcement and the worker takeover together
   on wake, so this ordering cannot be proven from source.

Note that a source file whose only change is dead code will not produce a new
worker: Rollup tree-shakes it back out, the precache manifest is unchanged, and
the browser's byte-comparison finds nothing to install. Change something that
reaches the output — `index.html`, or rendered copy.

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

- **`prompt`, not `autoUpdate`, even though updates are automatic.**
  `autoUpdate` reloads the page with no explanation, which read as a bug when
  #1886 shipped it (reverted in #1926). Prompt mode leaves the trigger with the
  app, so the modal renders first and then starts activation. `clientsClaim`
  does not change that waiting policy: it claims clients only after a tab posts
  the private activation message.
- **Every install ends in a reload.** Every path through `applyWaitingUpdate`
  has to terminate, because the modal cannot be dismissed. A tab
  with no registration of its own reloads immediately rather than posting into
  the void. Otherwise it posts the activation message, watches both
  `controllerchange` *and* the worker's own `statechange` — a claim does not
  always reach the client that asked — and if neither has reloaded the tab
  within `ACTIVATION_TIMEOUT_MS`, posts once more and then reloads regardless.
  Do not collapse this back to a single post, and do not restore a branch that
  returns without doing anything.

  On 2026-08-04 a production tab posted the message to a worker that had been
  waiting thirteen minutes and never saw a controller change; the button sat on
  "Reloading..." indefinitely. A worker idle that long has been terminated, so
  the retry exists on the theory that the first message was spent cold-starting
  it. That cause is unconfirmed — the unconditional reload is the part that is
  guaranteed to end the wait.

  The modal adds one deadline of its own, `INSTALL_FALLBACK_RELOAD_MS` (15s),
  as a last guarantee. It should never be the path that fires.

  A stalled install reloads onto the old build, where the same waiting worker
  is found again, so unbounded retrying would be a reload loop. When the last
  deadline passes with the worker still `installed`, the tab records the stall
  in `sessionStorage`. A worker already `activating` or `activated` is a
  success whose events have not arrived yet, so it is not recorded, and a load
  that finds nothing waiting clears any record. After a stall the update is still
  announced, but the modal stays shut for the rest of `INSTALL_STALL_BACKOFF_MS`
  (10 minutes) and then opens on its own in the same page. The tab stays usable on
  its current build meanwhile. This is failure backoff, not a deferral for what
  the player is doing, and it is per tab: other tabs still install.
- **Rollback tabs never install.** A tab carrying the rollback marker has no
  registration controller, and the modal does not open there even when another
  tab announces an update, so nothing covers or reloads a tab mid-rollback.
  One bounded race remains, described under "Rolling back the service worker" in
  docs/deployment.md.
- **Legacy clients lag.** A client still controlled by the CRA worker is served a
  stale shell, so it runs no current code and cannot show the modal. It recovers
  when its last tab closes. Do not restore the generic `SKIP_WAITING` activation
  token or add an eager `skipWaiting` call — either would reload tabs before the
  modal has explained why.
- **Two writers, one cache.** `sw-extras-<content-hash>.js` owns the
  `aos4-catalog` cache and
  prunes it. Do not add an `ExpirationPlugin` to the runtime route as well;
  writing to a Workbox-managed cache directly corrupts its bookkeeping.
