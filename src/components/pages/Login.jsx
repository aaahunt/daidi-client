// Bootstrap Components
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"

const Login = (props) => {
  const { error } = props.state

  return (
    <Container>
      <div className="p-5 mb-4">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Login</h1>
          <Form onSubmit={(e) => props.handleSubmit(e)}>
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
