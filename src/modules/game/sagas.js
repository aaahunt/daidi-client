import { takeLatest } from "redux-saga/effects"
import { joinGame } from "./actions"

export default function* userSaga() {
  yield takeLatest(joinGame, handleFetchUser)
}

function handleFetchUser() {
  console.log("join game")
}
