import Navbar from 'components/page/navbar'
import { useTheme } from 'context/useTheme'
import React, { useEffect } from 'react'
import { ROUTES } from 'utils/env'

const AlreadySubscribed = () => {
  const { theme } = useTheme()

  useEffect(() => {
    setTimeout(() => {
      window.location.replace(ROUTES.PROFILE)
    }, 1000)
  }, [])

  return (
    <div className={`d-block ${theme.text}`}>
      <div className={`py-2 ${theme.headerColor}`}>
        <Navbar />
      </div>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col mx-5 my-5 py-5 px-5">
          <p className="lead text-center">You are now subscribed :) Thanks!</p>
        </div>
      </div>
    </div>
  )
}

export default AlreadySubscribed
