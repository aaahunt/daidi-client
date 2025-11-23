import { getConnectedSocket } from "modules/socket/client"

import { loginSuccess } from "modules/authentication/actions"

const socketMiddleware = (config) => {
  let socket = null

  return (store) => (next) => (action) => {
    console.log("socket middleware ", action.type)
    if (action.type === loginSuccess.type && !socket) {
      console.log("socket middleware do stuff?", action.type)
      socket = getConnectedSocket()

      const originalOnevent = socket.onevent

      socket.onevent = function (packet) {
        originalOnevent.call(this, packet)

        const type = packet.data[0] // event name
        const payload = packet.data[1] // event data

        console.log(`onevent: socket/${type}`, type, payload)

        store.dispatch({ type: `socket/${type}`, payload })
      }

      if (action.type.startsWith("socket")) {
        console.log("okay we send the event", action.type, action.payload)

        socket.emit(action.type.split("/")[1], action.payload)
      }

      socket.on("connect", () => {
        console.log("🟢 CONNECTED", socket.id)
      })

      socket.on("disconnect", (reason) => {
        console.log("🔴 DISCONNECTED", reason)
      })
    }
    return next(action)
  }
}

export default socketMiddleware
