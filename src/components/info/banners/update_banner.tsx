import React, { useState, useEffect } from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import GenericButton from 'components/input/generic_button'
import { LocalStoredArmy } from 'utils/localStore'
import { useAppStatus } from 'context/useAppStatus'

const UpdateBanner = () => {
  const { hasNewContent } = useAppStatus()
  const name = 'Content_Update_Notification'

  const handleAccept = async () => {
    try {
      if (navigator && navigator.serviceWorker) {
        const waitingServiceWorker = await navigator.serviceWorker.ready

        if (waitingServiceWorker.waiting) {
          LocalStoredArmy.set() // Save anything we're working on
          waitingServiceWorker.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (!hasNewContent) return <></>

  return (
    <NotificationBanner name={name} persistClose={false} variant={'warning'} enableLog={true}>
      Updates are available!
      <GenericButton onClick={handleAccept}>Reload</GenericButton>
    </NotificationBanner>
  )
}

export default UpdateBanner
