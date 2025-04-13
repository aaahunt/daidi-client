import { combineReducers } from "@reduxjs/toolkit"

const sliceContext = require.context("modules", true, /slice\.js$/)

const seenResolvedPaths = new Set()

const reducers = sliceContext.keys().reduce((acc, key) => {
  const resolved = sliceContext.resolve(key)

  if (seenResolvedPaths.has(resolved)) return acc
  seenResolvedPaths.add(resolved)

  const slice = sliceContext(key)
  const reducer = slice.default

  if (reducer && reducer.name && typeof reducer.reducer === "function") {
    acc[reducer.name] = reducer.reducer
  }

  return acc
}, {})

export default combineReducers(reducers)
