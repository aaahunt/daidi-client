import { eventChannel } from "redux-saga"
import { call, put, take, takeLatest, fork, select, delay, apply } from "redux-saga/effects"
import io from "socket.io-client"
import { push as redirect } from "redux-first-history"

import { getToken } from "modules/authentication/utils"
import { logout } from "modules/authentication/actions"
import { joinRoom, leaveRoom } from "modules/socket/actions"
import { notifyUser } from "modules/toast/actions"

import config from "config"

import { socketConnected, socketDisconnected, receiveMessage } from "./actions"
import { connectedSelector } from "./selectors"

let socket

export default function* socketSaga() {
  yield takeLatest(joinRoom, handleJoinRoom)
  yield takeLatest(leaveRoom, handleLeaveRoom)
}

function* handleJoinRoom(action) {
  if (!socket?.connected) return

  const { room, seat } = action.payload

  const res = yield emitWithAck(socket, "joinRoom", room, seat)

  if (!res.success) {
    yield put(notifyUser(res.message))
  } else {
    console.log("redirecting to /game/{room}")
    yield put(redirect(config.URL.ROOM + "/" + room))
  }
}

function handleLeaveRoom(action) {
  if (!socket?.connected) return
  socket.emit("leaveRoom", action.payload)
}

function emitWithAck(socket, event, ...args) {
  return new Promise((resolve) => {
    socket.emit(event, ...args, (response) => {
      resolve(response)
    })
  })
}
