import { router } from '../bootstrap/router'
import { CheckoutOutcomeBanner } from 'components/info/banners/checkout_outcome_banner'
import { InstallingUpdate } from 'components/info/installingUpdate'
import { useEffect, useSyncExternalStore } from 'react'
import { RouterProvider } from 'react-router/dom'
import { initializeAnalytics, startPageViewTracking } from 'utils/analytics'
import { useCheckoutOutcome } from 'utils/checkoutOutcome'
import { ROUTES } from 'utils/env'
import { handleStripeCheckout } from 'utils/handleQueryParams'

/*
 * The banner slot for every route except Home, which owns its own under the masthead. A return from
 * checkout takes the slot: a gift purchase returns to /profile, so this is the only place that
 * confirmation can appear.
 */
const RouteBanner = () => {
  const outcome = useCheckoutOutcome()
  return outcome ? <CheckoutOutcomeBanner /> : null
}

/*
 * App sits outside <RouterProvider>, so the router hooks are unavailable here. The data router is a
 * module singleton and exposes the same subscription analytics page-view tracking already uses.
 */
const subscribeToRouter = (onStoreChange: () => void) => router.subscribe(onStoreChange)
const getPathname = () => router.state.location.pathname

const App = () => {
  const pathname = useSyncExternalStore(subscribeToRouter, getPathname)

  useEffect(() => {
    initializeAnalytics()
    handleStripeCheckout()
    return startPageViewTracking(router)
  }, [])

  return (
    <div className="d-block">
      {/*
        One mount for every route, Home included: an update installs behind a modal rather than
        occupying a banner slot (#2046). Mounted here rather than in the navbar, which early-returns
        <OfflineHeader /> while offline -- exactly when a waiting worker can still need applying.
      */}
      <InstallingUpdate />
      {/* Home owns a banner slot under its masthead, so this covers only the other routes. */}
      {pathname !== ROUTES.HOME && <RouteBanner />}
      {/* Each route renders its own navbar, so <main> wraps the whole routed tree. */}
      <main>
        <RouterProvider router={router} />
      </main>
    </div>
  )
}

export default App
