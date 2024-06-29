import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { SocketContext, connectSocket } from "../../context/socket"
import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import { RoomList } from "./RoomList"
import { GameList } from "./GameList"

import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"

const Dashboard = () => {
  const socket = useContext(SocketContext)
  const navigate = useNavigate()
  const auth = useAuthUser()
  const isAuthenticated = useIsAuthenticated()
  const authHeader = useAuthHeader()
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    if (!isAuthenticated) navigate("/login")
    connectSocket(authHeader)

    socket.on("rooms", (rooms) => setRooms(rooms))

    return () => {
      socket.offAny()
    }
  })

  // const joinRoom = (roomName) => {
  //   socket.emit("joinRoom", roomName, (rooms) => {
  //     setRooms(rooms)
  //   })
  // }

  let socketStatus = socket.connected ? "online" : "offline"
  return (
    <Container className="position-relative">
      <div className="p-5 mb-4">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Dashboard</h1>
          <h3>
            Welcome, {auth.username}
            <img
              src={`${socketStatus}.svg`}
              alt={socketStatus}
              title={socketStatus}
            />
          </h3>

          <h2>Rooms</h2>
          <ListGroup>
            <RoomList rooms={rooms} />
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
