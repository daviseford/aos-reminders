import { router } from '../bootstrap/router'
import { CheckoutOutcomeBanner } from 'components/info/banners/checkout_outcome_banner'
import { UpdateAvailable } from 'components/info/updateAvailable'
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
  if (outcome) return <CheckoutOutcomeBanner />
  return <UpdateAvailable />
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
        Home owns a banner slot under its masthead and renders the prompt there itself, so this
        instance covers only the routes that have nowhere better to put it. Mounted here rather than
        in the navbar: Navbar early-returns <OfflineHeader /> while offline, which would hide the
        prompt exactly when a client has a waiting worker and loses the network.
      */}
      {pathname !== ROUTES.HOME && <RouteBanner />}
      {/* Each route renders its own navbar, so <main> wraps the whole routed tree. */}
      <main>
        <RouterProvider router={router} />
      </main>
    </div>
  )
}

export default App
