import { useTheme } from 'context/useTheme'
import React from 'react'
import { navbarStyles } from 'theme/helperClasses'
import useWindowSize from 'utils/hooks/useWindowSize'

const NavbarWrapper: React.FC = ({ children }) => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()

  return (
    <header className={`${navbarStyles.headerClass} ${theme.headerColor}`}>
      <div className={`row d-flex w-${isMobile ? 100 : 75}`}>
        <div className="flex-grow-1"> </div>
        <div>{children}</div>
      </div>
    </header>
  )
}

export default NavbarWrapper
