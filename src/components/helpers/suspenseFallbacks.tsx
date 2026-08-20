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
 * Home's full-screen splash while the catalog chunk is on the wire: the same two static lines as
 * `LoadingBody` — the job the route-level fallback did before the shell split, restored. The player
 * sees the product name and "Loading..." on the theme background, edge to edge, and nothing else
 * until the army UI is ready. A spinner band under an already-painted masthead read as a half-built
 * page, and a band's theme background stopping mid-screen read as a broken one.
 *
 * It is a fixed overlay rather than the Suspense fallback so it outlives the child's first commit:
 * the fallback lifts the moment the chunk arrives, while the masthead's reserved Army of Renown row
 * and the freshly mounted builder are still settling into their bound shape. Home keeps this up
 * until the child has published its bindings — or the boundary reports the failure — so the reveal
 * is a single commit: splash, then the finished screen.
 *
 * Purely visual: `aria-hidden`, with no announced text of its own. This element is unmounted at the
 * exact moment worth announcing — the handoff, or the failure — and a live region that vanishes
 * cannot report what replaced it. Home owns one persistent region for the whole pending/ready/failed
 * story instead: the state is reported once.
 */
export const LoadingArmy = () => {
  const { theme } = useTheme()

  return (
    <div className={`LoadingSplash ${theme.bgColor}`} aria-hidden="true">
      {/*
       * No motion here, deliberately — The Dead Class Rule in DESIGN.md settled it for `LoadingBody`
       * and the same answer holds here: this screen holds still like the rest of the product.
       *
       * No `col` on the wrapper: this container is a flex column centering its children, and
       * Bootstrap's `.col` is `flex-grow: 1` — it would stretch to fill the viewport height and
       * pin the text to the top, which is the opposite of what the centering is for.
       */}
      <div className="text-center">
        <h3 className={theme.text}>AoS Reminders</h3>
        <p className={`lead ${theme.textMuted}`}>Loading...</p>
      </div>
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
