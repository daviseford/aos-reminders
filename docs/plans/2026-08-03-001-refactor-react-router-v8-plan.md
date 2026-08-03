# React Router v5 → v8 upgrade plan

Issue: #1444 (opened against v6; the "waiting for types" blocker is long resolved — v6+
ships its own types and the `@types/react-router*` packages are gone).

Target: `react-router@8.3.0` (latest stable, 2026-07-22). `react-router-dom` is removed
in v8; everything imports from `react-router` (DOM-only APIs from `react-router/dom`).

## Why direct v5 → v8

The official guides recommend stepping major-by-major with future flags, but the flags
exist to de-risk large apps using data APIs (loaders, actions, fetchers, forms). This app
uses none of them: six routes, `Link`, one `useHistory`, one protected route, one custom
history object. The entire breaking surface is enumerated below, so a single jump is
smaller than two staged upgrades. v6→v7 and v7→v8 flag behaviors are simply the default
behavior in v8.

Prerequisites already met:

- React `19.2.8` (v8 needs `19.2.7+`) ✓
- Node `22.23.2` per `.nvmrc` (v8 needs `22.22+`) ✓
- Vite 7 is required only for framework mode, which this plan does not adopt.

## Current usage inventory (complete)

- `package.json` — `react-router-dom@5.3.0`, `@types/react-router-dom@5.3.3`,
  `@types/react-router@5.1.20`. The `history` package is transitive via
  react-router-dom v5 and disappears with it.
- `src/utils/history.ts` — shared `createBrowserHistory()` singleton. Delete.
- `src/components/App.tsx` — `<Router history={history}>`, `<Switch>`,
  `<Route component={...} exact>`, React.lazy route components, and
  `startPageViewTracking(history)`.
- `src/components/page/privateRoute.tsx` — `<Route component={withAuthenticationRequired(C)}>`.
- `src/components/input/importArmy/subscriberAction.tsx` — `useHistory().push(ROUTES.SUBSCRIBE)`.
- `src/main.tsx` — `history.replace(...)` in the Auth0 `onRedirectCallback`.
- `src/utils/analytics.ts` — `startPageViewTracking(routerHistory)` uses
  `history.location` and `history.listen`. Already structural-typed (`PageViewHistory`),
  so only the call site and tests change shape.
- Plain `<Link>` (API-compatible, no changes): `Profile.tsx`, `Faq.tsx`, `navbar.tsx`,
  `alreadySubscribed.tsx`, `suspenseFallbacks.tsx`. All `to` values are absolute
  (`ROUTES.*` or literals), so the v7 relative-splat/link changes are irrelevant.
- Tests: `src/tests/aos4/accountShell.test.tsx`, `accountRoutes.test.tsx`,
  `homePresentation.test.tsx` (mocks `useHistory`), `importUi.test.tsx`
  (`MemoryRouter` + `<Route path>children</Route>`), `src/tests/analytics.test.ts`
  (mocks `history.listen`).
- Untouched: `src/utils/shareLink.ts` and `src/utils/handleQueryParams.ts` use native
  `window.history`, not the `history` package.

## Steps

1. **Dependencies.** Remove `react-router-dom`, `@types/react-router`,
   `@types/react-router-dom`; add `react-router@8.3.0`. Confirm the `history` package
   is gone from the lockfile (nothing else depends on it).

2. **Route module.** Create `src/bootstrap/router.tsx` exporting a
   `createBrowserRouter` route table and the router singleton. Data mode is used only
   for its stable imperative API (`router.navigate`, `router.subscribe`) — no loaders,
   actions, or fetchers, so the data-API future flags do not apply. Keep the existing
   `React.lazy` + `<Suspense fallback={<LoadingBody />}>` wrapper as each route's
   element. Keep the `<main>` wrapper and per-route navbar comment from `App.tsx`.

   This replaces the v5 `<Router history>` pattern. Do **not** reach for
   `unstable_HistoryRouter` — the singleton router gives the same capabilities through
   supported APIs.

3. **`App.tsx`.** Render `<RouterProvider router={router} />` (imported from
   `react-router/dom`). Keep the analytics/checkout effect; feed page-view tracking
   from `router.subscribe` (step 6).

4. **`privateRoute.tsx`.** Element form:
   `const ProtectedProfile = withAuthenticationRequired(Profile)` then
   `{ path: ROUTES.PROFILE, element: <ProtectedProfile /> }` in the route table.
   Auth0's `withAuthenticationRequired` is router-agnostic; behavior unchanged.

5. **`subscriberAction.tsx`.** `useHistory()` → `useNavigate()`;
   `history.push(ROUTES.SUBSCRIBE)` → `navigate(ROUTES.SUBSCRIBE)`.

6. **Analytics.** Change `startPageViewTracking` to accept the router (or a minimal
   `{ location, subscribe }` structural type mirroring today's `PageViewHistory`) and
   use `router.subscribe(state => logPageView(state.location))`, keeping the initial
   `logPageView(router.state.location)` call. Update `src/tests/analytics.test.ts`
   mocks accordingly (`listen` → `subscribe`).

7. **`main.tsx`.** `onRedirectCallback` imports the router singleton and calls
   `router.navigate(appState?.returnTo || window.location.pathname, { replace: true })`.
   Delete `src/utils/history.ts`.

8. **Tests.**
   - `importUi.test.tsx`: `<Route path="/subscribe">...</Route>` → wrap in `<Routes>`
     with `element={...}` form.
   - `homePresentation.test.tsx`: mock `useNavigate` instead of `useHistory`.
   - `accountShell.test.tsx` / `accountRoutes.test.tsx`: `MemoryRouter` still exists in
     v8; only import source changes (`react-router`).
   - All imports: `react-router-dom` → `react-router`.

9. **AGENTS.md.** No router-specific entries exist; add `react-router` to the Phase 2
   "done" narrative only if the maintainers want the modernization list updated
   (one line under the package track paragraph).

10. **Verify.**
    - `yarn lint`, `yarn tsc --noEmit`, `yarn build`, `yarn test --run` (build before
      test per repo convention).
    - Manual smoke against the live-site baseline: every route (`/`, `/faq`, `/join`,
      `/redeem`, `/subscribe`, `/profile`), Auth0 login → `onRedirectCallback` return-to
      behavior, `/profile` guard redirect, subscribe redirect from the import flow,
      incoming share link (`main.tsx` capture → Home consume), and GA page-view firing
      on route change.
    - No visual changes are expected or permitted; this is an invisible upgrade.

11. **Issue #1444.** Comment that v8 superseded the v6 target, then close on merge.

## Risks

- **Auth0 return-to flow** is the only behavior that cannot be fully covered by unit
  tests; verify manually in dev before merging.
- **Router singleton timing**: `onRedirectCallback` must not fire before the singleton
  exists — it is created at module scope, so this is safe by construction.
- **Analytics parity**: the subscribe-based listener must fire exactly once per
  navigation (including the initial page view) to keep GA reporting identical; the
  existing `analytics.test.ts` expectations pin this.
- Two majors at once means reading three upgrade guides, but each non-applicable
  section (loaders, forms, fetchers, SSR, framework mode) is verifiably absent from
  this codebase via the inventory above.
