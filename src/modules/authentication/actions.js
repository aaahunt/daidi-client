import { createAction } from "@reduxjs/toolkit"

import config from "config"

import { apiCallPrepareActionBuilder, apiResponsePrepareAction, apiErrorPrepareAction } from "modules/api/actions"
import slice from "./slice"

export const { loginInProgress, loginSuccess, loginFailure, logout } = slice.actions

export const authenticate = createAction("auth/authenticate")

export const authenticateUserSuccess = createAction("auth/authenticateApiSuccess", apiResponsePrepareAction)
export const authenticateUserError = createAction("auth/authenticateApiError", apiErrorPrepareAction)

export const authenticateUserApi = createAction(
  "auth/authenticateApi",
  apiCallPrepareActionBuilder(
    config.API_ENDPOINTS.LOGIN,
    "POST",
    loginInProgress,
    authenticateUserSuccess,
    authenticateUserError
  )
)
