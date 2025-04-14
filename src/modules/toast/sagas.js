import { put, takeEvery } from "redux-saga/effects"

import { displayToast, notifyUser } from "./actions"

export default function* toastSaga() {
  yield takeEvery(notifyUser, toast)
}

function* toast(action) {
  let type = action.payload.type
  let message = action.payload.message

  yield put(displayToast(message, type))
}
