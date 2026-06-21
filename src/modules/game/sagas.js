import { takeLatest, put } from "redux-saga/effects"
import { push as redirect } from "redux-first-history"

import config from "config"

import { leaveRoom } from "modules/app/actions"
import {
  setGameState,
  resetGameState,
  gameState,
  gameWin,
  quitGame,
  selectCards,
  toggleCardSelection,
  gameUpdate,
  updateGameState,
  playCards,
  clearCardSelection,
} from "./actions"

export default function* userSaga() {
  yield takeLatest(quitGame, handleLeaveRoom)
  yield takeLatest(gameState, handleGameState)
  yield takeLatest(gameUpdate, handleGameUpdate)
  yield takeLatest(gameWin, handleGameWin)
  yield takeLatest(selectCards, handleSelectCards)
  yield takeLatest(playCards, handlePlayCards)
}

function* handleSelectCards(action) {
  yield put(toggleCardSelection(action.payload))
}

function* handleGameState(action) {
  yield put(setGameState(action.payload))
}

function* handleGameUpdate(action) {
  yield put(updateGameState(action.payload))
}

function* handlePlayCards(action) {
  yield put(clearCardSelection())
}

function* handleLeaveRoom(action) {
  yield put(leaveRoom())
  yield put(resetGameState())
  yield put(redirect(config.URL.DASHBOARD))
}

function handleGameWin(action) {
  console.log("game win", action)
}
