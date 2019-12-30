import React from 'react'
import { FaSyncAlt } from 'react-icons/fa'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { componentWithSize } from 'utils/mapSizesToProps'
import GenericButton from 'components/input/generic_button'

interface IResetChanges {
  isTinyMobile: boolean
}

const ReloadArmyBtn: React.FC<IResetChanges> = ({ isTinyMobile }) => {
  const { isDark } = useTheme()
  const { reloadArmy } = useSavedArmies()

  const btnClass = `btn ${isDark ? `btn-outline-light` : ``} btn-block`
  const btnText = `Reset${isTinyMobile ? `` : ` Changes`}`

  return (
    <GenericButton className={btnClass} onClick={reloadArmy}>
      <FaSyncAlt className="mr-2" />
      {btnText}
    </GenericButton>
  )
}

export default componentWithSize(ReloadArmyBtn)
