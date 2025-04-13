import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  ready: false,
  rooms: [],
}

export default createSlice({
  name: "app",
  initialState,
  reducers: {
    setReady: (state, action) => {
      state.ready = action.payload
    },
    setRooms: (state, action) => {
      state.rooms = action.payload
    },
  },
})
