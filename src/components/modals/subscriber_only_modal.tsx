import { LinkNewTab } from 'components/helpers/link'
import GenericTwoButtonModal from 'components/modals/generic/generic_two_button_modal'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { FaCartPlus } from 'react-icons/fa'
import { logClick } from 'utils/analytics'
import { ROUTES } from 'utils/env'

interface IModalComponentProps {
  closeModal: () => void
  isOpen: boolean
  featureName: string
}

/**
 * Use this modal when we want to stop non-subscribers from accessing paid functionality
 * @param props
 */
const SubscriberOnlyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, isOpen, featureName } = props
  const { theme } = useTheme()

  const handleConfirm = () => {
    logClick(`${featureName}-Modal-Subscribe`)
    closeModal()
    window.location.replace(ROUTES.SUBSCRIBE)
  }

  return (
    <GenericTwoButtonModal
      closeModal={closeModal}
      confirmBtnClass={'btn btn-primary'}
      confirmIcon={FaCartPlus}
      confirmText={'Subscribe'}
      denyBtnClass={theme.modalConfirmClass}
      headerText={`Subscriber-Only Feature`}
      isOpen={isOpen}
      onConfirm={handleConfirm}
    >
      <>
        <p>Saving data to the cloud increases the hosting fees for AoS Reminders.</p>
        <p>Please consider subscribing to use this feature (and many more!)</p>
        <p>
          <small>
            <LinkNewTab href="mailto:aosreminders@gmail.com" label={'Email me'}>
              Send me an email
            </LinkNewTab>{' '}
            if you have feedback or questions.
          </small>
        </p>
      </>
    </GenericTwoButtonModal>
  )
}

export default SubscriberOnlyModal
