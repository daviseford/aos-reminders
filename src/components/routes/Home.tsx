import React, { useEffect, Suspense, lazy } from 'react'
import { logPageView } from 'utils/analytics'
import { useSubscription } from 'context/useSubscription'
import { Header } from 'components/page/homeHeader'
import { LargeSpinner } from 'components/helpers/suspenseFallbacks'
import { NotificationBanner } from 'components/info/notification_banner'

const ArmyBuilder = lazy(() => import(/* webpackChunkName: 'army_builder' */ 'components/input/army_builder'))
const AlliedArmies = lazy(() => import(/* webpackChunkName: 'ally_armies' */ 'components/input/ally_armies'))
const FooterComponent = lazy(() => import(/* webpackChunkName: 'footer' */ 'components/page/footer'))
const LoadedArmyHeader = lazy(() =>
  import(/* webpackChunkName: 'loaded_army_header' */ 'components/input/savedArmies/loaded_army_header')
)
const PrintArmy = lazy(() => import(/* webpackChunkName: 'printArmy' */ 'components/print/printArmy'))
const PrintFooter = lazy(() => import(/* webpackChunkName: 'printFooter' */ 'components/print/printFooter'))
const Reminders = lazy(() => import(/* webpackChunkName: 'reminders' */ 'components/info/reminders'))
const Toolbar = lazy(() => import(/* webpackChunkName: 'toolbar' */ 'components/input/toolbar/toolbar'))

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

      <NotificationBanner name="Orukk_CoS_WaitingForBooks" persistClose={true}>
        Looking for{' '}
        <a href={'//github.com/daviseford/aos-reminders/pull/535'} target="_blank" rel="noopener noreferrer">
          Cities of Sigmar
        </a>{' '}
        or{' '}
        <a href={'//github.com/daviseford/aos-reminders/pull/534'} target="_blank" rel="noopener noreferrer">
          Orruk Warclans
        </a>
        ? Don't fret, our goblins are hard at work getting this information updated.
      </NotificationBanner>

      <Suspense fallback={<></>}>
        <LoadedArmyHeader />
      </Suspense>

      <Suspense fallback={<LargeSpinner />}>
        <ArmyBuilder />
      </Suspense>

      <Suspense fallback={<></>}>
        <AlliedArmies />
      </Suspense>

      <Suspense fallback={<></>}>
        <Toolbar />
      </Suspense>

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
