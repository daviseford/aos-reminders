import { LoadingBody } from 'components/helpers/suspenseFallbacks'
import { protectedRoute } from 'components/page/privateRoute'
import type { ComponentType, ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { ROUTES } from 'utils/env'

const Changelog = lazy(() => import('components/routes/Changelog'))
const Faq = lazy(() => import('components/routes/Faq'))
const Home = lazy(() => import('components/routes/Home'))
const Join = lazy(() => import('components/routes/Join'))
const Profile = lazy(() => import('components/routes/Profile'))
const Redeem = lazy(() => import('components/routes/Redeem'))
const Subscribe = lazy(() => import('components/routes/Subscribe'))

/*
 * React Router v5 wrapped the whole <Switch> in one <Suspense>; a data router renders each route
 * element directly, so every lazy screen keeps its own fallback boundary with the same LoadingBody.
 */
const lazyScreen = (Screen: ComponentType): ReactNode => (
  <Suspense fallback={<LoadingBody />}>
    <Screen />
  </Suspense>
)

/*
 * The router is a module singleton so code outside the React tree — the Auth0 redirect callback
 * in main.tsx and analytics page-view tracking in App.tsx — can navigate and subscribe through
 * stable data-router APIs instead of the retired v5 custom-history object.
 */
export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: lazyScreen(Home) },
  { path: ROUTES.CHANGELOG, element: lazyScreen(Changelog) },
  { path: ROUTES.FAQ, element: lazyScreen(Faq) },
  { path: ROUTES.JOIN, element: lazyScreen(Join) },
  { path: ROUTES.REDEEM, element: lazyScreen(Redeem) },
  { path: ROUTES.SUBSCRIBE, element: lazyScreen(Subscribe) },
  { path: ROUTES.PROFILE, element: lazyScreen(protectedRoute(Profile)) },
])
