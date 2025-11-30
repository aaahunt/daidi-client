import { takeLatest, put } from "redux-saga/effects"
import { joinGame, setGameState, gameState } from "./actions"

export default function* userSaga() {
  yield takeLatest(joinGame, handleFetchUser)
  yield takeLatest(gameState, handleGameState)
}

function handleFetchUser() {
  console.log("join game")
}

function* handleGameState(action) {
  console.log("handleStartGame", action.payload)
  yield put(setGameState(action.payload))
}
