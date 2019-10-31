import React from 'react'
import { Link } from 'react-router-dom'
import { logClick } from 'utils/analytics'
import { btnContentWrapper } from 'theme/helperClasses'
import { FaFileImport } from 'react-icons/fa'
import { ROUTES } from 'utils/env'
import { useTheme } from 'context/useTheme'

interface IImportArmyButtonProps {
  isSubscribed: boolean
  isShowing: boolean
  show: () => void
  hide: () => void
}

const ImportArmyButton: React.FC<IImportArmyButtonProps> = props => {
  const { show, hide, isShowing, isSubscribed } = props
  const { theme } = useTheme()

  const handleClick = e => {
    e.preventDefault()
    isShowing ? hide() : show()
  }

  const btnTxt = isShowing ? `Hide Import` : `Import List`

  return isSubscribed ? (
    <button className={theme.genericButton} onClick={handleClick}>
      <div className={btnContentWrapper}>
        <FaFileImport className="mr-2" /> {btnTxt}
      </div>
    </button>
  ) : (
    <Link to={ROUTES.SUBSCRIBE} className={theme.genericButton} onClick={() => logClick('Import-Subscribe')}>
      <div className={btnContentWrapper}>
        <FaFileImport className="mr-2" /> Import List
      </div>
    </Link>
  )
}

export default ImportArmyButton
