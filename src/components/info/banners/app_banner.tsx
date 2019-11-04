import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useTheme } from 'context/useTheme'
import { FaRegSmileBeam } from 'react-icons/fa'
import { componentWithSize } from 'utils/mapSizesToProps'

const AppBanner = componentWithSize(({ isMobile = false }) => {
  const { isDark } = useTheme()
  const name = 'OBR_and_Mawtribes_Complete'

  return (
    <NotificationBanner
      displayOnce={true}
      enableLog={true}
      name={name}
      persistClose={true}
      variant={isDark ? 'secondary' : 'primary'}
    >
      Ossiarch Bonereapers and Ogor Mawtribes are now fully updated!
      {!isMobile && <FaRegSmileBeam className="ml-2" />}
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
