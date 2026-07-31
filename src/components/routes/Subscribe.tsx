import { useAuth0 } from '@auth0/auth0-react'
import AlreadySubscribed from 'components/helpers/alreadySubscribed'
import { LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Contact from 'components/page/contact'
import { PricingPlans } from 'components/payment/pricingPlans'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect } from 'react'
import { logClick } from 'utils/analytics'
import useWindowSize from 'utils/hooks/useWindowSize'

const Navbar = lazy(() => import('components/page/navbar'))

/*
 * The intro and the feature list are one text column, so they share a measure and a left edge. They
 * previously used different widths (col-lg-8 vs col-lg-5) inside different wrappers, which left the
 * two prose blocks starting 236px apart on a 1440px screen.
 */
const contentClass = 'col-12 col-lg-8 col-xl-8 mx-auto'
const headerClass = `${contentClass} pt-5`

const Subscribe = () => {
  const { isLoading } = useAuth0()
  const { isSubscribed, isActive, getSubscription } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
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
      <div className={`${theme.bgColor} ${theme.text}`}>
        <CurrentFeatures />
      </div>
      {/*
        A full-bleed band, not a .row: a bare row's -15px margins overflowed the viewport by 15px and
        scrolled the whole page sideways. PricingPlans supplies its own .container.
      */}
      <div className={`py-5 ${theme.sectionBand} ${theme.text}`}>
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
  const { theme } = useTheme()
  if (!isMobile) return null

  return (
    <div className={`py-5 px-3 ${theme.sectionBand} ${theme.text}`}>
      <DemoVideo videoUrl="/img/dark_mode1.mp4" description="Dark Mode" label="Demo-DarkMode" />
    </div>
  )
}

const Intro = () => {
  const { theme } = useTheme()

  return (
    <div className={`${headerClass} ${theme.text}`}>
      {/* height reserves the box before the image loads; the intrinsic ratio is 919x843. */}
      <img
        alt="Subscribe to support AoS Reminders"
        className="d-block mx-auto mb-4 img-fluid rounded-circle bg-white"
        height="110"
        src="/img/logo_medium_padding.png"
        width="120"
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

const CurrentFeatures = () => (
  <div className={`${contentClass} mt-3`}>
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

interface DemoVideoProps {
  videoUrl: string
  description: string
  label: string
}

/**
 * The demo loops, so it needs a way to stop it (WCAG 2.2.2). The native controls provide that, and
 * their fullscreen button covers what the old wrapping link to the raw file was standing in for — a
 * link around the video would have swallowed every click the controls need.
 *
 * There is no .webm asset in public/img; the old `video/webm` source pointed at this same .mp4, and
 * the poster was a 1.8MB gif fronting an 862KB video. Both are gone.
 */
const DemoVideo = ({ videoUrl, description, label }: DemoVideoProps) => {
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <figure className="figure">
      {/* muted + playsInline are required for autoplay on iOS Safari and Android Chrome. */}
      <video
        aria-label={`${description} demo`}
        autoPlay={!prefersReducedMotion}
        className="figure-img img-fluid rounded img-thumbnail"
        controls
        height="550"
        loop
        muted
        onClick={() => logClick(label)}
        playsInline
        preload="metadata"
        width="320"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <figcaption className="figure-caption text-center">
        <strong>{description}</strong>
      </figcaption>
    </figure>
  )
}

export default Subscribe
