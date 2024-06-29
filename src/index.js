import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import createStore from "react-auth-kit/createStore"
import AuthProvider from "react-auth-kit"

import { SocketContext, socket } from "./context/socket"

import "bootstrap/dist/css/bootstrap.min.css"
import "./style.css"

import App from "./App"

const container = document.getElementById("root")
const root = createRoot(container)

const store = createStore({
  authName: "_auth",
  authType: "localStorage",
})

root.render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketContext.Provider>
    </AuthProvider>
  </React.StrictMode>
)
