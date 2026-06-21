import slice from "./slice"
import { createAction } from "@reduxjs/toolkit"

export const { setRooms, setConnected, setCurrentRoom } = slice.actions

export const gamesList = createAction("app/games")
export const serverMessage = createAction("app/message")

export const joinRoom = createAction("emit/app/room/join")
export const leaveRoom = createAction("emit/app/room/leave")
export const joinSeat = createAction("emit/app/seat/join")
export const leaveSeat = createAction("emit/app/seat/leave")
export const ready = createAction("emit/app/ready")
