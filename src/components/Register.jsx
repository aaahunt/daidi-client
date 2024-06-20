// Bootstrap Components
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"

const Register = (props) => {
  const { error } = props.state

  function checkPasswordStrength() {
    // Get password
    const password = document.getElementById("password").value

    // Define the four regexes that password need to satisfy
    const minLength = new RegExp("^.{8,}$")
    const oneUpper = new RegExp("[A-Z]")
    const oneLower = new RegExp("[a-z]")
    const oneNumber = new RegExp("[0-9]")

    let count = 0

    // Increment counter every time we pass a test
    if (minLength.test(password)) {
      document
        .getElementsByClassName("characters")[0]
        .classList.remove("invalid")
      count++
    }
    if (oneUpper.test(password)) {
      document
        .getElementsByClassName("uppercase")[0]
        .classList.remove("invalid")
      count++
    }
    if (oneLower.test(password)) {
      document
        .getElementsByClassName("lowercase")[0]
        .classList.remove("invalid")
      count++
    }
    if (oneNumber.test(password)) {
      document.getElementsByClassName("number")[0].classList.remove("invalid")
      count++
    }

    document.getElementById("passwordStrength").value = count
  }

  return (
    <Container>
      <div className="p-5 mb-4">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Register</h1>

          <p>Password must contain at least:</p>
          <ul>
            <li className="characters invalid">8 characters</li>
            <li className="uppercase invalid">1 uppercase letter</li>
            <li className="lowercase invalid">1 lowercase letter</li>
            <li className="number invalid">1 number</li>
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
        </div>
      </div>
    </Container>
  )
}

export default Register
