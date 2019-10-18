import React from 'react'
import { Link } from 'react-router-dom'
import { btnDarkBlock, btnContentWrapper, navbarStyles } from 'theme/helperClasses'
import Spinner from 'components/helpers/spinner'
import { FiWifiOff } from 'react-icons/fi'
import NavbarWrapper from 'components/page/navbar_wrapper'

export const LoadingBtn = () => {
  return (
    <button className={btnDarkBlock} disabled type="button">
      <div className={btnContentWrapper}>
        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>{' '}
        Loading
      </div>
    </button>
  )
}

export const OfflineBtn = (props: { text?: string }) => {
  const { text = 'Offline' } = props
  return (
    <button className={btnDarkBlock} disabled type="button">
      <div className={btnContentWrapper}>
        <FiWifiOff className="mr-2 text-danger" /> {text}
      </div>
    </button>
  )
}

export const LoadingHeader = props => {
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
      {pathname !== '/' && (
        <Link to="/" className={navbarStyles.link}>
          Home
        </Link>
      )}
      <button className={navbarStyles.btn} disabled type="button">
        <div className={btnContentWrapper}>
          <FiWifiOff className="mr-2" /> Offline
        </div>
      </button>
    </NavbarWrapper>
  )
}

export const LoadingBody = () => (
  <div className="container d-flex flex-column align-items-center justify-content-center LoadingContainer">
    <div className="col text-center">
      <h3 className="pulsate-fwd">AoS Reminders</h3>
      <p className="lead text-muted fade-out">Loading...</p>
    </div>
  </div>
)

export const LargeSpinner = () => (
  <div className="d-flex flex-row justify-content-center mt-5">
    <Spinner variant="light-gray" size="large" />
  </div>
)
