import React from 'react'
import { useTheme } from 'context/useTheme'
import { centerContentClass } from 'theme/helperClasses'

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const GenericButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const { theme } = useTheme()

  return (
    <button type="button" className={theme.genericButtonBlock} {...props}>
      <div className={centerContentClass}>{children}</div>
    </button>
  )
}

export default GenericButton
