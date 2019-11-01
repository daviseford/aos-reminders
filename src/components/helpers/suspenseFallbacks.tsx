import React from 'react'
import { Link } from 'react-router-dom'
import { navbarStyles } from 'theme/helperClasses'
import GenericButton from 'components/input/generic_button'
import Spinner from 'components/helpers/spinner'
import NavbarWrapper from 'components/page/navbar_wrapper'
import { FiWifiOff } from 'react-icons/fi'
import { ROUTES } from 'utils/env'
import { useTheme } from 'context/useTheme'

export const LoadingBtn = () => {
  return (
    <GenericButton disabled type="button">
      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> Loading
    </GenericButton>
  )
}

export const OfflineBtn = (props: { text?: string }) => {
  const { text = 'Offline' } = props

  return (
    <GenericButton disabled type="button">
      <FiWifiOff className="mr-2 text-danger" /> {text}
    </GenericButton>
  )
}

export const LoadingHeader = () => {
  return (
    <div className="ThemeDarkBg py-2">
      <NavbarWrapper>
        <div className={`py-1 mr-3 mr-sm-5 align-items-center`}>
          <Spinner variant="light" size="small" />
        </div>
      </NavbarWrapper>
    </div>
  )
}

export const OfflineHeader: React.FC = () => {
  const { pathname } = window.location

  return (
    <NavbarWrapper>
      {pathname !== ROUTES.HOME && (
        <Link to={ROUTES.HOME} className={navbarStyles.link}>
          Home
        </Link>
      )}
      <GenericButton className={navbarStyles.btn} disabled type="button">
        <FiWifiOff className="mr-2" /> Offline
      </GenericButton>
    </NavbarWrapper>
  )
}

export const LoadingBody = () => {
  const { theme } = useTheme()
  const containerClass = `container ${theme.bgColor} d-flex flex-column align-items-center justify-content-center LoadingContainer`

  return (
    <div className={containerClass}>
      <div className="col text-center">
        <h3 className="pulsate-fwd">AoS Reminders</h3>
        <p className={`lead ${theme.textMuted} fade-out`}>Loading...</p>
      </div>
    </div>
  )
}

export const LargeSpinner = () => (
  <div className="d-flex flex-row justify-content-center mt-5">
    <Spinner variant="light-gray" size="large" />
  </div>
)
