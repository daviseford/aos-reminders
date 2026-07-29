import { LoadingBody } from 'components/helpers/suspenseFallbacks'
import ProtectedRoute from 'components/page/privateRoute'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { ROUTES } from 'utils/env'
import { handleStripeCheckout } from 'utils/handleQueryParams'
import history from 'utils/history'

const Faq = lazy(() => import('components/routes/Faq'))
const Home = lazy(() => import('components/routes/Home'))
const Join = lazy(() => import('components/routes/Join'))
const Profile = lazy(() => import('components/routes/Profile'))
const Redeem = lazy(() => import('components/routes/Redeem'))
const Subscribe = lazy(() => import('components/routes/Subscribe'))

const App = () => {
  useEffect(() => {
    handleStripeCheckout()
  }, [])

  return (
    <div className="d-block">
      <Router history={history}>
        {/* Each route renders its own navbar, so <main> wraps the whole routed tree. */}
        <main>
          <Suspense fallback={<LoadingBody />}>
            <Switch>
              <Route path={ROUTES.HOME} exact component={Home} />
              <Route path={ROUTES.FAQ} component={Faq} />
              <Route path={ROUTES.JOIN} component={Join} />
              <Route path={ROUTES.REDEEM} component={Redeem} />
              <Route path={ROUTES.SUBSCRIBE} component={Subscribe} />
              <ProtectedRoute path={ROUTES.PROFILE} component={Profile} />
            </Switch>
          </Suspense>
        </main>
      </Router>
    </div>
  )
}

export default App
