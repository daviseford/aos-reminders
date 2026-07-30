import React, { useEffect, useState } from 'react'
import { centerContentClass } from 'theme/helperClasses'
import { TBootstrapTypes } from 'types/theme'
import { logBannerClose, logBannerView } from 'utils/analytics'

const storageKey = (name: string) => `aos-reminders:aos4:banner:${name}`

const isDismissed = (name: string): boolean => {
  try {
    return window.localStorage.getItem(storageKey(name)) === 'hidden'
  } catch {
    // Browser storage can be unavailable in privacy modes. Showing the banner is the safe default.
    return false
  }
}

const rememberDismissal = (name: string) => {
  try {
    window.localStorage.setItem(storageKey(name), 'hidden')
  } catch {
    // The banner stays closed for this session and returns on the next load.
  }
}

interface IBannerProps {
  enableLog?: boolean
  name: string
  persistClose?: boolean
  variant?: TBootstrapTypes
}

/**
 * Re-usable component that can broadcast application notifications.
 * Closing it is remembered in local storage, keyed by name.
 */
export const NotificationBanner = ({
  children,
  enableLog = false,
  name,
  persistClose = true,
  variant = 'primary',
}: React.PropsWithChildren<IBannerProps>) => {
  const [isOn, setIsOn] = useState(() => !(persistClose && isDismissed(name)))

  useEffect(() => {
    if (enableLog && isOn) logBannerView(name)
  }, [enableLog, isOn, name])

  const handleClose = () => {
    setIsOn(false)
    if (persistClose) rememberDismissal(name)
    if (enableLog) logBannerClose(name)
  }

  if (!isOn) return null

  return (
    <div className={`alert alert-${variant} text-center fade show d-flex my-0 d-print-none`} role="alert">
      <div className={`flex-grow-1 ${centerContentClass}`}>{children}</div>
      {/*
        flex-shrink-0 keeps the 24px hit box intact. Without it the long banner text squeezes the
        close button's 1em width down to ~13px, taking the control under the WCAG 2.5.8 floor.
      */}
      <button
        type="button"
        className="btn-close align-self-start ms-2 flex-shrink-0"
        aria-label="Close notification"
        onClick={handleClose}
      />
    </div>
  )
}
