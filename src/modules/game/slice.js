import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  ready: false,
  active: false,
  activePlayer: null,
  inProgress: false,
  board: null,
  sortByRank: true,
  hand: [],
  selectedCards: [],
  history: [],
  errors: null,
}

export default createSlice({
  name: "game",
  initialState,
  reducers: {
    toggleCardSelection: (state, action) => {
      const card = action.payload
      const index = state.selectedCards.findIndex((c) => c.value === card.value && c.suit === card.suit)
      if (index >= 0) {
        state.selectedCards.splice(index, 1)
      } else {
        state.selectedCards.push(card)
      }
    },
    toggleHandOrder: (state) => {
      state.sortByRank = !state.sortByRank
    },
    clearCardSelection: (state) => {
      state.selectedCards = []
    },
    setReady: (state, action) => {
      state.ready = action.payload
    },
    setGameState: (state, action) => {
      Object.assign(state, action.payload)
    },
    updateGameState: (state, action) => {
      Object.assign(state, action.payload)
    },
    resetGameState: () => initialState,
  },
})
