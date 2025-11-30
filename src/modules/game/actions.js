import { createAction } from "@reduxjs/toolkit"
import slice from "./slice"

export const { setGameState } = slice.actions

export const joinGame = createAction("game/joinGame")
export const gameState = createAction("game/gameState")
export const passTurn = createAction("game/passTurn")
export const playCards = createAction("game/playCards")
