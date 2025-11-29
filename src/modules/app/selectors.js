import { appSelector } from "store/rootSelectors"
import { createSelector } from "reselect"

export const appState = createSelector(appSelector, (app) => app.app)

export const roomList = createSelector(appState, (app) => app.rooms)

export const selectCurrentRoute = (state) => state.router.location.pathname
