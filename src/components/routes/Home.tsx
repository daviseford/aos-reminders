import { LargeSpinner } from 'components/helpers/suspenseFallbacks'
import { Header } from 'components/page/homeHeader'
import { PayPalButton } from 'components/payment/paypalButton'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect } from 'react'
import { logPageView } from 'utils/analytics'

const AlliedArmies = lazy(() => import('components/input/ally_armies'))
const AppBanner = lazy(() => import('components/info/banners/app_banner'))
const ArmyBuilder = lazy(() => import('components/input/army_builder'))
const FooterComponent = lazy(() => import('components/page/footer'))
const LoadedArmyHeader = lazy(() => import('components/input/savedArmies/loaded_army_header'))
const PrintArmy = lazy(() => import('components/print/printArmy'))
const PrintFooter = lazy(() => import('components/print/printFooter'))
const Reminders = lazy(() => import('components/info/reminders'))
const Toolbar = lazy(() => import('components/input/toolbar/toolbar'))
const UpdateBanner = lazy(() => import('components/info/banners/update_banner'))

const Home: React.FC = () => {
  const { getSubscription } = useSubscription()
  const { theme } = useTheme()
  const { isGameMode } = useAppStatus()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  return (
    <div className={theme.bgColor}>
      <Header />

      <Suspense fallback={<></>}>
        <AppBanner />
      </Suspense>

      <PayPalButton
        amount="0.01"
        shippingPreference="GET_FROM_FILE" // default is "GET_FROM_FILE"
        onApprove={x => console.log('approved', x)}
        onSuccess={details => console.log('Transaction completed by ', details)}
        onButtonReady={() => console.log('hello ready')}
      />

      <Suspense fallback={<></>}>
        <UpdateBanner />
      </Suspense>

      {!isGameMode && (
        <>
          <Suspense fallback={<></>}>
            <LoadedArmyHeader />
          </Suspense>

          <Suspense fallback={<LargeSpinner className="mt-5" />}>
            <ArmyBuilder />
          </Suspense>

          <Suspense fallback={<></>}>
            <AlliedArmies />
          </Suspense>
        </>
      )}

      <Suspense fallback={<></>}>
        <Toolbar />
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

export default Home
