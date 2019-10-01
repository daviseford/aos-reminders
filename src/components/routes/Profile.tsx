import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { DateTime } from 'luxon'
import { useSubscription } from 'context/useSubscription'
import { logPageView } from 'utils/analytics'
import { MdVerifiedUser, MdNotInterested, MdCheckCircle } from 'react-icons/md'
import { IUser } from 'types/user'
import { CancelSubscriptionModal } from 'components/input/cancellation_modal'
import { btnContentWrapper } from 'theme/helperClasses'
import { ContactComponent } from 'components/page/contact'
import { EmptyHeader, Loading } from 'components/helpers/suspenseFallbacks'

const cardHeaderClass = `card-header mb-0 pb-1`

const Navbar = lazy(() => import(/* webpackChunkName: 'Navbar' */ 'components/page/navbar'))

const Profile: React.FC = () => {
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
        <Suspense fallback={<EmptyHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className="row d-flex justify-content-center">
        <div className={userCardWrapperClass}>
          <UserCard />
        </div>
      </div>
    </div>
  )
}

export default Profile

const UserCard: React.FC = () => {
  const { user }: { user: IUser } = useAuth0()
  const { isActive, isSubscribed, subscription } = useSubscription()

  return (
    <div className="py-4">
      <h1 className="text-center">Your Profile</h1>

      <div className="media">
        <div className="media-body text-center">
          <SubscriptionInfo subscription={subscription} isSubscribed={isSubscribed} />
          {isSubscribed && <RecurringPaymentInfo isActive={isActive} />}
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
      {modalIsOpen && <CancelSubscriptionModal modalIsOpen={modalIsOpen} closeModal={closeModal} />}
    </>
  )
}

const SubscriptionInfo = ({ subscription, isSubscribed }) => {
  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
        <h4>
          <div className={btnContentWrapper}>
            Subscription Status:{' '}
            {isSubscribed ? (
              <MdCheckCircle className="text-success ml-2" />
            ) : (
              <MdNotInterested className="text-danger ml-2" />
            )}
          </div>
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
          <div className={btnContentWrapper}>
            Recurring Payment:{' '}
            {isActive ? (
              <MdCheckCircle className="text-success ml-2" />
            ) : (
              <MdNotInterested className="text-danger ml-2" />
            )}
          </div>
        </h4>
      </div>
      {isActive && (
        <div className="card-body">
          <CancelBtn />
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
          <div className={btnContentWrapper}>
            Email Verified:{' '}
            {email_verified ? (
              <MdVerifiedUser className="text-success ml-2" />
            ) : (
              <MdNotInterested className="text-danger ml-2" />
            )}
          </div>
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
        <ContactComponent size="normal" />
      </div>
    </div>
  )
}
