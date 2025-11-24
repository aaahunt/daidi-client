import { useSelector, useDispatch } from "react-redux"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/esm/Button"

import { roomList } from "modules/app/selectors"
import { joinRoom } from "modules/app/actions"

import config from "config"

const RoomList = () => {
  const dispatch = useDispatch()
  const rooms = useSelector(roomList)

  const attemptJoin = (room, seat) => {
    dispatch(joinRoom({ room, seat }))
  }

  if (rooms.length === 0) return <p>{config.MESSAGE.ROOMS.NONE}</p>

  return Object.entries(rooms).map(([id, room]) => (
    <ListGroup.Item key={id}>
      {id} {Object.values(room?.seats).filter((p) => p !== null).length}/4
      {Object.entries(room?.seats).map(([seatNumber, player]) => {
        if (player === null) {
          return (
            <Button
              key={seatNumber}
              size="sm"
              className="ms-1"
              onClick={() => attemptJoin(id, seatNumber)}
              style={{ float: "right" }}
            >
              Join Seat {seatNumber}
            </Button>
          )
        } else {
          return (
            <Button
              key={player.username}
              size="sm"
              className="ms-1"
              style={{ float: "right", backgroundColor: "gray" }}
            >
              {player.username}
            </Button>
          )
        }
      })}
    </ListGroup.Item>
  ))
}

export { RoomList }
