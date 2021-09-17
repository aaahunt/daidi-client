import React from "react"
import axios from "axios"

// Config vars
import { SERVER_URL } from "../config"
import { SocketContext } from "../context/socket"

// Bootstrap components
import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"

class Dashboard extends React.Component {
  static contextType = SocketContext
  socket = this.context

  state = {
    ...this.props.state,
    games: null,
    onlineUsers: null,
  }

  componentDidMount() {
    let id = this.state.id
    axios.get(SERVER_URL + "/games?id=" + id).then((res) => {
      this.setState({ games: res.data })
    })

    this.socket.on("users", (users) => {
      let onlineUsers = users.filter((a) => a.userID !== id)
      onlineUsers = onlineUsers.sort((a, b) => {
        return a.username - b.username
      })
      if (onlineUsers.length > 0) this.setState({ onlineUsers })
    })

    this.socket.on("user connected", (user) => {
      if (this.state.onlineUsers) {
        let userExists = this.state.onlineUsers.find(
          (el) => el.userID === user.userID
        )
        if (userExists) return
      }
      this.setState({
        onlineUsers: [...(this.state.onlineUsers || []), user],
      })
    })
  }

  componentWillUnmount() {
    this.socket.offAny()
  }

  render() {
    let socketStatus = this.socket.connected ? "online" : "offline"
    return (
      <Container>
        <h1>Dashboard</h1>
        <p>
          Welcome, {this.state.username}
          <img
            src={`${socketStatus}.svg`}
            alt={socketStatus}
            title={socketStatus}
          />
        </p>

        <h2>Online Players</h2>
        <OnlinePlayers
          users={this.state.onlineUsers}
          handleChallenge={this.props.handleChallenge}
          id={this.state.id}
        />

        <h2>Previous games</h2>
        <GameList
          games={this.state.games}
          handleChallenge={this.props.handleChallenge}
        />
      </Container>
    )
  }
}

const GameList = ({ games, handleChallenge }) => {
  if (!games) return <p>No active games</p>
  return games.map((game) => (
    <div key={game.opponent_id}>
      {game.opponent_name} ({game.opponent_score} : {game.our_score}){" "}
      <button
        className="btn btn-primary"
        onClick={() => handleChallenge(game.opponent_id)}
      >
        Challenge
      </button>
    </div>
  ))
}

const OnlinePlayers = ({ users, handleChallenge, id }) => {
  if (!users) return <p>No online users</p>
  users = users.filter((user) => user.userID !== id)

  // Making sure we're not the only one online
  if (users.length < 1)
    return <p>You're the only person online! You can't play with yourself.</p>

  const options = users.map((user) => (
    <option key={user.userID} value={user.userID}>
      {user.username}
    </option>
  ))
  return (
    <Form id="onlineUsers">
      <Form.Select id="userToChallenge" htmlSize="8">
        {options}
      </Form.Select>
      <Button
        variant="primary"
        type="submit"
        className="mt-1"
        onClick={handleChallenge}
      >
        Challenge
      </Button>
    </Form>
  )
}

export default Dashboard
