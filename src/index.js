import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { SocketContext, socket } from "./context/socket"

//Styles
import "bootstrap/dist/css/bootstrap.min.css"
import "./style.css"

//Components
import App from "./App"

ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SocketContext.Provider>,
  document.getElementById("root")
)
