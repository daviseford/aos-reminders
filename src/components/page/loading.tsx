import React from 'react'
import { emptyHeaderClass } from 'theme/helperClasses'
import Spinner from 'components/helpers/spinner'

export const EmptyHeader = () => {
  return (
    <div className="ThemeDarkBg py-2">
      <header className={emptyHeaderClass}>
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
