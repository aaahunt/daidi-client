import { createSlice } from "@reduxjs/toolkit"

export default createSlice({
  name: "socket",
  initialState: {
    connected: false,
    messages: [],
  },
  reducers: {
    socketConnected: (state) => {
      state.connected = true
    },
    socketDisconnected: (state, reason) => {
      state.connected = false
    },
    receiveMessage: (state, action) => {
      state.messages.push(action.payload)
    },
  },
})
