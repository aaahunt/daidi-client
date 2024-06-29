import { useState } from "react"

import Offcanvas from "react-bootstrap/Offcanvas"
import Button from "react-bootstrap/Button"

const config = require("../../config")

const Online = ({ users, games, handleChallenge, id }) => {
  const [showPanel, setShowPanel] = useState(false)

  const handleClose = () => setShowPanel(false)
  const handleShow = () => setShowPanel(true)

  let options = null
  if (users) {
    if (games) {
      users.forEach((user) => {
        games.forEach((game) => {
          if (game.opponent_id === user.user_id) {
            user.hasHistory = true
            user.opponent_score = game.opponent_score
            user.our_score = game.our_score
          }
        })
      })
    }
    options = users.map((user) => (
      <div key={user.user_id} value={user.user_id}>
        {user.username}{" "}
        {user.hasHistory &&
          "(" + user.our_score + "-" + user.opponent_score + ")"}
        <Button
          size="sm"
          className="ms-1"
          onClick={() => {
            handleChallenge(user.user_id)
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
