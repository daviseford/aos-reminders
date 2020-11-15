import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/modals/generic_modal'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

interface IModalComponentProps {
  closeModal: () => any
  confirmText?: string
  denyText?: string
  isOpen: boolean
  onConfirmAsync?: () => Promise<any>
  onConfirm?: () => any
  onDeny?: () => any
  headerText: string
  bodyText?: string
}

/**
 * A re-usable generic confirmation modal component
 *
 * Ask if we really want to do a destructive action.
 *
 * @param props
 */
const DeleteConfirmModal: React.FC<IModalComponentProps> = props => {
  const {
    bodyText = '',
    closeModal,
    confirmText = 'Confirm',
    denyText = 'Cancel',
    headerText,
    isOpen,
    onConfirm = null,
    onConfirmAsync = null,
    onDeny = null,
  } = props
  const { theme } = useTheme()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (onConfirmAsync) {
      try {
        setIsProcessing(true)
        await onConfirmAsync()
      } catch (err) {
        console.error(err)
      }
    }

    if (onConfirm) onConfirm()

    closeModal()
  }

  const handleDeny = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (onDeny) onDeny()
    closeModal()
  }

  return (
    <GenericModal
      isOpen={isOpen}
      isProcessing={isProcessing}
      closeModal={closeModal}
      label={`${headerText} Confirmation Modal`}
    >
      <div className="flex-row">
        <div className={`col ${theme.text} text-center`}>
          <h4 className="mb-3">{headerText}</h4>
          {bodyText && <p className="mb-3">{bodyText}</p>}
        </div>
      </div>

      <div className="d-flex flex-row justify-content-between">
        <GenericButton className={theme.modalDangerClass} onClick={handleConfirm}>
          <FaCheck className="mr-2" /> {confirmText}
        </GenericButton>
        <GenericButton className={theme.modalConfirmClass} onClick={handleDeny}>
          {denyText}
        </GenericButton>
      </div>
    </GenericModal>
  )
}

export default DeleteConfirmModal
