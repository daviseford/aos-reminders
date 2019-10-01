import React from 'react'
import { btnDarkBlock, btnContentWrapper } from 'theme/helperClasses'
import Spinner from 'components/helpers/spinner'

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

export const EmptyHeader = () => {
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

export const Loading = () => (
  <div className="container d-flex flex-column align-items-center justify-content-center LoadingContainer">
    {/* <div className="col text-center">
    <img
          className="d-block mx-auto mb-3 img-fluid"
          src="/img/logo_noURL.png"
          width="100px"
          alt="AoS Reminders"
        />
    </div> */}
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
