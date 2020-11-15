import { LinkNewTab } from 'components/helpers/link'
import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/page/genericModal'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { FaCheck } from 'react-icons/fa'
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
    <GenericModal isOpen={isOpen} closeModal={closeModal} label={`Subscribe for ${featureName} Modal`}>
      <div className="flex-row">
        <div className={`col ${theme.text} text-center`}>
          <h4 className="mb-3">This feature is available only to subscribers.</h4>
          <p>Saving data to the cloud increases the hosting fees for AoS Reminders. </p>
          <p>Please consider subscribing to utilize this feature (and many more!)</p>

          <p>
            <small>
              <LinkNewTab href="mailto:aosreminders@gmail.com" label={'Email me'}>
                Send me an email
              </LinkNewTab>{' '}
              if you have feedback or ideas.
            </small>
          </p>
        </div>
      </div>

      <div className="d-flex flex-row justify-content-center">
        <GenericButton className={theme.modalConfirmClass} onClick={handleConfirm}>
          <FaCheck className="mr-2" /> Subscribe
        </GenericButton>

        <GenericButton className={theme.modalDangerClass} onClick={closeModal}>
          Not now
        </GenericButton>
      </div>
    </GenericModal>
  )
}

export default SubscriberOnlyModal
