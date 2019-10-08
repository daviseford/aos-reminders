import React, { useState } from 'react'
import { hideNotificationBanner, getNotificationBanner } from 'utils/localStore'

interface IBannerProps {
  name: string
  persistClose?: boolean
}

/**
 * Re-usable component that can broadcast application notifications
 * Can be hidden - will be stored in local storage
 * @param props
 */
export const NotificationBanner: React.FC<IBannerProps> = props => {
  const { name, persistClose = true, children } = props
  const isHidden = persistClose ? getNotificationBanner(name) === 'hidden' : false
  const [isOn, setIsOn] = useState(!isHidden)

  if (!isOn) return null

  const handleClose = () => {
    setIsOn(false)
    persistClose && hideNotificationBanner(name)
  }

  return (
    <div className="mb-2">
      <div className={`alert alert-primary text-center fade show d-flex`} role="alert">
        <div className={`flex-grow-1`}>{children}</div>
        <div className={`align-self-start ml-2`}>
          <button type="button" className="close" aria-label="Close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  )
}
