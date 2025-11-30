import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  ready: false,
  inProgress: false,
  board: null,
  hand: [],
  selectedCards: [],
  history: [],
  errors: [],
  activePlayer: null,
  userSeatNumber: null,
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
