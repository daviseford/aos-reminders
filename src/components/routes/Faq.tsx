import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Footer from 'components/page/footer'
import { useTheme } from 'context/useTheme'
import React, { lazy, Suspense, useEffect } from 'react'
import { logPageView } from 'utils/analytics'

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
        <div className={`row`}>
          <FaqEntry
            title="I can't recover my password!"
            text={`If you're attempting to recover your password, and you're not seeing a recovery email - please try clicking "Continue with Google" when you see the log in.`}
            imgUrl={'/img/faq_continue_with_google.png'}
          />
          <FaqEntry
            title="How do I unsubscribe?"
            text={`Log in and then visit your Profile. From there, please click "Cancel Subscription"`}
            imgUrl={'/img/faq_unsubscribe.png'}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

type TFaqEntryProps = { title: string; text: string; imgUrl?: string }

const FaqEntry = ({ title, text, imgUrl = '' }: TFaqEntryProps) => {
  return (
    <div className={'col-12 col-md-8 col-lg-6 col-xl-5 mx-xl-1'}>
      <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
        <div className="col p-4 d-flex flex-column position-static">
          <h3 className="mb-0">{title}</h3>
          <p className="card-text mb-auto">{text}</p>
        </div>
        {imgUrl && (
          <div className="col-auto d-none d-block d-sm-block d-md-block d-lg-block align-self-center">
            <img
              className={`mx-auto mb-4 img-fluid bg-white`}
              src={imgUrl}
              alt=""
              width="200"
              height="250"
              role="img"
            />
          </div>
        )}
      </div>
    </div>
  )
}

const PageHeader = () => {
  const { theme } = useTheme()
  return (
    <div className={`container ${theme.bgColor} ${theme.text} text-center mt-3 pb-2`}>
      <h2>Frequently Asked Questions</h2>
      <hr />
    </div>
  )
}

export default Faq
