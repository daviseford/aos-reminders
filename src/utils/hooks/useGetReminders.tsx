import { selectors } from 'ducks'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { processReminders } from 'utils/processReminders'

const useGetReminders = () => {
  const allyArmies = useSelector(selectors.selectAllyArmies)
  const army = useSelector(selectors.selectArmy)
  const currentArmy = useSelector(selectors.selectCurrentArmy)

  // Generate reminders
  const reminders = useMemo(
    () =>
      processReminders(
        army,
        currentArmy.factionName,
        currentArmy.selections,
        currentArmy.realmscape_feature,
        currentArmy.allyFactionNames,
        allyArmies,
        currentArmy.allySelections
      ),
    [
      allyArmies,
      army,
      currentArmy.allyFactionNames,
      currentArmy.allySelections,
      currentArmy.factionName,
      currentArmy.realmscape_feature,
      currentArmy.selections,
    ]
  )

  return reminders
}

export default useGetReminders
