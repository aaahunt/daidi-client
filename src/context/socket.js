import React from "react"
import io from "socket.io-client"
import { SERVER_URL } from "../config"

export const socket = io(SERVER_URL, { autoConnect: false })
export const SocketContext = React.createContext()
