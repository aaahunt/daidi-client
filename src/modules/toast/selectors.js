import { appSelector } from "store/rootSelectors"
import { createSelector } from "reselect"

export const toastSelector = createSelector(appSelector, (state) => state.toast || { message: "", type: "" })
