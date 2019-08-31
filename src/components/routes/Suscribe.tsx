import React, { useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { NavBar } from 'components/page/navbar'
import { IUser } from 'types/user'
import { logPageView } from 'utils/analytics'
import { connect } from 'react-redux'
import { IStore } from 'types/store'
import { subscription } from 'ducks'
import { PricingPlans } from 'components/payment/pricingPlans'

interface ISubscribeProps {
  isSubscribed: boolean
}
const SubscribeComponent: React.FC<ISubscribeProps> = props => {
  const { isSubscribed } = props
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()

  useEffect(() => {
    logPageView()
  }, [])

  if (loading || !user) {
    // TODO make this more fancy
    return <div>Loading...</div>
  }

  // TODO Flesh this out to look nicer
  if (isSubscribed) return <div>You are already a supporter :) Thanks!</div>

  const headerClass = `col-12 col-lg-8 col-xl-8 py-5 text-center  mx-auto`

  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>

      <div className={headerClass}>
        <img
          className="d-block mx-auto mb-4 img-fluid"
          src="/img/logo_noURL.png"
          width="100px"
          alt="Subscribe to support AoS Reminders"
        />
        <h2>Support AoS Reminders</h2>
        <p className="lead">
          It takes a lot of time, effort, and money to keep this project going. While the core product will{' '}
          <i>always</i> be free, I do offer this subscription service to those who wish to support AoS
          Reminders.
        </p>
        <p className="lead">
          Currently, purchasing a subscription will allow you to save and load your army rosters from anywhere
          in the world. In the future, we aim to offer:
        </p>
        <p className="lead">
          Importing army lists from Warscroll Builder
          <br />
          Importing army lists from Battlescribe
          <br />
          Adding custom reminders
          <br />
          And much more...
        </p>
      </div>

      <div>
        <PricingPlans />
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  isSubscribed: subscription.selectors.isSubscribed(state),
})

export const Subscribe = connect(
  mapStateToProps,
  null
)(SubscribeComponent)
