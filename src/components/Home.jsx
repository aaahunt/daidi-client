import { useHistory } from "react-router-dom"

// Bootstrap Components
import Container from "react-bootstrap/Container"

// Config vars
import { LOGIN_URL, REGISTER_URL } from "../config"

const Home = (props) => {
  const history = useHistory()

  return (
    <Container>
      <section className="d-flex align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
        <div className="d-flex align-items-center flex-column text-center p-3 rounded-0">
          <img src="dai-di-logo.svg" alt="Dai Di" width="340" height="340" />
          <div className="vstack gap-2 col-md-5 mx-auto">
            <button
              onClick={() => history.push(LOGIN_URL)}
              type="button"
              className="btn btn-danger"
            >
              Login
            </button>
            <button
              onClick={() => history.push(REGISTER_URL)}
              type="button"
              className="btn btn-warning"
            >
              Register
            </button>
          </div>
          <hr />
          <h1>The Big Two </h1>
          <p>
            A game created by{" "}
            <a href="http://www.aahunt.co.uk/" target="_blank" rel="noreferrer">
              Ashley Hunt
            </a>{" "}
            using MongoDB, Express, React and NodeJS.
          </p>
        </div>
      </section>
    </Container>
  )
}

export default Home
