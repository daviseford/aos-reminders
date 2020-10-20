import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { selectors } from 'ducks'
import React, { useMemo, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { ISavedArmy } from 'types/savedArmy'
import { logEvent } from 'utils/analytics'
import { armyHasEntries, prepareArmy } from 'utils/armyUtils'

type TUpdateArmyBtn = React.FC<{
  id: string
  currentArmy: ISavedArmy
  changedKeys: string[]
}>

const UpdateArmyBtn: TUpdateArmyBtn = ({ currentArmy, id, changedKeys }) => {
  const { isGameMode } = useAppStatus()
  const { updateArmy } = useSavedArmies()
  const { isDark } = useTheme()

  const hiddenReminders = useSelector(selectors.selectReminders)

  const [isSaving, setIsSaving] = useState(false)

  const canUpdate = useMemo(() => armyHasEntries(currentArmy), [currentArmy])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const payload = prepareArmy({ ...currentArmy, hiddenReminders }, 'update', changedKeys)
    await updateArmy(id, payload)
    logEvent(`UpdateArmy-${currentArmy.factionName}`)
  }

  const btnClass = isGameMode
    ? `btn ${isDark ? `btn-outline-light` : ``} btn-block`
    : `btn ${isDark ? `btn-outline-light` : ``} btn-success btn-block`

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
