import React from 'react'

const PrintButton = () => {
  const handlePrint = e => {
    e.preventDefault()
    // TODO: Integrate React.GA event here
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
