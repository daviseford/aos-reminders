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

export const Loading = () => {
  return (
    <div className="d-block">
      <EmptyHeader />
      <div className="row align-items-center justify-content-center mt-5 pt-5">
        <div className="my-5 py-5"> </div>
        <div className="col my-5 py-5 px-5 text-center">
          <h4>AoS Reminders</h4>
          <p className="lead">Loading...</p>
        </div>
      </div>
    </div>
  )
}
