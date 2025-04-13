import { createAction } from "@reduxjs/toolkit"
import slice from "./slice"

export const { socketConnected, socketDisconnected, receiveMessage } = slice.actions

export const connectSocket = createAction("socket/connect")
