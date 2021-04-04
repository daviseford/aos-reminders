import { LinkNewTab } from 'components/helpers/link'
import { DonateComponent } from 'components/info/donate'
import OfflineComponent from 'components/info/offline'
import Contact from 'components/page/contact'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { version } from '../../../package.json'

/**
 * Hidden when printing
 */
const Footer = () => {
  return (
    <div className="container d-print-none">
      <DonateComponent />
      <OfflineComponent />
      <Disclaimer />
      <div className="row text-center pt-2">
        <div className="col">
          <Contact size="small" />
        </div>
      </div>
      <ReleaseNotes />
    </div>
  )
}

export default Footer

const Disclaimer = () => {
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

const ReleaseNotes = () => {
  const { theme } = useTheme()

  return (
    <div className={`row text-center ${theme.bgColor} pt-1 pb-2`}>
      <div className="col">
        <LinkNewTab
          href="https://github.com/daviseford/aos-reminders/releases/latest"
          label={'GithubLatestRelease'}
        >
          <small className={theme.text}>AoS Reminders v{version} - Release Notes</small>
        </LinkNewTab>
      </div>
    </div>
  )
}
