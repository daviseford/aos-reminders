import React, { useEffect, lazy, Suspense, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { logPageView, logClick } from 'utils/analytics'
import { LoadingBody, LoadingHeader, LargeSpinner } from 'components/helpers/suspenseFallbacks'
import { LinkNewTab } from 'components/helpers/link'
import { componentWithSize } from 'utils/mapSizesToProps'
import GenericButton from 'components/input/generic_button'
import { Link } from 'react-router-dom'
import { ROUTES } from 'utils/env'
import { centerContentClass } from 'theme/helperClasses'

const Navbar = lazy(() => import('components/page/navbar'))

const Stats: React.FC = componentWithSize(({ isMobile = false }) => {
  const { loading }: { loading: boolean } = useAuth0()
  const { isActive, getSubscription, subscriptionLoading } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading || subscriptionLoading) return <LoadingBody />

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>
      {isActive ? <SubscribedView /> : <UnsubscribedView />}>
    </div>
  )
})

const SubscribedView: React.FC = componentWithSize(({ isMobile = false, width = 320 }) => {
  const { theme } = useTheme()

  const [iframeIsLoaded, setIFrameIsLoaded] = useState(false)

  const iframeUrl = `https://datastudio.google.com/embed/reporting/5e1a60c3-06b3-40b8-9994-01dc86393665/page/${
    width < 1000 ? `KXaCB` : `C3m7`
  }`

  return (
    <>
      <div className={`container ${theme.bgColor} ${theme.text} pb-4`}>Welcome to the stats page</div>

      <div className={`container ${theme.bgColor} ${theme.text}`}>
        {!iframeIsLoaded && <LargeSpinner />}
        <div className={`row ${theme.bgColor} align-items-start justify-content-center mt-3 StatsIFrame`}>
          <iframe
            width="100%"
            height="100%"
            onLoad={() => setIFrameIsLoaded(true)}
            src={iframeUrl}
            frameBorder="0"
            allowFullScreen
            title="Stats"
          ></iframe>
        </div>

        {/* Post-stats section */}
        <CoachShoutout />
      </div>
    </>
  )
})

const CoachShoutout = () => {
  const { theme } = useTheme()
  return (
    <div className={`row ${theme.bgColor} ${theme.text} mt-3 text-center`}>
      <div className="col">
        <h4>Go Deeper</h4>
        Check out AoS Coach's{' '}
        <LinkNewTab
          href="https://www.youtube.com/playlist?list=PLVceda-W9EygvVeoWhrKaBBCvIiSWasVo"
          label={`CoachLink`}
        >
          Emerging Meta
        </LinkNewTab>{' '}
        series, where he deep-dives on these stats and explains the latest trends.
      </div>
    </div>
  )
}

const SubscribeBtn = () => {
  const { theme } = useTheme()
  return (
    <Link to={ROUTES.SUBSCRIBE} className={theme.genericButton} onClick={() => logClick('Stats-Subscribe')}>
      <div className={centerContentClass}>Subscribe</div>
    </Link>
  )
}

const UnsubscribedView = componentWithSize(({ isMobile = false }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const { isActive } = useSubscription()
  const { theme } = useTheme()

  return (
    <div className={`container ${theme.bgColor} ${theme.text} pb-4`}>
      <div className={`row`}>
        <div className={`col text-center`}>
          <p>AoS Reminders is used by tons of players all over the world.</p>
          <p>
            Do you want insights into popular battalions, must-have artifacts, and optimal traits and
            allegiances?
          </p>
        </div>
      </div>

      <div className={`row align-items-center justify-content-center`}>
        {!isAuthenticated && (
          <GenericButton onClick={loginWithRedirect} className={theme.genericButton}>
            Login
          </GenericButton>
        )}

        {!isAuthenticated && <span className="mx-2">or</span>}

        {!isActive && <SubscribeBtn />}
      </div>
      <div className={`row align-items-center justify-content-center mt-3`}>
        <img
          className={`d-block mx-auto mb-4 img-fluid`}
          src="/img/stats_cta_mobile.png"
          alt="Subscribe to access advanced stats"
        />
      </div>

      <CoachShoutout />
    </div>
  )
})

export default Stats
