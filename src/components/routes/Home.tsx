import React, { useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { logPageView } from 'utils/analytics'
import { AlliedArmies } from 'components/input/ally_armies'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { PrintFooterComponent, PrintArmy } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'
import { useSubscription } from 'context/useSubscription'

export const Home: React.FC<{}> = () => {
  const { user } = useAuth0()
  const { updateSubscription } = useSubscription()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    updateSubscription()
  }, [user, updateSubscription])

  return (
    <>
      <Header />

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
