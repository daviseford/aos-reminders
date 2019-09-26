import React, { useEffect, Suspense, lazy } from 'react'
import { logPageView } from 'utils/analytics'
import { useSubscription } from 'context/useSubscription'
import { ArmyBuilder } from 'components/input/army_builder'
import { Header } from 'components/page/header'
import { Toolbar } from 'components/input/toolbar'

const AlliedArmies = lazy(() => import('components/input/ally_armies'))
const FooterComponent = lazy(() => import('components/page/footer'))
const PrintArmy = lazy(() => import('components/print/printArmy'))
const PrintFooter = lazy(() => import('components/print/printFooter'))
const Reminders = lazy(() => import('components/info/reminders'))

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

      <AlliedArmies />

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
