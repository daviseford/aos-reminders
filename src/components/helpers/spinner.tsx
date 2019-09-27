import React from 'react'

interface ISpinnerProps {
  variant?: 'light' | 'dark' | 'secondary'
}

const Spinner: React.FC<ISpinnerProps> = ({ variant = 'dark' }) => {
  return (
    <div className="d-flex justify-content-center">
      <div className={`spinner-border text-${variant}`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner
