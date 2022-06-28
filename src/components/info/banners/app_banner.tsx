import { NotificationBanner } from 'components/info/banners/notification_banner'
import { useTheme } from 'context/useTheme'

const AppBanner = () => {
  const { isDark } = useTheme()
  const name = 'aos-3-ghb-2022-release'

  return (
    <NotificationBanner
      displayOnce={true}
      enableLog={true}
      name={name}
      persistClose={true}
      variant={isDark ? `info` : `info`}
    >
      <span>
        <strong>NEW: </strong>General's Handbook (2022) has been added. Sylvaneth and Skaven are coming soon!
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
