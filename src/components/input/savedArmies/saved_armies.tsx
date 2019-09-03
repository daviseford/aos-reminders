import React, { useEffect, useState, useMemo } from 'react'
import { useSubscription } from 'context/useSubscription'
import { SavedArmyCard } from './saved_army_card'
import { useAuth0 } from 'react-auth0-wrapper'
import { paginateSavedArmies } from 'utils/paginate'
import { PaginateButtons } from './paginate_buttons'

export const ShowSavedArmies: React.FC<{}> = () => {
  const { isAuthenticated } = useAuth0()
  const { isSubscribed, savedArmies, loadSavedArmies } = useSubscription()
  const [pageNum, setPageNum] = useState(1)

  const paginatedArmies = useMemo(() => paginateSavedArmies(savedArmies, 5), [savedArmies])

  useEffect(() => {
    if (isAuthenticated && isSubscribed) {
      loadSavedArmies()
    }
  }, [loadSavedArmies, isAuthenticated, isSubscribed])

  return (
    <div>
      {paginatedArmies[pageNum - 1].map((army, i) => (
        <SavedArmyCard key={i} army={army} />
      ))}
      <PaginateButtons pageNum={pageNum} setPageNum={setPageNum} numPages={paginatedArmies.length} />
    </div>
  )
}
