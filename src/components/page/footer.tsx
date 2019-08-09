import React, { useCallback } from 'react'
import { DonateComponent } from 'components/info/donate'
import { logClick } from 'utils/analytics'

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
  const uri = `https://github.com/daviseford/aos-reminders`
  const handleClick = useCallback(
    e => {
      e.preventDefault()
      logClick('Github')
      window.open(uri)
    },
    [uri]
  )

  return (
    <div className="row text-center my-3">
      <div className="col">
        <h5>
          This tool is open source. If you want to contribute, check out{' '}
          <a onClick={handleClick} href={uri} target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </h5>
      </div>
    </div>
  )
}
