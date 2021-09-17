// Bootstrap Components
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"

const Register = (props) => {
  const { error } = props.state

  function checkPasswordStrength() {
    // Grab password
    const password = document.getElementById("password").value

    // Define the four regexes
    const minLength = new RegExp("^\\w{8,}$")
    const oneUpper = new RegExp("[A-Z]")
    const oneLower = new RegExp("[a-z]")
    const oneNumber = new RegExp("[0-9]")

    let count = 0

    // Increment counter every time we pass a test
    if (minLength.test(password)) count++
    if (oneUpper.test(password)) count++
    if (oneLower.test(password)) count++
    if (oneNumber.test(password)) count++

    document.getElementById("passwordStrength").value = count
  }

  return (
    <Container className="mt-3">
      <h1>Register</h1>
      <p>Password must contain at least:</p>
      <ul>
        <li>8 characters</li>
        <li>1 uppercase letter</li>
        <li>1 lowercase letter</li>
        <li>1 number</li>
      </ul>

      <Form onSubmit={(e) => props.handleSubmit(e)}>
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
          onChange={checkPasswordStrength}
          required
        />
        <div>
          <progress
            style={{ width: "100%" }}
            id="passwordStrength"
            value="0"
            max="4"
          ></progress>
        </div>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
    </Container>
  )
}

export default Register
