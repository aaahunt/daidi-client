import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Button from "react-bootstrap/esm/Button"

import config from "config"

import Board from "components/game/Board"
import { joinRoom, leaveRoom } from "modules/app/actions"
import { roomList } from "modules/app/selectors"

const Room = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const rooms = useSelector(roomList)
  const room = rooms[id]

  const attemptJoin = (room, seat) => {
    dispatch(joinRoom({ room, seat }))
  }

  const standUp = (room, seat) => {
    dispatch(leaveRoom())
  }

  if (!room) return

  return (
    <div>
      <h1>Room {id}</h1>
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
      {/* <Opponent /> */}
      <Board board={[]} history={[]} error={null} />
      <Button className="ms-1" onClick={() => standUp()}>
        Leave game
      </Button>
      <Button className="ms-1" onClick={() => navigate(config.URL.DASHBOARD)}>
        Back to dashboard
      </Button>
    </div>
  )
}

export default Room
