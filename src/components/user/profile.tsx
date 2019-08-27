// src/components/Profile.js

import React from 'react'
import { useAuth0 } from 'react-auth0-wrapper'

export const Profile = () => {
  const { loading, user } = useAuth0()

  if (loading || !user) {
    // TODO make this more fancy
    return <div>Loading...</div>
  }

  return (
    <>
      <img src={user.picture} alt="Profile" />

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </>
  )
}
