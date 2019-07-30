import React from 'react'
import { DonateComponent } from 'components/info/donate'

/**
 * Hidden when printing
 */
export const FooterComponent = () => {
  return (
    <div className="container d-print-none">
      <DonateComponent />
      <OpenSourceComponent />
    </div>
  )
}

const OpenSourceComponent = () => {
  return (
    <div className="row text-center my-3">
      <div className="col">
        <h5>
          This tool is open source. If you want to contribute, check out{' '}
          <a href="https://github.com/daviseford/aos-reminders" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </h5>
      </div>
    </div>
  )
}
