import { useTheme } from 'context/useTheme'
import { navbarStyles } from 'theme/helperClasses'
import useWindowSize from 'utils/hooks/useWindowSize'

const NavbarWrapper = ({ children }: React.PropsWithChildren<object>) => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()

  return (
    <header className={`${navbarStyles.headerClass} ${theme.headerColor}`}>
      <div className={`row d-flex w-${isMobile ? 100 : 75}`}>
        <div className="flex-grow-1"> </div>
        <nav aria-label="Main">{children}</nav>
      </div>
    </header>
  )
}

export default NavbarWrapper
