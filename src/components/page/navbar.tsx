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

  const styles = {
    btn: `btn btn-block btn-outline-light btn-sm`,
    btnCol: `col-4`,
    flex: `d-flex justify-content-between align-items-center`,
    header: `ThemeDarkBg pt-2 d-print-none`,
    link: `font-weight-bold text-light mx-3`,
    linkCol: `col ml-3`,
  }
  const btnText = !isAuthenticated ? `Log in` : `Log out`
  const handleClick = !isAuthenticated ? loginWithRedirect : logout

  return (
    <header className={styles.header}>
      <div className={styles.flex}>
        <div className="col"></div>
        <div className={styles.linkCol}>
          {isAuthenticated && (
            <>
              <Link to="/" className={styles.link}>
                Home
              </Link>
              <Link to="/profile" className={styles.link}>
                Profile
              </Link>
              {!isSubscribed && (
                <Link to="/subscribe" className={styles.link}>
                  Subscribe
                </Link>
              )}
            </>
          )}
        </div>
        <div className={styles.btnCol}>
          <button className={styles.btn} onClick={() => handleClick({})}>
            {btnText}
          </button>
        </div>
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
