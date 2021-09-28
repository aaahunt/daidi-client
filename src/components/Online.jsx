import { useState } from "react"

// Bootstrap components
import Offcanvas from "react-bootstrap/Offcanvas"
import Button from "react-bootstrap/Button"

const Online = ({ users, handleChallenge, id }) => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

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
            setShow(false)
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

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Online Players</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {!users && (
            <p>There are currently no online users. Try to refresh?</p>
          )}
          {users && users.length < 1 && (
            <p>You're the only person online! You can't play with yourself.</p>
          )}
          {options}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Online
