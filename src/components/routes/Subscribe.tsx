import React, { useEffect, lazy, Suspense, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { logPageView, logClick } from 'utils/analytics'
import { PricingPlans } from 'components/payment/pricingPlans'
import { ContactComponent } from 'components/page/contact'
import { Loading, EmptyHeader } from 'components/helpers/suspenseFallbacks'

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
  const [supportsWebm, setSupport] = useState(true)

  const turnOffSupport = () => setSupport(false)

  useEffect(() => {
    const videoElement = document.querySelector('video')
    console.log(videoElement)
    if (!videoElement) return
    videoElement.addEventListener('error', turnOffSupport)

    return () => {
      videoElement.removeEventListener('error', turnOffSupport)
    }
  })

  return (
    <div className="row py-5 mx-3 bg-light justify-content-center jumbotron-fluid">
      <div className={'col-12 col-lg-5 col-xl-5'}>
        <ImportExample supportsWebm={supportsWebm} />
      </div>
      <div className={'col-12 col-lg-5 col-xl-5'}>
        <SaveLoadExample supportsWebm={supportsWebm} />
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
        <strong>NEW:</strong> Import your army lists from Azyr!
      </li>
      <li>
        Import your army lists <strong>instantly</strong> from Warscroll Builder
      </li>
      <li>
        Save and load your army lists from <strong>anywhere</strong> on <strong>any</strong> device
      </li>
      <li>Edit, update, and delete your armies effortlessly</li>
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
        <i>Favorite armies</i>
      </li>
      <li>
        <i>Adding custom reminders</i>
      </li>
      <li>
        <i>
          <strong>and much more!</strong>
        </i>{' '}
        - Check out our list of planned feature enhancements{' '}
        <a
          href="https://github.com/daviseford/aos-reminders/labels/enhancement"
          target="_blank"
          rel="noopener noreferrer"
        >
          on our Github!
        </a>
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
        <div className="mx-5 my-5 py-5 px-5">
          <p className="lead text-center">You are already a supporter :) Thanks!</p>
        </div>
      </div>
    </div>
  )
}

const ImportExample = ({ supportsWebm }) => {
  const url = supportsWebm ? '/img/import_demo.mp4' : '/img/import_demo.gif'

  return (
    <>
      <figure className="figure">
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => logClick('Demo-Import')}>
          {supportsWebm ? (
            <video
              preload="auto"
              controls={true}
              loop={true}
              className="figure-img img-fluid rounded img-thumbnail"
            >
              <source src={url} type="video/mp4"></source>
              <source src={url} type="video/webm"></source>
            </video>
          ) : (
            <img src={url} alt="Importing" />
          )}
        </a>
        <figcaption className="figure-caption text-center">Importing Warscroll Builder/Azyr files</figcaption>
      </figure>
    </>
  )
}

const SaveLoadExample = ({ supportsWebm }) => {
  const url = supportsWebm ? '/img/save_load_demo.mp4' : '/img/save_load_demo.gif'

  return (
    <>
      <figure className="figure">
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => logClick('Demo-SaveLoad')}>
          {supportsWebm ? (
            <video
              preload="auto"
              controls={true}
              loop={true}
              className="figure-img img-fluid rounded img-thumbnail"
            >
              <source src={url} type="video/mp4"></source>
              <source src={url} type="video/webm"></source>
            </video>
          ) : (
            <img src={url} alt="Save and Load" />
          )}
        </a>
        <figcaption className="figure-caption text-center">Saving, loading, and deleting armies</figcaption>
      </figure>
    </>
  )
}
