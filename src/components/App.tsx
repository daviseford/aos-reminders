import { router } from '../bootstrap/router'
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
      {/* Each route renders its own navbar, so <main> wraps the whole routed tree. */}
      <main>
        <RouterProvider router={router} />
      </main>
    </div>
  )
}

export default App
