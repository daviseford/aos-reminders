import { LargeSpinner } from 'components/helpers/suspenseFallbacks'
import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/modals/generic_modal'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { useSetInterval } from 'utils/hooks/useInterval'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

export const PaypalPostSubscribeModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen } = props
  const { isActive, subscriptionLoading, getSubscription } = useSubscription()
  const { theme } = useTheme()

  const [interval, setInterval] = useState(1000)

  useSetInterval(() => {
    if (subscriptionLoading) return

    if (isActive) {
      setInterval(0)
      closeModal()
      return
    }

    if (!isActive && !subscriptionLoading) {
      console.log('Checking for subscription update from Paypal...')
      getSubscription()
    }
  }, interval)

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
            <p className="text-center mb-1">One sec, we're verifying your PayPal transaction...</p>

            <LargeSpinner className={'text-dark'} />

            <p className="text-center mt-1">
              This application will automatically reload when your subscription is available.
              <br />
              This could take up to one minute. Feel free to close this window and browse around.
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
