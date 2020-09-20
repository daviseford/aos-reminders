import { LargeSpinner } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/page/genericModal'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { useEffect } from 'react'
import { IconContext } from 'react-icons'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

export const PaypalPostSubscribeModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen } = props
  const { isActive, subscriptionLoading, getSubscription } = useSubscription()
  const { theme } = useTheme()

  useEffect(() => {
    if (subscriptionLoading) return

    if (isActive) {
      closeModal()
      return
    }

    // Fetch our subscription
    if (!isActive && !subscriptionLoading) {
      getSubscription()
    }
  }, [isActive, closeModal, subscriptionLoading, getSubscription])

  return (
    <GenericModal
      isOpen={modalIsOpen}
      closeModal={closeModal}
      label="Post Paypal Subscription Modal"
      isProcessing={false}
    >
      <div className="row">
        <IconContext.Provider value={{ size: '1.7em' }}>
          <div className={`col ${theme.text}`}>
            <h4 className="mb-3">Thanks! :)</h4>
            <p className="text-center">One sec, we're verifying your PayPal transaction...</p>

            <LargeSpinner />

            <p className="text-center">
              This application will automatically reload when your subscription is available.
              <br />
              This should take about 10-15 seconds.
            </p>
          </div>
        </IconContext.Provider>
      </div>

      <div className="row text-center">
        <div className="col px-0">
          <GenericButton className={theme.modalConfirmClass} onClick={closeModal}>
            Close
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
