import React, { useEffect, lazy, Suspense, useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { logPageView } from 'utils/analytics'
import { LoadingBody, LoadingHeader, LargeSpinner } from 'components/helpers/suspenseFallbacks'
import { LinkNewTab } from 'components/helpers/link'
import { componentWithSize } from 'utils/mapSizesToProps'

const Navbar = lazy(() => import('components/page/navbar'))

const Stats: React.FC = componentWithSize(({ isMobile = false }) => {
  const { loading }: { loading: boolean } = useAuth0()
  const { getSubscription } = useSubscription()
  const { theme } = useTheme()

  const [iframeIsLoaded, setIFrameIsLoaded] = useState(false)

  const iframeUrl = `https://datastudio.google.com/embed/reporting/5e1a60c3-06b3-40b8-9994-01dc86393665/page/${
    isMobile ? `KXaCB` : `C3m7`
  }`

  // const iframeUrl = isMobile
  //   ? `https://datastudio.google.com/embed/reporting/5e1a60c3-06b3-40b8-9994-01dc86393665/page/KXaCB`
  //   : `https://datastudio.google.com/embed/reporting/5e1a60c3-06b3-40b8-9994-01dc86393665/page/C3m7`

  useEffect(() => {
    logPageView()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  if (loading) return <LoadingBody />

  return (
    <div className={`d-block ${theme.bgColor} FullHeight`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={`container ${theme.bgColor} ${theme.text} pb-4`}>Welcome to the stats page</div>

      <div className={`container ${theme.bgColor} ${theme.text} FullHeight`}>
        {!iframeIsLoaded && <LargeSpinner />}
        <div className="row align-items-start justify-content-center mt-3 FullHeight">
          <iframe
            width="100%"
            height="100%"
            onLoad={() => setIFrameIsLoaded(true)}
            onEnded={() => console.log('akaka')}
            src={iframeUrl}
            frameBorder="0"
            allowFullScreen
            title="Stats"
          ></iframe>
        </div>
      </div>

      {/* Post-stats section */}
      <div className="row mt-3 text-center">
        <div className="col">
          <h4>Overwhelmed?</h4>
          Check out AoS Coach's{' '}
          <LinkNewTab
            href="https://www.youtube.com/playlist?list=PLVceda-W9EygvVeoWhrKaBBCvIiSWasVo"
            label={`CoachLink`}
          >
            Emerging Meta
          </LinkNewTab>{' '}
          series, where he deep-dives on these stats and explains why certain items are popular.
        </div>
      </div>
    </div>
  )
})

export default Stats
