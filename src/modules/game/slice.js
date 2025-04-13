import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  ready: false,
}

export default createSlice({
  name: "game",
  initialState,
  reducers: {
    setReady: (state, action) => {
      state.ready = action.payload
    },
  },
})
