import React, { useEffect, useState } from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useTheme } from 'context/useTheme'
import { FaRegSmileBeam } from 'react-icons/fa'
import { componentWithSize } from 'utils/mapSizesToProps'
import GenericButton from 'components/input/generic_button'

const AppBanner = componentWithSize(({ isMobile = false }) => {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const name = 'OBR_and_Mawtribes_Complete'

  const handleAccept = async () => {
    try {
      if (navigator && navigator.serviceWorker) {
        const waitingServiceWorker = await navigator.serviceWorker.ready

        if (waitingServiceWorker.waiting) {
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
      updateChannel.addEventListener('message', event => {
        setOpen(true)
      })
    }
  }, [])

  return (
    <NotificationBanner
      displayOnce={false}
      enableLog={true}
      name={name}
      persistClose={false}
      variant={isDark ? 'secondary' : 'primary'}
    >
      Some sample text to make my dayddd
    </NotificationBanner>
  )
})

export default AppBanner

// Sale Banner
// const AppBanner = componentWithSize(props => {
//   const { isTinyMobile } = props
//   const { isNotSubscribed } = useSubscription()
//   const name = 'Offline_Sale_Notification'

//   const subscribeTxt = (
//     <>
//       To celebrate, subscriptions are <strong>50% off!</strong>
//     </>
//   )

//   useEffect(() => {
//     logDisplay(name)
//   }, [])

//   return (
//     <NotificationBanner name={name} persistClose={true} variant={'info'}>
//       You can now use this site <strong>offline!</strong>
//       <br />
//       {isNotSubscribed && (
//         <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick(name)}>
//           {isTinyMobile ? <small>{subscribeTxt}</small> : subscribeTxt}
//         </Link>
//       )}
//     </NotificationBanner>
//   )
// })
