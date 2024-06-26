import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"
import { passwordStrength } from "check-password-strength"
import config from "../../config"

const Register = (props) => {
  const { error } = props.state
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    props.clearError()
  }, [])

  useEffect(() => {
    const strengthResult = passwordStrength(
      password,
      config.PASSWORD_STRENGTH.BOUNDARIES
    )
    setStrength(strengthResult.id)
  }, [password])

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <Container>
      <div className="p-5 mb-4">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Register</h1>
          <Form onSubmit={(e) => props.handleSubmit(e, strength)}>
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
              onChange={handlePasswordChange}
              autoComplete="off"
              required
            />

            <progress id="passwordStrength" value={strength} max="3"></progress>

            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </div>
    </Container>
  )
}

export default Register
