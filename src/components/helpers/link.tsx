import React from 'react'

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
