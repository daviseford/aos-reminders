import React from 'react'
import { Link } from 'react-router-dom'
import { btnDarkBlock, btnContentWrapper, navbarStyles } from 'theme/helperClasses'
import Spinner from 'components/helpers/spinner'
import { logClick } from 'utils/analytics'
import { FaNetworkWired } from 'react-icons/fa'

export const FallbackBtn = () => {
  return (
    <button className={btnDarkBlock} disabled type="button">
      <div className={btnContentWrapper}>
        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>{' '}
        Loading
      </div>
    </button>
  )
}

export const LoadingHeader = () => {
  return (
    <div className="ThemeDarkBg py-2">
      <header
        className={`ThemeDarkBg pt-2 d-print-none d-flex justify-content-end mr-3 mr-sm-5 align-items-center`}
      >
        <div className={`py-1`}>
          <Spinner variant="light" size="small" />
        </div>
      </header>
    </div>
  )
}

export const OfflineHeader = () => {
  const { pathname } = window.location

  return (
    <header className={navbarStyles.headerClass}>
      <div className="flex-grow-1"></div>
      <div>
        {pathname !== '/' && (
          <Link to="/" className={navbarStyles.link} onClick={() => logClick('Navbar-Offline-Home')}>
            Home
          </Link>
        )}
        <button className={navbarStyles.btn} disabled type="button">
          <div className={btnContentWrapper}>
            <FaNetworkWired className="mr-2 text-danger" /> Offline
          </div>
        </button>
      </div>
    </header>
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
