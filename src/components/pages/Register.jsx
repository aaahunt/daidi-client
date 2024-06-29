import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"
import { passwordStrength } from "check-password-strength"
import config from "../../config"

import server from "../../context/axios"

const Register = (props) => {
  const [alertVariant, setMessageType] = useState("danger")
  const [alertMessage, setMessage] = useState("")
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState(0)

  const showMessage = (message, type) => {
    setMessageType(type)
    setMessage(message)
  }

  const userRegister = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    if (username.length < 3) {
      showMessage(config.MESSAGE.ERROR.USER_SHORT, "danger")
      return
    }

    if (strength < config.PASSWORD_STRENGTH.MIN_STRENGTH) {
      showMessage(config.MESSAGE.ERROR.PASSWORD, "danger")
      return
    }

    setMessage("")

    server
      .post("/register", { username, password })
      .then(showMessage(config.MESSAGE.SUCCESS.REGISTER, "success"))
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          showMessage(config.MESSAGE.ERROR.TAKEN, "danger")
        } else {
          showMessage(config.MESSAGE.ERROR.SERVER, "danger")
        }
      })
  }

  useEffect(() => {
    const strengthResult = passwordStrength(
      password,
      config.PASSWORD_STRENGTH.BOUNDARIES
    )
    setStrength(strengthResult.id)
  }, [password])

  return (
    <Container>
      <div className="p-5 mb-4">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Register</h1>
          <Form onSubmit={(e) => userRegister(e)}>
            <Form.Control
              type="text"
              name="username"
              placeholder="username"
              autoComplete="off"
              required
              className="mb-1"
            />
            <Form.Control
              type="password"
              name="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />

            <progress id="passwordStrength" value={strength} max="3"></progress>

            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>

          {alertMessage && (
            <Alert className="mt-2" variant={alertVariant}>
              {alertMessage}
            </Alert>
          )}
        </div>
      </div>
    </Container>
  )
}

export default Register
