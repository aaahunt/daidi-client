import { takeLatest, put } from "redux-saga/effects"

import { gamesList, leaveRoom } from "modules/socket/actions"
import { setRooms } from "modules/app/actions"

export default function* socketSaga() {
  yield takeLatest(gamesList, handleGamesList)
  yield takeLatest(leaveRoom, handleLeaveRoom)
}

function* handleGamesList(action) {
  console.log("handleGamesList", action.payload)
  yield put(setRooms(action.payload))
}

function* handleLeaveRoom(action) {
  console.log("handleLeaveRoom", action.payload)
  yield put(setRooms(action.payload))
}
