import React from 'react'
import { NavBar } from './navbar'

export const Loading = () => {
  return (
    <div className="d-block">
      <div className="ThemeDarkBg py-2">
        <NavBar />
      </div>
      <div>Loading...</div>
    </div>
  )
}
