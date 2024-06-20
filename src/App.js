import React, { useEffect, useContext, useState } from "react"
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom"
import axios from "axios"
import { SocketContext } from "./context/socket"
import Home from "./components/Home"
import Rules from "./components/Rules"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import Game from "./components/Game"
import Navigation from "./components/Navigation"
import config from "./config"

const App = () => {
  const socket = useContext(SocketContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState(config.APP_INIT_STATE)

  useEffect(() => {
    setStateUsingCookies()

    socket.on("challenge", handleIncomingChallenge)
    socket.on("accepted", startGame)
    socket.on("disconnect", userLogout)
    socket.on("decline", opponentDeclined)

    return () => {
      socket.offAny()
    }
  })

  const updateState = (newState) => {
    setState((prevState) => ({ ...prevState, ...newState }))
  }

  const setError = (error) => {
    setState((prevState) => ({ ...prevState, error }))
  }

  const opponentDeclined = () => {
    updateState({ message: config.MESSAGE.DECLINE })
  }

  const userRegister = (event) => {
    let [username, password] = formInit(event)

    if (username.length < 3) {
      setError(config.MESSAGE.ERROR.USER_SHORT)
      return
    }

    const regex = new RegExp(config.GAME.PASS_REGEX)

    if (!regex.test(password)) {
      setError(config.MESSAGE.ERROR.PASSWORD)
      return
    }

    axios
      .post(config.URL.SERVER + "/register", { username, password })
      .then((res) => {
        sessionStorage.setItem("user", res.data.user._id)
        updateState({ username, id: res.data.user._id, error: null })
      })
      .catch(() => {
        setError(config.MESSAGE.ERROR.TAKEN)
      })
  }

  const userLogin = (event) => {
    let [username, password] = formInit(event)

    event.target[event.target.length - 1].disabled = true

    axios
      .post(config.URL.SERVER + "/login", { username, password })
      .then((res) => {
        if (!res.data.user) {
          updateState({ error: res.data, username: null, id: null })
          event.target[event.target.length - 1].disabled = false
          return
        }

        socket.auth = { username, id: res.data.user._id }
        socket.connect()

        socket.on("connect_error", (err) => {
          if (err.message === "invalid username") {
            updateState({ error: config.MESSAGE.ERROR.USER_INVALID })
            event.target[event.target.length - 1].disabled = false
          }
        })

        sessionStorage.setItem("user", res.data.user._id)
        updateState({ username, id: res.data.user._id, error: null })
      })
      .catch(() => {
        console.log("Server error")
        updateState({ error: config.MESSAGE.ERROR.SERVER })
      })
  }

  const formInit = (event) => {
    event.preventDefault()
    return [event.target.username.value, event.target.password.value]
  }

  const userLogout = () => {
    socket.disconnect()
    sessionStorage.removeItem("user")
    removeChallenge()
    setState(config.APP_INIT_STATE)
  }

  const setStateUsingCookies = () => {
    if (state.id !== null) return

    const user = sessionStorage.getItem("user")
    if (!user) return

    axios
      .get(config.URL.SERVER + "/user?id=" + user)
      .then((res) => {
        updateState({ id: res.data[0]._id, username: res.data[0].username })
        socket.auth = {
          id: res.data[0]._id,
          username: res.data[0].username,
        }
        socket.connect()
      })
      .catch(console.log)

    getChallenge()
  }

  const getChallenge = () => {
    const challengeID = sessionStorage.getItem("challengeID")
    const challengeUser = sessionStorage.getItem("challengeUser")

    if (challengeID && challengeUser)
      updateState({ challenge: { id: challengeID, username: challengeUser } })
  }

  const challengeUser = (id) => {
    socket.emit("challenge", id, (res) => {
      updateState({ message: res })
    })
  }

  const handleIncomingChallenge = (id, username) => {
    sessionStorage.setItem("challengeID", id)
    sessionStorage.setItem("challengeUser", username)
    updateState({ challenge: { id, username } })
  }

  const declineChallenge = () => {
    socket.emit("action", "decline", state.challenge.id)
    removeChallenge()
  }

  const acceptChallenge = () => {
    socket.emit("accept", state.challenge.id, (response) => {
      startGame(response)
    })
  }

  const clearMessage = () => {
    updateState({ message: null })
  }

  const startGame = (response) => {
    console.log("Starting game", response)
    removeChallenge()
    setState((prevState) => {
      const newState = { ...prevState, ...response, challenge: null }
      console.log("Navigating to game", newState)
      navigate(config.URL.GAME, { state: newState })
      return newState
    })

    // navigate(config.URL.GAME, state)
  }

  const removeChallenge = () => {
    updateState({ challenge: null })
    sessionStorage.removeItem("challengeID")
    sessionStorage.removeItem("challengeUser")
  }

  const gameState = JSON.parse(sessionStorage.getItem("game"))

  return (
    <React.Fragment>
      {location.pathname !== "/play" && (
        <Navigation {...state} handleLogout={userLogout} />
      )}
      <Routes>
        <Route path="/" element={<Home state={state} />} />

        <Route
          path="/login"
          element={
            state.id !== null ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login state={state} handleSubmit={userLogin} />
            )
          }
        />

        <Route
          path="/register"
          element={
            state.id !== null ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register state={state} handleSubmit={userRegister} />
            )
          }
        />

        <Route path="/rules" element={<Rules />} />

        <Route
          path="/dashboard"
          element={
            state.id === null ? (
              <Navigate to="/login" />
            ) : gameState !== null ? (
              <Navigate to="/play" />
            ) : (
              <Dashboard
                state={state}
                handleChallenge={challengeUser}
                acceptChallenge={acceptChallenge}
                declineChallenge={declineChallenge}
                clearMessage={clearMessage}
              />
            )
          }
        />

        <Route
          path="/play"
          element={
            state.id === null ? (
              <Navigate to="/login" />
            ) : (
              <Game state={state} />
            )
          }
        />
      </Routes>
    </React.Fragment>
  )
}

export default App
