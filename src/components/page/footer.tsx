import React from 'react'

/**
 * Hidden when printing
 */
export const FooterComponent = () => {
  return (
    <div className="container">
      <div className="row mt-5 text-center d-print-none">
        <div className="col pt-5 mb-2">
          <h5>
            This tool is open source. If you want to contribute, check out{' '}
            <a href="https://github.com/daviseford/aos-reminders" target="_blank" rel="noopener noreferrer">
              Github
            </a>
          </h5>
        </div>
      </div>
    </div>
  )
}
