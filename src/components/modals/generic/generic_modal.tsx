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

if (typeof document !== 'undefined' && document.getElementById('root')) {
  Modal.setAppElement('#root')
}

const GenericModal = ({
  children,
  closeModal,
  isOpen,
  label,
  isProcessing = false,
}: React.PropsWithChildren<IGenericModalProps>) => {
  const { isDark } = useTheme()
  const modalClassName = `Modal-${isProcessing ? 'Transparent' : isDark ? 'Dark' : 'Light'}`

  return (
    <Modal
      className={modalClassName}
      contentLabel={label}
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="Modal-Overlay"
    >
      <div className="container">
        {isProcessing && <ModalSpinner />}
        <div hidden={isProcessing}>{children}</div>
      </div>
    </Modal>
  )
}

const ModalSpinner = ({ isDark = false }: { isDark?: boolean }) => (
  <div className="d-flex flex-row justify-content-center">
    <Spinner variant={isDark ? 'light-gray' : 'dark'} size="large" />
  </div>
)

export default GenericModal
