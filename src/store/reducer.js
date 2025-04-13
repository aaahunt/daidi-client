import { combineReducers } from "@reduxjs/toolkit"

const sliceContext = require.context("modules", true, /slice\.js$/)

const reducers = sliceContext.keys().reduce((acc, key) => {
  const slice = sliceContext(key)
  const reducer = slice.default

  if (reducer && reducer.name && typeof reducer.reducer === "function") {
    acc[reducer.name] = reducer.reducer
  }

  return acc
}, {})

export default combineReducers(reducers)
