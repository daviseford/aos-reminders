import React, { useEffect, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { DateTime } from 'luxon'
import { useSubscription } from 'context/useSubscription'
import { logPageView } from 'utils/analytics'
import { MdVerifiedUser, MdNotInterested, MdCheckCircle } from 'react-icons/md'
import { NavBar } from 'components/page/navbar'
import { IUser } from 'types/user'
import { Loading } from 'components/page/loading'
import { injectStripe, Elements } from 'react-stripe-elements'
import { CancelSubscriptionModal } from 'components/input/cancellation_modal'

const cardHeaderClass = `card-header mb-0 pb-1`

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

  const userCardWrapperClass = `col-12 col-md-8 col-lg-4 col-xl-4`

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
      <h1 className="text-center SelectorHeader display-4">Your Profile</h1>

      <div className="media">
        <div className="media-body text-center">
          <SubscriptionInfo subscription={subscription} isSubscribed={isSubscribed} />
          <RecurringPaymentInfo isActive={isActive} />
          <EmailVerified email_verified={user.email_verified} email={user.email} />
          <Help />
        </div>
      </div>
    </div>
  )
}

interface ICancelBtnProps {
  stripe?: any
}

const CancelBtn: React.FC<ICancelBtnProps> = () => {
  const { isSubscribed } = useSubscription()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (!isSubscribed) return null

  return (
    <>
      <button className="btn btn-sm btn-outline-danger" onClick={openModal}>
        Cancel Subscription
      </button>
      <CancelSubscriptionModal modalIsOpen={modalIsOpen} closeModal={closeModal} />
    </>
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

const SubscriptionInfo = ({ subscription, isSubscribed }) => {
  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
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
  )
}

const RecurringPaymentInfo = ({ isActive }) => {
  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
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
  )
}

const EmailVerified = ({ email_verified, email }) => {
  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
        <h4>
          Email Verified:{' '}
          {email_verified ? (
            <MdVerifiedUser className="text-success" />
          ) : (
            <MdNotInterested className="text-danger" />
          )}
        </h4>
      </div>
      <div className="card-body">
        <h5 className="lead">{email}</h5>
      </div>
    </div>
  )
}

const Help = () => {
  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
        <h4>Need help?</h4>
      </div>
      <div className="card-body">
        <a
          href="https://github.com/daviseford/aos-reminders/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-dark mx-2"
        >
          File an Issue
        </a>

        <a
          href="mailto:davis.e.ford.alt+aosreminders@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-dark mx-2"
        >
          Email Me
        </a>
      </div>
    </div>
  )
}
