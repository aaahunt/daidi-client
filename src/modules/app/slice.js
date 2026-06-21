import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  rooms: [],
  connected: false,
  currentRoom: null,
}

export default createSlice({
  name: "app",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload
    },
  },
})
