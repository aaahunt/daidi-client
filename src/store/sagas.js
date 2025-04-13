import { all } from "redux-saga/effects"
import sagaMiddleware from "middleware/saga"

// Create Webpack context for all saga.js files in ./features
const sagaContext = require.context("modules", true, /sagas\.js$/)

const resolvedSeen = new Set()

const sagas = sagaContext
  .keys()
  .map((key) => {
    const resolved = sagaContext.resolve(key)
    if (resolvedSeen.has(resolved)) return null
    resolvedSeen.add(resolved)

    const mod = sagaContext(key)
    const sagaFn = mod.default || Object.values(mod)[0]
    return sagaFn
  })
  .filter((saga) => typeof saga === "function")

export default function* rootSaga() {
  yield all(sagas.map((saga) => saga()))
}

export const runSagas = () => sagaMiddleware.run(rootSaga)
