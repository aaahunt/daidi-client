import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { SocketContext, socket } from "./context/socket"

// Styles
import "bootstrap/dist/css/bootstrap.min.css"
import "./style.css"

// Components
import App from "./App"

const container = document.getElementById("root")
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketContext.Provider>
  </React.StrictMode>
)
