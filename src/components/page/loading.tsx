import React from 'react'
import { headerClass } from 'theme/helperClasses'

export const EmptyHeader = () => {
  return (
    <div className="ThemeDarkBg py-2">
      <header className={headerClass}>
        <div className={`py-2`}> </div>
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
      <h3>AoS Reminders</h3>
      <p className="lead text-muted">Loading...</p>
    </div>
  </div>
)
