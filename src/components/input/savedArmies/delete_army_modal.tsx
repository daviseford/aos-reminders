import React, { useState } from 'react'
import Modal from 'react-modal'
import { FaCheck } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { ModalStyle } from 'theme/modalStyle'
import { btnContentWrapper } from 'theme/helperClasses'
import { logEvent } from 'utils/analytics'
import { useSavedArmies } from 'context/useSavedArmies'
import Spinner from 'components/helpers/spinner'

interface IModalComponentProps {
  armyName: string
  modalIsOpen: boolean
  closeModal: () => void
  id: string
}

Modal.setAppElement('#root')

export const DeleteArmyModal: React.FC<IModalComponentProps> = props => {
  const { closeModal, modalIsOpen, armyName, id } = props
  const { deleteSavedArmy } = useSavedArmies()
  const [processing, setProcessing] = useState(false)

  const handleDelete = async e => {
    e.preventDefault()
    setProcessing(true)
    await deleteSavedArmy(id)
    setProcessing(false)
    closeModal()
    logEvent('DeleteArmy')
  }

  return (
    <Modal
      style={ModalStyle}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Delete Army Modal"
    >
      <div className={`container`}>
        {processing && <Spinner />}
        <div className="row" hidden={processing}>
          <IconContext.Provider value={{ size: '1.7em' }}>
            <div className="col">
              <h4 className="mb-3">Delete {armyName}?</h4>
              <p>This action cannot be undone.</p>
            </div>
          </IconContext.Provider>
        </div>

        <div className="row" hidden={processing}>
          <div className="col">
            <button className={`btn btn-outline-danger mx-2`} onClick={handleDelete}>
              <div className={btnContentWrapper}>
                <FaCheck className="mr-2" /> Delete
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
