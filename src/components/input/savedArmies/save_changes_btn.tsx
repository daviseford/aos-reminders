import React, { useMemo } from 'react'
import { FaSave } from 'react-icons/fa'
import { useSavedArmies } from 'context/useSavedArmies'
import { logEvent } from 'utils/analytics'
import { armyHasEntries, prepareArmy } from 'utils/armyUtils'
import { btnContentWrapper, btnSecondarySmall } from 'theme/helperClasses'
import { ISavedArmy } from 'types/savedArmy'

interface IUpdateArmyProps {
  id: string
  currentArmy: ISavedArmy
}

const UpdateArmyBtn: React.FC<IUpdateArmyProps> = ({ currentArmy, id }) => {
  const { updateArmy } = useSavedArmies()
  const canUpdate = useMemo(() => armyHasEntries(currentArmy), [currentArmy])

  const handleClick = e => {
    e.preventDefault()
    const payload = prepareArmy(currentArmy)
    updateArmy(id, payload)
    logEvent(`UpdateArmy`)
  }

  if (!canUpdate) return null

  return (
    <button className={btnSecondarySmall} onClick={handleClick}>
      <div className={`${btnContentWrapper} text-secondary`}>
        <FaSave className="mr-2 text-secondary" /> Save Changes
      </div>
    </button>
  )
}

export default UpdateArmyBtn
