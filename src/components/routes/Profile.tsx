import React, { useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { logPageView } from 'utils/analytics'
import { MdVerifiedUser, MdNotInterested, MdCheckCircle } from 'react-icons/md'
import { connect } from 'react-redux'
import { DateTime } from 'luxon'
import { subscription } from 'ducks'
import { NavBar } from 'components/page/navbar'
import { IStore } from 'types/store'
import { IUser } from 'types/user'
import { ISubscription } from 'types/subscription'
import { getSubscriptionFromApi } from 'api/thunks'

interface IProfileProps {
  updateSubscription: () => void
  resetSubscription: () => void
}

const ProfileComponent: React.FC<IProfileProps> = props => {
  const { resetSubscription, updateSubscription } = props
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscriptionFromApi(user, updateSubscription, resetSubscription)
  })

  if (loading || !user) {
    // TODO make this more fancy
    return <div>Loading...</div>
  }

  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>

      <UserCard user={user} />
    </div>
  )
}

export const Profile = connect(
  null,
  {
    resetSubscription: subscription.actions.resetSubscription,
    updateSubscription: subscription.actions.updateSubscription,
  }
)(ProfileComponent)

interface IUserCardProps {
  isSubscribed: boolean
  subscription: ISubscription
  user: IUser
}

const UserCardComponent: React.FC<IUserCardProps> = props => {
  const { user, isSubscribed, subscription } = props

  return (
    <div className="container py-4">
      <h2 className="text-center">User Profile</h2>

      <div className="media">
        <div className="media-body">
          <h4 className="mt-0">{user.email}</h4>

          <h5>
            Subscription Status:{' '}
            {isSubscribed ? (
              <MdCheckCircle className="text-success" />
            ) : (
              <MdNotInterested className="text-danger" />
            )}
          </h5>
          {isSubscribed && (
            <ul>
              <li>
                Subscription Start:{' '}
                {DateTime.fromSeconds(subscription.subscriptionCreated as number).toLocaleString(
                  DateTime.DATE_MED
                )}
              </li>
              <li>
                Subscription End:{' '}
                {DateTime.fromSeconds(subscription.subscriptionCreated as number)
                  .plus({
                    [`${subscription.planInterval}s`]: subscription.planIntervalCount,
                  })
                  .toLocaleString(DateTime.DATE_MED)}
              </li>
            </ul>
          )}
          <p className="align-items-center">
            Email Verified:{' '}
            {user.email_verified ? (
              <MdVerifiedUser className="text-success" />
            ) : (
              <MdNotInterested className="text-danger" />
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps2 = (state: IStore, ownProps) => ({
  ...ownProps,
  isSubscribed: subscription.selectors.isSubscribed(state),
  subscription: subscription.selectors.getSubscription(state),
})

export const UserCard = connect(
  mapStateToProps2,
  null
)(UserCardComponent)
