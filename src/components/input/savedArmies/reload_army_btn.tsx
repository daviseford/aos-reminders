import React from 'react'
import { FaSyncAlt } from 'react-icons/fa'
import { useTheme } from 'context/useTheme'
import GenericButton from 'components/input/generic_button'
import { ISavedArmy } from 'types/savedArmy'

interface IReloadArmyProps {
  id: string
  currentArmy: ISavedArmy
  changedKeys: string[]
}

type TReloadArmyBtn = React.FC<IReloadArmyProps>

const ReloadArmyBtn: TReloadArmyBtn = ({ currentArmy, id, changedKeys }) => {
  const { isDark } = useTheme()

  const handleClick = async e => {
    e.preventDefault()
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
