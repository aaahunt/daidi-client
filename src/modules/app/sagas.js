import { takeLatest, put } from "redux-saga/effects"
import { push as redirect } from "redux-first-history"

import config from "config"

import { gamesList, leaveRoom, serverMessage } from "modules/app/actions"
import { setRooms } from "modules/app/actions"
import { notifyUser } from "modules/toast/actions"

export default function* socketSaga() {
  yield takeLatest(gamesList, handleGamesList)
  yield takeLatest(leaveRoom, handleLeaveRoom)
  yield takeLatest(serverMessage, handleServerMessage)
}

function* handleGamesList(action) {
  yield put(setRooms(action.payload))
}

function* handleLeaveRoom(action) {
  yield put(redirect(config.URL.DASHBOARD))
}

function* handleServerMessage(action) {
  yield put(notifyUser(action.payload))
}
