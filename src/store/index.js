import { configureStore } from "@reduxjs/toolkit"

import middleware from "middleware"

import { runSagas } from "./sagas"
import rootReducer from "./rootReducer"

export default configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
})

runSagas()
