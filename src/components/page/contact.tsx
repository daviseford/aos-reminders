import React from 'react'
import { btnContentWrapper } from 'theme/helperClasses'
import { FaGithub, FaEnvelopeOpenText, FaReddit, FaTwitter, FaDiscord } from 'react-icons/fa'
import { IconType } from 'react-icons'
import { componentWithSize } from 'utils/mapSizesToProps'
import { logClick } from 'utils/analytics'
import { LinkNewTab } from 'components/helpers/link'
import { GITHUB_URL } from 'utils/env'

interface IContactProps {
  size?: 'normal' | 'small' | 'large'
}

export const ContactComponent: React.FC<IContactProps> = props => {
  const { size = 'normal' } = props
  const btnSize = size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : ''
  const btnClass = `btn ${btnSize} btn-outline-dark mx-1`

  return (
    <>
      <Link href={GITHUB_URL} btnClass={btnClass} Icon={FaGithub} text={'Github'} />
      <Link
        href="mailto:aosreminders@gmail.com"
        btnClass={btnClass}
        Icon={FaEnvelopeOpenText}
        text={'Email'}
      />
      <Link href="//reddit.com/r/AoSReminders/" btnClass={btnClass} Icon={FaReddit} text={'Reddit'} />
      <Link href="//discord.gg/2nt9Fxp" btnClass={btnClass} Icon={FaDiscord} text={'Discord'} />
      <Link href="//twitter.com/daviseford" btnClass={btnClass} Icon={FaTwitter} text={'Twitter'} />
    </>
  )
}

interface ILinkProps {
  isMobile: boolean
  href: string
  btnClass: string
  Icon: IconType
  text: string
}

const LinkComponent: React.FC<ILinkProps> = componentWithSize(props => {
  const { Icon, href, btnClass, isMobile, text } = props

  return (
    <LinkNewTab href={href} className={`${btnClass} mb-1`} onClick={e => logClick(`Contact-${text}`)}>
      <div className={btnContentWrapper}>
        <Icon className={isMobile ? `mx-2 my-1` : `mr-2`} />
        {isMobile ? `` : ` ${text}`}
      </div>
    </LinkNewTab>
  )
})

const Link = componentWithSize(LinkComponent)
