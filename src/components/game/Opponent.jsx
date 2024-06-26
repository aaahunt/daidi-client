import Emoji from "../notifications/Emoji"

// Config vars
import { MESSAGE } from "../../config"

const Opponent = (props) => {
  return (
    <section
      id="opponent"
      className="position-relative bg-dark text-light p-2 pt-md-4 pb-4"
    >
      <h3>
        {props.name}{" "}
        <span className="badge bg-warning text-dark rounded-pill">
          {props.score}
        </span>
      </h3>
      {props.passed && (
        <h1>
          <span
            className="h1 badge bg-light text-dark position-absolute start-50 mt-5 translate-middle shadow "
            style={{ zIndex: 9999, top: 60 }}
          >
            {MESSAGE.PASS}
          </span>
        </h1>
      )}
      <div className="d-flex justify-content-center">
        {renderCards(props.cards)}
      </div>
      {props.emoji && (
        <div className="position-absolute bottom-0 start-50 translate-middle">
          <Emoji
            show={props.emoji !== null}
            header={props.emoji}
            clearMessage={() => props.setEmoji(null)}
          >
            <h3>{props.emoji}</h3>
          </Emoji>
        </div>
      )}
    </section>
  )
}
function renderCards(numCards) {
  var cards = []
  for (var i = 0; i < numCards; i++)
    cards.push(<span className="card opponent-card" key={i}></span>)

  return cards
}
export default Opponent
