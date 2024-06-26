import React from "react"

// Socket IO Context
import { SocketContext } from "../../context/socket"

// Components
import Notifications from "../notifications/Notifications"
import Online from "./Online"

// Bootstrap components
import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/esm/Button"

// Axios for API requests
import server from "../../context/serverInstance"

// Config vars
const config = require("../../config")

class Dashboard extends React.Component {
  // Retrieve socketIO object from context
  static contextType = SocketContext
  socket = this.context

  state = {
    ...this.props.state,
    games: null,
    rooms: null,
    in: null,
    onlineUsers: null,
    showChallenge: false,
  }

  componentDidMount() {
    // Fetch list of user's previous games
    server.get("/auth/games?id=" + this.props.state.user_id).then((res) => {
      this.setState({ games: res.data })
    })

    // Add socket listeners
    this.socket.on("users", this.handleUserList)
    this.socket.on("user connected", this.handleNewUser)
  }

  // Housekeeping, remove socket listeners upon component end of lifecycle
  componentWillUnmount() {
    this.socket.offAny()
  }

  // When we first login the server will send us a list of online users, handle the list
  handleUserList = (users, rooms) => {
    let id = this.props.state.user_id

    // Remove us from the list
    let onlineUsers = users.filter((each) => each.user_id !== id)

    // Check for duplicates & remove them
    onlineUsers = Array.from(new Set(onlineUsers.map((a) => a.user_id))).map(
      (id) => {
        return onlineUsers.find((a) => a.user_id === id)
      }
    )

    // Exit if no users
    if (onlineUsers.length < 1) return

    // Sort list alphabetically
    onlineUsers = onlineUsers.sort((a, b) => {
      return a.username - b.username
    })

    // Set list of users into state
    if (onlineUsers.length > 0) this.setState({ onlineUsers })
    if (rooms.length > 0) this.setState({ rooms })
  }

  // Handle socket notification that a new user has logged in
  handleNewUser = (user) => {
    let userExists = false

    // Check if user is already in our list
    if (this.state.onlineUsers) {
      userExists = this.state.onlineUsers.find(
        (each) => each.user_id === user.user_id
      )
    }

    if (userExists) return

    // Add user to our list in state
    this.setState({
      onlineUsers: [...(this.state.onlineUsers || []), user],
    })
  }

  createRoom = () => {
    this.socket.emit("createRoom", (roomName, rooms) => {
      this.setState({ rooms, in: roomName })
    })
  }

  joinRoom = (roomName) => {
    this.socket.emit("joinRoom", roomName, (rooms) => {
      this.setState({ rooms })
    })
  }

  render() {
    let socketStatus = this.socket.connected ? "online" : "offline"
    return (
      <Container className="position-relative">
        <Notifications
          message={this.props.state.message}
          clearMessage={this.props.clearMessage}
          challenge={this.props.state.challenge}
          acceptChallenge={this.props.acceptChallenge}
          declineChallenge={this.props.declineChallenge}
        >
          {this.props.state.challenge &&
            this.props.state.challenge.username +
              config.MESSAGE.CHALLENGE.INCOMING}
        </Notifications>

        <div className="p-5 mb-4">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">Dashboard</h1>
            <h3>
              Welcome, {this.state.username}
              <img
                src={`${socketStatus}.svg`}
                alt={socketStatus}
                title={socketStatus}
              />
            </h3>

            <Online
              users={this.state.onlineUsers}
              games={this.state.games}
              handleChallenge={this.props.handleChallenge}
              id={this.state.user_id}
            />

            <h2>Rooms</h2>
            <ListGroup>
              <RoomList
                rooms={this.state.rooms}
                joinRoom={this.joinRoom}
                inRoom={this.state.in}
              />
            </ListGroup>
            <Button size="sm" className="ms-1" onClick={this.createRoom}>
              Create room
            </Button>

            <h2>Previous Games</h2>
            <ListGroup>
              <GameList games={this.state.games} />
            </ListGroup>
          </div>
        </div>
      </Container>
    )
  }
}

const GameList = ({ games }) => {
  if (!games) return <p>{config.MESSAGE.GAMES.NONE}</p>
  return games.map((game) => (
    <ListGroup.Item
      key={game.opponent_id}
      variant={game.our_score > game.opponent_score ? "success" : "danger"}
    >
      {game.opponent_name} ({game.opponent_score}) - ({game.our_score})
    </ListGroup.Item>
  ))
}

const RoomList = ({ rooms, joinRoom, inRoom }) => {
  if (!rooms) return <p>{config.MESSAGE.ROOMS.NONE}</p>
  return rooms.map((room) => (
    <ListGroup.Item key={room.name}>
      {room.name}
      {!(inRoom !== room.name) && (
        <Button size="sm" className="ms-1" onClick={() => joinRoom(room.name)}>
          Join
        </Button>
      )}
    </ListGroup.Item>
  ))
}

export default Dashboard
