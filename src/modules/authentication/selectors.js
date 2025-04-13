import { createSelector } from "reselect"
import { appSelector } from "store/rootSelectors"

export const authSelector = createSelector(appSelector, (app) => app.authentication)
export const tokenSelector = createSelector(authSelector, (auth) => auth.token)
export const isAuthenticatedSelector = createSelector(tokenSelector, (token) => !!token)
export const isAuthenticatingSelector = createSelector(authSelector, (auth) => auth.loading)
export const authErrorSelector = createSelector(authSelector, (auth) => auth.error)
