import Spinner from 'components/helpers/spinner'
import { useTheme } from 'context/useTheme'
import React from 'react'
import Modal from 'react-modal'

interface IGenericModalProps {
  isProcessing?: boolean
  isOpen: boolean
  closeModal: () => void
  label: string
}

Modal.setAppElement('#root')

const GenericModal: React.FC<IGenericModalProps> = props => {
  const { children, closeModal, isOpen, label, isProcessing = false } = props
  const { isDark } = useTheme()

  const themeType = isDark ? 'Dark' : 'Light'
  const modalClassName = `Modal-${isProcessing ? `Transparent` : themeType}`
  const overlayClassName = `Overlay-${themeType}`

  return (
    <Modal
      className={modalClassName}
      contentLabel={label}
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName={overlayClassName}
    >
      <div className={`container ${isProcessing ? `` : `mr-3 pl-0`}`}>
        {isProcessing && <ModalSpinner />}
        <div hidden={isProcessing}>{children}</div>
      </div>
    </Modal>
  )
}

export default GenericModal

const ModalSpinner = ({ isDark = false }) => {
  const variant = isDark ? 'light-gray' : 'dark'
  return (
    <div className={`d-flex flex-row justify-content-center`}>
      <Spinner variant={variant} size="large" />
    </div>
  )
}
