import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LinkNewTab } from 'components/helpers/link'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import { ContactComponent } from 'components/page/contact'
import { PricingPlans } from 'components/payment/pricingPlans'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logClick, logPageView } from 'utils/analytics'
import { GITHUB_URL, ROUTES } from 'utils/env'
import useWindowSize from 'utils/hooks/useWindowSize'

const Navbar = lazy(() => import('components/page/navbar'))

const headerClass = `col-12 col-lg-8 col-xl-8 pt-5 mx-auto`

const Subscribe: React.FC = () => {
  const { isLoading } = useAuth0()
  const { isSubscribed, isActive, getSubscription } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    getSubscription()
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

      <div className={`container ${theme.bgColor} ${theme.text}`}>
        <div className="row align-items-start justify-content-center mt-3">
          <CurrentFeatures />
          <ComingSoon />
        </div>
      </div>

      <div className="row py-5 bg-light justify-content-center jumbotron-fluid">
        <PricingPlans />
      </div>

      <ExamplesRow />

      <div className={`container ${theme.bgColor} ${theme.text} text-center py-4`}>
        <ContactComponent size={'small'} />
      </div>
    </div>
  )
}

export default Subscribe

const ExamplesRow = () => {
  return (
    <div className="row py-5 mx-3 bg-light justify-content-center jumbotron-fluid">
      <MobileDarkModeDemo />
      <div className={'col-12 col-xl-8 col-xxl-5'}>
        <WebmWithFallback
          webmUrl={'/img/import_demo.mp4'}
          gifUrl={'/img/import_demo.gif'}
          description={'Importing Warscroll Builder/Azyr files'}
          label={'Demo-Import'}
        />
      </div>
      <StatsDemo />
      <div className={'col-12 col-xl-8 col-xxl-5'}>
        <WebmWithFallback
          webmUrl={'/img/save_load_demo.mp4'}
          gifUrl={'/img/save_load_demo.gif'}
          description={'Saving, isLoading, and deleting armies'}
          label={'Demo-SaveLoad'}
        />
      </div>
    </div>
  )
}

const StatsDemo = () => {
  const { isMobile } = useWindowSize()
  return (
    <div className={'col-12 col-xl-8 col-xxl-5 text-center'}>
      <figure className="figure">
        <img
          className={`figure-img img-fluid rounded img-thumbnail`}
          src={`/img/stats_demo_${isMobile ? `mobile` : `desktop`}.png`}
          alt="Subscribe to access advanced stats"
        />
        <figcaption className="figure-caption text-center">
          <strong>Advanced Stats</strong>
        </figcaption>
      </figure>
    </div>
  )
}

const MobileDarkModeDemo = () => {
  const { isMobile } = useWindowSize()
  if (!isMobile) return null
  return (
    <div className={'col-12'}>
      <WebmWithFallback
        webmUrl={'/img/dark_mode1.mp4'}
        gifUrl={'/img/dark_mode1.gif'}
        description={'Dark Mode'}
        label={'Demo-DarkMode'}
      />
    </div>
  )
}

const Intro = () => {
  const { theme } = useTheme()

  return (
    <div className={`${headerClass} ${theme.text}`}>
      <img
        className={`d-block mx-auto mb-4 img-fluid rounded-circle bg-white`}
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

const featuresColClass = `col-12 col-lg-5 col-xl-5 col-xxl-5 mt-2`

const CurrentFeatures = () => (
  <div className={featuresColClass}>
    <p className="lead">
      <strong>What do you get when you subscribe?</strong>
    </p>
    <ul className="lead">
      <li>
        <strong>NEW:</strong> Access to <Link to={ROUTES.STATS}>advanced stats!</Link>
      </li>
      <li>Share army lists with your friends!</li>
      <li>Spare your eyes! Turn on dark mode!</li>
      <li>Choose your favorite faction!</li>
      <li>
        Save, load, update, and delete your army lists from <strong>anywhere</strong> on <strong>any</strong>{' '}
        device - even <strong>offline!</strong>
      </li>
      <li>
        Import your army lists <strong>instantly</strong> from Azyr, Warscroll Builder, and Battlescribe
      </li>
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
        <i>Add custom reminders to any phase</i>
      </li>
      <li>
        <i>Add your own Notes to phases and rules</i>
      </li>
      <li>
        <i>Attach PDF/HTML lists to your Saved Army</i>
      </li>
      <li>
        <i>
          <strong>and much more!</strong>
        </i>{' '}
        - Check out our list of planned feature enhancements{' '}
        <LinkNewTab href={`${GITHUB_URL}/labels/enhancement`} label={'Github'}>
          on Github!
        </LinkNewTab>
      </li>
    </ul>
  </div>
)

type TWebmWithFallback = React.FC<{ webmUrl: string; gifUrl: string; description: string; label: string }>

const WebmWithFallback: TWebmWithFallback = ({ webmUrl, gifUrl, description, label }) => {
  const supportsWebm = !!document.createElement('video').canPlayType

  return (
    <>
      <figure className="figure">
        <LinkNewTab
          href={supportsWebm ? webmUrl : gifUrl}
          onClick={() => logClick(label)}
          label={'Video URL'}
        >
          <video
            preload="auto"
            loop={true}
            poster={gifUrl}
            autoPlay={true}
            className="figure-img img-fluid rounded img-thumbnail"
          >
            <source src={webmUrl} type="video/mp4"></source>
            <source src={webmUrl} type="video/webm"></source>
          </video>
        </LinkNewTab>
        <figcaption className="figure-caption text-center">
          <strong>{description}</strong>
        </figcaption>
      </figure>
    </>
  )
}
