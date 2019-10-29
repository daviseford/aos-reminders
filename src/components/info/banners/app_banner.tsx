import React, { useEffect } from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { logDisplay } from 'utils/analytics'

const AppBanner = () => {
  const name = 'Battlescribe_Release_Notification'

  useEffect(() => {
    logDisplay(name)
  }, [])

  return (
    <NotificationBanner name={name} persistClose={true} variant={'info'}>
      Great news! You can now import Battlescribe HTML files!
    </NotificationBanner>
  )
}

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
