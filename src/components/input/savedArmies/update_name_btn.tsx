import React, { useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import UpdateArmyNameModal from './update_name_modal'
import { IconContext } from 'react-icons'

type TUpdateName = React.FC<{ id: string; armyName: string; className?: string; size?: string }>

const UpdateNameButton: TUpdateName = ({ id, armyName, className = '', size = '1rem' }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleClick = e => {
    e.preventDefault()
    openModal()
  }

  return (
    <>
      <IconContext.Provider value={{ size }}>
        <FaPencilAlt className={className} onClick={handleClick} />
        {modalIsOpen && (
          <UpdateArmyNameModal
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            id={id}
            currentArmyName={armyName}
          />
        )}
      </IconContext.Provider>
    </>
  )
}

export default UpdateNameButton
