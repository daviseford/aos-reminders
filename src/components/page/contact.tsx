import React from 'react'
import { FaGithub, FaEnvelopeOpenText, FaReddit, FaTwitter, FaDiscord } from 'react-icons/fa'
import { GITHUB_URL } from 'utils/env'
import { LinkButton } from 'components/helpers/link'
import { useOfflineStatus } from 'context/useOfflineStatus'

interface IContactProps {
  size?: 'normal' | 'small' | 'large'
}

export const ContactComponent: React.FC<IContactProps> = props => {
  const { isOffline } = useOfflineStatus()
  const { size = 'normal' } = props
  const btnSize = size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : ''
  const btnClass = `btn ${btnSize} btn-outline-dark mx-1`

  if (isOffline) return null

  return (
    <>
      <LinkButton href={GITHUB_URL} btnClass={btnClass} Icon={FaGithub} text={'Github'} />
      <LinkButton
        href="mailto:aosreminders@gmail.com"
        btnClass={btnClass}
        Icon={FaEnvelopeOpenText}
        text={'Email'}
      />
      <LinkButton href="//reddit.com/r/AoSReminders/" btnClass={btnClass} Icon={FaReddit} text={'Reddit'} />
      <LinkButton href="//discord.gg/2nt9Fxp" btnClass={btnClass} Icon={FaDiscord} text={'Discord'} />
      <LinkButton href="//twitter.com/daviseford" btnClass={btnClass} Icon={FaTwitter} text={'Twitter'} />
    </>
  )
}
