import React from 'react'

interface ILinkProps {
  url: string
  onClick?: (...args: any[]) => void
}

export const LinkNewTab: React.FC<ILinkProps> = ({ url, children, ...props }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
)
