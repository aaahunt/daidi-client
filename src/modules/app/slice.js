import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  rooms: [],
}

export default createSlice({
  name: "app",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      console.log("setting rooms", action.payload)
      state.rooms = action.payload
    },
  },
})
