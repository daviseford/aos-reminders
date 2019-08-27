import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'

export const NavBar: React.FC<{}> = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const styles = {
    btn: `btn btn-block btn-outline-dark`,
    row: `row justify-content-center`,
  }
  const btnText = !isAuthenticated ? `Log in` : `Log out`
  const handleClick = !isAuthenticated ? loginWithRedirect : logout

  return (
    <div className={styles.row}>
      <button className={styles.btn} onClick={() => handleClick({})}>
        {btnText}
      </button>
      {isAuthenticated && (
        <span>
          <Link to="/">Home</Link>&nbsp;
          <Link to="/profile">Profile</Link>
        </span>
      )}
    </div>
  )
}
