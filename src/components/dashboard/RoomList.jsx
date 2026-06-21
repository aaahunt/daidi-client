import { useSelector } from "react-redux"
import { generatePath } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/esm/Button"

import { roomsSelector } from "modules/app/selectors"

import config from "config"
import { useNavigate } from "react-router-dom"

const RoomList = () => {
  const navigate = useNavigate()
  const rooms = useSelector(roomsSelector)

  if (rooms.length === 0) return <p>{config.MESSAGE.ROOMS.NONE}</p>

  return Object.entries(rooms).map(([room, game]) => (
    <ListGroup.Item key={room}>
      {room} {game?.players ?? 0}/4
      <Button
        onClick={() => navigate(generatePath(config.URL.ROOM, { id: room }))}
        type="button"
        className="btn btn-warning m-1"
      >
        Open
      </Button>
    </ListGroup.Item>
  ))
}

export { RoomList }
