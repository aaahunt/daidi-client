import React, { useEffect, useContext, useState } from "react"
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom"
import { SocketContext } from "./context/socket"

// Components used within App
import Home from "./components/pages/Home"
import Rules from "./components/pages/Rules"
import Login from "./components/pages/Login"
import Register from "./components/pages/Register"
import Dashboard from "./components/dashboard/Dashboard"
import Game from "./components/game/Game"
import Navigation from "./components/Navigation"

import config from "./config"
import server from "./context/serverInstance"

const App = () => {
  const socket = useContext(SocketContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState(config.APP_INIT_STATE)

  useEffect(() => {
    setStateUsingCookies()
  }, [])

  useEffect(() => {
    socket.on("challenge", handleIncomingChallenge)
    socket.on("accepted", startGame)
    socket.on("disconnect", userLogout)
    socket.on("decline", opponentDeclined)

    return () => {
      socket.offAny()
    }
  }, [socket])

  const updateState = (newState) => {
    setState((prevState) => ({ ...prevState, ...newState }))
  }

  const setError = (error) => {
    setState((prevState) => ({ ...prevState, error }))
  }

  const clearError = () => {
    setError(null)
  }

  const opponentDeclined = () => {
    updateState({ message: config.MESSAGE.DECLINE })
  }

  const userRegister = (event, passwordStrength) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    if (username.length < 3) {
      setError(config.MESSAGE.ERROR.USER_SHORT)
      return
    }

    if (passwordStrength < config.PASSWORD_STRENGTH.MIN_STRENGTH) {
      setError(config.MESSAGE.ERROR.PASSWORD)
      return
    }

    clearError()

    server
      .post("/register", { username, password })
      .then(userLogin(username, password))
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setError(config.MESSAGE.ERROR.TAKEN)
        } else {
          setError(config.MESSAGE.ERROR.SERVER)
        }
      })
  }

  const handleLogin = (event) => {
    event.preventDefault()
    userLogin(event.target.username.value, event.target.password.value)
  }

  const authSocket = (username, user_id, access_token) => {
    socket.auth = { username, user_id, access_token }
    socket.connect()
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        updateState({ error: config.MESSAGE.ERROR.USER_INVALID })
      }
    })
  }

  const userLogin = (username, password) => {
    server
      .post("/login", { username, password })
      .then((res) => {
        if (!res.data.access_token) {
          updateState({ error: res.data, username: null, user_id: null })
          return
        }

        localStorage.setItem("access_token", res.data.access_token)
        authSocket(username, res.data.user_id, res.data.access_token)

        updateState({
          username,
          user_id: res.data.user_id,
          error: null,
        })
      })
      .catch(() => {
        updateState({ error: config.MESSAGE.ERROR.SERVER })
      })
  }

  const userLogout = () => {
    socket.disconnect()
    localStorage.removeItem("access_token")
    removeChallenge()
    setState(config.APP_INIT_STATE)
  }

  const setStateUsingCookies = () => {
    if (state.access_token) return

    const access_token = localStorage.getItem("access_token")
    if (!access_token) return

    server
      .get("/auth")
      .then((res) => {
        updateState({
          user_id: res.data.user_id,
          username: res.data.username,
        })
        authSocket(res.data.username, res.data.user_id, access_token)
      })
      .catch(console.log)

    getChallenge()
  }

  const getChallenge = () => {
    const challengeID = localStorage.getItem("challengeID")
    const challengeUser = localStorage.getItem("challengeUser")

    if (challengeID && challengeUser)
      updateState({
        challenge: { user_id: challengeID, username: challengeUser },
      })
  }

  const challengeUser = (id) => {
    socket.emit("challenge", id, (res) => {
      updateState({ message: res })
    })
  }

  const handleIncomingChallenge = (user_id, username) => {
    localStorage.setItem("challengeID", user_id)
    localStorage.setItem("challengeUser", username)
    updateState({ challenge: { user_id, username } })
  }

  const declineChallenge = () => {
    socket.emit("action", "decline", state.challenge.user_id)
    removeChallenge()
  }

  const acceptChallenge = () => {
    socket.emit("accept", state.challenge.user_id, (response) => {
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
  }

  const removeChallenge = () => {
    updateState({ challenge: null })
    localStorage.removeItem("challengeID")
    localStorage.removeItem("challengeUser")
  }

  const gameState = JSON.parse(localStorage.getItem("game"))

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
            state.user_id !== null ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login
                state={state}
                clearError={clearError}
                handleSubmit={handleLogin}
              />
            )
          }
        />

        <Route
          path="/register"
          element={
            state.user_id !== null ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register
                state={state}
                clearError={clearError}
                handleSubmit={userRegister}
              />
            )
          }
        />

        <Route path="/rules" element={<Rules />} />

        <Route
          path="/dashboard"
          element={
            state.user_id === null ? (
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
            state.user_id === null ? (
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
