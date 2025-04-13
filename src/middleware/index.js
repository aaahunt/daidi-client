import router from "./router"
import saga from "./saga"
import api from "./api"

const middlewareConfig = (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  })
    .concat(router)
    .concat(saga)
    .concat(api)

export default middlewareConfig
