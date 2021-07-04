import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useTheme } from 'context/useTheme'
import React from 'react'

const AppBanner = () => {
  const { isDark } = useTheme()
  const name = 'aos-3-core-rules-update'

  return (
    <NotificationBanner
      displayOnce={true}
      enableLog={true}
      name={name}
      persistClose={true}
      variant={isDark ? `info` : `info`}
    >
      <span>
        <strong>We are fully up to date with AoS 3.0!</strong>

        <li>Added Core Rules 2021</li>
        <li>Added General's Handbook 2021</li>
        <li>
          Added <strong>all</strong> of the July 2021 FAQs! <em>(phew)</em>
        </li>
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
