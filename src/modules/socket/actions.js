import { createAction } from "@reduxjs/toolkit"
import slice from "./slice"

export const { socketConnected, socketDisconnected, receiveMessage } = slice.actions

export const connect = createAction("socket/connect")
