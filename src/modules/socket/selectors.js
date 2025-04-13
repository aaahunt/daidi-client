import { appSelector } from "store/rootSelectors"
import { createSelector } from "reselect"

export const socketSelector = createSelector(appSelector, (app) => app.socket)
export const connectedSelector = createSelector(socketSelector, (socket) => socket.connected)
