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
    <div className="ThemeDarkBg">
      <NavBar />
      <>
        <img src={user.picture} alt="Profile" />

        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <code>{JSON.stringify(user, null, 2)}</code>
      </>
    </div>
  )
}
