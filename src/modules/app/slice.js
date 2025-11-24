import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  rooms: [],
  connected: false,
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
  },
})
