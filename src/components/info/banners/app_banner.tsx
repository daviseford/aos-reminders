import React from 'react'
import { NotificationBanner } from 'components/info/banners/notification_banner'
import { LinkNewTab } from 'components/helpers/link'
import { GITHUB_URL } from 'utils/env'

const AppBanner = () => (
  <NotificationBanner name="CoS_WaitingForBook" persistClose={true} variant={'primary'}>
    <strong>Orruk Warclans are updated!</strong>
    <br />
    Looking for <LinkNewTab href={`${GITHUB_URL}/pull/535`}>Cities of Sigmar</LinkNewTab>? Don't fret, our
    goblins are hard at work getting this information updated.
  </NotificationBanner>
)

export default AppBanner
