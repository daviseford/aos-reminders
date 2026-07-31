import { useTheme } from 'context/useTheme'
import { navbarStyles } from 'theme/helperClasses'
import useWindowSize from 'utils/hooks/useWindowSize'

const NavbarWrapper = ({ children }: React.PropsWithChildren<object>) => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()

  return (
    <header className={`${navbarStyles.headerClass} ${theme.headerColor}`}>
      {/*
        `px-0 w-auto flex-shrink-1` neutralises Bootstrap 5's `.row > *` rule, which applies gutter
        padding, `width: 100%`, and `flex-shrink: 0` to *every* direct child of a row. Bootstrap 4
        only styled children that carried a `col` class, so these two were plain flex items: the
        spacer grew, and the nav sized to its links. Without this the nav stretches to the full row
        and wraps onto its own line. See the same fix in reminders, donate, and pricingPlans.
      */}
      <div className={`row d-flex w-${isMobile ? 100 : 75}`}>
        <div className="flex-grow-1 px-0 w-auto flex-shrink-1"> </div>
        <nav aria-label="Main" className="px-0 w-auto flex-shrink-1">
          {children}
        </nav>
      </div>
    </header>
  )
}

export default NavbarWrapper
