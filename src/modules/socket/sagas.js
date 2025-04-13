import { eventChannel } from "redux-saga"
import { call, put, take, takeLatest, fork, select } from "redux-saga/effects"
import io from "socket.io-client"

import { socketConnected, socketDisconnected, receiveMessage, connect } from "./actions"
import { connectedSelector } from "./selectors"

import config from "config"

let socket

function createSocketChannel(socket) {
  return eventChannel((emit) => {
    socket.on("message", (data) => {
      emit({ type: "SOCKET_MESSAGE_RECEIVED", payload: data })
    })

    socket.on("disconnect", () => {
      emit({ type: "SOCKET_DISCONNECTED" })
    })

    return () => {
      socket.off("message")
      socket.off("disconnect")
    }
  })
}

function* handleSocketConnection() {
  console.log("handleSocketConnection")

  const connected = yield select(connectedSelector)
  if (connected) {
    console.log("Already connected. Skipping socket connection.")
    return
  }

  const rawToken = localStorage.getItem("token")
  if (!rawToken) {
    console.warn("No auth token found. Skipping socket connection.")
    return
  }

  const token = rawToken.includes(" ") ? rawToken.split(" ")[1] : rawToken

  socket = io(config.URL.SERVER, {
    autoConnect: false,
    auth: { token },
  })

  socket.connect()

  const channel = yield call(createSocketChannel, socket)

  yield put(socketConnected())

  try {
    while (true) {
      const event = yield take(channel)
      console.log("event", event)
      switch (event.type) {
        case "SOCKET_MESSAGE_RECEIVED":
          yield put(receiveMessage(event.payload))
          break
        case "SOCKET_DISCONNECTED":
          yield put(socketDisconnected())
          break
        default:
          break
      }
    }
  } finally {
    console.log("Socket channel closed")
  }
}

function* watchSocketConnect() {
  yield takeLatest(connect, handleSocketConnection)
}

export default function* socketSaga() {
  yield fork(watchSocketConnect)
}
