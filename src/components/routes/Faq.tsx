import { LinkNewTab } from 'components/helpers/link'
import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Contact from 'components/page/contact'
import Footer from 'components/page/footer'
import { useTheme } from 'context/useTheme'
import { lazy, Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GITHUB_URL, ROUTES } from 'utils/env'

const Navbar = lazy(() => import('components/page/navbar'))

/*
 * A reading column, not a card gallery. The previous layout was Bootstrap's featured-blog-post
 * example: three cards at col-md-8/col-lg-6/col-xl-5 that tiled 2-up and orphaned the third, with
 * the screenshots sized 200x250 regardless of what they actually were.
 *
 * The measure is set per breakpoint to hold answers near 75 characters a line. Sections reuse the
 * product's own card + Signal Teal header, so the FAQ reads as part of the same manual as the
 * reminders screen rather than as a marketing page bolted onto the side.
 */
const columnClass = 'col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-5'

/*
 * width/height are the size the screenshot is drawn at, kept on the asset's true ratio and always
 * below its capture size so nothing is upscaled. .img-fluid supplies max-width: 100% and
 * height: auto, so the pair reserves the correct box before the image loads and shrinks
 * proportionally on a narrow screen. Both were previously declared 200x250 whatever they were,
 * which reserved 180px the wide one never used and rendered it at 200x70 — unreadable.
 */
interface IFaqImage {
  alt: string
  height: number
  src: string
  width: number
}

interface IFaqEntry {
  answer: React.ReactNode
  /** Anchor target, so a question can be linked to directly. */
  id: string
  image?: IFaqImage
  question: string
}

interface IFaqSection {
  entries: IFaqEntry[]
  id: string
  title: string
}

const GithubIssuesLink = () => (
  <LinkNewTab className="FaqLink" href={`${GITHUB_URL}/issues`}>
    open an issue on Github
  </LinkNewTab>
)

const WahapediaLink = () => (
  <LinkNewTab className="FaqLink" href="//wahapedia.ru/aos4/the-rules/">
    Wahapedia
  </LinkNewTab>
)

const ProfileLink = ({ children }: React.PropsWithChildren<object>) => (
  <Link className="FaqLink" to={ROUTES.PROFILE}>
    {children}
  </Link>
)

/*
 * Every claim below is checked against what the app ships today. Control names are bolded and
 * spelled exactly as they appear in the interface so they can be found by eye.
 */
const FaqSections: IFaqSection[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    entries: [
      {
        id: 'what-is-this',
        question: 'What does AoS Reminders actually do?',
        answer: (
          <>
            You give it the army you are bringing. It works out every ability that army grants you and lists
            those abilities under the window they fire in — deployment, each of the seven turn phases, the
            start and end of a battle round, and reactions to your opponent. It is not a rules search. It is
            your list, in turn order.
          </>
        ),
      },
      {
        id: 'import-a-roster',
        question: 'Do I have to build my list here?',
        answer: (
          <>
            No. <strong>Import Army</strong> takes the roster you already made: text exported from the
            official Warhammer Age of Sigmar app or from Listbot 4.0, and New Recruit .ros, .rosz, or .json
            files. You can paste the text or drop the file in. An imported roster sets your selections — it is
            never treated as a rules authority.
          </>
        ),
      },
      {
        id: 'edit-and-play',
        question: 'What is the difference between Edit and Play mode?',
        answer: (
          <>
            Edit is for the desk: you get the faction picker, the army builder, and the toolbar, and rules you
            have hidden are still listed. Play is for the table: the builder and the toolbar disappear, hidden
            rules drop out completely, and what is left is what fires in this game. The switch sits at the top
            of the home page.
          </>
        ),
      },
      {
        id: 'hide-reminders',
        question: 'How do I get rid of reminders I already know?',
        answer: (
          <>
            Open the ⋯ menu on any reminder and choose <strong>Hide rule</strong>. It stays out of Play mode
            until you change your mind — <strong>Show Hidden</strong> in the toolbar keeps a count and brings
            them all back at once. The same menu has <strong>Add note</strong> for writing your own line under
            a rule, and you can drag reminders into a different order within their phase.
          </>
        ),
      },
    ],
  },
  {
    id: 'at-the-table',
    title: 'At the table',
    entries: [
      {
        id: 'print-and-pdf',
        question: 'Can I take this to the table on paper?',
        answer: (
          <>
            Yes, and it costs nothing. <strong>Download PDF</strong> in the toolbar builds the sheet in your
            browser — <strong>Standard</strong> for larger type in a single column, <strong>Compact</strong>{' '}
            for two columns and fewer pages — on A4 or US Letter. Your notes come with it, and anything you
            hid stays hidden.
          </>
        ),
      },
      {
        id: 'offline',
        question: 'Does it work without a signal?',
        answer: (
          <>
            Partly, and I would not count on it. No rules data is fetched while you play — the whole corpus
            ships with the page — and your current army is kept in this browser, so a connection that drops
            mid-game does not take your reminders with it. But there is no offline cache yet: if the tab is
            not already open, a dead connection is a dead page. Venue signal being what it is, take the PDF.
          </>
        ),
      },
    ],
  },
  {
    id: 'rules-and-data',
    title: 'Rules and data',
    entries: [
      {
        id: 'which-edition',
        question: 'Which rules does this cover?',
        answer: (
          <>
            Age of Sigmar fourth edition, defaulting to the current General&apos;s Handbook 2026-27 season.
            Third edition is gone: armies you saved under the old third-edition site are not carried across,
            and are cleared out when the app loads.
          </>
        ),
      },
      {
        id: 'where-rules-come-from',
        question: 'Where do the rules come from?',
        answer: (
          <>
            Games Workshop publications are the authority. <WahapediaLink /> is used to find and cross-check
            coverage. Every reminder carries its source in the ⋯ menu, and anything drawn from a Games
            Workshop publication is badged <strong>Official</strong> and links to the document it came from.
            Powered by Wahapedia.
          </>
        ),
      },
      {
        id: 'wrong-or-missing-rule',
        question: "I've noticed an incorrect or missing rule!",
        answer: (
          <>
            <p>
              Please tell me. Corrections go into the rules data and are re-verified against the sources, so
              the fix reaches everyone rather than only your army. Naming the faction and the warscroll or
              ability makes it much faster to track down.
            </p>
            <p className="mb-2">
              The best route is to <GithubIssuesLink />. Discord and email work too.
            </p>
            <Contact size="small" />
          </>
        ),
      },
      {
        id: 'is-this-official',
        question: 'Is this an official Games Workshop app?',
        answer: (
          <>
            No. AoS Reminders is unofficial and fan-made, is in no way endorsed or sanctioned by Games
            Workshop, and takes no credit for their content. I build and run it on my own time.
          </>
        ),
      },
    ],
  },
  {
    id: 'account',
    title: 'Account and subscription',
    entries: [
      {
        id: 'what-subscription-includes',
        question: 'What does a subscription get me?',
        answer: (
          <>
            <strong>My Armies</strong> keeps your armies on your account so they follow you between devices —
            save, load, rename, update, and delete. <strong>Share Army</strong> creates a link a friend can
            open to take their own copy of the list. And dark theme. Everything else — the builder, importing,
            reminders, notes, hiding, reordering, and the PDF — is free, and stays free. See{' '}
            <Link className="FaqLink" to={ROUTES.SUBSCRIBE}>
              the plans
            </Link>
            .
          </>
        ),
      },
      {
        id: 'dark-theme',
        question: 'How do I turn on dark theme?',
        answer: (
          <>
            Subscribe, then switch <strong>Visual Theme</strong> on your <ProfileLink>Profile</ProfileLink>.
            It is stored against your account, so it follows you to your other devices.
          </>
        ),
      },
      {
        id: 'cannot-log-in',
        question: "I can't recover my password!",
        answer: (
          <>
            If you signed up with Google, there is no AoS Reminders password to recover — use{' '}
            <strong>Continue with Google</strong> on the log in screen rather than the email and password
            fields.
          </>
        ),
        // Captured at 382x500.
        image: {
          alt: 'The AoS Reminders log in screen, with the "Continue with Google" button below the email and password fields.',
          height: 360,
          src: '/img/faq_continue_with_google.png',
          width: 275,
        },
      },
      {
        id: 'unsubscribe',
        question: 'How do I unsubscribe?',
        answer: (
          <>
            Log in, open your <ProfileLink>Profile</ProfileLink>, and click{' '}
            <strong>Cancel Subscription</strong>. You keep every subscription feature until the end of the
            period you have already paid for.
          </>
        ),
        // Captured at 800x280.
        image: {
          alt: 'The Profile page, with the "Cancel Subscription" button beneath the subscription details.',
          height: 140,
          src: '/img/faq_unsubscribe.png',
          width: 400,
        },
      },
      {
        id: 'card-details',
        question: 'Do you store my card details?',
        answer: (
          <>
            No. There is no card field anywhere on this site. Payment happens on Stripe&apos;s own hosted
            checkout or through PayPal&apos;s button, and they manage the subscription from there — including
            cancelling it.
          </>
        ),
      },
      {
        id: 'gift',
        question: 'Can I give a subscription to someone else?',
        answer: (
          <>
            Yes. <strong>Gift a Subscription</strong> on your <ProfileLink>Profile</ProfileLink> charges you
            once — it is not a recurring subscription — and gives you a one-time-use link to send on.
          </>
        ),
      },
    ],
  },
]

const Faq = () => {
  const { theme } = useTheme()

  useEffect(() => {
    /*
     * Questions carry anchors now, so /faq#unsubscribe has to survive arrival. Scrolling to the top
     * unconditionally would land the reader back at the masthead every time.
     */
    const { hash } = window.location
    const target = hash ? document.getElementById(hash.slice(1)) : null
    /*
     * `instant` is required, not a preference. Bootstrap 5.3 sets `scroll-behavior: smooth` on
     * `:root` (4.6 did not), so a bare scrollIntoView() starts an animation from the top that the
     * browser's own load-time scroll handling cancels — the reader lands at the masthead and the
     * anchor silently does nothing. An arrival jump should be instant anyway; the smooth behaviour
     * still applies to the section links, which is where it reads well.
     */
    if (target) return target.scrollIntoView({ behavior: 'instant' })
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2 d-print-none`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={`container ${theme.bgColor} ${theme.text} pt-3 pb-5`}>
        <div className="row justify-content-center">
          <div className={columnClass}>
            <PageHeader />
            {FaqSections.map(section => (
              <FaqSectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

const PageHeader = () => (
  <div className="text-center">
    {/* Rendered at h2 size so the page gains a top-level heading without a visual change. */}
    <h1 className="h2">Frequently Asked Questions</h1>
    {/*
      A flex row, not a line of inline links. JSX leaves no whitespace between siblings, so an
      inline row has no break opportunity and ran 546px wide in a 371px viewport, scrolling the
      whole page sideways. Each title stays whole (text-nowrap) and the row wraps between them.
    */}
    <nav aria-label="Sections" className="d-flex flex-wrap justify-content-center d-print-none">
      {FaqSections.map(section => (
        <a className="FaqLink text-nowrap mx-2 mb-1" href={`#${section.id}`} key={section.id}>
          {section.title}
        </a>
      ))}
    </nav>
    <hr />
  </div>
)

const FaqSectionCard = ({ section }: { section: IFaqSection }) => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.card} mb-4 shadow-sm`} id={section.id}>
      <div className={theme.cardHeader}>
        {/* Sits directly under the page h1, matching every other section header in the product. */}
        <h2 className="CardHeaderTitle">{section.title}</h2>
      </div>
      <div className={theme.cardBody}>
        {section.entries.map(entry => (
          <FaqEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}

const FaqEntry = ({ entry }: { entry: IFaqEntry }) => {
  const { isDark } = useTheme()

  return (
    <div className={`FaqEntry PageBreak ${isDark ? 'FaqEntry-Dark' : ''}`}>
      {/* .h5 keeps the question below the section header in size without changing its outline level. */}
      <h3 className="h5 mb-2" id={entry.id}>
        {entry.question}
      </h3>
      <div className="mb-0">{entry.answer}</div>
      {entry.image && <FaqFigure image={entry.image} />}
    </div>
  )
}

const FaqFigure = ({ image }: { image: IFaqImage }) => (
  <figure className="figure d-block mt-3 mb-0">
    <img
      alt={image.alt}
      className="figure-img img-fluid bg-white border rounded mb-0"
      height={image.height}
      loading="lazy"
      src={image.src}
      width={image.width}
    />
  </figure>
)

export default Faq
