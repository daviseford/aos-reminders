import React from 'react'
import { navbarStyles } from 'theme/helperClasses'
import { componentWithSize } from 'utils/mapSizesToProps'

const NavbarWrapperComponent: React.FC<{ isMobile: boolean }> = props => {
  const { isMobile, children } = props

  return (
    <header className={navbarStyles.headerClass}>
      <div className={`row d-flex w-${isMobile ? 100 : 75}`}>
        <div className="flex-grow-1"> </div>
        <div>{children}</div>
      </div>
    </header>
  )
}

const NavbarWrapper = componentWithSize(NavbarWrapperComponent)

export default NavbarWrapper
