import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import Contact from 'components/page/contact'
import { PricingPlans } from 'components/payment/pricingPlans'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect } from 'react'
import { logPageView } from 'utils/analytics'
import { GITHUB_URL } from 'utils/env'

const Navbar = lazy(() => import('components/page/navbar'))
const headerClass = 'col-12 col-lg-8 col-xl-8 pt-5 mx-auto'

const Subscribe = () => {
  const { isLoading } = useAuth0()
  const { getSubscription, isActive, isSubscribed, subscriptionError } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    void getSubscription()
  }, [getSubscription])

  if (isLoading) return <LoadingBody />
  if (isSubscribed && isActive) return <AlreadySubscribed />

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>
      <Intro />
      {subscriptionError && (
        <div className="container">
          <div className="alert alert-warning" role="alert">
            <p className="mb-2">{subscriptionError}</p>
            <GenericButton className="btn btn-sm btn-primary" onClick={() => void getSubscription()}>
              Try again
            </GenericButton>
          </div>
        </div>
      )}
      <div className={`container ${theme.bgColor} ${theme.text}`}>
        <div className="row align-items-start justify-content-center mt-3">
          <CurrentFeatures />
          <ComingSoon />
        </div>
      </div>
      {!subscriptionError && (
        <div className="row py-5 bg-light justify-content-center jumbotron-fluid">
          <PricingPlans />
        </div>
      )}
      <div className={`container ${theme.bgColor} ${theme.text} text-center py-4`}>
        <Contact size="small" />
      </div>
    </div>
  )
}

const Intro = () => {
  const { theme } = useTheme()

  return (
    <div className={`${headerClass} ${theme.text}`}>
      <img
        className="d-block mx-auto mb-4 img-fluid rounded-circle bg-white"
        src="/img/logo_medium_padding.png"
        width="120px"
        alt="Subscribe to support AoS Reminders"
      />
      <h2>Support AoS Reminders</h2>
      <p className="lead">
        <strong>
          It takes a lot of time, effort, and money to keep this project going. While the core product will{' '}
          <i>always</i> be free, I do offer this subscription service to those who wish to support AoS
          Reminders.
        </strong>
      </p>
    </div>
  )
}

const featuresColClass = 'col-12 col-lg-5 col-xl-5 col-xxl-5 mt-2'

const CurrentFeatures = () => (
  <div className={featuresColClass}>
    <p className="lead">
      <strong>What do you get when you subscribe?</strong>
    </p>
    <ul className="lead">
      <li>Support the fourth-edition migration and ongoing rules updates.</li>
      <li>Help keep the core reminder experience free for the whole community.</li>
      <li>Use subscriber dark mode from your familiar Profile page.</li>
      <li>Manage your existing subscription through the established account experience.</li>
    </ul>
  </div>
)

const ComingSoon = () => (
  <div className={featuresColClass}>
    <p className="lead">
      <strong>Coming soon: </strong>
    </p>
    <ul className="lead">
      <li>
        <i>Broader, reviewed AoS 4 faction coverage</i>
      </li>
      <li>
        <i>AoS 4 list import after the game structure stabilizes</i>
      </li>
      <li>
        <i>AoS 4 account-backed army saving and sharing</i>
      </li>
      <li>
        Follow migration work{' '}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          on Github!
        </a>
      </li>
    </ul>
  </div>
)

export default Subscribe
