import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Footer from 'components/page/footer'
import { useTheme } from 'context/useTheme'
import { lazy, Suspense, useEffect } from 'react'
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
        <div className="row">
          <FaqEntry
            title="I can't recover my password!"
            text={`If you're attempting to recover your password, and you're not seeing a recovery email - please try clicking "Continue with Google" when you see the log in.`}
            imgUrl="/img/faq_continue_with_google.png"
            imgAlt='The AoS Reminders log in screen, with the "Continue with Google" button below the email and password fields.'
          />
          <FaqEntry
            title="How do I unsubscribe?"
            text={`Log in and then visit your Profile. From there, please click "Cancel Subscription"`}
            imgUrl="/img/faq_unsubscribe.png"
            imgAlt='The Profile page, with the "Cancel Subscription" button beneath the subscription details.'
          />
          <FaqEntry
            title="I've noticed an incorrect or missing rule!"
            text="Please ping me on Discord, email me, or open a new issue on Github."
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

interface FaqEntryProps {
  imgAlt?: string
  imgUrl?: string
  text: string
  title: string
}

const FaqEntry = ({ title, text, imgUrl = '', imgAlt = '' }: FaqEntryProps) => (
  <div className="col-12 col-md-8 col-lg-6 col-xl-5 mx-xl-1">
    {/*
      `g-0` was removed rather than migrated. It is Bootstrap 5 syntax that did nothing under 4.6
      (which spelled it `no-gutters`), so this row has always rendered *with* gutters: the bordered
      box is pulled 15px wider than its column and the image column carries 15px of padding. The
      upgrade would have brought the class to life and quietly narrowed every FAQ card, which is a
      visual change this migration is not authorised to make. Restoring the zero-gutter intent is a
      design decision for another day.
    */}
    <div className="row border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
      <div className="col p-4 d-flex flex-column position-static">
        {/* Sits directly under the page h1, so it is an h2. .h3 keeps the existing type scale. */}
        <h2 className="mb-0 h3">{title}</h2>
        <p className="card-text mb-auto">{text}</p>
      </div>
      {imgUrl && (
        <div className="col-12 col-sm-auto align-self-center">
          <img
            className="mx-auto mb-4 img-fluid bg-white"
            src={imgUrl}
            alt={imgAlt}
            width="200"
            height="250"
            loading="lazy"
          />
        </div>
      )}
    </div>
  </div>
)

const PageHeader = () => {
  const { theme } = useTheme()
  return (
    <div className={`container ${theme.bgColor} ${theme.text} text-center mt-3 pb-2`}>
      {/* Rendered at h2 size so the page gains a top-level heading without a visual change. */}
      <h1 className="h2">Frequently Asked Questions</h1>
      <hr />
    </div>
  )
}

export default Faq
