import { useAuth0 } from '@auth0/auth0-react'
import { PaginateButtons } from 'components/input/savedArmies/paginate_buttons'
import { SavedArmyCard } from 'components/input/savedArmies/saved_army_card'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useSubscription } from 'context/useSubscription'
import React, { useEffect, useMemo, useState } from 'react'
import { paginateSavedArmies } from 'utils/paginate'

const ShowSavedArmies: React.FC = () => {
  const { isOffline } = useAppStatus()
  const { isAuthenticated } = useAuth0()
  const { isSubscribed } = useSubscription()
  const { savedArmies, loadSavedArmies } = useSavedArmies()
  const [pageNum, setPageNum] = useState(1)

  const paginatedArmies = useMemo(() => paginateSavedArmies(savedArmies, 6), [savedArmies])

  useEffect(() => {
    if (isOffline || (isAuthenticated && isSubscribed)) {
      loadSavedArmies()
    }
  }, [loadSavedArmies, isAuthenticated, isSubscribed, isOffline])

  if (paginatedArmies.length === 0) return <NoArmiesFound />

  return (
    <div className="mt-2">
      <PaginateButtons pageNum={pageNum} setPageNum={setPageNum} numPages={paginatedArmies.length} />

      <div className="row justify-content-center">
        {paginatedArmies[pageNum - 1].map((army, i) => (
          <SavedArmyCard key={`${army.id}_${i}`} army={army} />
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
