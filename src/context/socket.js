import React from "react"
import io from "socket.io-client"
import { URL } from "../config"

export const socket = io(URL.SERVER, {
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
