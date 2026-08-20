import Spinner from 'components/helpers/spinner'
import GenericButton from 'components/input/generic_button'
import NavbarWrapper from 'components/page/navbar_wrapper'
import { useTheme } from 'context/useTheme'
import { FiWifiOff } from 'react-icons/fi'
import { Link } from 'react-router'
import { navbarStyles } from 'theme/helperClasses'
import { ROUTES } from 'utils/env'

export const LoadingBtn = ({ text = 'Loading' }: { text?: string }) => (
  <GenericButton disabled type="button">
    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" /> {text}
  </GenericButton>
)

export const OfflineBtn = ({ text = 'Offline' }: { text?: string }) => (
  <GenericButton disabled type="button">
    <FiWifiOff className="me-2 text-danger" /> {text}
  </GenericButton>
)

export const LoadingHeader = () => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.headerColor} py-2`}>
      <NavbarWrapper>
        <div className="py-1 me-3 me-sm-5 align-items-center">
          <Spinner variant="light" size="small" />
        </div>
      </NavbarWrapper>
    </div>
  )
}

export const OfflineHeader = () => (
  <NavbarWrapper>
    {window.location.pathname !== ROUTES.HOME && (
      <Link to={ROUTES.HOME} className={navbarStyles.link}>
        Home
      </Link>
    )}
    <GenericButton className={navbarStyles.btn} disabled type="button">
      <FiWifiOff className="me-2" /> Offline
    </GenericButton>
  </NavbarWrapper>
)

export const LoadingBody = () => {
  const { theme } = useTheme()
  const containerClass = `container ${theme.bgColor} d-flex flex-column align-items-center justify-content-center LoadingContainer`

  return (
    <div className={containerClass}>
      {/*
       * No motion here, deliberately — see The Dead Class Rule in DESIGN.md. The heading and the
       * "Loading..." line carried `pulsate-fwd` and `fade-out` for years with no rule defining
       * either. The question of whether to honour them or drop them was settled in favour of
       * dropping them: this screen holds still like the rest of the product. Do not re-add the
       * classes, and do not define those names in the stylesheet.
       */}
      <div className="col text-center">
        <h3 className={theme.text}>AoS Reminders</h3>
        <p className={`lead ${theme.textMuted}`}>Loading...</p>
      </div>
    </div>
  )
}

/*
 * The stand-in for Home's catalog-bound half while its chunk loads. Deliberately not `LoadingBody`:
 * that one is `.LoadingContainer { padding-top: 35vh }`, sized for a bare route with nothing above
 * it, so under an already-painted masthead it pushes the only loading signal off a 667px viewport.
 * It also renders its own `<h3>AoS Reminders</h3>`, which would repeat the masthead's `<h1>` and
 * skip a heading level on the way.
 *
 * So: the design system's one loading idiom (DESIGN.md, "Loading and empty states") — a large
 * spinner, centered in a region tall enough to read as the content area it is standing in for. A
 * bare line of muted text under the banner read as an unfinished page, not a loading one.
 *
 * Purely visual: `aria-hidden`, with no announced text of its own. This element is unmounted at the
 * exact moment worth announcing — the handoff, or the failure — and a live region that vanishes
 * cannot report what replaced it. Home owns one persistent region for the whole pending/ready/failed
 * story instead, which is why the spinner's own `role="status"` stays hidden here: the state is
 * reported once.
 */
export const LoadingArmy = () => {
  const { isDark, theme } = useTheme()

  return (
    <div
      className={`container ${theme.bgColor} d-flex align-items-center justify-content-center`}
      style={{ minHeight: '40vh' }}
      aria-hidden="true"
    >
      <Spinner variant={isDark ? 'light-gray' : 'secondary'} size="large" />
    </div>
  )
}

/*
 * What takes that region when the chunk cannot be loaded at all. Before Home was split a catalog
 * that would not load took the whole screen down, so the failure was at least visible; behind a
 * lazy boundary it would otherwise leave chrome that looks finished and never produces a reminder.
 *
 * The copy names the state and the button names the action, and nothing here names an action it does
 * not offer. It used to read "Reload to try again." above a *disabled* `OfflineBtn` — a sentence
 * that told a player to do the one thing the screen had no control for. Reloading is the only thing
 * that can help, so the screen does it: the chunk is fetched again from a clean document, and a
 * failure caused by a retired asset resolves into the deploy the tab has not picked up yet.
 */
export const OfflineArmy = () => {
  const { theme } = useTheme()

  return (
    <div className={`container ${theme.bgColor} text-center py-5`}>
      <p className={`lead ${theme.textMuted}`}>Your army could not be loaded.</p>
      <GenericButton type="button" onClick={() => window.location.reload()}>
        Reload
      </GenericButton>
    </div>
  )
}

export const LargeSpinner = ({ className = '' }: { className?: string }) => (
  <div className={`d-flex flex-row justify-content-center ${className}`}>
    <Spinner variant="light-gray" size="large" />
  </div>
)
