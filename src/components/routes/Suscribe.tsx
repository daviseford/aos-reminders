import React, { useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { NavBar } from 'components/page/navbar'
import { IUser } from 'types/user'
import { logPageView } from 'utils/analytics'
import { connect } from 'react-redux'
import { IStore } from 'types/store'
import { subscription } from 'ducks'
import { PricingPlans } from 'components/payment/pricingPlans'

const SubscribeComponent = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()

  useEffect(() => {
    logPageView()
  }, [])

  if (loading || !user) {
    // TODO make this more fancy
    return <div>Loading...</div>
  }

  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>
      <div>
        <PricingPlans />
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => {
  return {
    ...ownProps,
    isSubscribed: subscription.selectors.isSubscribed(state),
  }
}
export const Subscribe = connect(
  mapStateToProps,
  null
)(SubscribeComponent)
