import { LinkButton } from 'components/helpers/link'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { FaDiscord, FaEnvelopeOpenText, FaGithub, FaReddit, FaTwitter } from 'react-icons/fa'
import { GITHUB_URL } from 'utils/env'

interface IContactProps {
  size?: 'normal' | 'small' | 'large'
}

const Contact: React.FC<IContactProps> = ({ size = 'normal' }) => {
  const { isOffline } = useAppStatus()
  const { isDark } = useTheme()
  const btnSize = size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : ''
  const btnClass = `btn ${btnSize} btn-outline-${isDark ? `light` : `dark`} mx-1`

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

export default Contact
