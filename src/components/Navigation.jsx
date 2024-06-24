import { useState } from "react"

// React Router DOM for links/routing
import { Link } from "react-router-dom"

// Bootstrap Components
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"

// Config vars
const config = require("../config")

const Navigation = (props) => {
  // Use state for menu collapsed or not
  const [expanded, setExpanded] = useState(false)

  // if ID is set, must be logged in - show logged in Nav
  if (!(props.user_id === null))
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
              <Nav className="me-auto"></Nav>
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
