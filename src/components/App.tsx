import { router } from '../bootstrap/router'
import { UpdateAvailable } from 'components/info/updateAvailable'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router/dom'
import { initializeAnalytics, startPageViewTracking } from 'utils/analytics'
import { handleStripeCheckout } from 'utils/handleQueryParams'

const App = () => {
  useEffect(() => {
    initializeAnalytics()
    handleStripeCheckout()
    return startPageViewTracking(router)
  }, [])

  return (
    <div className="d-block">
      {/*
        Mounted here rather than in the navbar: Navbar early-returns <OfflineHeader /> while
        offline, which would hide the prompt exactly when a client has a waiting worker and loses
        the network. This sits above <main> so it appears on every route.
      */}
      <UpdateAvailable />
      {/* Each route renders its own navbar, so <main> wraps the whole routed tree. */}
      <main>
        <RouterProvider router={router} />
      </main>
    </div>
  )
}

export default App
