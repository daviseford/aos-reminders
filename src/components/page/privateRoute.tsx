import { withAuthenticationRequired } from '@auth0/auth0-react'
import { ComponentType } from 'react'
import { Route } from 'react-router-dom'

type TProps = { component: ComponentType; [x: string]: unknown }

const ProtectedRoute = ({ component, ...args }: TProps) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
)

export default ProtectedRoute
