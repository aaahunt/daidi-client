import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  message: "",
  type: "",
}

export default createSlice({
  name: "toast",
  initialState,
  reducers: {
    displayToast: {
      reducer: (state, action) => action.payload,
      prepare: (message, type) => ({
        payload: { message, type },
      }),
    },
    clearToast: () => initialState,
  },
})
