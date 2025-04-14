import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

import { authenticate } from "modules/authentication/actions"
import { isAuthenticatingSelector } from "modules/authentication/selectors"

import config from "config"
import Loading from "components/control/Loading"

export default function Login() {
  const dispatch = useDispatch()
  const loading = useSelector(isAuthenticatingSelector)

  const onSubmit = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    dispatch(authenticate({ username, password }))
  }

  if (loading) {
    return <Loading />
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
            <Button>
              <Link to={config.URL.REGISTER} className="nav-link">
                Register
              </Link>
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  )
}
