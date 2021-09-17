import { useState } from "react"
import { Link } from "react-router-dom"

// Bootstrap Components
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
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
  const [showChallenge, setShowChallenge] = useState(false)

  function decline() {
    setShowChallenge(false)
    props.handleDecline()
  }
  function accept() {
    setShowChallenge(false)
    props.handleAccept()
  }

  // if ID is set, must be logged in - show logged in Nav
  if (!(props.id === null))
    return (
      <>
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
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
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Link to={DASHBOARD_URL} className="nav-link">
                  Dashboard
                </Link>
                <Link to={GAME_URL} className="nav-link">
                  Game
                </Link>
              </Nav>
              <Nav>
                {props.challenge && (
                  <Button
                    variant="warning"
                    onClick={() => setShowChallenge(true)}
                  >
                    Challenge offer...
                  </Button>
                )}
                <Nav.Link onClick={props.handleLogout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Modal show={showChallenge} onHide={() => setShowChallenge(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Incoming challenge</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              {props.challenge && props.challenge.username} has offered you a
              challenge. Would you like to play?
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={decline} variant="secondary">
              No
            </Button>
            <Button onClick={accept} variant="primary">
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  else
    return (
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to={HOME_URL}>
              <img src="header-logo.svg" alt="Dai Di" width="70" height="70" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link to={HOME_URL} className="nav-link">
                Home
              </Link>
              <Link to={LOGIN_URL} className="nav-link">
                Login
              </Link>
              <Link to={REGISTER_URL} className="nav-link">
                Register
              </Link>
              <Link to={RULES_URL} className="nav-link">
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
