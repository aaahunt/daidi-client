import React from "react"
import io from "socket.io-client"
import { URL } from "../config"

export const socket = io(URL.SERVER, { autoConnect: false })
export const SocketContext = React.createContext()