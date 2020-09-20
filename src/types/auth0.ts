import { IUser } from './user'

export interface IUseAuth0 {
  user: IUser
  isAuthenticated: boolean
  loading: boolean
  logout: (opts: { client_id: string; returnTo: string }) => Promise<void>
  loginWithRedirect: (opts?: { redirect_uri?: string; appState?: { targetUrl: string } }) => Promise<void>
}
