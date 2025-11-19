import { createAction } from "@reduxjs/toolkit"

import config from "config"

import { apiCallPrepareActionBuilder, apiResponsePrepareAction, apiErrorPrepareAction } from "modules/api/actions"
import slice from "./slice"

export const { loginInProgress, loginSuccess, loginFailure, logout } = slice.actions

export const authenticate = createAction("authentication/authenticate")

export const authenticateUserSuccess = createAction("authentication/authenticateApiSuccess", apiResponsePrepareAction)
export const authenticateUserError = createAction("authentication/authenticateApiError", apiErrorPrepareAction)

export const authenticateUserApi = createAction(
  "authentication/authenticateApi",
  apiCallPrepareActionBuilder(
    config.API_ENDPOINTS.LOGIN,
    "POST",
    loginInProgress,
    authenticateUserSuccess,
    authenticateUserError
  )
)
