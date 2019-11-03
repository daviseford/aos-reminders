import React, { useEffect } from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { logDisplay } from 'utils/analytics'
import { useTheme } from 'context/useTheme'
import { useSubscription } from 'context/useSubscription'
import { Link } from 'react-router-dom'
import { ROUTES } from 'utils/env'

const AppBanner = () => {
  const { isActive } = useSubscription()
  const { isDark } = useTheme()
  const name = 'Try_Dark_Mode'

  useEffect(() => {
    logDisplay(name)
  }, [])

  if (isDark || !isActive) return <></>

  return (
    <NotificationBanner
      name={name}
      persistClose={true}
      displayOnce={true}
      variant={isDark ? 'secondary' : 'primary'}
    >
      Check out our new dark theme! Enable it on your <Link to={ROUTES.PROFILE}>Profile</Link>.
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
