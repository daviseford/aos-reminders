import React from 'react'
import { FaTrash } from 'react-icons/fa'
import GenericButton from 'components/input/generic_button'

interface IClearArmyButton {
  clearArmyClick: (e: any) => void
}

const ClearArmyButton: React.FC<IClearArmyButton> = props => {
  const { clearArmyClick } = props

  return (
    <GenericButton onClick={clearArmyClick}>
      <FaTrash className="mr-2" /> Clear Army
    </GenericButton>
  )
}

export default ClearArmyButton
