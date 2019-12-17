import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import GenericButton from 'components/input/generic_button'

interface IClearArmyButton {
  clearArmyClick: (e: any) => void
}

const ClearArmyButton: React.FC<IClearArmyButton> = props => {
  const { clearArmyClick } = props

  return (
    <GenericButton onClick={clearArmyClick}>
      <FaTrashAlt className="mr-2" /> Clear Army
    </GenericButton>
  )
}

export default ClearArmyButton
