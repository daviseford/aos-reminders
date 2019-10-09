import React, { useEffect, lazy, Suspense } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { logPageView, logClick } from 'utils/analytics'
import { PricingPlans } from 'components/payment/pricingPlans'
import { ContactComponent } from 'components/page/contact'
import { Loading, EmptyHeader } from 'components/helpers/suspenseFallbacks'
import { LinkNewTab } from 'components/helpers/link'
import { GITHUB_URL } from 'utils/env'

const Navbar = lazy(() => import(/* webpackChunkName: 'Navbar' */ 'components/page/navbar'))

const headerClass = `col-12 col-lg-8 col-xl-8 pt-5 mx-auto`

const Subscribe: React.FC = () => {
  const { loading }: { loading: boolean } = useAuth0()
  const { isSubscribed, isActive, getSubscription } = useSubscription()

  useEffect(() => {
    logPageView()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading) return <Loading />
  if (isSubscribed && isActive) return <AlreadySubscribed />

  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <Suspense fallback={<EmptyHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <Intro />

      <div className="row py-5 bg-light justify-content-center jumbotron-fluid">
        <PricingPlans />
      </div>

      <div className="container">
        <div className="row align-items-start justify-content-center mt-3">
          <CurrentFeatures />
          <ComingSoon />
        </div>
      </div>

      <ExamplesRow />

      <div className="container text-center mt-5 mb-4">
        <ContactComponent size={'small'} />
      </div>
    </div>
  )
}

export default Subscribe

const ExamplesRow = () => {
  return (
    <div className="row py-5 mx-3 bg-light justify-content-center jumbotron-fluid">
      <div className={'col-12 col-xl-8 col-xxl-5'}>
        <WebmWithFallback
          webmUrl={'/img/import_demo.mp4'}
          gifUrl={'/img/import_demo.gif'}
          description={'Importing Warscroll Builder/Azyr files'}
          label={'Demo-Import'}
        />
      </div>
      <div className={'col-12 col-xl-8 col-xxl-5'}>
        <WebmWithFallback
          webmUrl={'/img/save_load_demo.mp4'}
          gifUrl={'/img/save_load_demo.gif'}
          description={'Saving, loading, and deleting armies'}
          label={'Demo-SaveLoad'}
        />
      </div>
    </div>
  )
}

const Intro = () => (
  <div className={headerClass}>
    <img
      className="d-block mx-auto mb-4 img-fluid"
      src="/img/logo_noURL.png"
      width="100px"
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

const featuresColClass = `col-12 col-lg-5 col-xl-5 col-xxl-5 mt-2`

const CurrentFeatures = () => (
  <div className={featuresColClass}>
    <p className="lead">
      <strong>What do you get when you subscribe to AoS Reminders?</strong>
    </p>
    <ul className="lead">
      <li>
        <strong>NEW:</strong> Choose your favorite faction!
      </li>
      <li>
        Save, load, update, and delete your army lists from <strong>anywhere</strong> on <strong>any</strong>{' '}
        device
      </li>
      <li>
        Import your army lists <strong>instantly</strong> from Warscroll Builder and Azyr
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
        <i>Importing army lists from Battlescribe</i>
      </li>
      <li>
        <i>Adding custom reminders</i>
      </li>
      <li>
        <i>
          <strong>and much more!</strong>
        </i>{' '}
        - Check out our list of planned feature enhancements{' '}
        <LinkNewTab href={`${GITHUB_URL}/labels/enhancement`}>on our Github!</LinkNewTab>
      </li>
    </ul>
  </div>
)

const AlreadySubscribed = () => {
  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <Navbar />
      </div>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col mx-5 my-5 py-5 px-5">
          <p className="lead text-center">You are already a supporter :) Thanks!</p>
        </div>
      </div>
    </div>
  )
}

type TWebmWithFallback = React.FC<{ webmUrl: string; gifUrl: string; description: string; label: string }>

const WebmWithFallback: TWebmWithFallback = ({ webmUrl, gifUrl, description, label }) => {
  const supportsWebm = !!document.createElement('video').canPlayType

  return (
    <>
      <figure className="figure">
        <LinkNewTab href={supportsWebm ? webmUrl : gifUrl} onClick={() => logClick(label)}>
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
