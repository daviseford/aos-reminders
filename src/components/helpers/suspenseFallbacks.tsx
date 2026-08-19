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
 * So: no page-centering, no product name, one `lead` line where the builder and reminders will be.
 * Still no motion, per The Dead Class Rule in DESIGN.md. The line is `aria-hidden` and the announced
 * text is the `visually-hidden` one, so `role="status"` reports the state once rather than twice.
 */
export const LoadingArmy = () => {
  const { theme } = useTheme()

  return (
    <div className={`container ${theme.bgColor} text-center py-5`} role="status">
      <p className={`lead mb-0 ${theme.textMuted}`} aria-hidden="true">
        Loading your army...
      </p>
      <span className="visually-hidden">Loading your army</span>
    </div>
  )
}

/*
 * What takes that region when the chunk cannot be loaded at all. Before Home was split a catalog
 * that would not load took the whole screen down, so the failure was at least visible; behind a
 * lazy boundary it would otherwise leave chrome that looks finished and never produces a reminder.
 *
 * It borrows the offline vocabulary the navbar already uses — the same disabled `OfflineBtn` — so a
 * player meets one word for "this could not be fetched" rather than two.
 */
export const OfflineArmy = () => {
  const { theme } = useTheme()

  return (
    <div className={`container ${theme.bgColor} text-center py-5`}>
      <p className={`lead ${theme.textMuted}`}>Your army could not be loaded. Reload to try again.</p>
      <OfflineBtn />
    </div>
  )
}

export const LargeSpinner = ({ className = '' }: { className?: string }) => (
  <div className={`d-flex flex-row justify-content-center ${className}`}>
    <Spinner variant="light-gray" size="large" />
  </div>
)
