import { withAuthenticationRequired } from '@auth0/auth0-react'
import React from 'react'
import { Route } from 'react-router-dom'

type TProps = { component: React.FC; [x: string]: any }

const ProtectedRoute: React.FC<TProps> = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
)

export default ProtectedRoute
