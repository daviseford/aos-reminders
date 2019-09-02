import React, { useEffect } from 'react'
import { useSubscription } from 'context/useSubscription'
import { SavedArmyCard } from './saved_army_card'
import { useAuth0 } from 'react-auth0-wrapper'

export const ShowSavedArmies: React.FC<{}> = () => {
  const { isAuthenticated } = useAuth0()
  const { isSubscribed, savedArmies, loadSavedArmies } = useSubscription()

  useEffect(() => {
    if (isAuthenticated && isSubscribed) {
      loadSavedArmies()
    }
  }, [loadSavedArmies, isAuthenticated, isSubscribed])

  return (
    <div>
      {savedArmies.map((army, i) => (
        <SavedArmyCard key={i} army={army} />
      ))}
    </div>
  )
}
