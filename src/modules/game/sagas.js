import { takeLatest } from "redux-saga/effects"
import { joinGame, startGame } from "./actions"

export default function* userSaga() {
  yield takeLatest(joinGame, handleFetchUser)
  yield takeLatest(startGame, handleStartGame)
}

function handleFetchUser() {
  console.log("join game")
}

function handleStartGame() {
  console.log("handleStartGame")
}
