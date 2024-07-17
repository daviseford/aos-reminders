import GenericDestructiveModal from 'components/modals/generic/generic_destructive_modal'
import { useSubscription } from 'context/useSubscription'
import React from 'react'
import { logClick } from 'utils/analytics'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

export const CancelStripeSubscriptionModal = (props: IModalComponentProps) => {
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
      <p>We&apos;ll be sad to see you go, but you&apos;re always welcome back!</p>
      <p>You&apos;ll still have access to everything until your current subscription expires.</p>
    </GenericDestructiveModal>
  )
}
