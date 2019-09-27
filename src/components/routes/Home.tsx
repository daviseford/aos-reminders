import React, { useEffect, Suspense, lazy } from 'react'
import { logPageView } from 'utils/analytics'
import { useSubscription } from 'context/useSubscription'
import ArmyBuilder from 'components/input/army_builder'
import { Header } from 'components/page/homeHeader'
import { Toolbar } from 'components/input/toolbar'

const AlliedArmies = lazy(() => import(/* webpackChunkName: 'ally_armies' */ 'components/input/ally_armies'))
const FooterComponent = lazy(() => import(/* webpackChunkName: 'footer' */ 'components/page/footer'))
const PrintArmy = lazy(() => import(/* webpackChunkName: 'printArmy' */ 'components/print/printArmy'))
const PrintFooter = lazy(() => import(/* webpackChunkName: 'printFooter' */ 'components/print/printFooter'))
const Reminders = lazy(() => import(/* webpackChunkName: 'reminders' */ 'components/info/reminders'))

const Home: React.FC = () => {
  const { getSubscription } = useSubscription()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  return (
    <>
      <Header />

      <ArmyBuilder />

      <Suspense fallback={<></>}>
        <AlliedArmies />
      </Suspense>

      <Toolbar />

      <Suspense fallback={<></>}>
        <Reminders />

        <PrintArmy />

        <PrintFooter />

        <FooterComponent />
      </Suspense>
    </>
  )
}

export default Home
