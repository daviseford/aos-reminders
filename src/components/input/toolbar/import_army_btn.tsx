import React from 'react'
import { Link } from 'react-router-dom'
import { logClick } from 'utils/analytics'
import { btnDarkBlock, btnContentWrapper } from 'theme/helperClasses'
import { FaFileImport } from 'react-icons/fa'

interface IImportArmyButtonProps {
  isSubscribed: boolean
  isShowing: boolean
  show: () => void
  hide: () => void
}

const ImportArmyButton: React.FC<IImportArmyButtonProps> = props => {
  const { show, hide, isShowing, isSubscribed } = props

  const handleClick = e => {
    e.preventDefault()
    isShowing ? hide() : show()
  }

  const btnTxt = isShowing ? `Hide Import` : `Import List`

  return isSubscribed ? (
    <button className={btnDarkBlock} onClick={handleClick}>
      <div className={btnContentWrapper}>
        <FaFileImport className="mr-2" /> {btnTxt}
      </div>
    </button>
  ) : (
    <Link to="/subscribe" className={btnDarkBlock} onClick={() => logClick('Import-Subscribe')}>
      <div className={btnContentWrapper}>
        <FaFileImport className="mr-2" /> Import List
      </div>
    </Link>
  )
}

export default ImportArmyButton
