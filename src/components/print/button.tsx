import React from 'react'
import { logPrintEvent } from 'utils/analytics'
import { TSupportedFaction } from 'meta/factions'

const PrintButton = (props: { factionName: TSupportedFaction }) => {
  const handlePrint = e => {
    e.preventDefault()
    logPrintEvent(props.factionName)
    return window.print()
  }
  return (
    <div className="row mt-1 justify-content-center d-print-none">
      <div className="col col-sm-8 col-md-4 col-lg-3 col-xl-2">
        <button className="btn btn-outline-dark btn-block" onClick={handlePrint}>
          Print Page
        </button>
      </div>
    </div>
  )
}

export default PrintButton
