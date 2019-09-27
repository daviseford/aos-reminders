import React from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { MdStorage } from 'react-icons/md'
import { btnDarkBlock, btnContentWrapper } from 'theme/helperClasses'

interface IShowSavedArmiesBtn {
  showSavedArmies: () => void
  hideSavedArmies: () => void
  isShowingSavedArmies: boolean
}

const ShowSavedArmiesBtn: React.FC<IShowSavedArmiesBtn> = ({
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
      <button className={btnDarkBlock} onClick={handleClick}>
        <div className={btnContentWrapper}>
          <MdStorage className="mr-2" /> {btnText}
        </div>
      </button>
    </>
  )
}

export default ShowSavedArmiesBtn
