import React from 'react'
import { DonateComponent } from 'components/info/donate'
import { ContactComponent } from './contact'
import OfflineComponent from 'components/info/offline'
import { useTheme } from 'context/useTheme'

/**
 * Hidden when printing
 */
const FooterComponent = () => {
  return (
    <div className="container d-print-none">
      <DonateComponent />
      <OfflineComponent />
      <DisclaimerComponent />
      <div className="row text-center pt-2 pb-3">
        <div className="col">
          <ContactComponent size="small" />
        </div>
      </div>
    </div>
  )
}

export default FooterComponent

const DisclaimerComponent = () => {
  const { theme } = useTheme()

  return (
    <div className={`row justify-content-center text-center ${theme.bgColor} pt-0`}>
      <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <small className={`DisclaimerText ${theme.text}`}>
          Disclaimer: This tool is in no way endorsed or sanctioned by Games Workshop - it is unofficial and
          fan-made.
          <br />I take absolutely no credit for any of the Games Workshop content displayed above.
        </small>
      </div>
    </div>
  )
}
