import { useDispatch, useSelector } from "react-redux"
import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import { RoomList } from "./RoomList"
import { GameList } from "./GameList"

import { isAuthenticatedSelector } from "modules/authentication/selectors"
import { connectedSelector } from "modules/socket/selectors"
import Loading from "components/control/Loading"
import { leaveRoom } from "modules/socket/actions"

const Dashboard = () => {
  const dispatch = useDispatch()
  const authenticated = useSelector(isAuthenticatedSelector)
  const socketConnected = useSelector(connectedSelector)
  const socketStatus = socketConnected ? "online" : "offline"

  const leaveGame = () => {
    dispatch(leaveRoom())
  }

  if (!authenticated) return <Loading />

  return (
    <Container className="position-relative">
      <div className="p-5 mb-4">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">
            Dashboard <img src={`${socketStatus}.svg`} alt={socketStatus} title={socketStatus} />
          </h1>

          <h2>Rooms</h2>
          <ListGroup>
            <RoomList />
            <button onClick={leaveGame}>leave game</button>
          </ListGroup>

          <h2>Previous Games</h2>
          <ListGroup>
            <GameList />
          </ListGroup>
        </div>
      </div>
    </Container>
  )
}

export default Dashboard
