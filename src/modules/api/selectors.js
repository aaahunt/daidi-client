import { createSelector } from "reselect"
import { appSelector } from "store/rootSelectors"

export const apiSelector = createSelector(appSelector, (app) => app.api)
export const callInProgressSelector = createSelector(apiSelector, (api) => api.callInProgress)
