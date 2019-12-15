import React, { useEffect, Suspense, lazy } from 'react'
import { useTheme } from 'context/useTheme'
import { useSubscription } from 'context/useSubscription'
import { logPageView } from 'utils/analytics'
import { Header } from 'components/page/homeHeader'
import { LargeSpinner } from 'components/helpers/suspenseFallbacks'

// const AppBanner = lazy(() => import('components/info/banners/app_banner'))
const FooterComponent = lazy(() => import('components/page/footer'))
const LoadedArmyHeader = lazy(() => import('components/input/savedArmies/loaded_army_header'))
const PrintArmy = lazy(() => import('components/print/printArmy'))
const PrintFooter = lazy(() => import('components/print/printFooter'))
const Reminders = lazy(() => import('components/info/reminders'))
const UpdateBanner = lazy(() => import('components/info/banners/update_banner'))

const GameMode: React.FC = () => {
  const { getSubscription } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  return (
    <div className={theme.bgColor}>
      <Header />

      {/* <Suspense fallback={<></>}>
        <AppBanner />
      </Suspense> */}

      <Suspense fallback={<></>}>
        <UpdateBanner />
      </Suspense>

      <Suspense fallback={<></>}>
        <LoadedArmyHeader />
      </Suspense>

      <Suspense fallback={<></>}>
        <Reminders />

        <PrintArmy />

        <PrintFooter />

        <FooterComponent />
      </Suspense>
    </div>
  )
}

export default GameMode
