import { useSelector } from "react-redux"
import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import { RoomList } from "./RoomList"
import { GameList } from "./GameList"

import { isAuthenticatedSelector } from "modules/authentication/selectors"
import { connectedSelector } from "modules/socket/selectors"
import Loading from "components/control/Loading"

const Dashboard = () => {
  const authenticated = useSelector(isAuthenticatedSelector)
  const socketConnected = useSelector(connectedSelector)

  if (!authenticated) return <Loading />

  let socketStatus = socketConnected ? "online" : "offline"
  return (
    <Container className="position-relative">
      <div className="p-5 mb-4">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Dashboard</h1>
          <h3>
            {/* Welcome, {auth.username} */}
            <img src={`${socketStatus}.svg`} alt={socketStatus} title={socketStatus} />
          </h3>

          <h2>Rooms</h2>
          <ListGroup>
            <RoomList />
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
