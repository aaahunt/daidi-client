import { put, takeEvery, fork, delay, take, race } from "redux-saga/effects"
import { push as redirect } from "redux-first-history"

import { connectSocket } from "modules/socket/actions"
import config from "config"

import {
  authenticate,
  loginSuccess,
  loginFailure,
  logout,
  authenticateUserApi,
  authenticateUserSuccess,
  authenticateUserError,
} from "./actions"
import { setToken, getToken, removeToken } from "./utils"

export default function* authSaga() {
  yield fork(handleInitialRedirect)
  yield takeEvery(authenticate, loginWorker)
  yield takeEvery(logout.type, logoutWorker)
}

function* loginWorker(action) {
  try {
    const { username, password } = action.payload

    yield put(authenticateUserApi({ username, password }))

    const result = yield race({
      success: take(authenticateUserSuccess),
      failure: take(authenticateUserError),
    })

    if (result.success) {
      const { token } = result.success.payload.data
      console.log("result.success", result.success.payload.data)
      if (!token) throw new Error("No token in response")

      yield handleLoginSuccess(token)
    } else {
      yield put(loginFailure(result.failure.payload))
    }
  } catch (err) {
    yield put(loginFailure(err.response?.data || "Login failed"))
  }
}

function* logoutWorker() {
  yield delay(10)
  removeToken()
  yield put(redirect(config.URL.HOME))
}

function* handleInitialRedirect() {
  yield delay(10)

  const token = getToken()
  if (token) {
    yield handleLoginSuccess(token)
  } else {
    yield put(redirect(config.URL.LOGIN))
  }
}

function* handleLoginSuccess(token) {
  console.log("handleLoginSuccess", token)
  setToken(token)
  yield put(loginSuccess(token))
  yield put(connectSocket())
  yield put(redirect(config.URL.DASHBOARD))
}
