import slice from "./slice"
import { createAction } from "@reduxjs/toolkit"

export const { setRooms, setConnected } = slice.actions

export const gamesList = createAction("app/games")
export const serverMessage = createAction("app/message")

export const joinRoom = createAction("emit/app/joinRoom")
export const leaveRoom = createAction("emit/app/leaveRoom")
