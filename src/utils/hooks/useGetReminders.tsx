import { selectors } from 'ducks'
import { useSelector } from 'react-redux'
import { processReminders } from 'utils/processReminders'

const useGetReminders = () => {
  const allyArmies = useSelector(selectors.selectAllyArmies)
  const army = useSelector(selectors.selectArmy)
  const currentArmy = useSelector(selectors.selectCurrentArmy)

  // Generate reminders
  const reminders = processReminders(
    army,
    currentArmy.factionName,
    currentArmy.selections,
    currentArmy.realmscape_feature,
    currentArmy.allyFactionNames,
    allyArmies,
    currentArmy.allySelections
  )

  return reminders
}

export default useGetReminders
