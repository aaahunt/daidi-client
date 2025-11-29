import { useSelector } from "react-redux"
import { useNavigate, generatePath } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/esm/Button"

import { roomList } from "modules/app/selectors"

import config from "config"

const RoomList = () => {
  const navigate = useNavigate()
  const rooms = useSelector(roomList)

  if (rooms.length === 0) return <p>{config.MESSAGE.ROOMS.NONE}</p>

  return Object.entries(rooms).map(([id, room]) => (
    <ListGroup.Item key={id}>
      {id} {Object.values(room?.seats).filter((p) => p !== null).length}/4
      <Button
        onClick={() => navigate(generatePath(config.URL.ROOM, { id }))}
        type="button"
        className="btn btn-warning m-1"
      >
        Open
      </Button>
    </ListGroup.Item>
  ))
}

export { RoomList }
