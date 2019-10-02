import React from 'react'
import { btnContentWrapper } from 'theme/helperClasses'
import { FaPlus } from 'react-icons/fa'

interface IAddAllyButton {
  setAllyClick: (e: any) => void
}

const AddAllyButton: React.FC<IAddAllyButton> = props => {
  const { setAllyClick } = props
  return (
    <>
      <button className={`btn btn-block btn-outline-dark`} onClick={setAllyClick}>
        <div className={btnContentWrapper}>
          <FaPlus className="mr-2" /> Add Ally
        </div>
      </button>
    </>
  )
}

export default AddAllyButton
