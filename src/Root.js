import React from "react"
import { Provider } from "react-redux"
import { Routes, Route } from "react-router-dom"
import { HistoryRouter } from "redux-first-history/rr6"

import store from "store"
import history from "store/history"

import "bootstrap/dist/css/bootstrap.min.css"
import "static/styles/style.css"

import AppLayout from "layouts/AppLayout"

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <HistoryRouter history={history}>
          <Routes>
            <Route path="*" element={<AppLayout />} />
          </Routes>
        </HistoryRouter>
      </Provider>
    )
  }
}

export default Root
