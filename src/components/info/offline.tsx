import React from 'react'
import { useOfflineStatus } from 'context/useOfflineStatus'
import { LocalUserName } from 'utils/localStore'

const OfflineComponent = () => {
  const { isOnline } = useOfflineStatus()

  if (isOnline) return null

  const userName = LocalUserName.get()

  return (
    <div className="container pt-4">
      <div className="row justify-content-center">
        <div className="col-10 col-sm-8 col-md-6 col-lg-6 col-xl-6 card py-3">
          <p className="text-danger">You are operating in Offline mode</p>
          <p>Your capabilites are limited in this mode.</p>
          <ul>
            <li>You cannot save an army.</li>
            {!!userName && (
              <>
                <li>You cannot update or delete armies.</li>
                <li>You cannot access your profile.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OfflineComponent
