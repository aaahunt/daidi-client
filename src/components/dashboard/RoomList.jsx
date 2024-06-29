import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/esm/Button"

const config = require("../../config")

const RoomList = ({ rooms, joinRoom }) => {
  const navigate = useNavigate()

  joinRoom = (roomName) => {
    navigate(`/room/${roomName}`)
  }

  if (!rooms) return <p>{config.MESSAGE.ROOMS.NONE}</p>
  return rooms.map((room) => (
    <ListGroup.Item key={room.name}>
      {room.name} {room.players.length}/4
      <Button
        size="sm"
        className="ms-1"
        onClick={() => joinRoom(room.name)}
        style={{ float: "right" }}
      >
        Open
      </Button>
    </ListGroup.Item>
  ))
}

export { RoomList }
