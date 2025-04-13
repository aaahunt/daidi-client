import { combineReducers } from "@reduxjs/toolkit"

import appReducer from "store/reducer"
import { routerReducer } from "store/routerContext"

export default combineReducers({
  router: routerReducer,
  app: appReducer,
})
