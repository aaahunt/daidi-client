import { put, takeEvery, delay, take, race } from "redux-saga/effects"
import { push as redirect } from "redux-first-history"

import { notifyUser } from "modules/toast/actions"
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
import { storeTokenLocally, unsetLocalToken, validateLocalToken } from "./utils"

export default function* authSaga() {
  yield takeEvery("@@router/LOCATION_CHANGE", handleLocationChange)
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
      if (!token) throw new Error("No token in response")

      storeTokenLocally(token)
      yield put(loginSuccess(token))
      yield put(redirect(config.URL.DASHBOARD))
    } else {
      yield put(loginFailure(result.failure.payload))
    }
  } catch (err) {
    yield put(loginFailure(err.response?.data || "Login failed"))
    yield put(notifyUser("Login failed", "error"))
  }
}

function* logoutWorker() {
  yield delay(10)
  unsetLocalToken()
  yield put(redirect(config.URL.HOME))
}

function* handleLocationChange(action) {
  yield delay(10)

  const user = validateLocalToken()
  const target = action.payload.location.pathname

  console.log("handleLocationChange", target)

  // 1. No token → go to login
  if (!user && target !== config.URL.LOGIN) {
    yield put(redirect(config.URL.LOGIN))
    return
  }

  // 2. If logged in but stuck on login page → go to dashboard
  if (user && (target === config.URL.LOGIN || target === config.URL.HOME)) {
    yield put(redirect(config.URL.DASHBOARD))
    return
  }
}
