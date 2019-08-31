import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useAuth0 } from 'react-auth0-wrapper'
import { logPageView } from 'utils/analytics'
import { getSubscriptionFromApi } from 'api/thunks'
import { subscription } from 'ducks'
import { AlliedArmies } from 'components/input/ally_armies'
import { ArmyBuilder } from 'components/input/army_builder'
import { FooterComponent } from 'components/page/footer'
import { Header } from 'components/page/header'
import { PrintFooterComponent, PrintArmy } from 'components/print/print'
import { Reminders } from 'components/info/reminders'
import { Toolbar } from 'components/input/toolbar'

interface IHomeProps {
  updateSubscription: () => void
  resetSubscription: () => void
}

const HomeComponent: React.FC<IHomeProps> = props => {
  const { resetSubscription, updateSubscription } = props
  const { user } = useAuth0()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscriptionFromApi(user, updateSubscription, resetSubscription)
  })

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

export const Home = connect(
  null,
  {
    resetSubscription: subscription.actions.resetSubscription,
    updateSubscription: subscription.actions.updateSubscription,
  }
)(HomeComponent)
