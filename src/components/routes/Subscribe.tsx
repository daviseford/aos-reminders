import React, { useEffect } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { logPageView } from 'utils/analytics'
import { NavBar } from 'components/page/navbar'
import { PricingPlans } from 'components/payment/pricingPlans'
import { Loading } from 'components/page/loading'

export const Subscribe: React.FC<{}> = () => {
  const { loading }: { loading: boolean } = useAuth0()
  const { isSubscribed, getSubscription } = useSubscription()

  useEffect(() => {
    logPageView()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading) return <Loading />
  if (isSubscribed) return <AlreadySubscribed />

  const headerClass = `col-12 col-lg-8 col-xl-8 py-5 mx-auto`
  const featuresClass = `col-12`

  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>

      <div className={headerClass}>
        <img
          className="d-block mx-auto mb-4 img-fluid"
          src="/img/logo_noURL.png"
          width="100px"
          alt="Subscribe to support AoS Reminders"
        />
        <h2>Support AoS Reminders</h2>
        <p className="lead">
          It takes a lot of time, effort, and money to keep this project going. While the core product will{' '}
          <i>always</i> be free, I do offer this subscription service to those who wish to support AoS
          Reminders.
        </p>
        <p className="lead">
          <strong>What do you get by joining AoS Reminders?</strong>
        </p>
        <div className="row align-items-start justify-content-center">
          <div className={featuresClass}>
            <ul className="lead">
              <li>
                Import your army lists <strong>instantly</strong> from Warscroll Builder
              </li>
              <li>
                Access your saved army lists from <b>anywhere</b> on <b>any</b> device
              </li>
            </ul>
          </div>
          <div className={'col-12 col-lg-5 col-xl-5'}>
            <ImportWarscrollExample />
          </div>
          <div className={'col-12 col-lg-5 col-xl-5'}>
            <LoadArmyExample />
          </div>
        </div>
        <p className="lead">Coming soon: </p>
        <ul className="lead">
          <li>
            <i>Importing army lists from Battlescribe</i>
          </li>
          <li>
            <i>Adding custom reminders</i>
          </li>
          <li>
            <i>
              <b>and much more!</b>
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

      <div>
        <PricingPlans />
      </div>
    </div>
  )
}

const AlreadySubscribed = () => {
  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>
      <div className="row d-flex align-items-center">
        <div className="mx-5 my-5 py-5 px-5">
          <p className="lead text-center">You are already a supporter :) Thanks!</p>
        </div>
      </div>
    </div>
  )
}

// TODO: Make this a carousel of images showing demo features?
const LoadArmyExample = () => {
  return (
    <>
      <figure className="figure">
        <img
          src="/img/load_army_example.png"
          alt="Load Army Example"
          className="figure-img img-fluid rounded img-thumbnail"
        />
        <figcaption className="figure-caption text-center">Loading a saved army</figcaption>
      </figure>
    </>
  )
}

const ImportWarscrollExample = () => {
  return (
    <>
      <figure className="figure">
        <img
          src="/img/warscroll-example3.gif"
          alt="Import Army from Warscroll Builder"
          className="figure-img img-fluid rounded img-thumbnail"
        />
        <figcaption className="figure-caption text-center">Importing a Warscroll Builder PDF</figcaption>
      </figure>
    </>
  )
}
