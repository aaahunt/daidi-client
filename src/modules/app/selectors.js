import { appSelector } from "store/rootSelectors"
import { createSelector } from "reselect"

export const appState = createSelector(appSelector, (app) => app.app)

export const roomsSelector = createSelector(appState, (app) => app.rooms)

export const currentRoomSelector = createSelector(appState, (app) => app.currentRoom)

export const selectCurrentRoute = (state) => state.router.location.pathname
