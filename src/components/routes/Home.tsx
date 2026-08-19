import { LoadingArmy, OfflineArmy } from 'components/helpers/suspenseFallbacks'
import Footer from 'components/page/footer'
import { ArmyCollectionProvider } from 'context/useArmyCollection'
import { Component, lazy, Suspense, type ReactNode } from 'react'

/*
 * Home is the catalog-free shell. Everything shaped `f(catalog, …)` — the masthead's faction data,
 * the builder, the toolbar, the reminders, and the modals — sits in the child behind this boundary,
 * so nothing in the route chunk's static import graph reaches the rules corpus.
 */
const HomeCatalogBound = lazy(() => import('components/routes/HomeCatalogBound'))

/*
 * The one class component here, because React exposes error boundaries only as
 * `getDerivedStateFromError`/`componentDidCatch` and has no hook form of either.
 *
 * It exists because the split changes what a failed catalog looks like. Before it, a catalog that
 * would not load took Home down with it and the router's own fallback said so. Behind `lazy()`, a
 * chunk that fails to fetch — a dropped connection mid-load, a deploy that retired the asset the
 * open tab is still asking for — would leave chrome that looks complete and silently never produce
 * a reminder. The failure goes back where the builder and reminders belong instead.
 */
class CatalogBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? <OfflineArmy /> : this.props.children
  }
}

const Home = () => (
  <ArmyCollectionProvider>
    <div>
      <CatalogBoundary>
        <Suspense fallback={<LoadingArmy />}>
          <HomeCatalogBound />
        </Suspense>
      </CatalogBoundary>

      <Footer />
    </div>
  </ArmyCollectionProvider>
)

export default Home
