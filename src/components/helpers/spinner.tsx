interface SpinnerProps {
  className?: string
  size?: 'large' | 'normal' | 'small'
  variant?: 'light' | 'dark' | 'secondary' | 'light-gray'
}

const Spinner = ({ variant = 'dark', size = 'normal', className = '' }: SpinnerProps) => {
  const colorClass = {
    light: 'text-light',
    dark: 'text-dark',
    secondary: 'text-secondary',
    'light-gray': 'text-light-gray',
  }[variant]
  const style = size === 'large' ? { width: '3.5rem', height: '3.5rem' } : {}
  const sizeClass = size === 'normal' || size === 'large' ? '' : 'spinner-border-sm'

  return (
    <div className={`d-flex justify-content-center ${className}`}>
      <div className={`spinner-border ${colorClass} ${sizeClass}`} style={style} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner
