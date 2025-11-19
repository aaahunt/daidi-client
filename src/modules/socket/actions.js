import { createAction } from "@reduxjs/toolkit"
import slice from "./slice"

export const { socketConnected, socketDisconnected, receiveMessage } = slice.actions

// socket emits
export const joinRoom = createAction("socket/joinRoom")
export const leaveRoom = createAction("socket/leaveRoom")
export const sendMessage = createAction("socket/sendMessage")
