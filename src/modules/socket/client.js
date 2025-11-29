import { io } from "socket.io-client"

import config from "config"
import { getLocalToken } from "modules/authentication/utils"

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(config.URL.SERVER, {
      auth: { token: getLocalToken() },
    })
  }
  return socket
}

export const connectSocket = () => {
  const sock = getSocket()
  if (!sock.connected) {
    sock.connect()
  }
}

export const getConnectedSocket = () => {
  connectSocket()
  return getSocket()
}

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect()
  }
}

export const clearSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket = null
  }
}
