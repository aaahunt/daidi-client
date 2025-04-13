import { createAction } from "@reduxjs/toolkit"

import config from "config"

import { apiCallPrepareActionBuilder, apiResponsePrepareAction, apiErrorPrepareAction } from "modules/api/actions"
import slice from "./slice"

export const { loginInProgress, loginSuccess, loginFailure, logout } = slice.actions

export const loginRequest = createAction("authentication/loginRequest")

export const authenticateUserSuccess = createAction("authentication/authenticateUserSuccess", apiResponsePrepareAction)
export const authenticateUserError = createAction("authentication/authenticateUserError", apiErrorPrepareAction)

export const authenticateUserApi = createAction(
  "authentication/authenticateUserApi",
  apiCallPrepareActionBuilder(
    config.API_ENDPOINTS.LOGIN,
    "post",
    loginInProgress,
    authenticateUserSuccess,
    authenticateUserError
  )
)
