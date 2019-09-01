import React, { useEffect } from 'react'
import { useSubscription } from 'context/useSubscription'
import { SavedArmyCard } from './saved_army_card'

export const ShowSavedArmies: React.FC<{}> = () => {
  const { savedArmies, loadSavedArmies } = useSubscription()

  useEffect(() => {
    loadSavedArmies()
  }, [loadSavedArmies])

  return (
    <div>
      {savedArmies.map((army, i) => (
        <SavedArmyCard key={i} army={army} />
      ))}
    </div>
  )
}
