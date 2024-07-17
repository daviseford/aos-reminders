import { useTheme } from 'context/useTheme'
import React from 'react'
import { centerContentClass } from 'theme/helperClasses'

type TCustomDropdownToggleProps = {
  children?: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => object
}

export const CustomDropdownToggle = React.forwardRef(
  (props: TCustomDropdownToggleProps, ref: React.Ref<HTMLAnchorElement>) => {
    const { onClick, children } = props
    const { theme } = useTheme()

    return (
      <a
        href=""
        className={`${theme.text} ${centerContentClass}`}
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

CustomDropdownToggle.displayName = 'CustomDropdownToggle'
