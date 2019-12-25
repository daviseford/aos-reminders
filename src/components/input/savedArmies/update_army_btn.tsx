import React, { useMemo, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { store } from 'index'
import { useAppStatus } from 'context/useAppStatus'
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

  const handleClick = async e => {
    e.preventDefault()
    setIsSaving(true)
    const hiddenReminders = store.getState().visibility.reminders
    const payload = prepareArmy({ ...currentArmy, hiddenReminders }, 'update', changedKeys)
    await updateArmy(id, payload)
    logEvent(`UpdateArmy-${currentArmy.factionName}`)
    setIsSaving(false)
  }

  const { isGameMode } = useAppStatus()

  const btnClass = isGameMode
    ? `btn${isDark ? ` btn-outline-light ` : ` `} btn-block`
    : `btn${isDark ? ` btn-outline-light ` : ` `}btn-success btn-block`

  if (!canUpdate) return null

  return (
    <GenericButton className={btnClass} onClick={handleClick}>
      {isSaving ? (
        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
      ) : (
        <FaCloudUploadAlt className="mr-2" />
      )}{' '}
      {isSaving ? `Updating` : `Update Army`}
    </GenericButton>
  )
}

export default UpdateArmyBtn
