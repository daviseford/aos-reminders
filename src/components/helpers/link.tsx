import React from 'react'
import { IconType } from 'react-icons'
import { centerContentClass } from 'theme/helperClasses'
import { logClick } from 'utils/analytics'
import useWindowSize from 'utils/hooks/useWindowSize'

interface ILinkProps {
  className?: string
  href: string
  label: string
  onClick?: (...args: any[]) => void
}

export const LinkNewTab: React.FC<ILinkProps> = ({ href, children, label, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} {...props}>
    {children}
  </a>
)

interface ILinkBtnProps {
  href: string
  btnClass: string
  Icon: IconType
  text: string
}

export const LinkButton: React.FC<ILinkBtnProps> = props => {
  const { Icon, href, btnClass, text } = props
  const { isMobile } = useWindowSize()

  return (
    <LinkNewTab
      href={href}
      className={`${btnClass} mb-1`}
      onClick={e => logClick(`Contact-${text}`)}
      label={text}
    >
      <div className={centerContentClass}>
        <Icon className={isMobile ? `mx-2 my-1` : `mr-2`} />
        {isMobile ? `` : ` ${text}`}
      </div>
    </LinkNewTab>
  )
}
