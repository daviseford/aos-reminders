import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from 'react-auth0-wrapper'
import { IStore } from 'types/store'
import { subscription } from 'ducks'
import { connect } from 'react-redux'

interface INavBarProps {
  isSubscribed: boolean
}

const NavBarComponent: React.FC<INavBarProps> = props => {
  const { isSubscribed } = props
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const { pathname } = window.location

  const styles = {
    btn: `btn btn btn-outline-light btn-sm mx-2`,
    header: `ThemeDarkBg pt-2 d-print-none d-flex justify-content-center align-items-center`,
    link: `font-weight-bold text-light mx-2`,
  }
  const btnText = !isAuthenticated ? `Log in` : `Log out`
  const handleClick = !isAuthenticated ? loginWithRedirect : logout

  return (
    <header className={styles.header}>
      <div className="flex-grow-1"></div>
      <div>
        {isAuthenticated && (
          <>
            {pathname !== '/' && (
              <Link to="/" className={styles.link}>
                Home
              </Link>
            )}
            {pathname !== '/profile' && (
              <Link to="/profile" className={styles.link}>
                Profile
              </Link>
            )}
            {!isSubscribed && pathname !== '/subscribe' && (
              <Link to="/subscribe" className={styles.link}>
                Subscribe
              </Link>
            )}
          </>
        )}

        <button className={styles.btn} onClick={() => handleClick({})}>
          {btnText}
        </button>
      </div>
    </header>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  isSubscribed: subscription.selectors.isSubscribed(state),
})

export const NavBar = connect(
  mapStateToProps,
  null
)(NavBarComponent)
