import React from 'react'
import { navbarStyles } from 'theme/helperClasses'
import { componentWithSize } from 'utils/mapSizesToProps'
import { useTheme } from 'context/useTheme'

const NavbarWrapperComponent: React.FC<{ isMobile: boolean }> = props => {
  const { isMobile, children } = props
  const { theme } = useTheme()

  return (
    <header className={`${navbarStyles.headerClass} ${theme.headerColor}`}>
      <div className={`row d-flex w-${isMobile ? 100 : 75}`}>
        <div className="flex-grow-1"> </div>
        <div>{children}</div>
      </div>
    </header>
  )
}

const NavbarWrapper = componentWithSize(NavbarWrapperComponent)

export default NavbarWrapper
