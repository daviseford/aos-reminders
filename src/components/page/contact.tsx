import React from 'react'
import { btnContentWrapper } from 'theme/helperClasses'
import { FaGithub, FaEnvelopeOpenText, FaReddit, FaTwitter } from 'react-icons/fa'
import { IconType } from 'react-icons'
import { componentWithSize } from 'utils/mapSizesToProps'
import { logClick } from 'utils/analytics'

interface IContactProps {
  size?: 'normal' | 'small' | 'large'
}

export const ContactComponent: React.FC<IContactProps> = props => {
  const { size = 'normal' } = props
  const btnSize = size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : ''
  const btnClass = `btn ${btnSize} btn-outline-dark mx-1`

  return (
    <>
      <Link
        href="https://github.com/daviseford/aos-reminders/issues"
        btnClass={btnClass}
        Icon={FaGithub}
        text={'Github'}
      />
      <Link
        href="mailto:aosreminders@gmail.com"
        btnClass={btnClass}
        Icon={FaEnvelopeOpenText}
        text={'Email'}
      />
      <Link href="https://reddit.com/r/AoSReminders/" btnClass={btnClass} Icon={FaReddit} text={'Reddit'} />
      <Link href="https://twitter.com/daviseford" btnClass={btnClass} Icon={FaTwitter} text={'Twitter'} />
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={btnClass}
      onClick={e => logClick(`Contact-${text}`)}
    >
      <div className={btnContentWrapper}>
        <Icon className={isMobile ? `` : `mr-2`} />
        {isMobile ? `` : ` ${text}`}
      </div>
    </a>
  )
})

const Link = componentWithSize(LinkComponent)
