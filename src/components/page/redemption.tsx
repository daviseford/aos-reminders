import GenericButton from 'components/input/generic_button'
import Contact from 'components/page/contact'
import React from 'react'
import { FaRegFrown, FaRegSmileBeam } from 'react-icons/fa'
import { ROUTES } from 'utils/env'

export const RedemptionLogin = ({
  children,
  handleClick,
}: React.PropsWithChildren<{ handleClick: (event: React.MouseEvent) => unknown }>) => (
  <div>
    {children}
    {/* Standing account-flow guidance, so it takes the same .lead voice as the preamble above it. */}
    <p className="lead">
      First, you&apos;re going to need to create an account and log in. Once you&apos;ve done that, we&apos;ll
      set your subscription up!
    </p>
    <GenericButton className="btn btn-primary btn-lg" onClick={handleClick}>
      Log In / Sign Up
    </GenericButton>
  </div>
)

export const RedemptionSuccess = () => (
  // The outcome replaces the form in place, so it has to announce itself.
  <div role="status">
    {/* Sized by class, not by heading level: this sits under the page <h1>, so it is an <h2>. */}
    <h2 className="h5">Woohoo! You&apos;re all set!</h2>
    {/* The glyph was an <h2> whose only content was a decorative icon — an empty heading. */}
    <div className="h2 my-2">
      <FaRegSmileBeam aria-hidden="true" />
    </div>
    <GenericButton className="btn btn-success btn-lg" onClick={() => window.location.replace(ROUTES.PROFILE)}>
      Take me to my Profile!
    </GenericButton>
  </div>
)

export const RedemptionError = ({ error, showButton }: { error: string; showButton: boolean }) => (
  <>
    {showButton && (
      <GenericButton className="btn btn-danger btn-lg" disabled>
        Error!
        <FaRegFrown aria-hidden="true" className="ms-2" />
      </GenericButton>
    )}
    {/*
      The message arrives after the attempt, so it needs announcing. The contact row below is
      standing chrome and stays outside the live region.
    */}
    <div role="alert">
      <p className="pt-3">We&apos;re sorry. There was an error redeeming your subscription.</p>
      <p>
        <code className="RedemptionErrorDetail">{error}</code>
      </p>
      <p>If you continue to receive this error, please get in contact with us using the links below.</p>
    </div>
    <div className="row text-center pt-2 pb-3">
      <div className="col">
        <Contact size="small" />
      </div>
    </div>
  </>
)
