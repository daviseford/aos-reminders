import React from 'react'
import { Link } from 'react-router-dom'
import { logClick } from 'utils/analytics'
import { centerContentClass } from 'theme/helperClasses'
import { FaFileImport } from 'react-icons/fa'
import { ROUTES } from 'utils/env'
import { useTheme } from 'context/useTheme'
import GenericButton from '../generic_button'

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
    <GenericButton onClick={handleClick}>
      <FaFileImport className="mr-2" /> {btnTxt}
    </GenericButton>
  ) : (
    <Link
      to={ROUTES.SUBSCRIBE}
      className={theme.genericButtonBlock}
      onClick={() => logClick('Import-Subscribe')}
    >
      <div className={centerContentClass}>
        <FaFileImport className="mr-2" /> Import List
      </div>
    </Link>
  )
}

export default ImportArmyButton
