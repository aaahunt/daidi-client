import { Routes, Route } from "react-router-dom"

import config from "config"

import Home from "components/pages/Home"
import Rules from "components/pages/Rules"
import Login from "components/pages/Login"
import Register from "components/pages/Register"
import Dashboard from "components/dashboard/Dashboard"
import Room from "components/room/Room"
import Navigation from "components/Navigation"
import Toaster from "components/notifications/Toaster"

import "react-toastify/dist/ReactToastify.css"

export default function AppLayout() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route index element={<Home />} />
        <Route path={config.URL.RULES} element={<Rules />} />
        <Route path={config.URL.LOGIN} element={<Login />} />
        <Route path={config.URL.REGISTER} element={<Register />} />
        <Route path={config.URL.DASHBOARD} element={<Dashboard />} />
        <Route path={config.URL.ROOM} element={<Room />} />
      </Routes>
      <Toaster />
    </>
  )
}
