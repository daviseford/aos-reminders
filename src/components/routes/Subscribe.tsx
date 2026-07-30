import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LinkNewTab } from 'components/helpers/link'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Contact from 'components/page/contact'
import { PricingPlans } from 'components/payment/pricingPlans'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect } from 'react'
import { logClick, logPageView } from 'utils/analytics'
import useWindowSize from 'utils/hooks/useWindowSize'

const Navbar = lazy(() => import('components/page/navbar'))
const headerClass = 'col-12 col-lg-8 col-xl-8 pt-5 mx-auto'

const Subscribe = () => {
  const { isLoading } = useAuth0()
  const { isSubscribed, isActive, getSubscription } = useSubscription()
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
      <div className={`container ${theme.bgColor} ${theme.text}`}>
        <div className="row align-items-start justify-content-center mt-3">
          <CurrentFeatures />
        </div>
      </div>
      <div className="row py-5 bg-light justify-content-center jumbotron-fluid">
        <PricingPlans />
      </div>
      <ExamplesRow />
      <div className={`container ${theme.bgColor} ${theme.text} text-center py-4`}>
        <Contact size="small" />
      </div>
    </div>
  )
}

const ExamplesRow = () => {
  const { isMobile } = useWindowSize()
  if (!isMobile) return null

  return (
    <div className="row py-5 mx-3 bg-light justify-content-center jumbotron-fluid">
      <div className="col-12">
        <WebmWithFallback
          webmUrl="/img/dark_mode1.mp4"
          gifUrl="/img/dark_mode1.gif"
          description="Dark Mode"
          label="Demo-DarkMode"
        />
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
        width="120"
        alt="Subscribe to support AoS Reminders"
      />
      {/* Rendered at h2 size so the page gains a top-level heading without a visual change. */}
      <h1 className="h2">Support AoS Reminders</h1>
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
      <li>Save, load, rename, update, and delete AoS 4 armies across your devices.</li>
      <li>Create read-only army links to share with your friends.</li>
      <li>Spare your eyes! Turn on dark mode!</li>
      <li>Help keep AoS Reminders free for everyone.</li>
    </ul>
  </div>
)

interface WebmWithFallbackProps {
  webmUrl: string
  gifUrl: string
  description: string
  label: string
}

const WebmWithFallback = ({ webmUrl, gifUrl, description, label }: WebmWithFallbackProps) => {
  const supportsWebm = !!document.createElement('video').canPlayType

  return (
    <figure className="figure">
      <LinkNewTab href={supportsWebm ? webmUrl : gifUrl} onClick={() => logClick(label)} label="Video URL">
        {/* muted + playsInline are required for autoplay on iOS Safari and Android Chrome. */}
        <video
          preload="metadata"
          loop
          muted
          playsInline
          poster={gifUrl}
          autoPlay
          className="figure-img img-fluid rounded img-thumbnail"
        >
          <source src={webmUrl} type="video/mp4" />
          <source src={webmUrl} type="video/webm" />
        </video>
      </LinkNewTab>
      <figcaption className="figure-caption text-center">
        <strong>{description}</strong>
      </figcaption>
    </figure>
  )
}

export default Subscribe
