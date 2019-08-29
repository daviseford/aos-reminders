import React from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { IUser } from 'types/user'
import { NavBar } from 'components/page/navbar'

export const Profile = () => {
  const { loading, user }: { loading: boolean; user: IUser } = useAuth0()

  if (loading || !user) {
    // TODO make this more fancy
    return <div>Loading...</div>
  }

  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>

      <UserCard user={user} loading={loading} />
    </div>
  )
}

interface IUserCardProps {
  loading: boolean
  user: IUser
}

const UserCard: React.FC<IUserCardProps> = props => {
  const { user, loading } = props

  return (
    <div className="container py-4">
      <h2 className="text-center">User Profile</h2>

      {!loading && (
        <div className="media">
          <div className="media-body">
            <h5 className="mt-0">{user.email}</h5>
            <p>Email Verified: {user.email_verified.toString()}</p>

            <code>{JSON.stringify(user, null, 2)}</code>
          </div>
        </div>
      )}
    </div>
  )
}
