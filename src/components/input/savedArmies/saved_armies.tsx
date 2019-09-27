import React, { useEffect, useState, useMemo } from 'react'
import { useSubscription } from 'context/useSubscription'
import { SavedArmyCard } from './saved_army_card'
import { useAuth0 } from 'react-auth0-wrapper'
import { paginateSavedArmies } from 'utils/paginate'
import { PaginateButtons } from './paginate_buttons'

const ShowSavedArmies: React.FC = () => {
  const { isAuthenticated } = useAuth0()
  const { isSubscribed, savedArmies, loadSavedArmies } = useSubscription()
  const [pageNum, setPageNum] = useState(1)

  const paginatedArmies = useMemo(() => paginateSavedArmies(savedArmies, 5), [savedArmies])

  useEffect(() => {
    if (isAuthenticated && isSubscribed) {
      loadSavedArmies()
    }
  }, [loadSavedArmies, isAuthenticated, isSubscribed])

  if (paginatedArmies.length === 0) return <NoArmiesFound />

  return (
    <div>
      <PaginateButtons pageNum={pageNum} setPageNum={setPageNum} numPages={paginatedArmies.length} />

      <div className="row justify-content-center">
        {paginatedArmies[pageNum - 1].map((army, i) => (
          <SavedArmyCard key={i} army={army} />
        ))}
      </div>

      <PaginateButtons pageNum={pageNum} setPageNum={setPageNum} numPages={paginatedArmies.length} />
    </div>
  )
}

export default ShowSavedArmies

const NoArmiesFound = () => (
  <div>
    <div className="alert alert-primary text-center" role="alert">
      You haven't saved any armies yet!
    </div>
  </div>
)
