import { getConnectedSocket } from "modules/socket/client"

import { loginSuccess } from "modules/authentication/actions"
import { socketConnected, socketDisconnected } from "modules/socket/actions"

let socket = null

const socketMiddleware = (store) => (next) => (action) => {
  // Initialise socket only after login
  if (action.type === loginSuccess.type && !socket) {
    socket = getConnectedSocket()

    const originalOnevent = socket.onevent

    socket.onevent = function (packet) {
      originalOnevent.call(this, packet)

      const type = packet.data[0] // event name
      const payload = packet.data[1] // event data

      console.log("recieved socket event, dispatching", type, payload)
      store.dispatch({ type, payload })
    }

    socket.on("connect", () => {
      store.dispatch(socketConnected())
    })

    socket.on("disconnect", (reason) => {
      store.dispatch(socketDisconnected(reason))
    })
  }

  // If action starts with socket/emit, send to socket.io
  if (socket && action.type.startsWith("emit/")) {
    const emitAction = action.type.split("emit/")[1]
    console.log(`Emitting ${emitAction} to socket.io`)
    socket.emit(emitAction, action.payload)
  }

  return next(action)
}

export default socketMiddleware
