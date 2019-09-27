import React from 'react'

interface ISpinnerProps {
  variant?: 'light' | 'dark' | 'secondary'
  size?: 'normal' | 'small'
}

const Spinner: React.FC<ISpinnerProps> = ({ variant = 'dark', size = 'normal' }) => {
  const sizeClass = size === 'normal' ? `` : `spinner-border-sm`
  return (
    <div className="d-flex justify-content-center">
      <div className={`spinner-border text-${variant} ${sizeClass}`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner
