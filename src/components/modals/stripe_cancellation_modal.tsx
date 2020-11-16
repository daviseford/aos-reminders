import { useSubscription } from 'context/useSubscription'
import React from 'react'
import { logClick } from 'utils/analytics'
import GenericDestructiveModal from './generic_destructive_modal'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

export const CancelStripeSubscriptionModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen } = props
  const { cancelSubscription } = useSubscription()

  const handleClick = async () => {
    await cancelSubscription()
    logClick('CancelSubscription')
  }

  return (
    <GenericDestructiveModal
      isOpen={modalIsOpen}
      closeModal={closeModal}
      onConfirmAsync={handleClick}
      headerText={`Cancel Subscription?`}
      confirmText={`Cancel Subscription`}
    >
      <p>We'll be sad to see you go, but you're always welcome back!</p>
      <p>You'll still have access to everything until your current subscription expires.</p>
    </GenericDestructiveModal>
  )
}
