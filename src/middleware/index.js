import router from "./router"
import saga from "./saga"
import api from "./api"
import socketMiddleware from "./socket"

const middlewareConfig = (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  })
    .concat(router)
    .concat(saga)
    .concat(api)
    .concat(socketMiddleware)

export default middlewareConfig
