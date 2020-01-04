import React from 'react'
import { FaRegFrown, FaRegSmileBeam } from 'react-icons/fa'
import GenericButton from 'components/input/generic_button'
import { ContactComponent } from 'components/page/contact'
import { ROUTES } from 'utils/env'

interface ILoginSectionProps {
  handleClick: (e: any) => any
}

export const RedemptionLogin: React.FC<ILoginSectionProps> = props => {
  return (
    <div>
      {props.children}
      <p>
        First, you're going to need to create an account and log in. Once you've done that, we'll set your
        subscription up!
      </p>
      <GenericButton className={`btn btn-primary btn-lg`} onClick={props.handleClick}>
        Log In / Sign Up
      </GenericButton>
    </div>
  )
}

export const RedemptionSuccess = () => {
  const handleClickSuccess = () => {
    window.location.replace(ROUTES.PROFILE)
  }

  return (
    <>
      <h5>Woohoo! You're all set!</h5>
      <h2>
        <FaRegSmileBeam />
      </h2>
      <GenericButton className={`btn btn-success btn-lg`} onClick={handleClickSuccess}>
        Take me to my Profile!
      </GenericButton>
    </>
  )
}

export const RedemptionError: React.FC<{ error: string; showButton: boolean }> = ({ error, showButton }) => {
  return (
    <>
      {showButton && (
        <GenericButton className={`btn btn-danger btn-lg`} disabled>
          Error!
          <FaRegFrown className="ml-2" />
        </GenericButton>
      )}

      <p className="pt-3">We're sorry. There was an error redeeming your subscription.</p>
      <p>
        <code>{error}</code>
      </p>
      <p>If you continue to receive this error, please get in contact with us using the links below.</p>

      <div className="row text-center pt-2 pb-3">
        <div className="col">
          <ContactComponent size="small" />
        </div>
      </div>
    </>
  )
}
