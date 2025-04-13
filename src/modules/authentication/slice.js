import { createSlice } from "@reduxjs/toolkit"
import { getToken } from "./utils"

const initialState = {
  token: getToken(),
  loading: false,
  error: null,
}

export default createSlice({
  name: "authentication",
  initialState,
  reducers: {
    loginInProgress: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action) => {
      state.token = action.payload
      state.error = null
    },
    loginFailure: (state, action) => {
      console.log("loginFailure", action)
      state.error = action.payload
    },
    logout: (state) => {
      console.log("logout slice")
      state.token = null
      state.error = null
    },
  },
})
