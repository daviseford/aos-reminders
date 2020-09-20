import { LinkNewTab } from 'components/helpers/link'
import { LargeSpinner, LoadingBody, LoadingHeader } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import FooterComponent from 'components/page/footer'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { FaSignInAlt, FaUserGraduate } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { centerContentClass } from 'theme/helperClasses'
import { IUseAuth0 } from 'types/auth0'
import { logClick, logPageView } from 'utils/analytics'
import { ROUTES } from 'utils/env'
import { componentWithSize } from 'utils/mapSizesToProps'

const Navbar = lazy(() => import('components/page/navbar'))

const Stats: React.FC = componentWithSize(({ isMobile = false }) => {
  const { loading }: IUseAuth0 = useAuth0()
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
      <PageHeader />
      {isActive ? <SubscribedView /> : <UnsubscribedView />}
      <FooterComponent />
    </div>
  )
})

const SubscribedView: React.FC = componentWithSize(({ isMobile = false, width = 320 }) => {
  const { theme, isDark } = useTheme()

  const reportUrl = {
    dark: {
      desktop: `C3m7`,
      mobile: `KXaCB`,
    },
    light: {
      desktop: `mqjCB`,
      mobile: `tqjCB`,
    },
  }[isDark ? 'dark' : 'light'][width < 1000 ? 'mobile' : 'desktop']

  const [iframeIsLoaded, setIFrameIsLoaded] = useState(false)

  const iframeUrl = `https://datastudio.google.com/embed/reporting/5e1a60c3-06b3-40b8-9994-01dc86393665/page/${reportUrl}`

  return (
    <>
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
        <Methodology />
      </div>
    </>
  )
})

const Methodology = () => {
  const { theme } = useTheme()
  return (
    <div className={`row ${theme.bgColor} ${theme.text} mt-3`}>
      <div className="col">
        <h3>FAQ</h3>
        <h5>How are these stats collected?</h5>
        <p>
          Everytime you select a unit, faction, trait, or anything else in AoS Reminders, that selection is
          logged. Every PDF or HTML file that is imported is also logged.
        </p>

        <h5>Doesn't that just mean these are popular choices?</h5>
        <p>
          Yes. The great thing about the Warhammer community is that it's full of detailed-oriented players
          who tend to congregate towards powerful, efficient choices. If you build lists using this data as a
          starting point, you will generally find yourself building a very strong list.
        </p>

        <h5>Player X just won a tournament without using the most popular choices! Your stats suck!</h5>
        <p>
          That's not a question, but listen - you should view these stats as a helpful aggregation of
          prevailing ideas regarding the current AoS meta - in other words, these stats represent the{' '}
          <LinkNewTab label="WisdomOfCrowds" href="https://en.wikipedia.org/wiki/Wisdom_of_the_crowd">
            wisdom of the crowds.
          </LinkNewTab>
        </p>
        <p>
          We're not necessarily going to be able to predict the list composition of a specific top-table army
          - but we can <em>probably</em> predict the number of Ossiarch Bonereapers armies that will use the
          Petrifex Elite legion in a given tournament.
        </p>

        <h5>My gaming group doesn't use this, so these stats aren't accurate!</h5>
        <p>
          One of the great things about statistics is that we can infer large trends in a population from a
          smaller subset of data. For example, when political parties conduct polling, they don't literally
          call every single person in the country to get their thoughts. They collect data from a varied
          subset of the population and extrapolate from there. That's how population-based statistics work!
        </p>
        <p>
          Similarly, while you may not personally be represented in these stats, that does not render them
          useless. Thousands of lists are created every week using AoS Reminders, and trends certainly do
          emerge. Furthermore, those trends closely mirror competitive play - go look at Endless Spells used
          in tournaments vs. the most popular Endless Spells in AoS Reminders. They will be nearly identical.
        </p>
      </div>
    </div>
  )
}

const PageHeader = () => {
  const { theme } = useTheme()
  return (
    <div className={`container ${theme.bgColor} ${theme.text} text-center mt-3 pb-2`}>
      <h2>Advanced Analytics</h2>
    </div>
  )
}

const CoachShoutout = () => {
  const { theme } = useTheme()
  return (
    <div
      className={`row ${theme.bgColor} ${theme.text} mt-3 text-center align-items-start justify-content-center`}
    >
      <div className="col-12 mt-2">
        <h3>Go Deeper with AoS Coach</h3>
      </div>
      <div className="col-12 col-md-8 col-xl-6">
        <div className="embed-responsive embed-responsive-16by9">
          <iframe
            className="embed-responsive-item"
            title="Emerging Meta Series"
            width="100%"
            height="100%"
            src="https://www.youtube-nocookie.com/embed/videoseries?list=PLVceda-W9EygvVeoWhrKaBBCvIiSWasVo"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="col-12 mt-2">
        <p>
          Check out AoS Coach's{' '}
          <LinkNewTab
            href="https://www.youtube.com/playlist?list=PLVceda-W9EygvVeoWhrKaBBCvIiSWasVo"
            label={`CoachLink`}
          >
            Emerging Meta
          </LinkNewTab>{' '}
          series, where he goes in depth on these stats and explains the latest trends.
        </p>
      </div>
    </div>
  )
}

const SubscribeBtn = () => {
  const { theme } = useTheme()
  return (
    <Link
      to={ROUTES.SUBSCRIBE}
      className={`${theme.genericButton} btn-lg`}
      onClick={() => logClick('Stats-Subscribe')}
    >
      <div className={centerContentClass}>
        <FaUserGraduate className="mr-2" />
        Subscribe
      </div>
    </Link>
  )
}

const UnsubscribedView = componentWithSize(({ isMobile = false }) => {
  const { isAuthenticated, loginWithRedirect }: IUseAuth0 = useAuth0()
  const { isActive } = useSubscription()
  const { theme } = useTheme()

  return (
    <div className={`container-fluid ${theme.bgColor} ${theme.text} pb-4`}>
      <div className={`row`}>
        <div className={`col text-center`}>
          <p>AoS Reminders is used by thousands of players all over the world.</p>
          <p>
            Do you want insights into popular battalions, must-have artifacts, and optimal traits and
            allegiances?
          </p>
        </div>
      </div>

      <div className={`row align-items-center justify-content-center mt-2`}>
        {!isAuthenticated && (
          <GenericButton
            onClick={() => loginWithRedirect({ redirect_uri: window.location.href })}
            className={`${theme.genericButton} btn-lg`}
          >
            <FaSignInAlt className="mr-2" />
            Login
          </GenericButton>
        )}

        {!isAuthenticated && <span className="mx-2">or</span>}

        {!isActive && <SubscribeBtn />}
      </div>

      <div className={`row mt-3`}>
        <div className={`col text-center`}>
          <p>
            Subscribe now to unlock advanced stats - view historical selections broken down by faction,
            category, or value!
          </p>
          <p>
            Find out which artifacts, traits, and battalions are typically used with <em>any</em> faction.
          </p>
        </div>
      </div>

      <div
        className={`row align-items-center justify-content-center mt-3`}
        style={{ backgroundColor: '#F4F4F4' }}
      >
        <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick('Stats-Cta-Subscribe')}>
          <img
            className={`d-block mx-auto mb-4 img-fluid`}
            src={`/img/stats_cta_${isMobile ? `mobile` : `desktop`}.png`}
            alt="Subscribe to access advanced stats"
          />
        </Link>
      </div>

      <CoachShoutout />
    </div>
  )
})

export default Stats
