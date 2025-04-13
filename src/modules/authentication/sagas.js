import { put, takeEvery, fork, delay, take, race } from "redux-saga/effects"
import { push as redirect } from "redux-first-history"

import { connect as connectSocket } from "modules/socket/actions"
import config from "config"

import { loginRequest, loginSuccess, loginFailure, logout, authenticateUserApi } from "./actions"
import { setToken, getToken, removeToken } from "./utils"

export default function* authSaga() {
  yield fork(handleInitialRedirect)
  yield takeEvery(loginRequest, loginWorker)
  yield takeEvery(logout.type, logoutWorker)
}

function* loginWorker(action) {
  try {
    const { username, password } = action.payload

    yield put(authenticateUserApi({ username, password }))

    const result = yield race({
      success: take(loginSuccess),
      failure: take(loginFailure),
    })

    if (result.success) {
      console.log("login success", result.success)
      const { token } = result.success.payload
      if (!token) throw new Error("No token in response")
      setToken(token)
      yield put(redirect(config.URL.DASHBOARD))
      yield put(loginSuccess(token))
      yield put(connectSocket())
    }
    // else if (result.failure) {
    //   yield put(loginFailure(result.failure.payload))
    // } else {
    //   yield put(loginFailure("Login timed out"))
    // }
  } catch (err) {
    yield put(loginFailure(err.response?.data || "Login failed"))
  }
}

function* logoutWorker() {
  removeToken()
  yield put(redirect(config.URL.LOGIN))
}

function* handleInitialRedirect() {
  console.log("handleInitialRedirect")

  yield delay(250)

  const token = getToken()
  if (token) {
    yield handleLoginSuccess(token)
  } else {
    yield put(redirect(config.URL.LOGIN))
  }
}

function* handleLoginSuccess(token) {
  yield put(loginSuccess(token))
  yield put(connectSocket())
  yield put(redirect(config.URL.DASHBOARD))
}
