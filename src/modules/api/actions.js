import config from "config"
import slice from "./slice"

export const { apiCallInProgress } = slice.actions

export const apiCallPrepareActionBuilder = (endpoint, method, request, success, error) => {
  return (data, context) => {
    return {
      payload: {
        apiCall: {
          url: `${config.URL.SERVER}${endpoint}`,
          method,
          data,
          actions: {
            request,
            success,
            error,
          },
          context,
        },
      },
    }
  }
}

export const apiResponsePrepareAction = (data, headers, context) => {
  return {
    payload: {
      data: Object.assign({}, data),
      headers: Object.assign({}, headers),
      context,
    },
  }
}

export const apiErrorPrepareAction = (error, context) => {
  return {
    payload: {
      error: Object.assign({}, error),
      context,
    },
  }
}
