import { withAuthenticationRequired } from '@auth0/auth0-react'
import type { ComponentType } from 'react'
import { Route } from 'react-router-dom'

type Props = { component: ComponentType; [key: string]: unknown }

const ProtectedRoute = ({ component, ...args }: Props) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
)

export default ProtectedRoute
