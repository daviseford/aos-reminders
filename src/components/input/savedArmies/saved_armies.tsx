import React, { useEffect, useState, useMemo } from 'react'
import { useSubscription } from 'context/useSubscription'
import { SavedArmyCard } from './saved_army_card'
import { useAuth0 } from 'react-auth0-wrapper'
import { paginateSavedArmies } from 'utils/paginate'

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

interface IPaginateButtonsProps {
  pageNum: number
  numPages: number
  setPageNum: (num: number) => void
}

const PaginateButtons: React.FC<IPaginateButtonsProps> = props => {
  const { pageNum, setPageNum, numPages } = props

  debugger

  if (numPages < 2) return null

  const canIncrement = pageNum !== numPages
  const canDecrement = pageNum !== 1

  const increment = e => {
    e.preventDefault()
    if (canIncrement) setPageNum(pageNum + 1)
  }

  const decrement = e => {
    e.preventDefault()
    if (canDecrement) setPageNum(pageNum - 1)
  }

  return (
    <nav aria-label="Saved Army Pagination">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${!canDecrement ? `disabled` : ``}`} onClick={decrement}>
          <button className="page-link">Previous</button>
        </li>
        <li className={`page-item ${!canIncrement ? `disabled` : ``}`} onClick={increment}>
          <button className="page-link">Next</button>
        </li>
      </ul>
    </nav>
  )
}
