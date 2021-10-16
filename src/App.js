import React from "react"

// React Router DOM for links/routing
import { Switch, Route, withRouter, Redirect } from "react-router-dom"

// Axios library for simplified HTTP requests
import axios from "axios"

// Socket IO Context
import { SocketContext } from "./context/socket"

// Components used within App
import Home from "./components/Home"
import Rules from "./components/Rules"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import Game from "./components/Game"
import Navigation from "./components/Navigation"

// Config vars
const config = require("./config")

class App extends React.Component {
  // Retrieve socketIO object from context
  static contextType = SocketContext
  socket = this.context

  // Initialise our state
  state = config.APP_INIT_STATE

  componentDidMount() {
    // Upon component refresh fetch user ID and challenge from session storage
    this.setStateUsingCookies()

    // Add socket listeners
    this.socket.on("challenge", this.handleIncomingChallenge)
    this.socket.on("accepted", this.startGame)
    this.socket.on("disconnect", this.userLogout)
    this.socket.on("decline", this.opponentDeclined)
  }

  // Housekeeping, remove socket listeners upon component end of lifecycle
  componentWillUnmount() {
    this.socket.offAny()
  }

  // Inform user that the opponent declined their challenge
  opponentDeclined = () => {
    this.setState({ message: config.MESSAGE.DECLINE })
  }

  // Handle user registration request
  userRegister = (event) => {
    let [username, password] = this.formInit(event)

    if (username.length < 3)
      return this.setState({ error: config.MESSAGE.ERROR.USER_SHORT })

    const regex = new RegExp(config.GAME.PASS_REGEX)

    if (!regex.test(password)) {
      this.setState({ error: config.MESSAGE.ERROR.PASSWORD })
      return
    }

    axios
      .post(config.URL.SERVER + "/register", { username, password })
      .then((res) => {
        sessionStorage.setItem("user", res.data.user._id)
        this.setState({ username, id: res.data.user._id, error: null }, () => {
          this.props.history.push({
            pathname: config.URL.DASHBOARD,
            state: this.state,
          })
        })
      })
      .catch((err) => {
        this.setState({ error: config.MESSAGE.ERROR.TAKEN })
      })
  }

  // Handle user login request
  userLogin = (event) => {
    let [username, password] = this.formInit(event)

    axios
      .post(config.URL.SERVER + "/login", { username, password })
      .then((res) => {
        if (!res.data.user) {
          this.setState({ error: res.data })
          return
        }

        this.socket.auth = { username, id: res.data.user._id }
        this.socket.connect()

        this.socket.on("connect_error", (err) => {
          if (err.message === "invalid username") {
            this.setState({ error: config.MESSAGE.ERROR.USER_INVALID })
          }
        })

        sessionStorage.setItem("user", res.data.user._id)
        this.setState({ username, id: res.data.user._id, error: null }, () => {
          this.props.history.push(config.URL.DASHBOARD, { state: this.state })
        })
      })
      .catch((err) => {
        this.setState({
          error: config.MESSAGE.ERROR.SERVER,
        })
      })
  }

  formInit = (event) => {
    event.preventDefault()
    return [event.target.username.value, event.target.password.value]
  }

  // Handle user logout
  userLogout = () => {
    this.socket.disconnect()
    sessionStorage.removeItem("user")
    this.removeChallenge()
    this.setState({ id: null, username: null }, () => {
      this.props.history.push(config.URL.LOGIN)
    })
  }

  // Retrieve user ID and challenges from session memory
  setStateUsingCookies = () => {
    if (this.state.id !== null) return

    const user = sessionStorage.getItem("user")
    if (!user) return

    // If we stored the user ID, get remaining user information
    axios
      .get(config.URL.SERVER + "/user?id=" + user)
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

    this.getChallenge()
  }

  getChallenge = () => {
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
    this.socket.emit("challenge", id, (res) => {
      this.setState({
        message: res,
      })
    })
  }

  // Handle incmoming challenge from socket
  handleIncomingChallenge = (id, username) => {
    sessionStorage.setItem("challengeID", id)
    sessionStorage.setItem("challengeUser", username)
    this.setState({ challenge: { id, username } })
  }

  // Emit a challenge decline
  declineChallenge = () => {
    this.socket.emit("action", "decline", this.state.challenge.id)
    this.removeChallenge()
  }

  // Emit an acceptance and start game
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

    this.setState({ message: null })

    this.props.history.push({
      pathname: config.URL.GAME,
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
    const gameState = JSON.parse(sessionStorage.getItem("game"))

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
            ) : gameState !== null ? (
              <Redirect to="/play" />
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
