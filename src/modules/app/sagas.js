import { takeLatest, put, takeEvery, fork } from "redux-saga/effects"

import { gamesList, serverMessage, joinRoom, setRooms, setCurrentRoom } from "modules/app/actions"
import { notifyUser } from "modules/toast/actions"

export default function* socketSaga() {
  yield takeEvery("@@router/LOCATION_CHANGE", function* (action) {
    const pathname = action.payload.location.pathname

    if (pathname.startsWith("/room/")) {
      yield fork(handleRoomEnter, action)
    }
  })

  yield takeLatest(gamesList, handleGamesList)
  yield takeLatest(serverMessage, handleServerMessage)
}

function* handleGamesList(action) {
  yield put(setRooms(action.payload))
}

function* handleServerMessage(action) {
  yield put(notifyUser(action.payload))
}

function* handleRoomEnter(action) {
  console.log("handleRoomEnter", action.payload.location.pathname)
  const roomId = action.payload.location.pathname.split("/room/")[1]
  yield put(joinRoom(roomId))
  yield put(setCurrentRoom(roomId))
}
