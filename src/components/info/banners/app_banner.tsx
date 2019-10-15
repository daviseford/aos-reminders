import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import BannerGif from './banner_gif'

const AppBanner = () => (
  <div className="row d-flex justify-content-center">
    <div className="col-12 col-sm-10 col-md-8 col-lg-5">
      <NotificationBanner name="Subscribe_Nudge_01" persistClose={false} variant={'light'}>
        <BannerGif
          gifUrl="/img/AoS_Subscribe_Support.gif"
          webmUrl="/img/AoS_Subscribe_Support.mp4"
          linkUrl={'/subscribe'}
          label={'SubscribeNudgeBanner1'}
          className="py-0 my-0"
        />
      </NotificationBanner>
    </div>
  </div>
)

export default AppBanner
