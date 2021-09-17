import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useTheme } from 'context/useTheme'
import React from 'react'

const AppBanner = () => {
  const { isDark } = useTheme()
  const name = 'aos-3-new-warhammer-app-import'

  return (
    <NotificationBanner
      displayOnce={true}
      enableLog={true}
      name={name}
      persistClose={true}
      variant={isDark ? `info` : `info`}
    >
      <span>
        <strong>NEW: </strong>We've added the ability to import lists from the new Warhammer App. Just hit
        "Import List" and then copy + paste your list to get started!
        <br />
        <small>
          This feature is still in development and may change rapidly! Please let me know if you encounter
          issues.
        </small>
      </span>
    </NotificationBanner>
  )
}

// Sale Banner
// const AppBanner = () => {
//   const { isDark } = useTheme()
//   const { isNotSubscribed } = useSubscription()
//   const name = 'Paypal_Launch_2020'

//   const subscribeTxt = <>You can now subscribe using PayPal!</>

//   useEffect(() => {
//     logDisplay(name)
//   }, [])

//   // Only display to non-subscribers
//   if (!isNotSubscribed) return <></>

//   return (
//     <NotificationBanner
//       displayOnce={true}
//       enableLog={true}
//       name={name}
//       persistClose={true}
//       variant={isDark ? `dark` : `secondary`}
//     >
//       WAAAGH!&nbsp;
//       <Link to={ROUTES.SUBSCRIBE} onClick={() => logClick(name)}>
//         {subscribeTxt}
//       </Link>
//     </NotificationBanner>
//   )
// }

export default AppBanner
