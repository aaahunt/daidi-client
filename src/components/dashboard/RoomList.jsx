import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/esm/Button"

const config = require("../../config")

const RoomList = ({ rooms, joinRoom }) => {
  if (!rooms) return <p>{config.MESSAGE.ROOMS.NONE}</p>

  return Object.entries(rooms).map(([room, game]) => (
    <ListGroup.Item key={room}>
      {room} {game?.players?.filter((p) => p !== null).length}/4
      {game?.players?.map((player, i) => {
        if (player === null) {
          return (
            <Button key={i} size="sm" className="ms-1" onClick={() => joinRoom(room, i)} style={{ float: "right" }}>
              Join Seat {i + 1}
            </Button>
          )
        } else {
          return (
            <Button key={i} size="sm" className="ms-1" style={{ float: "right", backgroundColor: "gray" }}>
              {player.username}
            </Button>
          )
        }
      })}
    </ListGroup.Item>
  ))
}

export { RoomList }
