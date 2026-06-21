import { createAction } from "@reduxjs/toolkit"
import slice from "./slice"

export const {
  setGameState,
  updateGameState,
  resetGameState,
  toggleCardSelection,
  clearCardSelection,
  toggleHandOrder,
} = slice.actions

export const quitGame = createAction("game/quit")
export const gameState = createAction("game/state")
export const gameUpdate = createAction("game/update")
export const gameWin = createAction("game/win")
export const gameLose = createAction("game/lose")
export const selectCards = createAction("game/selectCards")

export const playCards = createAction("emit/game/play")
export const passTurn = createAction("emit/game/pass")
