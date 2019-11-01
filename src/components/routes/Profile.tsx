import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { DateTime } from 'luxon'
import { useSubscription } from 'context/useSubscription'
import { logPageView, logClick } from 'utils/analytics'
import { MdVerifiedUser, MdNotInterested, MdCheckCircle } from 'react-icons/md'
import { IUser } from 'types/user'
import { CancelSubscriptionModal } from 'components/input/cancellation_modal'
import { centerContentClass } from 'theme/helperClasses'
import { ContactComponent } from 'components/page/contact'
import { LoadingHeader, LoadingBody } from 'components/helpers/suspenseFallbacks'
import { Link } from 'react-router-dom'
import { useSavedArmies } from 'context/useSavedArmies'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { withSelectOne } from 'utils/withSelect'
import { SelectOne } from 'components/input/select'
import { titleCase } from 'utils/textUtils'
import { ROUTES } from 'utils/env'
import { useTheme } from 'context/useTheme'

const cardHeaderClass = `card-header mb-0 pb-1`

const Navbar = lazy(() => import(/* webpackChunkName: 'Navbar' */ 'components/page/navbar'))

const Profile: React.FC = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()
  const { getSubscription } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading || !user) return <LoadingBody />

  const userCardWrapperClass = `col-12 col-md-8 col-lg-6 col-xl-6`

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className="bg-themeDarkBluePrimary py-2">
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={`container ${theme.bgColor} px-0`}>
        <div className="row d-flex justify-content-center">
          <div className={userCardWrapperClass}>
            <UserCard />
          </div>
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
    <div className="col py-4 text-center">
      <h1 className="text-center">Your Profile</h1>
      <FavoriteArmySelect />
      <SubscriptionInfo
        subscription={subscription}
        isCanceled={isCanceled}
        isSubscribed={isSubscribed}
        isActive={isActive}
      />
      {isSubscribed && <RecurringPaymentInfo isActive={isActive} isCanceled={isCanceled} />}
      <EmailVerified email_verified={user.email_verified} email={user.email} />
      <Help />
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

  const colClass = `col-12${isActive ? ` col-sm-10 col-md-8 col-lg-8 col-xxl-5 text-dark text-left` : ``}`

  return (
    <div className="card mt-2">
      <div className={cardHeaderClass}>
        <h4>
          <div className={centerContentClass}>Favorite Faction</div>
        </h4>
      </div>

      <div className="card-body">
        <div className={`d-flex justify-content-center`}>
          <div className={colClass}>
            {isActive ? (
              <SelectOne
                value={favoriteFaction ? titleCase(favoriteFaction) : null}
                items={SUPPORTED_FACTIONS}
                setValue={withSelectOne(updateFavoriteFaction)}
                hasDefault={true}
                toTitle={true}
              />
            ) : (
              <div className="alert alert-info text-center mt-3" role="alert">
                <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick('SubscribeFavoriteFaction')}>
                  Subscribe now
                </Link>{' '}
                to save your favorite faction!
                <br />
                <small>
                  No more scrolling through the long list of armies when you visit - your favorite is
                  automatically loaded!
                </small>
              </div>
            )}
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
  const { isActive, isCanceled } = useSubscription()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (!isActive || isCanceled) return null

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
          <div className={centerContentClass}>
            Subscription Status:{' '}
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
          <h5 className="lead">
            Subscription Start:{' '}
            {DateTime.fromSeconds(subscription.subscriptionStart as number).toLocaleString(DateTime.DATE_MED)}
          </h5>
          <h5 className="lead">
            Subscription End:{' '}
            {DateTime.fromSeconds(subscription.subscriptionStart as number)
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
          <div className={centerContentClass}>
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
          <div className={centerContentClass}>
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
      <Link
        to={ROUTES.SUBSCRIBE}
        className={`btn btn-md btn-success mt-2`}
        onClick={() => logClick('Resubscribe')}
      >
        Resubscribe now!
      </Link>
    </div>
  </div>
)
