import GenericButton from 'components/input/generic_button'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { FaSyncAlt } from 'react-icons/fa'
import useWindowSize from 'utils/hooks/useWindowSize'

const ResetChangesBtn = () => {
  const { isDark } = useTheme()
  const { reloadArmy } = useSavedArmies()
  const { isTinyMobile } = useWindowSize()

  const btnClass = `btn btn-outline-${isDark ? `light` : `dark`} btn-block`
  const btnText = `Reset${isTinyMobile ? `` : ` Changes`}`

  return (
    <GenericButton className={btnClass} onClick={reloadArmy}>
      <FaSyncAlt className="mr-2" />
      {btnText}
    </GenericButton>
  )
}

export default ResetChangesBtn
