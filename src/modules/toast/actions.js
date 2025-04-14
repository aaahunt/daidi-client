import { createAction } from "@reduxjs/toolkit"
import slice from "./slice"

export const notifyUser = createAction("toast/notifyUser", (message, type) => ({ payload: { message, type } }))

export const { displayToast, clearToast } = slice.actions
