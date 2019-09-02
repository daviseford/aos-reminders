import React, { useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { logPageView } from 'utils/analytics'
import { NavBar } from 'components/page/navbar'
import { PricingPlans } from 'components/payment/pricingPlans'
import { IUser } from 'types/user'
import { Loading } from 'components/page/loading'

export const Subscribe: React.FC<{}> = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()
  const { isSubscribed, getSubscription } = useSubscription()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading || !user) return <Loading />
  // TODO Flesh this out to look nicer
  if (isSubscribed) return <div>You are already a supporter :) Thanks!</div>

  const headerClass = `col-12 col-lg-8 col-xl-8 py-5  mx-auto`

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
          <ul>
            <li>Importing army lists from Warscroll Builder</li>
            <li>Importing army lists from Battlescribe</li>
            <li>Adding custom reminders</li>
            <li>And much more...</li>
          </ul>
        </p>
      </div>

      <div>
        <PricingPlans />
      </div>
    </div>
  )
}
