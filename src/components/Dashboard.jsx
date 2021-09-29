import React from "react"
import axios from "axios"

// Config vars
import { SERVER_URL } from "../config"
import { SocketContext } from "../context/socket"

// Components
import Notifications from "./notifications/Notifications"
import Online from "./Online"

// Bootstrap components
import Container from "react-bootstrap/Container"
import ListGroup from "react-bootstrap/ListGroup"

class Dashboard extends React.Component {
  static contextType = SocketContext
  socket = this.context

  state = {
    ...this.props.state,
    games: null,
    onlineUsers: null,
    showChallenge: false,
  }

  componentDidMount() {
    // Fetch list of previous games
    let id = this.props.state.id
    axios.get(SERVER_URL + "/games?id=" + id).then((res) => {
      this.setState({ games: res.data })
    })

    // Add socket listeners
    this.socket.on("users", this.handleUserList)
    this.socket.on("user connected", this.handleNewUser)
  }

  componentWillUnmount() {
    this.socket.offAny()
  }

  handleUserList = (users) => {
    let id = this.props.state.id

    // Remove us
    let onlineUsers = users.filter((each) => each.userID !== id)

    // Check for duplicates
    onlineUsers = Array.from(new Set(onlineUsers.map((a) => a.userID))).map(
      (id) => {
        return onlineUsers.find((a) => a.userID === id)
      }
    )
    // Sort alphabetically
    onlineUsers = onlineUsers.sort((a, b) => {
      return a.username - b.username
    })
    if (onlineUsers.length > 0) this.setState({ onlineUsers })
  }

  handleNewUser = (user) => {
    let userExists
    if (this.state.onlineUsers) {
      userExists = this.state.onlineUsers.find(
        (each) => each.userID === user.userID
      )
    }
    if (userExists) return
    this.setState({
      onlineUsers: [...(this.state.onlineUsers || []), user],
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
          {this.props.state.challenge && this.props.state.challenge.username}{" "}
          has challenged you. What do you say?
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
              handleChallenge={this.props.handleChallenge}
              id={this.state.id}
            />

            <h2>Previous Games</h2>
            <ListGroup>
              <GameList
                games={this.state.games}
                handleChallenge={this.props.handleChallenge}
              />
            </ListGroup>
          </div>
        </div>
      </Container>
    )
  }
}

const GameList = ({ games, handleChallenge }) => {
  if (!games) return <p>You haven't played any games yet.</p>
  return games.map((game) => (
    <ListGroup.Item
      key={game.opponent_id}
      variant={game.our_score > game.opponent_score ? "success" : "danger"}
    >
      {game.opponent_name} ({game.opponent_score}) - ({game.our_score})
    </ListGroup.Item>
  ))
}

export default Dashboard
