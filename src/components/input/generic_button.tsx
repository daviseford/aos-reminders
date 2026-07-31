import { useTheme } from 'context/useTheme'

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const GenericButton = ({ children, ...props }: React.PropsWithChildren<ButtonProps>) => {
  const { theme } = useTheme()

  return (
    <button type="button" className={theme.genericButtonBlock} {...props}>
      <div className="d-flex align-items-center justify-content-center">{children}</div>
    </button>
  )
}

export default GenericButton
