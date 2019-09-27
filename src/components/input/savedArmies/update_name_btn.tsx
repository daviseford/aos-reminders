import React, { useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import UpdateArmyNameModal from './update_name_modal'

type TUpdateName = React.FC<{ id: string; armyName: string }>

const UpdateNameButton: TUpdateName = ({ id, armyName }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleClick = e => {
    e.preventDefault()
    openModal()
  }

  return (
    <>
      <FaPencilAlt className="ml-3" onClick={handleClick} />
      <UpdateArmyNameModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        id={id}
        currentArmyName={armyName}
      />
    </>
  )
}

export default UpdateNameButton
