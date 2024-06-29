import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import AuthOutlet from "@auth-kit/react-router/AuthOutlet"

import Home from "./components/pages/Home"
import Rules from "./components/pages/Rules"
import Login from "./components/pages/Login"
import Register from "./components/pages/Register"
import Dashboard from "./components/dashboard/Dashboard"
import Room from "./components/room/Room"
import Navigation from "./components/Navigation"

const config = require("./config")

const App = () => {
  const isAuthenticated = useIsAuthenticated()

  return (
    <React.Fragment>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={config.URL.RULES} element={<Rules />} />

        <Route
          path={config.URL.LOGIN}
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />

        <Route
          path={config.URL.REGISTER}
          element={isAuthenticated ? <Dashboard /> : <Register />}
        />

        <Route element={<AuthOutlet fallbackPath="/login" />}>
          <Route path={config.URL.DASHBOARD} element={<Dashboard />} />
          <Route path={config.URL.ROOM + "/:name"} element={<Room />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </React.Fragment>
  )
}

export default App
