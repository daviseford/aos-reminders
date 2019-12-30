import React from 'react'
import { FaSyncAlt } from 'react-icons/fa'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import GenericButton from 'components/input/generic_button'

const ReloadArmyBtn: React.FC = () => {
  const { isDark } = useTheme()
  const { reloadArmy } = useSavedArmies()

  const btnClass = `btn ${isDark ? `btn-outline-light` : ``} btn-block`

  return (
    <GenericButton className={btnClass} onClick={reloadArmy}>
      <FaSyncAlt className="mr-2" />
      Reload Army
    </GenericButton>
  )
}

export default ReloadArmyBtn
