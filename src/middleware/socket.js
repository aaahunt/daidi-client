import { connectSocket, getSocket } from "modules/socket/client"

const socketMiddleware = (config) => {
  let socket = null
  let listenersAreMapped = false

  return (store) => (next) => (action) => {
    if (action.type === config.authEvent && !socket) {
      socket = getSocket()
      connectSocket()

      if (!listenersAreMapped) {
        console.log("mapping listeners")
        config.listeners.forEach((listener) => {
          socket.on(listener.message, (message) => {
            console.log("dispatching", listener.action(message))
            store.dispatch(listener.action(message))
          })
        })

        socket.on("connect", () => {
          console.log("🟢 CONNECTED", socket.id)
        })

        socket.on("disconnect", (reason) => {
          console.log("🔴 DISCONNECTED", reason)
        })

        listenersAreMapped = true
      }
    }

    config.subscribers.forEach((subscriber) => {
      if (action.type === subscriber.action.type) {
        console.log("emitting", subscriber.event, action.payload)
        socket.emit(subscriber.event, action.payload)
        socket.emit("pong", action.payload)
      }
    })

    // if (config.subscribers.includes(action)) {
    //   console.log("emitting", action.type, action.payload)
    //   socket.emit(action.payload)
    // }

    return next(action)
  }
}

export default socketMiddleware
