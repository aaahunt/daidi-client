import { createBrowserHistory } from "history"
import { createReduxHistoryContext } from "redux-first-history"

const context = createReduxHistoryContext({
  history: createBrowserHistory(),
})

export const routerMiddleware = context.routerMiddleware
export const routerReducer = context.routerReducer
export const historyFactory = context.createReduxHistory
