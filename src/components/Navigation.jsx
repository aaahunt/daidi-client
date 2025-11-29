import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"

import { logout } from "modules/authentication/actions"
import { isAuthenticatedSelector, userSelector } from "modules/authentication/selectors"
import config from "config"

const Navigation = () => {
  const [expanded, setExpanded] = useState(false)
  const authenticated = useSelector(isAuthenticatedSelector)
  const user = useSelector(userSelector)
  const dispatch = useDispatch()

  const handleLogout = () => {
    setExpanded(false)
    dispatch(logout())
  }

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" expanded={expanded}>
      <Container>
        <Navbar.Brand>
          <Link to={config.URL.HOME} onClick={() => setExpanded(false)}>
            <img src="/header-logo.svg" alt="Dai Di" width="70" height="70" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link to={config.URL.HOME} className="nav-link" onClick={() => setExpanded(false)}>
              Home
            </Link>
            {authenticated ? (
              <Link to={config.URL.LOGOUT} className="nav-link" onClick={handleLogout}>
                Logout
              </Link>
            ) : (
              <>
                <Link to={config.URL.LOGIN} className="nav-link" onClick={() => setExpanded(false)}>
                  Login / Register
                </Link>
              </>
            )}

            <Link to={config.URL.RULES} className="nav-link" onClick={() => setExpanded(false)}>
              Rules
            </Link>
          </Nav>
          {user && (
            <Nav>
              <Nav.Link>
                {user?.username} / {user?.user_id}
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
