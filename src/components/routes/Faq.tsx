import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Footer from 'components/page/footer'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect } from 'react'
import { logPageView } from 'utils/analytics'
import useWindowSize from 'utils/hooks/useWindowSize'

const Navbar = lazy(() => import('components/page/navbar'))

const Faq = () => {
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>
      <PageHeader />

      <div className={`container ${theme.bgColor} ${theme.text}`}>
        <LoginFaq />
        <UnsubscribeFaq />
      </div>

      <Footer />
    </div>
  )
}

const LoginFaq = () => {
  return (
    <>
      <FaqEntry
        title="I can't recover my password!"
        text={`If you're attempting to recover your password, and you're not seeing a recovery email - please try clicking "Continue with Google" when you see the log in.`}
        imgUrl={'/img/faq_continue_with_google.png'}
      />
    </>
  )
}

const UnsubscribeFaq = () => {
  return (
    <>
      <FaqEntry
        title="How do I unsubscribe?"
        text={`Log in and then visit your Profile. From there, please click "Cancel Subscription"`}
      />
    </>
  )
}

const FaqEntry = ({ title, text, imgUrl = '' }: { title: string; text: string; imgUrl?: string }) => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const textColClass = imgUrl ? (isMobile ? 'col-12' : 'col-6') : 'col'
  return (
    <div className={`row ${theme.bgColor} ${theme.text} mt-3`}>
      <div className={textColClass}>
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
      {imgUrl && (
        <div className={isMobile ? 'col-12' : 'col-6'}>
          <img className={`d-block mx-auto mb-4 img-fluid bg-white`} src={imgUrl} alt="" />
        </div>
      )}
    </div>
  )
}

const PageHeader = () => {
  const { theme } = useTheme()
  return (
    <div className={`container ${theme.bgColor} ${theme.text} text-center mt-3 pb-2`}>
      <h2>Frequently Asked Questions</h2>
    </div>
  )
}

export default Faq
