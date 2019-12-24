import React from 'react'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { FaSyncAlt } from 'react-icons/fa'
import GenericButton from 'components/input/generic_button'

interface IReloadArmyProps {}

type TReloadArmyBtn = React.FC<IReloadArmyProps>

const ReloadArmyBtn: TReloadArmyBtn = () => {
  const { isDark } = useTheme()
  const { reloadArmy } = useSavedArmies()

  const handleClick = async e => {
    e.preventDefault()
    reloadArmy()
  }

  const btnClass = `btn${isDark ? ` btn-outline-light ` : ` `} btn-block`

  return (
    <GenericButton className={btnClass} onClick={handleClick}>
      <FaSyncAlt className="mr-2" />
      Reload Army
    </GenericButton>
  )
}

export default ReloadArmyBtn
