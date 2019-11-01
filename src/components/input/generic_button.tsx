import React from 'react'
import { btnContentWrapper } from 'theme/helperClasses'
import { useTheme } from 'context/useTheme'

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const GenericButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const { theme } = useTheme()

  return (
    <button className={theme.genericButton} {...props}>
      <div className={btnContentWrapper}>{children}</div>
    </button>
  )
}

export default GenericButton
