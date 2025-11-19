import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  rooms: [],
}

export default createSlice({
  name: "app",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload
    },
  },
})
