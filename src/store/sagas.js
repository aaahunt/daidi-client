import { all } from "redux-saga/effects"
import sagaMiddleware from "middleware/saga"

// Create Webpack context for all saga.js files in ./features
const sagaContext = require.context("modules", true, /sagas\.js$/)

export default function* rootSaga() {
  const sagas = sagaContext
    .keys()
    .map((key) => {
      const mod = sagaContext(key)
      return mod.default || Object.values(mod)[0] // handle default or named export
    })
    .filter((sagaFn) => typeof sagaFn === "function")

  yield all(sagas.map((saga) => saga()))
}

export const runSagas = () => sagaMiddleware.run(rootSaga)
