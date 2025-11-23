import { takeLatest } from "redux-saga/effects"

import { socketConnected, socketDisconnected } from "modules/socket/actions"

export default function* socketSaga() {
  yield takeLatest(socketConnected, handleSocketConnected)
  yield takeLatest(socketDisconnected, handleSocketDisconnected)
}

function handleSocketConnected(action) {
  console.log("🟢 SAGA CONNECTED", action)
}

function handleSocketDisconnected(action) {
  console.log("🔴 SAGA DISCONNECTED", action)
}
