import { useSubscription } from 'context/useSubscription'
import React from 'react'
import { logClick } from 'utils/analytics'
import { isDev } from 'utils/env'
import GenericDestructiveModal from './generic/generic_destructive_modal'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

export const CancelPaypalSubscriptionModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen } = props
  const { subscription } = useSubscription()

  const handleClick = () => {
    window.location.replace(
      `https://www.${isDev ? 'sandbox.' : ''}paypal.com/myaccount/autopay/connect/${
        subscription.subscriptionId
      }`
    )
    logClick('CancelPaypalSubscription')
  }

  return (
    <GenericDestructiveModal
      isOpen={modalIsOpen}
      closeModal={closeModal}
      onConfirm={handleClick}
      headerText={`Cancel Subscription?`}
      confirmText={`Cancel Subscription`}
    >
      <p>We'll be sad to see you go, but you're always welcome back!</p>
      <p>You'll still have access to everything until your current subscription expires.</p>
      <p>
        <small>
          You will be redirected to cancel your subscription using the PayPal interface for extra security.
          The change in your subscription may not be reflected for up to five minutes.
        </small>
      </p>
    </GenericDestructiveModal>
  )
}
