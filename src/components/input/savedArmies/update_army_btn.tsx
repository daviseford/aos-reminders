import React, { useMemo, useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { logEvent } from 'utils/analytics'
import { armyHasEntries, prepareArmy } from 'utils/armyUtils'
import GenericButton from 'components/input/generic_button'
import { ISavedArmy } from 'types/savedArmy'

interface IUpdateArmyProps {
  id: string
  currentArmy: ISavedArmy
  changedKeys: string[]
}

type TUpdateArmyBtn = React.FC<IUpdateArmyProps>

const UpdateArmyBtn: TUpdateArmyBtn = ({ currentArmy, id, changedKeys }) => {
  const [isSaving, setIsSaving] = useState(false)
  const { updateArmy } = useSavedArmies()
  const { isDark } = useTheme()

  const canUpdate = useMemo(() => armyHasEntries(currentArmy), [currentArmy])

  const handleClick = e => {
    e.preventDefault()
    setIsSaving(true)
    const payload = prepareArmy(currentArmy, 'update', changedKeys)
    updateArmy(id, payload)
    logEvent(`UpdateArmy-${currentArmy.factionName}`)
    setIsSaving(false)
  }

  if (!canUpdate) return null

  const btnClass = `btn btn-sm btn-outline-${isDark ? `light` : `secondary`}`

  return (
    <GenericButton className={btnClass} onClick={handleClick}>
      {isSaving ? (
        <span
          className="spinner-border spinner-border-sm mr-2 text-dark"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        <FaSave className="mr-2" />
      )}{' '}
      {isSaving ? `Saving` : `Save Changes`}
    </GenericButton>
  )
}

export default UpdateArmyBtn
