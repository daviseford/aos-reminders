import React from 'react'

interface ISpinnerProps {
  variant?: 'light' | 'dark' | 'secondary' | 'light-gray'
  size?: 'large' | 'normal' | 'small'
}

const Spinner: React.FC<ISpinnerProps> = ({ variant = 'dark', size = 'normal' }) => {
  const colorClass = {
    light: 'text-light',
    dark: 'text-dark',
    secondary: 'text-secondary',
    'light-gray': 'text-light-gray',
  }[variant]

  const style = size === 'large' ? { width: '3.5rem', height: '3.5rem' } : {}
  const sizeClass = size === 'normal' || style === 'large' ? `` : `spinner-border-sm`

  return (
    <div className="d-flex justify-content-center">
      <div className={`spinner-border ${colorClass} ${sizeClass}`} style={style} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner
