import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import Switch from 'react-switch'
import { DateTime } from 'luxon'
import { useSubscription } from 'context/useSubscription'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { MdVerifiedUser, MdNotInterested, MdCheckCircle } from 'react-icons/md'
import { logPageView, logClick } from 'utils/analytics'
import { titleCase } from 'utils/textUtils'
import { ROUTES } from 'utils/env'
import { withSelectOne } from 'utils/withSelect'
import { CancelSubscriptionModal } from 'components/input/cancellation_modal'
import { ContactComponent } from 'components/page/contact'
import { LoadingHeader, LoadingBody } from 'components/helpers/suspenseFallbacks'
import { SelectOne } from 'components/input/select'
import { centerContentClass } from 'theme/helperClasses'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { IUser } from 'types/user'

const Navbar = lazy(() => import('components/page/navbar'))

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
      <div className={`${theme.headerColor} py-2`}>
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
  const { theme } = useTheme()

  return (
    <div className={`col py-4 ${theme.text} text-center`}>
      <h1 className="text-center">Your Profile</h1>
      <FavoriteArmySelect />
      <ToggleTheme />
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
  const { theme } = useTheme()

  useEffect(() => {
    if (!isActive) return
    getFavoriteFaction()
  }, [getFavoriteFaction, isActive])

  const colClass = `col-12${isActive ? ` col-sm-10 col-md-8 col-lg-8 col-xxl-5 text-left` : ``}`

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>
          <div className={centerContentClass}>Favorite Faction</div>
        </h4>
      </div>

      <div className={theme.cardBody}>
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
  const { isLight } = useTheme()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if (!isActive || isCanceled) return null

  const btnClass = `btn btn-sm btn${isLight ? `-outline-` : `-`}danger`

  return (
    <>
      <button className={btnClass} onClick={openModal}>
        Cancel Subscription
      </button>
      {modalIsOpen && <CancelSubscriptionModal modalIsOpen={modalIsOpen} closeModal={closeModal} />}
    </>
  )
}

const SubscriptionInfo = ({ subscription, isSubscribed, isActive, isCanceled }) => {
  const { theme } = useTheme()
  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
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
        <div className={theme.cardBody}>
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
        <div className={theme.cardBody}>
          <SubscriptionExpired />
        </div>
      )}
    </div>
  )
}

const RecurringPaymentInfo = ({ isActive, isCanceled }) => {
  const { theme } = useTheme()
  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
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
        <div className={theme.cardBody}>
          <CancelBtn />
        </div>
      )}
    </div>
  )
}

const EmailVerified = ({ email_verified, email }) => {
  const { theme } = useTheme()
  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
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
      <div className={theme.cardBody}>
        <h5 className="lead">{email}</h5>
      </div>
    </div>
  )
}

const Help = () => {
  const { theme } = useTheme()
  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>Need help?</h4>
      </div>
      <div className={theme.cardBody}>
        <ContactComponent size="normal" />
      </div>
    </div>
  )
}

const ToggleTheme = () => {
  const { isActive } = useSubscription()
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <div className={`${theme.card} mt-2`}>
      <div className={theme.profileCardHeader}>
        <h4>Visual Theme</h4>
      </div>
      <div className={`${theme.cardBody} ${centerContentClass} pb-0`}>
        {isActive && (
          <label htmlFor="visual-theme-switch">
            <Switch
              onChange={toggleTheme}
              checked={isDark}
              onColor="#1C7595"
              onHandleColor="#E9ECEF"
              handleDiameter={36}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={26}
              width={80}
              className="react-switch"
              id="visual-theme-switch"
            />
          </label>
        )}
        {!isActive && (
          <div className="alert alert-info text-center mt-3" role="alert">
            <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick('SubscribeDarkTheme')}>
              Subscribe now
            </Link>{' '}
            to use dark theme!
          </div>
        )}
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
