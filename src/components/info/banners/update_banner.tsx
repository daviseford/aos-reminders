import React, { useState, useEffect } from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useAppStatus } from 'context/useAppStatus'
import GenericButton from 'components/input/generic_button'
import { LocalStoredArmy } from 'utils/localStore'

const UpdateBanner = () => {
  const { hasNewContent } = useAppStatus()
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const updateChannel = new BroadcastChannel('app-update')
      const listener = event => setOpen(true)
      updateChannel.addEventListener('message', listener)

      return () => {
        updateChannel.removeEventListener('message', listener)
      }
    }
  }, [])

  if (!hasNewContent) return <></>

  return (
    <NotificationBanner name={name} persistClose={false} variant={'warning'} enableLog={true}>
      Updates are available!
      <GenericButton hidden={!open} onClick={handleAccept}>
        Reload
      </GenericButton>
    </NotificationBanner>
  )
}

export default UpdateBanner
