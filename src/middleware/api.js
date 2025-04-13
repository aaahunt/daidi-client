import axios from "axios"
import { getToken } from "modules/authentication/utils"
import { apiCallInProgress } from "modules/api/actions"

const apiMiddleware = (store) => (next) => (action) => {
  if (!action.payload || !action.payload.apiCall) {
    return next(action)
  }

  const { url, method, data, actions } = action.payload.apiCall

  const token = getToken()
  const headers = {}
  if (token) {
    console.log("adding token", token)
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const requestConfig = {
      url,
      method,
      data,
      headers,
    }

    store.dispatch(apiCallInProgress(true))

    axios
      .request(requestConfig)
      .then((response) => {
        store.dispatch(actions.success(response.data, response.headers, action.payload.context))
      })
      .catch((error) => {
        store.dispatch(actions.error(error, action.payload.context))
      })
      .finally(() => {
        store.dispatch(apiCallInProgress(false))
      })
  } catch (error) {
    console.error("API call error", error)
    store.dispatch(actions.error(error, action.payload.context))
  }

  return next(action)
}

export default apiMiddleware
