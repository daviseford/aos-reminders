import { LinkNewTab } from 'components/helpers/link'
import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/input/generic_modals/genericModal'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { FaRegSadCry } from 'react-icons/fa'
import { logClick } from 'utils/analytics'
import { isDev } from 'utils/env'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

export const CancelPaypalSubscriptionModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen } = props
  const { subscription } = useSubscription()
  const { theme } = useTheme()
  const [processing, setProcessing] = useState(false)

  const handleClick = () => {
    setProcessing(true)
    logClick('CancelSubscription')
    setTimeout(() => {
      setProcessing(false)
      closeModal()
    }, 3000)
  }

  return (
    <GenericModal
      isOpen={modalIsOpen}
      closeModal={closeModal}
      label="Cancel Subscription Modal"
      isProcessing={processing}
    >
      <div className="row">
        <IconContext.Provider value={{ size: '1.7em' }}>
          <div className={`col ${theme.text}`}>
            <h4 className="mb-3">Cancel Subscription?</h4>
            <p>
              I'll be sad to see you go <FaRegSadCry />
            </p>
            <p>
              You'll still have access to all subscription features until your current subscription expires.
            </p>
            <p>
              <small>
                You will be redirected to cancel your subscription using the Paypal interface for extra
                security. The change in your subscription may not be reflected for up to five minutes.
              </small>
            </p>
          </div>
        </IconContext.Provider>
      </div>

      <div className="row text-center">
        <div className="col px-0">
          <LinkNewTab
            href={`https://www.${isDev ? 'sandbox.' : ''}paypal.com/myaccount/autopay/connect/${
              subscription.subscriptionId
            }`}
            label={'Paypal Unsubscribe'}
          >
            <GenericButton className={theme.modalDangerClass} onClick={handleClick}>
              Cancel Subscription
            </GenericButton>
          </LinkNewTab>

          <GenericButton className={theme.modalConfirmClass} onClick={closeModal}>
            Back
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
