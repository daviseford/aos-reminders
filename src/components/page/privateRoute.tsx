import { withAuthenticationRequired } from '@auth0/auth0-react'
import type { ComponentType } from 'react'

/*
 * React Router v8 routes declare elements, not components, so the Auth0 guard wraps the route
 * component itself. Apply it once at module scope (see src/bootstrap/router.tsx) — calling it
 * during render would create a new component identity on every pass.
 */
export const protectedRoute = (component: ComponentType): ComponentType =>
  withAuthenticationRequired(component)
