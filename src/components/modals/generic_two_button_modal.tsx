import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/modals/generic_modal'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { IconType } from 'react-icons'
import { FaCheck } from 'react-icons/fa'

interface IModalComponentProps {
  bodyText?: string
  closeModal: () => any
  confirmIcon?: IconType
  confirmText?: string
  confirmBtnClass?: string
  denyBtnClass?: string
  denyText?: string
  disableConfirmIcon?: boolean
  headerText?: string
  isOpen: boolean
  onConfirm?: () => any
  onConfirmAsync?: () => Promise<any>
  onDeny?: () => any
}

/**
 * A re-usable generic modal component
 *
 * Ask if we really want to do an action.
 *
 * @param props
 */
const GenericTwoButtonModal: React.FC<IModalComponentProps> = props => {
  const { theme } = useTheme()
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    bodyText = '',
    children = null,
    closeModal,
    confirmBtnClass = theme.modalDangerClass,
    confirmText = 'Confirm',
    denyBtnClass = theme.modalConfirmClass,
    denyText = 'Cancel',
    disableConfirmIcon = false,
    headerText = '',
    isOpen = false,
    onConfirm = null,
    onConfirmAsync = null,
    onDeny = null,
  } = props

  const ConfirmIcon = props.confirmIcon || FaCheck

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
          {children ? <div className={`mb-3`}>{children}</div> : null}
        </div>
      </div>

      <div className="d-flex flex-row justify-content-around">
        <GenericButton className={confirmBtnClass} onClick={handleConfirm}>
          {!disableConfirmIcon && <ConfirmIcon className="mr-2" />} {confirmText}
        </GenericButton>
        <GenericButton className={denyBtnClass} onClick={handleDeny}>
          {denyText}
        </GenericButton>
      </div>
    </GenericModal>
  )
}

export default GenericTwoButtonModal
