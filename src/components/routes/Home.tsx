import React, { useEffect } from 'react'
import { logPageView } from 'utils/analytics'
import { useSubscription } from 'context/useSubscription'
import { AlliedArmies } from 'components/input/ally_armies'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { PrintFooterComponent, PrintArmy } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'
import { LoadWarscrollArmy } from 'components/input/warscrollBuilder/dropContainer'

export const Home: React.FC<{}> = () => {
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

      <LoadWarscrollArmy />

      <ArmyBuilder />

      <AlliedArmies />

      <Toolbar />

      <Reminders />

      <PrintArmy />

      <PrintFooterComponent />

      <FooterComponent />
    </>
  )
}
