import React, { useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { DateTime } from 'luxon'
import { useSubscription } from 'context/useSubscription'
import { logPageView } from 'utils/analytics'
import { MdVerifiedUser, MdNotInterested, MdCheckCircle } from 'react-icons/md'
import { NavBar } from 'components/page/navbar'
import { IUser } from 'types/user'
import { Loading } from 'components/page/loading'
import { injectStripe, Elements } from 'react-stripe-elements'

export const Profile: React.FC<{}> = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()
  const { getSubscription } = useSubscription()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading || !user) return <Loading />

  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>

      <UserCard />
      <CancelSubscription />
    </div>
  )
}

export const UserCard: React.FC<{}> = () => {
  const { user }: { user: IUser } = useAuth0()
  const { isSubscribed, subscription } = useSubscription()

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

interface ICancelBtnProps {
  stripe?: any
}

const CancelBtn: React.FC<ICancelBtnProps> = () => {
  const { isSubscribed, cancelSubscription } = useSubscription()

  const handleClick = e => {
    e.preventDefault()
    cancelSubscription()
  }

  if (!isSubscribed) return null

  return (
    <button className="btn btn-large btn-danger" onClick={handleClick}>
      Cancel Subscription
    </button>
  )
}

const InjectedCancelButton = injectStripe(CancelBtn)

const CancelSubscription = () => {
  return (
    <Elements>
      <InjectedCancelButton />
    </Elements>
  )
}
