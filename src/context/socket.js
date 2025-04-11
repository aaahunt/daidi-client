import React from "react"
import io from "socket.io-client"

import config from "config"

export const socket = io(config.URL.SERVER, {
  autoConnect: false,
  auth: {
    token: null,
  },
})

export const SocketContext = React.createContext()

export const connectSocket = (auth) => {
  socket.auth.token = auth.includes(" ") ? auth.split(" ")[1] : auth
  socket.connect()
}
