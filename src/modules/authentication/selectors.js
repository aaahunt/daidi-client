import { createSelector } from "reselect"
import { jwtDecode } from "jwt-decode"

import { appSelector } from "store/rootSelectors"

export const authSelector = createSelector(appSelector, (app) => app.authentication)
export const tokenSelector = createSelector(authSelector, (auth) => auth.token)
export const isAuthenticatedSelector = createSelector(tokenSelector, (token) => !!token)
export const isAuthenticatingSelector = createSelector(authSelector, (auth) => auth.loading)
export const authErrorSelector = createSelector(authSelector, (auth) => auth.error)

export const userSelector = createSelector(tokenSelector, (token) => {
  if (!token) return null
  const decoded = jwtDecode(token)
  console.log(decoded)
  return decoded
})
