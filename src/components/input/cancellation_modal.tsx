import React, { useState } from 'react'
import { FaRegSadCry } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { logClick } from 'utils/analytics'
import GenericModal from 'components/page/genericModal'
import GenericButton from 'components/input/generic_button'

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
}

export const CancelSubscriptionModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen } = props
  const { cancelSubscription } = useSubscription()
  const { theme } = useTheme()
  const [processing, setProcessing] = useState(false)

  const handleClick = async e => {
    e.preventDefault()
    setProcessing(true)
    await cancelSubscription()
    logClick('CancelSubscription')
    setProcessing(false)
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
          </div>
        </IconContext.Provider>
      </div>

      <div className="row text-center">
        <div className="col px-0">
          <GenericButton className={theme.modalDangerClass} onClick={handleClick}>
            Cancel Subscription
          </GenericButton>

          <GenericButton className={theme.modalConfirmClass} onClick={closeModal}>
            Back
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}
