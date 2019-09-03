import React from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { MdStorage } from 'react-icons/md'

const btnClass = `btn btn-outline-dark btn-block`
const btnContentWrapper = `d-flex align-items-center justify-content-center`

interface IShowSavedArmiesBtn {
  showSavedArmies: () => void
  hideSavedArmies: () => void
  isShowingSavedArmies: boolean
}

export const ShowSavedArmiesBtn: React.FC<IShowSavedArmiesBtn> = ({
  isShowingSavedArmies,
  showSavedArmies,
  hideSavedArmies,
}) => {
  const { isAuthenticated } = useAuth0()
  const { isSubscribed } = useSubscription()

  if (!isAuthenticated || !isSubscribed) return null
  const btnText = `${isShowingSavedArmies ? `Hide` : `Show`} Saved`

  const handleClick = e => {
    e.preventDefault()
    return isShowingSavedArmies ? hideSavedArmies() : showSavedArmies()
  }

  return (
    <>
      <button className={btnClass} onClick={handleClick}>
        <div className={btnContentWrapper}>
          <MdStorage className="mr-2" /> {btnText}
        </div>
      </button>
    </>
  )
}
