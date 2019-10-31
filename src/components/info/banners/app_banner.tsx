import React, { useEffect } from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { logDisplay } from 'utils/analytics'

const AppBanner = () => {
  const name = 'OBR_and_Mawtribes_WIP'

  useEffect(() => {
    logDisplay(name)
  }, [])

  return (
    <NotificationBanner name={name} persistClose={true} variant={'info'}>
      We're adding Ossiarch Bonereapers and Ogor Mawtribes rules as fast as we can! Stay tuned :)
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
