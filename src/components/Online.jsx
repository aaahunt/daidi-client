import { useState } from "react"

// Bootstrap components
import Offcanvas from "react-bootstrap/Offcanvas"
import Button from "react-bootstrap/Button"

// Config vars
const config = require("../config")

const Online = ({ users, handleChallenge, id }) => {
  // Use state to toggle players panel
  const [showPanel, setShowPanel] = useState(false)

  const handleClose = () => setShowPanel(false)
  const handleShow = () => setShowPanel(true)

  let options = null
  if (users) {
    options = users.map((user) => (
      <div key={user.userID} value={user.userID}>
        {user.username}
        <Button
          size="sm"
          className="ms-1"
          onClick={() => {
            handleChallenge(user.userID)
            setShowPanel(false)
          }}
        >
          Challenge
        </Button>
      </div>
    ))
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mb-2">
        See online players
      </Button>

      <Offcanvas show={showPanel} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Online Players</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {!users && <p>{config.MESSAGE.PLAYERS.NONE}</p>}
          {users && users.length < 1 && (
            <p>{config.MESSAGE.PLAYERS.ONLY_YOU}</p>
          )}
          {options}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Online
