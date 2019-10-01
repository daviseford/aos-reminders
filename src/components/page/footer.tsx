import React from 'react'
import { DonateComponent } from 'components/info/donate'
import { ContactComponent } from './contact'

/**
 * Hidden when printing
 */
const FooterComponent = () => {
  return (
    <div className="container d-print-none">
      <DonateComponent />
      <DisclaimerComponent />
      <div className="row text-center mt-1 mb-3">
        <div className="col">
          <ContactComponent size="small" />
        </div>
      </div>
    </div>
  )
}

export default FooterComponent

const DisclaimerComponent = () => (
  <div className="row justify-content-center text-center pt-0">
    <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
      <div className="alert alert-light" role="alert">
        <small className="DisclaimerText">
          Disclaimer: This tool is in no way endorsed or sanctioned by Games Workshop - it is unofficial and
          fan-made. I take absolutely no credit for any of the Games Workshop content displayed above.
        </small>
      </div>
    </div>
  </div>
)
