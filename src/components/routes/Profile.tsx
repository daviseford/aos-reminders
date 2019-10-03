import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { DateTime } from 'luxon'
import { useSubscription } from 'context/useSubscription'
import { logPageView, logClick } from 'utils/analytics'
import { MdVerifiedUser, MdNotInterested, MdCheckCircle } from 'react-icons/md'
import { IUser } from 'types/user'
import { CancelSubscriptionModal } from 'components/input/cancellation_modal'
import { btnContentWrapper } from 'theme/helperClasses'
import { ContactComponent } from 'components/page/contact'
import { EmptyHeader, Loading } from 'components/helpers/suspenseFallbacks'
import { Link } from 'react-router-dom'
import { useSavedArmies } from 'context/useSavedArmies'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { withSelectOne } from 'utils/withSelect'
import { SelectOne } from 'components/input/select'
import { titleCase } from 'utils/textUtils'

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
  const { isActive, isSubscribed, isCanceled, subscription } = useSubscription()

  return (
    <div className="py-4">
      <h1 className="text-center">Your Profile</h1>

      <div className="media">
        <div className="media-body text-center">
          <SubscriptionInfo
            subscription={subscription}
            isCanceled={isCanceled}
            isSubscribed={isSubscribed}
            isActive={isActive}
          />
          {isSubscribed && <RecurringPaymentInfo isActive={isActive} isCanceled={isCanceled} />}
          <FavoriteArmySelect />
          <EmailVerified email_verified={user.email_verified} email={user.email} />
          <Help />
        </div>
      </div>
    </div>
  )
}

const FavoriteArmySelect = () => {
  const { isActive } = useSubscription()
  const { favoriteFaction, updateFavoriteFaction, getFavoriteFaction } = useSavedArmies()

  useEffect(() => {
    if (!isActive) return
    getFavoriteFaction()
  }, [getFavoriteFaction, isActive])

  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
        <h4>
          <div className={btnContentWrapper}>Favorite Faction</div>
        </h4>
      </div>

      <div className="card-body">
        <div className={`d-flex justify-content-center`}>
          <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-dark text-left">
            <SelectOne
              value={favoriteFaction ? titleCase(favoriteFaction) : null}
              items={SUPPORTED_FACTIONS}
              setValue={withSelectOne(updateFavoriteFaction)}
              hasDefault={true}
              toTitle={true}
              isDisabled={!isActive}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ICancelBtnProps {
  stripe?: any
}

const CancelBtn: React.FC<ICancelBtnProps> = () => {
  const { isSubscribed, isActive, isCanceled } = useSubscription()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (!isSubscribed || !isActive || isCanceled) return null

  return (
    <>
      <button className="btn btn-sm btn-outline-danger" onClick={openModal}>
        Cancel Subscription
      </button>
      {modalIsOpen && <CancelSubscriptionModal modalIsOpen={modalIsOpen} closeModal={closeModal} />}
    </>
  )
}

const SubscriptionInfo = ({ subscription, isSubscribed, isActive, isCanceled }) => {
  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
        <h4>
          <div className={btnContentWrapper}>
            Subscription Status:{' '}
            {isSubscribed && isActive ? (
              <MdCheckCircle className="text-success ml-2" />
            ) : (
              <MdNotInterested className="text-danger ml-2" />
            )}
          </div>
        </h4>
      </div>

      {isSubscribed && isActive && (
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
      {isSubscribed && !isActive && (
        <div className="card-body">
          <SubscriptionExpired />
        </div>
      )}
    </div>
  )
}

const RecurringPaymentInfo = ({ isActive, isCanceled }) => {
  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
        <h4>
          <div className={btnContentWrapper}>
            Recurring Payment:{' '}
            {isActive && !isCanceled ? (
              <MdCheckCircle className="text-success ml-2" />
            ) : (
              <MdNotInterested className="text-danger ml-2" />
            )}
          </div>
        </h4>
      </div>
      {isActive && !isCanceled && (
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

const SubscriptionExpired = () => (
  <div className="mt-2">
    <div className="alert alert-danger text-center" role="alert">
      <strong>Your subscription has expired!</strong>
      <br />
      <Link to="/subscribe" className={`btn btn-md btn-success mt-2`} onClick={() => logClick('Resubscribe')}>
        Resubscribe now!
      </Link>
    </div>
  </div>
)
