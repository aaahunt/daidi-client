import React from "react"
import { Switch, Route, withRouter, Redirect } from "react-router-dom"

// Axios library for simplified HTTP requests
import axios from "axios"

// Config vars
import { LOGIN_URL, DASHBOARD_URL, SERVER_URL, GAME_URL } from "./config"
import { SocketContext } from "./context/socket"

// Components
import Home from "./components/Home"
import Rules from "./components/Rules"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import Game from "./components/Game"
import Navigation from "./components/Navigation"

const initState = {
  username: null,
  id: null,
  opponent: null,
  error: null,
  challenge: null,
  message: null,
}

class App extends React.Component {
  // Retrieve our socket from context
  static contextType = SocketContext
  socket = this.context

  // Initialise our state
  state = initState

  componentDidMount() {
    // Upon component refresh fetch user ID and challenge from session storage
    this.setStateUsingCookies()

    // Handle incoming challenge
    this.socket.on("incoming challenge", this.handleIncomingChallenge)

    // If challenger accepts, start the game
    this.socket.on("accepted", this.startGame)

    // If challenge is declined, inform the challenger
    this.socket.on("declined", () => {
      this.setState({
        message: {
          header: "Decline",
          body: "Your opponent declined your challenge.",
        },
      })
    })

    // If the server goes down, log us out
    this.socket.on("disconnect", this.userLogout)
  }

  // Housekeeping, remove socket listeners upon component end of lifecycle
  componentWillUnmount() {
    this.socket.offAny()
  }

  // Handle user registration request
  userRegister = (event) => {
    event.preventDefault()
    let username = event.target.username.value
    let password = event.target.password.value

    if (username.length < 3) {
      this.setState({ error: "Username too short" })
      return
    }
    const regex = new RegExp(
      "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
    )
    if (!regex.test(password)) {
      this.setState({ error: "Password is too weak" })
      return
    }

    axios
      .post(SERVER_URL + "/register", { username, password })
      .then((res) => {
        sessionStorage.setItem("user", res.data.user._id)
        this.setState({ username, id: res.data.user._id, error: null }, () => {
          this.props.history.push({
            pathname: DASHBOARD_URL,
            state: this.state,
          })
        })
      })
      .catch((err) => {
        this.setState({ error: "That username is taken. Try another." })
      })
  }

  // Handle user login request
  userLogin = (event) => {
    event.preventDefault()
    let username = event.target.username.value
    let password = event.target.password.value

    axios
      .post(SERVER_URL + "/login", { username, password })
      .then((res) => {
        if (!res.data.user) {
          this.setState({ error: res.data })
          return
        }

        this.socket.auth = { username, id: res.data.user._id }
        this.socket.connect()

        this.socket.on("connect_error", (err) => {
          if (err.message === "invalid username") {
            console.log("Invalid username")
          }
        })

        sessionStorage.setItem("user", res.data.user._id)
        this.setState({ username, id: res.data.user._id, error: null }, () => {
          this.props.history.push({ DASHBOARD_URL }, { state: this.state })
        })
      })
      .catch((err) => {
        this.setState({
          error: "A server error has occured. Please try again later.",
        })
      })
  }

  // Handle user logout
  userLogout = () => {
    this.socket.emit("logout")
    this.socket.disconnect()
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("challengeID")
    sessionStorage.removeItem("challengeUser")
    this.setState({ id: null, username: null, challenge: null }, () => {
      this.props.history.push({ LOGIN_URL })
    })
  }

  // Retrieve user ID and challenges from session memory
  setStateUsingCookies = () => {
    if (this.state.id !== null) return

    const user = sessionStorage.getItem("user")
    if (!user) return

    // If we stored the user ID, get remaining user information
    axios
      .get(SERVER_URL + "/user?id=" + user)
      .then((res) => {
        this.setState({
          id: res.data[0]._id,
          username: res.data[0].username,
        })
        this.socket.auth = {
          id: res.data[0]._id,
          username: res.data[0].username,
        }
        this.socket.connect()
      })
      .catch((err) => {
        console.log(err)
      })

    // If they have a challenge, retrieve it from cookies
    const challengeID = sessionStorage.getItem("challengeID")
    const challengeUser = sessionStorage.getItem("challengeUser")

    if (challengeID && challengeUser)
      this.setState({
        challenge: {
          id: challengeID,
          username: challengeUser,
        },
      })
  }

  // Handle a challenge offer to ID
  challengeUser = (id) => {
    this.socket.emit("challenge", id, (response) => {
      if (response === "offline") {
        this.setState({
          message: {
            header: "Error",
            body: "That user appears to be offline. Please try again.",
          },
        })
      } else {
        this.setState({
          message: {
            header: "Success",
            body: "Challenge sent.",
          },
        })
      }
    })
  }

  // Handle incmoming challenge from socket
  handleIncomingChallenge = (id, username) => {
    sessionStorage.setItem("challengeID", id)
    sessionStorage.setItem("challengeUser", username)
    this.setState({ challenge: { id, username } })
  }

  // Handle a challenge decline
  declineChallenge = () => {
    this.socket.emit("decline", this.state.challenge.id)
    this.removeChallenge()
  }

  // Handle a challenge accept and start game
  acceptChallenge = () => {
    this.socket.emit("accept", this.state.challenge.id, (response) => {
      this.startGame(response)
    })
  }

  // Clear message box
  clearMessage = () => {
    this.setState({ message: null })
  }

  // Use response from server (hands and first player) to begin a new game
  startGame = (response) => {
    this.removeChallenge()
    this.props.history.push({
      pathname: GAME_URL,
      state: response,
    })
  }

  // Remove challenge from state and session memory
  removeChallenge = () => {
    this.setState({ challenge: null })
    sessionStorage.removeItem("challengeID")
    sessionStorage.removeItem("challengeUser")
  }

  render() {
    return (
      <React.Fragment>
        {this.props.location.pathname !== "/play" && (
          <Navigation
            {...this.state}
            {...this.props}
            handleLogout={this.userLogout}
          />
        )}
        <Switch>
          <Route exact path="/">
            <Home {...this.props} state={this.state} />
          </Route>

          <Route path="/login">
            {!(this.state.id === null) ? (
              <Redirect to="/dashboard" />
            ) : (
              <Login
                {...this.props}
                state={this.state}
                handleSubmit={this.userLogin}
              />
            )}
          </Route>

          <Route path="/register">
            {!(this.state.id === null) === null ? (
              <Redirect to="/dashboard" />
            ) : (
              <Register
                {...this.props}
                state={this.state}
                handleSubmit={this.userRegister}
              />
            )}
          </Route>

          <Route path="/rules">
            <Rules />
          </Route>

          <Route path="/dashboard">
            {this.state.id === null ? (
              <Redirect to="/login" />
            ) : (
              <Dashboard
                {...this.props}
                state={this.state}
                handleChallenge={this.challengeUser}
                acceptChallenge={this.acceptChallenge}
                declineChallenge={this.declineChallenge}
                clearMessage={this.clearMessage}
              />
            )}
          </Route>

          <Route path="/play">
            {this.state.id === null ? (
              <Redirect to="/login" />
            ) : (
              <Game {...this.props} state={this.state} />
            )}
          </Route>
        </Switch>
      </React.Fragment>
    )
  }
}

export default withRouter(App)
