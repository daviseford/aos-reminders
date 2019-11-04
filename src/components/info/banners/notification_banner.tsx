import React, { useState, useEffect } from 'react'
import { hideNotificationBanner, getNotificationBanner } from 'utils/localStore'
import { logDisplay, logClick } from 'utils/analytics'
import { centerContentClass } from 'theme/helperClasses'

interface IBannerProps {
  displayOnce?: boolean
  enableLog?: boolean
  name: string
  persistClose?: boolean
  variant?: TAlertTypes
}

/**
 * Re-usable component that can broadcast application notifications
 * Can be hidden - will be stored in local storage
 * @param props
 */
export const NotificationBanner: React.FC<IBannerProps> = props => {
  const {
    children,
    displayOnce = false,
    enableLog = false,
    name,
    persistClose = true,
    variant = 'primary',
  } = props
  const isHidden = persistClose || displayOnce ? getNotificationBanner(name) === 'hidden' : false
  const [isOn, setIsOn] = useState(!isHidden)

  const handleClose = () => {
    setIsOn(false)
    if (persistClose) hideNotificationBanner(name)
    if (enableLog) logClick(`Close-${name}`)
  }

  useEffect(() => {
    if (enableLog && isOn) logDisplay(name)
    return () => {
      if (displayOnce && isOn) hideNotificationBanner(name)
    }
  })

  if (!isOn) return null

  return (
    <div className={`alert alert-${variant} text-center fade show d-flex my-0`} role="alert">
      <div className={`flex-grow-1 ${centerContentClass}`}>{children}</div>
      <div className={`align-self-start ml-2`}>
        <button type="button" className="close" aria-label="Close" onClick={handleClose}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  )
}

type TAlertTypes = 'primary' | 'secondary' | 'danger' | 'info' | 'warning' | 'success' | 'light' | 'dark'
