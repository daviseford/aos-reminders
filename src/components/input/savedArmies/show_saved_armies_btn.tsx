import React from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSubscription } from 'context/useSubscription'
import { MdStorage } from 'react-icons/md'
import { btnDarkBlock, btnContentWrapper } from 'theme/helperClasses'
import { useAppStatus } from 'context/useAppStatus'
import { LocalSavedArmies } from 'utils/localStore'
import { useTheme } from 'context/useTheme'

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
  const { isOnline, isOffline } = useAppStatus()
  const { isAuthenticated } = useAuth0()
  const { isSubscribed } = useSubscription()
  const { theme } = useTheme()

  if (isOnline && (!isAuthenticated || !isSubscribed)) return null
  if (isOffline && LocalSavedArmies.get().length === 0) return null

  const btnText = `${isShowingSavedArmies ? `Hide` : `Show`} Saved Armies`

  const handleClick = e => {
    e.preventDefault()
    return isShowingSavedArmies ? hideSavedArmies() : showSavedArmies()
  }

  return (
    <>
      <button className={theme.genericButton} onClick={handleClick}>
        <div className={btnContentWrapper}>
          <MdStorage className="mr-2" /> {btnText}
        </div>
      </button>
    </>
  )
}

export default ShowSavedArmiesBtn
