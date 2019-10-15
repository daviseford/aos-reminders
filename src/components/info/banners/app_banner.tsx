import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { Link } from 'react-router-dom'

const AppBanner = () => {
  return (
    <div className="row d-flex justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <NotificationBanner name="Subscribe_Nudge_01" persistClose={false} variant={'light'}>
          <p>
            We work hard to maintain our rules library and constantly implement new premium features for the
            community. You can help support these efforts by subscribing!
          </p>

          <p className="highlight-animation">
            <Link to="/subscribe">
              <span>Subscribe Today</span>
            </Link>
          </p>
        </NotificationBanner>
      </div>
    </div>
  )
}

export default AppBanner
