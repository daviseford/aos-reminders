import React, { useState } from 'react'
import Modal from 'react-modal'
import { FaSave } from 'react-icons/fa'
import { useSavedArmies } from 'context/useSavedArmies'
import { logEvent } from 'utils/analytics'
import { ModalStyle } from 'theme/modalStyle'

const btnClass = `btn btn-outline-dark`

interface IModalComponentProps {
  modalIsOpen: boolean
  closeModal: () => void
  currentArmyName: string
  id: string
}

Modal.setAppElement('#root')

const UpdateArmyNameModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, currentArmyName, id } = props
  const { updateArmyName } = useSavedArmies()
  const [armyName, setArmyName] = useState(currentArmyName)

  const handleUpdateName = (e: any) => {
    e.preventDefault()
    setArmyName(e.target.value)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      handleUpdateClick(e)
    }
  }

  const handleUpdateClick = e => {
    e.preventDefault()
    if (armyName === currentArmyName) {
      closeModal()
      return // Don't hit the API if they don't make a change :)
    }
    updateArmyName(id, armyName || 'Untitled')
    closeModal()
    setArmyName(armyName || 'Untitled')
    logEvent(`UpdateArmyName`)
  }

  return (
    <Modal
      style={ModalStyle}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Update Army Name Modal"
    >
      <div className={`container`}>
        <div className="row">
          <div className="col">
            <form>
              <div className="form-group">
                <label htmlFor="nameInput">
                  <strong>Rename Army</strong>
                </label>
                <input
                  className="form-control"
                  aria-describedby="nameHelp"
                  value={armyName}
                  onKeyDown={handleKeyDown}
                  onChange={handleUpdateName}
                />
                <small id="nameHelp" className="form-text text-muted">
                  Hint: Use a descriptive name.
                </small>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <button className={btnClass} onClick={handleUpdateClick}>
              <div className="d-flex align-items-center">
                <FaSave className="mr-2" /> Update
              </div>
            </button>

            <button className={`btn btn-outline-danger`} onClick={closeModal}>
              <div className="d-flex align-items-center">Cancel</div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default UpdateArmyNameModal
