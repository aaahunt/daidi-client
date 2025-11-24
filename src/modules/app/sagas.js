import { takeLatest, put } from "redux-saga/effects"

import { gamesList, leaveRoom, joinRoomFailed } from "modules/app/actions"
import { setRooms } from "modules/app/actions"
import { notifyUser } from "modules/toast/actions"

export default function* socketSaga() {
  yield takeLatest(gamesList, handleGamesList)
  yield takeLatest(leaveRoom, handleLeaveRoom)
  yield takeLatest(joinRoomFailed, handleLeaveRoomFailed)
}

function* handleGamesList(action) {
  console.log("handleGamesList", action.payload)
  yield put(setRooms(action.payload))
}

function handleLeaveRoom(action) {
  console.log("handleLeaveRoom", action.payload)
}

function* handleLeaveRoomFailed(action) {
  console.log("handleLeaveRoomFailed", action)
  yield put(notifyUser(action.payload))
}
