import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  callInProgress: false,
}

export default createSlice({
  name: "api",
  initialState,
  reducers: {
    apiCallInProgress: (state, action) => {
      state.callInProgress = action.payload
    },
  },
})
