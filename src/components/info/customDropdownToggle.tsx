import { useTheme } from 'context/useTheme'
import React from 'react'

type TCustomDropdownToggleProps = {
  children?: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {}
}

export const CustomDropdownToggle = React.forwardRef(
  (props: TCustomDropdownToggleProps, ref: React.Ref<HTMLAnchorElement>) => {
    const { onClick, children } = props
    const { theme } = useTheme()

    return (
      <a
        href=""
        className={`${theme.text}`}
        ref={ref}
        onClick={e => {
          e.preventDefault()
          onClick(e)
        }}
      >
        {children}
      </a>
    )
  }
)
