import { useTheme } from 'context/useTheme'
import React from 'react'
import { centerContentClass } from 'theme/helperClasses'

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const GenericButton = ({ children, ...props }: React.PropsWithChildren<ButtonProps>) => {
  const { theme } = useTheme()

  return (
    <button type="button" className={theme.genericButtonBlock} {...props}>
      <div className={centerContentClass}>{children}</div>
    </button>
  )
}

export default GenericButton
