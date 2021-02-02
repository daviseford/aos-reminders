import { selectors } from 'ducks'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { processReminders } from 'utils/processReminders'

const useGetReminders = () => {
  const allyArmies = useSelector(selectors.selectAllyArmies)
  const army = useSelector(selectors.selectArmy)
  const currentArmy = useSelector(selectors.selectCurrentArmy)
  const notes = useSelector(selectors.selectNotes)

  // Generate reminders
  const reminders = useMemo(
    () =>
      processReminders(
        army,
        currentArmy.factionName,
        currentArmy.subFactionName,
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
      currentArmy.subFactionName,
    ]
  )

  const relevantNotes = useMemo(() => {
    const reminder_ids = Object.keys(reminders)
      .map(key => reminders[key].map(x => x.id))
      .flat()
    return notes.filter(x => reminder_ids.includes(x.linked_hash))
  }, [notes, reminders])

  return { reminders, relevantNotes }
}

export default useGetReminders
