import React from 'react'
import Modal from 'react-modal'
import { useTheme } from 'context/useTheme'
import Spinner from 'components/helpers/spinner'

interface IGenericModalProps {
  isProcessing?: boolean
  modalIsOpen: boolean
  closeModal: () => void
  label: string
}

Modal.setAppElement('#root')

const GenericModal: React.FC<IGenericModalProps> = props => {
  const { children, closeModal, modalIsOpen, label, isProcessing = false } = props
  const { theme } = useTheme()

  return (
    <Modal className={theme.modal} isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel={label}>
      <div className={`container ${isProcessing ? `` : `mr-3 pl-0`}`}>
        {isProcessing && <Spinner />}
        <div hidden={isProcessing}>{children}</div>
      </div>
    </Modal>
  )
}

export default GenericModal
