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

  const userCardWrapperClass = `col-12 col-md-8 col-lg-6 col-xl-6`

  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>

      <div className="row d-flex justify-content-center">
        <div className={userCardWrapperClass}>
          <UserCard />
        </div>
      </div>
    </div>
  )
}

export const UserCard: React.FC<{}> = () => {
  const { user }: { user: IUser } = useAuth0()
  const { isActive, isSubscribed, subscription } = useSubscription()

  return (
    <div className="container py-4">
      <h1 className="text-center">Your Profile</h1>

      <div className="media">
        <div className="media-body text-center">
          <h3 className="mt-0">{user.email}</h3>

          <div className="card">
            <div className="card-header">
              <h4>
                Subscription Status:{' '}
                {isSubscribed ? (
                  <MdCheckCircle className="text-success" />
                ) : (
                  <MdNotInterested className="text-danger" />
                )}
              </h4>
            </div>

            {isSubscribed && (
              <div className="card-body">
                <h5 className="lead">
                  Subscription Start:{' '}
                  {DateTime.fromSeconds(subscription.subscriptionCreated as number).toLocaleString(
                    DateTime.DATE_MED
                  )}
                </h5>
                <h5 className="lead">
                  Subscription End:{' '}
                  {DateTime.fromSeconds(subscription.subscriptionCreated as number)
                    .plus({
                      [`${subscription.planInterval}s`]: subscription.planIntervalCount,
                    })
                    .toLocaleString(DateTime.DATE_MED)}
                </h5>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h4>
                Recurring Payment:{' '}
                {isActive ? (
                  <MdCheckCircle className="text-success" />
                ) : (
                  <MdNotInterested className="text-danger" />
                )}
              </h4>
            </div>
            {isActive && (
              <div className="card-body">
                <CancelSubscription />
              </div>
            )}
          </div>

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
    <button className="btn btn-sm btn-outline-danger" onClick={handleClick}>
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
