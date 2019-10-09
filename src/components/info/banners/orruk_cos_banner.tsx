import React from 'react'
import { NotificationBanner } from 'components/info/notification_banner'
import { LinkNewTab } from 'components/helpers/link'

const OrrukCoSBanner = () => (
  <NotificationBanner name="Orruk_CoS_WaitingForBooks" persistClose={true} variant={'primary'}>
    Looking for{' '}
    <LinkNewTab url={'//github.com/daviseford/aos-reminders/pull/535'}>Cities of Sigmar</LinkNewTab> or{' '}
    <LinkNewTab url={'//github.com/daviseford/aos-reminders/pull/534'}>Orruk Warclans</LinkNewTab>? Don't
    fret, our goblins are hard at work getting this information updated.
  </NotificationBanner>
)

export default OrrukCoSBanner
