// Bootstrap Components
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"

import useSignIn from "react-auth-kit/hooks/useSignIn"

import server from "../../context/axios"
import config from "../../config"

const Login = () => {
  const [error, setError] = useState("")
  const signIn = useSignIn()
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    server
      .post("/login", { username, password })
      .then((res) => {
        if (!res.data.access_token) {
          setError(res.data)
          return
        }

        signIn({
          auth: { token: res.data.access_token },
          userState: { user_id: res.data.user_id, username },
        })

        navigate(config.URL.DASHBOARD, {
          state: { token: res.data.access_token },
        })
      })
      .catch(() => {
        setError({ error: config.MESSAGE.ERROR.SERVER })
      })
  }

  return (
    <Container>
      <div className="p-5 mb-4">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Login</h1>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Control
              type="text"
              id="username"
              placeholder="username"
              autoComplete="off"
              required
              className="mb-1"
            />
            <Form.Control
              type="password"
              id="password"
              placeholder="password"
              autoComplete="off"
              required
              className="mb-1"
            />
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </div>
    </Container>
  )
}

export default Login
