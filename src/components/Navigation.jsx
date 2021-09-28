import { useState } from "react"
import { Link } from "react-router-dom"

// Bootstrap Components
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"

// Config vars
import {
  HOME_URL,
  LOGIN_URL,
  REGISTER_URL,
  DASHBOARD_URL,
  GAME_URL,
  RULES_URL,
} from "../config"

const Navigation = (props) => {
  const [expanded, setExpanded] = useState(false)

  // if ID is set, must be logged in - show logged in Nav
  if (!(props.id === null))
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
              <Link to={HOME_URL}>
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
                  to={DASHBOARD_URL}
                  className="nav-link"
                  onClick={() => setExpanded(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={GAME_URL}
                  className="nav-link"
                  onClick={() => setExpanded(false)}
                >
                  Game
                </Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={props.handleLogout}>Logout</Nav.Link>
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
            <Link to={HOME_URL} onClick={() => setExpanded(false)}>
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
                to={HOME_URL}
                className="nav-link"
                onClick={() => setExpanded(false)}
              >
                Home
              </Link>
              <Link
                to={LOGIN_URL}
                className="nav-link"
                onClick={() => setExpanded(false)}
              >
                Login
              </Link>
              <Link
                to={REGISTER_URL}
                className="nav-link"
                onClick={() => setExpanded(false)}
              >
                Register
              </Link>
              <Link
                to={RULES_URL}
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
                Created by Ashley Hunt
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default Navigation
