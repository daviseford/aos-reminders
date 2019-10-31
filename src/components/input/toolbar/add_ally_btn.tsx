import React from 'react'
import { btnContentWrapper } from 'theme/helperClasses'
import { FaPlus } from 'react-icons/fa'
import { useTheme } from 'context/useTheme'

interface IAddAllyButton {
  setAllyClick: (e: any) => void
}

const AddAllyButton: React.FC<IAddAllyButton> = props => {
  const { setAllyClick } = props
  const { theme } = useTheme()

  return (
    <>
      <button className={theme.genericButton} onClick={setAllyClick}>
        <div className={btnContentWrapper}>
          <FaPlus className="mr-2" /> Add Ally
        </div>
      </button>
    </>
  )
}

export default AddAllyButton
