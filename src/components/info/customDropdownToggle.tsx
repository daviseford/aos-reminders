import { useTheme } from 'context/useTheme'
import React from 'react'
import { centerContentClass } from 'theme/helperClasses'

type TCustomDropdownToggleProps = {
  children?: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {}
}

export const CustomDropdownToggle = React.forwardRef(
  (props: TCustomDropdownToggleProps, ref: React.Ref<HTMLAnchorElement>) => {
    const { onClick, children } = props
    const { theme } = useTheme()

    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
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
