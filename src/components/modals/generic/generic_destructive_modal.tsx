import GenericButton from 'components/input/generic_button'
import GenericModal from 'components/modals/generic/generic_modal'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

interface IModalComponentProps {
  closeModal: () => unknown
  confirmText?: string
  denyText?: string
  isOpen: boolean
  onConfirmAsync?: () => Promise<unknown>
  onConfirm?: () => unknown
  onDeny?: () => unknown
  headerText: string
  bodyText?: string
}

const GenericDestructiveModal = ({
  bodyText = '',
  children,
  closeModal,
  confirmText = 'Confirm',
  denyText = 'Cancel',
  headerText,
  isOpen,
  onConfirm,
  onConfirmAsync,
  onDeny,
}: React.PropsWithChildren<IModalComponentProps>) => {
  const { theme } = useTheme()
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault()
    setProcessingError(null)
    if (onConfirmAsync) {
      try {
        setIsProcessing(true)
        await onConfirmAsync()
      } catch {
        setIsProcessing(false)
        setProcessingError('That action could not be completed. Please try again.')
        return
      }
    }
    onConfirm?.()
    closeModal()
  }

  const handleDeny = (event: React.MouseEvent) => {
    event.preventDefault()
    onDeny?.()
    closeModal()
  }

  const btnResponsiveClass = 'mx-2 mx-sm-1'

  return (
    <GenericModal
      isOpen={isOpen}
      isProcessing={isProcessing}
      closeModal={closeModal}
      label={`${headerText} Confirmation Modal`}
    >
      {/*
       * The width class is the dialog's own, not the grid's. `GenericModal` renders a Bootstrap
       * `.container`, which claims the full breakpoint width unless a child asks for less, and a
       * confirmation this short has no business being 1140px across.
       */}
      <div className="aos4-confirm-modal">
        <div className="flex-row">
          <div className={`col ${theme.text} text-center`}>
            <h4 className="mb-3">{headerText}</h4>
            {bodyText && <p className="mb-3">{bodyText}</p>}
            {children ? <div className="mb-3">{children}</div> : null}
            {processingError && (
              <div className="alert alert-danger" role="alert">
                {processingError}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-row justify-content-around">
          {/*
           * Filled danger on the confirm, outline on the deny. This is the one modal where red is
           * correct — it is named `Destructive` and the confirm is what destroys — and it now matches
           * the row confirmations in `My Armies`. The pair used to render outline-danger beside
           * outline-dark in light theme, which gave the destroy and the escape the same weight.
           */}
          <GenericButton
            className={`${theme.destructiveButton} ${btnResponsiveClass}`}
            onClick={handleConfirm}
          >
            <FaCheck className="me-2" /> {confirmText}
          </GenericButton>
          <GenericButton className={`${theme.genericButton} ${btnResponsiveClass}`} onClick={handleDeny}>
            {denyText}
          </GenericButton>
        </div>
      </div>
    </GenericModal>
  )
}

export default GenericDestructiveModal
