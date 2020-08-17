import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { selectors } from 'ducks'
import React, { useMemo, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { connect } from 'react-redux'
import { ISavedArmy } from 'types/savedArmy'
import { IStore, IVisibilityStore } from 'types/store'
import { logEvent } from 'utils/analytics'
import { armyHasEntries, prepareArmy } from 'utils/armyUtils'

interface IUpdateArmyProps {
  id: string
  currentArmy: ISavedArmy
  changedKeys: string[]
  hiddenReminders: IVisibilityStore['reminders']
}

type TUpdateArmyBtn = React.FC<IUpdateArmyProps>

const UpdateArmyBtnComponent: TUpdateArmyBtn = ({ currentArmy, id, changedKeys, hiddenReminders }) => {
  const { isGameMode } = useAppStatus()
  const { updateArmy } = useSavedArmies()
  const { isDark } = useTheme()
  const [isSaving, setIsSaving] = useState(false)

  const canUpdate = useMemo(() => armyHasEntries(currentArmy), [currentArmy])

  const handleClick = async e => {
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

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  hiddenReminders: selectors.getReminders(state),
})

const UpdateArmyBtn = connect(mapStateToProps, null)(UpdateArmyBtnComponent)

export default UpdateArmyBtn
