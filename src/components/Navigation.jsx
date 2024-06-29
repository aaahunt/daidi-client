import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SocketContext } from "../context/socket"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"

import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import useSignOut from "react-auth-kit/hooks/useSignOut"

const config = require("../config")

const Navigation = () => {
  const [expanded, setExpanded] = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const signOut = useSignOut()
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const logout = () => {
    signOut()
    socket.disconnect()
    navigate(config.URL.HOME)
  }

  if (isAuthenticated)
    return (
      <>
        <Navbar
          expanded={expanded}
          collapseOnSelect
          expand="md"
          bg="dark"
          variant="dark"
          id="main-nav"
        >
          <Container>
            <Navbar.Brand>
              <Link to={config.URL.HOME}>
                <img
                  src="header-logo.svg"
                  alt="Dai Di"
                  width="70"
                  height="70"
                />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              onClick={() => setExpanded(expanded ? false : "expanded")}
            />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Link
                  to={config.URL.DASHBOARD}
                  className="nav-link"
                  onClick={() => setExpanded(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={config.URL.RULES}
                  className="nav-link"
                  onClick={() => setExpanded(false)}
                >
                  Rules
                </Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    )
  else
    return (
      <Navbar
        collapseOnSelect
        expand="md"
        bg="dark"
        variant="dark"
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand>
            <Link to={config.URL.HOME} onClick={() => setExpanded(false)}>
              <img src="header-logo.svg" alt="Dai Di" width="70" height="70" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link
                to={config.URL.HOME}
                className="nav-link"
                onClick={() => setExpanded(false)}
              >
                Home
              </Link>
              <Link
                to={config.URL.LOGIN}
                className="nav-link"
                onClick={() => setExpanded(false)}
              >
                Login
              </Link>
              <Link
                to={config.URL.REGISTER}
                className="nav-link"
                onClick={() => setExpanded(false)}
              >
                Register
              </Link>
              <Link
                to={config.URL.RULES}
                className="nav-link"
                onClick={() => setExpanded(false)}
              >
                Rules
              </Link>
            </Nav>
            <Nav>
              <Nav.Link
                href="http://www.aahunt.co.uk/"
                target="_blank"
                rel="noreferrer"
              >
                {config.MESSAGE.CREATOR}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default Navigation
