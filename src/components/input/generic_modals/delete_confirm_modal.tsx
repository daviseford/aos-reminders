import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/input/generic_modals/genericModal'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { FaCheck } from 'react-icons/fa'

interface IModalComponentProps {
  closeModal: () => void
  confirmText?: string
  denyText?: string
  isOpen: boolean
  onConfirm: () => void
  onDeny?: () => void
  promptText: string
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
    closeModal,
    confirmText = 'Confirm',
    denyText = 'Never mind',
    isOpen,
    onConfirm,
    onDeny = null,
    promptText,
  } = props
  const { theme } = useTheme()

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    onConfirm()
    closeModal()
  }
  const handleDeny = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onDeny) onDeny()
    closeModal()
  }

  return (
    <GenericModal isOpen={isOpen} closeModal={closeModal} label="Confirmation Modal">
      <div className="flex-row">
        <div className={`col ${theme.text} text-center`}>
          <h4 className="mb-3">{promptText}</h4>
        </div>
      </div>

      <div className="d-flex flex-row justify-content-center">
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
