import React from 'react'
import { FiWifiOff } from 'react-icons/fi'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { LocalUserName } from 'utils/localStore'

const OfflineComponent = () => {
  const { isOnline } = useAppStatus()
  const { theme } = useTheme()

  if (isOnline) return null

  const userName = LocalUserName.get()

  return (
    <div className="container pt-4">
      <div className="row justify-content-center">
        <div
          className={`col-12 col-sm-8 col-md-6 col-lg-6 col-xl-6 col-xxl-4 ${theme.card} ${theme.bgColor} ${theme.text} py-3 text-center`}
        >
          <p className="text-danger">
            <FiWifiOff className="mr-2" />
            You are in <strong>Offline</strong> mode.
            <FiWifiOff className="ml-2" />
          </p>
          <p>Your capabilites are limited in this mode.</p>
          You cannot save a new army.
          {!!userName && (
            <>
              <br />
              You cannot update or delete armies.
              <br />
              You cannot access your profile.
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OfflineComponent
