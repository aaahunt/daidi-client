import { createAction } from "@reduxjs/toolkit"
import slice from "./slice"

export const { receiveMessage } = slice.actions

export const joinRoom = createAction("socket/joinRoom")
export const gamesList = createAction("socket/games")
export const leaveRoom = createAction("socket/leaveRoom")
export const sendMessage = createAction("socket/sendMessage")
export const socketConnected = createAction("socket/connect")
export const socketDisconnected = createAction("socket/disconnect")
