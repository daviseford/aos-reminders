import React from 'react'
import Modal from 'react-modal'
import { FaCheck } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { ModalStyle } from 'theme/modalStyle'
import { btnContentWrapper } from 'theme/helperClasses'

interface IModalComponentProps {
  armyName: string
  modalIsOpen: boolean
  handleDelete: (e) => void
  closeModal: () => void
}

Modal.setAppElement('#root')

export const DeleteArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, handleDelete, armyName } = props

  return (
    <Modal
      style={ModalStyle}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Cancel Army Modal"
    >
      <div className={`container`}>
        <div className="row">
          <IconContext.Provider value={{ size: '1.7em' }}>
            <div className="col">
              <h4 className="mb-3">Delete {armyName}?</h4>
              <p>This action cannot be undone.</p>
            </div>
          </IconContext.Provider>
        </div>

        <div className="row">
          <div className="col">
            <button className={`btn btn-outline-danger mx-2`} onClick={handleDelete}>
              <div className={btnContentWrapper}>
                <FaCheck className="mr-2" /> Delete Army
              </div>
            </button>

            <button className={`btn btn-outline-dark mx-2`} onClick={closeModal}>
              <div className={btnContentWrapper}>Never mind</div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
