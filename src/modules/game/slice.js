import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  ready: false,
  board: null,
}

export default createSlice({
  name: "game",
  initialState,
  reducers: {
    setReady: (state, action) => {
      state.ready = action.payload
    },
    setGameState: (state, action) => {
      Object.assign(state, action.payload)
    },
  },
})
