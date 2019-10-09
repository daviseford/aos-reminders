import React from 'react'
import { IconType } from 'react-icons'
import { logClick } from 'utils/analytics'
import { btnContentWrapper } from 'theme/helperClasses'
import { componentWithSize } from 'utils/mapSizesToProps'

interface ILinkProps {
  href: string
  onClick?: (...args: any[]) => void
  className?: string
}

export const LinkNewTab: React.FC<ILinkProps> = ({ href, children, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
)

interface ILinkBtnProps {
  isMobile: boolean
  href: string
  btnClass: string
  Icon: IconType
  text: string
}

const LinkBtnComponent: React.FC<ILinkBtnProps> = props => {
  const { Icon, href, btnClass, isMobile, text } = props

  return (
    <LinkNewTab href={href} className={`${btnClass} mb-1`} onClick={e => logClick(`Contact-${text}`)}>
      <div className={btnContentWrapper}>
        <Icon className={isMobile ? `mx-2 my-1` : `mr-2`} />
        {isMobile ? `` : ` ${text}`}
      </div>
    </LinkNewTab>
  )
}

export const LinkButton = componentWithSize(LinkBtnComponent)
